import React, { Fragment } from 'react'

const SetupCreateStep2 = ({ back, next }) => {
  return (
    <Fragment>
    <div className="logo">
      <i className="text-primary fas fa-warehouse fa-4x"></i>
    </div>
    <div className="container-company-double">
      <div className="button-back">
        <button className="btn btn-light btn-large" onClick={back}>
          <i className="fas fa-long-arrow-alt-left"></i>Back
        </button>
      </div>
      <div className="side-bar bg-light">
        <div className="side-bar-item item-main">
          <div className="icon-number text-small text-primary bg-white">1</div>
          <p className="text-regular text-primary">Business</p>
        </div>
        <div className="side-bar-item">
          <p className="text-regular text-success">Name</p>
        </div>
        <div className="side-bar-item item-main">
          <p className="text-regular text-success">Address</p>
        </div>
        <div className="side-bar-item">
          <p className="text-regular text-primary">Contact</p>
        </div>
        <div className="side-bar-item item-main">
          <div className="icon-number text-small text-primary bg-white">2</div>
          <p className="text-regular text-primary">Team</p>
        </div>
      </div>
      <div className="container-company-main">
        <div className="company-headline-text">
          <h1 className="text-large text-primary">Business Details</h1>
        </div>
        <div className="container-address-field my-4">
          <div className="container-text">
            <p className="text-regular text-primary">Business Address</p>
            <p className="text-small text-primary-light">
              Your registered business address.
            </p>
          </div>
          <form action="">
            <div className="form-grid">
              <div className="street">
                <input type="text" placeholder="Street" />
              </div>
              <div className="suite">
                <input type="text" placeholder="Apt/Suite" />
              </div>
              <div className="city"><input type="text" placeholder="City" /></div>
              <div className="state"><input type="text" placeholder="State" /></div>
              <div className="zip">
                <input type="text" placeholder="Zip Code" />
              </div>
            </div>
          </form>
        </div>
        <div className="container-address-field my-4">
          <div className="container-text">
            <p className="text-regular text-primary">Warehouse Address</p>
            <p className="text-small text-primary-light">
              Your ship from address for your orders.
            </p>
          </div>
          <div className="form">
            <form action="">
              <div className="form-grid">
                <div className="street">
                  <input type="text" placeholder="Street" />
                </div>
                <div className="suite">
                  <input type="text" placeholder="Apt/Suite" />
                </div>
                <div className="city">
                  <input type="text" placeholder="City" />
                </div>
                <div className="state">
                  <input type="text" placeholder="State" />
                </div>
                <div className="zip">
                  <input type="text" placeholder="Zip Code" />
                </div>
              </div>
              <button className="btn btn-small btn-primary my-1" onClick={next}>
                Next <i className="fas fa-long-arrow-alt-right"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </Fragment>
  )
}

export default SetupCreateStep2;
