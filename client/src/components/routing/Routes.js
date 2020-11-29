import React from 'react'
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../routing/PrivateRoute';

// Components
import Register from '../auth/Register'
import Login from '../auth/Login'
import Dashboard from '../dashboard/Dashboard';

// Settings
import Users from '../userSettings/Users';
import User from '../userSettings/User';
import Roles from '../userSettings/Roles';
import Role from '../userSettings/Role';



const Routes = (props) => {
  return (
    <Switch>
      <Route exact path='/register' component={Register}/>
      <Route exact path='/login' component={Login}/>
      <PrivateRoute exact path='/dashboard' component={Dashboard}/>
      <PrivateRoute exact path='/users' component={Users}/>
      <PrivateRoute exact path='/user' component={User}/>
      <PrivateRoute exact path='/roles' component={Roles}/>
      <PrivateRoute exact path='/role' component={Role}/>


    </Switch>
  )
}

export default Routes;
