import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { loadCompanyUsers } from '../../actions/users';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

import UsersRow from './UsersRow';
import Spinner from '../layout/Spinner';

const initialState = {
  search: '',
  role: '',
  department: ''
}

const Users = ({ users, loadCompanyUsers}) => {
  const { loading, profiles } = users;

  const [profilesState, setProfilesState] = useState([])

  const [filterState, setFilterState] = useState(initialState)

  const { search, role, department } = filterState;

  // Load profiles into profilesState
  useEffect(()=> {
    loadCompanyUsers();

    // Set state to state.users
    if (!loading && profiles!== null) {
      setProfilesState(profiles);
    }
    
  },[loadCompanyUsers, loading, filterState])

  // Reload profilesState whenever filterState is updated
  useEffect(()=> {

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

  // useEffect(()=> {
  //   if (!loading && profiles!==null) {

  //     if (filterState.search !== '') { 
  //       let filteredProfiles = [...profiles]

  //       // filteredProfiles.forEach( profile=> {
  //       //   console.log('search term: ', filterState.search);
  //       //   console.log(`${profile.firstName}: `, profile.firstName.includes(filterState.search))
  //       // })

  //       filteredProfiles = filteredProfiles.filter(profile => {
  //         return (profile.firstName.toLowerCase().includes(filterState.search.toLowerCase()) || profile.email.toLowerCase().includes(filterState.search.toLowerCase()))
  //       })

  //       console.log('filterdProfiles: ', filteredProfiles);
  //       setProfilesState(filteredProfiles)
  //       console.log('profilesState: ', profilesState);
  //     } else {
  //       setProfilesState(profiles);
  //     }
  //   }
  // }, [loading, filterState])

  const onChange = (e) => { 
    e.preventDefault();
    setFilterState({...filterState, [e.target.name]: e.target.value})

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
        <div className="container-role-fields my-2">
          <div className="form search">
            <i className="fas fa-search"></i>
            <input onChange={(e) => onChange(e)} name='search' value={search} type="text" placeholder="Search users by name or email." />
          </div>
          <div className="form email">
            <i className="fas fa-paper-plane"></i>
            <input
              type="text"
              placeholder="Enter emails separated by a comma."
            />
          </div>
          <button className="btn btn-primary btn-small">Invite</button>
        </div>
        <div className="container-filters my-2">
          <p className="text-small text-primary-light">Filter by:</p>
          <div className="filter-option">
            <i className="fas fa-sitemap"></i>
            <select onChange={(e)=> onChange(e)} name="role" id="">
              <option value="">Role</option>
              <option value="manager">Manager</option>
              <option value="worker">Worker</option>
            </select>
          </div>
          <div className="filter-option">
            <i className="fas fa-briefcase"></i>
            <select onChange={(e)=> onChange(e)} name="department" id="">
              <option value="">Department</option>
              <option value="Sales">Sales</option>
              <option value="Products">Products</option>
              <option value="Inventory">Inventory</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Fleet">Fleet</option>
              <option value="Payments">Payments</option>
            </select>
          </div>
        </div>
        <div className="container-users-grid">
          <div className="grid-users-headers text-medium text-primary">
            <p>Name</p>
            <p>Email</p>
            <p>Manager</p>
            <p>Worker</p>
          </div>
          <hr className="my-1" />

          {profilesState.map((profile) => (
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
