import React, { Fragment } from 'react'

const BusinessForm = (props) => {
console.log('businessform props: ', props)

const { addressType , onChangeAddress, formData: {businessAddress: {street, aptSuite, city, state, zip}} } = props;
   
  return (
    <Fragment>
    <div className="form">
    <form action="">
      <div className="form-grid">
        <div className="street">
          <input type="text" 
            name="street" 
            value={street}
            onChange={e=> onChangeAddress(e, addressType)} placeholder="Street" />
        </div>
        <div className="suite">
          <input type="text" 
            name="aptSuite" 
            value={aptSuite} 
            onChange={e=> onChangeAddress(e, addressType)} placeholder="Apt/Suite" />
        </div>
        <div className="city">
          <input type="text"         
            name="city" 
            value={city} 
            onChange={e=> onChangeAddress(e, addressType)} placeholder="City" />
            </div>
        <div className="state">
          <input type="text" 
            name="state" 
            value={state} 
            onChange={e=> onChangeAddress(e, addressType)}placeholder="State" /></div>
        <div className="zip">
          <input type="text" 
            name="zip" 
            value={zip} 
            onChange={e=> onChangeAddress(e, addressType)}placeholder="Zip Code" />
        </div>
      </div>
    </form>
  </div>
</Fragment>
  )
}

export default BusinessForm;
