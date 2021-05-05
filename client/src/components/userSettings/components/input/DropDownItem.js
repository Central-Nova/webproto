import React from 'react'

const DropDownItem = ({option}) => {
  let display = option.charAt(0).toUpperCase() + option.slice(1)
  return (
    <option value={option}>{display}</option>
  )
}

export default DropDownItem
