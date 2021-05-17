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
        putCompanies : {
            data: {
                _id: '0s9adf808sadfa0sdf1',
                businessName: 'Business Supplies Company',
                ein: '9508230523534256',
                operation: 'supplier',
                addressBusiness: {
                    street: 'fake street',
                    suite: '91082',
                    city: 'new york', 
                    state: 'ny',
                    zip: '123901'
                }
            }
        },
        getAuth: {
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
                _id: '0s9adf808sadfa0sdf1',
                businessName: 'Business Supplies Company',
                ein: '9508230523534256'
            }
        },
        getCompaniesWithAccount: {
            data: {
                _id: '0s9adf808sadfa0sdf1',
                businessName: 'Business Supplies Company',
                ein: '9508230523534256',
                operation: 'supplier',
                addressBusiness: {
                    street: 'fake street',
                    suite: '91082',
                    city: 'new york', 
                    state: 'ny',
                    zip: '123901'
                }
            }
        },
        getRoles: {
          data: {
            company: '0s9adf808sadfa0sdf1',
            permissions: [{permission: 'yes'}]
          }
        }
    }

    axios.put = jest.fn()
    .mockImplementationOnce(() => Promise.resolve(res.putCompanies))

    axios.get = jest.fn()
    .mockImplementationOnce(() => Promise.resolve(res.getAuth))
    .mockImplementationOnce(() => Promise.resolve(res.getRoles))
    .mockImplementationOnce(() => Promise.resolve(res.getCompanies))
    // .mockImplementation(() => Promise.resolve(res.getCompaniesWithAccount))

  
    test.only('setup new company supplier account', async () => {

    // Render Landing and Register Routes, start at Landing
    const { getByText, getByTestId, getByPlaceholderText, getByRole, history } = renderLanding();
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
        
    // Account Options Appear
    await waitForElement(() => getByText(/primary business operation/i));
    expect(window.location.href).toContain('http://localhost/create-company');
    fireEvent.click(getByTestId('opt-supplier-btn'), leftClick);

    // Arrive at Account Creation
    await waitForElement(() => getByText(/supplier account setup/i))
    expect(window.location.href).toContain('http://localhost/create-account/supplier');
    expect(getByTestId('businessAddress-street-field')).toBeTruthy();
    expect(getByTestId('businessAddress-suite-field')).toBeTruthy();
    expect(getByTestId('businessAddress-city-field')).toBeTruthy();
    expect(getByTestId('businessAddress-state-field')).toBeTruthy();
    expect(getByTestId('businessAddress-zip-field')).toBeTruthy();

    // Fill business address form without zip
    fireEvent.change(getByTestId('businessAddress-street-field'), {target: {value: '1804 plaza avenue'}})
    fireEvent.change(getByTestId('businessAddress-suite-field'), {target: {value: '2112'}})
    fireEvent.change(getByTestId('businessAddress-city-field'), {target: {value: 'new york'}})
    fireEvent.change(getByTestId('businessAddress-state-field'), {target: {value: 'ny'}})
    
    // Click Next
    fireEvent.click(getByText(/next/i), leftClick)

    // See zip code error alert
    await waitForElement(() => getByText(/zip is required/i));
    fireEvent.click(getByText(/close/i), leftClick);

    // FIll in zip and click next
    fireEvent.change(getByTestId('businessAddress-zip-field'), {target: {value: '10021'}})
    fireEvent.click(getByText(/next/i), leftClick)

    // See Contact information form
    await waitForElement(() => getByText(/business contact information/i));
    expect(getByPlaceholderText(/email address/i)).toBeTruthy();
    expect(getByPlaceholderText(/phone number/i)).toBeTruthy();

    // Fill email address and click create
    fireEvent.change(getByPlaceholderText(/email address/i), {target: {value: 'business@mail.com'}})
    fireEvent.click(getByText(/create/i), leftClick)

    // See phone number error alert
    await waitForElement(() => getByText(/phone is required/i));
    fireEvent.click(getByText(/close/i), leftClick);

    // Fill phone
    fireEvent.change(getByPlaceholderText(/phone number/i), {target: {value: '0238409242094'}})
    fireEvent.click(getByText(/create/i), leftClick)
    
    // See success alert
    await waitForElement(() => getByText(/success/i));
    fireEvent.click(getByText(/close/i), leftClick);

    // Arrive at create team
    await waitForElement(() => getByText(/team details/i));
    expect(window.location.href).toContain('http://localhost/create-team');
    expect(getByText(/team details/i)).toBeTruthy();

    // Click Done
    fireEvent.click(getByText(/done/i), leftClick);

    // Arrive at Dashboard
    await waitForElement(()=> getByText(/sales/i))
    expect(window.location.href).toContain('http://localhost/dashboard')
    expect(getByText(/products/i)).toBeTruthy();
    expect(getByText(/inventory/i)).toBeTruthy();
    expect(getByTestId('users-btn')).toBeTruthy();

    })
  })
})