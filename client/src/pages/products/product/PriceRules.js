import React from 'react'
import PriceRulesRow from './PriceRulesRow';

const PriceRules = ({basePrice, priceRules}) => {
  return (
    <div className="container-price-rules-grid text-primary text-small">
      <p>1 {basePrice.unit}</p>
      <p>{basePrice.contains} {basePrice.subUnit}</p>
      <p>{basePrice.price} <span className="text-small">{`(${basePrice.price / basePrice.contains}/${basePrice.subUnit})`}</span></p>
      {priceRules.length > 0 && priceRules.map((rule) => (
        <PriceRulesRow key={rule._id} rule={rule} basePrice={basePrice} />
      ))}
    </div>
  )
}

export default PriceRules
