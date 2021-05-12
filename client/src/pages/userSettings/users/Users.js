import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

import { loadCompanyUsers } from '../../../actions/users';
import { createInvitations } from '../../../actions/invitations';
import { filterProfiles } from '../../../lib/filter';

// Components
import UsersRow from './UsersRow';
import Spinner from '../../layout/Spinner';
import RoleCheck from '../../layout/auth/RoleCheck';
import EmailInvite from './EmailInvite';
import DropDownFilters from './DropDownFilters';
import SearchBar from './SearchBar';
import HeroHeader from '../../../components/headers/HeroHeader';

const initialState = {
  search: '',
  role: '',
  department: ''
}

const Users = ({ users, invitations: { sent }, loadCompanyUsers, createInvitations}) => {
  const { loading, profiles } = users;

  const [profilesState, setProfilesState] = useState([])

  const [filterState, setFilterState] = useState(initialState)

  const [emailsState, setEmailsState] = useState('')

  const { search } = filterState;

  // Load user profiles
  useEffect(() => {
    loadCompanyUsers();
  }, [])

  // Apply search and filters
  useEffect(() => {
    if (!loading && profiles !== null) {

      // compile filter criteria
      let filters = []
      for (let [key, value] of Object.entries(filterState)) {
        if (value !== '') {
          filters.push({filterName: key,  filterValue: value})
        }
      };
      
      // apply filters if there are filter values
      if (filters.length > 0) {
        let newProfiles = filterProfiles(profiles, filters)
        setProfilesState(newProfiles)
      } else {
        setProfilesState(profiles)
      }
    }
  }, [loading, profiles, filterState])

  useEffect(()=> {
    if (sent) {
      setEmailsState('');
    }
  },[sent])

  const onSearchChange = (e) => { 
    setFilterState({...filterState, [e.target.name]: e.target.value})
  }

  const onEmailChange = (e) => {
    setEmailsState(e.target.value);
  }

  const onEmailSubmit = () => {
    let delimitedEmails = emailsState.split(',');

    let trimmedEmails = delimitedEmails.map(email => email.trim())

    createInvitations({emails: trimmedEmails})
  }

  const onClear = () => {
    setFilterState(initialState);
  }

  return (
    <Fragment>
    {loading ? (<Spinner/>) : (
      
      <div className="container-dashboard">
        <HeroHeader title='Users' description='Manage users and their roles.'/>
        <div className="container-filter-fields my-2">
          <SearchBar onChange={onSearchChange} value={search} />
          <RoleCheck department='admin' document='invitations' action='create' 
          yes={()=> (
            <EmailInvite emailsState={emailsState} onChange={onEmailChange} onSubmit={onEmailSubmit} />
          )}
          no={()=> (null)}/>
        <DropDownFilters onSearchChange={onSearchChange} onClear={onClear} />
        </div>
        <div className="container-users-grid text-primary">
          <div className="grid-auto grid-auto-headers text-regular">
            <p>Name</p>
            <p>Email</p>
            <p>Manager</p>
            <p>Worker</p>
            <RoleCheck department='admin' document='userroles' action='edit'
            yes={()=> (<p className="option">Edit</p>)}
            no={()=>(null)}
            />
          </div>
          <hr className="my-1" />
          {profilesState.length > 0 ? (
            profilesState.map((profile) => (
            <UsersRow key={profile._id} profile={profile}/>
          ))
          ):(
            <p className='text-primary text-small'>No users found...</p>
          )}
        </div>
        <RoleCheck 
          department='admin'
          document='rolepermissions'
          action='edit'
          yes={()=>(
            <Link to="/roles">
              <button className="btn btn-small btn-light my-2">Edit Roles</button>
            </Link>
          )}
          no={() => (null)}
          />
      </div>
    )}
      </Fragment>
  )
}

Users.propTypes = {
  loadCompanyUsers: PropTypes.func.isRequired,
  createInvitations: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
  invitations: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  users: state.users,
  invitations: state.invitations
})



export default connect(mapStateToProps, { loadCompanyUsers, createInvitations })(Users);
