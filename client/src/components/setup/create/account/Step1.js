import React, { Fragment } from 'react'

// Components
import AddressForm from '../forms/AddressForm';
import FieldContainer from '../../components/containers/FieldContainer';

const Step1 = ( props ) => {
  const { next, onChangeAddress, formData } = props;
  const { businessAddress, warehouseAddress } = formData;

  return (
    <Fragment>
      <FieldContainer 
        label='Business Address'
        description='Your registered business address'>
        <AddressForm  addressType='businessAddress' onChangeAddress={onChangeAddress} formData={businessAddress} />
      </FieldContainer>
      <FieldContainer 
        label='Warehouse Address'
        description='Your ship from address for all orders. If left empty, business address will be used'>
        <AddressForm addressType='warehouseAddress' onChangeAddress={onChangeAddress} formData={warehouseAddress}/>
        <button className="btn btn-small btn-primary my-1" onClick={e =>next(e)}>Next
          <i className="fas fa-long-arrow-alt-right"></i>
        </button>
      </FieldContainer>
    </Fragment>
  )
}


export default Step1;
