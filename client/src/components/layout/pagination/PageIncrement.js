import React, { Fragment } from 'react'

const PageIncrement = ({ action, onChange }) => {
  return (
    <Fragment>
    {action === 'next' ? (
    <button onClick={()=> onChange(action)} className="btn btn-light next">
    Next<i className="fas fa-chevron-right"></i>
  </button>
  ):(
    <button onClick={()=> onChange(action)} className="btn btn-light back">
    <i className="fas fa-chevron-left"></i>Back
  </button>
  )}
</Fragment>
  )
}

export default PageIncrement
