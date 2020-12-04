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
} from './types';

// Logout User
export const logoutUser = () => (dispatch) => {
   axios.get('/api/auth/logout');

  dispatch({
    type: LOGOUT,
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

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

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
    const res = await axios.post('/api/auth', {email, password}, config);
    console.log('Axios Response: ', res.data);

    dispatch({
      type: LOGIN_SUCCESS,
    });

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
    const res = await axios.get('/api/auth');

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};


