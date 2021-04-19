import React from 'react';
import { Router, Route, Switch} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, waitForElement } from '@testing-library/react';
import { Landing } from '../landing/Landing';
import { Login } from '../auth/Login';
import { Register } from '../auth/Register';
import { createBrowserHistory } from 'history';

describe('Landing', () => {
  describe('local login', () => {
    const loginUser = jest.fn();
    const setAlert = jest.fn();
    const register = jest.fn();
    
    const renderLanding = () => {
      let history = createBrowserHistory();

      let utils = render(
          <Router history={history}>
            <Switch>
              <Route exact path='/'>
                <Landing isAuthenticated={false}/>
              </Route>
              <Route path='/login'>
                <Login loginUser={loginUser} isAuthenticated={false} user={{}} company={{}} />
              </Route>
              <Route path='/register'>
                <Register setAlert={setAlert} register={register} isAuthenticated={false} user={{}} registered={false} />
            </Route>
            </Switch>
          </Router>
      )
      return {...utils, history}
    }
  
    test('register then login', async () => {

      // Render Landing and Register Routes, start at Landing
      const { getByText, getByTestId, getByPlaceholderText, history } = renderLanding();
  
      // See buttons to login or register
      expect(getByText(/log in/i)).toBeTruthy();
      expect(getByText(/sign up/i)).toBeTruthy();

      // Navigate to Register
      const leftClick = { button: 0 }
      fireEvent.click(getByText(/sign up/i), leftClick)

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
    
      // setAlert is called with input validation error
      expect(setAlert).toHaveBeenCalledTimes(1);

      // Fill form with matching password
      fireEvent.change(getByPlaceholderText('Confirm Password'), {target: {value: 'test123'}})

      // Click sign up
      fireEvent.click(getByTestId('local-signup-btn'), leftClick);

      // Handle Submit
      expect(register).toHaveBeenCalledTimes(1);

      // Navigate to landing
      history.push('/')

      // Navigate to Login
      fireEvent.click(getByText(/log in/i), leftClick)
      
      // Arrived at Login page
      expect(window.location.href).toContain('http://localhost/login');
      expect(getByText(/sign into your account/i)).toBeTruthy();
      expect(getByTestId('login-form')).toBeTruthy();
  
      // Fill form with credentials
      fireEvent.change(getByPlaceholderText(/email/i), {target: {value: 'fake@mail.com'}})
      fireEvent.change(getByPlaceholderText(/password/i), {target: {value: 'test123'}})
      
      // Click login button
      fireEvent.click(getByTestId('local-login-btn'), leftClick);
  
      // Handle Submit
      expect(loginUser).toHaveBeenCalledTimes(1);

    })
  })
})