import React, { Fragment } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setAlert } from '../../../../../actions/alert';

const Step1 = ( props ) => {

  const { next, onChangeGeneral, formData: {businessName}  } = props;

  console.log('step 1 props: ', props)

  const errorMsg = [{title: 'Error', description: 'Business name is required.'}]
  let filled = false;

  console.log('errorMsg', errorMsg);

  if (businessName !== '') {
    filled = true;
  } else filled = false;

  console.log('filled: ', filled);

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
                placeholder="Name"
                />
              </div>
              <button className="btn btn-small btn-primary my-1" onClick={(e)=>next(e,filled,errorMsg)}>
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

Step1.propTypes = {
  setAlert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, { setAlert })(Step1);
