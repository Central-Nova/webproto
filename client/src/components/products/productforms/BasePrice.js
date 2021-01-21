import React, { Fragment } from 'react'
import CustomTextInput from '../../layout/inputs/CustomTextInput';
import CustomNumberInput from '../../layout/inputs/CustomNumberInput';
import CustomInputErrorMessage from '../../layout/inputs/CustomInputErrorMessage';


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
          <CustomTextInput name='basePrice.unit' control={control} required={true} placeholder='Unit Name'/>
            <p className="text-hint text-primary-light">
              Smallest sellable unit ex. Pallet
            </p>
            <CustomInputErrorMessage errors={errors} valueType='object' parent='basePrice' name='unit' label='Unit' required={true}/>
          </div>
          {/* Sub Unit Name Field*/}
          <div className="form-item">
          <CustomTextInput name='basePrice.subUnit' control={control} required={true} placeholder='Sub Unit Name'/>
            <p className="text-hint text-primary-light">
              Sub units contained within a unit ex. Boxes
            </p>
            <CustomInputErrorMessage errors={errors} valueType='object' parent='basePrice' name='subUnit' label='Sub unit' required={true}/>
          </div>
          {/* Contains Field*/}
          <div className="form-item">
          <CustomNumberInput name='basePrice.contains' placeholder='No. of sub units' control={control} required={true} />
            <p className="text-hint text-primary-light">
              # of "Sub Units" contained in a "Unit" ex. "40"
            </p>
          <CustomInputErrorMessage errors={errors} valueType='object' parent='basePrice' name='contains' label='number' required={true}/>
          </div>
          {/* Price Field*/}
          <div className="form-item">
          <CustomNumberInput name='basePrice.price' placeholder='Price' control={control} required={true} />
            <p className="text-hint text-primary-light">Price of 1 unit.</p>
            <CustomInputErrorMessage errors={errors} valueType='object' parent='basePrice' name='contains' label='number' required={true}/>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default BasePrice
