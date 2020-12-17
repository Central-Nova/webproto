const express = require('express');
const router = express.Router();
const actions = require('../../lib/actions.json');

const Role = require('../../models/Role');
const Company = require('../../models/Company');

// @route   GET api/roles
// @desc    Get roles
// @access  public

router.get(
  '/:companyId'
  ,
  async (req, res) => {

    let company = await Company.findOne({company: req.params.companyId});

    if (!company) {
      return res.status(200).json({msg: { title: 'Error', description: 'Can\'t find role for company.'}})
    }

    try {

      // Check for existing role by company

      let companyRoles = await Role.findOne({company: req.params.companyId})
      
      if (!companyRoles) {
        let newRoles = {
          manager: {
            sales: [],
            products: [],
            warehouse: [],
            fleet: [],
            payments: []
          },
          worker: {
            sales: [],
            products: [],
            warehouse: [],
            fleet: [],
            payments: []
          },
        }
      
        for (let e in actions) {
      
          let role = actions[e]
      
          for (let d in role) {
            let department = role[d];
          
            department.forEach(action => {
              newRoles[e][d].push(action)
            });
          }
        }
  
        companyRoles = new Role({
          company: req.params.companyId,
          ...newRoles
        });
  
  
        await companyRoles.save();
  
        return res.status(200).json({msg: {title: 'Success!', description: 'Default company roles have been generated.'}}).send(companyRoles);   
      }

      return res.send(companyRoles);


    } catch (err) {
      return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
    }
  }
);



module.exports = router;
