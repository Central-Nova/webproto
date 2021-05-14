import React from 'react'

const ProductHeader = ({ sku, name, description }) => {
    return (
        <div className="container-headline">
            <p className="text-primary text-medium">{sku}</p>
            <p className="text-primary text-regular">{name}</p>
            <p className="text-primary text-small">{description}</p>
        </div>
    )
}

export default ProductHeader
  