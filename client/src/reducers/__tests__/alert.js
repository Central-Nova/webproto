import reducer from '../alert';
import { SET_ALERT, REMOVE_ALERT } from '../../actions/types';
import '@testing-library/jest-dom/extend-expect'

describe('Alert Reducer', () => {
  let actions = {
    add: {
      type: SET_ALERT, 
      payload: {
        title: 'Success!', 
        description : 'The task is completed',
        id: '123' 
      }
    },
    remove: {
      type: REMOVE_ALERT, 
      payload: '123' 
    }
  }
  
  test('adds and removes alert object from state', () => {

    // Add an alert to state
    let state = reducer(undefined, actions.add);
    expect(state).toEqual([actions.add.payload]);

    // Remove an alert from state
    state = reducer(state, actions.remove)
    expect(state).toEqual([]);
  })

})