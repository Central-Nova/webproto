import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createProduct, loadProductById } from '../../../actions/products';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { removeEmptyObjects, removeEmptyFields } from '../../../lib/sanitize';

// Components
import HeroHeader from '../../../components/headers';
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

  const onSubmit = data => {
    removeEmptyFields(data);
    removeEmptyObjects(data)
    createProduct({products: [data]});
    window.scrollTo(0,0);
  };

 
  return (
    <Fragment>
    {loading && data === null ? (
      <Spinner/>
    ):(
      <div className="container-dashboard">
        <HeroHeader title='Edit Product' description='Enter the new details for this product'/>
        <div className="form">
          <General errors={errors} control={control} register={register}/>
          <Specifications  errors={errors} control={control}/>
          <BasePrice errors={errors} control={control}/>
          <PriceRules errors={errors} control={control} register={register}/>
        </div>
        <button onClick={handleSubmit(onSubmit)} className="btn btn-primary btn-small">Save</button>
        <Link to={`/product/${data._id}`}>
          <button className="btn btn-light btn-back btn-small mx-2">
            <i className="fas fa-arrow-left"></i>Back
          </button>
        </Link>
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
