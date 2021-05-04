import axios from 'axios';
import { setAlert } from './alert';

import {
  ROLES_LOADED,
  ROLES_ERROR,
} from './types';


export const loadRoles = () => async (dispatch) => {

  try {

    // Get company roles with company ID and hold in res obj
    const res = await axios.get('/api/roles');


    // Set state.roles.roles hold company roles
    dispatch({
      type: ROLES_LOADED,
      payload: res.data
    });


  } catch (err) {

    // Set state.roles.roles to null
    dispatch({
      type: ROLES_ERROR
    })
  }
}

export const loadRolesByDocument = (document) => async (dispatch) => {

  try {

    // Get company roles with company ID and hold in res obj
    const res = await axios.get(`/api/roles/document/${document}`);


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


export const updateCompanyRoles = (permissionsData, department) => async (dispatch) => {

  try {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`/api/roles/department/${department}`, {permissions: permissionsData}, config);

    dispatch(loadRoles());

    dispatch(setAlert(res.data.msg,'success'))

  } catch (err) {
    const errors = err.response.data.errors;

    // Loop through errors array and call setAlert to display error message in alert box.
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
    }

  }

}
