import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';

const RoleRow = ({category, description, link}) => {
  return (
    <Fragment>
      <div className="grid-roles-item text-primary text-small">
      <p className="col1">{category}</p>
      <p className="col2">{description}</p>
      <div className="col3">
      <Link to={link}>
        <button className="btn btn-primary btn-small btn-next">
          Manage <i className="fas fa-long-arrow-alt-right"></i>
        </button>
      </Link>
      </div>
    </div>
    <hr className="my-2" />
  </Fragment>
  )
}

export default RoleRow
