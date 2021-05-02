import React from 'react'

const SideNav = () => {
  return (
    <div className="side-bar bg-light">
        <div className="side-bar-item item-main">
          <div className="icon-number text-small text-primary bg-white">1</div>
          <p className="text-regular text-primary">Business Name</p>
        </div>
        <div className="side-bar-item item-main">
          <div className="icon-number text-small text-primary bg-white">2</div>
          <p className="text-regular text-primary">Primary Acount</p>
        </div>
        <div className="side-bar-item">
          <p className="text-regular text-primary">Address</p>
        </div>
        <div className="side-bar-item">
          <p className="text-regular text-primary">Contact</p>
        </div>
        <div className="side-bar-item">
          <p className="text-regular text-primary">Team</p>
        </div>
        <div className="side-bar-item item-main">
          <div className="icon-number text-small text-primary bg-white">3</div>
          <p className="text-regular text-primary">Secondary Acount</p>
        </div>

        <div className="side-bar-item item-main">
          <div className="icon-number text-small text-primary bg-white">4</div>
          <p className="text-regular text-primary">Subscription</p>
        </div>

        <div className="side-bar-item item-main">
          <div className="icon-number text-small text-primary bg-white">5</div>
          <p className="text-regular text-primary">Payment Details</p>
        </div>
      </div>
  )
}

export default SideNav;