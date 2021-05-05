import React, { Fragment, useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { createInvitations } from '../../../../actions/invitations';

// Components
import SideNav from '../sidenav/SideNav';
import TeamSlotItem from './TeamSlotItem';
import LargeHeader from '../../components/headers/LargeHeader';
import FieldContainer from '../../components/containers/FieldContainer';

const CreateTeam = ({ createInvitations, invitations: { sent } }) => {

  const  [ formData, setFormData ] = useState({employees:[{email: ''}]})

  const { employees } = formData;

  useEffect(()=> {
    // Clear formData
    if (sent) {
      setFormData({employees: [{email: ''}]})
    }
  },[sent])


  // Start with one slot
  // Add another slot for each additional email the user wants
  const onAdd = (e) => {
    e.preventDefault();

    let newSlot = {email: ''}
    let newEmployees = [...employees, newSlot]
    
    setFormData({employees:newEmployees})
  }
  
  // Loop through formData and if it matches the index of the even slot, then make a change to that email value. Set the new array to formData
  const onChange = (idx,e) => {
    const newEmployees = employees.map( 
      (employee, idy) => {
        if (idy !== idx) {
          return employee
        } return {...employee, [e.target.name]: e.target.value}
      }
    )

    setFormData({employees: newEmployees})
  }

  // Delete slot based on map id
  const onRemove = (idx, e) => {
    e.preventDefault();
    
    const newEmployees = [...employees]
    newEmployees.splice(idx, 1);

    setFormData({employees: newEmployees})
  }

  const onSubmit = (e) => {
    e.preventDefault();
    
    let emails = employees.map(employee => employee.email)

    createInvitations({emails});

  }

  return (
    <Fragment>
    <div className="logo">
      <i className="text-primary fas fa-warehouse fa-4x"></i>
    </div>
    <div className="container-company-double">
      <SideNav/>
      <div className="container-company-main">
        <LargeHeader title='Team Details'/>
          <FieldContainer label='Invite your employees to join your team.'
          description='Roles can be changed and customized later.'>
          <div className="form">
            <form action="">
              <div className="form-grid-emails">
                {employees.map((employee, idx) => (<TeamSlotItem key={idx} index={idx} employee={employee} onRemove={onRemove}onChange={onChange} />))}
              </div>
                <div className="btn-remove">
                  <button onClick={(e) => onAdd(e)} className="btn btn-plus my-1">
                    <div className="circle"><i className="fas fa-plus"></i></div>
                  </button>
                </div>
              <div className="buttons my-1">

              </div>
            </form>
          </div>
          <button onClick={(e) => onSubmit(e)} className="btn btn-small btn-primary my-1">
                  Send 
          </button>
          </FieldContainer>
          <Link to='/'>
          <button className="btn btn-small btn-light my-1">
            Done 
          </button>
          </Link>
      </div>
    </div>
    </Fragment>
  )
}

CreateTeam.propTypes = {
  createInvitations: PropTypes.func.isRequired,
  invitations: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  invitations: state.invitations

})

export default connect(mapStateToProps, { createInvitations })(CreateTeam);
