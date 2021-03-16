const Company = require('../models/Company');
const apiLogger = require('../config/loggers');

module.exports = async (req, res, next) => {

  console.log('req.user: ', req.user);

  if (!req.user) {
    apiLogger.warn('User has not been authenticated')
    return res.status(400).json({msg: {title: 'Error', description: 'You are not authorized to do that.'}})
  }
  apiLogger.debug('User has been authenticated')
  next();

};
