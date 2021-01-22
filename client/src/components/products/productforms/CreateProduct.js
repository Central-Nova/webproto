import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { createProduct, loadAllProducts } from '../../../actions/products';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAlert } from '../../../actions/alert';

import General from './General';
import Specifications from './Specifications';
import BasePrice from './BasePrice';
import PriceRules from './PriceRules';

const CreateProduct = ({ products: {allProducts: {loading, data}}, loadAllProducts, createProduct, setAlert }) => {
  useEffect(()=> {
    loadAllProducts();
  },[])
  
  const { register, errors, control, handleSubmit, watch } = useForm({
    mode: 'onBlur'
  });

  let sku = watch('sku')
  // Check for existing SKU and give warning.
  if (!loading) {
    console.log('sku : ', sku)
    data.products.forEach(product => { 
      if (product.sku === sku) {
        console.log(`sku match: ${product.sku}` )
        setAlert({title: 'Warning', description: 'Using an existing SKU will overwrite existing product.'}, 'warning')
      }
    })
  }

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
  setAlert: PropTypes.func.isRequired,
  loadAllProducts: PropTypes.func.isRequired,
  products: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  products: state.products
})

export default connect(mapStateToProps,{loadAllProducts, createProduct, setAlert})(CreateProduct)
