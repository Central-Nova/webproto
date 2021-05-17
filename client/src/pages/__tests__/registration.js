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
import Landing from '../landing/Landing';
import Login from '../auth/Login';
import Register from '../auth/Register';
import AlertBox from '../layout/alerts/AlertBox';
import SetupMain from '../setup/SetupMain';
import Dashboard from '../dashboard/Dashboard';

// Route Components
import SetupRoute from '../routing/SetupRoute';
import PrivateRoute from '../routing/PrivateRoute';

describe('Landing', () => {
  describe('local registration and login integration', () => {
    
    const renderLanding = () => {
      let history = createBrowserHistory();

      const Routes = (props) => {
        return (
          <Fragment>
            <AlertBox/>
            <Switch>
              {/* Auth */}
              <Route exact path='/register' component={Register}/>
              <Route exact path='/login' component={Login}/>
              <SetupRoute exact path='/company' component={SetupMain}/>
              <PrivateRoute exact path='/dashboard' component={Dashboard}/>
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
      postUsersError: {
        response: {
          data: {
            errors: [
              {msg: {title: 'Error', description: 'Invalid Credentials'}}
            ]
          }
        }
      },
      postUsersSuccess: {
        data: {
          msg: {title: 'Success', description: 'Your account is registered'}
        }
      },
      postAuth: {
        data: {
          msg: {title: 'Success', description: 'You are now logged in'}
        }
      },
      getAuth: {
        data: {
          _id: '0s9adf808sadfa0sdf8',
          firstName: 'fake',
          lastName: 'user',
          email: 'fake@mail.com'
        }
      },
      getAuthError: {
        response: {
          data: {
            errors: [
              {msg: {title: 'Error', description: 'You have not been authenticated'}}
            ]
          }
        }
      }
    }

    // First call is for registration
    // Second call is for login
    axios.post = jest.fn()
    .mockImplementationOnce(() => Promise.resolve(res.postUsersSuccess))
    .mockImplementationOnce(() => Promise.resolve(res.postAuth))

    // First two calls are for loadUser and loadRoles in useEffect
    // Last two calls are for loadUser and loadCompany after login
    axios.get = jest.fn()
    .mockImplementation((url) => {
      switch (url) {
        case '/api/auth':
          return Promise.reject(res.getAuthError);
        case '/api/roles':
          return Promise.reject()
        case '/api/companies':
          return Promise.reject()
      }
    })

  
    test('register then login', async () => {

      // Render Landing and Register Routes, start at Landing
      const { getByText, getByTestId, getByPlaceholderText, getByRole, history } = renderLanding();

      // See buttons to login or register
      expect(getByText(/log in/i)).toBeTruthy();
      expect(getByText(/sign up/i)).toBeTruthy();

      // Navigate to Register
      const leftClick = { button: 0 }
      fireEvent.click(getByText(/sign up/i), leftClick)

      // Load user error alert
      await waitForElement(() => getByText(/you have not been authenticated/i))

      // Close error
      fireEvent.click(getByText(/close/i), leftClick);

      // Arrived at Register page
      expect(window.location.href).toContain('http://localhost/register');
      expect(getByText(/register your account/i)).toBeTruthy();
      expect(getByTestId('register-form')).toBeTruthy();

      // Fill form with not matching passwords
      fireEvent.change(getByPlaceholderText(/first name/i), {target: {value: 'fake'}})
      fireEvent.change(getByPlaceholderText(/last name/i), {target: {value: 'user'}})
      fireEvent.change(getByPlaceholderText(/email/i), {target: {value: 'fake@mail.com'}})
      fireEvent.change(getByPlaceholderText('Password'), {target: {value: 'test123'}})
      fireEvent.change(getByPlaceholderText('Confirm Password'), {target: {value: 'different'}})
      
      // Click sign up
      fireEvent.click(getByTestId('local-signup-btn'), leftClick);
    
      // Error alert appears
      expect(getByText(/passwords do not match/i)).toBeTruthy();

      // Fill form with matching password
      fireEvent.change(getByPlaceholderText('Confirm Password'), {target: {value: 'test123'}})

      // Click sign up
      fireEvent.click(getByTestId('local-signup-btn'), leftClick);

      // Success alert appears
      await waitForElement(() => getByText(/your account is registered/i));
      
      // Arrived at Login page
      await waitForElement(() => getByText(/sign into your account/i))
      expect(window.location.href).toContain('http://localhost/login');
      expect(getByText(/sign into your account/i)).toBeTruthy();
      expect(getByTestId('login-form')).toBeTruthy();
  
      // Fill form with credentials
      fireEvent.change(getByPlaceholderText(/email/i), {target: {value: 'fake@mail.com'}})
      fireEvent.change(getByPlaceholderText(/password/i), {target: {value: 'test123'}})
      
      // New axios mock
      axios.get = jest.fn()
      .mockImplementation((url) => {
        switch (url) {
          case '/api/auth':
            return Promise.resolve(res.getAuth);
          case '/api/roles':
            return Promise.rejeect()
          case '/api/companies':
            return Promise.reject()
        }
      })

      // Click login button
      fireEvent.click(getByTestId('local-login-btn'), leftClick);

      // Success alert appears
      await waitForElement(() => getByText(/you are now logged in/i))
      
      // Redirected to company setup
      await waitForElement(() => getByText(/company setup/i));
      expect(getByText(/join an existing company/i)).toBeTruthy();
      expect(getByText(/create a new company/i)).toBeTruthy();
      expect(window.location.href).toContain('http://localhost/company');

    })
  })
})