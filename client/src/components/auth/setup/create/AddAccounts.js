import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAlert } from '../../../../actions/alert';
import { addAccountToCompany } from '../../../../actions/company';
import { Redirect, useParams } from 'react-router-dom';

import AccountStepHandler from './AccountStepHandler';

const removeEmptyFields = (data) => {
  Object.keys(data).forEach(key=> {
    if (typeof data[key] === 'object') {
      Object.keys(data[key]).forEach(nestkey => {
        if (data[key][nestkey] === '') {
          delete data[key][nestkey]
        }
      })
    } else {
      if (data[key] === '') {
        delete data[key]
      }
    }
  })
}

const removeEmptyObjects = (data) => {
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'object' && Object.keys(data[key]).length === 0) {
      delete data[key]
    }
  })
}

const AddAccounts = ({ setAlert, addAccountToCompany, user, company: { profile, loading }}) => {

  const { account } = useParams();

  const [formState, setFormState] = useState({
    step: 1,
    formData: {
      company: user.company,
      account,
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
  });
 
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
    removeEmptyFields(formData);
    removeEmptyObjects(formData);
    addAccountToCompany(formData);
  }

  if (!loading && profile.operation !== undefined ) {
    return <Redirect to='/create-team' />
  }

  return (
    <Fragment>
      <AccountStepHandler back={onStepBack} next={onStepNext} onChangeGeneral={onChangeGeneral} onChangeAddress={onChangeAddress} onSubmit={onSubmit} {...formState} />
    </Fragment>
  )
}

AddAccounts.propTypes = {
  setAlert: PropTypes.func.isRequired,
  addAccountToCompany: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  company: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  company: state.company,
})

export default connect(mapStateToProps, { setAlert, addAccountToCompany })(AddAccounts);
