import {
  LOGOUT,
  SIGN_IN,
  NEXT_VIEW,
  UPDATE_TOKEN,
  XERO_ACTIVE,
  SET_ACCOUNT_ID,
} from './auth.constants';
import { AuthState, AuthTypes } from './auth.type';

const initialState: AuthState = {
  nextView: {
    isSuccess: false,
    email: '',
  },
  auth: {
    isAuth: false,
    access_token: '',
    xero: false,
    account_id: '',
    id: '',
  },
};

const authReducer = (state: AuthState = initialState, action: AuthTypes) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        auth: {
          ...state.auth,
          ...action.payload,
        },
      };
    case SET_ACCOUNT_ID:
      return {
        ...state,
        auth: {
          ...state.auth,
          account_id: action.payload,
        },
      };
    case XERO_ACTIVE:
      return {
        ...state,
        auth: { ...state.auth, xero: action.payload },
      };
    case UPDATE_TOKEN:
      return {
        ...state,
        auth: {
          ...state.auth,
          ...action.payload,
        },
      };
    case LOGOUT:
      return {
        ...state,
        auth: { ...initialState.auth },
      };
    case NEXT_VIEW:
      return { ...state, nextView: { ...action.payload } };
    default:
      return state;
  }
};

export default authReducer;
