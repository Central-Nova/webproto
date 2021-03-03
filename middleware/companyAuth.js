const Company = require('../models/Company');
const apiLogger = require('../config/loggers');

module.exports = async (req, res, next) => {

  if (req.user.company === null || req.user.company === undefined) {
    apiLogger.warn('User is not part of a company')
    return res.status(400).json({msg: {title: 'Error', description: 'You are not part of a company.'}})
  }

  try {
    
    // Check if company exists
    await Company.findById(req.user.company)
    apiLogger.debug('Verified company')

    next();
  } catch (err) {
    apiLogger.error('Caught error')
    return res.status(400).json({msg: {title: 'Error', description: 'Company could not be found.'}})
  }
};
