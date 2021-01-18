import React, { useState } from 'react'

const ProductsCard = ({ product}) => {

  const { _id, sku, name, basePrice } = product;

  const [toggle, setToggle] = useState(false)

  return (
    <div onClick={()=> setToggle(!toggle)}className="card card-product">
    <div className="card-header">
      <p className="text-primary text-small">{sku}</p>
      <i
        className="settings fas fa-ellipsis-h fa-2x text-primary-light"
      ></i>
    </div>
    <div className="card-line-one text-primary-light text-small">
      {name}
    </div>
    <div className="card-line-two text-small">
      <p>1 {basePrice.unit}</p>
      <p>{`${basePrice.contains} ${basePrice.subUnit}`}</p>
      <p className="price">{basePrice.price}</p>
    </div>
    <div className={`card-line-two hidden ${toggle && `expand`} text-small`}>
      <p>10 Pallets</p>
      <p>1200 Boxes</p>
      <p className="price">$554.99</p>
      <p>15 Pallets</p>
      <p>1800 Boxes</p>
      <p className="price">$754.99</p>
      <p>20 Pallets</p>
      <p>2400 Boxes</p>
      <p className="price">$1154.99</p>
    </div>
    <div className={`card-line-three hidden ${toggle && `expand`} text-light`}>
      <p>Available</p>
      <p className="inventory">100 Pallets</p>
      <p>Inbound</p>
      <p className="inventory">200 Pallets</p>
    </div>
  </div>
  )
}

export default ProductsCard
