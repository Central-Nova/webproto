import React, { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadCompanyUsers, updateUserRoles } from '../../actions/users';

import Spinner from '../layout/Spinner';
import UserRow from './UserRow';

  const initialState = [
    {
      department: 'Sales',
      manager: false,
      worker: false
    },
    {
      department: 'Products',
      manager: false,
      worker: false
    },
    {
      department: 'Warehouse',
      manager: false,
      worker: false
    },
    {
      department: 'Fleet',
      manager: false,
      worker: false
    },
    {
      department: 'Payments',
      manager: false,
      worker: false
    }
  ]

const User = ({ users: { loading, profiles }, loadCompanyUsers, updateUserRoles }) => {

  const [ formState, setFormState ] = useState(initialState)

  const { userId } = useParams();
  
  // Load users and filter for requested user. Then set initialState to user's role.
  useEffect(()=> {
    
    loadCompanyUsers();
    
    if (!loading) {
      const roleData = [...initialState]
      
      let profileToState = profiles.find((profile) => profile._id === userId);

      for (let role in profileToState.roles) {
        roleData[role] = profileToState.roles[role]
      }

      setFormState(roleData);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
    
  }, [loadCompanyUsers, loading, userId])

  // Get user name from url params
  let profileToLoad = {}

  if (!loading && profiles!== null) {
    profileToLoad = profiles.find((profile) => profile._id === userId);
  }

  let { firstName, lastName } = profileToLoad;

  // Toggles the boolean value of worker/manager input
  const handleOnChange = (dept, e) => {
    const newRoles = [...formState]

    for (let role in newRoles) {
      if (newRoles[role].department === dept) {

        newRoles[role] = {...newRoles[role], [e.target.name]: !newRoles[role][e.target.name]}

        setFormState([...newRoles]);
      }
    }
  }

  // Dispatches updateUserRoles: put request to user route
  const handleOnSubmit = (e) => {
    e.preventDefault();
    updateUserRoles(formState,userId);
  }

  return (
  <Fragment>
  {loading ? (
  <Spinner/>
  ) : (
  <div className="container-dashboard">
      <div className="container-headline">
        <p className="text-primary text-large">{`${firstName} ${lastName}`}</p>
        <p className="text-primary-light text-small">
          Manage roles for this user.
        </p>
      </div>
      <div className="container-roleswitches-grid">
        <div className="grid-role-headers text-primary text-regular">
          <p className="col1">Category</p>
          <p className="col2">Manager</p>
          <p className="col3">Worker</p>
        </div>
        <hr className="my-1" />
        {formState.map( (department, id) =>(
          <UserRow key={id} roleData={department} onChange={handleOnChange} />
        ))}
      </div>
      <button onClick={(e) => handleOnSubmit(e)} className="btn btn-small btn-primary btn-back m-2">
        Save
      </button>
      <Link to="/users">
      <button className="btn btn-small btn-light btn-back m-2">
        <i className="fas fa-long-arrow-alt-left"></i>Back
      </button>
      </Link>
    </div>
  )
  }
    </Fragment>
  )
}

User.propTypes = {
  loadCompanyUsers: PropTypes.func.isRequired,
  updateUserRoles: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  users: state.users
})

export default connect(mapStateToProps, { loadCompanyUsers, updateUserRoles })(User);
