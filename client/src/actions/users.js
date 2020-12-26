import axios from 'axios';
import { setAlert } from './alert'

import {
  USERS_LOADED,
  USERS_ERROR,
  USERS_CLEARED
} from './types';

export const loadCompanyUsers = () => async (dispatch) => {

  const res = await axios.get('api/users/');

  try {
    dispatch({
      type: USERS_LOADED,
      payload: res.data
    }) 
    
  } catch (err) {
    dispatch({
      type: USERS_ERROR
    })
    
  }
}