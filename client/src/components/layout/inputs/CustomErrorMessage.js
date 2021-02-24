import React, {Fragment} from 'react'

const getNameProperties = (inputName) => {
  let nameProperties = {
    valueType: undefined,
    parent: undefined,
    index: undefined,
    name: undefined
  }

  if (inputName.match(/\[.*\]/)) {
    let regexMatch = inputName.match(/\[.*\]/)
    let regexIndex = inputName.search(/\[.*\]/)

    nameProperties.valueType = 'array';
    nameProperties.parent = inputName.substring(0,regexIndex);
    nameProperties.index = regexMatch[0].replace('[','').replace(']','');
    nameProperties.name = inputName.substring(regexIndex + 4, inputName.length);
  } else if (inputName.includes('.')) {
    let regexMatch = inputName.match(/\./)
    let regexIndex = inputName.search(/\./)

    nameProperties.valueType = 'object';
    nameProperties.parent = inputName.substring(0,regexIndex);
    nameProperties.name = inputName.substring(regexIndex + 1, inputName.length);
  } else {
    nameProperties.name = inputName
  }
  return nameProperties
}

const CustomInputErrorMessage = ({  errors, label, inputName, minLength, maxLength}) => {

  let nameProperties = getNameProperties(inputName);

  const { valueType, parent, index, name } = nameProperties;
  
  return (
    <Fragment>
      <div className='text-danger my-1'>
      {valueType === 'object' ? (
        <Fragment>
        {errors?.[parent]?.[name]?.type === 'required' && `Please enter a ${label}.`}
        {errors?.[parent]?.[name]?.type === 'isNumber' && 'Please use numbers only.'}
        {errors?.[parent]?.[name]?.type === 'notZero' && 'Please enter a number > 0.'}
        {errors?.[parent]?.[name]?.type === 'minLength' && `${label} shoudld be at least ${minLength} characters.`}
        {errors?.[parent]?.[name]?.type === 'maxLength' && `${label} can't exceed ${maxLength} characters.`}
        </Fragment>
      ) : 
      valueType === 'array' ? (
        <Fragment>
        {errors?.[parent]?.[index]?.[name]?.type === 'required' && `Please enter a ${label}.`}
        {errors?.[parent]?.[index]?.[name]?.type === 'isNumber' && 'Please use numbers only.'}
        {errors?.[parent]?.[index]?.[name]?.type === 'notZero' && 'Please enter a number > 0.'}
        {errors?.[parent]?.[index]?.[name]?.type === 'minLength' && `${label} shoudld be at least ${minLength} characters.`}
        {errors?.[parent]?.[index]?.[name]?.type === 'maxLength' && `${label} can't exceed ${maxLength} characters.`}
        </Fragment>
      ): (
        <Fragment>
        {errors?.[name]?.type === 'required' && `Please enter a ${label}.`}
          {errors?.[name]?.type === 'isNumber' && 'Please use numbers only.'}
          {errors?.[name]?.type === 'notZero' && 'Please enter a number > 0.'}
          {errors?.[name]?.type === 'minLength' && `${label} should be at least ${minLength} characters.`}
          {errors?.[name]?.type === 'maxLength' && `${label} can't exceed ${maxLength} characters.`}
        </Fragment>
      )}
      </div>
    </Fragment>
  )
}

export default CustomInputErrorMessage;