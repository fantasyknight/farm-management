import {
  GET_USERS,
  GET_USER,
  EDIT_USER,
  ADD_USER,
  GET_MESSAGE,
  DELETE_MESSAGE,
  DELETE_USER,
  DEACTIVATE_USER,
  ACTIVATE_USER,
  INITIAL_USER,
} from './users.constants';

export interface UsersState {
  users: IUserPayload[];
  message: IMessage;
}

export interface IGetUsers {
  type: typeof GET_USERS;
  payload: IUserPayload[];
}

export interface IGetUser {
  type: typeof GET_USER;
  payload: IUserPayload;
}

export interface IInitialUser {
  type: typeof INITIAL_USER;
}

export interface IEditUser {
  type: typeof EDIT_USER;
  payload: IUserPayload;
}

export interface IDeleteUser {
  type: typeof DELETE_USER;
  payload: IUserPayload;
}

export interface IDeactivateUser {
  type: typeof DEACTIVATE_USER;
  payload: IUserPayload;
}

export interface IActivateUser {
  type: typeof ACTIVATE_USER;
  payload: IUserPayload;
}

export interface IAddUser {
  type: typeof ADD_USER;
  payload: IUserPayload;
}

export interface IGetMessage {
  type: typeof GET_MESSAGE;
  payload: IMessage;
}

export interface IDeleteMessage {
  type: typeof DELETE_MESSAGE;
}

export interface IMessage {
  isError: boolean;
  message: string;
}

export interface IUserPayload {
  email?: string;
  name?: string;
  status?: string;
  role?: string;
  key?: number;
  id?: string;
  user_id?: string;
  farms?: Array<number>;
  lines?: Array<number>;
}

export type UsersTypes =
  | IAddUser
  | IEditUser
  | IGetUser
  | IGetUsers
  | IGetMessage
  | IDeleteMessage
  | IDeleteUser
  | IDeactivateUser
  | IActivateUser
  | IInitialUser;
