import React, { Fragment } from 'react'
import { useFieldArray } from 'react-hook-form';

import CustomTextInput from '../../layout/inputs/CustomTextInput';

const PriceRules = ({ errors, control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control, 
    name: 'priceRules'
  });

  const onAddClick = (e) => {
    e.preventDefault();
    append({unit: '', quantity: '', price: ''})
  }

  return (
    <Fragment>
      <div className="container-product-fields">
        <div className="container-text">
          <p className="text-regular text-primary">Price Rules</p>
          <p className="text-small text-primary-light">
            Configire pricing rules to offer volume discounts. Price rules can
            be applied on a per Sales Order basis.
          </p>
        </div>
        <div className="form container-form-price-grid">
        <div className="container-price-field-grid">
        {fields.map((item, index) => {
          return (
            <Fragment key={item.id}>
            {/* Unit Field */}
              <div className="form-item">
                <select type="text" name={`priceRules[${index}].unit`} ref={register({required: true})} placeholder="Unit" control={control}>
                  <option value="Pallet">Pallet</option>
                </select>
              </div>
              {/* Quantity Field */}
              <div className="form-item">
                <CustomTextInput 
                control={control} 
                errors={errors} 
                name={`priceRules[${index}].quantity`} 
                required={true} 
                isNumber={true} 
                notZero={true} 
                label='quantity'
                defaultValue={item.quantity} placeholder='Quantity'/>
              </div>
              {/* Price Field */}
              <div className="form-item">
              <CustomTextInput 
                control={control} 
                errors={errors} 
                name={`priceRules[${index}].price`} 
                required={true} 
                isNumber={true} 
                notZero={true} 
                label='price'
                defaultValue={item.price} 
                placeholder='Price'/>
              </div>
              <div className="btn-remove">
                <button onClick={()=>remove(index)} className="btn btn-minus">
                  <div className="circle"><i className="fas fa-minus"></i></div>
                </button>
              </div>
            </Fragment>
          )
        })}
        </div>
        <button onClick={(e) => onAddClick(e)}  className="btn btn-plus">
          <div className="circle"><i className="fas fa-plus"></i></div>
        </button>
      </div>
    </div>
  </Fragment>
  )
}

export default PriceRules
