import React, { Fragment } from 'react'
import RoleSectionRow from './RoleSectionRow'

const RoleSection = ({ permissions, onChange }) => {
  let documentType = permissions[0].document

  return (
    <Fragment>
        <div className="container-role-switches-grid text-primary my-4">
          <div className="grid-auto grid-auto-headers text-regular">
            <p>{documentType}</p>
            <p className="option">Manager</p>
            <p className="option">Worker</p>
          </div>
          <hr className="my-1" />
          {
            permissions.map((permission,id) => (
              <RoleSectionRow key={id} permission={permission} onChange={onChange}/>
            ))
          }
        </div>
  </Fragment>
  )
}

export default RoleSection