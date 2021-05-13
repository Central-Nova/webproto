import { loadUser, loginUser, register, logoutUser } from '../auth';
import '@testing-library/jest-dom/extend-expect'
import axios from 'axios'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { 
  USER_LOADED, 
  COMPANY_LOADED,
  SET_ALERT,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT,
  COMPANY_CLEARED
} from '../types';

describe('Auth Action Creators', () => {
  const middlewares = [thunk]
  const mockStore = configureStore(middlewares);

  beforeEach(() => {
    jest.mock('axios');
  })

  afterEach(() => {
    jest.clearAllMocks();
  })
  describe('loadUser', () => {
    test('dispatches load user and load company', async () => {
      const res = {
        getUser: {
          data: { 
          name: 'fake person',
          email: 'fake@mail.com'
          }
        },
        getCompany: {
          data: {
          company: 'fake company',
          email: 'fake@company.com'
          }
        }
      }
      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getUser))
      .mockImplementationOnce(() => Promise.resolve(res.getCompany))
      const store = mockStore({})

      await store.dispatch(loadUser());
      const actions = store.getActions();
      const expectedActions = {
        loadUser: {
          type: USER_LOADED, 
          payload: res.getUser.data
        },
        loadCompany: {
          type: COMPANY_LOADED, 
          payload: res.getCompany.data
        }
      }
      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(actions[0]).toEqual(expectedActions.loadUser)
      expect(actions[1]).toEqual(expectedActions.loadCompany)
    }),
    test('dispatches setAlert on errors', async () => {

      const res = {
        getUser: {
          response: {
            data: {
              errors: [
                {msg: {title: 'Error', description: 'User has not authenticated'}},
                {msg: {title: 'Error', description: 'Please log in.'}},
              ]
            }
          }
        },
      }
      const expectedActions = {
        setAlert1: {
          type: SET_ALERT,
          payload: {
            msg: res.getUser.response.data.errors[0].msg,
            alertType: 'danger',
            id: expect.any(String)
          }
        },
        setAlert2: {
          type: SET_ALERT,
          payload: {
            msg: res.getUser.response.data.errors[1].msg,
            alertType: 'danger',
            id: expect.any(String)
          }
        },
        authError: {
          type: AUTH_ERROR
        }
      }
      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.reject(res.getUser))
      const store = mockStore({})
        
      await store.dispatch(loadUser())
      let actions = store.getActions();
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.setAlert1)
      expect(actions[1]).toEqual(expectedActions.setAlert2)
      expect(actions[2]).toEqual(expectedActions.authError);
      
    })
  }),
  describe('loginUser', () => {
    test('dispatches login, setAlert and loadUser', async () => {
      const res = {
        postAuth: {
          data: {
            msg: {
              title: 'Success!',
              description: 'You have logged in'
            }
          }
        },
        getUser: {
          data: { 
          name: 'fake person',
          email: 'fake@mail.com'
          }
        },
        getCompany: {
          data: {
          company: 'fake company',
          email: 'fake@company.com'
          }
        }
      }

      const formData = {
        email: 'fake@mail.com',
        password: 'faketest123098'
      }

      axios.post = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.postAuth))

      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getUser))
      .mockImplementationOnce(() => Promise.resolve(res.getCompany))

      const expectedActions = {
        loginUser: {
          type: LOGIN_SUCCESS
        },
        setAlert: {
          type: SET_ALERT,
          payload: {
            msg: res.postAuth.data.msg,
            alertType: 'success',
            id: expect.any(String)
          }
        },
        loadUser: {
          type: USER_LOADED,
          payload: res.getUser.data
        }

      }
      const store = mockStore({});
      await store.dispatch(loginUser(formData))
      const actions = store.getActions();
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post.mock.calls[0]).toContain(formData);
      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(actions[0]).toEqual(expectedActions.loginUser)
      expect(actions[1]).toEqual(expectedActions.setAlert)
      expect(actions[2]).toEqual(expectedActions.loadUser)
    }),
    test('dispatches setAlert and login fail on errors', async () => {
      const res = {
        postAuth: {
          response: {
            data: {
              errors: [
                {msg: {title: 'Error', description: 'Email is required'}},
                {msg: {title: 'Error', description: 'Password is required'}}
              ]
            }
          }
        },
      }

      const expectedActions = {
        setAlert1: {
          type: SET_ALERT,
          payload: {
            msg: res.postAuth.response.data.errors[0].msg,
            alertType: 'danger',
            id: expect.any(String)
          }      
        },
        setAlert2: {
          type: SET_ALERT,
          payload: {
            msg: res.postAuth.response.data.errors[1].msg,
            alertType: 'danger',
            id: expect.any(String)
          }      
        },
        loginFail: {
          type: LOGIN_FAIL
        }
      }

      const formData = {
        email: '',
        password: ''
      }
      
      const store = mockStore();

      axios.post = jest.fn()
      .mockImplementationOnce(() => Promise.reject(res.postAuth))

      await store.dispatch(loginUser(formData));
      const actions = store.getActions();
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post.mock.calls[0]).toContain(formData);
      expect(axios.get).toHaveBeenCalledTimes(0);
      expect(actions[0]).toEqual(expectedActions.setAlert1)
      expect(actions[1]).toEqual(expectedActions.setAlert2)
      expect(actions[2]).toEqual(expectedActions.loginFail)
    })
  }),
  describe('register', () => {
    test('dispatches register success, setAlert and loadUser', async () => {
      const res = {
        postUser: {
            data: {
              msg: {
                title: 'Success',
                description: 'User registered'
              }
          }
        },
        getUser: {
          data: {
            name: 'fake name',
            email: 'fake@mail.com'
          }
        },
        getCompany: {
          data: {
            company: 'fake company',
            email: 'fake@mail.com'
          }
        }
      }

      const expectedActions = {
        register: {
          type: REGISTER_SUCCESS
        },
        setAlert: {
          type: SET_ALERT,
          payload: {
            msg: res.postUser.data.msg,
            alertType: 'success',
            id: expect.any(String)
          }
        },
        loadUser: {
          type: USER_LOADED,
          payload: res.getUser.data
        },
      }

      const formData = {
        email: 'fake@mail.com',
        password: 'fakepw902183'
      }
      axios.post = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.postUser))

      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getUser))
      .mockImplementationOnce(() => Promise.resolve(res.getCompany))
      
      const store = mockStore();
      await store.dispatch(register(formData))
      const actions = store.getActions()
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post.mock.calls[0]).toContain(formData);
      expect(actions[0]).toEqual(expectedActions.register);
      expect(actions[1]).toEqual(expectedActions.setAlert);
      
    }),
    test('dispatches setAlert for each error', async () => {
      const res = {
        postUser: {
          response: {
            data: {
              errors: [
                {msg: {title: 'Error', description: 'Email is required'}},
                {msg: {title: 'Error', description: 'Password is required'}}
              ]
            }
          }
        },
      }

      const expectedActions = {
        setAlert1: {
          type: SET_ALERT,
          payload: {
            msg: res.postUser.response.data.errors[0].msg,
            alertType: 'danger',
            id: expect.any(String)
          }
        },        
        setAlert2: {
          type: SET_ALERT,
          payload: {
            msg: res.postUser.response.data.errors[1].msg,
            alertType: 'danger',
            id: expect.any(String)
          }
        },
        registerFail: {
          type: REGISTER_FAIL
        }
      }

      const formData = {
        email: 'fake@mail.com',
        password: 'fakewrongpassword'
      }
      axios.post = jest.fn()
      .mockImplementationOnce(() => Promise.reject(res.postUser))
      
      const store = mockStore();
      await store.dispatch(register(formData))
      const actions = store.getActions()
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post.mock.calls[0]).toContain(formData);
      expect(axios.get).toHaveBeenCalledTimes(0);
      expect(actions[0]).toEqual(expectedActions.setAlert1);
      expect(actions[1]).toEqual(expectedActions.setAlert2);
      expect(actions[2]).toEqual(expectedActions.registerFail)
    })
  })
  describe('logoutUser', () => {
    test('dispatches logout and clear company', async () => {
      const expectedActions = {
        logout: {
          type: LOGOUT
        },
        clearCompany: {
          type: COMPANY_CLEARED
        }
      }
      axios.get = jest.fn();
      const store = mockStore();
      await store.dispatch(logoutUser());
      const actions = store.getActions();
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.logout);
      expect(actions[1]).toEqual(expectedActions.clearCompany);
    })
  })
})
