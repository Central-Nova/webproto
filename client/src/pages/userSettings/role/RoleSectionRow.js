import React, {Fragment} from 'react'

const RoleSectionRow = ({permission, onChange}) => {

  const {_id, document, action, manager, worker} = permission;

  return (
    <Fragment>
      <div className="grid-auto grid-auto-items text-small">
      <p>{action}</p>
      <div className="option">
        <label className="switch">
          <input name="manager" onChange={(e) => onChange(document,action,e)} type="checkbox" checked={manager} data-testid={`switch-manager-btn-${_id}`}/>
          <span className="slider round"></span>
        </label>
      </div>
      <div className="option">
        <label className="switch">
        <input name="worker" onChange={(e) => onChange(document,action,e)} type="checkbox" checked={worker} data-testid={`switch-worker-btn-${_id}`}/>
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  </Fragment>
  )
}

export default RoleSectionRow;
