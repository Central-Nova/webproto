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

  let profileToLoad = {};

  if (!loading && profiles) {
    let profileArray = profiles.filter((profile) => profile._id === userId);
    
    profileToLoad = {...profileArray[0]}
  }

  // Load users and filter for requested user. Then set initialState to user's role.
  useEffect(()=> {
    loadCompanyUsers();

    if (!loading && profiles) {
      const roleData = [...initialState]

      for (let role in profileToLoad.roles) {
        roleData[role] = profileToLoad.roles[role]
      }

      setFormState(roleData);
    }
  }, [loadCompanyUsers, loading])

    const { firstName, lastName } = profileToLoad;
  
    // const handleOnChange = (roleId, e) => {
    //   const newFormState = formState.map( (dept) => {
    //     if (dept._id !== roleId) return dept;
    //     return {...dept, [e.target.name]: !e.target.value }
    //   });
    //   setFormState(newFormState);

    //   console.log('receiving: ', roleId);
    //   console.log('receiving: ', e.target.name);
    //   console.log('receiving: ', !e.target.value);
    //   console.log('formState: ', formState);
    // } 

    const handleOnChange = (dept, e) => {
      const newRoles = [...formState]

      for (let role in newRoles) {
        if (newRoles[role].department === dept) {
          // console.log('receiving: ', dept);
          // console.log('receiving: ', e.target.name);
          // console.log('receiving: ', e.target.checked);
          // console.log('receiving: ', e.target.value);

          console.log('newRoles[role][e.target.name]: ', newRoles[role][e.target.name]);

          // if (newRoles[role][e.target.name] === false){
          //   newRoles[role] = {...newRoles[role], [e.target.name]: true}
          // } 
          // if (newRoles[role][e.target.name] === true){
          //   newRoles[role] = {...newRoles[role], [e.target.name]: false}
          // }

          newRoles[role] = {...newRoles[role], [e.target.name]: !newRoles[role][e.target.name]}
          console.log('newRoles[role][e.target.name]: ', newRoles[role][e.target.name]);
          console.log('newRoles[role]: ', newRoles[role]);

          setFormState([...newRoles]);
        }
      }
    }

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
