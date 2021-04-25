import axios from 'axios';
import {
  PRODUCTS_LOADED,
  PRODUCTS_FILTERED_LOADED,
  PRODUCT_BY_ID_LOADED,
  PRODUCTS_ERROR,
  PRODUCTS_ACTION_SUCCESS,
  PRODUCTS_ACTION_CLEARED,
  PRODUCTS_FILTERED_CLEARED,
  PRODUCTS_CLEARED
} from './types';
import { setAlert } from './alert';


// Load product by ID
export const loadProductById = (productId) => async (dispatch) => {

  try {
    const res = await axios.get(`/api/products/product/${productId}`);

    // Set state.products.filteredProducts
    dispatch({
      type: PRODUCT_BY_ID_LOADED,
      payload: res.data
    })

  } catch (error) {

    // Set state.products to null
    dispatch({
      type: PRODUCTS_ERROR
    })
  }
}

// Load products based on filter query
export const loadFilteredProducts = (page, limit, sort, search) => async (dispatch) => {

  let searchString = '';

  // If no search query has been entered by user
  if (search !== undefined) {
    let searchArray = [];
    search.forEach(array => array.forEach(term => searchArray.push(term)))

    searchString = searchArray.toString();
  }

  try {
    const res = await axios.get(`/api/products?page=${page}&limit=${limit}&sort=${sort}&search=${searchString}`);

    console.log('get products: ', `/api/products?page=${page}&limit=${limit}&sort=${sort}&search=${searchString}`)

    // Set state.products.filteredProducts
    dispatch({
      type: PRODUCTS_FILTERED_LOADED,
      payload: res.data
    })

  } catch (error) {

    // Set state.products to null
    dispatch({
      type: PRODUCTS_ERROR
    })
  }
}

// Load all products
export const loadAllProducts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/products');

    // Set state.products.allProducts
    dispatch({
      type: PRODUCTS_LOADED,
      payload: res.data
    })

  } catch (error) {

    // Set state.products
    dispatch({
      type: PRODUCTS_ERROR
    })
  }
}

// Create Product
export const createProduct = (formData) => async (dispatch) => {
  try {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/products', formData, config);

    // Set state.products.
    setTimeout(() => dispatch({type: PRODUCTS_ACTION_SUCCESS}), 500)
    dispatch(setAlert(res.data.msg, 'success'))

  } catch (err) {

    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
    }
  }
}

export const clearProductSubmission = () => async (dispatch) => {

  setTimeout(() => dispatch({type: PRODUCTS_ACTION_CLEARED}), 100)
}

// Clear filtered products
export const clearFilteredProducts = () => (dispatch) => {
  dispatch({type: PRODUCTS_FILTERED_CLEARED})
}

// Clear all products
export const clearProducts = () => dispatch => {
  dispatch({type: PRODUCTS_CLEARED})
}
