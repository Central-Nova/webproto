import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { clearProducts, loadProductById } from '../../../actions/products';

// Components
import Spinner from '../../layout/Spinner';
import InfoCard from '../components/InfoCard';
import ProductHeader from '../components/ProductHeader'
import PriceRules from './PriceRules';
import Specifications from './Specifications';
import InventorySummary from './InventorySummary';

const Product = ({ products: { filteredProducts: { loading, data } }, loadProductById, clearProducts }) => {

  const { productId } = useParams();

  useEffect(()=> {
    loadProductById(productId);

  }, [productId])

  return (
    <Fragment>
    {loading ? (
      <Spinner/>
    ):(
      <Fragment>
        <div className="container-dashboard">
          <ProductHeader sku={data.sku} name={data.name} description={data.description} />
          <InfoCard title='Price Rules'>
            <PriceRules basePrice={data.basePrice} priceRules={data.priceRules} />
          </InfoCard>
          <InfoCard title='Inventory Summary'>
            <InventorySummary />
          </InfoCard>
          <InfoCard title='Specifications'>
            <Specifications weight={data.weight || 0} basePrice={data.basePrice} dimensions={data.dimensions || 0} />
          </InfoCard>
          <div className="py-2">
            <Link to={`/edit-product/${productId}`}> 
              <button className="btn btn-primary btn-small mx-2">Edit</button>
            </Link>
            <Link onClick={() => clearProducts()} to='/products'> 
              <button className="btn btn-light btn-back btn-small">
                <i className="fas fa-arrow-left"></i>Back
              </button>
            </Link>
          </div>
        </div>
      </Fragment>
    )}
  </Fragment>
  )
}

Product.propTypes = {
  loadProductById: PropTypes.func.isRequired,
  clearProducts: PropTypes.func.isRequired,
  products: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  products: state.products
})

export default withRouter(connect(mapStateToProps, {loadProductById, clearProducts} )(Product))
