import React, { Fragment } from 'react'
import BusinessForm from '../addressForms/BusinessForm';
import WarehouseForm from '../addressForms/WarehouseForm';

const Step2 = (props) => {

  const { back, next, onChangeAddress, formData } = props;
  const { businessAddress } = formData;

  console.log('step 2 props: ', props)

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
        <button onClick={back} className="btn btn-light btn-large">
          <i className="fas fa-long-arrow-alt-left"></i>Back
        </button>
      </div>
      <div className="side-bar bg-light">
        <div className="side-bar-item item-main">
          <div className="icon-number text-small text-primary bg-white">1</div>
          <p className="text-regular text-primary">Business</p>
        </div>
        <div className="side-bar-item">
          <p className="text-regular text-success">Name</p>
        </div>
        <div className="side-bar-item item-main">
          <p className="text-regular text-success">Address</p>
        </div>
        <div className="side-bar-item">
          <p className="text-regular text-primary">Contact</p>
        </div>
        <div className="side-bar-item item-main">
          <div className="icon-number text-small text-primary bg-white">2</div>
          <p className="text-regular text-primary">Team</p>
        </div>
      </div>
      <div className="container-company-main">
        <div className="company-headline-text">
          <h1 className="text-large text-primary">Business Details</h1>
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

export default Step2;
