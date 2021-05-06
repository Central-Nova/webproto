import React, { Fragment } from 'react'
import LinkButton from './LinkButton';

const BackButton = ({link = undefined}) => {
  return (
    <Fragment>
      {link ? (
      <LinkButton link={link}>
        <button className="btn btn-light btn-small btn-back my-2" to="/company">
          <i className="fas fa-long-arrow-alt-left"></i>Back
        </button>
      </LinkButton>
      ) : (
      <div className="button-back">
        <button className="btn btn-light btn-small btn-back my-2">
            <i className="fas fa-long-arrow-alt-left"></i>Back
        </button>
      </div>
      )}
    </Fragment>
  )
}

export default BackButton
