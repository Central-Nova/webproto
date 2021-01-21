import React from 'react'
import { useController } from 'react-hook-form';


const CustomTextInput = ({ control, name, placeholder, required = false, minLength = 0, maxLength = 999}) => {
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
      minLength: value => 
        value.length >= minLength,
      maxLength: value => 
      value.length <= maxLength,
    }) : ({
      minLength: value => 
      value.length >= minLength,
      maxLength: value => 
      value.length <= maxLength,
    })
    },
    defaultValue: ''
  })

  return (
    <input type="text" placeholder={placeholder} {...inputProps} ref={ref}/>
  )
}

export default CustomTextInput
