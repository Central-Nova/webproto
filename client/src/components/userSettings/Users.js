import React from 'react'
import { Link } from 'react-router-dom'

const Users = () => {
  return (
    <div className="container-dashboard">
        <div className="container-headline">
          <p className="text-primary text-large">Users</p>
          <p className="text-primary-light text-small">
            Manage users and their roles.
          </p>
        </div>
        <div className="container-role-fields my-2">
          <form action="">
            <div className="form-grid">
              <div className="email">
                <input type="text" placeholder="Email" />
              </div>
              <div className="role">
                <select name="" id="">
                  <option value="">--Role--</option>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <button className="btn btn-primary btn-small">Invite</button>
            </div>
          </form>
        </div>
        <div className="container-users-grid">
          <div className="grid-users-headers text-regular">
            <p className="col1 text-primary">Name</p>
            <p className="col2 text-primary">Email</p>
            <p className="col3 text-primary">Roles</p>
          </div>
          <hr className="my-1" />

          <div className="grid-users-item text-primary text-small">
            <p className="col1">Dave Johnson</p>
            <p className="col2">djohn120@gmail.com</p>
            <p className="col3">Manager</p>
            <Link to="/user" className="col4"><i className="fas fa-ellipsis-h"></i></Link>
          </div>
          <hr className="my-2" />
          <div className="grid-users-item text-primary text-small">
            <p className="col1">Dave Johnson</p>
            <p className="col2">djohn120@gmail.com</p>
            <p className="col3">Manager</p>
            <Link to="/user" className="col4"><i className="fas fa-ellipsis-h"></i></Link>
          </div>
          <hr className="my-2" />
          <div className="grid-users-item text-primary text-small">
            <p className="col1">Mark Robinson</p>
            <p className="col2">mrobins201@gmail.com</p>
            <p className="col3">Manager</p>
            <Link to="/user" className="col4"><i className="fas fa-ellipsis-h"></i></Link>
          </div>
          <hr className="my-2" />
          <div className="grid-users-item text-primary text-small">
            <p className="col1">John Dawson</p>
            <p className="col2">jdaws102@gmail.com</p>
            <p className="col3">Worker</p>
            <Link to="/user" className="col4"><i className="fas fa-ellipsis-h"></i></Link>
          </div>
          <hr className="my-2" />
          <div className="grid-users-item text-primary text-small">
            <p className="col1">Rick Pearson</p>
            <p className="col2">rpears203@gmail.com</p>
            <p className="col3">Worker</p>
            <Link to="/user" className="col4"><i className="fas fa-ellipsis-h"></i></Link>
          </div>
          <hr className="my-2" />
        </div>
        <button className="btn btn-small my-2"><Link to="/roles">Edit Roles</Link></button>
      </div>
  )
}

export default Users;
