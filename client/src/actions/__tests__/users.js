import { loadCompanyUsers, updateUserRoles } from '../users';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import {
  USERS_LOADED,
  USERS_ERROR,
  USERS_UPDATED,
  USERS_READY,
  USERS_CLEARED,
  SET_ALERT
} from '../types';

describe('User Action Creators', () => {
  const middlewares = [thunk]
  const mockStore = configureStore(middlewares)

  beforeEach(() => {
    jest.mock('axios');
  })

  afterEach(() => {
    jest.clearAllMocks();
  })
  describe('loadCompanyUsers', () => {
    test('dispatches users loaded', async () => {
      const res = {
        getUsers: {
          data: [
            {name: 'fake A', email: 'usera@mail.com'},
            {name: 'fake B', email: 'userb@mail.com'},
            {name: 'fake C', email: 'userc@mail.com'},
          ]
        }
      }
      const expectedActions = {
        loaded: {
          type: USERS_LOADED,
          payload: res.getUsers.data
        }
      }
      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getUsers))
      const store = mockStore({});
      await store.dispatch(loadCompanyUsers());
      const actions = store.getActions();
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.loaded)
    }),
    test('dispatches users error and setAlert for each error', async () => {
      const res = {
        getUsers: {
          response: {
            data: {
              errors: [
                {msg: {title: 'Error', description: 'You are not authorized to do that'}}
              ]
            }
          }
        }
      }
      const expectedActions = {
        error: {
          type: USERS_ERROR,
        },
        setAlert: {
          type: SET_ALERT,
          payload: {
            msg: res.getUsers.response.data.errors[0].msg,
            alertType: 'danger',
            id: expect.any(String)
          }
        }
      }
      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.reject(res.getUsers))
      const store = mockStore({});
      await store.dispatch(loadCompanyUsers());
      const actions = store.getActions();
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.setAlert)
      expect(actions[1]).toEqual(expectedActions.error)
    })
  }),
  describe('updateUserRoles', () => {
    test('dispatches loadCompanyUsers, users updated, and setAlert', async () => {
      const res = {
        putUsers: {
          data: {
            msg: {
              title: 'Success',
              description: 'User roles updated'
            }
          }
        },
        getUsers: {
          data: [
            {name: 'fake A', email: 'usera@mail.com'},
            {name: 'fake B', email: 'userb@mail.com'},
            {name: 'fake C', email: 'userc@mail.com'},
          ]
        }
      }
      const expectedActions = {
        loaded: {
          type: USERS_LOADED,
          payload: res.getUsers.data
        },
        setAlert: {
          type: SET_ALERT,
          payload: {
            msg: res.putUsers.data.msg,
            alertType: 'success',
            id: expect.any(String)
          }
        },
        updated: {
          type: USERS_UPDATED
        },
        ready: {
          type: USERS_READY
        }
      }
      const roleData = [
        {department: 'Sales', worker: true, manager: true},
        {department: 'Inventory', worker: true, manager: true},
        {department: 'Warehouse', worker: true, manager: true},
        {department: 'Products', worker: true, manager: true},
      ]
      const userId = 'usr091823102391'
      jest.useFakeTimers();
      
      axios.put = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.putUsers))
      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getUsers))

      const store = mockStore({});
      await store.dispatch(updateUserRoles(roleData, userId));
      jest.runAllTimers();
      const actions = store.getActions();
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.setAlert)
      expect(actions[1]).toEqual(expectedActions.loaded)
      expect(actions[2]).toEqual(expectedActions.updated)
      expect(actions[3]).toEqual(expectedActions.ready)
    }),
    test('dispatches setAlert for each error', async () => {
      const res = {
        putUsers: {
          response: {
            data: {
              errors: [
                {msg: {title: 'Error', description: 'You are not authorized to do that'}}
              ]
            }
          }
        }
      }
      const expectedActions = {
        setAlert: {
          type: SET_ALERT,
          payload: {
            msg: res.putUsers.response.data.errors[0].msg,
            alertType: 'danger',
            id: expect.any(String)
          }
        }
      }
      const roleData = [
        {department: 'Sales', worker: true, manager: true},
        {department: 'Inventory', worker: true, manager: true},
        {department: 'Warehouse', worker: true, manager: true},
        {department: 'Products', worker: true, manager: true},
      ]
      const userId = 'usr091823102391'
      axios.put = jest.fn()
      .mockImplementationOnce(() => Promise.reject(res.putUsers))
      const store = mockStore({});
      await store.dispatch(updateUserRoles(roleData, userId));
      const actions = store.getActions();
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.setAlert)
    })
  })
})