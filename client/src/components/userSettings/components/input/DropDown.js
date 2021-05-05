import React from 'react'
import DropDownItem from './DropDownItem';

const DropDown = ({onChange, name, options}) => {
  let dropDownLabel = name.charAt(0).toUpperCase() + name.slice(1)
  return (
    <select onChange={(e)=> onChange(e)} name={name} id="">
      <option value="">{dropDownLabel}</option>
      {options.map(option => (
        <DropDownItem key={option} option={option}/>
      ))}
    </select>
  )
}

export default DropDown
