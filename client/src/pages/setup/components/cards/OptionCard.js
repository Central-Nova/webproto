import React from 'react'
import { Link } from 'react-router-dom';

const OptionCard = ({link, icon, children}) => {
  return (
    <Link to={link}>
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
