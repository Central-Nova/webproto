import React, { Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logoutUser } from '../../actions/auth';
import { loadRoles } from '../../actions/roles';
import { Helmet } from 'react-helmet';

import Spinner from '../layout/Spinner';

const Dashboard = ( { company, logoutUser, auth: {user, loading} } ) => {
  

  const onClick = (e) => {
    logoutUser();
  }

  if (!company.loading) {
    if (company.profile === null) {
      return <Redirect to='/company/'/>
    }
  }

return (
<Fragment>
  <Helmet>
  <title>Helmet Test</title>
  <meta name="description" content="lots of helmet information"/>
  </Helmet>
    {loading && user === null ? (
    <Spinner/>
    ) : (
    <section className="landing-form-container">
        <i className="logo-landing fas fa-warehouse fa-5x text-primary"></i>
        <h1 className="text-medium">Welcome, {user.firstName}!</h1>
        <button className="btn btn-large btn-primary" onClick={()=>onClick()}>Log Out</button>
        <Link to='/users'>
          <button className="btn btn-large btn-light mx-2" >
          Users
          </button>
        </Link>
        <Link to='/company'>
          <button className="btn btn-large btn-light mx-2" >
          Setup
          </button>
        </Link>
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
