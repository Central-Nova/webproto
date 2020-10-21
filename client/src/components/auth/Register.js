import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Actions
import { register } from '../../actions/auth';
import { setAlert } from '../../actions/alert';


const Register = ({ setAlert, register }) => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  const { name, email, password, password2 } = formData;

  const onChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({name, email, password})
    }
  };


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
        <i className="logo fas fa-warehouse fa-5x text-primary"></i>
        <h1 className="text-medium">Register Your Account</h1>
        <form onSubmit={e=> onSubmit(e)} className="form mx-4">
          <div className="form form form-item">
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={e => onChange(e)}
              placeholder="Name"
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
          <div className="form form-item">
          <input type="submit" className="btn btn-large btn-primary" value='Sign Up'/>
          </div>
        </form>
        <div className="button-container my-1">
          <div className="separator">or</div>
          <Link className="btn btn-large btn-light mx-4"
            ><i className="fab fa-google mx-1"></i>Sign Up with Google</Link>
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
}

const mapStateToProps = state => ({
  
})

export default connect(mapStateToProps, { setAlert, register })(Register);