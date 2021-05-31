const apiLogger = require('../config/loggers');
const User = require('../models/users/User');

module.exports = async (req, res, next) => {
 
  if (!req.user) {
    apiLogger.warn('User has not been authenticated')
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'You have not been authenticated.'} }] });
  }

  let queryStartTime = new Date();
  apiLogger.info('Searching db for users by company', {collection: 'users',operation: 'read'})
  
  let user = await User.findById(req.user).select('-local.hash -local.salt')

  if (!user) {
    apiLogger.debug('No user records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'Invalid credentials.'} }] });
  }

  apiLogger.info('User record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

  apiLogger.debug('User has been authenticated')

  next();

};
