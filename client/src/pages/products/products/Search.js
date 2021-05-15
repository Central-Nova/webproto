import React from 'react'

import CustomInput from '../../layout/inputs/CustomInput';

const Search = ({ onFilterChange, options: { initial, load }}) => {
    return (
        <CustomInput 
            name='search'
            onChange={onFilterChange}
            isMulti
            blurInputOnSelect={false}
            placeholder="Type name or SKU and press enter" 
            defaultOptions={initial}
            loadOptions={load} />
    )
}

export default Search
