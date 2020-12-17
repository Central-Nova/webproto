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

    let company = await Company.findById(req.params.companyId);

    if (!company) {
      return res.status(400).json({msg: { title: 'Error', description: 'Can\'t find role for company.'}})
    }

    try {

      // Check for existing role by company

      let companyRoles = await Role.findOne({company: req.params.companyId})
      
      if (!companyRoles) {
        let newRolesBuyer = {
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

        for (let e in actionsBuyer) {
      
          let role = actionsBuyer[e]
      
          for (let d in role) {
            let department = role[d];
          
            department.forEach(action => {
              newRolesBuyer[e][d].push(action)
            });
          }
        }

        let newRolesSupplier = {
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

        for (let e in actionsSupplier) {
      
          let role = actionsSupplier[e]
      
          for (let d in role) {
            let department = role[d];
          
            department.forEach(action => {
              newRolesSupplier[e][d].push(action)
            });
          }
        }
  
        companyRoles = new Role({
          company: req.params.companyId,
          buyer: {...newRolesBuyer},
          supplier: {...newRolesSupplier}
        });
  
        console.log('companyRoles: ', companyRoles);
        await companyRoles.save();
  
        return res.status(200).json({msg: {title: 'Success!', description: 'Default company roles have been generated.'}}).send(companyRoles);   
      }

      return res.send(companyRoles);


    } catch (err) {
      console.log(err);
      return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
    }
  }
);



module.exports = router;
