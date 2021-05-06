import React, { Fragment } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom';
import PrivateRoute from '../routing/PrivateRoute';
import SetupRoute from '../routing/SetupRoute';

// Components
import Register from '../auth/Register'
import Login from '../auth/Login'
import Dashboard from '../dashboard/Dashboard';
import AlertBox from '../layout/alerts/AlertBox';

// Setup
import SetupMain from '../setup/SetupMain';
import CreateCompany from '../setup/create/company/CreateCompany';
import AddAccounts from '../setup/create/account/AddAccounts';
import CreateTeam from '../setup/create/team/CreateTeam';
import JoinCompany from '../setup/join/JoinCompany';

// Products
import Products from '../products/products/Products';
import Product from '../products/product/Product';
import CreateProduct from '../products/productforms/CreateProduct';
import EditProduct from '../products/productforms/EditProduct';

// Settings
import Users from '../userSettings/users/Users';
import User from '../userSettings/user/User';
import Roles from '../userSettings/roles/Roles';
import Role from '../userSettings/role/Role';

const Routes = (props) => {
  return (
    <Fragment>
      <AlertBox/>
      <Switch>
        {/* Auth */}
        <Route exact path='/register' component={Register}/>
        <Route exact path='/login' component={Login}/>

        {/* Setup */}
        <SetupRoute exact path='/company' component={SetupMain}/>
        <SetupRoute exact path='/create-company' component={CreateCompany}/>
        <SetupRoute path='/create-account/:account' component={AddAccounts}/>
        <SetupRoute exact path='/create-team' component={CreateTeam}/>
        <SetupRoute exact path='/join-company' component={JoinCompany}/>

        {/* Dashboard */}
        <PrivateRoute exact path='/dashboard' component={Dashboard}/>

        {/* Settings */}
        <PrivateRoute exact path='/users' component={Users}/>
        <PrivateRoute path='/user/:userId' component={User}/>
        <PrivateRoute exact path='/roles' component={Roles}/>
        <PrivateRoute path='/role/:department' component={Role}/>

        {/* Products */}
        <PrivateRoute exact path='/products' component={Products}/>
        <PrivateRoute path='/product/:productId' component={withRouter(Product)}/>
        <PrivateRoute path='/create-product' component={CreateProduct}/>
        <PrivateRoute path='/edit-product/:productId' component={EditProduct}/>
      </Switch>
    </Fragment>
  )
}

export default Routes;
