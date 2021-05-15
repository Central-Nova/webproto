import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createProduct, loadAllProducts } from '../../../actions/products';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAlert } from '../../../actions/alert';
import { removeEmptyFields, removeEmptyObjects } from '../../../lib/sanitize';

// Components
import HeroHeader from '../../../components/headers/HeroHeader';
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

  console.log('errors: ', errors);

  let sku = watch('sku')
  // Check for existing SKU and give warning.
  if (!loading) {
    data.products.forEach(product => { 
      if (product.sku === sku) {
        console.log(`sku match: ${product.sku}` )
        setAlert({title: 'Warning', description: 'Using an existing SKU will overwrite existing product.'}, 'warning')
      }
    })
  }

  const onSubmit = data => {
    removeEmptyFields(data);
    removeEmptyObjects(data)
    createProduct({products: [data]});
    window.scrollTo(0,0);

  };

  return (
    <Fragment>
      <div className='container-dashboard'>
        <HeroHeader title='Create Product' description='Enter the details of your new product'/>
        <div className="form">
          <General errors={errors} control={control} register={register}/>
          <Specifications errors={errors} control={control}/>
          <BasePrice errors={errors} control={control}/>
          <PriceRules errors={errors} control={control} register={register}/>
        </div>
        <button onClick={handleSubmit(onSubmit)} className="btn btn-primary btn-small">Save</button>
        <Link to='/products'>
          <button className="btn btn-light btn-back btn-small mx-2">
            <i className="fas fa-arrow-left"></i>Back
          </button>
        </Link>
      </div>
    </Fragment>

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
