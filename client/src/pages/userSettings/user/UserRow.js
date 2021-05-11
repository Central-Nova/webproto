import React, { Fragment } from 'react'

const UserRow = ({roleData, onChange}) => {
  const { department, manager, worker } = roleData;

  return (
    <Fragment>
      <div className="grid-auto grid-auto-items text-small">
      <p>{`${department}`}</p>
      <div className="option">
        <label className="switch">
          <input name="manager" value={manager} onChange={(e) => onChange(department, e)} type="checkbox" checked={manager} data-testid={`${department}-manager-switch`}/>
          <span className="slider round"></span>
        </label>
      </div>
      <div className="option">
        <label className="switch">
          <input name="worker" value={worker} onChange={(e) => onChange(department, e)} type="checkbox" checked={worker} data-testid={`${department}-worker-switch`}/>
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  </Fragment>
  )
}

export default UserRow;
