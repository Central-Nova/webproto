import React from 'react'
import PageButton from './PageButton';
import PageIncrement from './PageIncrement';
import { generatePages } from '../../../lib/pagination';

const Pagination = ({ current, total, onPageChange, onPageIncrement }) => {

  let pagesToRender = generatePages(current, total);
  
  return (
    <div className="container-pagination-grid">
      <div className="buttons">
        {current < (total - 1) && <PageIncrement action='next' onChange={onPageIncrement}/>}

        {pagesToRender.length > 0 && pagesToRender.map(number => 
        <PageButton key={number} number={number} current={current} onChange={onPageChange} />)}

        {current !== 0 && <PageIncrement action='back' onChange={onPageIncrement}/>}
      </div>
    </div>
  )
}

export default Pagination
