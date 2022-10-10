import { IRootState, IThunkType } from '../rootReducer';
import {
  FarmsTypes,
  IFarmsData,
  ILineData,
  IDeleteItem,
  IHarvest,
  IFeedback,
} from './farms.type';
import {
  SET_FARMS_DATA,
  SET_LINE_DATA,
  SET_ID_DELETE_ITEM,
  ON_FEEDBACK,
  HIDE_MESSAGE,
} from './farms.constants';

import { isModal, isSpinner } from '../ui/ui.actions';
import { composeApi } from '../../apis/compose';
import randomKey from '../../util/randomKey';
import { transformFarmData, transformFarmWithKey } from '../../util/farmUtil';

export const onFeedback = (feedback: IFeedback): FarmsTypes => {
  return {
    type: ON_FEEDBACK,
    payload: feedback,
  };
};

export const hideFeedback = (id: string): FarmsTypes => {
  return {
    type: HIDE_MESSAGE,
    payload: id,
  };
};

export const showFeedback = (dataMessage: IFeedback): IRootState => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const feedback = {
      ...dataMessage,
      id: randomKey(),
    };
    await dispatch(onFeedback(feedback));

    setTimeout(() => {
      dispatch(hideFeedback(feedback.id));
    }, 4000);
  };
};

export const setFarmsData = (data: IFarmsData): FarmsTypes => {
  return {
    type: SET_FARMS_DATA,
    payload: data,
  };
};

export const getFarmsData = (history: any): IRootState => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    dispatch(isSpinner(true));

    const responseData = await composeApi(
      {
        data: {},
        method: 'GET',
        url: 'api/farm/farms-all',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.data) {
      if (responseData?.data?.length) {
        const dataWithKey = transformFarmWithKey(responseData?.data);
        const newData = transformFarmData(dataWithKey);

        dispatch(setFarmsData(newData));
      } else {
        dispatch(setFarmsData(responseData?.data));
      }
    } else {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `Failed to load information`,
        }),
      );
    }

    dispatch(isSpinner(false));
  };
};

export const setLineData = (line: ILineData): FarmsTypes => {
  return {
    type: SET_LINE_DATA,
    payload: line,
  };
};

export const getLineData = (
  lineId: string | number | undefined,
  history: any,
  farmId?: string,
): IRootState => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    dispatch(isSpinner(true));

    const responseData = await composeApi(
      {
        data: {},
        method: 'GET',
        url: `api/farm/line/lines/${lineId}`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.data) {
      if (responseData?.data?.group?.length) {
        const harvestGroupWithKey = responseData?.data?.group?.map(
          (grop: any) => {
            const assessmentsWithKey = grop?.assessments?.map(
              (assessment: any, i: number) => {
                const assessmentWithKey = { ...assessment };
                assessmentWithKey.key = i + 1;

                return assessmentWithKey;
              },
            );

            return { ...grop, assessments: assessmentsWithKey };
          },
        );

        dispatch(
          setLineData({ ...responseData.data, group: harvestGroupWithKey }),
        );
      } else {
        dispatch(setLineData({ ...responseData.data }));
      }
      dispatch(isSpinner(false));
    } else {
      if (history) {
        history.push(`/farms/${farmId}`);
      }
      dispatch(isSpinner(false));
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `Failed to load information`,
        }),
      );
    }
  };
};

export const addFarm = (data: any, history?: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    dispatch(isSpinner(true));
    const {
      auth: {
        auth: { id },
      },
    } = getState();

    const responseData = await composeApi(
      {
        data: { ...data, user_id: id },
        method: 'POST',
        url: 'api/farm/farms',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'Error') {
      dispatch(isSpinner(false));
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `${
            responseData?.message[0]
              ? responseData?.message[0]
              : 'Farm not added'
          }`,
        }),
      );

      return;
    }

    if (responseData?.message === 'Farm created') {
      dispatch(getFarmsData(history));
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'success',
          message: 'Farm added successfully',
        }),
      );
      history.push('/farms');
    } else {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `Farm not added`,
        }),
      );
    }

    dispatch(isSpinner(false));
  };
};

export const editFarm = (
  data: any,
  farmId: string | undefined,
  history: any,
) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    dispatch(isSpinner(true));
    const {
      auth: {
        auth: { id },
      },
    } = getState();

    const responseData = await composeApi(
      {
        data: { ...data, user_id: id, _method: 'patch' },
        method: 'POST',
        url: `api/farm/farms/${farmId}`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'Error') {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `${
            responseData?.message[0]
              ? responseData?.message[0]
              : 'Update farm failed'
          }`,
        }),
      );

      return;
    }

    if (responseData?.message === 'Update completed') {
      dispatch(getFarmsData(history));

      history.push('/farms');
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'success',
          message: `Update farm completed`,
        }),
      );
    } else {
      history.push('/farms');
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `Update farm failed`,
        }),
      );
    }
    dispatch(isSpinner(false));
  };
};

