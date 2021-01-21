import React from 'react'
import { useForm } from 'react-hook-form';
import { createProduct } from '../../../actions/products';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import General from './General';
import Specifications from './Specifications';
import BasePrice from './BasePrice';
import PriceRules from './PriceRules';

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
      <General errors={errors} control={control} register={register}/>
      <Specifications errors={errors} control={control}/>
      <BasePrice errors={errors} control={control}/>
      <PriceRules errors={errors} control={control} register={register}/>
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
