import React from 'react'

import CustomSelect from '../layout/CustomSelect';
import CustomInput from '../layout/CustomInput';

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


const ProductSF = ({onFilterChange}) => {

  return (
    <div className="container-multi-filter-fields my-2">
        <CustomInput 
          name='search'
          onChange={onFilterChange}
          isMulti placeholder="Type name or SKU and press enter" options={optionsInventory} />
      <div className="container-filters">
        <p className="text-small text-primary-light">Filter by:</p>
        <div className="filter-option">
          <CustomSelect
            onChange={onFilterChange}
            placeholder='Promotions'
            name='promotions'
            options={optionsCoupon}
            />
        </div>
        <div className="filter-option">
          <CustomSelect
            onChange={onFilterChange}
            isMulti
            placeholder='Inventory'
            options={optionsInventory}
            />
        </div>
        <div className="container-filters mx-2">
          <p className="text-small text-primary-light">Sort by:</p>
          <div className="filter-option">
          <CustomSelect
            name='sort'
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
      <button className="btn btn-success btn-small">Create</button>
    </div>
  </div>
  )
}

export default ProductSF

