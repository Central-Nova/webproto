import React, { Fragment, useEffect, useState } from 'react'
import { Link, useParams, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadCompanyUsers, updateUserRoles } from '../../../actions/users';

import Spinner from '../../layout/Spinner';
import UserRow from './UserRow';
import RoleCheck from '../../layout/auth/RoleCheck';
import HeroHeader from '../../headers/HeroHeader';

  const initialState = [
    {
      _id: 'startid1',
      department: 'Sales',
      manager: false,
      worker: false
    },
    {
      _id: 'startid2',
      department: 'Products',
      manager: false,
      worker: false
    },
    {
      _id: 'startid3',
      department: 'Warehouse',
      manager: false,
      worker: false
    },
    {
      _id: 'startid4',
      department: 'Fleet',
      manager: false,
      worker: false
    },
    {
      _id: 'startid5',
      department: 'Payments',
      manager: false,
      worker: false
    },
    {
      _id: 'startid6',
      department: 'Admin',
      manager: false,
      worker: false
    }
  ]

const User = ({ users: { loading, profiles, updated }, loadCompanyUsers, updateUserRoles }) => {

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

  if (updated) {
    return <Redirect to='/users'/>
  }

  return (
    <Fragment>
      {loading ? (
      <Spinner/>
      ) : (
      <div className="container-dashboard">
        <HeroHeader title={`${firstName} ${lastName}`}
        description='Manage roles for this user' /> 
        <div className="container-roleswitches-grid">
          <div className="grid-role-headers text-primary text-regular">
            <p className="col1">Category</p>
            <p className="col2">Manager</p>
            <p className="col3">Worker</p>
          </div>
          <hr className="my-1" />
          {formState.map(department => (
            <UserRow key={department._id} roleData={department} onChange={handleOnChange} />
          ))}
        </div>
        <RoleCheck department='admin' document='userroles' action='edit'
        yes={()=> (
          <button onClick={(e) => handleOnSubmit(e)} className="btn btn-small btn-primary btn-back m-2">
          Save
        </button>
        )}
        no={()=> null}
        />
        <Link to="/users">
        <button className="btn btn-small btn-light btn-back m-2">
          <i className="fas fa-long-arrow-alt-left"></i>Back
        </button>
        </Link>
      </div>
      )}
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
