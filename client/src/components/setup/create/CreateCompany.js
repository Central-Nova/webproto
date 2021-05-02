import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { createCompany } from '../../../actions/company';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import SideNav from './sidenav/SideNav';
import OptionCard from '../cards/OptionCard';
import CompanyMainFields from './steps/CompanyMainFields';
import LargeHeader from '../headers/LargeHeader';


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
          <LargeHeader title='Primary Business Operation'/>
          <div className="container-buttons">
          <OptionCard link='/create-account/supplier' icon='fas fa-pallet fa-4x'>
            <p className="text-regular">Supplier</p>
            <p className="text-small">Use {"{App Name}"}'s functions to manage your wholesale selling tasks.</p>
          </OptionCard>
          <OptionCard link='/create-account/buyer' icon='fas fa-money-check-alt fa-4x'>
            <p className="text-regular">Buyer</p>
            <p className="text-small">Connect with suppliers on {"{App Name}"} and manage your purchasing tasks.</p>
          </OptionCard>
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
