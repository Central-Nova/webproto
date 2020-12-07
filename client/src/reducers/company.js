import { 
  GET_COMPANY,
  COMPANY_ERROR
} from '../actions/types';

const initialState = {
  loading: true,
  company: null
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_COMPANY:
      return {
        ...state,
        loading: false,
        COMPANY: payload
      }
    case COMPANY_ERROR:
      return {
        ...state,
        loading: false,
        company: null
      };
    default:
      return state;
  }
}