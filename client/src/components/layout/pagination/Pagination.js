import React, { useEffect } from 'react'
import PageButton from './PageButton';
import PageIncrement from './PageIncrement';



const Pagination = ({ current, total, onPageChange, onPageIncrement }) => {

  const generateLeftPages = (current) => {
    let leftPages = []

    if (current === 0) {
      return []
    } else if (current -3 <= 0) {
      for (let i = current; i > 0 ; i--) {
        leftPages.push(i)
      }
    } else {
      for (let i = current; i > current -3 ; i--) {
        leftPages.push(i)
      }

    }
    return leftPages
  }

  const generateRightPages = (current, total) => {
    console.log('current: ', current);

    let rightPages = []
    if (current + 3 > total) {
      for (let i = total; i > current; i--) {
        rightPages.push(i)
      }
    } else {
      for (let i = current + 3; i > current; i--) {
        rightPages.push(i)
      }
    }
    return rightPages
  }

  let leftPagesToRender = generateLeftPages(current);
  let rightPagesToRender = generateRightPages(current, total);
  
  return (
    <div className="container-pagination-grid">
      <div className="buttons">
        <PageIncrement action='next' onChange={onPageIncrement}/>

        {rightPagesToRender.length > 0 && rightPagesToRender.map(number => 
        <PageButton key={number} number={number} current={current} onChange={onPageChange} />)}

        {leftPagesToRender.length > 0 && leftPagesToRender.map(number => 
        <PageButton key={number} number={number} current={current} onChange={onPageChange} />)}

        {current !== 0 && <PageIncrement action='back' onChange={onPageIncrement}/>}
      </div>
    </div>
  )
}

export default Pagination
