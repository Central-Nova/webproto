import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logoutUser } from '../../actions/auth';
import { loadRoles } from '../../actions/roles';

import Spinner from '../layout/Spinner';

const Dashboard = ( { roles, company, loadRoles, logoutUser, auth: {user, loading} } ) => {
  
  const {loading: companyLoading, profile } = company;

    useEffect(()=> {
    if (!companyLoading && profile !==null) {
      loadRoles(profile._id);
    }      
  }, [loadRoles, companyLoading, profile])

  const onClick = (e) => {
    logoutUser();
  }

  console.log(roles)

return (
<Fragment>
    {loading && user === null ? (
    <Spinner/>
    ) : (
    <section className="landing-form-container">
        <i className="logo-landing fas fa-warehouse fa-5x text-primary"></i>
        <h1 className="text-medium">Welcome, {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}!</h1>
        <button className="btn btn-large btn-primary" onClick={()=>onClick()}>Log Out</button>
        <Link className="btn btn-large btn-primary-light mx-2" to='/users'>Users</Link>
        <Link className="btn btn-large btn-primary-light mx-2" to='/company'>Setup</Link>
      </section>
      )}

</Fragment>)

}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  loadRoles: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  roles: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  company: state.company,
  roles: state.roles
})

export default connect(mapStateToProps, { logoutUser, loadRoles })(Dashboard);
