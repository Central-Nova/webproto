import React, { Fragment } from 'react'

const RoleSection = ({ manager, worker }) => {
  return (
    <Fragment>
        <div className="container-roleswitches-grid my-4">
          <div className="grid-role-headers text-primary text-regular">
            <p className="col1">Sales Quotes</p>
            <p className="col2">Manager (Sales)</p>
            <p className="col3">Worker (Sales)</p>
          </div>
          <hr className="my-1" />
          <div className="grid-role-item text-primary text-small">
            <p className="col1">See Sales Quotes</p>
            <div className="col2">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="col3">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <hr className="my-1" />
          <div className="grid-role-item text-primary text-small">
            <p className="col1">Create Sales Quotes</p>
            <div className="col2">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="col3">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <hr className="my-1" />
        </div>
  </Fragment>
  )
}

export default RoleSection