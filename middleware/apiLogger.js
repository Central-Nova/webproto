const logger = require('../config/loggers');
const httpContext = require('express-http-context');


module.exports = apiLoggerMiddleware = (req, res, next) => {
  logger.info(`***** Incoming ${req.method} Request *****`)
  logger.info(`Requesting Route ${req.originalUrl}`)
  logger.debug(`User agent: ${req.headers['user-agent']}`)
  if(req.params) {

    for (const key in req.params) {
      logger.debug(`param: ${key} = ${req.params[key]}`)
    }
  }

  if(req.query) {

    for (const key in req.query) {
      logger.debug(`query: ${key} = ${req.query[key]}`)
    }
  }
  ;next()

} 