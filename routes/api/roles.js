const express = require('express');
const router = express.Router();
const actions = require('../../lib/actions.json');

const Role = require('../../models/Role');

// @route   GET api/roles
// @desc    Get roles
// @access  public

router.get(
  '/:companyId'
  ,
  async (req, res) => {

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
          }
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


// @route   POST api/roles
// @desc    Create Roles
// @access  public

router.post(
  '/'
  ,
  async (req, res) => {

    const { company } = req.body;

    
    try {

      // Check for existing role by company

      let companyRoles = await Role.findOne({company})
      
      if (companyRoles) {
        return res
        .status(400)
        .json({errors: [{ msg: {title: 'Error', description: 'Default company roles already exist.'}}]})
      }

      let newRoles = {
        company: company,
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
        }
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
        company,
        ...newRoles
      });

      console.log('newRoles: ', newRoles);

      await companyRoles.save();

      return res.status(200).json({msg: {title: 'Success!', description: 'Default company roles have been generated.'}})


    } catch (err) {

      // console.log(err);

      return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
    }
  }
);

module.exports = router;
