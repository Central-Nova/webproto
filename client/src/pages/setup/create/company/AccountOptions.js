import React from 'react'
import { Link } from 'react-router-dom';

// Components
import OptionCard from '../../components/cards/OptionCard';
import LargeHeader from '../../components/headers/LargeHeader';
import BackButton from '../../../../components/buttons/BackButton';

const AccountOptions = () => {
  return (
    <div className="container-company-main">
      <BackButton link='/company'/>
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
  )
}

export default AccountOptions;
