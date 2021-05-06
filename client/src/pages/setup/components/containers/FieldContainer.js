import React from 'react'

const FieldContainer = ({ label, description, children, last }) => {
    return (
        <div className={`container-field ${!last && ' my-4'}`}>
            <div className="container-text">
            <p className="text-regular text-primary">{label}</p>
            <p className="text-small text-primary-light">{description}</p>
            </div>
            {children}
        </div>
    )
}

export default FieldContainer
