import { setAlert, removeAlert } from '../alert';
import '@testing-library/jest-dom/extend-expect';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { REMOVE_ALERT, SET_ALERT } from '../types';

describe('Alert Action Creators', () => {
  const middlewares = [thunk]
  const mockStore = configureStore(middlewares);
  describe('setAlert', () => {
    test('dispatches alert values and removes after timeout', () => {
      jest.useFakeTimers();
      const alertMsg = {title: 'Success', description:'User has been created'}
      const alertType = 'success'
      const expectedActions = {
        set: {
          type: SET_ALERT,
          payload: {
            msg: {
              title: 'Success', description:'User has been created'
            },
            alertType: 'success',
            id: expect.any(String)
          }
        },
        remove: {
          type: REMOVE_ALERT,
          payload: expect.any(String)
        }
      }
      
      const store = mockStore({})
      store.dispatch(setAlert(alertMsg, alertType))
      jest.runAllTimers();

      let actions = store.getActions();

      expect(actions[0]).toEqual(expectedActions.set)
      expect(actions[1]).toEqual(expectedActions.remove)
      expect(actions[1].payload).toEqual(actions[0].payload.id)
    })
  }),
  describe('removeAlert', () => {
    test('removes alert by id', () => {
      const alertId = 'fake109382103'
      const expectedAction = {
        type: REMOVE_ALERT,
        payload: alertId
      }

      const store = mockStore({})
      store.dispatch(removeAlert(alertId))
      const actions = store.getActions();

      expect(actions[0]).toEqual(expectedAction)
    })
  })
})