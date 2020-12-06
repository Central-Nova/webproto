import React, { Fragment, useState } from 'react'
import SetupCreateStepHandler from './SetupCreateStepHandler';

const SetupCreateMain = () => {

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
      phoneNumber: ''
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

  const onStepNext = e => setFormState({
    ...formState, step: step + 1 
  });

  return (
    <Fragment>
    <SetupCreateStepHandler back={onStepBack} next={onStepNext} onChangeGeneral={onChangeGeneral} onChangeAddress={onChangeAddress} {...formState} />
    </Fragment>
  )
}

export default SetupCreateMain;
