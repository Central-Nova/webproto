import axios from 'axios';
import { setAlert } from './alert';

import { 
  ROLES_LOADED,
  ROLES_ERROR,
  ROLES_CLEARED
} from './types';

// Create roles record
export const createRoles = (company) => async dispatch => {
  try {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let res = await axios.post('api/roles', company, config);

    dispatch(loadRoles())

    
    
  } catch (err) {
    
    
    const errors = err.response.data.errors;
    
    
    errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
    
    dispatch({
      type: ROLES_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    })
  }
};

export const loadRoles = (companyId) => async (dispatch) => {

  
  try {
    const res = await axios.get(`/api/roles/${companyId}`);
    
    dispatch({
      type: ROLES_LOADED,
      payload: res.data
    });

   

  } catch (ererr) {
    dispatch({
      type: ROLES_ERROR
    })
  }
}