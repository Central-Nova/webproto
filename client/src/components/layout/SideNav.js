import React from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

function SideNav({ company: { loading, profile }}) {

  return (
    <div className="sidebar-nav">
        <div className="sidebar-logo">
          <i className="fas fa-warehouse fa-2x text-primary"></i>
          <p className="text-primary text-regular">AppName</p>
        </div>
        <div className="info-card">
          <p className="text-primary account-type">{!loading && profile.name}</p>

        </div>
        <hr className="my-1" />
        <div className="sidebar-items">
          <Link to="/users"><i className="fas fa-file-invoice-dollar"></i> Sales</Link>
          <Link to="/users"><i className="fas fa-tag"></i>Products</Link>
          <Link to="/users"><i className="fas fa-boxes"></i>Inventory</Link>
          <Link to="/users"><i className="fas fa-list-alt"></i>Purchasing</Link>

          <Link to="/users"><i className="fas fa-warehouse"></i>Warehouse</Link>
          <Link to="/users"><i className="fas fa-truck"></i>Fleet</Link>
          <Link to="/users"><i className="fas fa-money-check-alt"></i>Payment</Link>
        </div>
        <hr className="my-2" />
        <div className="sidebar-settings-items">
          <Link to="/users"><i className="fas fa-user"></i> Account</Link>
          <Link to="/users"><i className="fas fa-users"></i>Users</Link>
          <Link to="/users"><i className="fas fa-cog"></i> Settings</Link>
          <Link to="/users"><i className="fas fa-sign-out-alt"></i> Logout</Link>
        </div>
      </div>
  )
}

SideNav.propTypes = {
  company: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  company: state.company
})

export default connect(mapStateToProps, {})(SideNav);
