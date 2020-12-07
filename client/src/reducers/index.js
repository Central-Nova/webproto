import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import company from './company';


export default combineReducers({
  alert,
  auth,
  company
});
