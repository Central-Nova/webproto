import { addCompanyToUser, loadCompany, createCompany, addAccountToCompany } from '../company';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { 
  COMPANY_LOADED,
  COMPANY_ERROR,
  AUTH_ERROR,
  COMPANY_SUCCESS,
  USER_LOADED,
  SET_ALERT
} from '../types'

describe('Company Action Creators', () => {
  const middlewares = [thunk]
  const mockStore = configureStore(middlewares);

  beforeEach(() => {
    jest.mock('axios');
  })

  afterEach(() => {
    jest.clearAllMocks();
  })
  describe('addCompanyToUser', () => {
    test('dispatches loadUser', async () => {
      const res = {
        getAuth: {
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
        loadUser: {
          type: USER_LOADED,
          payload: res.getAuth.data
        },
      }

      const store = mockStore({});
      const companyId = 'fakeid90183213'

      axios.put = jest.fn()
      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getAuth))
      .mockImplementationOnce(() => Promise.resolve(res.getCompany))

      await store.dispatch(addCompanyToUser(companyId))
      const actions = store.getActions();
      expect(axios.put).toHaveBeenCalledTimes(1);
      // url arg of first call
      expect(axios.put.mock.calls[0][0].includes(companyId)).toBe(true);
      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(actions[0]).toEqual(expectedActions.loadUser)
    }),
    test('dispatches setAlert for each error', async () => {
      const res = {
        putCompany: {
          response: {
            data: {
              errors: [
                {msg: {title: 'Error', description: 'Servor error'}},
                {msg: {title: 'Error', description: 'Please try again'}}
              ]
            }
          }
        }
      }
      const expectedActions = {
        setAlert1: {
          type: SET_ALERT,
          payload: {
            msg: res.putCompany.response.data.errors[0].msg,
            alertType: 'danger',
            id: expect.any(String)
          },
        },
        setAlert2: {
          type: SET_ALERT,
          payload: {
            msg: res.putCompany.response.data.errors[1].msg,
            alertType: 'danger',
            id: expect.any(String)
          },
        }
      }
      const companyId = 'fakeid092813021'

      const store = mockStore({})
      axios.put = jest.fn()
      .mockImplementationOnce(() => Promise.reject(res.putCompany))

      axios.get = jest.fn();
      await store.dispatch(addCompanyToUser(companyId))
      const actions = store.getActions();

      expect(axios.put).toHaveBeenCalledTimes(1);
      // url arg of first call
      expect(axios.put.mock.calls[0][0].includes(companyId)).toBe(true);
      expect(axios.get).toHaveBeenCalledTimes(0);
      expect(actions[0]).toEqual(expectedActions.setAlert1);
      expect(actions[1]).toEqual(expectedActions.setAlert2);
    })
  }),
  describe('loadCompany', () => {
    test('dispatches company loaded', async () => {
      const res = {
        getCompany: {
          data: {
            company: 'fake name',
            email: 'fake@mail.com'
          }
        }
      }
      const expectedActions = {
        loadCompany: {
          type: COMPANY_LOADED,
          payload: res.getCompany.data
        }
      }

      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getCompany))
      const store = mockStore({})
      await store.dispatch(loadCompany())
      const actions = store.getActions();

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.loadCompany);
    }),
    test('dispatches company error for error', async () => {
      const expectedActions = {
        error: {
          type: COMPANY_ERROR
        }
      }
      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.reject())
      const store = mockStore({})
      await store.dispatch(loadCompany());
      const actions = store.getActions();

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.error)
    })
  }),
  describe('createCompany', () => {
    test('dispatches addAccountToCompany, setAlert and loadCompany', async () => {
      const res = {
        postCompany: {
          data: 'fakeid01298321'
        },
        getCompany: {
          data: {
            company: 'fake company',
            email: 'fake@mail.com'
          }
        }
      }
      const expectedActions = {
        setAlert: {
          type: SET_ALERT,
          payload: {
            msg: {
              title: 'Success',
              description: expect.any(String)
            },
            alertType: 'success',
            id: expect.any(String)
          }
        },
        loadCompany: {
          type: COMPANY_LOADED,
          payload: res.getCompany.data
        }
      }
      const formData = {
        businessName: 'fake company name',
        ein: '10923801283921'
      }
      axios.post = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.postCompany))
      axios.put = jest.fn()
      .mockImplementationOnce(() => Promise.resolve())
      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getCompany))
      .mockImplementationOnce(() => Promise.resolve(res.getCompany))

      const store = mockStore({})
      await store.dispatch(createCompany(formData))
      const actions = store.getActions();
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post.mock.calls[0]).toContain(formData);
      expect(axios.put).toHaveBeenCalledTimes(1);
      // url arg of first call
      expect(axios.put.mock.calls[0][0].includes(res.postCompany.data)).toBe(true);
      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(actions[0]).toEqual(expectedActions.setAlert)
      expect(actions[1]).toEqual(expectedActions.loadCompany)
    }),
    test('dispatches setAlert for each error', async () => {
      const res = {
        postCompany: {
          response: {
            data: {
              errors: [
                {msg: {title: 'Error', description: 'EIN is required'}},
                {msg: {title: 'Error', description: 'Company name is required'}}

              ]
            }
          }
        }
      }
      const expectedActions = {
        setAlert1: {
          type: SET_ALERT,
          payload: {
            msg: res.postCompany.response.data.errors[0].msg,
            alertType: 'danger',
            id: expect.any(String)
          }
        },        
        setAlert2: {
          type: SET_ALERT,
          payload: {
            msg: res.postCompany.response.data.errors[1].msg,
            alertType: 'danger',
            id: expect.any(String)
          }
        },
        companyError: {
          type: COMPANY_ERROR
        }
      }
      const formData = {
        businessName: 'fake company name',
        ein: ''
      }
      axios.post = jest.fn()
      .mockImplementationOnce(() => Promise.reject(res.postCompany))
      const store = mockStore({})
      await store.dispatch(createCompany(formData));
      const actions = store.getActions();
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post.mock.calls[0]).toContain(formData);
      expect(actions[0]).toEqual(expectedActions.setAlert1);
      expect(actions[1]).toEqual(expectedActions.setAlert2);
      expect(actions[2]).toEqual(expectedActions.companyError);
    })
  }),
  describe('addAccountToCompany', () => {
    test('dispatches success and setAlert', async () => {
      const res = {
        putCompany: {
          data: {
            company: 'fake company name',
            email: 'fake@mail.com'
          }
        }
      }
      const expectedActions = {
        companySuccess: {
          type: COMPANY_SUCCESS,
          payload: res.putCompany.data
        },
        setAlert: {
          type: SET_ALERT,
          payload: {
            msg: {title: 'Success', description: expect.any(String)},
            alertType: 'success',
            id: expect.any(String)
          }
        }
      }
      const formData = {
        account: 'supplier',
        company: 'fakeid01923812'
      }
      axios.put = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.putCompany))
      const store = mockStore({})
      await store.dispatch(addAccountToCompany(formData))
      const actions = store.getActions();
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put.mock.calls[0]).toContain(formData);
      expect(actions[0]).toEqual(expectedActions.companySuccess);
      expect(actions[1]).toEqual(expectedActions.setAlert);
    }),
    test('dispatches company error and setAlert for each error', async () => {
      const res = {
        putCompany: {
          response: {
            data: {
              errors: [
                {msg: {title: 'Error', description: 'You are not authorized to do that'}},
                {msg: {title: 'Error', description: 'Please log in'}}

              ]
            }
          }
        }
      }
      const expectedActions = {
        setAlert1: {
          type: SET_ALERT,
          payload: {
            msg: res.putCompany.response.data.errors[0].msg,
            alertType: 'danger',
            id: expect.any(String)
          }
        },        
        setAlert2: {
          type: SET_ALERT,
          payload: {
            msg: res.putCompany.response.data.errors[1].msg,
            alertType: 'danger',
            id: expect.any(String)
          }
        },
        companyError: {
          type: COMPANY_ERROR
        }
      }
      const formData = {
        account: 'supplier',
        company: 'fakeid01923812'
      }
      axios.put = jest.fn()
      .mockImplementationOnce(() => Promise.reject(res.putCompany))

      const store = mockStore({})
      await store.dispatch(addAccountToCompany(formData));
      const actions = store.getActions();
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.setAlert1)
      expect(actions[1]).toEqual(expectedActions.setAlert2)
      expect(actions[2]).toEqual(expectedActions.companyError)
    })
  })
})
