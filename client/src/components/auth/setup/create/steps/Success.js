import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types'

import SideNav from '../sidenav/SideNav';
import Spinner from '../../../../layout/Spinner';

const Success = ( { back, company } ) => {

  let { account } = useParams();

  let secondaryAccount = account === 'supplier' ? 'buyer' : 'supplier';
  
  const { loading, profile } = company;

  let address = {};
  let email = '';
  let phone = '';

  if (company.profile !== null && company.profile[account] !== null) {
    address = profile[account].addressBusiness;
    email = profile[account].email;
    phone = profile[account].phoneWork;
  }

  return (
    <Fragment>
    <div className="logo">
      <i className="text-primary fas fa-warehouse fa-4x"></i>
    </div>
    <div className="container-company-double">
    {/* remove back button */}
      <div className="button-back">
        <button className="btn btn-light btn-large" onClick={()=> back() }>
          <i className="fas fa-long-arrow-alt-left"></i>Back
        </button>
      </div>
      <SideNav/>
      <div className="container-company-main">
        <div className="company-headline-text">
          <h1 className="text-large text-primary">{account.charAt(0).toUpperCase() + account.slice(1) + ' Account Details'} </h1>
          <p className="text-regular text-primary-light">The following information will be displayed to businesses on {'{App Name}'}.</p>
        </div>
        {company.profile === null ? (
          <Spinner/>
        ):(

        <div className="container-text">
          <div className="text-regular text-primary my-2">
            Address
            <p className="text-primary-light text-regular">
              {address.street} {address.aptSuite}
            </p>
            <p className="text-primary-light text-regular">
              {`${address.city}, ${address.state} ${address.zip}`}
            </p>
          </div>
          <div className="text-regular text-primary my-2">
            Email
            <p className="text-primary-light text-regular">
              {email}
            </p>
          </div>
          <div className="text-regular text-primary my-2">
            Phone
            <p className="text-primary-light text-regular">
              {phone}
            </p>
          </div>
          <div className="text-regular text-primary my-2">
            Would you like to use the same information for your buyer account?
              <Link to="/create-team">
                <button className="btn btn-primary btn-small mx-2">
                  Yes
                </button>
              </Link>
              <Link to={`/create-account/secondary/${secondaryAccount}`}>
                <button className="btn btn-light btn-small mx-2">
                  Add New
                </button>
              </Link>
          </div>
        </div>
        )}
      </div>
    </div>
    </Fragment>
  )
}

Success.propTypes = {
company: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  company: state.company
})

export default connect(mapStateToProps)(Success)
