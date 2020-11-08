import React from 'react'
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../routing/PrivateRoute';

// Components
import Register from '../auth/Register'
import Login from '../auth/Login'
import Dashboard from '../dashboard/Dashboard';


const Routes = (props) => {
  return (
    <Switch>
      <Route exact path='/register' component={Register}/>
      <Route exact path='/login' component={Login}/>
      <PrivateRoute exact path='/dashboard' component={Dashboard}/>
    </Switch>
  )
}

export default Routes;
