const sanitize = require('mongo-sanitize');

const sanitizeBody = (req, res, next) => {
  sanitize(req.body);
  next();
}

module.exports = sanitizeBody