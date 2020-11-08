import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { loadUser } from './actions/auth';

// Components
import Landing from './components/landing/Landing.js';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';

// Redux
import { Provider } from 'react-redux';
import store from './store';

// Css
import './App.css';


const App = () => {
    useEffect(()=> {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
            <Route exact path='/' component={Landing}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/register' component={Register}/>
            <Route exact path='/dashboard' component={Dashboard}/>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
