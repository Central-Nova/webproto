const httpContext = require('express-http-context');
const { v4: uuidv4 } = require('uuid');


module.exports = setReqId = (req, res, next) => {
  httpContext.set('reqId', uuidv4());
  next();
}