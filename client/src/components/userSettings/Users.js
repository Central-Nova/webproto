import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

import { loadCompanyUsers } from '../../actions/users';
import { createInvitations } from '../../actions/invitations';

import UsersRow from './UsersRow';
import Spinner from '../layout/Spinner';
import RoleCheck from '../layout/auth/RoleCheck';

const initialState = {
  search: '',
  role: '',
  department: ''
}

const Users = ({ users, invitations: { sent }, loadCompanyUsers, createInvitations}) => {
  const { loading, profiles, updated } = users;

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
        <div className="container-headline">
          <p className="text-primary text-medium">Users</p>
          <p className="text-primary-light text-small">
            Manage users and their roles.
          </p>
        </div>
        <div className="container-filter-fields my-2">
          <div className="form search">
            <i className="fas fa-search"></i>
            <input onChange={(e) => onSearchChange(e)} name='search' value={search} type="text" placeholder="Search users by name or email." />
          </div>
          <RoleCheck department='admin' document='invitations' action='create' 
          yes={()=> (
            <Fragment>
              <div className="form grid-invite">
                <div className="form email">
                  <i className="fas fa-paper-plane"></i>
                  <input
                    onChange={(e)=> onEmailChange(e)}
                    value={emailsState}
                    type="text"
                    placeholder="Enter emails separated by a comma."
                  />
                </div>
                <div className="">
                <button onClick={() => onEmailSubmit()} className="btn btn-primary btn-small">Invite</button>
                </div>
              </div>
              <div className=""></div>
            </Fragment>
          )}
          no={()=> (null)}
           />
          <div className="container-filters">
            <p className="text-small text-primary-light">Filter by:</p>
            <div className="filter-option">
              <i className="fas fa-sitemap"></i>
              <select onChange={(e)=> onSearchChange(e)} name="role" id="">
                <option value="">Role</option>
                <option value="manager">Manager</option>
                <option value="worker">Worker</option>
              </select>
            </div>
            <div className="filter-option">
              <i className="fas fa-briefcase"></i>
              <select onChange={(e)=> onSearchChange(e)} name="department" id="">
                <option value="">Department</option>
                <option value="Sales">Sales</option>
                <option value="Products">Products</option>
                <option value="Inventory">Inventory</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Fleet">Fleet</option>
                <option value="Payments">Payments</option>
              </select>
            </div>
            <div className="">
              <button onClick={()=> onClear()} className="btn btn-tiny btn-light">Clear</button>
            </div>
          </div>
        </div>
        <div className="container-users-grid">
          <div className="grid-users-headers text-regular text-primary">
            <p>Name</p>
            <p>Email</p>
            <p>Manager</p>
            <p>Worker</p>
            <RoleCheck department='admin' document='userroles' action='edit'
            yes={()=> (<p>Edit</p>)}
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
