const httpContext = require('express-http-context');
const apiLogger = require('../config/loggers');

module.exports = (req, res, next) => {
  res.on('finish', () => {
    let start = httpContext.get('reqStartTime');
    apiLogger.info('Sending Response', {
      statusCode: res.statusCode,
      responseTime: `${new Date() - start}ms`,
      documents: httpContext.get('resDocs') || 0
    })
  });
  next();
}