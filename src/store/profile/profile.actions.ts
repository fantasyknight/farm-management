import {
  DELETE_MESSAGE,
  GET_MESSAGE,
  GET_PROFILE,
  UPDATE_AVATAR,
  UPDATE_EMAIL,
  UPDATE_PROFILE,
  UPDATE_EMAIL_PROFILE,
  INITIAL_STATE,
  SET_PERMISSION,
  SET_INVITERS,
  SET_CUR_INVITER,
} from './profile.constants';
import {
  IMessage,
  IProfilePayload,
  IPermissions,
  IInviter,
} from './profile.type';
import { IRootState, IThunkType } from '../rootReducer';
import { composeApi } from '../../apis/compose';

export const getProfile = (payloadIn: IProfilePayload) => {
  return {
    type: GET_PROFILE,
    payload: payloadIn,
  };
};

export const getInitialProfile = () => {
  return {
    type: INITIAL_STATE,
  };
};

export const changeEmail = (payloadIn: IProfilePayload) => {
  return {
    type: UPDATE_EMAIL,
    payload: payloadIn,
  };
};

export const changeEmailProfile = (payloadIn: IProfilePayload) => {
  return {
    type: UPDATE_EMAIL_PROFILE,
    payload: payloadIn,
  };
};

export const changeAvatar = (payloadIn: IProfilePayload) => {
  return {
    type: UPDATE_AVATAR,
    payload: payloadIn,
  };
};

export const changeProfile = (payloadIn: IProfilePayload) => {
  return {
    type: UPDATE_PROFILE,
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

export const setInviters = (payload: IInviter[]) => {
  return {
    type: SET_INVITERS,
    payload,
  };
};

export const setCurrentInviter = (payload: number) => {
  return {
    type: SET_CUR_INVITER,
    payload,
  };
};

export const getInviters = (history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data: [],
        method: 'POST',
        url: 'api/user/inviters',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res) {
      dispatch(setInviters(res.inviters));
      if (res.inviters.length) {
        dispatch(setCurrentInviter(res.inviters[0].id));
      }
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

export const getUserEmail = (history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data: {},
        method: 'GET',
        url: `api/user/get-user-emails`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.email) {
      dispatch(
        changeEmail({
          email: res.email,
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

export const setPermisson = (permission: IPermissions) => {
  return {
    type: SET_PERMISSION,
    payload: permission,
  };
};

export const getUserProfile = (id: string, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data: {},
        method: 'GET',
        url: `api/user/profiles/${id}`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.data) {
      dispatch(
        getProfile({
          ...res.data,
          pendingEmail:
            res.data?.change_email_data?.active === false
              ? res.data?.change_email_data?.new_email
              : '',
        }),
      );

      const newPermissions = {
        isView: false,
        isEdit: false,
        isFinance: false,
      };
      res?.data?.permissions.forEach((currPermission: any) => {
        if (currPermission.name === 'view') {
          newPermissions.isView = true;
        }
        if (currPermission.name === 'edit') {
          newPermissions.isEdit = true;
        }
        if (currPermission.name === 'finance') {
          newPermissions.isFinance = true;
        }
      });

      dispatch(setPermisson(newPermissions));
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

export const updateEmail = (data: any, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data,
        method: 'POST',
        url: 'api/user/email',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res.status !== 'Error') {
      dispatch(
        changeEmailProfile({
          email: data?.email,
        }),
      );
    } else {
      dispatch(
        getMessage({
          isError: true,
          message: res?.message,
          type: 'email',
        }),
      );
    }
  };
};

export const updateProfile = (data: any, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data,
        method: 'POST',
        url: `api/user/profiles/${data.id}`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.data) {
      dispatch(
        changeProfile({
          name: data.name,
          phone_number: data.phone_number,
          company_name: data.company_name,
          company_address: data.company_address,
          avatar: data.avatar,
          role: data.role,
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

export const updateAvatar = (data: any, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data,
        method: 'POST',
        url: 'api/user/profiles/upload-avatar',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.data) {
      dispatch(
        changeAvatar({
          avatar: res.data.avatar,
        }),
      );
    } else {
      dispatch(
        getMessage({
          isError: true,
          message: res?.message || 'Error',
        }),
      );
    }
  };
};

export const updatePassword = (data: any, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data,
        method: 'POST',
        url: 'api/user/password',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (res.status !== 'Error') {
      dispatch(
        getMessage({
          isError: false,
          message: 'Success',
          type: 'password',
        }),
      );
    } else {
      dispatch(
        getMessage({
          isError: true,
          message: res?.message || 'Error',
          type: 'password',
        }),
      );
    }
  };
};
