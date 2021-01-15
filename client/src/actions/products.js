import axios from 'axios';
import { 
  PRODUCTS_LOADED,
  PRODUCTS_SUCCESS,
  PRODUCTS_ERROR,
  PRODUCTS_CLEARED
} from './types';

export const loadProducts = (page, limit, sort) => async (dispatch) => {

  try {
    const res = await axios.get(`/api/products?page=${page}&limit=${limit}&sort=${sort}`);

    // Set state.products.
    dispatch({
      type: PRODUCTS_LOADED,
      payload: res.data 
    })
    
  } catch (error) {

    // Set state.products to null
    dispatch({
      type: PRODUCTS_ERROR
    })
  }
}