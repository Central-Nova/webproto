import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { clearProducts, loadProductById } from '../../../actions/products';

import Spinner from '../../layout/Spinner';
import PriceRules from './PriceRules';
import Specifications from './Specifications';
import InventorySummary from './InventorySummary';

const Product = ({ products: { filteredProducts: { loading, data } }, loadProductById, clearProducts }) => {

  const { productId } = useParams();

  useEffect(()=> {
    loadProductById(productId);

  }, [productId])

  return (
    <Fragment>
    {loading ? (
      <Spinner/>
    ):(
      <Fragment>
      <div className="container-dashboard">
    <div className="container-headline">
      <p className="text-primary text-medium">{data.sku}</p>
      <p className="text-primary text-regular">{data.name}</p>
      <p className="text-primary text-small">
        {data.description}
      </p>
    </div>
    <div className="container-product-info">
      <p className="text-medium text-primary">Price Rules</p>
      <PriceRules basePrice={data.basePrice} priceRules={data.priceRules} />
    </div>
    <div className="container-product-info">
      <p className="text-medium text-primary">Inventory Summary</p>
      <InventorySummary />
    </div>
    <div className="container-product-info">
      <p className="text-medium text-primary">Specifications</p>
      <Specifications weight={data.weight || 0} basePrice={data.basePrice} dimensions={data.dimensions || 0} />
    </div>
    <div className="my-2">
      <Link to={`/edit-product/${productId}`}> 
        <button className="btn btn-primary btn-small mx-2">Edit</button>
      </Link>
      <Link onClick={() => clearProducts()} to='/products'> 
        <button className="btn btn-light btn-back btn-small">
          <i className="fas fa-arrow-left"></i>Back
        </button>
      </Link>
    </div>
  </div>
      </Fragment>
    )}
  </Fragment>
  )
}

Product.propTypes = {
  loadProductById: PropTypes.func.isRequired,
  clearProducts: PropTypes.func.isRequired,
  products: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  products: state.products
})

export default withRouter(connect(mapStateToProps, {loadProductById, clearProducts} )(Product))
