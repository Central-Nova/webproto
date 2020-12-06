import React, { Fragment } from 'react'

const SetupAddressForm = (props) => {
console.log('setupform props: ', props)

const { type, next, onChangeAddress } = props;

const addressForm = {};
const { street, aptSuite, city, state, zip } = addressForm;

   
  return (
    <Fragment>
    <div className="form">
    <form action="">
      <div className="form-grid">
        <div className="street">
          <input type="text" 
            name="street" 
            value={street}
            onChange={e=> onChangeAddress(e, type)} placeholder="Street" />
        </div>
        <div className="suite">
          <input type="text" 
            name="aptSuite" 
            value={aptSuite} 
            onChange={e=> onChangeAddress(e, type)} placeholder="Apt/Suite" />
        </div>
        <div className="city">
          <input type="text"         
            name="city" 
            value={city} 
            onChange={e=> onChangeAddress(e, type)} placeholder="City" />
            </div>
        <div className="state">
          <input type="text" 
            name="state" 
            value={state} 
            onChange={e=> onChangeAddress(e, type)}placeholder="State" /></div>
        <div className="zip">
          <input type="text" 
            name="zip" 
            value={zip} 
            onChange={e=> onChangeAddress(e, type)}placeholder="Zip Code" />
        </div>
      </div>
      {type==='warehouse' && 
      <button className="btn btn-small btn-primary my-1" onClick={next}>
      Next
      <i className="fas fa-long-arrow-alt-right"></i>
      </button>}
    </form>
  </div>
</Fragment>
  )
}

export default SetupAddressForm;
