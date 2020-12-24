import React from 'react'
import { Link } from 'react-router-dom';

const SupplierCard = () => {
  return (
    <Link to="/create-account/supplier" >
    <div className="button-option btn btn-light">
      <i className="fas fa-pallet fa-4x "></i>
      <div className="text-box">
        <p className="text-regular">Supplier</p>
        <p className="text-small">Use {"{App Name}"}'s functions to manage your wholesale selling tasks. Buying goods is included as a secondary feature to support your business.</p>
      </div>
      <i className="fas fa-caret-right fa-4x"></i>
    </div>
  </Link>
  )
}

export default SupplierCard;
