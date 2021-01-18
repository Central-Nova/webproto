import React from 'react'
import PageButton from './PageButton';
import PageIncrement from './PageIncrement';



const Pagination = ({ current, total, onPageChange, onPageIncrement }) => {

  const generateLeftPages = (current) => {
    let leftPages = []

    // If we are on the first page (page index 0), don't generate pages
    if (current === 0) {
      return []
    } else if (current -3 <= 0) {
      // If the next three pages go past 0 (-1, -2, etc), only generate from current to 0 
      for (let i = current; i > 0 ; i--) {
        leftPages.push(i)
      }
    } else {
      // Generate previous three pages
      for (let i = current; i > current -3 ; i--) {
        leftPages.push(i)
      }

    }
    console.log('leftPages: ', leftPages);

    return leftPages
  }

  const generateRightPages = (current, total) => {
    let rightPages = []
    // If there are no more than 3 pages after current page
    if (current + 3 > total) {
        // Generate pages from total to current
      for (let i = total; i > current; i--) {
        rightPages.push(i)
      }
    } else {
      // Generate the next three pages
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
