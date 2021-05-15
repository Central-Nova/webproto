import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';

const RoleRow = ({category, description, link}) => {
  return (
    <Fragment>
      <div className="grid-auto grid-auto-items text-small">
      <p>{category}</p>
      <p>{description}</p>
      <div className="option">
      <Link to={link} data-testid={`edit-${category.toLowerCase()}-btn`}>
        <button className="btn btn-primary btn-small btn-next">
          Manage <i className="fas fa-long-arrow-alt-right"></i>
        </button>
      </Link>
      </div>
    </div>
  </Fragment>
  )
}

export default RoleRow
