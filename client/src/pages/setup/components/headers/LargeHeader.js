import React from 'react'

const LargeHeader = ({ title, description }) => {
    return (
        <div className="company-headline-text">
            <h1 className="text-large text-primary">{title}</h1>
            {description && 
            <p className="text-primary-light text-regular">
                {description}
            </p>
            }
        </div>
    )
}

export default LargeHeader
