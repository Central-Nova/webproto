import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

import { loadCompanyUsers } from '../../../actions/users';
import { createInvitations } from '../../../actions/invitations';

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

  // Reload profilesState whenever filterState is updated
  useEffect(()=> {

    loadCompanyUsers();

    if (!loading && profiles!==null) {


      if (filterState.search !== '' || filterState.department !== '' || filterState.role !== '') {

        let filteredProfiles = [...profiles]
        
        // Filter only by search
        if (filterState.department === '' && filterState.role ==='') {
          // Filter by search 
          filteredProfiles = filteredProfiles.filter(profile => {
            return (profile.firstName.toLowerCase().includes(filterState.search.toLowerCase()) || profile.lastName.toLowerCase().includes(filterState.search.toLowerCase()) || profile.email.toLowerCase().includes(filterState.search.toLowerCase()))
          })
        }

        // For filter by department and role
        if (filterState.department !=='' && filterState.role !== '') {

          filteredProfiles = filteredProfiles.filter(profile =>{
          // Loop through each role item
          let containsRole = profile.roles.map(role => {
            // Check if the user has either worker or manager role in the specified department. If true, then containsRole will have a 'true' value
            if (role.department.toString() === filterState.department) {
                if (role[filterState.role] === true) {
                  return true
                } return false
              }
            })
            // If containsRole has at least one 'true' value, then filter condition will receive 'true', adding profile to filtered array
            return containsRole.includes(true)
          }) 

          // Filter by search 
          filteredProfiles = filteredProfiles.filter(profile => {
          return (profile.firstName.toLowerCase().includes(filterState.search.toLowerCase()) || profile.lastName.toLowerCase().includes(filterState.search.toLowerCase()) || profile.email.toLowerCase().includes(filterState.search.toLowerCase()))
        })

          // Filter by department
        } if (filterState.department !=='' && filterState.role === '') {
          filteredProfiles = filteredProfiles.filter(profile =>{
          let containsRole = profile.roles.map(role => {
            if (role.department.toString() === filterState.department) {
                if (role.manager === true || role.worker === true) {
                  return true
                } return false
              }
            })
            return containsRole.includes(true)
          }) 

          // Filter by search 
          filteredProfiles = filteredProfiles.filter(profile => {
            return (profile.firstName.toLowerCase().includes(filterState.search.toLowerCase()) || profile.lastName.toLowerCase().includes(filterState.search.toLowerCase()) || profile.email.toLowerCase().includes(filterState.search.toLowerCase()))
          })

          // Filter by role
        } if (filterState.department ==='' && filterState.role !== '') {
          filteredProfiles = filteredProfiles.filter(profile =>{
          let containsRole = profile.roles.map(role => {
              if (role[filterState.role] === true) {
                return true
              } return false
              
            })
            return containsRole.includes(true)
          }) 

          // Filter by search 
          filteredProfiles = filteredProfiles.filter(profile => {
            return (profile.firstName.toLowerCase().includes(filterState.search.toLowerCase()) || profile.lastName.toLowerCase().includes(filterState.search.toLowerCase()) || profile.email.toLowerCase().includes(filterState.search.toLowerCase()))
          })
        } 

        // Set profiles after filters applied
        setProfilesState(filteredProfiles);
      } else {
        // If no filters applied, then show all profiles
        setProfilesState(profiles);
      }

    }


  }, [loading, filterState])

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
            yes={()=> (<p class="option">Edit</p>)}
            no={()=>(null)}
            />
          </div>
          <hr className="my-1" />
          {profilesState.map((profile) => (
            <UsersRow key={profile._id} profile={profile}/>
          ))}
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
