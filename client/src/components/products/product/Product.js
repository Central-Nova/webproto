import React, { Fragment, useEffect } from 'react'
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { loadProductById } from '../../../actions/products';

import Spinner from '../../layout/Spinner';
import PriceRules from './PriceRules';
import Specifications from './Specifications';
import InventorySummary from './InventorySummary';

const Product = ({ products: { filteredProducts: { loading, data } }, loadProductById }) => {

  const { productId } = useParams();

  useEffect(()=> {
    loadProductById(productId);

    console.log(loading);
  }, [])

  return (
    <Fragment>
    {loading ? (
      <Spinner/>
    ):(
      <Fragment>
      <div class="container-dashboard">
    <div class="container-headline">
      <p class="text-primary text-medium">{data.sku}</p>
      <p class="text-primary text-regular">{data.name}</p>
      <p class="text-primary text-small">
        {data.description}
      </p>
    </div>
    <div class="container-product-info">
      <p class="text-medium text-primary">Price Rules</p>
      <PriceRules basePrice={data.basePrice} priceRules={data.priceRules} />
    </div>
    <div class="container-product-info">
      <p class="text-medium text-primary">Inventory Summary</p>
      <InventorySummary />
    </div>
    <div class="container-product-info">
      <p class="text-medium text-primary">Specifications</p>
      <Specifications weight={data.weight} basePrice={data.basePrice} dimensions={data.dimensions} />
    </div>
    <button class="btn btn-primary btn-small">Edit</button>
    <button class="btn btn-light btn-back btn-small mx-2">
      <i class="fas fa-arrow-left"></i>Back
    </button>
  </div>

      </Fragment>
    )}
  </Fragment>
  )
}

Product.propTypes = {
  loadProductById: PropTypes.func.isRequired,
  products: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  products: state.products
})

export default connect(mapStateToProps, {loadProductById} )(Product)
