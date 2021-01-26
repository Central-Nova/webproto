import React, { Fragment } from 'react'

import CustomTextInput from '../../layout/inputs/CustomTextInput'


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
            <CustomTextInput 
              name='dimensions.length' 
              placeholder='L' 
              control={control}
              errors={errors} 
              isNumber={true} 
              notZero={true}
              label='length'
              />
              <p className="text-primary-light">
                Dimensions in inches (L" x W" x H")
              </p>
            </div>
            {/* Width Field */}
            <div className="form-item">
            <CustomTextInput 
            name='dimensions.width' 
            placeholder='W' 
            control={control}
            errors={errors} 
            isNumber={true} 
            notZero={true}
            label='width'
            />
            </div>
            {/* Height Field */}
            <div className="form-item">
            <CustomTextInput
              name='dimensions.height' 
              placeholder='H' 
              control={control}
              errors={errors} 
              isNumber={true} 
              notZero={true}
              label='height'
            />
            </div>
          </div>
          {/* Weight Field */}
          <div className="form-item">
          <CustomTextInput 
            name='weight' 
            placeholder='L' 
            control={control}
            errors={errors} 
            isNumber={true} 
            notZero={true}
            label='height'
          />
          </div>
          {/* Color Field */}
          <div className="form-item">
          <CustomTextInput 
            name='color' 
            control={control} 
            placeholder='Color'
          />
          </div>
          {/* Material Field */}
          <div className="form-item">
          <CustomTextInput 
            name='primaryMaterial' 
            control={control} 
            placeholder='Primary Material'
          />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Specifications
