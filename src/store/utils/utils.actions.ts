import { IRootState, IThunkType } from '../rootReducer';
import {
  UtilsTypes,
  IUtilsData,
  IUtilData,
  IXeroAccounts,
  IXeroContacts,
} from './utils.type';

import {
  SET_SEED_DATA,
  SET_MAINTENANCE_DATA,
  SET_COLOR_DATA,
  SET_SEEDTYPE_DATA,
  SET_XERO_CONTACT_DATA,
  SET_XERO_ACCOUNT_DATA,
} from './utils.constants';

import { isSpinner } from '../ui/ui.actions';
import { composeApi } from '../../apis/compose';
import { transformUtil } from '../../util/farmUtil';

export const setXeroContactData = (data: IXeroContacts): UtilsTypes => {
  return {
    type: SET_XERO_CONTACT_DATA,
    payload: data,
  };
};

export const setXeroAccountData = (data: IXeroAccounts): UtilsTypes => {
  return {
    type: SET_XERO_ACCOUNT_DATA,
    payload: data,
  };
};

export const setSeedData = (data: IUtilsData): UtilsTypes => {
  return {
    type: SET_SEED_DATA,
    payload: data,
  };
};

export const setMaintenance = (data: IUtilsData): UtilsTypes => {
  return {
    type: SET_MAINTENANCE_DATA,
    payload: data,
  };
};

export const setColorData = (data: IUtilsData): UtilsTypes => {
  return {
    type: SET_COLOR_DATA,
    payload: data,
  };
};

export const setSeedTypeData = (data: IUtilsData): UtilsTypes => {
  return {
    type: SET_SEEDTYPE_DATA,
    payload: data,
  };
};

export const getXeroContacts = (history: any): IRootState => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    dispatch(isSpinner(true));

    const responseData = await composeApi(
      {
        data: {},
        method: 'POST',
        url: 'api/xero-data/contacts',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.message === 'success') {
      dispatch(setXeroContactData(responseData.data));
    }

    dispatch(isSpinner(false));
  };
};

export const getXeroAccounts = (history: any): IRootState => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    dispatch(isSpinner(true));

    const responseData = await composeApi(
      {
        data: {},
        method: 'POST',
        url: 'api/xero-data/accounts',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.message === 'success') {
      dispatch(setXeroAccountData(responseData.data));
    }

    dispatch(isSpinner(false));
  };
};

export const getUtilData = (category: string, history: any): IRootState => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    dispatch(isSpinner(true));

    const responseData = await composeApi(
      {
        data: {},
        method: 'GET',
        url: 'api/util/utils',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.data) {
      if (responseData?.data?.length) {
        const dataWithKey = transformUtil(category, responseData?.data);

        if (category.toLowerCase() === 'seed')
          dispatch(setSeedData(dataWithKey));
        else if (category.toLowerCase() === 'maintenance')
          dispatch(setMaintenance(dataWithKey));
        else if (category.toLowerCase() === 'color')
          dispatch(setColorData(dataWithKey));
        else if (category.toLowerCase() === 'seedtype')
          dispatch(setSeedTypeData(dataWithKey));
        else if (category.toLowerCase() === 'all') {
          const seeds = transformUtil('seed', responseData?.data);
          const maintenances = transformUtil('maintenance', responseData?.data);
          dispatch(setSeedData(seeds));
          dispatch(setMaintenance(maintenances));
        }
      } else if (category.toLowerCase() === 'seed')
        dispatch(setSeedData(responseData?.data));
      else if (category.toLowerCase() === 'maintenance')
        dispatch(setMaintenance(responseData?.data));
      else if (category.toLowerCase() === 'color')
        dispatch(setColorData(responseData?.data));
      else if (category.toLowerCase() === 'seedtype')
        dispatch(setSeedTypeData(responseData?.data));
      else if (category.toLowerCase() === 'all') {
        dispatch(setSeedData(responseData?.data));
        dispatch(setMaintenance(responseData?.data));
      }
    } else {
      // dispatch(
      //   showFeedback({
      //     isMessage: true,
      //     type: 'error',
      //     message: `Failed to load information`,
      //   }),
      // );
    }

    dispatch(isSpinner(false));
  };
};

export const updateUtil = (newUtil: IUtilData, history: any): IRootState => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    dispatch(isSpinner(true));

    const responseData = await composeApi(
      {
        data: {
          name: newUtil.name,
          type: newUtil.type,
          _method: 'PATCH',
        },
        method: 'POST',
        url: `api/util/utils/${newUtil.id}`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'success') {
      dispatch(getUtilData(newUtil.type, history));
    } else {
      // dispatch(
      //   showFeedback({
      //     isMessage: true,
      //     type: 'error',
      //     message: `Failed to load information`,
      //   }),
      // );
    }

    dispatch(isSpinner(false));
  };
};

export const removeUtil = (
  utilId: string | number,
  utilType: string,
  history: any,
): IRootState => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    dispatch(isSpinner(true));

    const responseData = await composeApi(
      {
        data: {
          _method: 'delete',
        },
        method: 'POST',
        url: `api/util/utils/${utilId}`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'success') {
      dispatch(getUtilData(utilType, history));
    } else {
      // dispatch(
      //   showFeedback({
      //     isMessage: true,
      //     type: 'error',
      //     message: `Failed to load information`,
      //   }),
      // );
    }

    dispatch(isSpinner(false));
  };
};

export const addUtil = (
  value: string,
  type: string,
  history: any,
): IRootState => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    dispatch(isSpinner(true));

    const responseData = await composeApi(
      {
        data: {
          name: value,
          type: type.toLowerCase(),
        },
        method: 'POST',
        url: `api/util/utils`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'success') {
      dispatch(getUtilData(type, history));
    } else {
      // dispatch(
      //   showFeedback({
      //     isMessage: true,
      //     type: 'error',
      //     message: `Failed to load information`,
      //   }),
      // );
    }

    dispatch(isSpinner(false));
  };
};
