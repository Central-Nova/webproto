import React from 'react'
import CreateCard from './cards/CreateCard';
import JoinCard from './cards/JoinCard'

const SetupMain = () => {

  return (
    <div className="container-company-single">
    <div className="company-headline-text">
      <h1 className="text-primary text-large">Company Setup</h1>
      <p className="text-primary-light text-regular">
        You're not yet part of a company.
      </p>
    </div>
    <div className="container-buttons">
      <CreateCard />
      <JoinCard />
    </div>
  </div>
  )
}

export default SetupMain;