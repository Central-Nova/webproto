import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadRoles } from '../../actions/roles';
import { Link, useParams } from 'react-router-dom'

import Spinner from '../layout/Spinner';
import RoleSection from './RoleSection';


const Role = ({ auth, roles, loadRoles}) => {

  useEffect( ()=> {
    loadRoles(auth.user.company)
  }, [loadRoles, auth.user.company])

  const { loading, manager, worker } = roles;

  return (
    <Fragment>
    {loading ? (
      <Spinner/>
    ): (
      <div className="container-dashboard">
        <div className="container-headline">
          <p className="text-primary text-large">Sales Role</p>
          <p className="text-primary-light text-small">
            Customize permissions for manager and worker roles.
          </p>
        </div>
        <RoleSection/>
        <RoleSection/>
        <button className="btn btn-small btn-back my-2">
          <i className="fas fa-long-arrow-alt-left"></i><Link to="roles">Back</Link>
        </button>
      </div>
    )}
    </Fragment>
  )
}

Role.propTypes = {
loadRoles: PropTypes.func.isRequired,
auth: PropTypes.object.isRequired,
roles: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  roles: state.roles,
})



export default connect(mapStateToProps, { loadRoles })(Role);
