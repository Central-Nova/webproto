import React, {Fragment} from 'react'

const RoleSectionRow = ({permission, onChange}) => {

  const {document, action, manager, worker} = permission;

  return (
    <Fragment>
      <div className="grid-role-item text-primary text-small">
      <p className="col1">{action}</p>
      <div className="col2">
        <label className="switch">
          <input name="manager" onChange={(e) => onChange(document,action,e)} type="checkbox" checked={manager} />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="col3">
        <label className="switch">
        <input name="worker" onChange={(e) => onChange(document,action,e)} type="checkbox" checked={worker} />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
    <hr className="my-1" />
  </Fragment>
  )
}

export default RoleSectionRow;
