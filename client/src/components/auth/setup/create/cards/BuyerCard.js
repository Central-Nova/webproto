import React from 'react'
import { Link } from 'react-router-dom';

const BuyerCard = () => {
  return (
    <Link to="/create-account/primary/buyer">
        <div className="button-option btn btn-light">
          <i className="fas fa-money-check-alt fa-4x"></i>
          <div className="text-box">
            <p className="text-regular">Buyer</p>
            <p className="text-small">Connect with suppliers on {"{App Name}"} and manage your purchasing tasks.</p>
          </div>
          <i className="fas fa-caret-right fa-4x"></i>
        </div>
      </Link>
  )
}

export default BuyerCard;
