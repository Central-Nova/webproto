import axios from 'axios';
import { 
  PRODUCTS_LOADED,
  PRODUCTS_FILTERED_LOADED,
  PRODUCTS_SUCCESS,
  PRODUCTS_ERROR,
  PRODUCTS_CLEARED
} from './types';

export const loadFilteredProducts = (page, limit, sort, search) => async (dispatch) => {

  let searchString = '';

  if (search !== undefined) {
    let searchArray = [];
    search.forEach(array => array.forEach(term => searchArray.push(term)))

    searchString = searchArray.toString();
    console.log('searchString: ', searchString);
  }


  try {
    const res = await axios.get(`/api/products?page=${page}&limit=${limit}&sort=${sort}&search=${searchString}`);

    // Set state.products.
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

export const loadAllProducts = () => async (dispatch) => {


  try {
    const res = await axios.get('/api/products');

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