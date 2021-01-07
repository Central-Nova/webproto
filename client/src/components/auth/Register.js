import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Actions
import { register } from '../../actions/auth';
import { setAlert } from '../../actions/alert';
import auth from '../../reducers/auth';


const Register = ({ setAlert, register, isAuthenticated, user, registered }) => {


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  const { firstName, lastName, email, password, password2 } = formData;

  const onChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert({title: 'Error', description: 'Passwords do not match'}, 'danger');
    } else {
      register({firstName, lastName, email, password})
    }
  };

  if(isAuthenticated && user!== null) {
    return <Redirect to='/dashboard'/>
  }

  if (registered) {
    return <Redirect to='/login'/>
  }

  return (
    <Fragment>
      <div className="landing-container">
        <section className="landing-img-container">
          <div className="overlay"></div>
          <img src={require("../../img/whslanding.jpg")} alt="" className="landing-img" />
          <div className="image-text">
            <h1 className="text-white text-large">Lorem Ipsum Dolor Sit Amet</h1>
            <p className="text-white text-regular">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia,
              consequatur. Nobis mollitia culpa laborum quisquam.
            </p>
          </div>
        </section>
        <section className="landing-form-container">
        <i className="logo-landing fas fa-warehouse fa-5x text-primary"></i>
        <h1 className="text-medium">Register Your Account</h1>
        <form className="form mx-4">
          <div className="form form form-item">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={e => onChange(e)}
              placeholder="First Name"
            />
          </div>
          <div className="form form form-item">
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={e => onChange(e)}
              placeholder="Last Name"
            />
          </div>
          <div className="form form-item">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={e => onChange(e)}
              placeholder="Email Address"
            />
          </div>
          <div className="form form-item">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={e => onChange(e)}
              placeholder="Password"
            />
          </div>
          <div className="form form-item">
            <input
              type="password"
              id="password2"
              name="password2"
              value={password2}
              onChange={e => onChange(e)}
              placeholder="Confirm Password"
            />
          </div>
        </form>
        <div className="button-container my-1">
        <button onClick={e=> onSubmit(e)} className="btn btn-large btn-primary mx-4"
            >Sign Up</button>
          <div className="separator">or</div>
          <a className="btn btn-large btn-light mx-4" href="http://localhost:5000/api/auth/google/register"
            ><i className="fab fa-google mx-1"></i>Sign Up with Google</a>
        </div>
        <p>Already have an account? <Link to="/login">Sign in here.</Link></p>
      </section>
      </div>
    </Fragment>
  )
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  registered: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  registered: state.auth.registered
  
})

export default connect(mapStateToProps, { setAlert, register })(Register);