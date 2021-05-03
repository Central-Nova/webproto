import React, { Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAlert } from '../../../../actions/alert';

// Components
import BusinessForm from '../addressForms/BusinessForm'
import WarehouseForm from '../addressForms/WarehouseForm'
import FieldContainer from '../../components/containers/FieldContainer';

const Step1 = ( props ) => {

  const { next, onChangeAddress, formData } = props;
  const { businessAddress } = formData;

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
      <FieldContainer 
        label='Business Address'
        description='Your registered business address'>
        <BusinessForm  addressType='businessAddress' onChangeAddress={onChangeAddress} formData={formData} />
      </FieldContainer>
      <FieldContainer 
        label='Warehouse Address'
        description='Your ship from address for all orders. If left empty, business address will be used'>
        <WarehouseForm addressType='warehouseAddress' onChangeAddress={onChangeAddress} formData={formData} next={onClick}/>
      </FieldContainer>
    </Fragment>
  )
}

Step1.propTypes = {
  setAlert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, { setAlert })(Step1);
