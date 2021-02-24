import React, { Fragment } from 'react'
import { useController } from 'react-hook-form';
import CustomErrorMessage from './CustomErrorMessage';

const generateRules = (required, minLength, maxLength, isNumber, notZero, ) => {

  const rulesAll = {
    required: value => value !== '',
    minLength: value => value.length >= minLength,
    maxLength: value => value.length <= maxLength,
    isNumber: value => value === '' || Number.isInteger(parseInt(value)),
    notZero: value => value === '' || parseInt(value) > 0,
  }
  
  let rules = {
    validate: {
    }
  }

  let rulesParams = {required, minLength, maxLength, isNumber, notZero}

  for (let i in rulesParams) {
    let rule = i
    if (rulesParams[rule] !== false) {
      rules.validate[rule] = rulesAll[rule]
    }
  }

  return rules
}


const CustomTextInput = ({ defaultValue, control, errors, name, placeholder, label, required = false, minLength = false, maxLength = false, notZero = false, isNumber = false}) => {
  

  let rules = generateRules(required,minLength,maxLength, isNumber, notZero);
  
  const { 
    field: { ref, ...inputProps },
    meta: { invalid, isTouched, isDirty },
  } = 
  useController({
    name,
    control,
    rules,
    defaultValue: defaultValue || ''
  })


  return (
    <Fragment>
      <input type="text" placeholder={placeholder} {...inputProps} ref={ref}/>
      <CustomErrorMessage errors={errors} inputName={name} label={label} minLength={minLength} maxLength={maxLength}/>
    </Fragment>
  )
}


export default CustomTextInput
