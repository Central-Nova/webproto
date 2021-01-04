import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';

const UserItem = ({profile}) => {

  const { _id, firstName, lastName, email } = profile;

  return (
    <Fragment>
    <div className="grid-users-item text-primary text-small">
      <p>{`${firstName} ${lastName}`}</p>
      <p>{email}</p>
      <p>Sales, Products, Inventory, Warehouse, Fleet, Payments</p>
      <p>Sales, Products, Inventory, Warehouse, Fleet, Payments</p>

      <Link to={`/user/${_id}`} className="settings">
      <i className="fas fa-ellipsis-h fa-2x"></i>
      </Link>
    </div>
    <hr className="my-2" />
  </Fragment>
  )
}

export default UserItem;
