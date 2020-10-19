import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
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
        <h1 className="text-medium">Sign Into Your Account</h1>
        <form action="/api/users/login" method="POST" className="form mx-4">
          <div className="form form-item">
            <input
              type="email"
              id="email"
              name="email"
              value=""
              placeholder="Email Address"
            />
          </div>
          <div className="form form-item">
            <input
              type="password"
              id="password"
              name="password"
              value=""
              placeholder="Password"
            />
          </div>
          <div className="form form-item">
          <button type="submit" className="btn btn-large btn-primary">
            Sign In
          </button>
          </div>
        </form>
        <div className="button-container my-1">
          <div className="separator">or</div>
          <a className="btn btn-large btn-light mx-4"
            ><i className="fab fa-google mx-1"></i>Sign In with Google</a>
        </div>
        <p>
          Don't have an account? <Link to="/register">Create one here.</Link>
        </p>
      </section>
      </div>
    </Fragment>
  )
}

export default Login;
