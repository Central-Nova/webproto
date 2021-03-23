const apiLogger = require('../config/loggers');

module.exports = async (req, res, next) => {
 
  if (!req.user) {
    apiLogger.warn('User has not been authenticated')
    return res.status(400).json({msg: {title: 'Error', description: 'You are have not been athenticated.'}})
  }
  apiLogger.debug('User has been authenticated')
  next();

};
