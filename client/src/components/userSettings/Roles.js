import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { loadRoles } from '../../actions/roles';

const Roles = ({ loadRoles }) => {

  useEffect(()=> {
    loadRoles();
  },[])
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
            <Link to="/role/sales">
              <button className="btn btn-primary btn-small btn-next">
                Manage <i className="fas fa-long-arrow-alt-right"></i>
              </button>
            </Link>
            </div>
          </div>
          <hr className="my-2" />
          <div className="grid-roles-item text-primary text-small">
            <p className="col1">Inventory</p>
            <p className="col2">
              Inventory tracking, product lotting, product catalog, inventory counting
            </p>
            <div className="col3">
            <Link to="/role/inventory">
              <button className="btn btn-primary btn-small btn-next">
                Manage <i className="fas fa-long-arrow-alt-right"></i>
              </button>
            </Link>
            </div>
          </div>
          <hr className="my-2" />
          <div className="grid-roles-item text-primary text-small">
            <p className="col1">Warehouse</p>
            <p className="col2">
              Sales orders, picking orders, packing orders, space management
            </p>
            <div className="col3">
            <Link to="/role/warehouse">
              <button className="btn btn-primary btn-small btn-next">
                Manage <i className="fas fa-long-arrow-alt-right"></i>
              </button>
            </Link>
            </div>
          </div>
          <hr className="my-2" />
          <div className="grid-roles-item text-primary text-small">
            <p className="col1">Fleet</p>
            <p className="col2">
              Zone, route, and driver management and driver actions.
            </p>
            <div className="col3">
            <Link to="/role/fleet">
              <button className="btn btn-primary btn-small btn-next">
                Manage <i className="fas fa-long-arrow-alt-right"></i>
              </button>
            </Link>
            </div>
          </div>
          <hr className="my-2" />
          <div className="grid-roles-item text-primary text-small">
            <p className="col1">Accounting</p>
            <p className="col2">
              Accounts receivable, cost tracking, and reports
            </p>
            <div className="col3">
            <Link to="/role/payments">
              <button className="btn btn-primary btn-small btn-next">
                Manage <i className="fas fa-long-arrow-alt-right"></i>
              </button>
            </Link>
            </div>
          </div>
          <hr className="my-2" />
          <div className="grid-roles-item text-primary text-small">
            <p className="col1">Admin</p>
            <p className="col2">
              Account information, payment information, user roles and permissions
            </p>
            <div className="col3">
            <Link to="/role/admin">
              <button className="btn btn-primary btn-small btn-next">
                Manage <i className="fas fa-long-arrow-alt-right"></i>
              </button>
            </Link>
            </div>
          </div>
          <hr className="my-2" />
          <Link to="/users">
            <button className="btn btn-small btn-light btn-back my-2">
              <i className="fas fa-long-arrow-alt-left"></i>Back
            </button>
          </Link>
      </div>
      </div>
  )
}

Roles.propTypes = {
  loadRoles: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({

})



export default connect(mapStateToProps, {loadRoles})(Roles);
