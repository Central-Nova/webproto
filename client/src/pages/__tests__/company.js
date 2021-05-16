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
import AlertBox from '../layout/alerts/AlertBox';
import SetupMain from '../setup/SetupMain';
import Dashboard from '../dashboard/Dashboard';
import CreateCompany from '../setup/create/company/CreateCompany';
import AddAccounts from '../setup/create/account/AddAccounts';
import CreateTeam from '../setup/create/team/CreateTeam';

// Route Components
import SetupRoute from '../routing/SetupRoute';
import PrivateRoute from '../routing/PrivateRoute';

describe('Company setup', () => {
  describe('Login and company setup routes', () => {
    
    const renderLanding = () => {
      let history = createBrowserHistory();

      const Routes = (props) => {
        return (
            <Fragment>
                <AlertBox/>
                <Switch>
                    <Route exact path='/login' component={Login}/>
                    <SetupRoute exact path='/company' component={SetupMain}/>
                    <SetupRoute exact path='/create-company' component={CreateCompany}/>
                    <SetupRoute path='/create-account/:account' component={AddAccounts}/>
                    <SetupRoute exact path='/create-team' component={CreateTeam}/>
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
        postCompanies : {
            data: '0s9adf808sadfa0sdf1'
        },
        postCompaniesError: {
            response: {
                data: {
                    errors: [
                    {msg: {title: 'Error', description: 'EIN is required'}}
                    ]
                }
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
        getAuthWithCompany: {
            data: {
                _id: '0s9adf808sadfa0sdf8',
                firstName: 'fake',
                lastName: 'user',
                email: 'fake@mail.com',
                company: '0s9adf808sadfa0sdf1'
            }
        },
        getCompanies: {
            data: {
                _id: '0s9adf808sadfa0sdf8',
                businessName: 'Business Supplies Company',
                ein: '9508230523534256'
            }
        }
    }

    axios.put = jest.fn()
    .mockImplementationOnce(() => Promise.resolve())

    axios.post = jest.fn()
    .mockImplementationOnce(() => Promise.reject(res.postCompaniesError))
    .mockImplementationOnce(() => Promise.resolve(res.postCompanies))

    axios.get = jest.fn()
    .mockImplementationOnce(() => Promise.resolve(res.getAuth))
    .mockImplementationOnce(() => Promise.reject())
    .mockImplementationOnce(() => Promise.reject())
    .mockImplementationOnce(() => Promise.resolve(res.getCompanies))
    .mockImplementationOnce(() => Promise.resolve(res.getAuthWithCompany))
    .mockImplementationOnce(() => Promise.resolve(res.getCompanies));

  
    test('new account setup company', async () => {

    // Render Landing and Register Routes, start at Landing
    const { getByText, getByPlaceholderText, getByTestId } = renderLanding();
    const leftClick = { button: 0 }

    // See buttons to login or register
    expect(getByText(/log in/i)).toBeTruthy();
    expect(getByText(/sign up/i)).toBeTruthy();
    
    // Redirected to company setup
    await waitForElement(() => getByText(/company setup/i));
    expect(getByText(/join an existing company/i)).toBeTruthy();
    expect(getByText(/create a new company/i)).toBeTruthy();
    expect(window.location.href).toContain('http://localhost/company');

    // Select create company
    fireEvent.click(getByText(/create a new company/i),leftClick);
    
    // Arrive at create company
    await waitForElement(() => getByText(/company setup/i));
    expect(window.location.href).toContain('http://localhost/create-company');
    expect(getByPlaceholderText(/business name/i)).toBeTruthy();
    expect(getByPlaceholderText(/ein/i)).toBeTruthy();
    
    // Fill form with credentials without EIN
    fireEvent.change(getByPlaceholderText(/business name/i), {target: {value: 'Business Supplies Company'}})
    
    // Click Submit
    fireEvent.click(getByText(/submit/i), leftClick);
    
    // EIN error alert appears
    await waitForElement(() => getByText(res.postCompaniesError.response.data.errors[0].msg.description));
    fireEvent.click(getByText(/close/i), leftClick);

    // Fill in EIN
    fireEvent.change(getByPlaceholderText(/ein/i), {target: {value: '6590385923509325'}})

    // Click Submit
    fireEvent.click(getByText(/submit/i), leftClick);

    // Success alert appears
    await waitForElement(() => getByText(/company created/i));
    fireEvent.click(getByText(/close/i), leftClick);

    // Account Options Appear
    await waitForElement(() => getByText(/primary business operation/i));
    expect(window.location.href).toContain('http://localhost/create-company');
    fireEvent.click(getByTestId('opt-supplier-btn'), leftClick);
    
    })
  })
})