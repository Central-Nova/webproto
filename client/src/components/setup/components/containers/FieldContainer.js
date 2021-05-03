import React from 'react'

const FieldContainer = ({ label, description, children }) => {
    return (
        <div className="container-field my-4">
            <div className="container-text">
            <p className="text-regular text-primary">{label}</p>
            <p className="text-small text-primary-light">{description}</p>
            </div>
            {children}
        </div>
    )
}

export default FieldContainer
