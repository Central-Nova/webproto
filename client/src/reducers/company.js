import { 
  COMPANY_LOADED,
  COMPANY_ERROR,
  CLEAR_COMPANY
} from '../actions/types';

const initialState = {
  loading: true,
  profile: null
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case COMPANY_LOADED:
      return {
        ...state,
        loading: false,
        profile: payload
      }
    case COMPANY_ERROR:
    case CLEAR_COMPANY:
      return {
        ...state,
        loading: false,
        profile: null
      };
    default:
      return state;
  }
}