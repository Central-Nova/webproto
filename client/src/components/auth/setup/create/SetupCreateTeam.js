import React, { Fragment } from 'react'

const SetupCreateStep4 = () => {
  return (
    <Fragment>
    <div className="logo">
      <i className="text-primary fas fa-warehouse fa-4x"></i>
    </div>
    <div className="container-company-double">
      <div className="side-bar bg-light">
        <div className="side-bar-item item-main">
          <div className="icon-number text-small text-primary bg-white">1</div>
          <p className="text-regular text-success">Business</p>
        </div>
        <div className="side-bar-item">
          <p className="text-regular text-success">Name</p>
        </div>
        <div className="side-bar-item">
          <p className="text-regular text-success">Address</p>
        </div>
        <div className="side-bar-item">
          <p className="text-regular text-success">Contact</p>
        </div>
        <div className="side-bar-item item-main">
          <div className="icon-number text-small text-primary bg-white">2</div>
          <p className="text-regular text-primary">Team</p>
        </div>
      </div>
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
                <div className="employeeTag">
                  <p className="text-regular">Employee</p>
                </div>
                <div className="roleTag">
                  <p className="text-regular">Role</p>
                </div>
                <div className="employee">
                  <input type="text" />
                </div>
                <div className="role">
                  <select name="" id="">
                    <option value="">Assign Role</option>
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
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

export default SetupCreateStep4;
