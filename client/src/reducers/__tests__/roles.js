import reducer from '../roles';
import '@testing-library/jest-dom/extend-expect';
import {
  ROLES_LOADED,
  ROLES_CLEARED,
  ROLES_ERROR,
} from '../../actions/types'

describe('Roles Reducer', () => {
  const actions = {
    load: {
      type: ROLES_LOADED,
      payload: {
        roles: [
          {dothis: true},
          {dothat: false},
        ]
      }
    },
    clear: {
      type: ROLES_CLEARED,
    },
    error: {
      type: ROLES_ERROR
    }
  }
  test('loads and clears roles and handles error', () => {
    // Error loading roles
    let state = reducer(undefined, actions.error);
    expect(state.loading).toBe(false);
    expect(state.rolesData).toBe(null);

    // Load roles
    state = reducer(state, actions.load);
    expect(state.loading).toBe(false);
    expect(state.rolesData).toBe(actions.load.payload);

    // Clear roles
    state = reducer(state, actions.clear);
    expect(state.loading).toBe(false);
    expect(state.rolesData).toBe(null);
  })
})