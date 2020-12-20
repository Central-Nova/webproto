import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { createCompany } from '../../../../actions/company';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideNav from './SideNav';


const CreateCompany = ({ createCompany, company: { profile } }) => {

  const [formState, setFormState] = useState({
    businessName: '',
    ein: ''
  })

  const { businessName, ein } = formState;

  const formChange = (e) => {
    setFormState({
      ...formState, 
      [e.target.name]: e.target.value
    })
  }

  const onClick = (e) => {
    e.preventDefault();
    createCompany(formState);
  }

  return (
    <Fragment>
    <div className="logo">
      <i className="text-primary fas fa-warehouse fa-4x"></i>
    </div>
    <div className="container-company-double">
      <div className="button-back">
        <Link className="btn btn-light btn-large" to="/company">
          <i className="fas fa-long-arrow-alt-left"></i>Back
        </Link>
      </div>
      <SideNav/>
      {profile !== null ? (
        <div className="container-company-main">
        <div className="company-headline-text">
          <h1 className="text-large text-primary">Primary and Secondary Accounts</h1>
        </div>
        <div className="container-buttons">
      <Link to="/create-account/supplier" >
        <div className="button-option btn btn-light">
          <i className="fas fa-pallet fa-4x "></i>
          <div className="text-box">
            <p className="text-regular">Primary Operation: Supplier</p>
            <p className="text-small">Use {"{App Name}"}'s functions to manage your wholesale selling tasks. Buying goods is included as a secondary feature to support your business.</p>
          </div>
          <i className="fas fa-caret-right fa-4x"></i>
        </div>
      </Link>
      <Link to="/create-account/buyer">
        <div className="button-option btn btn-light">
          <i className="fas fa-money-check-alt fa-4x"></i>
          <div className="text-box">
            <p className="text-regular">Primary Operation: Buyer</p>
            <p className="text-small">Join an existing company</p>
          </div>
          <i className="fas fa-caret-right fa-4x"></i>
        </div>
      </Link>
    </div>
        
      </div>
      ) : (
        <div className="container-company-main">
        <div className="company-headline-text">
          <h1 className="text-large text-primary">Company Setup</h1>
        </div>
        <div className="container-field my-4">
          <div className="container-text">
            <p className="text-regular text-primary">Business Name</p>
            <p className="text-small text-primary-light">Your registered business name. Other businesses will need this to
              identify you.</p>
          </div>
          <div className="form">
            <form action="">
              <div className="form form-item">
                <input type="text"
                name="businessName"
                value={businessName}
                onChange={e=>formChange(e)}
                placeholder="Name"
                />
              </div>
            </form>
          </div>
        </div>
        <div className="container-field my-4">
          <div className="container-text">
            <p className="text-regular text-primary">Business EIN</p>
            <p className="text-small text-primary-light">This will be used to verify your business.</p>
          </div>
          <div className="form">
            <form action="">
              <div className="form form-item">
                <input type="text"
                name="ein"
                value={ein}
                onChange={e=>formChange(e)}
                placeholder="Name"
                />
              </div>
              <button className="btn btn-small btn-primary my-1" onClick={(e)=>onClick(e)}>
                Submit 
              </button>
            </form>
          </div>
        </div>
      </div>
      )}
      
    </div>
    </Fragment>
  )
}

CreateCompany.propTypes = {
createCompany: PropTypes.func.isRequired,
company: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
company: state.company
})

export default connect(mapStateToProps, { createCompany })(CreateCompany);
