import React, { Fragment } from 'react'

import CustomTextInput from '../../layout/inputs/CustomTextInput';


const BasePrice = ({ errors, control }) => {
  return (
    <Fragment>
      <div className="container-product-fields">
        <div className="container-text">
          <p className="text-regular text-primary">Configure Price</p>
        </div>
        <div className="form container-form-product-grid">
          {/* Unit Name Field*/}
          <div className="form-item">
          <CustomTextInput 
          name='basePrice.unit' 
          control={control}
          errors={errors} 
          required={true} 
          placeholder='Unit Name'
          label='unit'
          />
            <p className="text-hint text-primary-light">
              Smallest sellable unit ex. Pallet
            </p>
          </div>
          {/* Sub Unit Name Field*/}
          <div className="form-item">
          <CustomTextInput 
          name='basePrice.subUnit' 
          control={control}
          errors={errors} 
          required={true} 
          placeholder='Sub Unit Name'
          label='sub unit'
          />
            <p className="text-hint text-primary-light">
              Sub units contained within a unit ex. Boxes
            </p>
          </div>
          {/* Contains Field*/}
          <div className="form-item">
          <CustomTextInput 
          name='basePrice.contains' 
          placeholder='No. of sub units' 
          control={control}
          errors={errors} 
          required={true} 
          isNumber={true} 
          notZero={true}
          label='number'
          />
            <p className="text-hint text-primary-light">
              # of "Sub Units" contained in a "Unit" ex. "40"
            </p>
          </div>
          {/* Price Field*/}
          <div className="form-item">
          <CustomTextInput 
          name='basePrice.price' 
          placeholder='Price' 
          control={control}
          errors={errors} 
          required={true} 
          isNumber={true} 
          notZero={true}
          label='number'
          />
            <p className="text-hint text-primary-light">Price of 1 unit.</p>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default BasePrice
