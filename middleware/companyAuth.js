const Company = require('../models/Company');
const apiLogger = require('../config/loggers');

module.exports = async (req, res, next) => {

  if (req.user.company === null || req.user.company === undefined) {
    apiLogger.warn('User is not part of a company')
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'You are not part of a company.'} }] });
  }

  try {
    
    // Check if product exists
    let queryStartTime = new Date();
    apiLogger.debug('Searching for company record in db', {collection: 'companies',operation: 'read'})
    
    let company = await Company.findById(req.user.company)
    apiLogger.debug('Verified company')

    if (!company) {
      apiLogger.warn('No product record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`}) 

      return res.status(400).json({msg: {title: 'Error', description: 'Company could not be found.'}})
    }
    apiLogger.info('Company record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})


    next();
  } catch (err) {
    apiLogger.error('Caught error')
    return res.status(500).json({msg: {title: 'Error', description: 'Server Error.'}})
  }
};
