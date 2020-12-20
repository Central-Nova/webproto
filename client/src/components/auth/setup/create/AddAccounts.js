import React, { Fragment, useState } from 'react'
import SetupCreateStepHandler from './SetupCreateStepHandler';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAlert } from '../../../../actions/alert';
import { createCompany, editCompany } from '../../../../actions/company';
import { Redirect, useParams } from 'react-router-dom';

const AddAccounts = ({ setAlert, createCompany, company: {profile} }) => {

  const { account } = useParams();

  const [formState, setFormState] = useState({
    step: 1,
    formData: {
      businessName: '',
      ein: '',
      businessAddress: {
        street: '',
        aptSuite: '',
        city: '',
        state: '',
        zip: ''
      },
      warehouseAddress: {
        street: '',
        aptSuite: '',
        city: '',
        state: '',
        zip: ''
      },
      email: '',
      phone: '',
    }
  })
  
  
  // Handling form changes separately to create one object to pass to api. This will make the company object cleaner in the api route.
  
  let { step, formData } = formState;

  // Handles changes for address forms
  const onChangeAddress = (e, type) => {


  if (type === 'business') {
    setFormState({
      ...formState, formData: {...formData, businessAddress: { ...formData.businessAddress, [e.target.name]: e.target.value}
    }})
  }

  if (type === 'warehouse') {
    setFormState({
      ...formState, formData: {...formData, warehouseAddress: { ...formData.warehouseAddress, [e.target.name]: e.target.value}
    }})
  }

}
  // Handles change for non-address forms
  const onChangeGeneral = e => setFormState({
    ...formState, formData: {...formData, [e.target.name]: e.target.value}
  })

  // Previous Step
  const onStepBack = e => setFormState({
    ...formState, step: step -1
  });


  // Next Step
  const onStepNext = (e,filled, messages) => {

  if (filled) {
    setFormState({
    ...formState, step: step + 1 
  })} 
  else {
    e.preventDefault();
    
    for (let msg in messages) {
      console.log('messages: ', messages);

      setAlert(messages[msg], 'danger');
    }
  }
}

  // Form Submit

  const onSubmit = e => {
    e.preventDefault();
    createCompany(formData);

    if (profile !==null) {
      setFormState({
        ...formState,
        step: step +1
      })
    }
  }


  return (
    <Fragment>
    <SetupCreateStepHandler account={account} back={onStepBack} next={onStepNext} onChangeGeneral={onChangeGeneral} onChangeAddress={onChangeAddress} onSubmit={onSubmit} {...formState} />
    </Fragment>
  )
}

AddAccounts.propTypes = {
  setAlert: PropTypes.func.isRequired,
  createCompany: PropTypes.func.isRequired,
  editCompany: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  company: state.company,
})

export default connect(mapStateToProps, { setAlert, createCompany, editCompany })(AddAccounts);
