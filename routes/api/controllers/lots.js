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

    let lots = await Lot.find({
      $and: [{company: req.user.company}, {
        $and: [{
          name: {$regex: searchRegex, $options: 'i'}}, {
            sku: {$regex: searchRegex, $options: 'i'}}]}]})
            .sort(sort).skip(page * limit).limit(limit);
    
   
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

    let lot = await Lot.findOne({company: req.user.company,_id: req.params.lotId})

    if (!lot) {
      console.log('no lot');
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
  
  const { 
    lots
  } = req.body;

  
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
      ueryStartTime = new Date();
      apiLogger.info('Creating new lot record in db', {collection: 'lots',operation: 'create'})

      const newLot = new Lot({
        company: req.user.company,
        createdBy: req.user._id,
        ...lot
      })
  
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
    sku, 
    name, 
    description,
    basePrice,
    priceRules,
    dimensions,
    weight,
    color,
    primaryMaterial,

  } = req.body;

    let priceRulesError = [];

    priceRules.forEach(rule => { 
      if (rule.unit !== basePrice.unit) {
        priceRulesError.push(true)
      }
    })

    if (priceRulesError.includes(true)) {
      apiLogger.warn('Price rules unit name does not match')

      return res
      .status(400)
      .json({ msg: {title: 'Error', description: 'This lot does not use that unit.'}})
    }
    
    try {
      
    // Check if lot exists
    let queryStartTime = new Date();
    apiLogger.debug('Searching for lot record in db', {collection: 'lots',operation: 'update'})

    let lot = await Lot.findOne({
      company: req.user.company,
      _id: req.params.productId
    });
    console.log('lot: ', lot);
    if (!lot) {
      apiLogger.warn('No lot record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
      return res
      .status(400)
      .json({errors: [{msg: {title: 'Error', description: 'Lot does not exist.'}}]})
    }
    apiLogger.debug('Lot record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
    
    queryStartTime = new Date();
    apiLogger.info('Updating Lot record in db', {collection: 'lots',operation: 'update'})
    await Lot.findOneAndUpdate({sku, 
      name, 
      description,
      basePrice,
      priceRules,
      dimensions,
      weight,
      color,
      primaryMaterial,
      lastEdited: Date.now(),
      lastEditedBy: req.user._id,})

      apiLogger.info('Lot record updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    return res
    .status(200)
    .json({msg: {title: 'Success', description: 'Lot details have been updated!'}})
    
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Product not found.'}})      
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