import React from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { removeAlert } from '../../../actions/alert';

const AlertItem = ({id, msg, alertType, removeAlert}) => {

  if (alertType === 'success') {
    return(
      <div className="alert">
      <div className={`bg-${alertType} alert-icon`}>
        <i className="fas fa-check"></i>
      </div>
      <div className="alert-message">
        <p className={`text-${alertType}`}>{msg.title}</p>
        <p className="text-light">{msg.description}</p>
      </div>
      <div onClick={()=>removeAlert(id)} className="alert-close text-light">
        <i className="fas fa-times"></i>
        <p className="text-light">CLOSE</p>
      </div>
    </div>
    )}
    if (alertType === 'warning') {
      return(
        <div className="alert">
        <div className={`bg-${alertType} alert-icon`}>
          <i className="fas fa-exclamation"></i>
        </div>
        <div className="alert-message">
          <p className={`text-${alertType}`}>{msg.title}</p>
          <p className="text-light">{msg.description}</p>
        </div>
        <div onClick={()=>removeAlert(id)} className="alert-close text-light">
          <i className="fas fa-times"></i>
          <p className="text-light">CLOSE</p>
        </div>
      </div>
      )}
      if (alertType === 'danger') {
        return(
          <div className="alert">
          <div className={`bg-${alertType} alert-icon`}>
            <i className="fas fa-times"></i>
          </div>
          <div className="alert-message">
            <p className={`text-${alertType}`}>{msg.title}</p>
            <p className="text-light">{msg.description}</p>
          </div>
          <div onClick={()=>removeAlert(id)} className="alert-close text-light">
            <i className="fas fa-times"></i>
            <p className="text-light">CLOSE</p>
          </div>
        </div>
        )}
  }

AlertItem.propTypes = {
  removeAlert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps, { removeAlert })(AlertItem);