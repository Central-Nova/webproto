import React, { Fragment } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setAlert } from '../../../../../actions/alert';

const Step1 = ( props ) => {

  const { next, onChangeGeneral, formData: {businessName, ein}  } = props;

  let watchedFields = {businessName, ein}

  console.log('step 1 props: ', props)

  const createErrMess = (field) => {
    let capitalized = field.charAt(0).toUpperCase() + field.slice(1);

    return {title: 'Error', description: `${capitalized} is required.`}
  }

  // Array to hold empty fields as objects
  let emptyFields = [];

  // Loop through businessAddress to push empty fields into array
  for (let field in watchedFields) {
    if (watchedFields[field] === '') {
      let key = `${field}`;
      let emptyKey = {[key]: watchedFields[field] }

      emptyFields.push(emptyKey);
    }
  }


  let filled = false;

  // If emptyFields have objects, then filled is false;
  if (emptyFields !== null && emptyFields.length > 0) {
    filled = false;
  } else {
    filled = true;
  }


  // On click to send array of messages to parent on click handler
  const onClick = (e) => {
    let messages = [];
    
    for (let object in emptyFields) {
      let key = Object.keys(emptyFields[object]);
      messages.push(createErrMess(`${key}`));
      console.log('messages: ', messages);
  }

  next(e,filled, messages);
}

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
            </form>
          </div>
        </div>
        <div className="container-field my-4">
          <div className="container-text">
            <p className="text-regular text-primary">Business EIN</p>
            <p className="text-small text-primary-light">This will be used to verify your business.</p>
          </div>
          <div className="form">
            <form action="">
              <div className="form form-item">
                <input type="text"
                name="ein"
                value={ein}
                onChange={e=>onChangeGeneral(e)}
                placeholder="Name"
                />
              </div>
              <button className="btn btn-small btn-primary my-1" onClick={(e)=>onClick(e)}>
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
