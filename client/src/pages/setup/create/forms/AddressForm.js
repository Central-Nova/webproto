import React, { Fragment } from 'react'
import FormInput from './FormInput';

const AddressForm = (props) => {

const { addressType , onChangeAddress, formData } = props;

// Creates an array of objects for each formData key/value pair
// Ex. formData = {street: '123 st', zip: '10021'}
// inputs = [{street: '123 st', {zip: '10021'}]
let inputs = Object.keys(formData).map( key => {
  return {[key]:formData[key]}
})

  return (
    <Fragment>
    <div className="form">
    <form action="">
      <div className="form-grid">
      {inputs.map((input, index) => (
        <FormInput key={index} formData={input} onChange={onChangeAddress} addressType={addressType} />
      ))}
      </div>
    </form>
  </div>
</Fragment>
  )
}

export default AddressForm;
