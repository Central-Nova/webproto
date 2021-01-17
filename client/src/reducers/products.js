import {
  PRODUCTS_LOADED,
  PRODUCTS_FILTERED_LOADED,
  PRODUCTS_SUCCESS,
  PRODUCTS_CLEARED,
  PRODUCTS_ERROR} from '../actions/types';

const initialState = {
  filteredProducts: {
    loading: true,
    data: null
  },
  allProducts:{
    loading: true,
    data: null
  },
};

export default function (state=initialState, action) {
  
  const { type, payload } = action;


  switch(type) {

    case PRODUCTS_FILTERED_LOADED:
      return {
        ...state,
        filteredProducts: {
          loading: false,
          data: payload
        }
      }

    case PRODUCTS_LOADED:
      return {
        ...state,
        loading: false,
        allProducts: {
          loading: false,
          data: payload

        }
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