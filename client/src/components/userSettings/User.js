import React from 'react'
import { Link } from 'react-router-dom'

const User = () => {
  return (
    <div className="container-dashboard">
        <div className="container-headline">
          <p className="text-primary text-large">Dave Johnson</p>
          <p className="text-primary-light text-small">
            Manage roles for this user.
          </p>
        </div>
        <div className="container-roleswitches-grid">
          <div className="grid-role-headers text-primary text-regular">
            <p className="col1">Category</p>
            <p className="col2">Manager</p>
            <p className="col3">Worker</p>
          </div>
          <hr className="my-1" />
          <div className="grid-role-item text-primary text-small">
            <p className="col1">Sales</p>
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
            <p className="col1">Inventory</p>
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
            <p className="col1">Warehouse</p>
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
            <p className="col1">Fleet</p>
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
            <p className="col1">Accounting</p>
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
          <i className="fas fa-long-arrow-alt-left"></i><Link to="users">Back</Link>
        </button>
      </div>
  )
}

export default User;
