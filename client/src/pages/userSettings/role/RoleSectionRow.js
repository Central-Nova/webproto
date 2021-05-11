import React, {Fragment} from 'react'

const RoleSectionRow = ({permission, onChange}) => {

  const {document, action, manager, worker} = permission;

  return (
    <Fragment>
      <div className="grid-auto grid-auto-items text-small">
      <p>{action}</p>
      <div className="option">
        <label className="switch">
          <input name="manager" onChange={(e) => onChange(document,action,e)} type="checkbox" checked={manager} />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="option">
        <label className="switch">
        <input name="worker" onChange={(e) => onChange(document,action,e)} type="checkbox" checked={worker} />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  </Fragment>
  )
}

export default RoleSectionRow;
