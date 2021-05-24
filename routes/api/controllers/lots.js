const Lot = require('../../../models/Lot');
const uniqueKeyHasValue = require('../../../lib/uniqueKeyHasValue');
const apiLogger = require('../../../config/loggers');
const httpContext = require('express-http-context');


const getLots = async (req, res) => {
  apiLogger.debug('User requesting all lot records by company', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })

  let page = parseInt(req.query.page) || 0;
  let limit = parseInt(req.query.limit) || 0;
  let sort = req.query.sort || '';
  let searchArray = req.query.search !== undefined && req.query.search.split(',') || '';
  let searchRegex = searchArray !== '' && searchArray.join('|') || '';

  try {
    
    let queryStartTime = new Date();
    apiLogger.info('Searching db for lots by company', {collection: 'lots',operation: 'read'})

    let lots = await Lot.find({company: req.user.company})
    .sort(sort)
    .skip(page * limit)
    .limit(limit);
    
    if (!lots) {
      apiLogger.debug('No lot records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'No lots found.'}})
    }
    apiLogger.debug('Lot records found', {documents: lots.length, responseTime: `${new Date() - queryStartTime}ms`})

    queryStartTime = new Date();
    apiLogger.info('Searching db for count of lots by company', {collection: 'lots',operation: 'read'})

    let total = await Lot.countDocuments({$and: [{company: req.user.company}, {$or: [{name: {$regex: searchRegex, $options: 'i'}}, {sku: {$regex: searchRegex, $options: 'i'}}]}]}).sort(sort);

    if (!total) {
      apiLogger.debug('No lot records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'No lots found.'}})
    }

    apiLogger.debug('Lot records counted', {documents: total, responseTime: `${new Date() - queryStartTime}ms`})
    
    httpContext.set('resDocs', lots.length);
    apiLogger.debug('Sending lot records by company', {documents: lots.length})

    return res.send({
      total,
      page,
      limit,
      lots
    });
    
    } catch (error) {
      console.log(error);
      return res.status(500).send('Server Error');
  }
}

const getLotById = async (req, res) => {
  apiLogger.debug('User requesting lot record by lot id', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })


  try {
   
    let queryStartTime = new Date();
    apiLogger.info('Searching db for lot by lot id', {collection: 'lots',operation: 'read'})

    let lot = await Lot.findOne({company: req.user.company, _id: req.params.lotId})

    if (!lot) {
      apiLogger.debug('No lot record found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Lot not found.'}})
    }
    apiLogger.debug('Lot record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    httpContext.set('resDocs', 1);
    apiLogger.info('Sending lot record by id', {documents: 1})
    console.log('end');
    return res.send(lot);
    } catch (error) {

      if (error.kind === 'ObjectId') {
        apiLogger.warn('Invalid lot id requested by user')
        return res
        .status(400)
        .json({msg: { title: 'Error', description: 'Lot not found.'}})      
      }

      apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
  }
}

const createLot = async (req,res) => {
  
  apiLogger.debug('User requesting to create new lot record', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })
  
  const { lots } = req.body;

  try {

    for (let lot of lots) {

      // Check for existing company by owner
      let queryStartTime = new Date();
      apiLogger.debug('Searching DB for existing lot code', {collection: 'lots',operation: 'read'})

      let existingLot = await Lot.findOne({lotCode: lot.lotCode})
      
      if (existingLot) {
        apiLogger.debug('Existing lot record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

        return res
        .status(400)
        .json({errors: [{ msg: {title: 'Error', description: 'Lot code is already in use.'}}]})
      }
  
      // Find one and create
      queryStartTime = new Date();
      apiLogger.info('Creating new lot record in db', {collection: 'lots',operation: 'create'})

      const newLot = new Lot({
        company: req.user.company,
        createdBy: req.user._id,
        ...lot
      })
      console.log('newLot: ', newLot)
      await newLot.save();

      apiLogger.info('Lot record created', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    }
    
    return res.status(200).json({msg: { title: 'Success', description: `${lots.length} new lot records created.`} })
    
  } catch (err) {
    console.log(err);
    apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
   
  }

}

const editLot = async (req,res) => {
  
  apiLogger.debug('User requesting to update lot record', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })
  
  const { 
    lots
  } = req.body;
    
    try {

    for (let lot of lots) {
      // Check if lot exists
      let queryStartTime = new Date();
      apiLogger.debug('Searching for lot record in db', {collection: 'lots',operation: 'findOne'})
      
      let currentLot = await Lot.findOne({
        company: req.user.company,
        lotCode: lot.currentLotCode
      });
      if (!currentLot) {
        apiLogger.warn('No lot record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
        return res
        .status(400)
        .json({errors: [{msg: {title: 'Error', description: 'Lot does not exist.'}}]})
      }
      apiLogger.debug('Lot record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
      
      // Check if new lotCode already exists
      queryStartTime = new Date();
      apiLogger.debug('Searching for existing lot record in db', {collection: 'lots',operation: 'findOne'})
  
      let secondLot = await Lot.findOne({
        company: req.user.company,
        lotCode: lot.newLotCode
      });
  
      if (secondLot._id.toString() !== currentLot._id.toString()) {
        apiLogger.warn('Existing lot code found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
        return res
        .status(400)
        .json({errors: [{msg: {title: 'Error', description: 'Lot code is already in use.'}}]})
      }
      apiLogger.debug('Lot code is available to use', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
  
      queryStartTime = new Date();
      apiLogger.info('Updating Lot record in db', {collection: 'lots',operation: 'save'})
  
      currentLot.lotCode = lot.newLotCode;
      currentLot.cost = lot.cost;
      currentLot.dateExpiration = lot.dateExpiration;
      currentLot.dateManufacture = lot.dateManufacture;
      currentLot.save();
  
      apiLogger.info('Lot record updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
    }
      

    return res
    .status(200)
    .json({msg: {title: 'Success', description: 'Lot details have been updated!'}})
    
  } catch (error) {
    console.log(error);
    if (error.kind === 'ObjectId') {
      console.log(error.kind);
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Lot not found.'}})      
    }
    return res.status(500).send('Server Error');
   
  }

}

module.exports = {
    getLots,
    getLotById,
    createLot,
    editLot
}