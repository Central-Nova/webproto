const User = require('../models/User')
const Role = require('../models/Role');

module.exports = (department, document, action) => async (req, res, next) =>{

  // Find company permission by all params and return an array of permissions with just one permission object
  const role = await Role.findOne({'company': req.user.company}).select({permissions: {$elemMatch: {department, document, action}}})
  
  const permission = role.permissions.find(p => p.department === department && p.document === document && p.action === action)

  
  // Determine which roles are allowed to perform the action
  const allowedRoles = Object.keys(permission.toJSON()).filter(key=> permission[key] === true)
  
  
  // Find User to get roles
  const user = await User.findById(req.user.id).select('roles -_id');
  
  // Find the given roles of that department
  const relevantRole = user.roles.find(r => r.department === department
  )
    
  // Build an array of boolean based on whether the user has any of the roles that can perform the permission (determined by the company)
  let canPerform = []
  
  for (let [key, value] of Object.entries(relevantRole.toJSON())) {
  if (allowedRoles.includes(key) && value === true) {
    canPerform.push(true)
  }
  }

  if (canPerform.includes(true)) {
    next()  
  } else {
    return res.status(400).json({errors: [{msg: {title: 'Error', description: 'You are not authorized to do that.'}}]})
  }

}