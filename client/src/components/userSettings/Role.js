import React from 'react'
import { Link } from 'react-router-dom'

const Role = () => {
  return (
<div className="container-dashboard">
        <div className="container-headline">
          <p className="text-primary text-large">Sales Role</p>
          <p className="text-primary-light text-small">
            Customize permissions for manager and worker roles.
          </p>
        </div>

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
        <div className="container-roleswitches-grid">
          <div className="grid-role-headers text-primary text-regular">
            <p className="col1">Sales Orders</p>
            <p className="col2">Manager (Sales)</p>
            <p className="col3">Worker (Sales)</p>
          </div>
          <hr className="my-1" />

          <div className="grid-role-item text-primary text-small">
            <p className="col1">See Sales Orders</p>
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
            <p className="col1">Create Sales Orders</p>
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
            <p className="col1">Delete Sales Orders</p>
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
            <p className="col1">Edit Sales Orders</p>
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
        <button className="btn btn-small btn-back my-2">
          <i className="fas fa-long-arrow-alt-left"></i><Link to="roles">Back</Link>
        </button>
      </div>
  )
}

export default Role;
