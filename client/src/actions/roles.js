import axios from 'axios';
import { setAlert } from './alert';

import { 
  ROLES_LOADED,
  ROLES_ERROR,
  ROLES_CLEARED
} from './types';


export const loadRoles = (companyId) => async (dispatch) => {

  
  try {

    // Get company roles with company ID and hold in res obj
    const res = await axios.get(`/api/roles/${companyId}`);

   
    // Set state.roles.roles hold company roles
    dispatch({
      type: ROLES_LOADED,
      payload: res.data
    });
    

  } catch (err) {
    console.log(err);

    // Set state.roles.roles to null
    dispatch({
      type: ROLES_ERROR
    })
  }
}