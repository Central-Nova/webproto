import React from 'react'
import { Link } from 'react-router-dom';

const LinkButton = ({ children, link }) => {
  return (
    <div className="button-back">
      <Link to={link}>
        {children}
      </Link>
    </div>
  )
}

export default LinkButton
