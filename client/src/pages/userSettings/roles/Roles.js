import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { loadRoles } from '../../../actions/roles';

// Components
import HeroHeader from '../../../components/headers/HeroHeader';
import RoleRow from './RoleRow';

const categories = [
  {category: 'Sales', description: 'Sales quotes, sales orders, refunds, communication with buyers', link: '/role/sales'},
  {category: 'Products', description: 'Product catalog and related tasks', link: '/role/products'},
  {category: 'Inventory', description: 'Inventory tracking, product lotting, product catalog, inventory counting', link: '/role/inventory'},
  {category: 'Warehouse', description: 'Sales orders, picking orders, packing orders, space management', link: '/role/warehouse'},
  {category: 'Fleet', description: 'Zone, route, and driver management and driver actions.', link: '/role/fleet'},
  {category: 'Payments', description: 'Accounts receivable, cost tracking, and reports', link: '/role/payments'},
  {category: 'Admin', description: 'Company profile, user profiles, roles and permissions', link: '/role/admin'},
]

const Roles = ({ loadRoles }) => {

  useEffect(()=> {
    loadRoles();
  },[])
  return (
      <div className="container-dashboard">
        <HeroHeader title='Roles' description='Manage roles and permissions per task category.' />
        <div className="container-roles-manage-grid">
          <div className="grid-roles-headers text-primary text-regular">
            <p className="col1 ">Category</p>
            <p className="col2 ">Description</p>
          </div>
          <hr className="my-1" />
          {categories.map(item => (
            <RoleRow category={item.category} description={item.description} link={item.link} />
          ))}
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
