import axios from 'axios';
import { setAlert } from './alert';

import { 
  GET_COMPANY,
  COMPANY_ERROR
} from './types';

// Create company record
export const createCompany = (formData) => async dispatch => {
  try {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('api/companies', formData, config);

    dispatch({
      type: GET_COMPANY,
      payload: res.data
    })

    dispatch(setAlert({title: 'Success', description: 'Company created!'}, 'success'))

    
  } catch (err) {

    console.log('company err: ', err);

    const errors = err.response.data.errors;

    console.log('company errors: ', errors)

    errors.forEach(error => dispatch(setAlert(error.msg,'danger')));

    dispatch({
      type: COMPANY_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    })
  }
};