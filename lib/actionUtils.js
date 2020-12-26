const actionsBuyer = require('./actionsBuyer.json');

// const getAllPermissions = () => {

//   let permissions = [];

//   // actions.json is broken down by role and departments
//   // first loop through each role
//   for (let e in actions) {

//     let role = actions[e];
//     // then loop through each department
//     for (let d in role) {

//       let department = role[d]

//       // for each permission object in department
//       department.forEach(object => permissions.push(object));

//     }

//   }

//   console.log('permissions: ', permissions)

//   return permissions

// }

const getAllPermissions = () => {

  let newRoles = {
    company: "5fd7b5bdb7ea0c4244d89608",
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

  for (let e in actionsBuyer) {

    let role = actionsBuyer[e]

    for (let d in role) {
      let department = role[d];

      department.forEach(action => {
        newRoles[e][d].push(action)
      });

    }

  }


  return newRoles

}



module.exports.getAllPermissions = getAllPermissions;
