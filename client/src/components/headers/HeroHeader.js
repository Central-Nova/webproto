import React from 'react'

const HeroHeader = ({ title, description }) => {
  return (
    <div className="container-headline">
      <p className="text-primary text-medium">{title}</p>
      <p className="text-primary-light text-small">
        {description}
      </p>
  </div>
  )
}

export default HeroHeader
