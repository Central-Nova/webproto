import React from 'react'
import { Link } from 'react-router-dom';

const CreateCard = ({ handleCreateClick }) => {
  return (
    <Link to='/create-company'>
      <div className="button-option btn btn-light">
        <i className="fas fa-user-plus fa-4x "></i>
        <div className="text-box">
          <p className="text-regular">Create</p>
          <p className="text-small">Create a new company</p>
        </div>
        <i className="fas fa-caret-right fa-4x"></i>
      </div>
    </Link>
  )
}

export default CreateCard;
