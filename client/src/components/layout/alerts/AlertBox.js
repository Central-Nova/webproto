import React, { Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import AlertItem from './AlertItem';

const AlertBox = ({ alerts }) => {
  return (
    <Fragment>
    <div className="container-alert">

    {alerts !== null &&
    alerts.length > 0 &&
    alerts.map( (alert) => (
      <AlertItem key={alert.id} id={alert.id} msg={alert.msg} alertType={alert.alertType}/>
    ))}
    
  </div>
  </Fragment>
  )
}
AlertBox.propTypes = {
  alerts: PropTypes.array.isRequired,

}

const mapStateToProps = state => ({
  alerts: state.alert,
})

export default connect(mapStateToProps)(AlertBox);
