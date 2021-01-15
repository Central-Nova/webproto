import React, { Fragment, useState, useEffect } from 'react'
import { loadProducts } from '../../actions/products';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import ProductSF from './ProductSF';
import ProductsCard from './ProductsCard';
import Spinner from '../layout/Spinner';
import Pagination from '../layout/pagination/Pagination';

const Products = ({ products, loadProducts }) => {

  // filterState holds all filter values
  const [filterState, setFilterState] = useState({
    search: [],
    promotions: [],
    inventory: [],
    sort: '',
  })

  const [pageState, setPageState] = useState(0);

  useEffect(()=> {
    // Load products based on filters
    loadProducts(pageState, 1, filterState.sort);

  }, [products.loading, loadProducts, filterState, pageState])

  // Selecting filters will update the filterState
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

  const onPageIncrement = (action) => {
    if (pageState > 0) {
      setPageState(action === 'next' ? pageState + 1 : pageState -1)
    }
  }

  const onPageChange = (number) => {
      setPageState(number)
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
        <Pagination onPageIncrement={onPageIncrement} onPageChange={onPageChange} current={pageState} total={products.productsData.total / products.productsData.limit}/>
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
