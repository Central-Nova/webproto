import React, {Fragment} from 'react'

const TeamSlotItem = ({index, employee: { email }, onChange, onRemove}) => {
  return (
    <Fragment>
      <div className="employee">
        <input onChange={e=> onChange(index,e)} name="email" value={email} placeholder="Email" type="text" />
      </div>
      <div className="btn-remove">
        <button onClick={(e) => onRemove(index,e)} className="btn btn-minus">
          <div className="circle"><i className="fas fa-minus"></i></div>
        </button>
      </div>
    </Fragment>
  )
}

export default TeamSlotItem