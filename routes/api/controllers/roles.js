const actionsBuyer = require('../../../lib/actionsBuyer.json');
const actionsSupplier = require('../../../lib/actionsSupplier.json');
const httpContext = require('express-http-context');

const Role = require('../../../models/Role');

const getRoles =  async (req, res) => {
  apiLogger.debug('Requesting company roles data', {
    body: req.body,
    params: req.params,
    query: req.query
  })
 
  try {
    
    // Check for existing role by company
    
    let queryStartTime = new Date();
    apiLogger.info('Searching db for company roles', {collection: 'roles',operation: 'read'})
    
    let userCompany = req.user.company;
    let companyRoles = await Role.findOne({company: userCompany})
    
    if (!companyRoles) {
      apiLogger.warn('No company roles found')
      // Build roles
      let newRoles = userCompany.operation === 'buyer' ? actionsBuyer : actionsSupplier;

      apiLogger.info('Generating default company roles...')
      companyRoles = new Role({
        company: userCompany,
        permissions: [...newRoles] 
      });

      await companyRoles.save();
      apiLogger.info('Default company roles created', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
      return res.status(200).json(companyRoles); 
    }

    httpContext.set('resDocs', 1);
    apiLogger.debug('Sending company roles')

    return res.send(companyRoles);


  } catch (err) {
    apiLogger.error('Caught error')
    return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
  }
}

const getRolesByDocument = async (req, res) => {

  apiLogger.debug('Requesting company roles data by document type', {
    body: req.body,
    params: req.params,
    query: req.query
  })

  console.log(req.params.document)
  
  try {
    
    // Check for existing role by company
    let queryStartTime = new Date();
    apiLogger.info('Searching db for company roles', {collection: 'roles',operation: 'read'})
    let userCompany = req.user.company;
    let companyRoles = await Role.findOne({company: userCompany})
    apiLogger.info('Company roles found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    if (!companyRoles) {
      console.log('undefined roles');
      apiLogger.warn('No company roles found')
      // Build roles
      let newRoles = userCompany.operation === 'buyer' ? actionsBuyer : actionsSupplier;

      apiLogger.info('Generating default company roles...')
      companyRoles = new Role({
        company: userCompany,
        permissions: [...newRoles] 
      });

      await companyRoles.save();
      console.log('save called');
      apiLogger.info('Default company roles created', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
    }
   
    // Filter only roles that match the document param
    filteredPermissions = companyRoles.permissions.filter(role => role.document.replace(' ','').toLowerCase() === req.params.document)

    companyRoles.permissions = filteredPermissions

    httpContext.set('resDocs', 1);
    apiLogger.debug('Sending company roles by document type')
    return res.send(companyRoles);
  } catch (err) {
    apiLogger.error('Caught error');
    return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
  }
}

const editRoles = async (req, res) => {

  apiLogger.debug('Requesting to update company roles data by department type', {
    body: req.body,
    params: req.params,
    query: req.query
  })

  try {

    let queryStartTime = new Date();
    apiLogger.debug('Searching db for company roles', {collection: 'roles',operation: 'read'})
    let roles = await Role.findOne({company: req.user.company});
    apiLogger.debug('Company roles found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
    
    if (!roles) {
      apiLogger.warn('Roles could not be found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})
      return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'Unauthorized user.'} }] });
    }

    //  Loop through role permissions
    for (let i in roles.permissions) {
      // Loop through permissions sent by application in request
      for (let j in req.body.permissions) {
        // If matched by id, then set permission to new value sent from application
        if (roles.permissions[i]._id.toString() === req.body.permissions[j]._id.toString()) {
          roles.permissions[i] = req.body.permissions[j];
        }
      }
    }

    queryStartTime = new Date();
    apiLogger.debug('Updating company roles in DB', {collection: 'roles',operation: 'read'})
    roles.save();
    apiLogger.debug('Company roles updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    return res.status(200).json({msg: {title: 'Success!', description: 'Roles have been updated.'}});

  } catch (err) {
    apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
  }
}

module.exports = {
  getRoles,
  getRolesByDocument,
  editRoles
}