const sanitize = require('mongo-sanitize');

const sanitizeReq = (req, res, next) => {
  sanitize(req.body);
  next();
}

module.exports = sanitizeReq