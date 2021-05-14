import React from 'react'

const InfoCard = ({title, children}) => {
    return (
        <div className="container-product-info">
            <p className="text-regular text-primary">{title}</p>
                {children}
        </div>
    )
}

export default InfoCard
  