import {
  PRODUCTS_LOADED,
  PRODUCTS_FILTERED_LOADED,
  PRODUCT_BY_ID_LOADED,
  PRODUCTS_ACTION_SUCCESS,
  PRODUCTS_ACTION_CLEARED,
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
  submitSuccess: false
};

export default function (state=initialState, action) {
  
  const { type, payload } = action;


  switch(type) {

    case PRODUCTS_FILTERED_LOADED:
    case PRODUCT_BY_ID_LOADED:
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
        allProducts: {
          loading: false,
          data: payload
        }
      }

    case PRODUCTS_ACTION_SUCCESS:
      return {
        ...state,
        submitSuccess: true
      }
     
    case PRODUCTS_ACTION_CLEARED: 
      return {
        ...state,
        submitSuccess: false
      }
    
    case PRODUCTS_ERROR:
      return {
        ...state,
        filteredProducts: {
          loading: false,
          data: null
        },
        allProducts: {
          loading: false,
          data: null
        }
      }
      
    default:
      return state
    
  }
}