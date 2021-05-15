import React from 'react'
import CustomSelect from '../../layout/inputs/CustomSelect';

const Sort = ({ onFilterChange }) => {
    const options = [
        {value: 'name', name: 'sort', label: 'Name Ascending'},
        {value: '-name', name: 'sort', label: 'Name Descending'},
        {value: 'sku', name: 'sort', label: 'SKU Ascending'},
        {value: '-sku', name: 'sort', label: 'SKU Descending'},
        {value: '-date', name: 'sort', label: 'Newest'},
        {value: 'date', name: 'sort', label: 'Oldest'},
        {value: '-basePrice.price', name: 'sort', label: 'Highest Price'},
        {value: 'basePrice.price', name: 'sort', label: 'Lowest Price'},
      ]

    return (
        <div className="container-sort">
            <div className="sort-label text-small text-primary-light">Sort by:</div>
            <div className="sort-option">
            <CustomSelect
                name='sort'
                isSearchable={false}
                onChange={onFilterChange}
                options={options}
                />
            </div>
            <div className="sort-clear">
                <button className="btn btn-tiny btn-light">Clear</button>
            </div>
        </div>
    )
}

export default Sort
