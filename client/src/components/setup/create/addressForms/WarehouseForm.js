import React, { Fragment } from 'react'

const WarehouseForm = (props) => {
console.log('warehouseform props: ', props)

const { addressType, next, onChangeAddress, formData: {warehouseAddress: {street, aptSuite, city, state, zip}} } = props;

const onClick = e => {
  e.preventDefault();

  next(e);
}
   
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
        <button className="btn btn-small btn-primary my-1" onClick={e =>onClick(e)}>Next
          <i className="fas fa-long-arrow-alt-right"></i>
        </button>
    </form>
  </div>
</Fragment>
  )
}

export default WarehouseForm;