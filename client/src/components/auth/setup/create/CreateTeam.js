import React, { Fragment, useState } from 'react'
import SideNav from './sidenav/SideNav';
import TeamSlotItem from './TeamSlotItem';

const CreateTeam = () => {

  const  [ formData, setFormData ] = useState({employees:[{email: ''}]})

  const { employees } = formData;

  console.log('formData: ', formData)

  // Start with one slot
  // Add another slot for each additional email the user wants
  const addSlot = (e) => {
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
    newEmployees.splice(idx);

    setFormData({employees: newEmployees})
  }

  const onSubmit = (e) => {
    e.preventDefault();

    // createInvitation({emails: employees});
  }

  return (
    <Fragment>
    <div className="logo">
      <i className="text-primary fas fa-warehouse fa-4x"></i>
    </div>
    <div className="container-company-double">
      <SideNav/>
      <div className="container-company-main">
        <div className="company-headline-text">
          <h1 className="text-large text-primary">Team Details</h1>
        </div>
        <div className="container-role-field my-4">
          <div className="container-text">
            <p className="text-regular text-primary">
              Invite your employees to join your team.
            </p>
            <p className="text-small text-primary-light">
              Roles can be changed and customized later.
            </p>
          </div>
          <div className="form">
            <form action="">
              <div className="form-grid-emails">
                {employees.map((employee, idx) => (<TeamSlotItem key={idx} index={idx} employee={employee} onRemove={onRemove}onChange={onChange} />))}
              </div>
              <a href="../dashboard/dashboard.html" className="invisible">Next</a>
              <div className="buttons my-1">
                <button onClick={(e)=> addSlot(e)} className="btn btn-small btn-light my-1" type="submit">
                  Add Slot
                </button>
                <button className="btn btn-small btn-primary my-1">
                  Finish 
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </Fragment>
  )
}

export default CreateTeam;
