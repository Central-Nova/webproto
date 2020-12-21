import React, { Fragment } from 'react'
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setAlert } from '../../../../../actions/alert';

// Components
import SideNav from '../sidenav/SideNav';
import BusinessForm from '../addressForms/BusinessForm'
import WarehouseForm from '../addressForms/WarehouseForm'

const Step1 = ( props ) => {

  const { next, onChangeAddress, formData } = props;
  const { businessAddress } = formData;
  const { account } = useParams();

  console.log('step 1 props: ', props)

  const createErrMess = (field) => {
    let capitalized = field.charAt(0).toUpperCase() + field.slice(1);

    return {title: 'Error', description: `${capitalized} is required.`}
  }

  // Array to hold empty fields as objects
  let emptyBusinessFields = [];

  // Loop through businessAddress to push empty fields into array
  for (let field in businessAddress) {
    if (businessAddress[field] === '') {
      let key = `${field}`;
      let emptyKey = {[key]: businessAddress[field] }

      emptyBusinessFields.push(emptyKey);
    }
  }


  let filled = false;

  // If emptyBusinessFields have objects, then filled is false;
  if (emptyBusinessFields !== null && emptyBusinessFields.length > 0) {
    filled = false;
  } else {
    filled = true;
  }


  // On click to send array of messages to parent on click handler
  const onClick = (e) => {
    let messages = [];
    
    for (let object in emptyBusinessFields) {
      let key = Object.keys(emptyBusinessFields[object]);
      messages.push(createErrMess(`${key}`));
      console.log('messages: ', messages);
  }

  next(e,filled, messages);
}

  return (
    <Fragment>
    <div className="logo">
      <i className="text-primary fas fa-warehouse fa-4x"></i>
    </div>
    <div className="container-company-double">
      <div className="button-back">
        <Link className="btn btn-light btn-large" to="/create-company">
          <i className="fas fa-long-arrow-alt-left"></i>Back
        </Link>
      </div>
      <SideNav/>
      <div className="container-company-main">
        <div className="company-headline-text">
          <h1 className="text-large text-primary">{account.charAt(0).toUpperCase() + account.slice(1) + ' Account'} Setup</h1>
        </div>
        <div className="container-address-field my-4">
          <div className="container-text">
            <p className="text-regular text-primary">Business Address</p>
            <p className="text-small text-primary-light">
              Your registered business address.
            </p>
          </div>
          <BusinessForm  type='business' onChangeAddress={onChangeAddress} formData={formData} />
        </div>
        <div className="container-address-field my-4">
          <div className="container-text">
            <p className="text-regular text-primary">Warehouse Address</p>
            <p className="text-small text-primary-light">
              Your ship from address for your orders.
            </p>
          </div>
          <WarehouseForm type='warehouse' onChangeAddress={onChangeAddress} formData={formData} next={onClick}/>
        </div>
      </div>
    </div>
    </Fragment>
  )
}

Step1.propTypes = {
  setAlert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, { setAlert })(Step1);
