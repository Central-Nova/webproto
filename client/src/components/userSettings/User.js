import React, { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadCompanyUsers } from '../../actions/users';

import Spinner from '../layout/Spinner';
import UserRow from './UserRow';

const User = ({ users, loadCompanyUsers }) => {
  useEffect(()=> {
    loadCompanyUsers();
  }, [loadCompanyUsers])

  const { userId } = useParams();
  const { loading, profiles } = users;
  
  
  let profileToLoad = {};
  let rolesArray = [];

  if (!loading) {
    let profileArray = profiles.filter((profile) => profile._id === userId);
    
    profileToLoad = {...profileArray[0]}
    rolesArray = [...profileToLoad.roles];
  }
  
  const { firstName, lastName, roles } = profileToLoad;
  
  const [ formState, setFormState ] = useState()

  console.log('formState: ', formState);
 
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
          {rolesArray.map( (role) => (
          <UserRow role={role}/>
          ))}
        </div>
        <button className="btn btn-small btn-back my-2">
          <i className="fas fa-long-arrow-alt-left"></i><Link to="users">Back</Link>
        </button>
      </div>
    )
    }
      </Fragment>
  )
}

User.propTypes = {
  loadCompanyUsers: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  users: state.users
})

export default connect(mapStateToProps, { loadCompanyUsers })(User);
