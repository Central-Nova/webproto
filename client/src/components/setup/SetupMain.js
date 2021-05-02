import React from 'react'
import OptionCard from './cards/OptionCard';
import LargeHeader from './headers/LargeHeader';

const SetupMain = () => {

  return (
    <div className="container-company-single">
      <LargeHeader 
      title='Company Setup' 
      description="You're not yet part of a company."/>
      <div className="container-buttons">
        <OptionCard link='/create-company' icon='fas fa-user-plus fa-4x'>
          <p className="text-regular">Create</p>
          <p className="text-small">Create a new company</p>
        </OptionCard>
        <OptionCard link='/join-company' icon='fas fa-users fa-4x'>
          <p className="text-regular">Join</p>
          <p className="text-small">Join an existing company</p>
        </OptionCard>
      </div>
    </div>
  )
}

export default SetupMain;