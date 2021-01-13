import React from 'react'

const ProductsCard = ({product}) => {

  const { sku, name, basePrice } = product;

  return (
    <div class="card card-product">
    <div class="card-header">
      <p class="text-primary text-small">{sku}</p>
      <i
        class="settings fas fa-ellipsis-h fa-2x text-primary-light"
      ></i>
    </div>
    <div class="card-line-one text-primary-light text-small">
      {name}
    </div>
    <div class="card-line-two text-small">
      <p>1 {basePrice.unit}</p>
      <p>{`${basePrice.contains} ${basePrice.subUnit}`}</p>
      <p class="price">{basePrice.price}</p>
    </div>
    <div class="card-line-two expand text-small">
      <p>10 Pallets</p>
      <p>1200 Boxes</p>
      <p class="price">$554.99</p>
      <p>15 Pallets</p>
      <p>1800 Boxes</p>
      <p class="price">$754.99</p>
      <p>20 Pallets</p>
      <p>2400 Boxes</p>
      <p class="price">$1154.99</p>
    </div>
    <div class="card-line-three expand text-light">
      <p>Available</p>
      <p class="inventory">100 Pallets</p>
      <p>Inbound</p>
      <p class="inventory">200 Pallets</p>
    </div>
  </div>
  )
}

export default ProductsCard
