import React, { Fragment } from 'react'
import CustomTextInput from '../../layout/inputs/CustomTextInput';
import CustomNumberInput from '../../layout/inputs/CustomNumberInput';
import CustomInputErrorMessage from '../../layout/inputs/CustomInputErrorMessage';


const Specifications = ({ errors, control }) => {
  return (
    <Fragment>
      <div className="container-product-fields">
        <div className="container-text">
          <p className="text-regular text-primary">Specifications</p>
        </div>
        {/* Dimensions */}
        <div className="form container-form-product-grid">
          <div className="container-dimensions-grid">
            {/* Length Field */}
            <div className="form-item">
              <CustomNumberInput name='dimensions.length' placeholder='L' control={control} />
              <p className="text-primary-light">
                Dimensions in inches (L" x W" x H")
              </p>
              <CustomInputErrorMessage errors={errors} parent='dimensions' name='length' label='length' valueType='object'/>
            </div>
            {/* Width Field */}
            <div className="form-item">
              <CustomNumberInput name='dimensions.width' placeholder='W' control={control} />
              <CustomInputErrorMessage errors={errors} parent='dimensions' name='width' label='width' valueType='object'/>
            </div>
            {/* Height Field */}
            <div className="form-item">
              <CustomNumberInput name='dimensions.height' placeholder='H' control={control} />
              <CustomInputErrorMessage errors={errors} parent='dimensions' name='height' label='height' valueType='object'/>
            </div>
          </div>
          {/* Weight Field */}
          <div className="form-item">
          <CustomNumberInput name='weight' placeholder='Weight' control={control} />
            <p className="text-primary-light">Weight in pounds</p>
            <CustomInputErrorMessage errors={errors} name='weight' label='weight'/>
          </div>
          {/* Color Field */}
          <div className="form-item">
          <CustomTextInput name='color' control={control} placeholder='Color'/>
          </div>
          {/* Material Field */}
          <div className="form-item">
          <CustomTextInput name='primaryMaterial' control={control} placeholder='Primary Material'/>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Specifications
