import reducer from '../products';
import '@testing-library/jest-dom/extend-expect';
import {
  PRODUCTS_LOADED,
  PRODUCTS_FILTERED_LOADED,
  PRODUCT_BY_ID_LOADED,
  PRODUCTS_ERROR,
  PRODUCTS_ACTION_SUCCESS,
  PRODUCTS_ACTION_CLEARED,
} from '../../actions/types';

describe('Products Reducer', () => {

  const actions = {
    loadAll: {
      type: PRODUCTS_LOADED,
      payload: {
        products: [
          {name: 'product1'},
          {name: 'product2'}
        ]
      }
    },
    loadFiltered: {
      type: PRODUCTS_FILTERED_LOADED,
      payload: {
        products: [
          {name: 'product1'},
        ]
      }
    },    
    loadById: {
      type: PRODUCT_BY_ID_LOADED,
      payload: {
        name: 'product1'
      }
    }, 
    error: {
      type: PRODUCTS_ERROR,
    },    
    actionSuccess: {
      type: PRODUCTS_ACTION_SUCCESS,
    },
    actionCleared: {
      type: PRODUCTS_ACTION_CLEARED
    }
  }
  
  test('loads products, tracks product actions and handles error', () => {
    // Load all products
    let state = reducer(undefined, actions.loadAll)
    expect(state.filteredProducts.data).toBe(null)
    expect(state.filteredProducts.loading).toBe(true)
    expect(state.allProducts.data).toBe(actions.loadAll.payload);
    expect(state.allProducts.loading).toBe(false);

    // Load products with filter
    state = reducer(state, actions.loadFiltered);
    expect(state.filteredProducts.data).toBe(actions.loadFiltered.payload)
    expect(state.filteredProducts.loading).toBe(false)
    expect(state.allProducts.data).toBe(actions.loadAll.payload);
    expect(state.allProducts.loading).toBe(false);


    // Load product by id
    state = reducer(state, actions.loadById);
    expect(state.filteredProducts.data).toBe(actions.loadById.payload)
    expect(state.filteredProducts.loading).toBe(false)
    expect(state.allProducts.data).toBe(actions.loadAll.payload);
    expect(state.allProducts.loading).toBe(false);

    // Action success
    state = reducer(state, actions.actionSuccess);
    expect(state.filteredProducts.data).toBe(actions.loadById.payload)
    expect(state.filteredProducts.loading).toBe(false)
    expect(state.allProducts.data).toBe(actions.loadAll.payload);
    expect(state.allProducts.loading).toBe(false);
    expect(state.submitSuccess).toBe(true);

    // Action clear
    state = reducer(state, actions.actionCleared)
    expect(state.filteredProducts.data).toBe(actions.loadById.payload)
    expect(state.filteredProducts.loading).toBe(false)
    expect(state.allProducts.data).toBe(actions.loadAll.payload);
    expect(state.allProducts.loading).toBe(false);
    expect(state.submitSuccess).toBe(false);

    // Error loading products
    state = reducer(state, actions.error);

    expect(state.filteredProducts.data).toBe(null)
    expect(state.filteredProducts.loading).toBe(false)
    expect(state.allProducts.data).toBe(null);
    expect(state.allProducts.loading).toBe(false);
  })
})

