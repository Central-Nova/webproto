import {
  USERS_LOADED,
  USERS_ERROR,
  USERS_UPDATED,
  USERS_READY,
  USERS_CLEARED
} from '../actions/types';

const initialState = {
  loading: true,
  profiles: null,
  updated: false
}

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch(type) {
    case USERS_LOADED:
      return {
        ...state,
        loading: false,
        profiles: payload
      }
    
    case USERS_ERROR:
    case USERS_CLEARED:
      return {
        ...state,
        loading: false,
        profiles: null
      }
    case USERS_UPDATED:
      return {
        ...state,
        updated: true
      }
    case USERS_READY: 
      return {
        ...state,
        updated: false
      }
    default:
      return state
  }


}