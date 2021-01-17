import React, { Fragment, useState, useEffect } from 'react'
import { loadFilteredProducts } from '../../actions/products';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import ProductSF from './ProductSF';
import ProductsCard from './ProductsCard';
import Spinner from '../layout/Spinner';
import Pagination from '../layout/pagination/Pagination';

const Products = ({ products: {filteredProducts}, loadFilteredProducts }) => {

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
    loadFilteredProducts(pageState, 5, filterState.sort, filterState.search);

  }, [filteredProducts.loading, loadFilteredProducts, filterState, pageState])

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
    {filteredProducts.loading ? (
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
        <ProductSF onSearchChange={setFilterState} onFilterChange={onFilterChange} />
        <div className="container-products-grid">
        {filteredProducts.data.products.length > 0 && filteredProducts.data.products.map(product => (
          <ProductsCard key={product._id} product={product} />
        ))}
        </div>
        <Pagination onPageIncrement={onPageIncrement} onPageChange={onPageChange} current={pageState} total={filteredProducts.data.total / filteredProducts.data.limit < 1 ? 1 : filteredProducts.data.total / filteredProducts.data.limit} limit={filteredProducts.data.limit} />
      </div>
      </Fragment>
    )}
  </Fragment>
  )
}

Products.propTypes = {
  loadFilteredProducts: PropTypes.func.isRequired,
  products: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  products: state.products
})

export default connect(mapStateToProps, { loadFilteredProducts })(Products)
