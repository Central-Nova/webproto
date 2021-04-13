import reducer from '../users';
import '@testing-library/jest-dom/extend-expect';
import {
  USERS_LOADED,
  USERS_UPDATED,
  USERS_READY,
  USERS_ERROR,
  USERS_CLEARED,
} from '../../actions/types'

describe('Users Reducer', () => {
  const actions = {
    load: {
      type: USERS_LOADED,
      payload: [
        {name: 'user1'},
        {name: 'user2'},
        {name: 'user3'},
      ]
    },
    update: {
      type: USERS_UPDATED,
    },
    ready: {
      type: USERS_READY
    },
    error: {
      type: USERS_ERROR
    },
    clear: {
      type: USERS_CLEARED
    }
  }
  test('loads and remove users from state, and handles error', () => {
    // Error loading users
    let state = reducer(undefined, actions.error);
    expect(state.loading).toBe(false);
    expect(state.profiles).toBe(null)

    // Load users
    state = reducer(state, actions.load);
    expect(state.loading).toBe(false);
    expect(state.profiles).toBe(actions.load.payload)

    // Clear users
    state = reducer(state, actions.clear);
    expect(state.loading).toBe(false);
    expect(state.profiles).toBe(null)
  })
  test('tracks user update action', () => {
    // Update user
    let state = reducer(undefined, actions.update);
    expect(state.loading).toBe(false);
    expect(state.updated).toBe(true);

    // Clear updated state
    state = reducer(state, actions.ready);
    expect(state.loading).toBe(false);
    expect(state.updated).toBe(false);
  })
})

