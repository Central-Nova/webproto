import React from 'react'

const Specifications = ({basePrice, dimensions: {length, width, height}, weight}) => {
  return (
      <div
      className="container-specifications-grid text-small text-primary-light">
        <p>Unit Name</p>
        <p className="text-primary value">1 {basePrice.unit}</p>
        <p>Weight</p>
        <p className="text-primary value">{weight || 0}</p>
        <p>Dimensions</p>
        <p className="text-primary value">{length || 0} x {width || 0} x {height || 0}</p>
      </div>
  )
}

export default Specifications
