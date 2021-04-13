import { 
  COMPANY_LOADED,
  COMPANY_SUCCESS,
  COMPANY_ERROR,
  COMPANY_CLEARED
} from '../actions/types';

const initialState = {
  loading: true,
  profile: null
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case COMPANY_LOADED:
    case COMPANY_SUCCESS: 
      return {
        ...state,
        loading: false,
        profile: payload
      }
    case COMPANY_ERROR:
    case COMPANY_CLEARED:
      return {
        ...state,
        loading: false,
        profile: null
      };
    default:
      return state;
  }
}