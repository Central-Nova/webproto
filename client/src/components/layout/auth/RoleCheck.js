import React, { useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadRoles } from '../../../actions/roles';
import PropTypes from 'prop-types';

const check = (userRoles, companyRoles, department, document, action ) => {

  let canPerform = []

  // Get user's granted roles for that department
  let role = userRoles.filter(role => role.department.toLowerCase() === department)

  // Find the permission object that has the correct department, document and action
  const permission = companyRoles.rolesData.permissions.find(p => 
    p.department.toLowerCase() === department && 
    p.document.replace(' ', '').toLowerCase() === document &&
    p.action.toLowerCase() === action
    )
  
  // Get the roles that are true (can perform action)
  let allowedRoles = Object.keys(permission).filter(key => permission[key] === true)
  
  // Find the given roles of that department
  const relevantRole = userRoles.find(r => 
    r.department.toLowerCase() === department
    )
  
  // Build an array of boolean based on whether the user has any of the roles that can perform the permission (determined by the company)
  for (let [key, value] of Object.entries(relevantRole)) {
    if (allowedRoles.includes(key) && value === true) {
      canPerform.push(true)
    }
  }

  // Return true or false if the user can perform the action
  return canPerform.includes(true);
}

const RoleCheck = ({yes, no, department, document, action, companyRoles, auth, loadRoles}) => {
  
  const { user: { roles: userRoles } } = auth;

  useEffect(() => {
    loadRoles();
  }, [])
  
  return (
    <Fragment>
    {!auth.loading && !companyRoles.loading && check(userRoles, companyRoles, department, document, action) ? yes() : no()}
    </Fragment>
  )

}

RoleCheck.propTypes = {
  loadRoles: PropTypes.func.isRequired,
  companyRoles: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  companyRoles: state.roles,
  auth: state.auth
})

export default connect(mapStateToProps, { loadRoles })(RoleCheck)
