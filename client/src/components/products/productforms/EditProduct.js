import React, { Fragment, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createProduct, loadProductById } from '../../../actions/products';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import General from './General';
import Specifications from './Specifications';
import BasePrice from './BasePrice';
import PriceRules from './PriceRules';
import Spinner from '../../layout/Spinner';

const EditProduct = ({ createProduct, loadProductById, filteredProducts: { loading, data } }) => {

  const { productId } = useParams();
  
  const { register, errors, control, handleSubmit, reset } = useForm({
    mode: 'onBlur',
  });

  useEffect(()=> {
    loadProductById(productId);

    if (!loading && data !== null) {
      const { sku, name, description, weight, color, primaryMaterial, dimensions, basePrice, priceRules } = data;

      reset({
        sku,
        name,
        description,
        weight: weight || '',
        color: color || '',
        primaryMaterial: primaryMaterial || '',
        dimensions: dimensions || {length: '', width: '', height: ''},
        basePrice,
        priceRules: [...priceRules]
      })
    }
  },[loadProductById,productId, loading, reset])

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
    createProduct({products: [data]});
    window.scrollTo(0,0);

  };

 
  console.log('errors: ', errors)

  return (
    <Fragment>
    {loading && data === null ? (
      <Spinner/>
    ):(
      <div className="container-dashboard">
      <div className="container-headline">
        <p className="text-primary text-medium">Edit Product</p>
        <p className="text-primary-light text-small">
          Enter the details of your new product.
        </p>
      </div>
      <div className="form">
        <General errors={errors} control={control} register={register}/>
        <Specifications  errors={errors} control={control}/>
        <BasePrice errors={errors} control={control}/>
        <PriceRules errors={errors} control={control} register={register}/>
      </div>
      <button onClick={handleSubmit(onSubmit)} className="btn btn-primary btn-small">Save</button>
      <button className="btn btn-light btn-back btn-small mx-2">
        <i className="fas fa-arrow-left"></i>Back
      </button>
    </div>
    )}
  </Fragment>

  )
}

EditProduct.propTypes = {
  createProduct: PropTypes.func.isRequired,
  loadProductById: PropTypes.func.isRequired,
  filteredProducts: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  filteredProducts: state.products.filteredProducts
})

export default connect(mapStateToProps,{createProduct, loadProductById})(EditProduct)
