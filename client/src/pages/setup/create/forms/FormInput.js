import React from 'react'

const FormInput = ({formData, addressType, onChange}) => {
  // formData should be an object with one single key/value pair
  const string = `${Object.keys(formData)[0]}`

  return (
    <div className={string}>
    <input type="text" 
      name={string} 
      value={formData[string]}
      onChange={e=> onChange(e, addressType)} 
      placeholder={`${string.charAt(0).toUpperCase() + string.slice(1)}`} 
      data-testid={`${addressType}-${string}-field`}
      />
    </div>
  )
}

export default FormInput
