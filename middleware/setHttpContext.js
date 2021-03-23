const httpContext = require('express-http-context');
const { v4: uuidv4 } = require('uuid');


module.exports = setHttpContext = (req, res, next) => {
  httpContext.set('reqId', uuidv4());
  httpContext.set('reqStartTime', new Date())
  console.log('httpContext: ', httpContext);
  next();
}