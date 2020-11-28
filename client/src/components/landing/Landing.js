import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'


const Landing = () => {
  return(
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
        <h1 className="text-medium">Welcome</h1>
        <div className="button-container">
          <Link className="btn btn-large btn-primary mx-4" to='/login'>
            Log In
          </Link>
          <div className="my-1"></div>
          <Link className="btn btn-large btn-light mx-4" to='/register'
            >Sign Up</Link>
        </div>
      </section>
    </div>
    </Fragment>
  )
};

export default Landing;
