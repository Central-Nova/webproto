import React from 'react'

const Pagination = () => {
  return (
    <div className="container-pagination-grid">
      <div className="buttons">
        <button className="btn btn-light next">
          Next<i className="fas fa-chevron-right"></i>
        </button>
        <button className="btn btn-light">3</button>
        <button className="btn btn-light">2</button>
        <button className="btn btn-primary">1</button>
        <button className="btn btn-light back">
          <i className="fas fa-chevron-left"></i>Back
        </button>
      </div>
    </div>
  )
}

export default Pagination
