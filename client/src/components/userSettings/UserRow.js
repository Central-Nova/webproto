import React, { Fragment } from 'react'
import UserRowSwitch from './UserRowSwitch';

const UserRow = ({ role }) => {
  return (
    <Fragment>
    <div className="grid-role-item text-primary text-small">
    <p className="col1">Sales</p>
    <div className="col2">
      <UserRowSwitch/>
    </div>
    <div className="col3">
      <UserRowSwitch/>
    </div>
  </div>
  <hr className="my-1" />
  </Fragment>
  )
}

export default UserRow;
