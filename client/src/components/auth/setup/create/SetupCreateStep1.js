import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';

const SetupCreateStep1 = ( props ) => {

  const { next, onChangeGeneral } = props;

  const businessName='';

  console.log('step 1 props: ', props)
  return (
    <Fragment>
    <div className="logo">
      <i className="text-primary fas fa-warehouse fa-4x"></i>
    </div>
    <div className="container-company-double">
      <div className="button-back">
        <Link className="btn btn-light btn-large" to="/company">
          <i className="fas fa-long-arrow-alt-left"></i>Back
        </Link>
      </div>
      <div className="side-bar bg-light">
        <div className="side-bar-item item-main">
          <div className="icon-number text-small text-primary bg-white">1</div>
          <p className="text-regular text-primary">Business</p>
        </div>
        <div className="side-bar-item item-main">
          <p className="text-regular text-success">Name</p>
        </div>
        <div className="side-bar-item">
          <p className="text-regular text-primary">Address</p>
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
        <div className="container-field my-4">
          <div className="container-text">
            <p className="text-regular text-primary">Business Name</p>
            <p className="text-small text-primary-light">Your registered business name. Other businesses will need this to
              identify you.</p>
          </div>
          <div className="form">
            <form action="">
              <div className="form form-item">
                <input type="text"
                name="businessName"
                value={businessName}
                  onChange={e=>onChangeGeneral(e)}
                />
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

export default SetupCreateStep1;
