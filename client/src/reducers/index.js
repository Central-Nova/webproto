import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import company from './company';
import roles from './roles';
import users from './users';


export default combineReducers({
  alert,
  auth,
  company,
  roles,
  users
});
