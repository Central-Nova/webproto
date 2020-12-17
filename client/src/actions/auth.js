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
  // runs req.logOut() to destroy express session
   axios.get('/api/auth/logout');

  // Set state.auth.isAuthenticated to false and clears state.auth.user
  dispatch({
    type: LOGOUT,
  })

  // Clears state.company.profile 
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

    // Sets state.auth.isAuthenticated to true
    dispatch({
      type: REGISTER_SUCCESS,
    });

    // Call setAlert to display success message in alert box.
    dispatch(setAlert(res.data.msg,'success'))

    // Load user to state.auth
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    console.error(err.response)

    //  Loop through errors array and call setAlert to display error message in alert box.
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    // Set state.auth.isAuthenticated to false and state.auth.user to null
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

  //  Set state.auth.isAuthenticated to true
    dispatch({
      type: LOGIN_SUCCESS,
    });

  //  Load user to state.auth.user 
    dispatch(loadUser());

  } catch (err) {
    const errors = err.response.data.errors;
    console.log('err.response: ',err.response);

    //  Loop through errors array and call setAlert to display error message in alert box.
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    // Set auth.isAuthenticated to false and state.auth.user to null
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

    const errors = err.response.data.errors;
    console.log('err.response: ',err.response);

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: AUTH_ERROR
    });
  }
};

