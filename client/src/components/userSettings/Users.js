import React, { Fragment, useEffect } from 'react'
import { connect } from 'react-redux'
import { loadCompanyUsers } from '../../actions/users';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

import UsersRow from './UsersRow';
import Spinner from '../layout/Spinner';

const Users = ({ users, loadCompanyUsers}) => {
  useEffect(()=> {
    loadCompanyUsers();
  },[loadCompanyUsers])

  const { loading, profiles } = users;

  return (
    <Fragment>
    {loading ? (<Spinner/>) : (
      
      <div className="container-dashboard">
        <div className="container-headline">
          <p className="text-primary text-large">Users</p>
          <p className="text-primary-light text-small">
            Manage users and their roles.
          </p>
        </div>
        <div className="container-role-fields my-2">
          <form action="">
            <div className="form-grid">
              <div className="email">
                <input type="text" placeholder="Email" />
              </div>
              <div className="role">
                <select name="" id="">
                  <option value="">--Role--</option>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <button className="btn btn-primary btn-small">Invite</button>
            </div>
          </form>
        </div>
        <div className="container-users-grid">
          <div className="grid-users-headers text-regular">
            <p className="col1 text-primary">Name</p>
            <p className="col2 text-primary">Email</p>
            <p className="col3 text-primary">Manager Roles</p>
          </div>
          <hr className="my-1" />
          {profiles.map((profile) => (
            <UsersRow key={profile._id} profile={profile}/>
          ))}
        </div>
        <Link to="/roles">
        <button className="btn btn-small my-2">Edit Roles</button>
        </Link>
      </div>
    )}
      </Fragment>
  )
}

Users.propTypes = {
  loadCompanyUsers: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  users: state.users
})



export default connect(mapStateToProps, { loadCompanyUsers })(Users);
