import React, { Fragment, useState } from 'react'
import SetupCreateStep from './SetupCreateStep';

const SetupCreateMain = () => {

  const [formState, setFormState] = useState({
    step: 1,
    form: {
      businessName: ''
    }
  })

  const onChange = e => setFormState({
    ...formState, [e.target.name]: e.target.value
  })

  const onStepBack = e => setFormState({
    ...formState, step: formState.step -1
  });

  const onStepNext = e => setFormState({
    ...formState, step: formState.step + 1 
  });

  return (
    <Fragment>
    <SetupCreateStep back={onStepBack} next={onStepNext} onChange={onChange} {...formState} />
    </Fragment>
  )
}

export default SetupCreateMain;
