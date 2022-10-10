import { SET_SEASON_DATA } from './seasons.constants';

export type ISeasonState = {
  seasons: ISeasonsData;
};

interface ISetSeasonData {
  type: typeof SET_SEASON_DATA;
  payload: ISeasonsData;
}

export type ISeasonsData = Array<ISeasonData>;

export interface ISeasonData {
  key?: number;
  id: string;
  user_id: number;
  season_name: string;
}

export type SeasonsTypes = ISetSeasonData;
