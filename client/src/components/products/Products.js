import React, { Fragment, useState, useEffect } from 'react'
import { loadProducts } from '../../actions/products';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import ProductSF from './ProductSF';
import ProductsCard from './ProductsCard';
import Spinner from '../layout/Spinner';
import Pagination from '../layout/Pagination';

const Products = ({ products, loadProducts }) => {

  // filterState to know what is the filter
  
  // Products state will be rendered into cards
  
  // When filter is changed, loadproducts run
  const [filterState, setFilterState] = useState({
    search: [],
    promotions: [],
    inventory: [],
    sort: '',
  })

  const [productsState, setProductsState] = useState([])

  useEffect(()=> {
    
    // const load = async () => {
      loadProducts(0, 5, filterState.sort);
  
      if (products.productsData) {
        setProductsState(products.productsData.products)
      }
    // }

    // load();


  }, [products.loading, loadProducts, filterState])

  const onFilterChange = (e) => {

    if (e !== null) {

      let name = '';
      let value = [];

      if (e.length > 0) {
        name = e[0].name;
        value = e.map(obj => obj.value)

      } else {
        name = e.name;
        value = e.value;
      }

      setFilterState({...filterState, [name]: value})
      
    }
  }
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
        </div>
        <ProductSF onFilterChange={onFilterChange} />
        <div className="container-products-grid">
        {products.productsData.products.length > 0 && products.productsData.products.map(product => (
          <ProductsCard key={product._id} product={product} />
        ))}
        </div>
        <Pagination/>
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
