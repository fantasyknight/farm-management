import {
  GET_MESSAGE,
  GET_USER,
  GET_USERS,
  EDIT_USER,
  ADD_USER,
  DELETE_MESSAGE,
  DELETE_USER,
  DEACTIVATE_USER,
  ACTIVATE_USER,
  INITIAL_USER,
} from './users.constants';
import { IMessage, IUserPayload } from './users.type';
import { IRootState, IThunkType } from '../rootReducer';
import { composeApi } from '../../apis/compose';

export const getUser = (payloadIn: IUserPayload) => {
  return {
    type: GET_USER,
    payload: payloadIn,
  };
};

export const getUsers = (payloadIn: IUserPayload[]) => {
  return {
    type: GET_USERS,
    payload: payloadIn,
  };
};

export const editUser = (payloadIn: IUserPayload) => {
  return {
    type: EDIT_USER,
    payload: payloadIn,
  };
};

export const getInitialUser = () => {
  return {
    type: INITIAL_USER,
  };
};

export const deleteStoreUser = (payloadIn: IUserPayload) => {
  return {
    type: DELETE_USER,
    payload: payloadIn,
  };
};

export const deactivateStoreUser = (payloadIn: IUserPayload) => {
  return {
    type: DEACTIVATE_USER,
    payload: payloadIn,
  };
};

export const activateStoreUser = (payloadIn: IUserPayload) => {
  return {
    type: ACTIVATE_USER,
    payload: payloadIn,
  };
};

export const addUser = (payloadIn: IUserPayload) => {
  return {
    type: ADD_USER,
    payload: payloadIn,
  };
};

export const getMessage = (payloadIn: IMessage) => {
  return {
    type: GET_MESSAGE,
    payload: payloadIn,
  };
};

export const deleteMessage = () => {
  return {
    type: DELETE_MESSAGE,
  };
};

export const getAllUsers = (history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data: null,
        method: 'GET',
        url: 'api/user/users',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.data) {
      const users: IUserPayload[] = res.data.map(
        (item: IUserPayload, index: number) => {
          const user = { ...item };
          user.key = index;
          user.id = item.user_id;
          return user;
        },
      );
      dispatch(getUsers(users));
    } else {
      dispatch(
        getMessage({
          isError: true,
          message: res?.message,
        }),
      );
    }
  };
};

export const getSelectedUser = (data: any, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data,
        method: 'GET',
        url: 'api/user/users/',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res) {
      dispatch(
        getUser({
          email: '',
        }),
      );
    } else {
      dispatch(
        getMessage({
          isError: true,
          message: res?.message,
        }),
      );
    }
  };
};

export const createUser = (data: any, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data,
        method: 'POST',
        url: 'api/user/invite',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.status === 'Success') {
      dispatch(
        addUser({
          email: data.email,
          status: 'pending',
          key: new Date().getTime(),
        }),
      );
    } else {
      dispatch(
        getMessage({
          isError: true,
          message: res?.message,
        }),
      );
    }
  };
};

export const updateUser = (data: any, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data,
        method: 'POST',
        url: 'api/user/role-permissions-update',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.status === 'Success') {
      dispatch(editUser({}));
    } else {
      dispatch(
        getMessage({
          isError: true,
          message: res?.message ? res?.message : 'Error',
        }),
      );
    }
  };
};

export const deleteUser = (id: string, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data: { attr: id },
        method: 'POST',
        url: `api/user/destroy-user`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.status === 'success') {
      dispatch(
        deleteStoreUser({
          id,
        }),
      );
    } else {
      dispatch(
        getMessage({
          isError: true,
          message: res?.message,
        }),
      );
    }
  };
};

export const deactivateUser = (id: number, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data: { user_id: id },
        method: 'POST',
        url: `api/user/deactivate`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.message === 'success') {
      dispatch(
        deactivateStoreUser({
          id: id.toString(),
        }),
      );
    } else {
      dispatch(
        getMessage({
          isError: true,
          message: res?.message,
        }),
      );
    }
  };
};

export const activateUser = (id: string, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data: { user_id: id },
        method: 'POST',
        url: `api/user/activate-deactivated-user`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.message === 'success') {
      dispatch(
        activateStoreUser({
          id,
        }),
      );
    } else {
      dispatch(
        getMessage({
          isError: true,
          message: res?.message,
        }),
      );
    }
  };
};
