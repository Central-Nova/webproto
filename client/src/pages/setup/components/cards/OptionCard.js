import React from 'react'
import { Link } from 'react-router-dom';

const OptionCard = ({link, icon, children, testid}) => {
  return (
    <Link to={link} data-testid={`opt-${testid}-btn`}>
      <div className="button-option btn btn-light">
        <i className={icon}></i>
        <div className="text-box">
            {children}
        </div>
        <i className="fas fa-caret-right fa-4x"></i>
      </div>
    </Link>
  )
}

export default OptionCard;
