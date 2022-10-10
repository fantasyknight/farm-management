import {
  GET_PROFILE,
  UPDATE_EMAIL,
  UPDATE_PROFILE,
  UPDATE_AVATAR,
  GET_MESSAGE,
  DELETE_MESSAGE,
  UPDATE_EMAIL_PROFILE,
  INITIAL_STATE,
  SET_PERMISSION,
  SET_INVITERS,
  SET_CUR_INVITER,
} from './profile.constants';

export interface ProfileState {
  user: IProfilePayload;
  message: IMessage;
  inviters: string[];
  permission?: IPermissions;
  currentInviter: number;
}

export interface IGetProfile {
  type: typeof GET_PROFILE;
  payload: IProfilePayload;
}

export interface IInitialState {
  type: typeof INITIAL_STATE;
}

export interface IUpdateEmail {
  type: typeof UPDATE_EMAIL;
  payload: IProfilePayload;
}

export interface IUpdateEmailProfile {
  type: typeof UPDATE_EMAIL_PROFILE;
  payload: IProfilePayload;
}

export interface IUpdateAvatar {
  type: typeof UPDATE_AVATAR;
  payload: IProfilePayload;
}

export interface IUpdateProfile {
  type: typeof UPDATE_PROFILE;
  payload: IProfilePayload;
}

export interface IGetMessage {
  type: typeof GET_MESSAGE;
  payload: IMessage;
}

export interface IDeleteMessage {
  type: typeof DELETE_MESSAGE;
}

export interface ISetPermisson {
  type: typeof SET_PERMISSION;
  payload: IPermissions;
}

export interface IMessage {
  isError: boolean;
  message: string;
  type?: string;
}

export interface IProfilePayload {
  email?: string;
  avatar?: string;
  name?: string;
  phone_number?: string;
  company_name?: string;
  company_address?: string;
  role?: string;
  permissions?: IPermission[];
  user_id?: string;
  pendingEmail?: string;
}

export interface IPermission {
  name: string;
}
export interface IPermissions {
  isView: any;
  isEdit: any;
  isFinance: boolean;
}

export interface IInviter {
  id: string;
  email: string;
}
export interface ISetInviters {
  type: typeof SET_INVITERS;
  payload: IInviter[];
}

export interface ISetCurInviter {
  type: typeof SET_CUR_INVITER;
  payload: number;
}

export type ProfileTypes =
  | IGetProfile
  | IUpdateProfile
  | IUpdateEmail
  | IUpdateAvatar
  | IGetMessage
  | IDeleteMessage
  | IUpdateEmailProfile
  | IInitialState
  | ISetInviters
  | ISetCurInviter
  | ISetPermisson;
