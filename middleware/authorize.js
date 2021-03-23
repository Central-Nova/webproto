const User = require('../models/User')
const Role = require('../models/Role');

module.exports = (department, document, action) => async (req, res, next) =>{
  try {
    // Find company permission by all params and return an array of permissions with just one permission object
    let queryStartTime = new Date();
    apiLogger.debug('Searching for role record in db', {collection: 'roles',operation: 'read'})
    const role = await Role.findOne({'company': req.user.company}).select({permissions: {$elemMatch: {department, document, action}}})
    apiLogger.debug('Verified company', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    
    const permission = role.permissions.find(p => p.department === department && p.document === document && p.action === action)
    
    // Determine which roles are allowed to perform the action
    const allowedRoles = Object.keys(permission.toJSON()).filter(key=> permission[key] === true)
    
    
    // Find User to get roles
    queryStartTime = new Date();
    apiLogger.debug('Searching for user record in db', {collection: 'users',operation: 'read'})
    const user = await User.findById(req.user.id).select('roles -_id');
    apiLogger.debug('Verified user', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    
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
      apiLogger.info('User authorized to perform action');
      next()  
    } else {
      apiLogger.warn('User is not authorized to perform action');
      return res.status(400).json({errors: [{msg: {title: 'Error', description: 'You are not authorized to do that.'}}]})
    }
    
  } catch (error) {
    apiLogger.error('Caught error');
    return res.status(500).json({msg: {title: 'Error', description: 'Server Error.'}})
  }


}