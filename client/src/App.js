import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

// Components
import Landing from './components/landing/Landing.js';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';


import './App.css';


const App = () => {
  return (
    <Router>
      <Fragment>
          <Route exact path='/' component={Landing}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/register' component={Register}/>
          <Route exact path='/dashboard' component={Dashboard}/>

      </Fragment>
    </Router>
  );
};

export default App;
