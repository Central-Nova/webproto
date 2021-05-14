import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadAllProducts } from '../../../actions/products';

import CustomSelect from '../../layout/inputs/CustomSelect';
import CustomInput from '../../layout/inputs/CustomInput';


const optionsCoupon = [
  {value: 'coupon1', name:'promotions', label: 'Coupon 1'},
  {value: 'coupon2', name:'promotions', label: 'Coupon 2'}
]

const optionsInventory = [
  {value: 'inStock', label: 'In Stock', name:'inventory'},
  {value: 'lowStock', label: 'Low Stock', name:'inventory'},
  {value: 'outStock', label: 'Out of Stock', name:'inventory'},
]

const optionsSort = [
  {value: 'name', name: 'sort', label: 'Name Ascending'},
  {value: '-name', name: 'sort', label: 'Name Descending'},
  {value: 'sku', name: 'sort', label: 'SKU Ascending'},
  {value: '-sku', name: 'sort', label: 'SKU Descending'},
  {value: '-date', name: 'sort', label: 'Newest'},
  {value: 'date', name: 'sort', label: 'Oldest'},
  {value: '-basePrice.price', name: 'sort', label: 'Highest Price'},
  {value: 'basePrice.price', name: 'sort', label: 'Lowest Price'},
]

const ProductSF = ({ setModalState, modalState, loadAllProducts, onFilterChange, products: { allProducts}}) => {
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
    <div className="container-multi-filter-fields my-2">
        <CustomInput 
          name='search'
          onChange={onFilterChange}
          isMulti
          blurInputOnSelect={false}
          placeholder="Type name or SKU and press enter" 
          defaultOptions={productOptionsState}
          loadOptions={loadOptions} />
      <div className="container-filters">
        <p className="text-small text-primary-light">Filter by:</p>
        <div className="filter-option">
          <CustomSelect
            onChange={onFilterChange}
            placeholder='Promotions'
            name='promotions'
            isSearcable={false}
            options={optionsCoupon}
            />
        </div>
        <div className="filter-option">
          <CustomSelect
            onChange={onFilterChange}
            isSearcable={false}
            placeholder='Inventory'
            options={optionsInventory}
            closeMenuOnSelect={false}
            />
        </div>
        <div className="container-filters mx-2">
          <p className="text-small text-primary-light">Sort by:</p>
          <div className="filter-option">
          <CustomSelect
            name='sort'
            isSearchable={false}
            onChange={onFilterChange}
            options={optionsSort}
            />
          </div>
          <div className="">
            <button className="btn btn-tiny btn-light">Clear</button>
          </div>
        </div>
      </div>
    <div className="button-create">
      <button onClick={()=>setModalState(!modalState)} className="btn btn-success btn-small">Create</button>
    </div>
  </div>
  )
}

ProductSF.propTypes = {
  products: PropTypes.object.isRequired,
  loadAllProducts: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  products: state.products
})

export default connect(mapStateToProps, { loadAllProducts})(ProductSF)

