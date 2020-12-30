import React, { Fragment, useState } from 'react'
import SideNav from './sidenav/SideNav';
import TeamSlotItem from './TeamSlotItem';

const CreateTeam = () => {

  const  [ formData, setFormData ] = useState({employees:[{employee: ''}]})

  const { employees } = formData;

  console.log('formData: ', formData)

  const addSlot = () => {
    let newSlot = {employee: ''}
    
    setFormData([...formData,newSlot])
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
              <div className="form-grid-roles">
                {employees.forEach(slot => (<TeamSlotItem/>))}
                {/* <TeamSlotItem/> */}

                
              </div>
              <a href="../dashboard/dashboard.html" className="invisible">Next</a>
              <div className="buttons my-1">
                <button className="btn btn-small btn-light my-1" type="submit">
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