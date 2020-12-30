import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom';
import RoleSectionRow from './RoleSectionRow'

const RoleSection = ({ permissions, onChange }) => {

  let documentType = permissions[0].document

  return (
    <Fragment>
        <div className="container-roleswitches-grid my-4">
          <div className="grid-role-headers text-primary text-regular">
            <p className="col1">{documentType}</p>
            <p className="col2">Manager (Sales)</p>
            <p className="col3">Worker (Sales)</p>
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