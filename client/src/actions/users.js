import axios from 'axios';
import { setAlert } from './alert'

import {
  USERS_LOADED,
  USERS_ERROR,
  USERS_CLEARED
} from './types';

export const loadCompanyUsers = () => async (dispatch) => {

  const res = await axios.get('/api/users');

  try {
    dispatch({
      type: USERS_LOADED,
      payload: res.data
    }) 
    
  } catch (err) {
    const errors = err.response.data.errors;
    console.log('err.response: ',err.response);

    dispatch({
      type: USERS_ERROR
    })
    
  }
}

export const updateUserRoles = (roleData, userId) => async (dispatch) => {
  
  try {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    const res = await axios.put(`/api/users/roles/${userId}`, roleData, config);
    
    dispatch(loadCompanyUsers());

    dispatch(setAlert(res.data.msg,'success'))

  } catch (err) {
    const errors = err.response.data.errors;
    
    // Loop through errors array and call setAlert to display error message in alert box.
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
    }

  }

}