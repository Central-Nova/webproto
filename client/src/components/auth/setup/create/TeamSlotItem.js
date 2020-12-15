import React, {Fragment} from 'react'

const TeamSlotItem = () => {
  return (
    <Fragment>
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
    </Fragment>
  )
}

export default TeamSlotItem