export const createBudget = (
  line_id: number,
  budget: any,
  history: any,
): IRootState => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const responseData = await composeApi(
      {
        data: { ...budget, line_id },
        method: 'POST',
        url: 'api/farm/line/budgets',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData.status === 'Error') {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `${
            responseData?.message[0]
              ? responseData?.message[0]
              : 'Budget not added '
          }`,
        }),
      );
    }
  };
};

export const addLine = (data: any, budget: any, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    dispatch(isSpinner(true));

    const responseData = await composeApi(
      {
        data,
        method: 'POST',
        url: 'api/farm/line/lines',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'Error') {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `${
            responseData?.message[0]
              ? responseData?.message[0]
              : 'Line not added'
          }`,
        }),
      );
      history.push(`/farms/${data.farm_id}`);

      return;
    }

    if (responseData?.status === 'Success') {
      dispatch(createBudget(responseData?.line_id, budget, history));

      dispatch(getFarmsData(history));

      history.push(`/farms/${data.farm_id}`);
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'success',
          message: 'Line added successfully',
        }),
      );
    } else {
      history.push(`/farms/${data.farm_id}`);
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Line not added',
        }),
      );
    }
    dispatch(isSpinner(false));
  };
};

export const editLine = (
  data: any,
  history: any,
  isAllUpdate?: boolean | undefined,
) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const responseData = await composeApi(
      {
        data: { ...data, _method: 'patch' },
        method: 'POST',
        url: `api/farm/line/lines/${data.line_id}`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'Error') {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `${
            responseData?.message[0]
              ? responseData?.message[0]
              : 'Line not updated'
          }`,
        }),
      );

      return;
    }

    if (responseData?.status === 'Success') {
      dispatch(getFarmsData(history));

      if (isAllUpdate) {
        dispatch(getLineData(data.line_id, history));
      }

      dispatch(
        showFeedback({
          isMessage: true,
          type: 'success',
          message: 'Line updated successfully',
        }),
      );
    } else {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Line not updated',
        }),
      );
    }
  };
};

export const createSeedLine = (
  data: any,
  lineId: string | number | undefined,
  history: any,
) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const responseData = await composeApi(
      {
        data: { ...data, line_id: lineId },
        method: 'POST',
        url: 'api/farm/line/harvests',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'Error') {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `${
            responseData?.message
              ? responseData?.message
              : 'Seed the line failed'
          }`,
        }),
      );

      return;
    }

    if (responseData?.status === 'Success') {
      dispatch(getLineData(lineId, history));

      dispatch(getFarmsData(history));
    } else {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Seed the line failed',
        }),
      );
    }
  };
};

export const createCatchSpat = (
  data: any,
  lineId: string | number | undefined,
  history: any,
) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const responseData = await composeApi(
      {
        data: { ...data, line_id: lineId },
        method: 'POST',
        url: 'api/farm/line/catch-spat',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'Error') {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `${
            responseData?.message
              ? responseData?.message
              : 'Catch Spat Line Failed'
          }`,
        }),
      );

      return;
    }

    if (responseData?.status === 'Success') {
      dispatch(getLineData(lineId, history));

      dispatch(getFarmsData(history));
    } else {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Catch Spat Line Failed',
        }),
      );
    }
  };
};

export const addAssessment = (
  data: any,
  lineId: string | number | undefined,
  currentGroup: IHarvest,
  history: any,
) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const validData = {
      ...data,
      line_id: lineId,
      harvest_group_id: currentGroup.id,
    };

    const responseData = await composeApi(
      {
        data: validData,
        method: 'POST',
        url: 'api/farm/line/assessment/assessments',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'Error') {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `${
            responseData?.message[0]
              ? responseData?.message[0]
              : 'Assessment not added'
          }`,
        }),
      );

      return;
    }

    if (responseData?.status === 'Success') {
      dispatch(getLineData(lineId, history));

      dispatch(getFarmsData(history));
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'success',
          message: 'Assessment added successfully',
        }),
      );
    } else {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Assessment not added',
        }),
      );
    }
  };
};

