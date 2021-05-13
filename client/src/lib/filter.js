export const filterProfiles = (profiles, filters) => {
  // profiles must be an array
  if (!Array.isArray(profiles)) {
      throw new Error('Profiles must be an Array of objects')
    }
  
  // filters must be array
  if (Array.isArray(filters)) {
    if (filters.length === 0) {
      throw new Error('Filters must have at least one object')
    }
   } else { 
     throw new Error('Filters must be an Array of objects')
   }

  let [firstFilter, ...restFilters] = filters
  let { filterName, filterValue } = firstFilter;
  // applies the first filter to profiles
  if (filterName === 'role') {
        // keep profiles that fulfills filter criteria
        let newProfiles = profiles.filter(profile => {
          // check if user has the role criteria in any of the departments
          let canPerform = profile.roles.map(role => {
          if (role[filterValue] === true) {
            return true
          } return false
        })
        return canPerform.includes(true);
      })
      // apply recursion for multiple filters
      if (filters.length > 1) {
          return filterProfiles(newProfiles, restFilters)
      }
      return newProfiles
  } else if (filterName ==='department') {
      let newProfiles = profiles.filter(profile => {
        // keep profiles that fulfills filter criteria
        let canPerform = profile.roles.map(role => {
          // check if user is either manager or worker in desired department
          if (role.department === filterValue && (role.manager === true || role.worker === true)) {
            return true
          } return false
        })
        return canPerform.includes(true);
      })
      // apply recursion for multiple filters
      if (filters.length > 1) {
          return filterProfiles(newProfiles, restFilters)
      }
      return newProfiles
  } else if (filterName === 'search') {
        // keep profiles that fulfills filter criteria
        let newProfiles = profiles.filter(profile => {
          // check if user first name, last name, or email matches search criteria
          return (profile.firstName.toLowerCase().includes(filterValue.toLowerCase()) ||
          profile.lastName.toLowerCase().includes(filterValue.toLowerCase()) ||
          profile.email.toLowerCase().includes(filterValue.toLowerCase()))
      })
      // apply recursion for multiple filters
      if (filters.length > 1) {
          return filterProfiles(newProfiles, restFilters)
      }
      return newProfiles
  }
}

export const filterDepartments = (rolesArray, roleCriteria) => {
  console.log('rolesArray: ', rolesArray)
  console.log('roleCriteria: ', roleCriteria);
  // rolesArray must be an array
  if (!Array.isArray(rolesArray)) {
    throw new Error('Roles must be an Array of objects')
  }

  // roleCriteria must be a string
  if (typeof roleCriteria !== 'string') {
    throw new Error('Criteria must be of type string')
  }
  let departments = []
  rolesArray.forEach(role => {
    if (role[roleCriteria] === true) {
      departments.push(role.department)
    }
  })
  return departments
}