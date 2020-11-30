import React from 'react'
import { Link } from 'react-router-dom'

const Roles = () => {
  return (
      <div className="container-dashboard">
        <div className="container-headline">
          <p className="text-primary text-large">Roles</p>
          <p className="text-primary-light text-small">
            Manage roles and permissions per task category.
          </p>
        </div>
        <div className="container-roles-manage-grid">
          <div className="grid-users-headers text-primary text-regular">
            <p className="col1 ">Category</p>
            <p className="col2 ">Description</p>
          </div>
          
          <hr className="my-1" />
          <div className="grid-roles-item text-primary text-small">
            <p className="col1">Sales</p>
            <p className="col2">
              Sales quotes, sales orders, refunds, communication with buyers
            </p>
            <div className="col3">
              <button className="btn btn-primary btn-small btn-next">
                <Link to="role">Manage</Link> <i className="fas fa-long-arrow-alt-right"></i>
              </button>
            </div>
          </div>
          <hr className="my-2" />
          <div className="grid-roles-item text-primary text-small">
            <p className="col1">Inventory</p>
            <p className="col2">
              Inventory tracking, product lotting, product catalog, inventory counting
            </p>
            <div className="col3">
              <button className="btn btn-primary btn-small btn-next">
              <Link to="role">Manage</Link> <i className="fas fa-long-arrow-alt-right"></i>
              </button>
            </div>
          </div>
          <hr className="my-2" />
          <div className="grid-roles-item text-primary text-small">
            <p className="col1">Warehouse</p>
            <p className="col2">
              Sales orders, picking orders, packing orders, space management
            </p>
            <div className="col3">
              <button className="btn btn-primary btn-small btn-next">
                <Link to="role">Manage</Link> <i className="fas fa-long-arrow-alt-right"></i>
              </button>
            </div>
          </div>
          <hr className="my-2" />
          <div className="grid-roles-item text-primary text-small">
            <p className="col1">Fleet</p>
            <p className="col2">
              Zone, route, and driver management and driver actions.
            </p>
            <div className="col3">
              <button className="btn btn-primary btn-small btn-next">
                <Link to="role">Manage</Link> <i className="fas fa-long-arrow-alt-right"></i>
              </button>
            </div>
          </div>
          <hr className="my-2" />
          <div className="grid-roles-item text-primary text-small">
            <p className="col1">Accounting</p>
            <p className="col2">
              Accounts receivable, cost tracking, and reports
            </p>
            <div className="col3">
              <button className="btn btn-primary btn-small btn-next">
                <Link to="role">Manage</Link> <i className="fas fa-long-arrow-alt-right"></i>
              </button>
            </div>
          </div>
          <hr className="my-2" />
        <button className="btn btn-small btn-back my-2">
          <i className="fas fa-long-arrow-alt-left"></i><Link to="users">Back</Link>
        </button>
      </div>
      </div>
  )
}

export default Roles;