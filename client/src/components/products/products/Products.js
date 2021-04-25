import React, { Fragment, useState, useEffect } from 'react'
import { loadFilteredProducts, clearProducts } from '../../../actions/products';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import ProductSF from './ProductSF';
import ProductsCard from './ProductsCard';
import Spinner from '../../layout/Spinner';
import Pagination from '../../layout/pagination/Pagination';
import Upload from './Upload';

const Products = ({ products: {filteredProducts}, loadFilteredProducts, clearProducts }) => {

  // filterState holds all filter values
  const [filterState, setFilterState] = useState({
    search: [],
    promotions: [],
    inventory: [],
    sort: '',
  })

  // pageState holds current page number
  const [pageState, setPageState] = useState(0);

  // Bulk upload modal state

  const [modalState, setModalState] = useState(false)

  useEffect(()=> {
    // Load products based on filters
    loadFilteredProducts(pageState, 10, filterState.sort, filterState.search);
  }, [filteredProducts.loading, loadFilteredProducts, filterState, pageState])
  
  // Selecting filters will update the filterState
  const onFilterChange = (valueType, actionMeta) => {
    console.log('valueType: ', valueType);
    console.log('actionMeta: ', actionMeta);
    // If valueType has a value, set the filter value to the valueType
    if (valueType !== null) {
      if (valueType.length > 0) {
        let name = actionMeta.name;
        let value = valueType.map(obj => obj.value)
        setFilterState({...filterState, [name]: value})
      } else {
        let name = actionMeta.name;
        let value = valueType.value;
        setFilterState({...filterState, [name]: value})
      }
      // Allows clearing of values and setting state to blank string or array, depending on the actionMeta.name
    } else {
      switch (actionMeta.name) {
        case 'search':
        case 'inventory':
        case 'promotions':
          setFilterState({...filterState, [actionMeta.name]: []})
          break;
        case 'sort':
          setFilterState({...filterState, [actionMeta.name]: ''})
          break;
        default:
          break;
      }
      // if (actionMeta.action === 'select-option') 
    }
  }
  
  // Back and Next buttons
  const onPageIncrement = (action) => {
    if (pageState >= 0) {
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
        <Upload setModalState={setModalState} modalState={modalState}/>
        {/* Products Sort and Filter Options */}
        <ProductSF setFilterState={setFilterState} onFilterChange={onFilterChange} setModalState={setModalState} modalState={modalState}/>
        <div className="container-products-grid">
        {/* Render filteredProducts */}
        {filteredProducts.data === null ? (<p>Your product catalog is empty.</p>) : filteredProducts.data.products.length > 0 && filteredProducts.data.products.map(product => (
          <ProductsCard key={product._id} product={product} clearProducts={clearProducts}/>
        )) }
        </div>
        {/* Pagination */}
        {filteredProducts.data && <Pagination onPageIncrement={onPageIncrement} onPageChange={onPageChange} current={pageState} total={filteredProducts.data.total / filteredProducts.data.limit < 1 ? 1 : Math.ceil(filteredProducts.data.total / filteredProducts.data.limit)} limit={filteredProducts.data.limit} />}
        
      </div>
      </Fragment>
    )}
  </Fragment>
  )
}

Products.propTypes = {
  loadFilteredProducts: PropTypes.func.isRequired,
  clearProducts: PropTypes.func.isRequired,
  products: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  products: state.products
})

export default connect(mapStateToProps, { loadFilteredProducts, clearProducts })(Products)
