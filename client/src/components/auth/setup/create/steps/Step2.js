import React, { Fragment } from 'react'

const Step2 = (props) => {
  const {back, next, onChangeGeneral, onSubmit, formData: { email, phone } } = props;

  let watchedFields = {email, phone}

  console.log('step 3 props: ', props)

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

    if (!filled) {

      let messages = [];
      
      for (let object in emptyFields) {
        let key = Object.keys(emptyFields[object]);
        messages.push(createErrMess(`${key}`));
        console.log('messages: ', messages);
    }
  
    next(e,filled, messages);
    } else {
      onSubmit(e);
    }
}

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
              <button className="btn btn-small btn-primary my-1" onClick={e => onClick(e)}>
                Create
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
    </Fragment>
  )
}

export default Step2;
