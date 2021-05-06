import React from 'react';
import { Link } from 'react-router-dom';

// Components
import LargeHeader from '../components/headers/LargeHeader';
import FieldContainer from '../components/containers/FieldContainer';
import BackButton from '../../../components/buttons/BackButton';

const JoinCompany = () => {
  return (
    <div className="container-company-single">
      <BackButton link='/company'/>
      <LargeHeader 
      title='Join a company' 
      description='Enter the company information' />
      <FieldContainer
        label='Received an invitation?'
        description='Check your invitation email for your invitation code.'
        last={true}>
          <div className="form">
            <form action="">
              <div className="form form-item">
                <input type="text" placeholder="Invitation Code" />
              </div>
            </form>
          </div>
        <button className="btn btn-small btn-primary my-1" type="submit">
          Join
        </button>
      </FieldContainer>
      <FieldContainer
        label="Don't have an invitation?"
        description='Send an email to your company admin for an invitation code.'
        last={true}>
          <div className="form">
            <form action="">
              <div className="form form-item">
                <input type="text" placeholder="Organization Email" />
              </div>
            </form>
          </div>
        <button className="btn btn-small btn-light my-1" type="submit">
          Request
        </button>
      </FieldContainer>
    </div>
  )
}

export default JoinCompany