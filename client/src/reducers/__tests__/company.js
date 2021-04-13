import reducer from '../company';
import '@testing-library/jest-dom/extend-expect';
import { 
  COMPANY_LOADED,
  COMPANY_SUCCESS,
  COMPANY_ERROR,
  COMPANY_CLEARED
} from '../../actions/types';

describe('Company Reducer', () => {
  const actions = {
    loadCompany: {
      type: COMPANY_LOADED,
      payload: {
        name: 'fake company'
      }
    },
    addAccount: {
      type: COMPANY_SUCCESS,
      payload: {
        name: 'fake company'
      }
    },
    clearCompany: {
      type: COMPANY_CLEARED,      
    },
    error: {
      type: COMPANY_ERROR
    }
  }
  test('loads and clears company from state', () => {

    // Load company
    let state = reducer(undefined, actions.loadCompany);
    expect(state.loading).toBe(false);
    expect(state.profile).toBe(actions.loadCompany.payload);

    // Clear Company
    state = reducer(state, actions.clearCompany);
    expect(state.loading).toBe(false);
    expect(state.profile).toBe(null);
  }),
  test('handles company success and error', () => {
    
    // Add Account to company
    let state = reducer(undefined, actions.addAccount);
    expect(state.loading).toBe(false);
    expect(state.profile).toBe(actions.addAccount.payload);

    // Load company failed
    state = reducer(state, actions.error);
    expect(state.loading).toBe(false);
    expect(state.profile).toBe(null);

  })
})