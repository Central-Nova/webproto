import React from 'react'
import DropDown from '../components/input/DropDown'

const roleOptions = ['manager', 'worker']
const departmentOptions = ['Sales', 'Products', 'Inventory', 'Warehouse', 'Fleet','Payments', 'Admin']

const DropDownFilters = ( {onSearchChange, onClear}) => {
  return (
    <div className="container-filters">
    <p className="text-small text-primary-light">Filter by:</p>
    <div className="filter-option">
      <i className="fas fa-sitemap"></i>
        <DropDown name='role' onChange={onSearchChange} options={roleOptions}/>
    </div>
    <div className="filter-option">
      <i className="fas fa-briefcase"></i>
      <DropDown name='department' onChange={onSearchChange} options={departmentOptions} />
    </div>
    <div className="">
      <button onClick={()=> onClear()} className="btn btn-tiny btn-light">Clear</button>
    </div>
  </div>
  )
}

export default DropDownFilters
