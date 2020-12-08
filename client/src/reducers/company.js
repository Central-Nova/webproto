import { 
  COMPANY_LOADED,
  COMPANY_ERROR,
  CLEAR_COMPANY
} from '../actions/types';

const initialState = {
  loading: true,
  company: null
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case COMPANY_LOADED:
      return {
        ...state,
        loading: false,
        company: payload
      }
    case COMPANY_ERROR:
    case CLEAR_COMPANY:
      return {
        ...state,
        loading: false,
        company: null
      };
    default:
      return state;
  }
}