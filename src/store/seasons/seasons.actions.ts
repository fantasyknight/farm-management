import { IRootState, IThunkType } from '../rootReducer';
import { SeasonsTypes, ISeasonsData, ISeasonData } from './seasons.type';
import { SET_SEASON_DATA } from './seasons.constants';

import { isSpinner } from '../ui/ui.actions';
import { composeApi } from '../../apis/compose';
import { transformSeason } from '../../util/seasonUtil';

export const setSeasonData = (data: ISeasonsData): SeasonsTypes => {
  return {
    type: SET_SEASON_DATA,
    payload: data,
  };
};

export const getSeasonData = (history: any): IRootState => {
  return async (dispatch: IThunkType, getState: () => IRootState) => {
    dispatch(isSpinner(true));

    const responseData = await composeApi(
      {
        data: {},
        method: 'GET',
        url: 'api/season/seasons',
        requireAuth: true,
      },
      dispatch,
      getState().auth.auth,
      history,
    );

    if (responseData?.data) {
      if (responseData?.data?.length) {
        const dataWithKey = transformSeason(responseData?.data);
        dispatch(setSeasonData(dataWithKey));
      } else {
        dispatch(setSeasonData(responseData?.data));
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
