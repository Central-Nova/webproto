import React, { Fragment } from 'react'
import ProductCard from '../components/ProductCard';

const Results = ({products, clearProducts}) => {
  return (
    <Fragment>
      {products.map(product => (
        <ProductCard key={product._id} product={product} clearProducts={clearProducts}/>))}
    </Fragment>
  )
}

export default Results
