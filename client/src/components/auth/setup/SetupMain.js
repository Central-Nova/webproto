import React from 'react'
import { Link } from 'react-router-dom';

const SetupMain = () => {
  return (
    <div className="container-company-single">
    <div className="company-headline-text">
      <h1 className="text-primary text-large">Company Setup</h1>
      <p className="text-primary-light text-regular">
        You're not yet part of a company.
      </p>
    </div>
    <div className="container-buttons">
      <Link to="/company-create">
        <div className="button-option btn btn-light">
          <i className="fas fa-user-plus fa-4x "></i>
          <div className="text-box">
            <p className="text-regular">Create</p>
            <p className="text-small">Create a new company</p>
          </div>
          <i className="fas fa-caret-right fa-4x"></i>
        </div>
      </Link>
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
    </div>
  </div>
  )
}

export default SetupMain;