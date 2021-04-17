import { createProduct, loadAllProducts, loadFilteredProducts, loadProductById } from '../products';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { 
  PRODUCTS_LOADED,
  PRODUCTS_FILTERED_LOADED,
  PRODUCT_BY_ID_LOADED,
  PRODUCTS_ERROR,
  PRODUCTS_ACTION_SUCCESS,
  PRODUCTS_ACTION_CLEARED,
  SET_ALERT
} from '../types';

describe('Products Action Creators', () => {
  const middlewares = [thunk]
  const mockStore = configureStore(middlewares)

  beforeEach(() => {
    jest.mock('axios');
  })

  afterEach(() => {
    jest.clearAllMocks();
  })
  describe('createProduct', () => {
    test('dispatches action success and setAlert', async () => {
      const res = {
        postProducts: {
          data: {
            msg: {
              title: 'Success',
              description: 'Product created'
            }
          }
        }
      }
      const expectedActions = {
        actionSuccess: {
          type: PRODUCTS_ACTION_SUCCESS
        },
        setAlert: {
          type: SET_ALERT,
          payload: {
            msg: res.postProducts.data.msg,
            alertType: 'success',
            id: expect.any(String)
          }
        }
      }
      const formData = {
        products: [
          {
            sku: 'fakesku210938',
            name: 'fake product A',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum, quos!',
          },
          {
            sku: 'fakesku321345',
            name: 'fake product B',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum, quos!',
          },
        ]
      }
      jest.useFakeTimers();
      axios.post = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.postProducts))
      const store = mockStore({})
      await store.dispatch(createProduct(formData))
      jest.runAllTimers();
      const actions = store.getActions();
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post.mock.calls[0]).toContain(formData);
      expect(actions[0]).toEqual(expectedActions.setAlert);
      expect(actions[1]).toEqual(expectedActions.actionSuccess);
    }),
    test('dispatches setAlert for each error', async () => {
      const res = {
        postProducts: {
          response: {
            data: {
              errors: [
                {msg: {title: 'Error',description: 'SKU is required'}},
                {msg: {title: 'Error',description: 'Description is required'}},
               ]
            }
          }
        }
      }
      const expectedActions = {
        setAlert1: {
          type: SET_ALERT,
          payload: {
            msg: res.postProducts.response.data.errors[0].msg,
            alertType: 'danger',
            id: expect.any(String)
          }
        },
        setAlert2: {
          type: SET_ALERT,
          payload: {
            msg: res.postProducts.response.data.errors[1].msg,            alertType: 'danger',
            id: expect.any(String)
          }
        }
      }
      const formData = {
        products: [
          {
            sku: '',
            name: 'fake product A',
            description: '',
          },
          {
            sku: '',
            name: 'fake product B',
            description: '',
          },
        ]
      }
      axios.post = jest.fn()
      .mockImplementationOnce(() => Promise.reject(res.postProducts))
      const store = mockStore({})
      await store.dispatch(createProduct(formData))
      const actions = store.getActions();
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post.mock.calls[0]).toContain(formData);
      expect(actions[0]).toEqual(expectedActions.setAlert1);
      expect(actions[1]).toEqual(expectedActions.setAlert2);
    })
  }),
  describe('loadAllProducts', () => {
    test('dispatches products loaded', async () => {
      const res = {
        getProducts: {
          data: [
            {sku: 'fake190238', name: 'fake A'},
            {sku: 'fake890451', name: 'fake B'},
            {sku: 'fake023894', name: 'fake C'},
            {sku: 'fake018321', name: 'fake D'},
          ]
        }
      }
      const expectedActions = {
        loaded: {
          type: PRODUCTS_LOADED,
          payload: res.getProducts.data
        },
      }

      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getProducts))
      const store = mockStore({})
      await store.dispatch(loadAllProducts())
      const actions = store.getActions();
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.loaded);
    }),
    test('dispatches products error on error', async () => {
      const expectedActions = {
        error: {
          type: PRODUCTS_ERROR,
        },
      }

      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.reject())
      const store = mockStore({})
      await store.dispatch(loadAllProducts())
      const actions = store.getActions();
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.error);
    })
  }),
  describe('loadFilteredProducts', () => {
    test('dispatches products filtered loaded', async () => {
      const res = {
        getProducts: {
          data: [
            {sku: 'fake190238', name: 'fake A'},
            {sku: 'fake890451', name: 'fake B'},
            {sku: 'fake023894', name: 'fake C'},
            {sku: 'fake018321', name: 'fake D'},
          ]
        }
      }
      const expectedActions = {
        loaded: {
          type: PRODUCTS_FILTERED_LOADED,
          payload: res.getProducts.data
        },
      }
      let page = 0
      let limit = 5
      let sort = 'sku'
      let search = [['sku-210938', 'ex product a'],['sku-029834', 'ex product b']]

      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getProducts))
      const store = mockStore({})
      await store.dispatch(loadFilteredProducts(page, limit, sort, search))
      const actions = store.getActions();
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get.mock.calls[0][0]).toContain(page);
      expect(axios.get.mock.calls[0][0]).toContain(limit);
      expect(axios.get.mock.calls[0][0]).toContain(sort);
      expect(actions[0]).toEqual(expectedActions.loaded);
      search.forEach(array => array.forEach(item => expect(axios.get.mock.calls[0][0]).toContain(item)))
    }),
    test('dispatches products error on error', async () => {
      const expectedActions = {
        error: {
          type: PRODUCTS_ERROR,
        },
      }
      let page = 0
      let limit = 5
      let sort = 'sku'
      let search = [['sku-210938', 'ex product a'],['sku-029834', 'ex product b']]


      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.reject())
      const store = mockStore({})
      await store.dispatch(loadFilteredProducts(page, limit, sort, search))
      const actions = store.getActions();
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get.mock.calls[0][0]).toContain(page);
      expect(axios.get.mock.calls[0][0]).toContain(limit);
      expect(axios.get.mock.calls[0][0]).toContain(sort);
      expect(actions[0]).toEqual(expectedActions.error);
      search.forEach(array => array.forEach(item => expect(axios.get.mock.calls[0][0]).toContain(item)))
    })
  }),
  describe('loadProductById', () => {
    test('dispatches product by id loaded', async () => {
      const res = {
        getProducts: {
          data: {
            sku: 'fakesku210938',
            name: 'fake product A',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum, quos!',
          },
        }
      }
      const expectedActions = {
        loaded: {
          type: PRODUCT_BY_ID_LOADED,
          payload: res.getProducts.data
        },
      }
      const productId = 'fake901820398213'

      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.getProducts))
      const store = mockStore({})
      await store.dispatch(loadProductById(productId))
      const actions = store.getActions();
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get.mock.calls[0][0]).toContain(productId)
      expect(actions[0]).toEqual(expectedActions.loaded);
    }),
    test('dispatches products error on error', async () => {
      const expectedActions = {
        error: {
          type: PRODUCTS_ERROR,
        },
      }
      const productId = 'fake901820398213'

      axios.get = jest.fn()
      .mockImplementationOnce(() => Promise.reject())
      const store = mockStore({})
      await store.dispatch(loadProductById(productId))
      const actions = store.getActions();
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get.mock.calls[0][0]).toContain(productId)
      expect(actions[0]).toEqual(expectedActions.error);
    })
  })
})