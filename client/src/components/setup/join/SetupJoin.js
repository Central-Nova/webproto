import React from 'react';
import { Link } from 'react-router-dom';

const SetupJoin = () => {
  return (
    <div className="container-company-single">
      <div className="button-back">
        <Link className="btn btn-light btn-large" to="/company">
          <i className="fas fa-long-arrow-alt-left"></i>Back
        </Link>
      </div>
      <div className="company-headline-text">
        <h1 className="text-primary text-large">Join a company</h1>
        <p className="text-primary-light text-regular">
          Enter the company information
        </p>
      </div>
      <div className="container-field my-4">
        <div className="container-text">
          <p className="text-regular text-primary">Received an invitiation?</p>
          <p className="text-small text-primary-light">
            Check your invitation email for your invitation code.
          </p>
        </div>
        <div className="form">
          <form action="">
            <div className="form form-item">
              <input type="text" placeholder="Invitation Code" />
            </div>
            <button className="btn btn-small btn-primary my-1" type="submit">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="container-field my-4">
        <div className="container-text">
          <p className="text-regular text-primary">Don't have an invitation?</p>
          <p className="text-small text-primary-light">
            Send an email to your company admin for an invitation code.
          </p>
        </div>
        <div className="form">
          <form action="">
            <div className="form form-item">
              <input type="text" placeholder="Organization Email" />
            </div>
            <button className="btn btn-small btn-light my-1" type="submit">
              Request
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SetupJoin