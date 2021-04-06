import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react';
import { Landing } from '../landing/Landing';
import { Login } from '../auth/Login';

describe('Landing', () => {

  const loginUser = jest.fn();

  const renderLanding = () => {
    let utils = render(
        <Router>
          <Switch>
            <Route exact path='/'>
              <Landing isAuthenticated={false}/>
            </Route>
            <Route path='/login'>
              <Login loginUser={loginUser} isAuthenticated={false} user={{}} company={{}} />
            </Route>
          </Switch>
        </Router>
    )
    return utils
  }

  test('go to login page and login with with local login', async () => {

    // Render Landing and Register Routes, start at Landing
    const { getByText, getByTestId, getByPlaceholderText } = renderLanding();

    // See buttons to login or register
    expect(getByText(/log in/i)).toBeTruthy();
    expect(getByText(/sign up/i)).toBeTruthy();

    // Navigate to Login
    const leftClick = { button: 0 }
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