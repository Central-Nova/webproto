const sanitize = require('mongo-sanitize');

const sanitizeBody = (req, res, next) => {
  console.log('before: ', req.body)
  sanitize(req.body);
  console.log('after: ', req.body)
  next();
}

module.exports = sanitizeBody