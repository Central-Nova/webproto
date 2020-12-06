import React from 'react'
import SetupCreateStep1 from './SetupCreateStep1';
import SetupCreateStep2 from './SetupCreateStep2';
import SetupCreateStep3 from './SetupCreateStep3';
import SetupCreateStep4 from './SetupCreateStep4';

const SetupCreateStepHandler = ( props ) => {
  console.log('level 0 props: ', props)

  const { step } = props;

  if (step === 1) {
    return (
      <SetupCreateStep1 {...props} />
    )
  }
  if (step === 2) {
    return (
      <SetupCreateStep2 {...props}/>
    )
  }
  if (step === 3) {
    return (
      <SetupCreateStep3 {...props}/>
    )
  }
  if (step === 4) {
    return (
      <SetupCreateStep4 {...props}/>
    )
  }
  return (
null
  );


}

export default SetupCreateStepHandler;
