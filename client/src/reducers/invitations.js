import {
  INVITATIONS_SENT,
  INVITATIONS_CLEARED
} from '../actions/types';

const initialState = {
  sent: false
};

export default function (state=initialState, action) {
  const { type } = action;

  switch (type) {
    case INVITATIONS_SENT:
    return {
      ...state, 
      sent: true
    }

    case INVITATIONS_CLEARED:
      return {
        ...state,
        sent: false,
      }
      default:
        return state;
    }
  };