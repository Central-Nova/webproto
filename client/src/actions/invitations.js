import axios from 'axios';
import { INVITATIONS_SENT, INVITATIONS_CLEARED } from './types';
import { setAlert } from './alert';

export const createInvitations = (formData) => async (dispatch) => {

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };    

    let res = await axios.post('api/invitation', formData, config)

    dispatch({
      type: INVITATIONS_SENT
    })

    dispatch(setAlert(res.data.msg, 'success'))
  } catch (err) {
    const errors = err.response.data.errors;
    
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
    }
  }
}