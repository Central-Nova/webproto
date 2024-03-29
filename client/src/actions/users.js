import axios from 'axios';
import { setAlert } from './alert'

import {
  USERS_LOADED,
  USERS_ERROR,
  USERS_UPDATED,
  USERS_READY,
} from './types';

export const loadCompanyUsers = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/users');

    dispatch({
      type: USERS_LOADED,
      payload: res.data
    })

  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;
    errors.forEach(error => dispatch(setAlert(error.msg,'danger')));

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

    const res = await axios.put(`/api/users/roles/${userId}`, {roles:roleData}, config);

    dispatch(loadCompanyUsers());

    setTimeout(()=>dispatch({type: USERS_UPDATED}), 500)

    dispatch(setAlert(res.data.msg,'success'))

    setTimeout(() => dispatch({ type: USERS_READY }), 1000);


  } catch (err) {
    const errors = err.response.data.errors;

    // Loop through errors array and call setAlert to display error message in alert box.
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
    }

  }

}
