import React from 'react'

const SearchBar = ({ onChange, value }) => {
  return (
    <div className="form search">
    <i className="fas fa-search"></i>
    <input onChange={(e) => onChange(e)} name='search' value={value} type="text" placeholder="Search users by name or email." />
  </div>
  )
}

export default SearchBar
