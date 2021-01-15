import {
  PRODUCTS_LOADED,
  PRODUCTS_SUCCESS,
  PRODUCTS_CLEARED,
  PRODUCTS_ERROR} from '../actions/types';

const initialState = {
  loading: true,
  productsData: null,
};

export default function (state=initialState, action) {
  
  const { type, payload } = action;


  switch(type) {
    case PRODUCTS_LOADED:
      return {
        ...state,
        loading: false,
        productsData: payload
      }
    
    case PRODUCTS_ERROR:
      return {
        ...state,
        loading: false,
        productsData: null
      }
      
    default:
      return state
    
  }
}