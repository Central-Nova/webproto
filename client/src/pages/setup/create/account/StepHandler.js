import React from 'react'

// Components
import Step1 from './Step1';
import Step2 from './Step2';


const StepHandler = ( props ) => {
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
  return (
    null
  );


}


export default StepHandler;
