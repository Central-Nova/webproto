import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';
import SetupChoice from './SetupChoice';
import SetupAccountChoice from './SetupAccountChoice'

const SetupMain = () => {

  const [action, setAction] = useState('');

  const handleCreateClick = () => {
    setAction('create')
  };

  const handleBackClick = () => {
    setAction('');
  }

  return (
    <Fragment>
    {action === 'create' ? ( 
    <SetupAccountChoice handleBackClick={handleBackClick}/>
  ) : (    
    <SetupChoice handleCreateClick={handleCreateClick}/>
)
    }

  </Fragment>
  )
}

export default SetupMain;