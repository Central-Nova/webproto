import reducer from '../invitations';
import '@testing-library/jest-dom/extend-expect';
import {
  INVITATIONS_SENT,
  INVITATIONS_CLEARED,
} from '../../actions/types';

describe('Invitations Reducer', () => {
  const actions = {
    sent: {
      type: INVITATIONS_SENT
    },
    cleared: {
      type: INVITATIONS_CLEARED
    }
  }

  test('tracks invitations sent state', () => {
    // Send invitations
    let state = reducer(undefined, actions.sent);
    expect(state.sent).toBe(true);

    // Clear sent state
    state = reducer(state, actions.cleared)
    expect(state.sent).toBe(false);
  })
})