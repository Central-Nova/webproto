import React, { Fragment } from 'react'

const EmailInvite = ({ emailsState, onChange, onSubmit }) => {
  return (
    <Fragment>
    <div className="form grid-invite">
      <div className="form email">
        <i className="fas fa-paper-plane"></i>
        <input
          onChange={(e)=> onChange(e)}
          value={emailsState}
          type="text"
          placeholder="Enter emails separated by a comma."
        />
      </div>
      <div className="">
      <button onClick={() => onSubmit()} className="btn btn-primary btn-small">Invite</button>
      </div>
    </div>
    <div className=""></div>
  </Fragment>
  )
}

export default EmailInvite
