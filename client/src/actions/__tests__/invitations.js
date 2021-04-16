import { createInvitations } from '../invitations';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { 
  INVITATIONS_SENT,
  INVITATIONS_CLEARED,
  SET_ALERT,
} from '../types';

describe('Invitation Action Creators', () => {
  const middlewares = [thunk]
  const mockStore = configureStore(middlewares);

  beforeEach(() => {
    jest.mock('axios');
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('createInvitations', () => {
    test('dispatches invitation sent, setAlert, and invitation clear', async () => {
      const res = {
        postInvitations: {
          data: {
            msg: {
              title: 'Success',
              description: 'Invitations sent'
            }
          }
        }
      }
      const expectedActions = {
        sentInvitations: {
          type: INVITATIONS_SENT
        },
        setAlert: {
          type: SET_ALERT,
          payload: {
            msg: res.postInvitations.data.msg,
            alertType: 'success',
            id: expect.any(String)
          }
        },
        clearInvitations: {
          type: INVITATIONS_CLEARED
        }
      }
      const formData = {
        emails: [
          {email: 'fake1@mail.com'},
          {email: 'fake2@mail.com'},
          {email: 'fake3@mail.com'},
          {email: 'fake4@mail.com'},
        ]
      }
      jest.useFakeTimers();
      axios.post = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(res.postInvitations))
      const store = mockStore({})
      await store.dispatch(createInvitations(formData));
      jest.runAllTimers();
      const actions = store.getActions();
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.sentInvitations);
      expect(actions[1]).toEqual(expectedActions.setAlert);
      expect(actions[2]).toEqual(expectedActions.clearInvitations);
    }),
    test('dispatches setAlert for each error', async () => {
      const res = {
        postInvitations: {
          response: {
            data: {
              errors: [
                {
                  msg: {
                    title: 'Error',
                    description: 'Invalid email'
                  }
                }
              ]
            }
          }
        }
      }
      const expectedActions = {
        setAlert: {
          type: SET_ALERT,
          payload: {
            msg: res.postInvitations.response.data.errors[0].msg,
            alertType: 'danger',
            id: expect.any(String)
          }
        }
      }
      const formData = {
        emails: [
          {email: 'fake1@mail.com'},
          {email: 'fake2mail.com'},
          {email: 'fake3mail.com'},
          {email: 'fake4mail.com'},
        ]
      }
      axios.post = jest.fn()
      .mockImplementationOnce(() => Promise.reject(res.postInvitations))
      const store = mockStore({})
      await store.dispatch(createInvitations(formData));
      const actions = store.getActions();
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(expectedActions.setAlert);
    })
  })
})