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



module.exports = router;
