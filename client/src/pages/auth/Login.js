import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Action Creators
import { loginUser, loadUser } from '../../actions/auth';

export const Login = ({ loginUser, isAuthenticated, user, company = null }) => {

  const [ formData, setFormData ] = useState({
    email: '',
    password: ''
  })

  const { email, password } = formData;

  const onChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value})
  };

  const onSubmit = e => {
    e.preventDefault();
    loginUser(formData);
  }

  const onGoogleClick = e => {
    console.log('Clicked!')

  }

  if (isAuthenticated && user !== null) {
    if (company === null) {
      return <Redirect to='/company'/>
    } else {
      return <Redirect to='/dashboard'/>
    }
  }

  if(isAuthenticated && user!== null) {
    return <Redirect to='/dashboard'/>
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
        <h1 className="text-medium">Sign Into Your Account</h1>
        <form 
        data-testid='login-form'
        className="form mx-4">
          <div className="form form-item">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={e=> onChange(e)}
              placeholder="Email Address"
            />
          </div>
          <div className="form form-item">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={e=> onChange(e)}
              placeholder="Password"
            />
          </div>
        </form>
        <div className="button-container my-1">
        <button data-testid='local-login-btn' onClick={e => onSubmit(e)} className="btn btn-large btn-primary mx-4">Sign In</button>

          <div className="separator">or</div>
          <a className="btn btn-large btn-light mx-4" onClick={e=> onGoogleClick(e)} href='http://localhost:5000/api/auth/google/login'
            ><i className="fab fa-google mx-1"></i>Sign In with Google</a>
        </div>
        <p>
          Don't have an account? <Link to="/register">Create one here.</Link>
        </p>
      </section>
      </div>
    </Fragment>
  );
};

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object,
  company: PropTypes.object,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  company: state.company.company
})

export default connect(mapStateToProps, { loginUser, loadUser })(Login);
