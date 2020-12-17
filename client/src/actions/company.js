import axios from 'axios';
import { setAlert } from './alert';
import { loadUser } from './auth';

import { 
  COMPANY_LOADED,
  COMPANY_ERROR,
  AUTH_ERROR
} from './types';

// Create company record
export const createCompany = (formData) => async dispatch => {
  try {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Creates company record, gets back companyId in res.data
    const res = await axios.post('api/companies', formData, config);

    // Sets state.company.profile to hold company record
    dispatch(loadCompany())

    // Send success alert to alert box.
    dispatch(setAlert({title: 'Success', description: 'Company created!'}, 'success'))
    
    // Update user record with companyID
    dispatch(addCompanyToUser(res.data))
    
    
  } catch (err) {
    
    console.log('company err: ', err);
    
    const errors = err.response.data.errors;
    console.log('company errors: ', errors)
    
    // Loop through errors array and call setAlert to display error message in alert box.
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
    }

    // Set state.company.profile to null
    dispatch({
      type: COMPANY_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    })
  }
};

// Load company record by
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

    console.log(err);

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
    await axios.put(`/api/users/${companyId}`);

    // Load user again which now holds companyId
    dispatch(loadUser());
    
  } catch (err) {

    const errors = err.response.data.errors;
    console.log('err.response: ',err.response);

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