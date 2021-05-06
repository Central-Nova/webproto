import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAlert } from '../../../../actions/alert';
import { addAccountToCompany } from '../../../../actions/company';
import { Link, Redirect, useParams } from 'react-router-dom';

// Utils
import { removeEmptyFields, removeEmptyObjects } from '../../../../lib/sanitize';

// Components
import StepHandler from './StepHandler';
import SideNav from '../sidenav/SideNav';
import LargeHeader from '../../components/headers/LargeHeader';
import BackButton from '../../../../components/buttons/BackButton'

const initialState = {
  errorMessages: [],
  emptyFields: ['street', 'aptSuite', 'city', 'state', 'zip'],
  step: 1,
}

const createErrMess = (field) => {
  let capitalized = field.charAt(0).toUpperCase() + field.slice(1);

  return {title: 'Error', description: `${capitalized} is required.`}
}

const AddAccounts = ({ setAlert, addAccountToCompany, user, company: { profile, loading }}) => {

  const { account } = useParams();

  const [formState, setFormState] = useState({
    formData: {
      company: user.company,
      account,
      businessAddress: {
        street: '',
        suite: '',
        city: '',
        state: '',
        zip: ''
      },
      warehouseAddress: {
        street: '',
        suite: '',
        city: '',
        state: '',
        zip: ''
      },
      email: '',
      phone: '',
    }
  });

  const [ validationState, setValidationState ] = useState(initialState)
  const { step, errorMessages, emptyFields } = validationState;
  const { formData } = formState;
  const { businessAddress, email, phone } = formData;

  useEffect(() => {
    let newEmptyFields = [];
    if (step === 1) {
      // Loop through businessAddress to push empty fields into array
      for (let field in businessAddress) {
        if (businessAddress[field] === '') {
          newEmptyFields.push(`${field}`)
        }
      }
    } if (step === 2) {
      if (email === '') {
        newEmptyFields.push('email')
      } if (phone === '') {
        newEmptyFields.push('phone')
      }
    }
    setValidationState({...validationState, emptyFields: [...newEmptyFields]});
  }, [businessAddress, emptyFields, step, email, phone])

  useEffect(() => {
    // Loop through emptyFields and create an error message for each value
    let newMessages = []
    for (let i in emptyFields) {
      newMessages.push(createErrMess(emptyFields[i]));
    }
    setValidationState({...validationState, errorMessages: [...newMessages]})
  }, [emptyFields])

  // Handles changes for address forms
  const onChangeAddress = (e, addressType) => {
    setFormState({
      formData: {
        ...formData, 
        [addressType]: {
          ...formData[addressType],
          [e.target.name]: e.target.value
        }
      }
    })
  }

  // Handles change for non-address forms
  const onChangeGeneral = e => setFormState({
    formData: {
      ...formData, [e.target.name]: e.target.value
    }
  })

  // Previous Step
  const onStepBack = e => setValidationState({
    ...validationState, step: step -1
  });

  // Next Step
  const onStepNext = (e) => {
    if (errorMessages.length === 0) {
      setValidationState({
      ...validationState, step: step + 1 
    })} 
    else {
      e.preventDefault();

      for (let msg in errorMessages) {
        setAlert(errorMessages[msg], 'danger');
      }
    }
  }

    // Form Submit
  const onSubmit = e => {
    if (errorMessages.length === 0) {
      e.preventDefault();
      removeEmptyFields(formData);
      removeEmptyObjects(formData);
      addAccountToCompany(formData);
    } else {
      e.preventDefault();

      for (let msg in errorMessages) {
        setAlert(errorMessages[msg], 'danger');
      }
    }
  }

  console.log('formData: ', formData);
  console.log('validationState: ', validationState);

  if (!loading && profile.operation !== undefined ) {
    return <Redirect to='/create-team' />
  }

  return (
    <Fragment>
      <div className="logo">
        <i className="text-primary fas fa-warehouse fa-4x"></i>
      </div>
      <div className="container-company-double">
        <SideNav/>
        <div className="container-company-main">
          <BackButton link='/create-company'/>
          <LargeHeader title={`${account.charAt(0).toUpperCase() + account.slice(1)} Account Setup`}/>
          <StepHandler back={onStepBack} next={onStepNext} onChangeGeneral={onChangeGeneral} onChangeAddress={onChangeAddress} onSubmit={onSubmit} formData={formData} step={step}/>
        </div>
      </div>
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
