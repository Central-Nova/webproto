import React from 'react'
import { useController } from 'react-hook-form';

const CustomNumberInput = ({ control, name, required = false, placeholder }) => {

  const { 
    field: { ref, ...inputProps },
    meta: { invalid, isTouched, isDirty },
  } = 
  useController({
    name,
    control,
    rules: { validate: 
      required ? ({
      notEmpty: value => value !== '',
      isNumber: value => 
        value === '' || Number.isInteger(parseInt(value)),
      notZero: value => 
        value === '' || parseInt(value) > 0,
      }) : (
        {
          isNumber: value => 
            value === '' || Number.isInteger(parseInt(value)),
          notZero: value => 
            value === '' || parseInt(value) > 0,
          } 
      )
    },
    defaultValue: ''
  })

  
  return (
    <input type="text" placeholder={placeholder} {...inputProps} inpuetref={ref}/>
  )
}

export default CustomNumberInput
