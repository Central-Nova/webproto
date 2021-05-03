import React, { Fragment } from 'react'

// Components
import FieldContainer from '../../components/containers/FieldContainer';

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
      <FieldContainer 
      label='Business Contact Information'
      description='How your contacts can reach you.'>
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
      </FieldContainer>
    </Fragment>
  )
}

export default Step2;