import React from 'react'
import { useForm } from 'react-hook-form';
import PriceRules from './PriceRules';
import { createProduct } from '../../../actions/products';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const CreateProduct = ({ createProduct }) => {
  const { register, errors, control, handleSubmit } = useForm({
  });

  const removeEmptyFields = (data) => {
    Object.keys(data).forEach(key=> {
      if (typeof data[key] === 'object') {
        Object.keys(data[key]).forEach(nestkey => {
          if (data[key][nestkey] === '') {
            delete data[key][nestkey]
          }
        })
      } else {
        if (data[key] === '') {
          delete data[key]
        }
      }
    })
  }

  const removeEmptyObjects = (data) => {
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'object' && Object.keys(data[key]).length === 0) {
        delete data[key]
      }
    })
  }

  const onSubmit = data => {
    removeEmptyFields(data);
    removeEmptyObjects(data)
    createProduct(data);
    window.scrollTo(0,0);

  };

  const optionalNumber = {
    isNumber: value => 
      value === '' || Number.isInteger(parseInt(value))
  ,
    notZero: value => 
      value === '' || parseInt(value) > 0}
  
  console.log('errors: ', errors)

  return (
    <div className="container-dashboard">
    <div className="container-headline">
      <p className="text-primary text-medium">Create Product</p>
      <p className="text-primary-light text-small">
        Enter the details of your new product.
      </p>
    </div>
    <div className="form">
      <form onSubmit={handleSubmit(onSubmit)}>
    {/* General */}
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
          <input type="text" name='sku' ref={register({required: 'Please enter a SKU', minLength: {value: 4, message: 'SKU should have at least 4 characters.'}, maxLength: {value: 20, message: 'SKU can not exceed 20 characters.'}})} placeholder="SKU" />
          <div className="text-danger my-1">
          {errors.sku && errors.sku.message}
          </div>
        </div>
        {/* Name Field */}
        <div className="form-item name">
          <input type="text" name='name' ref={register({required: 'Please enter a name', maxLength: {value: 80, message: 'Name can not exceed 80 characters.'}})} placeholder="Name" />
          <div className="text-danger my-1">
          {errors.name && errors.name.message}
          </div>
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
    {/* Specifications */}
    <div className="container-product-fields">
      <div className="container-text">
        <p className="text-regular text-primary">Specifications</p>
      </div>
      {/* Dimensions */}
      <div className="form container-form-product-grid">
        <div className="container-dimensions-grid">
          {/* Length Field */}
          <div className="form-item">
            <input type="text" name='dimensions.length'
            ref={register({ validate: {
              isNumber: value => 
                value === '' || Number.isInteger(parseInt(value))
              ,
              notZero: value => 
                value === '' || parseInt(value) > 0
              ,
            }})} 
             placeholder="L" />
            <p className="text-primary-light">
              Dimensions in inches (L" x W" x H")
            </p>
            <div className="text-danger my-1">
              {errors.dimensions?.length?.type ==='isNumber' && 'Please use numbers only.'}
              {errors.dimensions?.length?.type ==='notZero' && 'Please use a number > 0.'}
            </div>
          </div>
          {/* Width Field */}
          <div className="form-item">
            <input type="text" name='dimensions.width' ref={register({ validate: {
              isNumber: value => 
                value === '' || Number.isInteger(parseInt(value))
              ,
              notZero: value => 
                value === '' || parseInt(value) > 0
              ,
            }})} placeholder="W" />
            <div className="text-danger my-1">
              {errors.dimensions?.width?.type ==='isNumber' && 'Please use numbers only.'}
              {errors.dimensions?.width?.type ==='notZero' && 'Please use a number > 0.'}
            </div>
          </div>
          {/* Height Field */}
          <div className="form-item">
            <input type="text" name='dimensions.height' ref={register({ validate: {
              isNumber: value => 
                value === '' || Number.isInteger(parseInt(value))
              ,
              notZero: value => 
                value === '' || parseInt(value) > 0
              ,
            }})} placeholder="H" />
            <div className="text-danger my-1">
              {errors.dimensions?.height?.type ==='isNumber' && 'Please use numbers only.'}
              {errors.dimensions?.height?.type ==='notZero' && 'Please use a number > 0.'}
            </div>

          </div>
        </div>
        {/* Weight Field */}
        <div className="form-item">
          <input type="text" name='weight' ref={register({ validate: {
              
              
            }})} placeholder="Weight" />
          <p className="text-primary-light">Weight in pounds</p>
          <div className="text-danger my-1">
              {errors.weight?.type ==='isNumber' && 'Please use numbers only.'}
              {errors.weight?.type ==='notZero' && 'Please use a number > 0.'}
            </div>
        </div>
        {/* Color Field */}
        <div className="form-item">
          <input type="text" name='color' ref={register} placeholder="Color" />
        </div>
        {/* Material Field */}
        <div className="form-item">
          <input type="text" name='primaryMaterial' ref={register} placeholder="Primary Material" />
        </div>
      </div>
    </div>
    <div className="container-product-fields">
      <div className="container-text">
        <p className="text-regular text-primary">Configure Price</p>
      </div>
      <div className="form container-form-product-grid">
        {/* Unit Name Field*/}
        <div className="form-item">
          <input type="text" name='basePrice.unit' ref={register({required: 'Please enter a unit name'})} placeholder="Unit Name" />
          <p className="text-hint text-primary-light">
            Smallest sellable unit ex. Pallet
          </p>
          <div className="text-danger my-1">
          {errors?.basePrice?.unit && errors.basePrice.unit.message}
          </div>
        </div>
        {/* Sub Unit Name Field*/}
        <div className="form-item">
          <input type="text" name='basePrice.subUnit' ref={register({required: 'Please enter a sub unit.'})} placeholder="Sub Unit Name" />
          <p className="text-hint text-primary-light">
            Sub units contained within a unit ex. Boxes
          </p>
          <div className="text-danger my-1">
          {errors?.basePrice?.subUnit && errors.basePrice.subUnit.message}
          </div>
        </div>
        {/* Contains Field*/}
        <div className="form-item">
          <input type="text" name='basePrice.contains' ref={register({ validate: {
            notEmpty: value => value !== '',
            isNumber: value => Number.isInteger(parseInt(value)),
            notZero: value => parseInt(value) > 0
            } 
          })} placeholder="# of Sub Units" />
          <p className="text-hint text-primary-light">
            # of "Sub Units" contained in a "Unit" ex. "40"
          </p>
          <div className="text-danger my-1">
          {errors?.basePrice?.contains?.type === 'notEmpty' && 'Please enter a number.'}
          {errors?.basePrice?.contains?.type ==='isNumber' && 'Please use numbers only.'}
          {errors?.basePrice?.contains?.type ==='notZero' && 'Please enter a number > 0.'}
          </div>
        </div>
        {/* Price Field*/}
        <div className="form-item">
          <input type="text" name='basePrice.price' ref={register({ validate: {
            notEmpty: value => value !== '',
            isNumber: value => Number.isInteger(parseInt(value)),
            notZero: value => parseInt(value) > 0
            } 
          })} placeholder="Unit Price" />
          <p className="text-hint text-primary-light">Price of 1 unit.</p>
          <div className="text-danger my-1">
          {errors?.basePrice?.price?.type === 'notEmpty' && 'Please enter a number.'}
          {errors?.basePrice?.price?.type ==='isNumber' && 'Please use numbers only.'}
          {errors?.basePrice?.price?.type ==='notZero' && 'Please enter a number > 0.'}
          </div>
        </div>
      </div>
    </div>

    <div className="container-product-fields">

      <PriceRules control={control} register={register} errors={errors}/>
    </div>
      </form>
    </div>
    <button onClick={handleSubmit(onSubmit)} className="btn btn-primary btn-small">Save</button>
    <button className="btn btn-light btn-back btn-small mx-2">
      <i className="fas fa-arrow-left"></i>Back
    </button>
  </div>

  )
}

CreateProduct.propTypes = {
  createProduct: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps,{createProduct})(CreateProduct)
