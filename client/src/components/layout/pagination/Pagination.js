import React from 'react'
import PageButton from './PageButton';
import PageIncrement from './PageIncrement';



const Pagination = ({ current, total, onPageChange, onPageIncrement }) => {

  const generatePages = (total) => {
    let pagesArray = [];
  
    for (let i = total; i >= 1; i--) {
      pagesArray.push(i);
    }
  
    console.log('pagesArray: ', pagesArray);
    return pagesArray;
  }
  
  let pagesToRender = generatePages(total);
  console.log('pagesToRender: ', pagesToRender);
  
  return (
    <div className="container-pagination-grid">
      <div className="buttons">
        <PageIncrement action='next' onChange={onPageIncrement}/>
        {pagesToRender.length > 0 && pagesToRender.map(number => <PageButton key={number} number={number} current={current} onChange={onPageChange} />)}
        {current !== 0 && <PageIncrement action='back' onChange={onPageIncrement}/>}
      </div>
    </div>
  )
}

export default Pagination
