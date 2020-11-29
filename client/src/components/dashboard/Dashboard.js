import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {logoutUser} from '../../actions/auth';

const Dashboard = ( { logoutUser } ) => {

  const onClick = (e) => {
    logoutUser();
  }

  return (
<Fragment>
<section className="landing-form-container">
        <i className="logo fas fa-warehouse fa-5x text-primary"></i>
        <h1 className="text-medium">Welcome</h1>
        <button className="btn btn-large btn-primary" onClick={()=>onClick()}>Log Out</button>
        <Link className="btn btn-large btn-primary-light" to='/users'>Users</Link>
      </section>
</Fragment>
  )
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logoutUser })(Dashboard);
