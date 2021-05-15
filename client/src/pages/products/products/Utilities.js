import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadAllProducts } from '../../../actions/products';

// Components
import Filters from './Filters';
import Search from './Search';
import Sort from './Sort';

const Utilities = ({ loadAllProducts, onFilterChange, products: { allProducts}}) => {
  const [productOptionsState, setProductOptionsState] = useState([])

  useEffect(()=> {
    loadAllProducts();
    if (!allProducts.loading && allProducts.data) {
      // Create array of newProductOptions. Set as state
      let newProductOptions = allProducts.data.products.map(product => {
        let productObject = {
          name: 'search',
          label: `${product.sku} | ${product.name}`,
          value: [product.name.toLowerCase(), product.sku.toLowerCase()]
        }
        return productObject
      })
      
      setProductOptionsState(newProductOptions);
    }
  },[allProducts.loading])

  const filterOptions = (inputValue) => {
    return productOptionsState.filter(option => option.value[0].includes(inputValue.toLowerCase()) || option.value[1].includes(inputValue.toLowerCase()));
    
  }

  const loadOptions = (inputValue, callback) => {
    setTimeout(()=> {
      callback(filterOptions(inputValue));
    }, 500);
  }

  return (
    <Fragment>
      <div className="container-search-sort my-2">
          <Search onFilterChange={onFilterChange} options={{initial: productOptionsState, load: loadOptions}} />
          <Sort onFilterChange={onFilterChange}/>
      </div>
      <Filters onFilterChange={onFilterChange}/>
    </Fragment>
  )
}

Utilities.propTypes = {
  products: PropTypes.object.isRequired,
  loadAllProducts: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  products: state.products
})

export default connect(mapStateToProps, { loadAllProducts })(Utilities)

