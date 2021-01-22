import React, {Fragment} from 'react'

const CustomInputErrorMessage = ({errors, parent, name, label, valueType = '', index, minLength, maxLength}) => {
  return (
    <Fragment>
      <div className='text-danger my-1'>
      {valueType === 'object' ? (
        <Fragment>
        {errors?.[parent]?.[name]?.type === 'notEmpty' && `Please enter a ${label}.`}
        {errors?.[parent]?.[name]?.type === 'isNumber' && 'Please use numbers only.'}
        {errors?.[parent]?.[name]?.type === 'notZero' && 'Please enter a number > 0.'}
        {errors?.[parent]?.[name]?.type === 'minLength' && `${label} shoudld be at least ${minLength} characters.`}
        {errors?.[parent]?.[name]?.type === 'maxLength' && `${label} can't exceed ${maxLength} characters.`}
        </Fragment>
      ) : 
      valueType === 'array' ? (
        <Fragment>
        {errors?.[parent]?.[index]?.[name]?.type === 'notEmpty' && `Please enter a ${label}.`}
        {errors?.[parent]?.[index]?.[name]?.type === 'isNumber' && 'Please use numbers only.'}
        {errors?.[parent]?.[index]?.[name]?.type === 'notZero' && 'Please enter a number > 0.'}
        {errors?.[parent]?.[index]?.[name]?.type === 'minLength' && `${label} shoudld be at least ${minLength} characters.`}
        {errors?.[parent]?.[index]?.[name]?.type === 'maxLength' && `${label} can't exceed ${maxLength} characters.`}
        </Fragment>
      ): (
        <Fragment>
        {errors?.[name]?.type === 'notEmpty' && `Please enter a ${label}.`}
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