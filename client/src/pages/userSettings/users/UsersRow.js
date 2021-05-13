import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import RoleCheck from '../../layout/auth/RoleCheck';
import { filterDepartments } from '../../../lib/filter';

const UserItem = ({profile}) => {

  const { _id, firstName, lastName, email, roles } = profile;

  // Get departments for each role
  const managerDepartments = filterDepartments(roles, 'manager').join(', ')

  const workerDepartments = filterDepartments(roles, 'worker').join(', ')

  return (
    <Fragment>
      <div className="grid-auto grid-auto-items text-small">
        <p>{`${firstName} ${lastName}`}</p>
        <p>{email}</p>
        <p>{managerDepartments}</p>
        <p>{workerDepartments}</p>
        <RoleCheck department='admin' document='userroles' action='edit'
          yes={()=>(
              <Link to={`/user/${_id}`} className="settings btn option text-primary" data-testid={`edit-${_id}-btn`}>
                <i className="fas fa-cog fa-2x"></i>
              </Link>
          )}
          no={()=>(null)}
        />
      </div>
    </Fragment>
  )
}

export default UserItem;
