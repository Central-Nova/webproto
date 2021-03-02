const logger = require('../config/loggers');
const httpContext = require('express-http-context');


module.exports = apiStartLog = (req, res, next) => {
  let metadata = {
    method: req.method,
    route: req.originalUrl,
    userAgent: req.headers['user-agent'],
    user: 'Unauthenticated'
  };

  if (req.user) {
    metadata.user = req.user._id

    if (req.user.company) {
      metadata.company = req.user.company
    }
  }

  logger.info('Incoming Request', metadata)
  // logger.info(`Requesting Route ${req.originalUrl}`, {userAgent: req.headers['user-agent']})
  // logger.debug(`User agent: ${req.headers['user-agent']}`)

  // if(req.params) {

  //   for (const key in req.params) {
  //     logger.debug(`param: ${key} = ${req.params[key]}`)
  //   }
  // }

  // if(req.query) {

  //   for (const key in req.query) {
  //     logger.debug(`query: ${key} = ${req.query[key]}`)
  //   }
  // }
  ;next()

} 