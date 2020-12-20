import React from 'react'
import { Link } from 'react-router-dom'


const SetupAccountChoice = ({ handleBackClick }) => {
  return (
    <div className="container-company-single">
    <div className="button-back">
      <button onClick={()=>handleBackClick()} className="btn btn-light btn-large" to="/company">
        <i className="fas fa-long-arrow-alt-left"></i>Back
      </button>
    </div>
    <div className="company-headline-text">
      <h1 className="text-primary text-large">Account Type</h1>
      <p className="text-primary-light text-regular">
        Which account do you want to setup?
      </p>
    </div>
    <div className="container-buttons">
      <Link to="/company-create/buyer/create">
        <div className="button-option btn btn-light">
          <i className="fas fa-money-check-alt fa-4x "></i>
          <div className="text-box">
            <p className="text-regular">Buyer</p>
            <p className="text-small">Purchase from wholesale suppliers for your business.</p>
          </div>
          <i className="fas fa-caret-right fa-4x"></i>
        </div>
      </Link>
      <Link to="/company-create/supplier/create">
        <div className="button-option btn btn-light">
          <i className="fas fa-pallet fa-4x"></i>
          <div className="text-box">
            <p className="text-regular">Supplier</p>
            <p className="text-small">Sell to wholesale buyers on this platform.</p>
          </div>
          <i className="fas fa-caret-right fa-4x"></i>
        </div>
      </Link>
    </div>
  </div>
  )
}

export default SetupAccountChoice;
