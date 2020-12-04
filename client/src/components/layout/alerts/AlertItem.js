import React, { Fragment } from 'react'

const AlertItem = ({msg, alertType}) => {

  if (alertType =='success') {
    return(
      <div className="alert">
      <div className={`bg-${alertType} alert-icon`}>
        <i className="fas fa-check"></i>
      </div>
      <div className="alert-message">
        <p className={`text-${alertType}`}>{msg.title}</p>
        <p className="text-light">{msg.description}</p>
      </div>
      <div className="alert-close text-light">
        <i className="fas fa-times"></i>
        <p className="text-light">CLOSE</p>
      </div>
    </div>
    )}
    if (alertType =='warning') {
      return(
        <div className="alert">
        <div className={`bg-${alertType} alert-icon`}>
          <i className="fas fa-exclamation"></i>
        </div>
        <div className="alert-message">
          <p className={`text-${alertType}`}>{msg.title}</p>
          <p className="text-light">{msg.description}</p>
        </div>
        <div className="alert-close text-light">
          <i className="fas fa-times"></i>
          <p className="text-light">CLOSE</p>
        </div>
      </div>
      )}
      if (alertType =='danger') {
        return(
          <div className="alert">
          <div className={`bg-${alertType} alert-icon`}>
            <i className="fas fa-times"></i>
          </div>
          <div className="alert-message">
            <p className={`text-${alertType}`}>{msg.title}</p>
            <p className="text-light">{msg.description}</p>
          </div>
          <div className="alert-close text-light">
            <i className="fas fa-times"></i>
            <p className="text-light">CLOSE</p>
          </div>
        </div>
        )}
  }

export default AlertItem;