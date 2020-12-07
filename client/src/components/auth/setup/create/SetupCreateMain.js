import React, { Fragment, useState } from 'react'
import SetupCreateStepHandler from './SetupCreateStepHandler';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAlert } from '../../../../actions/alert';

const SetupCreateMain = ({ setAlert }) => {

  const [formState, setFormState] = useState({
    step: 1,
    formData: {
      businessName: '',
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
      phone: ''
    }
  })
  // Handling form changes separately to create one object to pass to api. This will make the company object cleaner in the api route.

  const { step, formData } = formState

const onChangeAddress = (e, type) => {


  if (type==='business') {
    setFormState({
      ...formState, formData: {...formData, businessAddress: { ...formData.businessAddress, [e.target.name]: e.target.value}
    }})
  }

  if (type==='warehouse') {
    setFormState({
      ...formState, formData: {...formData, warehouseAddress: { ...formData.warehouseAddress, [e.target.name]: e.target.value}
    }})
  }
}

  const onChangeGeneral = e => setFormState({
    ...formState, formData: {...formData, [e.target.name]: e.target.value}
  })

  const onStepBack = e => setFormState({
    ...formState, step: step -1
  });

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

  return (
    <Fragment>
    <SetupCreateStepHandler back={onStepBack} next={onStepNext} onChangeGeneral={onChangeGeneral} onChangeAddress={onChangeAddress} {...formState} />
    </Fragment>
  )
}

SetupCreateMain.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({

})

export default connect(mapStateToProps, { setAlert })(SetupCreateMain);
