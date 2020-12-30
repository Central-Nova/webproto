import {
  ROLES_LOADED,
  ROLES_ERROR,
  ROLES_CLEARED
} from '../actions/types';

const initialState = {
  loading: true,
  rolesData: null
};

export default function (state=initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ROLES_LOADED:
    return {
      ...state, 
      loading: false,
      rolesData: payload
    }

    case ROLES_ERROR:
    case ROLES_CLEARED:
      return {
        ...state,
        loading: false,
        rolesData: null
      }
      default:
        return state;
    }
  };