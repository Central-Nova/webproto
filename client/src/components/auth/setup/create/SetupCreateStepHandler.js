import React from 'react'

// Components
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';


const SetupCreateStepHandler = ( props ) => {
  console.log('level 0 props: ', props)

  const { step } = props;

  if (step === 1) {
    return (
      <Step1 {...props} />
    )
  }
  if (step === 2) {
    return (
      <Step2 {...props}/>
    )
  }
  if (step === 3) {
    return (
      <Step3 {...props}/>
    )
  }
  return (
null
  );


}


export default SetupCreateStepHandler;
