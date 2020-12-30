import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';

const UserItem = ({profile}) => {

  const { _id, firstName, lastName, email } = profile;

  return (
    <Fragment>
    <div className="grid-users-item text-primary text-small">
      <p className="col1">{`${firstName} ${lastName}`}</p>
      <p className="col2">{email}</p>
      <p className="col3">Sales, Products, Inventory, Warehouse, Fleet, Payments</p>
      <Link to={`/user/${_id}`} className="col4"><i className="fas fa-ellipsis-h"></i></Link>
    </div>
    <hr className="my-2" />
  </Fragment>
  )
}

export default UserItem;
