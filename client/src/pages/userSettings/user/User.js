import React, { Fragment, useEffect, useState } from 'react'
import { Link, useParams, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadCompanyUsers, updateUserRoles } from '../../../actions/users';

import Spinner from '../../layout/Spinner';
import UserRow from './UserRow';
import RoleCheck from '../../layout/auth/RoleCheck';
import HeroHeader from '../../../components/headers/HeroHeader';

  const initialFormState = [
    {
      _id: 'startid1',
      department: 'Products',
      manager: false,
      worker: false
    },
    {
      _id: 'startid2',
      department: 'Sales',
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

  const initialUserState = {
    firstName: 'User',
    lastName: ''
  }

const User = ({ users: { loading, profiles, updated }, loadCompanyUsers, updateUserRoles }) => {

  const [ formState, setFormState ] = useState(initialFormState)
  const [ userState, setUserState ] = useState(initialUserState)
  const { firstName, lastName } = userState;
  const { userId } = useParams();
  
  // Load users.
  useEffect(()=> {
    loadCompanyUsers();    
  }, [loadCompanyUsers])

  // Filter profiles for userId params. Then set formState to the user's roles.
  useEffect(() => {
    if (!loading && profiles !== null) {      
      let reqProfile = profiles.find((profile) => profile._id === userId);

      // Set roles
      setFormState(reqProfile.roles);

      // Set user name
      setUserState({firstName: reqProfile.firstName, lastName: reqProfile.lastName})
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [loading, userId])

  // Toggles the boolean value of worker/manager input
  const handleOnChange = (dept, e) => {
    const newRoles = [...formState]

    // Loop through roles to find the user toggled department, and toggle the boolean value
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
        <div className="container-role-switches-grid text-primary">
          <div className="grid-auto grid-auto-headers text-regular">
            <p>Category</p>
            <p className="option">Manager</p>
            <p className="option">Worker</p>
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
