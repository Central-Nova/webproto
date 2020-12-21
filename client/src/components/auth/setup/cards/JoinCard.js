import React from 'react'
import { Link } from 'react-router-dom';

const JoinCard = () => {
  return (
    <Link to="/company-join">
    <div className="button-option btn btn-light">
      <i className="fas fa-users fa-4x"></i>
      <div className="text-box">
        <p className="text-regular">Join</p>
        <p className="text-small">Join an existing company</p>
      </div>
      <i className="fas fa-caret-right fa-4x"></i>
    </div>
  </Link>

  )
}

export default JoinCard;
