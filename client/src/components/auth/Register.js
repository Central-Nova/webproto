import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';

// const [formData, setFormData] = useState({})

const Register = () => {
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
        <section class="landing-form-container">
        <i class="logo fas fa-warehouse fa-5x text-primary"></i>
        <h1 class="text-medium">Register Your Account</h1>
        <form action="/api/users" method="POST" class="form mx-4">
          <div class="form form form-item">
            <input
              type="text"
              id="name"
              name="name"
              value=""
              placeholder="Name"
            />
          </div>
          <div class="form form-item">
            <input
              type="email"
              id="email"
              name="email"
              value=""
              placeholder="Email Address"
            />
          </div>
          <div class="form form-item">
            <input
              type="password"
              id="password"
              name="password"
              value=""
              placeholder="Password"
            />
          </div>
          <div class="form form-item">
            <input
              type="password"
              id="password2"
              name="password2"
              value=""
              placeholder="Confirm Password"
            />
          </div>
          <div className="form form-item">
          <button type="submit" class="btn btn-large btn-primary">
            Sign Up
          </button>
          </div>
        </form>
        <div class="button-container my-1">
          <div class="separator">or</div>
          <a class="btn btn-large btn-light mx-4"
            ><i class="fab fa-google mx-1"></i>Sign Up with Google</a>
        </div>
        <p>Already have an account? <Link to="/login">Sign in here.</Link></p>
      </section>
      </div>
    </Fragment>
  )
}

export default Register;