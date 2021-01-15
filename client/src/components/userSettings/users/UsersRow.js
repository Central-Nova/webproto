import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import RoleCheck from '../../layout/auth/RoleCheck';

const UserItem = ({profile}) => {

  const { _id, firstName, lastName, email, roles } = profile;

  const managerDepartments = []

  const workerDepartments = []

  // Loop through roles and build two arrays for each department the user has manager or worker role in
  roles.forEach(role => {
    if (role.worker === true) {
      workerDepartments.push(role.department)
      if (role.manager === true) {
        managerDepartments.push(role.department);
      }
    } else if (role.manager === true) {
      managerDepartments.push(role.department)
    } return
  })


  return (
    <Fragment>
    <div className="grid-users-item text-primary text-small">
      <p>{`${firstName} ${lastName}`}</p>
      <p>{email}</p>
      <p>{managerDepartments.join(', ')}</p>
      <p>{workerDepartments.join(', ')}</p>
      <RoleCheck department='admin' document='userroles' action='edit'
        yes={()=>(
          <Link to={`/user/${_id}`} className="settings btn text-primary">
            <i className="fas fa-cog fa-2x"></i>
          </Link>
        )}
        no={()=>(null)}
      />
    </div>
    <hr className="my-2" />
  </Fragment>
  )
}

export default UserItem;
