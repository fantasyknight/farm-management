import {
  LOGOUT,
  SIGN_IN,
  NEXT_VIEW,
  UPDATE_TOKEN,
  XERO_ACTIVE,
  SET_ACCOUNT_ID,
} from './auth.constants';

export interface AuthState {
  nextView: INextView;
  auth: ISignInPayload;
}

export interface IXeroActive {
  type: typeof XERO_ACTIVE;
  payload: boolean;
}

export interface ISignUpSuccess {
  type: typeof NEXT_VIEW;
  payload: INextView;
}

export interface INextView {
  isSuccess?: boolean;
  email?: string;
  message?: string;
}

export interface ISignInType {
  type: typeof SIGN_IN;
  payload: ISignInPayload;
}

export interface ISetAccount {
  type: typeof SET_ACCOUNT_ID;
  payload: string;
}

export interface ISignInPayload {
  isAuth?: boolean;
  access_token?: string;
  refresh_token?: string;
  xero?: boolean;
  message?: string;
  id?: string;
  account_id?: string;
}

export interface IUpdateTokenType {
  type: typeof UPDATE_TOKEN;
  payload: ISignInPayload;
}

export interface ILogout {
  type: typeof LOGOUT;
}

export interface ILoginData {
  email: string;
  password: string;
  remember: boolean;
}

export type AuthTypes =
  | ISignInType
  | ISignUpSuccess
  | ILogout
  | IXeroActive
  | ISetAccount
  | IUpdateTokenType;
