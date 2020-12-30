import React, { Fragment } from 'react'

const UserRow = ({roleData, onChange}) => {
  
  const { _id, department, manager, worker } = roleData;

  return (
    <Fragment>
    <div className="grid-role-item text-primary text-small">
    <p className="col1">{`${department}`}</p>
    <div className="col2">
    <label className="switch">
    <input name="manager" value={manager} onChange={(e) => onChange(department, e)} type="checkbox" checked={manager}/>
    <span className="slider round"></span>
  </label>
    </div>
    <div className="col3">
    <label className="switch">
    <input name="worker" value={worker} onChange={(e) => onChange(department, e)} type="checkbox" checked={worker}/>
    <span className="slider round"></span>
  </label>
    </div>
  </div>
  <hr className="my-1" />
  </Fragment>
  )
}

export default UserRow;
