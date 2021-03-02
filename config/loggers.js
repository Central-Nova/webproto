const { createLogger, format, transports, addColors, stream} = require('winston');
const { combine, timestamp, label, printf, metadata, prettyPrint } = format;
const httpContext = require('express-http-context')


const consoleFormat = printf(({ level, message, timestamp }) => {
  let reqId = httpContext.get('reqId');
  return `${timestamp}.[${level}].${reqId}: ${message}`;
});

const fileFormat = format( (info,) => {

  info.reqId = httpContext.get('reqId');
  return info
})

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
    metadata({fillExcept:['message', 'level', 'timestamp']})
  ),
  defaultMeta: {
    service: 'user-service',
  },
  transports: [
    new transports.Console({format: consoleFormat}),
    new transports.File({format: combine(fileFormat(),format.json(), prettyPrint()), filename: './logs/api-logs.json'})
  ]
})