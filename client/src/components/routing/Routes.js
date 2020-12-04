import React, { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../routing/PrivateRoute';

// Components
import Register from '../auth/Register'
import Login from '../auth/Login'
import Dashboard from '../dashboard/Dashboard';
import AlertBox from '../layout/alerts/AlertBox';

// Settings
import Users from '../userSettings/Users';
import User from '../userSettings/User';
import Roles from '../userSettings/Roles';
import Role from '../userSettings/Role';



const Routes = (props) => {
  return (
    <Fragment>
    <AlertBox/>
    <Switch>
      <Route exact path='/register' component={Register}/>
      <Route exact path='/login' component={Login}/>
      <PrivateRoute exact path='/dashboard' component={Dashboard}/>
      <PrivateRoute exact path='/users' component={Users}/>
      <PrivateRoute exact path='/user' component={User}/>
      <PrivateRoute exact path='/roles' component={Roles}/>
      <PrivateRoute exact path='/role' component={Role}/>
    </Switch>
    </Fragment>
  )
}

export default Routes;
