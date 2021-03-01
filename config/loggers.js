const { createLogger, format, transports, addColors, stream} = require('winston');
const { combine, timestamp, label, printf } = format;
const httpContext = require('express-http-context')

const myFormat = printf(({ level, message, timestamp }) => {
  let reqId = httpContext.get('reqId');
  return `${timestamp} [${level}] API reqId: ${reqId}: ${message}`;
});


module.exports = apiLogger
 = createLogger({
  level: 'debug',
  levels: {
    error: 0,
    warn: 1,
    notice: 2,
    info: 3,
    debug: 4
  },
  format: combine(
    timestamp(),
    format.colorize(),
    myFormat
  ),
  defaultMeta: {
    service: 'user-service'
  },
  transports: [
    new transports.Console(),
    new transports.File({filename: './logs/api-logs'})
  ]
})

