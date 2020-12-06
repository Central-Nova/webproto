import React, { Fragment } from 'react'

const SetupCreateStep3 = ({back, next, onChangeGeneral, formData: {email, phone} }) => {

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
        <div className="side-bar-item">
          <p className="text-regular text-success">Address</p>
        </div>
        <div className="side-bar-item item-main">
          <p className="text-regular text-success">Contact</p>
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
        <div className="container-field my-4">
          <div className="container-text">
            <p className="text-regular text-primary">
              Business Contact Information
            </p>
            <p className="text-small text-primary-light">
              How your customers can reach you.
            </p>
          </div>
          <div className="form">
            <form action="">
              <div className="form form-item">
                <input 
                  type="email" 
                  name="email"
                  value={email}
                  onChange={e=>onChangeGeneral(e)}
                  placeholder="Email Address" />
              </div>
              <div className="form form-item">
                <input 
                  type="text" 
                  name="phone"
                  value={phone}
                  onChange={e=>onChangeGeneral(e)}
                  placeholder="Phone Number" />
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

export default SetupCreateStep3;
