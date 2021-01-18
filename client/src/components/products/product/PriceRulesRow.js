import React, { Fragment } from 'react'

const PriceRulesRow = ({ rule: {unit, quantity, price}, basePrice }) => {
  return (
    <Fragment>
      <p>{quantity} {unit}</p>
      <p>{quantity * basePrice.contains} {basePrice.subUnit}</p>
      <p>{price} <span class="text-small">($24.79/box)</span></p>
    </Fragment>
  )
}

export default PriceRulesRow
