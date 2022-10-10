import { ISeasonState, SeasonsTypes } from './seasons.type';
import { SET_SEASON_DATA } from './seasons.constants';

const initialState: ISeasonState = {
  seasons: [],
};

const utilsReducer = (
  state = initialState,
  action: SeasonsTypes,
): ISeasonState => {
  switch (action.type) {
    case SET_SEASON_DATA:
      return { ...state, seasons: action.payload };
    default:
      return state;
  }
};

export default utilsReducer;
