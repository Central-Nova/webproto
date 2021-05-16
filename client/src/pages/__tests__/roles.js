import React, { Fragment, useEffect } from 'react';
import { Router, Route, Switch} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, waitForElement } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import store from '../../store';
import axios from 'axios';

// Action Creators
import { loadUser } from '../../actions/auth';
import { loadRoles } from '../../actions/roles';

// Components
import AlertBox from '../layout/alerts/AlertBox';
import Landing from '../landing/Landing';
import Dashboard from '../dashboard/Dashboard';
import Users from '../userSettings/users/Users';
import Roles from '../userSettings/roles/Roles'
import Role from '../userSettings/role/Role';

// Route Components
import PrivateRoute from '../routing/PrivateRoute';

describe('Roles', () => {
  describe('Update roles', () => {
    
    const renderLanding = () => {
      let history = createBrowserHistory();

      const Routes = (props) => {
        return (
          <Fragment>
            <AlertBox/>
            <Switch>
              <PrivateRoute exact path='/dashboard' component={Dashboard}/>
              <PrivateRoute exact path='/users' component={Users}/>
              <PrivateRoute exact path='/roles' component={Roles}/>
              <PrivateRoute path='/role/:department' component={Role}/>
            </Switch>
          </Fragment>
        )
      }
      
      const App = () => {
        useEffect(() => {
          store.dispatch(loadUser());
          store.dispatch(loadRoles());
        },[])

        return (
          <Provider store={store}>
            <Router history={history}>
              <Fragment>
                <Switch>
                    <Route exact path='/' component={Landing}/>
                    <Route component={Routes}/>
                </Switch>
              </Fragment>
            </Router>
          </Provider>
        )
      }

      let utils = render(<App/>)
      return {...utils, history}
    }

    const res = {
        getAuth: {
          data: {
            _id: '0s9adf808sadfa0sdf8',
            firstName: 'John',
            lastName: 'Lee',
            email: 'john@mail.com',
            company: 'fake09183021',
            roles: [
              {manager: true, worker: true, _id: "60858b12af99ca0034999d20", department: "Sales"},
              {manager: true, worker: true, _id: "60858b12af99ca0034999d21", department: "Inventory"},
              {manager: true, worker: true, _id: "60858b12af99ca0034999d22", department: "Products"},
              {manager: true, worker: true, _id: "60858b12af99ca0034999d23", department: "Warehouse"},
              {manager: true, worker: true, _id: "60858b12af99ca0034999d24", department: "Fleet"},
              {manager: true, worker: true, _id: "60858b12af99ca0034999d25", department: "Payments"},
              {manager: true, worker: true, _id: "60858b12af99ca0034999d26", department: "Admin"},
            ]
          }
        },
        getCompany: {
          data: {
            name: 'fake company',
            ein: '0923809234234'
          }
        },
        getRoles: {
          data: {
            company: 'fake01982301',
            permissions: [
                {_id: "60858b8baf99ca0034999d67", department: "Sales", document: "Sales Quotes", action: "Create", manager: true, worker: true},
                {_id: "60858b8baf99ca0034999d68", department: "Sales", document: "Sales Quotes", action: "View", manager: true, worker: true},
                {_id: "60858b8baf99ca0034999d69", department: "Sales", document: "Sales Orders", action: "Create", manager: true, worker: true},
                {_id: "60858b8baf99ca0034999d70", department: "Sales", document: "Sales Orders", action: "View", manager: true, worker: true},
                {_id: "60858b8baf99ca0034999d71", department: "Admin", document: "Invitations", action: "Create", manager: true, worker: true},
                {_id: "60858b8baf99ca0034999d72", department: "Admin", document: "User Roles", action: "Edit", manager: true, worker: true},
                {_id: "60858b8baf99ca0034999d73", department: "Admin", document: "Role Permissions", action: "Edit", manager: true, worker: true},
            ]
          }
        },
        getUsers: {
          data: [
            {_id: '0s9adf808sadfa0sdf1', firstName: 'John', lastName: 'Lee', email: 'john@mail.com', roles: [
              {manager: true, worker: true, _id: "60858b12af99ca0034999d20", department: "Sales"},
              {manager: true, worker: true, _id: "60858b12af99ca0034999d21", department: "Inventory"},
              {manager: true, worker: true, _id: "60858b12af99ca0034999d22", department: "Products"},
              {manager: true, worker: true, _id: "60858b12af99ca0034999d23", department: "Warehouse"},
              {manager: true, worker: true, _id: "60858b12af99ca0034999d24", department: "Fleet"},
              {manager: true, worker: true, _id: "60858b12af99ca0034999d25", department: "Payments"},
              {manager: true, worker: true, _id: "60858b12af99ca0034999d26", department: "Admin"},
            ]},
            {_id: '0s9adf808sadfa0sdf2',firstName: 'Mike', lastName: 'Chan', email: 'mike@mail.com', roles: [
              {manager: false, worker: true, _id: "60858b12af99ca0034999d27", department: "Sales"},
              {manager: false, worker: true, _id: "60858b12af99ca0034999d28", department: "Inventory"},
              {manager: false, worker: true, _id: "60858b12af99ca0034999d29", department: "Products"},
              {manager: false, worker: true, _id: "60858b12af99ca0034999d30", department: "Warehouse"},
              {manager: false, worker: true, _id: "60858b12af99ca0034999d31", department: "Fleet"},
              {manager: false, worker: true, _id: "60858b12af99ca0034999d32", department: "Payments"},
              {manager: false, worker: true, _id: "60858b12af99ca0034999d33", department: "Admin"},
            ]},
            {_id: '0s9adf808sadfa0sdf3',firstName: 'Sally', lastName: 'Liu', email: 'sally@mail.com', roles: [
              {manager: false, worker: true, _id: "60858b12af99ca0034999d34", department: "Sales"},
              {manager: false, worker: true, _id: "60858b12af99ca0034999d35", department: "Inventory"},
              {manager: false, worker: true, _id: "60858b12af99ca0034999d36", department: "Products"},
              {manager: false, worker: true, _id: "60858b12af99ca0034999d37", department: "Warehouse"},
              {manager: false, worker: true, _id: "60858b12af99ca0034999d38", department: "Fleet"},
              {manager: false, worker: true, _id: "60858b12af99ca0034999d39", department: "Payments"},
              {manager: false, worker: true, _id: "60858b12af99ca0034999d40", department: "Admin"},
            ]},
          ]
        },
        postRoles: {
          data: {msg: {title: 'Success!', description: 'Roles have been updated'}}
        }
      }
  
      // First call is for registration
      axios.put = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.postRoles))
  
      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getAuth))
      .mockImplementationOnce(() => Promise.resolve(res.getRoles))
      .mockImplementationOnce(() => Promise.resolve(res.getCompany))
      .mockImplementationOnce(() => Promise.resolve(res.getUsers))
      .mockImplementation(() => Promise.resolve(res.getRoles))

    
    test('Go to roles page and update permissions', async () => {

    // Render Landing and Register Routes, start at Landing
    const { getByText, getByTestId, getByPlaceholderText, getByRole, history } = renderLanding();
    const leftClick = { button: 0 }
    window.scrollTo = jest.fn();

    // Start at Landing already authenticated
    expect(window.location.href).toContain('http://localhost')
    expect(getByText(/welcome/i)).toBeTruthy();

    // Redirected to Dashboard
    await waitForElement(()=> getByText(/sales/i))
    expect(window.location.href).toContain('http://localhost/dashboard')
    expect(getByText(/products/i)).toBeTruthy();
    expect(getByText(/inventory/i)).toBeTruthy();
    expect(getByTestId('users-btn')).toBeTruthy();


    // Navigate to Users
    fireEvent.click(getByTestId('users-btn'), leftClick)

    // Arrived at Users
    await waitForElement(() => getByText(/manage users/i))
    expect(window.location.href).toContain('http://localhost/users');
    expect(getByText(`${res.getUsers.data[0].firstName} ${res.getUsers.data[0].lastName}`)).toBeTruthy();
    expect(getByText(/john@mail.com/i)).toBeTruthy();
    expect(getByText(/mike@mail.com/i)).toBeTruthy();
    expect(getByText(/sally@mail.com/i)).toBeTruthy();

    // Navigate to Roles
    fireEvent.click(getByText(/edit roles/i), leftClick)

    // Arrived at Roles
    await waitForElement(() => getByText(/manage roles/i))
    expect(window.location.href).toContain('http://localhost/roles');
    expect(getByText(/manage roles and permissions/i)).toBeTruthy();

    // Naviate to Sales Role
    fireEvent.click(getByTestId('edit-sales-btn'), leftClick)

    // Arrived at Sales Role
    await waitForElement(() => getByText(/sales permissions/i));
    expect(window.location.href).toContain('http://localhost/role/sales');
    expect(getByText(/sales order/i)).toBeTruthy();
    expect(getByText(/sales quotes/i)).toBeTruthy();

    // See current switch state
    const salesQuoteWorkerSwitch = getByTestId('switch-worker-btn-60858b8baf99ca0034999d67')
    const startingChecked = salesQuoteWorkerSwitch.checked

    // Click the switch
    fireEvent.click(salesQuoteWorkerSwitch, leftClick)

    // See the switch is no longer checked
    const changedChecked = salesQuoteWorkerSwitch.checked
    expect(changedChecked).toBe(!startingChecked);

    // Save
    fireEvent.click(getByText(/save/i), leftClick);
    
    // See success alert
    await waitForElement(() => getByText(/success/i))
    expect(getByText(res.postRoles.data.msg.description)).toBeTruthy();
    expect(window.scrollTo).toBeCalledWith(0,0)
    })
  })
})