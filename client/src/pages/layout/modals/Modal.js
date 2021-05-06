import React, { Fragment } from 'react';
import ReactDom from 'react-dom';

const overlay = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
}

const modal = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: '50%',
  width: '50%',
  padding: '50pxx',
  backgroundColor: "#fff",
  borderRadius: '10px',
  boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.35), inset 0px 1px 1px rgba(0, 0, 0, 0.25), inset 0px -2px 2px rgba(0, 0, 0, 0.25)'
}

const button = {
  position: 'absolute',
  right: '0.5rem',
  marginRight: '1rem'
}

const childrenContainer = {
  position: 'fixed',
  display: 'grid',
  gridColumnTemplate: '1fr',
  alignItems: 'center',
  jufityItems: 'center',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  marginTop: '1rem',
  padding: '50px',

}

const Modal = ({ setModalState, open, children}) => {

  if (!open) return null
  
  return ReactDom.createPortal(
    <Fragment>
      <div style={overlay}/>
      <div style={modal}>
        <div style={button} className="my-1">
          <button onClick={()=> setModalState(!open)} className="btn btn-tiny btn-light">
          x
          </button>
        </div>
        <div style={childrenContainer}>
          {children}
        </div>
      </div>
    </Fragment>,
    document.getElementById('portal')
  )
}

export default Modal
