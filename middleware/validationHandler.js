const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {

      // Check input fields for errors
      const errors = validationResult(req);
      console.log('errors: ', errors);
      if (!errors.isEmpty()) {
        return res
        .status(400)
        .json({ errors: errors.array() });
      }
      next();
}
