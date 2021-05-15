import React from 'react'

import CustomSelect from '../../layout/inputs/CustomSelect'

const coupons = [
    {value: 'coupon1', name:'promotions', label: 'Coupon 1'},
    {value: 'coupon2', name:'promotions', label: 'Coupon 2'}
  ]
  
  const inventory = [
    {value: 'inStock', label: 'In Stock', name:'inventory'},
    {value: 'lowStock', label: 'Low Stock', name:'inventory'},
    {value: 'outStock', label: 'Out of Stock', name:'inventory'},
  ]
  

const Filters = ({ onFilterChange }) => {
    return (
        <div className="container-filters">
            <div className="filter-label text-small text-primary-light">Filter by:</div>
            <div className='grid-filter-options'>
                <div className="filter-option">
                    <CustomSelect
                    onChange={onFilterChange}
                    placeholder='Promotions'
                    name='promotions'
                    isSearcable={false}
                    options={coupons}
                    />
                </div>
                <div className="filter-option">
                    <CustomSelect
                    onChange={onFilterChange}
                    isSearcable={false}
                    placeholder='Inventory'
                    options={inventory}
                    closeMenuOnSelect={false}
                    />
                </div>
            </div>
        </div>
    )
}

export default Filters
