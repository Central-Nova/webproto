import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react';
import { Landing } from '../landing/Landing';
import { Register } from '../auth/Register';

describe('Landing', () => {

  const register = jest.fn();
  const setAlert = jest.fn();

  const renderLanding = () => {
    let utils = render(
        <Router>
          <Switch>
            <Route exact path='/'>
              <Landing isAuthenticated={false}/>
            </Route>
            <Route path='/register'>
              <Register setAlert={setAlert} register={register} isAuthenticated={false} user={{}} registered={false} />
            </Route>
          </Switch>
        </Router>
    )
    return utils
  }

  test('go to register page and register new account with local registration', async () => {

    // Render Landing and Register Routes, start at Landing
    const { getByText, getByTestId, getByPlaceholderText } = renderLanding();

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

  })
  
})