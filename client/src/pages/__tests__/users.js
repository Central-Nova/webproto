import React, { Fragment, useEffect } from 'react';
import { Router, Route, Switch} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, waitForElement, waitForElementToBeRemoved } from '@testing-library/react';
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
import User from '../userSettings/user/User';
import SetupMain from '../setup/SetupMain';

// Route Components
import PrivateRoute from '../routing/PrivateRoute';
import SetupRoute from '../routing/SetupRoute'

describe('User Roles', () => {
  describe('edit user roles', () => {
    
    const renderLanding = () => {
      let history = createBrowserHistory();

      const Routes = (props) => {
        return (
          <Fragment>
            <AlertBox/>
            <Switch>
              <SetupRoute exact path='/company' component={SetupMain}/>
              <PrivateRoute exact path='/dashboard' component={Dashboard}/>
              <PrivateRoute exact path='/users' component={Users}/>
              <PrivateRoute path='/user/:userId' component={User}/>
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
          ein: '0923809234234',
          operation: 'supplier'
        }
      },
      getRoles: {
        data: {
          company: 'fake01982301',
          permissions: [
            {_id: "60858b8baf99ca0034999d71", department: "Admin", document: "Invitations", action: "Create", manager: true, worker: true},
            {_id: "60858b8baf99ca0034999d72", department: "Admin", document: "Users", action: "View", manager: true, worker: true},
            {_id: "60858b8baf99ca0034999d73", department: "Admin", document: "User Roles", action: "View", manager: true, worker: true},
            {_id: "60858b8baf99ca0034999d74", department: "Admin", document: "User Roles", action: "Edit", manager: true, worker: true},
            {_id: "60858b8baf99ca0034999d75", department: "Admin", document: "Role Permissions", action: "Edit", manager: true, worker: true},
            {_id: "60858b8baf99ca0034999d76", department: "Admin", document: "Company Information", action: "Edit", manager: true, worker: true},
            {_id: "60858b8baf99ca0034999d77", department: "Admin", document: "Payment Information", action: "Edit", manager: true, worker: true}
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
      postUsers: {
        data: {msg: {title: 'Success!', description: 'Roles have been updated'}}
      }
    }

    // First call is for registration
    axios.put = jest.fn()
    .mockImplementationOnce(() => Promise.resolve(res.postUsers))

    axios.get = jest.fn()
    .mockImplementationOnce(() => Promise.resolve(res.getAuth))
    .mockImplementationOnce(() => Promise.resolve(res.getRoles))
    .mockImplementationOnce(() => Promise.resolve(res.getCompany))
    .mockImplementation(() => Promise.resolve(res.getUsers))

  
    test('go to users page and update a users role', async () => {

      // Render Landing Routes, start at Landing
      const { getByText, getByTestId } = renderLanding();

      // Start at Landing already authenticated
      expect(window.location.href).toContain('http://localhost')
      expect(getByText(/welcome/i)).toBeTruthy();

      // // Redirected to Dashboard
      await waitForElement(()=> getByText(/sales/i))
      expect(getByText(/products/i)).toBeTruthy();
      expect(getByText(/inventory/i)).toBeTruthy();
      expect(getByTestId('users-btn')).toBeTruthy();

      // Navigate to Users
      const leftClick = { button: 0 }
      fireEvent.click(getByTestId('users-btn'), leftClick)

      // See loading screen

      // Arrived at Users
      await waitForElement(() => getByText(/manage users/i))
      expect(window.location.href).toContain('http://localhost/users');
      expect(getByText(`${res.getUsers.data[0].firstName} ${res.getUsers.data[0].lastName}`)).toBeTruthy();
      expect(getByText(/john@mail.com/i)).toBeTruthy();
      expect(getByText(/mike@mail.com/i)).toBeTruthy();
      expect(getByText(/sally@mail.com/i)).toBeTruthy();

      // Click on edit user from data array #1
      fireEvent.click(getByTestId(`edit-${res.getUsers.data[0]._id}-btn`), leftClick)

      // Arrive at user page of user from data array #1
      await waitForElement(() => getByText(/manage roles for this user/i))
      expect(getByText(`${res.getUsers.data[0].firstName} ${res.getUsers.data[0].lastName}`)).toBeTruthy();
      expect(getByText(/back/i)).toBeTruthy();
      expect(getByText(/save/i)).toBeTruthy();

      // See current switch state
      const salesWorkerSwitch = getByTestId('Sales-worker-switch')
      const startingChecked = salesWorkerSwitch.checked

      // Click sales worker switch
      fireEvent.click(salesWorkerSwitch, leftClick)

      // See the switch is no longer checked
      const changedChecked = salesWorkerSwitch.checked
      expect(changedChecked).toBe(!startingChecked);

      // Click Save
      fireEvent.click(getByText(/save/i),leftClick);
      
      // See success alert
      await waitForElement(() => getByText(/success/i))
      expect(getByText(res.postUsers.data.msg.description)).toBeTruthy();

      // Redirected to Users Page
      await waitForElement(() => getByText(/manage users/i))
      expect(window.location.href).toContain('http://localhost/users');
      expect(getByText(`${res.getUsers.data[0].firstName} ${res.getUsers.data[0].lastName}`)).toBeTruthy();
      expect(getByText(/john@mail.com/i)).toBeTruthy();
      expect(getByText(/mike@mail.com/i)).toBeTruthy();
      expect(getByText(/sally@mail.com/i)).toBeTruthy();
    })
  })
})