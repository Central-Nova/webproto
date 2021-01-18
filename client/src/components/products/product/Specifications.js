import React, { Fragment } from 'react'

const Specifications = ({basePrice, dimensions: {length, width, height}, weight}) => {
  return (
      <div
      class="container-specifications-grid text-regular text-primary-light"
    >
        <p>Unit Name</p>
        <p class="text-primary value">1 {basePrice.unit}</p>
        <p>Weight</p>
        <p class="text-primary value">{weight}</p>
        <p>Dimensions</p>
        <p class="text-primary value">{length} x {width} x {height}</p>
      </div>
  )
}

export default Specifications
