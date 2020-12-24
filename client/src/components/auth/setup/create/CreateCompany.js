import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { createCompany } from '../../../../actions/company';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SideNav from './sidenav/SideNav';
import SupplierCard from './cards/SupplierCard'
import BuyerCard from './cards/BuyerCard'
import CompanyMainFields from './steps/CompanyMainFields';


const CreateCompany = ({ createCompany, company: { profile }, user}) => {

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


  // Render the one that needs to be completed

  // If secondary isn't done, give to secondary (link). Normally, the first part would lead right into 2nd part.
  // Check if they wanna re-use. If so, just create 2nd, if not, let them fill out again (how to show same form again).

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
        <div className="container-company-main">
          <div className="company-headline-text">
            <h1 className="text-large text-primary">Primary Business Operation</h1>
          </div>
          <div className="container-buttons">
                <SupplierCard/>
                <BuyerCard/>
          </div>
        </div>
      ) : (
        <CompanyMainFields formState={formState} formChange={formChange} onClick={onClick} />
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
  user: state.auth.user,
  company: state.company
})

export default connect(mapStateToProps, { createCompany })(CreateCompany);
