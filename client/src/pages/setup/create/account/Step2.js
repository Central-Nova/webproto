import React, { Fragment } from 'react'

// Components
import FieldContainer from '../../components/containers/FieldContainer';

const Step2 = (props) => {
  const { onChangeGeneral, onSubmit, formData: { email, phone } } = props;

  return (
    <Fragment>
      <FieldContainer 
      label='Business Contact Information'
      description='How your contacts can reach you.'
      last={true}>
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
          </form>
        </div>
      </FieldContainer>
      <button className="btn btn-primary btn-small btn-next my-1" onClick={e => onSubmit(e)}>
        Create
      </button>
    </Fragment>
  )
}

export default Step2;
