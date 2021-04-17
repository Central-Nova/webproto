import { loadRoles, loadRolesByDocument, updateCompanyRoles } from '../roles';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { 
  ROLES_LOADED,
  ROLES_ERROR,
  ROLES_CLEARED,
  SET_ALERT
} from '../types'

describe('Roles Action Creators', () => {
  const middlewares = [thunk]
  const mockStore = configureStore(middlewares)

  beforeEach(() => {
    jest.mock('axios');
  })

  afterEach(() => {
    jest.clearAllMocks();
  })
  describe('loadRoles', () => {
    test('dispatches roles loaded', async () => {
      const res = {
        getRoles: {
          data: {
            roles: [
              {
                department: 'Sales', 
                document: 'Sales Invoice',
                action: 'Create',
                worker: true,
                manager: true
              },
              {
                department: 'Sales', 
                document: 'Sales Invoice',
                action: 'Edit',
                worker: true,
                manager: true
              }
            ]
          }
        }
      }
      const expectedActions = {
        loaded: {
          type: ROLES_LOADED,
          payload: res.getRoles.data
        }
      }
      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getRoles));
      const store = mockStore({})
      await store.dispatch(loadRoles());
      const actions = store.getActions();
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.loaded);
    }),
    test('dispatches roles error', async () => {
      const expectedActions = {
        error: {
          type: ROLES_ERROR,
        }
      }
      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.reject());
      const store = mockStore({})
      await store.dispatch(loadRoles());
      const actions = store.getActions();
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.error);
    })
  }),
  describe('loadRolesByDocument', () => {
    test('dispatches roles loaded', async () => {
      const res = {
        getRoles: {
          data: {
            roles: [
              {
                department: 'Sales', 
                document: 'Sales Quote',
                action: 'Create',
                worker: true,
                manager: true
              },
              {
                department: 'Sales', 
                document: 'Sales Quote',
                action: 'Edit',
                worker: true,
                manager: true
              }
            ]
          }
        }
      }
      const expectedActions = {
        loaded: {
          type: ROLES_LOADED,
          payload: res.getRoles.data
        }
      }
      const document = 'Sales Quote'
      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getRoles));
      const store = mockStore({})
      await store.dispatch(loadRolesByDocument(document));
      const actions = store.getActions();
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get.mock.calls[0][0]).toContain(document);
      expect(actions[0]).toEqual(expectedActions.loaded);
    }),
    test('dispatches roles error', async () => {
      const expectedActions = {
        error: {
          type: ROLES_ERROR,
        }
      }
      const document = 'Sales Quote'
      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.reject());
      const store = mockStore({})
      await store.dispatch(loadRolesByDocument(document));
      const actions = store.getActions();
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get.mock.calls[0][0]).toContain(document);
      expect(actions[0]).toEqual(expectedActions.error);
    })
  }),
  describe('updateCompanyRoles', () => {
    test('dispatches loadRoles and setAlert', async () => {
      const res = {
        putRoles: {
          data: {
            msg: {
              title: 'Success', 
              description: 'Company roles updated'
            }
          }
        },
        getRoles: {
          data: {
            roles: [
              {
                department: 'Sales', 
                document: 'Sales Quote',
                action: 'Create',
                worker: true,
                manager: true
              },
              {
                department: 'Sales', 
                document: 'Sales Quote',
                action: 'Edit',
                worker: true,
                manager: true
              }
            ]
          }
        }
      }
      const expectedActions = {
        loadRoles: {
          type: ROLES_LOADED,
          payload: res.getRoles.data
        },
        setAlert: {
          type: SET_ALERT,
          payload: {
            msg: res.putRoles.data.msg,
            alertType: 'success',
            id: expect.any(String)
          }
        }
      }
      const permissionsData = [
        {
          department: 'Sales', 
          document: 'Sales Quote',
          action: 'Create',
          worker: true,
          manager: true
        },
        {
          department: 'Sales', 
          document: 'Sales Quote',
          action: 'Edit',
          worker: false,
          manager: true
        }
      ]
      const companyId = 'fake0918231309'
      const department = 'Sales'

      axios.put = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.putRoles))
      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getRoles));
      const store = mockStore({})
      await store.dispatch(updateCompanyRoles(permissionsData, department));
      const actions = store.getActions();
      console.log(actions)
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put.mock.calls[0][1].permissions).toEqual(permissionsData);
      expect(axios.put.mock.calls[0][0]).toContain(department);
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.setAlert);
      expect(actions[1]).toEqual(expectedActions.loadRoles);
    }),
    test('dispatches setAlert for each error', async () => {
      const res = {
        putRoles: {
          response: {
            data: {
              errors: [
                {msg: {title: 'Error', description: 'You are not authorized to do that'}},                
                {msg: {title: 'Error', description: 'Please log in'}},
              ]
            }
          }
        }
      }
      const expectedActions = {
        setAlert1: {
          type: SET_ALERT,
          payload: {
            msg: res.putRoles.response.data.errors[0].msg,
            alertType: 'danger',
            id: expect.any(String)
          }
        },
        setAlert2: {
          type: SET_ALERT,
          payload: {
            msg: res.putRoles.response.data.errors[1].msg,
            alertType: 'danger',
            id: expect.any(String)
          }
        }
      }
      const permissionsData = [
        {
          department: 'Sales', 
          document: 'Sales Quote',
          action: 'Create',
          worker: true,
          manager: true
        },
        {
          department: 'Sales', 
          document: 'Sales Quote',
          action: 'Edit',
          worker: false,
          manager: true
        }
      ]
      const companyId = 'fake0918231309'
      const department = 'Sales'

      axios.put = jest.fn()
      .mockImplementationOnce(() => Promise.reject(res.putRoles));
      const store = mockStore({})
      await store.dispatch(updateCompanyRoles(permissionsData, department));
      const actions = store.getActions();
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put.mock.calls[0][1].permissions).toEqual(permissionsData);
      expect(axios.put.mock.calls[0][0]).toContain(department);
      expect(actions[0]).toEqual(expectedActions.setAlert1);
      expect(actions[1]).toEqual(expectedActions.setAlert2);
    })
  })
})