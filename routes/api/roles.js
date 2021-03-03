const express = require('express');
const router = express.Router();
const actionsBuyer = require('../../lib/actionsBuyer.json');
const actionsSupplier = require('../../lib/actionsSupplier.json');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const authorize = require('../../middleware/authorize');
const { check, validationResult } = require('express-validator')
const apiLogger = require('../../config/loggers');
const httpContext = require('express-http-context');

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

    
    // Check if company ID is valid
    
    let company = await Company.findById(req.user.company);
    
    if (!company) {
      
      return res.status(400).json({msg: { title: 'Error', description: 'Can\'t find role for company.'}})
    }
    
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
        apiLogger.info('Default company roles created', {operation: 'create', documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
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

    console.log('req.params: ', req.params.document)
    
    // Check if company ID is valid
    let company = await Company.findById(req.user.company);

    if (!company) {
      return res.status(400).json({msg: { title: 'Error', description: 'Can\'t find role for company.'}})
    }

    try {

      // Check for existing role by company

      let companyRoles = await Role.findOne({company: req.user.company})
      
      // Filter only roles that match the document param
      filteredPermissions = companyRoles.permissions.filter(role => role.document.replace(' ','').toLowerCase() === req.params.document)

      companyRoles.permissions = filteredPermissions

      console.log('companyRoles: ', companyRoles);

      return res.send(companyRoles);


    } catch (err) {
      console.log(err);
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
  ]],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
      .status(400)
      .json({ msg: { title: 'Error', description: 'Role permissions could not be updated with provided data.' }})
    }

    try {

      let roles = await Role.findOne({company: req.user.company});
      
      console.log('permissions before: ', permissionsData.length);

      if (!roles) {
        return res
          .status(400)
          .json({ errors: [{ msg: {title: 'Error', description: 'Unauthorized user.'} }] });
      }


      for (let i in roles.permissions) {
        for (let j in req.body.permissions) {
          
          if (roles.permissions[i]._id.toString() === req.body.permissions[j]._id.toString()) {
            console.log('permissions before: ', roles.permissions[i]);
            roles.permissions[i] = req.body.permissions[j];
            console.log('permissions after: ', roles.permissions[i]);
          }
        }
      }

      roles.save();

      return res.status(200).json({msg: {title: 'Success!', description: 'Roles have been updated.'}});

    } catch (err) {
      console.log(err);

      return res.status(500).send('Server Error');
      
    }
   
  }
);




module.exports = router;
