import React from 'react'
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected && '#3360ff',
    backgroundColor: 'white',
    padding: '1rem',
    margin: '0rem',

    '&:hover': {
      color: 'white',
      backgroundColor: '#819cff',
      cursor: 'pointer'
    },
    '&:first-of-type': {
      borderTopLeftRadius: '0.5rem',
      borderTopRightRadius: '0.5rem'
    },
    '&:last-of-type': {
      borderBottomLeftRadius: '0.5rem',
      borderBottomRightRadius: '0.5rem',

    }
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '0.5rem',
    padding: 0
  }),
  menuList: (provided) => ({
    ...provided,
    borderRadius: '0.5rem',
    padding: 0
  }),
  control: (provided) => ({
    ...provided,
    fontSize: '1rem',
    fontFamily: 'Montserrat',
    borderRadius: '0.5rem',
    border: '1px solid #ccc',
    transition: 'all 0.2s ease-in',

    '&:hover': {
      boxShadow: 'inset 5px 5px 5px rgba(0, 0, 0, 0.2)',
      cursor: 'pointer'
    },

    '&:focus-within': {
      boxShadow: 'inset 5px 5px 5px rgba(0, 0, 0, 0.2)',
      cursor: 'pointer'
    }

  }),
  container: (provided) => ({
    ...provided,
    width: '100%',
  }),
  multiValueContainer: (provided) => ({
    ...provided,
    backgroundColor: '#819cff',
    }),
  multiValueLabel: (provided) => ({
    ...provided,
    borderTopLeftRadius: '0.5rem',
    borderBottomLeftRadius: '0.5rem',
    color: 'white',
    backgroundColor: '#819cff',
    }),
  multiValueRemove: (provided) => ({
    ...provided,
    borderTopRightRadius: '0.5rem',
    borderBottomRightRadius: '0.5rem',
    color: 'white',
    backgroundColor: '#819cff',
    })



}
const CustomInput = ({ setFilterState,loadOptions, onChange, ...rest}) => {

  return (
    <AsyncSelect {...rest} onChange={(valueType,actionMeta)=>onChange(valueType,actionMeta)} loadOptions={loadOptions} components={animatedComponents} closeMenuOnSelect={false} isMulti styles={customStyles} />
  )
}

export default CustomInput

