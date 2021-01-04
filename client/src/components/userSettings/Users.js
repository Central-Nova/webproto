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
      
      <div class="container-dashboard">
        <div class="container-headline">
          <p class="text-primary text-medium">Users</p>
          <p class="text-primary-light text-small">
            Manage users and their roles.
          </p>
        </div>
        <div class="container-role-fields my-2">
          <div class="form search">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search users by name or email" />
          </div>
          <div class="form email">
            <i class="fas fa-paper-plane"></i>
            <input
              type="text"
              placeholder="Send email invite. Separate emails with a comma."
            />
          </div>
          <button class="btn btn-primary btn-small">Invite</button>
        </div>
        <div class="container-filters my-2">
          <p class="text-small text-primary-light">Filter by:</p>
          <div class="filter-option">
            <i class="fas fa-sitemap"></i>
            <select name="" id="">
              <option value="">Role</option>
              <option value="">Manager</option>
              <option value="">Worker</option>
            </select>
          </div>
          <div class="filter-option">
            <i class="fas fa-briefcase"></i>
            <select name="" id="">
              <option value="">Department</option>
              <option value="">Sales</option>
              <option value="">Products</option>
              <option value="">Inventory</option>
              <option value="">Warehouse</option>
              <option value="">Fleet</option>
              <option value="">Payments</option>
            </select>
          </div>
        </div>
        <div class="container-users-grid">
          <div class="grid-users-headers text-medium text-primary">
            <p>Name</p>
            <p>Email</p>
            <p>Manager</p>
            <p>Worker</p>
          </div>
          <hr class="my-1" />

          {profiles.map((profile) => (
            <UsersRow key={profile._id} profile={profile}/>
          ))}
        </div>
        <Link to="/roles">
        <button className="btn btn-small btn-light my-2">Edit Roles</button>
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
