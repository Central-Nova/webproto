import React, { Fragment } from 'react'
import { useFieldArray } from 'react-hook-form';

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
              <input type="text"  name={`priceRules[${index}].quantity`} ref={register({ validate: {
                notEmpty: value => value !== '',
                isNumber: value => Number.isInteger(parseInt(value)),
                notZero: value => parseInt(value) > 0
            } })} placeholder="Qty" control={control}/>
              <div className="text-danger">
              {errors?.priceRules?.[index]?.quantity?.type ==='notEmpty' && 'Please enter a number'}
              {errors?.priceRules?.[index]?.quantity?.type ==='isNumber' && 'Please use numbers only'}
              {errors?.priceRules?.[index]?.quantity?.type ==='notZero' && 'Please enter a number > 0'}
              </div>
            </div>
            {/* Price Field */}
            <div className="form-item">
              <input type="text"  name={`priceRules[${index}].price`}  ref={register({ validate: {
                notEmpty: value => value !== '',
                isNumber: value => Number.isInteger(parseInt(value)),
                notZero: value => parseInt(value) > 0
                }})} placeholder="Price" control={control} />
              <div className="text-danger">
              {errors?.priceRules?.[index]?.price?.type ==='notEmpty' && 'Please enter a number'}
              {errors?.priceRules?.[index]?.price?.type ==='isNumber' && 'Please use numbers only'}
              {errors?.priceRules?.[index]?.price?.type ==='notZero' && 'Please enter a number > 0'}
              </div>

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
      <div className="text-danger">
        {errors.priceRules && errors.priceRules.forEach(obj=> Object.keys(obj).forEach(field=> field.message))}
      </div>
      <button onClick={(e) => onAddClick(e)}  className="btn btn-plus">
        <div className="circle"><i className="fas fa-plus"></i></div>
      </button>
    </div>
  </Fragment>
  )
}

export default PriceRules
