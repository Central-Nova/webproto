import reducer from '../auth';
import '@testing-library/jest-dom/extend-expect';
import {
  REGISTER_SUCCESS,
  REGISTER_CLEARED,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from '../../actions/types';

describe('Auth Reducer', () => {

  const actions = {
    loadUser: {
      type: USER_LOADED,
      payload: {
        name: 'fake'
      }
    },
    removeUser: {
      type: AUTH_ERROR
    },
    registered: {
      type: REGISTER_SUCCESS
    },
    failRegister: {
      type: REGISTER_FAIL
    },
    clearRegistered: {
      type: REGISTER_CLEARED
    },
    login: {
      type: LOGIN_SUCCESS
    },
    loginFail: {
      type: LOGIN_FAIL
    },
    logout: {
      type: LOGOUT
    },
  
  }

  test('adds and removes user from state', () => {
    
    // Add user to state
    let state = reducer(undefined, actions.loadUser);
    expect(state.isAuthenticated).toEqual(true);
    expect(state.loading).toEqual(false);
    expect(state.user).toEqual(actions.loadUser.payload);

    // Remove user from state
    state = reducer(state, actions.removeUser);
    expect(state.isAuthenticated).toEqual(false);
    expect(state.loading).toEqual(false);
    expect(state.user).toEqual(null);
  })

  test('handles registration and login success', () => {

    // Recently registered state
    let state = reducer(undefined, actions.registered);
    expect(state.isAuthenticated).toEqual(true);
    expect(state.loading).toEqual(false);
    expect(state.user).toEqual(null);
    expect(state.registered).toEqual(true);

    // Clear registered state
    state = reducer(state, actions.clearRegistered);
    expect(state.registered).toEqual(false);

    // Login
    state = reducer(state, actions.login);
    expect(state.isAuthenticated).toEqual(true);
    expect(state.loading).toEqual(false);
    expect(state.user).toEqual(null);
    expect(state.registered).toEqual(true);

    // Logout
    state = reducer(state, actions.logout);
    expect(state.isAuthenticated).toBe(false)
    expect(state.loading).toBe(false)
    expect(state.user).toBe(null)
  })

  test('handles login and registration fail', () => {
    const failRegistration = () => {
      return reducer(undefined, actions.failRegister)
    }

    const failLogin = (previousState) => {
      return reducer(previousState, actions.loginFail)
    }

    // Fail register
    let state = failRegistration();
    expect(state.isAuthenticated).toBe(false)
    expect(state.loading).toBe(false)
    expect(state.user).toBe(null)

    // Fail login
    state = failLogin(state)
    expect(state.isAuthenticated).toBe(false)
    expect(state.loading).toBe(false)
    expect(state.user).toBe(null)
  })
})
