import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_COMPANY
} from './types';
import { loadCompany } from './company';

// Logout User
export const logoutUser = () => (dispatch) => {
   axios.get('/api/auth/logout');

  dispatch({
    type: LOGOUT,
  })
  dispatch({
    type: CLEAR_COMPANY
  })
}

//Register User
export const register = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/users', formData, config);

    console.log('res: ', res);

    dispatch({
      type: REGISTER_SUCCESS,
    });

    dispatch(setAlert(res.data.msg,'success'))

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    console.error(err.response)
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

//Login User
export const loginUser = (formData) => async (dispatch) => {
  console.log('calling loginUser', formData);
  const { email, password } = formData;
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
   await axios.post('/api/auth', {email, password}, config);

    
    dispatch({
      type: LOGIN_SUCCESS,
    });
    
    dispatch(loadUser());

  } catch (err) {
    const errors = err.response.data.errors;
    console.log('err.response: ',err.response);

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};


// Load User
export const loadUser = () => async (dispatch) => {

  try {
    const res = await axios.get('/api/users');

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });

      dispatch(loadCompany());
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};