export const editAssessment = (data: any, lineId: string, history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const { id, ...allData } = data;

    const responseData = await composeApi(
      {
        data: {
          ...allData,
          _method: 'PATCH',
        },
        method: 'POST',
        url: `api/farm/line/assessment/assessments/${id}`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'Error') {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `${
            responseData?.message[0]
              ? responseData?.message[0]
              : 'Assessment not updated'
          }`,
        }),
      );

      return;
    }

    if (responseData?.message === 'Update successfully') {
      dispatch(getLineData(lineId, history));

      dispatch(getFarmsData(history));
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'success',
          message: 'Assessment updated successfully',
        }),
      );
    } else {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Assessment not updated',
        }),
      );
    }
  };
};

export const harvestComplete = (
  data: any,
  lineId: string | number | undefined,
  history: any,
) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const responseData = await composeApi(
      {
        data,
        method: 'POST',
        url: 'api/farm/line/harvest-complete',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'Error') {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `${
            responseData?.message[0]
              ? responseData?.message[0]
              : 'Harvest complete failed'
          }`,
        }),
      );

      return;
    }

    if (responseData?.status === 'Success') {
      dispatch(getLineData(lineId, history));

      dispatch(getFarmsData(history));
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'success',
          message: 'Harvest complete success',
        }),
      );
    } else {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Harvest complete failed',
        }),
      );
    }
  };
};

export const harvestUpdate = (
  data: any,
  lineId: string | number | undefined,
  history: any,
) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const { id, ...allData } = data;

    const responseData = await composeApi(
      {
        data: { ...allData, _method: 'patch' },
        method: 'POST',
        url: `api/farm/line/harvests/${id}`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'Error') {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `${
            responseData?.message[0]
              ? responseData?.message[0]
              : 'Harvest group update failed'
          }`,
        }),
      );

      return;
    }

    if (responseData.status === 'Success') {
      dispatch(getLineData(lineId, history));

      dispatch(getFarmsData(history));
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'success',
          message: 'Harvest group update success',
        }),
      );
    } else {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Harvest group update failed',
        }),
      );
    }
  };
};

export const setIdDeleteItem = (item: IDeleteItem): FarmsTypes => {
  return {
    type: SET_ID_DELETE_ITEM,
    payload: item,
  };
};

export const deleteFarm = (deleteItem: any, history: any): IRootState => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const responseData = await composeApi(
      {
        data: {},
        method: 'DELETE',
        url: `api/farm/farms/${deleteItem.id}`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'Error') {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `${
            responseData?.message[0]
              ? responseData?.message[0]
              : 'Failed to delete farm'
          }`,
        }),
      );

      return;
    }

    if (responseData?.message === 'Success') {
      dispatch(getFarmsData(history));
      if (deleteItem.isRedirect) {
        history.push('/farms');
      }
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'success',
          message: `Farm deleted successfully`,
        }),
      );
    } else {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `Failed to delete farm`,
        }),
      );
    }
  };
};

export const deleteLine = (deleteItem: any, history: any): IRootState => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const responseData = await composeApi(
      {
        data: {},
        method: 'DELETE',
        url: `api/farm/line/lines/${deleteItem.id}`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'Error') {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `${
            responseData?.message[0]
              ? responseData?.message[0]
              : 'Failed to delete line'
          }`,
        }),
      );

      return;
    }

    if (responseData?.message === 'Success') {
      dispatch(getFarmsData(history));

      if (deleteItem.isRedirect) {
        history.push(`${deleteItem.isRedirect}`);
      }
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'success',
          message: `Line deleted successfully`,
        }),
      );
    } else {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `Failed to delete line`,
        }),
      );
    }
  };
};

export const deleteAssessment = (deleteItem: any, history: any): IRootState => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const responseData = await composeApi(
      {
        data: { _method: 'delete' },
        method: 'DELETE',
        url: `api/farm/line/assessment/assessments/${deleteItem.id}`,
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.status === 'Error') {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: `${
            responseData?.message[0]
              ? responseData?.message[0]
              : 'Failed to delete assessment'
          }`,
        }),
      );

      return;
    }

    if (responseData?.message === 'Delete successfully') {
      dispatch(getLineData(deleteItem?.lineId, history));

      dispatch(getFarmsData(history));
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'success',
          message: `Assessment deleted successfully`,
        }),
      );
    } else {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Failed to delete assessment',
        }),
      );
    }
  };
};

export const deleteItems = (history: any) => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    const {
      farms: { deleteItem },
    } = getState();

    if (deleteItem?.type === 'isFarms') {
      dispatch(deleteFarm(deleteItem, history));
    }

    if (deleteItem.type === 'isFarm') {
      dispatch(deleteLine(deleteItem, history));
    }

    if (deleteItem?.type === 'isLine') {
      dispatch(deleteAssessment(deleteItem, history));
    }

    dispatch(isModal({ activeModal: false }));
  };
};
