import React, {Fragment} from 'react'
import CustomTextInput from '../../layout/inputs/CustomTextInput';
import CustomInputErrorMessage from '../../layout/inputs/CustomInputErrorMessage';

const General = ({ register, errors, control }) => {
  return (
    <Fragment>
      <div className="container-product-fields">
        <div className="container-text">
          <p className="text-regular text-primary">General</p>
          <p className="text-small text-primary-light">
            This information will be display in your product catalog and on
            customer-facing records.
          </p>
        </div>
        <div className="form container-form-general-product-grid">
          {/* SKU Field */}
          <div className="form-item sku">
            <CustomTextInput name='sku' control={control} required={true} placeholder='SKU' minLength={4} maxLength={20}/>
            <CustomInputErrorMessage errors={errors} name='sku' label='SKU' minLength={4} maxLength={20}/>
          </div>
          {/* Name Field */}
          <div className="form-item name">
            <CustomTextInput name='name' control={control} required={true} placeholder='Name' minLength={4} maxLength={80}/>
            <CustomInputErrorMessage errors={errors} name='name' label='Name' minLength={4} maxLength={80}/>
          </div>
          {/* Description Field */}
          <div className="form-item description">
            <p className="text-primary-light">Description</p>
              <textarea type="text" name='description' ref={register({required: 'Please enter a description',
              maxLength: {value: 200, message: 'Description can not exceed 200 characters.'}})}/>
            <div className="text-danger my-1">
            {errors.description && errors.description.message}
            </div>

          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default General
