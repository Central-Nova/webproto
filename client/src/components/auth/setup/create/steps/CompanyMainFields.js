import React from 'react'

const CompanyMainFields = ({ formState, formChange, onClick }) => {

  const { businessName, ein } = formState;

  return (
    <div className="container-company-main">
        <div className="company-headline-text">
          <h1 className="text-large text-primary">Company Setup</h1>
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
                onChange={e=>formChange(e)}
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
                onChange={e=>formChange(e)}
                placeholder="Name"
                />
              </div>
              <button className="btn btn-small btn-primary my-1" onClick={(e)=>onClick(e)}>
                Submit 
              </button>
            </form>
          </div>
        </div>
      </div>
  )
}

export default CompanyMainFields;
