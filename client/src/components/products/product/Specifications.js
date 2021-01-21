import React, { Fragment } from 'react'

const Specifications = ({basePrice, dimensions: {length, width, height}, weight}) => {
  return (
      <div
      class="container-specifications-grid text-regular text-primary-light">
        <p>Unit Name</p>
        <p class="text-primary value">1 {basePrice.unit}</p>
        <p>Weight</p>
        <p class="text-primary value">{weight || 0}</p>
        <p>Dimensions</p>
        <p class="text-primary value">{length || 0} x {width || 0} x {height || 0}</p>
      </div>
  )
}

export default Specifications
