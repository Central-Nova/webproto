import axios from 'axios';
import { setAlert } from './alert';
import { loadUser } from './auth';

import { 
  COMPANY_LOADED,
  COMPANY_ERROR,
  AUTH_ERROR,
  COMPANY_SUCCESS
} from './types';

// Create company record
export const addAccountToCompany = (formData) => async dispatch => {
  console.log('calling addAccountToCompany');
  const { account, company } = formData;
  console.log('formData: ', formData);

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Creates company record, gets back companyId in res.data
    let res = await axios.put(`/api/companies/company/${company}`, formData, config);
    console.log('res.data: ', res.data);

    // Sets state.company.profile to hold company record
    dispatch({type: COMPANY_SUCCESS, payload: res.data})
    // Send success alert to alert box.
    dispatch(setAlert({title: 'Success', description: `${account.charAt(0).toUpperCase() + account.slice(1)} account information added.`}, 'success'));

  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;
    
    // Loop through errors array and call setAlert to display error message in alert box.
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
    }

    // Set state.company.profile to null
    dispatch({
      type: COMPANY_ERROR,
    })
  }
};


// Create company record
export const createCompany = (formData) => async dispatch => {
  try {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Creates company record, gets back companyId in res.data
    const res = await axios.post('/api/companies', formData, config);

    // Update user record with companyID
    dispatch(addCompanyToUser(res.data))
    
    // Send success alert to alert box.
    dispatch(setAlert({title: 'Success', description: 'Company created!'}, 'success'))
    
    // Sets state.company.profile to hold company record
    dispatch(loadCompany())
    
  } catch (err) {
   
    const errors = err.response.data.errors;
    
    // Loop through errors array and call setAlert to display error message in alert box.
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
    }

    // Set state.company.profile to null
    dispatch({
      type: COMPANY_ERROR,
    })
  }
};

// Load company record
export const loadCompany = () => async (dispatch) => {
  try {
    // Get company record
    const res = await axios.get('/api/companies');
    
    // Set state.company.profile to hold company record
    dispatch({
      type: COMPANY_LOADED,
      payload: res.data
    });

  } catch (err) {

    // Set state.company.profile to null
    dispatch({
      type: COMPANY_ERROR
    })
  }
}


// Add company to user
export const addCompanyToUser = (companyId) => async (dispatch) => {

  try {
    // Add the companyId to user record
    await axios.put(`/api/users/company/${companyId}`);

    // Load user again which now holds companyId
    dispatch(loadUser());
    
  } catch (err) {

    const errors = err.response.data.errors;

    //  Loop through errors array and call setAlert to display error message in alert box.
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    // Set state.auth.isAuthenticated to false and clears state.auth.user
    dispatch({
      type: AUTH_ERROR
    });

  }
}
