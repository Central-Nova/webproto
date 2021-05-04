import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { createCompany } from '../../../../actions/company';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import SideNav from '../sidenav/SideNav';
import MainFields from './MainFields';
import AccountOptions from './AccountOptions';


const CreateCompany = ({ createCompany, company: { profile }}) => {

  const [formState, setFormState] = useState({
    businessName: '',
    ein: ''
  })


  const formChange = (e) => {
    setFormState({
      ...formState, 
      [e.target.name]: e.target.value
    })
  }

  const onClick = (e) => {
    e.preventDefault();
    createCompany(formState);
  }

  return (
    <Fragment>
    <div className="logo">
      <i className="text-primary fas fa-warehouse fa-4x"></i>
    </div>
    <div className="container-company-double">
      <div className="button-back">
        <Link className="btn btn-light btn-large" to="/company">
          <i className="fas fa-long-arrow-alt-left"></i>Back
        </Link>
      </div>
      <SideNav/>
      {profile !== null ? (
        <AccountOptions/>
        ) : (
        <MainFields formState={formState} formChange={formChange} onClick={onClick} />
      )}
    </div>
    </Fragment>
  )
}

CreateCompany.propTypes = {
createCompany: PropTypes.func.isRequired,
company: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  company: state.company
})

export default connect(mapStateToProps, { createCompany })(CreateCompany);
