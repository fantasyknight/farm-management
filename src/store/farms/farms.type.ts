import {
  SET_FARMS_DATA,
  SET_LINE_DATA,
  SET_ID_DELETE_ITEM,
  ON_FEEDBACK,
  HIDE_MESSAGE,
} from './farms.constants';

export type IFarmState = {
  farmsData: IFarmsData;
  lineData: ILineData | undefined;
  deleteItem: IDeleteItem;
  allFeedback: Array<IFeedback>;
};

export interface IFeedback {
  isMessage?: boolean;
  isMessageModal?: boolean;
  type: string;
  message: string;
  id?: string;
}

export interface IDeleteItem {
  id: undefined | number | string;
  type: undefined | number | string;
  isRedirect?: undefined | string;
  lineId?: undefined | string;
}

export interface IHideMessage {
  type: typeof HIDE_MESSAGE;
  payload: string;
}

interface ISetFarmsData {
  type: typeof SET_FARMS_DATA;
  payload: IFarmsData;
}

interface ISetLineData {
  type: typeof SET_LINE_DATA;
  payload: ILineData;
}

interface ISetIdDeleteItem {
  type: typeof SET_ID_DELETE_ITEM;
  payload: {
    id: undefined | number | string;
    type: undefined | number | string;
  };
}

interface IOnFeedback {
  type: typeof ON_FEEDBACK;
  payload: IFeedback;
}

export type IFarmsData = Array<IFarmData>;

export interface IFarmData {
  key?: number;
  id: string | number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  area: string;
  owners: Array<IOwners>;
  lines: Array<ILineData>;
  farm_number: string;
}

export interface ILineData {
  key?: number;
  condition: number;
  created: number;
  farm_id: string | number;
  farm_name: string;
  group: Array<IHarvest> | undefined;
  id: string | number;
  length: string | number;
  line_name: string;
  planned_date: number;
  planned_date_original: number;
  profit_per_meter: number;
  seed: string;
  seeded_date: number;
  color: string;
  line_idle: number | null;
}

export interface IBudget {
  line_id?: number;
  planned_harvest_tones?: number;
  budgeted_harvest_income?: number;
  length_actual?: number;
  planned_harvest_tones_actual?: number;
  budgeted_harvest_income_actual?: number;
  expenses?: Array<{
    type: string;
    expenses_name: string;
    price_budget: number;
    price_actual?: number;
  }>;
  maintenance_cost?: Array<{ maintenance_name?: string; price: number }>;
}

export interface IHarvest {
  assessments: Array<IAssessment>;
  created_at: number;
  harvest_complete_date: number | null;
  name: string;
  id: number;
  color: string;
  archive_line?: Array<any>;
}

export interface IOwners {
  title: string;
  percent: string;
  id?: number;
}

export interface IAssessment {
  blues: number;
  color: string;
  comment: string;
  conditionScore: number;
  conditionAverage: number;
  conditionMax: number;
  conditionMin: number;
  dateAssessment: number;
  plannedDate: number;
  key?: number;
  tonnes: string;
}

export type FarmsTypes =
  | ISetFarmsData
  | ISetLineData
  | ISetIdDeleteItem
  | IOnFeedback
  | IHideMessage;
