import React from 'react'

const PageButton = ({ number, current, onChange }) => {
  return (
    <button onClick={()=> onChange(number - 1)} className={`btn btn-${current + 1 === number ? 'primary' : 'light'}`}>{number}</button>
  )
}

export default PageButton
