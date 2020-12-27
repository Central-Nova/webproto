import React, { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadCompanyUsers } from '../../actions/users';

import Spinner from '../layout/Spinner';

const User = ({ users, loadCompanyUsers }) => {
  useEffect(()=> {
    loadCompanyUsers();
  }, [loadCompanyUsers])

  const { userId } = useParams();
  const { loading, profiles } = users;

  let profileToLoad = {};

  if (!loading) {
    let profileArray = profiles.filter((profile) => profile._id === userId);

    profileToLoad = {...profileArray[0]}
  }

  const { firstName, lastName, roles } = profileToLoad;

  const [ formState, setFormState ] = useState({})
 
  return (
    <Fragment>
    {loading ? (
    <Spinner/>
    ) : (
    <div className="container-dashboard">
        <div className="container-headline">
          <p className="text-primary text-large">{`${firstName} ${lastName}`}</p>
          <p className="text-primary-light text-small">
            Manage roles for this user.
          </p>
        </div>
        <div className="container-roleswitches-grid">
          <div className="grid-role-headers text-primary text-regular">
            <p className="col1">Category</p>
            <p className="col2">Manager</p>
            <p className="col3">Worker</p>
          </div>
          <hr className="my-1" />
          <div className="grid-role-item text-primary text-small">
            <p className="col1">Sales</p>
            <div className="col2">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="col3">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <hr className="my-1" />
          <div className="grid-role-item text-primary text-small">
            <p className="col1">Inventory</p>
            <div className="col2">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="col3">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <hr className="my-1" />
          <div className="grid-role-item text-primary text-small">
            <p className="col1">Warehouse</p>
            <div className="col2">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="col3">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <hr className="my-1" />
          <div className="grid-role-item text-primary text-small">
            <p className="col1">Fleet</p>
            <div className="col2">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="col3">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <hr className="my-1" />
          <div className="grid-role-item text-primary text-small">
            <p className="col1">Accounting</p>
            <div className="col2">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="col3">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <hr className="my-1" />
        </div>
        <button className="btn btn-small btn-back my-2">
          <i className="fas fa-long-arrow-alt-left"></i><Link to="users">Back</Link>
        </button>
      </div>
    )
    }
      </Fragment>
  )
}

User.propTypes = {
  loadCompanyUsers: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  users: state.users
})

export default connect(mapStateToProps, { loadCompanyUsers })(User);
