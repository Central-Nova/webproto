const express = require('express');
const router = express.Router();
const actionsBuyer = require('../../lib/actionsBuyer.json');
const actionsSupplier = require('../../lib/actionsSupplier.json');

const Role = require('../../models/Role');
const Company = require('../../models/Company');

// @route   GET api/roles
// @desc    Get roles
// @access  public

router.get(
  '/:companyId'
  ,
  async (req, res) => {
    
    // Check if company ID is valid
    let company = await Company.findById(req.params.companyId);

    if (!company) {
      return res.status(400).json({msg: { title: 'Error', description: 'Can\'t find role for company.'}})
    }

    try {

      // Check for existing role by company

      let companyRoles = await Role.findOne({company: req.params.companyId})
      
      if (!companyRoles) {
        // Build roles
        let newRoles = company.operation === 'buyer' ? actionsBuyer : actionsSupplier;

        // // Loop through roles in actions 
        // for (let e in actions) {
      
        //   let role = actions[e]
          
        //   // Loop through departments in each role
        //   for (let d in role) {
        //     let department = role[d];
          
        //     // Loop through each department's actions and add to new roles
        //     department.forEach(action => {
        //       newRoles[e][d].push(action)
        //     });
        //   }
        // }

 
        companyRoles = new Role({
          company: req.params.companyId,
          permissions: [...newRoles]
        });
  
        console.log('companyRoles: ', companyRoles);
        await companyRoles.save();
  
        return res.status(200).json(companyRoles); 
      }

      return res.send(companyRoles);


    } catch (err) {
      console.log(err);
      return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
    }
  }
);

// @route   PUT api/users/company
// @desc    Add company to user with invitation code
// @access  public

router.put(
  '/department/:department',
  async (req, res) => {

    // Check if provided roles are correct
    let permissionsData = req.body

    // Loop through to make sure it has three keys and validate

    let keysToCheck = ['department', 'document', 'action', 'manager', 'worker']

    console.log('keyToCheck: ', keysToCheck);

    // Data validation
    for (let role in permissionsData) {
      
      // Check if the role object has the 5 required keys
      keysToCheck.forEach( key => {
        if (permissionsData[role].hasOwnProperty(key)) {
          return
        } else {
          console.log('problem key');
        }

      })

      // Check if each department is a string
      if (typeof permissionsData[role].department !== 'string') {
        console.log('problem: ', typeof permissionsData[role].department)
        return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'User roles could not be updated with provided data.'} }] });

      }

      // Check if each department is a string
      if (typeof permissionsData[role].document !== 'string') {
        console.log('problem: ', typeof permissionsData[role].department)
        return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'User roles could not be updated with provided data.'} }] });

      }

      // Check if each department is a string
      if (typeof permissionsData[role].action !== 'string') {
        console.log('problem: ', typeof permissionsData[role].department)
        return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'User roles could not be updated with provided data.'} }] });

      }

      // Check if each manager is boolean
      if (typeof permissionsData[role].manager !== 'boolean') {
        console.log('problem: ', typeof permissionsData[role].manager)

        return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'User roles could not be updated with provided data.'} }] });

      }

      // Check if each worker is boolean
      if (typeof permissionsData[role].worker !== 'boolean') {
        console.log('problem: ', typeof permissionsData[role].worker)

        return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'User roles could not be updated with provided data.'} }] });
    }

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
        for (let j in permissionsData) {
          
          
          if (roles.permissions[i]._id.toString() === permissionsData[j]._id.toString()) {
            console.log('permissions before: ', roles.permissions[i]);
            roles.permissions[i] = permissionsData[j];
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
