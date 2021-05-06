import React, { Fragment } from 'react';
import ripple from './ripple.gif';

const Spinner = () => {
  return (
    <Fragment>
    <img
      src={ripple}
      style={{ width: '200px', margin: 'auto', display: 'block' }}
      alt="Loading..."
    />
  </Fragment>
  )
}

export default Spinner
