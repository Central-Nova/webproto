import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { loadUser } from './actions/auth';
import { loadRoles } from './actions/roles';

// Components
import Landing from './components/landing/Landing.js';
import Routes from './components/routing/Routes';

// Redux
import { Provider } from 'react-redux';
import store from './store';

// Css
import './App.css';


const App = () => {
    useEffect(()=> {
      store.dispatch(loadUser());
      store.dispatch(loadRoles());
    }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
        <Switch>
            <Route exact path='/' component={Landing}/>
            <Route component={Routes}/>
        </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
