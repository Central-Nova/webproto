import React, { Fragment, useEffect } from 'react'
import { loadProducts } from '../../actions/products';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import ProductsCard from './ProductsCard';
import Spinner from '../layout/Spinner';

const Products = ({ products, loadProducts }) => {

  useEffect(()=> loadProducts(),[])

  return (
    <Fragment>
    {products.loading ? (
      <Spinner/>
    ):(
      <Fragment>
      <div className="container-dashboard">
    <div className="container-headline">
      <p className="text-primary text-medium">Product Catalog</p>
      <p className="text-primary-light text-small">
        Manage your product catalog.
      </p>
      <div className="button-create">
        <button className="btn btn-success btn-small">Create</button>
      </div>
    </div>
    <div className="container-filter-fields my-2">
      <div className="form search">
        <i className="fas fa-search"></i>
        <input type="text" placeholder="Search users by name or email" />
      </div>
      <div className="container-filters">
        <p className="text-small text-primary-light">Filter by:</p>
        <div className="filter-option">
          <i className="fas fa-sitemap"></i>
          <select name="" id="">
            <option value="">Coupons</option>
            <option value="">Coupon Name 1</option>
            <option value="">Coupon Name 2</option>
          </select>
        </div>
        <div className="filter-option">
          <i className="fas fa-briefcase"></i>
          <select name="" id="">
            <option value="">Inventory</option>
            <option value="">In Stock</option>
            <option value="">Out of Stock</option>
            <option value="">Low Stock</option>
          </select>
        </div>
        <div className="">
          <button className="btn btn-tiny btn-light">Clear</button>
        </div>
      </div>
    </div>
    <div className="container-products-grid">

    {products.products.length > 0 && products.products.map(product => (
      <ProductsCard key={product._id} product={product} />
    ))}

    </div>
    <div className="container-pagination-grid">
      <div className="buttons">
        <button className="btn btn-light next">
          Next<i className="fas fa-chevron-right"></i>
        </button>
        <button className="btn btn-light">3</button>
        <button className="btn btn-light">2</button>
        <button className="btn btn-primary">1</button>
        <button className="btn btn-light back">
          <i className="fas fa-chevron-left"></i>Back
        </button>
      </div>
    </div>
  </div>

      </Fragment>
    )}
  </Fragment>
  )
}

Products.propTypes = {
  loadProducts: PropTypes.func.isRequired,
  products: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  products: state.products
})

export default connect(mapStateToProps, { loadProducts })(Products)
