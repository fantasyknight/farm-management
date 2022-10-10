import {
  GET_TOTAL,
  GET_BUDGET,
  GET_BUDGET_FARM,
  GET_BUDGET_LINE,
  GET_MESSAGE,
  CREATE_SEEDING,
  CREATE_MAINTENANCE,
  UPDATE_VALUE,
  DELETE_MESSAGE,
  INITIAL_STATE,
} from './budget.constants';
import {
  IBudgetPayload,
  ITotalPayload,
  IMessage,
  IRowPayload,
} from './budget.type';
import { IRootState, IThunkType } from '../rootReducer';
import { composeApi } from '../../apis/compose';
import { getInterest } from '../../util/getInterest';
import { getBudgetByLine } from '../../util/budgetLine';
import { getBudgetByFarm } from '../../util/budgetFarm';
import { getBudgetMain } from '../../util/budgetMain';

export const getInitialBudget = () => {
  return {
    type: INITIAL_STATE,
  };
};

export const getMessage = (payloadIn: IMessage) => {
  return {
    type: GET_MESSAGE,
    payload: payloadIn,
  };
};

export const getAllTotal = (payloadIn: ITotalPayload) => {
  return {
    type: GET_TOTAL,
    payload: payloadIn,
  };
};

export const getAllBudget = (payloadIn: IBudgetPayload[]) => {
  return {
    type: GET_BUDGET,
    payload: payloadIn,
  };
};

export const getAllBudgetFarm = (payloadIn: IRowPayload[]) => {
  return {
    type: GET_BUDGET_FARM,
    payload: payloadIn,
  };
};

export const getAllBudgetLine = (payloadIn: IRowPayload[]) => {
  return {
    type: GET_BUDGET_LINE,
    payload: payloadIn,
  };
};

export const updateValue = (payloadIn: IRowPayload) => {
  return {
    type: UPDATE_VALUE,
    payload: payloadIn,
  };
};

export const createSeding = () => {
  return {
    type: CREATE_SEEDING,
  };
};

export const createMaintenance = () => {
  return {
    type: CREATE_MAINTENANCE,
  };
};

export const deleteMessage = () => {
  return {
    type: DELETE_MESSAGE,
  };
};

export const getBudget = (history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data: {},
        method: 'GET',
        url: 'api/farm/line/budgets',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.data) {
      const { budget, totals } = getBudgetMain(res.data);
      dispatch(getAllBudget(budget));
      dispatch(getAllTotal(totals));
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

export const getBudgetFarm = (data: any, type: string, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data,
        method: 'POST',
        url: 'api/farm/line/budgets/farm-budget',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.data) {
      let rows: IRowPayload[] = [];

      if (type === 'farm') {
        if (!res?.data.length) {
          dispatch(
            getMessage({
              isError: true,
              message: 'The selected farm id is invalid.',
            }),
          );
        } else {
          rows = getBudgetByFarm(res?.data[0]);
        }
      }
      if (type === 'line') {
        if (!res?.data[0].lines.length) {
          dispatch(
            getMessage({
              isError: true,
              message: 'The selected line id is invalid.',
            }),
          );
        } else {
          rows = getBudgetByLine(res?.data[0]);
        }
      }

      dispatch(getAllBudgetFarm(rows));
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

export const getBudgetLine = (history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data: {},
        method: 'GET',
        url: '',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.data) {
      const info: IRowPayload[] = res.data.map((item: any, index: number) => {
        const infoItem = { ...item };
        infoItem.key = index;
        infoItem.id = item.farm_id;
        return infoItem;
      });
      dispatch(getAllBudgetLine(info));
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

export const updateBudgetValue = (data: any, type: string, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const url =
      type === 'budget-part'
        ? 'api/farm/line/budgets/update-budget-part'
        : 'api/farm/line/budgets/update-expenses-part';
    const res = await composeApi(
      {
        data,
        method: 'POST',
        url,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.status === 'Success') {
      // dispatch(updateValue(data));
      dispatch(
        getMessage({
          isError: false,
          message: 'Success',
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

export const updateFarmBudgetValue = (
  data: any,
  type: string,
  history: any,
) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const url =
      type === 'budget-part'
        ? 'api/farm/budgets/update-farm-budget-part'
        : 'api/farm/budgets/update-farm-expenses-part';
    const res = await composeApi(
      {
        data,
        method: 'POST',
        url,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.status === 'Success') {
      // dispatch(updateValue(data));
      dispatch(
        getMessage({
          isError: false,
          message: 'Success',
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

export const createBudget = (data: any, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data,
        method: 'POST',
        url: 'api/farm/line/budgets/add-expenses',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.status === 'Success') {
      dispatch(
        getMessage({
          isError: false,
          message: 'Success',
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

export const createFarmBudget = (data: any, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const res = await composeApi(
      {
        data,
        method: 'POST',
        url: 'api/farm/budgets/add-farm-expenses',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );
    if (res?.status === 'Success') {
      dispatch(
        getMessage({
          isError: false,
          message: 'Success',
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
