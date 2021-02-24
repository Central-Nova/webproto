const sanitize = require('mongo-sanitize');

const sanitizeReq = (req, res, next) => {
  console.log('before sanitize: ', req.body);
  sanitize(req.body);
  next();
}

module.exports = sanitizeReq