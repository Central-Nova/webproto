import React from 'react'

// Components
import LargeHeader from '../../components/headers/LargeHeader'
import FieldContainer from '../../components/containers/FieldContainer';
import BackButton from '../../../../components/buttons/BackButton';

const MainFields = ({ formState, formChange, onClick }) => {

  const { businessName, ein } = formState;

  return (
    <div className="container-company-main">
      <BackButton link='/create-company'/>
      <LargeHeader title='Company Setup'/>
      <FieldContainer 
      label='Business Name'
      description='Your registered business name. Other businesses will need this to identify you.'
      last={false}
      >
        <div className="form">
          <form action="">
            <div className="form form-item">
              <input type="text"
              name="businessName"
              value={businessName}
              onChange={e => formChange(e)}
              placeholder="Name"
              />
            </div>
          </form>
        </div>
      </FieldContainer>
      <FieldContainer 
      label='Business EIN'
      description='This will be used to verify your business.'
      last={true}
      >
        <div className="form">
          <form action="">
            <div className="form form-item">
              <input type="text"
              name="ein"
              value={ein}
              onChange={e => formChange(e)}
              placeholder="EIN"
              />
            </div>
          </form>
        </div>
        <button className="btn btn-small btn-primary my-1" onClick={(e)=>onClick(e)}>
          Submit 
        </button>
      </FieldContainer>
    </div>
  )
}

export default MainFields;
