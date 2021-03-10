const express = require('express');
const router = express.Router();
const actionsBuyer = require('../../lib/actionsBuyer.json');
const actionsSupplier = require('../../lib/actionsSupplier.json');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const authorize = require('../../middleware/authorize');
const { check} = require('express-validator')
const httpContext = require('express-http-context');
const validationHandler = require('../../middleware/validationHandler');

const Role = require('../../models/Role');
const Company = require('../../models/Company');
const { compare } = require('bcryptjs');

// @route   GET api/roles
// @desc    Get roles
// @access  Has company

router.get(
  '/'
  , [userAuth, companyAuth], 
  async (req, res) => {
    apiLogger.debug('Requesting company roles data', {
      body: req.body,
      params: req.params,
      query: req.query
    })

   
    try {
      
      // Check for existing role by company
      
      let queryStartTime = new Date();
      apiLogger.info('Searching db for company roles', {collection: 'roles',operation: 'read'})
      
      let companyRoles = await Role.findOne({company: req.user.company})
      
      if (!companyRoles) {
        apiLogger.warn('No company roles found')
        // Build roles
        let newRoles = company.operation === 'buyer' ? actionsBuyer : actionsSupplier;

        apiLogger.info('Generating default company roles...')
        companyRoles = new Role({
          company: req.user.company,
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
      console.log(err);
      return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
    }
  }
);

// @route   GET api/roles/document/:document
// @desc    Get roles by document type
// @access  Has company

router.get(
  '/document/:document'
  , [userAuth, companyAuth],
  async (req, res) => {

    apiLogger.debug('Requesting company roles data by document type', {
      body: req.body,
      params: req.params,
      query: req.query
    })

    
    try {
      
      // Check for existing role by company
      
      // Check if company ID is valid
      let queryStartTime = new Date();
      apiLogger.info('Searching db for company roles', {collection: 'roles',operation: 'read'})
      let companyRoles = await Role.findOne({company: req.user.company})
      apiLogger.info('Company roles found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

      
      // Filter only roles that match the document param
      filteredPermissions = companyRoles.permissions.filter(role => role.document.replace(' ','').toLowerCase() === req.params.document)

      companyRoles.permissions = filteredPermissions

      httpContext.set('resDocs', 1);
      apiLogger.debug('Sending company roles by document type')
      return res.send(companyRoles);
    } catch (err) {
      console.log(err);
      apiLogger.error('Caught error');
      return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
    }
  }
);


// @route   PUT api/users/company
// @desc    Edit company role permissions
// @access  Has company and has 'Role Permissions':'Edit' permission

router.put(
  '/department/:department', [userAuth, companyAuth, authorize('Admin', 'Role Permissions', 'Edit'),[
    check('permissions.*.department').not().isEmpty(),
    check('permissions.*.document').not().isEmpty(),
    check('permissions.*.action').not().isEmpty(),
    check('permissions.*.manager').not().isEmpty().isBoolean(),    
    check('permissions.*.worker').not().isEmpty().isBoolean(),
  ], validationHandler],
  async (req, res) => {

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


      for (let i in roles.permissions) {
        for (let j in req.body.permissions) {
          
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
      console.log(err);
      apiLogger.error('Caught error');
      return res.status(500).send('Server Error');
      
    }
   
  }
);


module.exports = router;
