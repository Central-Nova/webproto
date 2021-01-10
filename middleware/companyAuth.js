const Company = require('../models/Company');

module.exports = async (req, res, next) => {

  if (req.user.company === null || req.user.company === undefined) {
    return res.status(400).json({msg: {title: 'Error', description: 'You are not part of a company.'}})
  }


  if (!req.user.company) {
    return res.status(400).json({msg: {title: 'Error', description: 'You are not part of a company.'}})
  }

  try {
    
    // Check if company exists
    await Company.findById(req.user.company)

    next();
  } catch (err) {
    return res.status(400).json({msg: {title: 'Error', description: 'Company could not be found.'}})
  }
};
