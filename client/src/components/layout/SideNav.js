import React from 'react'
import { Link } from 'react-router-dom';

function SideNav() {
  return (
    <div class="sidebar-nav">
        <div class="sidebar-logo">
          <i class="fas fa-warehouse fa-2x text-primary"></i>
          <p class="text-primary text-regular">AppName</p>
        </div>
        <div class="info-card">
          <p class="text-primary account-type">Business Name</p>
          <p class="text-primary-light account-action">Switch to Buyer View</p>
        </div>
        <hr class="my-1" />
        <div class="sidebar-items">
          <Link to="/users"><i class="fas fa-file-invoice-dollar"></i> Sales</Link>
          <Link to="/users"><i class="fas fa-tag"></i>Products</Link>
          <Link to="/users"><i class="fas fa-boxes"></i>Inventory</Link>
          <Link to="/users"><i class="fas fa-warehouse"></i>Warehouse</Link>
          <Link to="/users"><i class="fas fa-truck"></i>Fleet</Link>
          <Link to="/users"><i class="fas fa-money-check-alt"></i>Payment</Link>
        </div>
        <hr class="my-2" />
        <div class="sidebar-settings-items">
          <Link to="/users"><i class="fas fa-user"></i> Account</Link>
          <Link to="/users"><i class="fas fa-users"></i>Users</Link>
          <Link to="/users"><i class="fas fa-cog"></i> Settings</Link>
          <Link to="/users"><i class="fas fa-sign-out-alt"></i> Logout</Link>
        </div>
      </div>
  )
}

export default SideNav;
