import {
  GET_TOTAL,
  GET_BUDGET,
  GET_BUDGET_FARM,
  GET_BUDGET_LINE,
  CREATE_SEEDING,
  CREATE_MAINTENANCE,
  UPDATE_VALUE,
  DELETE_MESSAGE,
  INITIAL_STATE,
  GET_MESSAGE,
} from './budget.constants';

export interface BudgetState {
  total: ITotalPayload;
  budget: IBudgetPayload[];
  info: IRowPayload[];
  message: IMessage;
}

export interface IInitialState {
  type: typeof INITIAL_STATE;
}

export interface IGetTotal {
  type: typeof GET_TOTAL;
  payload: ITotalPayload;
}

export interface IGetBudget {
  type: typeof GET_BUDGET;
  payload: IBudgetPayload[];
}

export interface IGetBudgetFarm {
  type: typeof GET_BUDGET_FARM;
  payload: IRowPayload[];
}

export interface IGetBudgetLine {
  type: typeof GET_BUDGET_LINE;
  payload: IRowPayload[];
}

export interface ICreateSeed {
  type: typeof CREATE_SEEDING;
  payload: IMessage;
}

export interface ICreateMaintenance {
  type: typeof CREATE_MAINTENANCE;
  payload: IMessage;
}

export interface IUpdateValue {
  type: typeof UPDATE_VALUE;
  payload: IRowPayload;
}

export interface IRowPayload {
  name?: string;
  budgeted?: string;
  actual?: string;
  var?: IValues;
  key?: string;
  budget_id?: number;
  isBg?: boolean;
  data_row?: string;
  expenses_id?: number;
  farm_id?: number;
  rdata?: string;
  expense_date?: string;
}

export interface IDeleteMessage {
  type: typeof DELETE_MESSAGE;
}

export interface IGetMessage {
  type: typeof GET_MESSAGE;
  payload: IMessage;
}

export interface IMessage {
  isError: boolean;
  message: string;
}

export interface ITotalPayload {
  length?: IValues;
  seedingCost?: IValues;
  maintenanceCost?: IValues;
  harvestTonnes?: IValues;
  harvestIncome?: IValues;
}

export interface IBudgetPayload {
  name?: string;
  key?: number;
  id?: number;
  totalLength?: IValues;
  totalSeedingCost?: IValues;
  totalMaintenanceCost?: IValues;
  totalHarvestTonnes?: IValues;
  totalHarvestIncome?: IValues;
  lines?: Iline[];
}

export interface Iline {
  line_name?: string;
  id?: number;
  key?: number;
  length?: IValues;
  seedingCost?: IValues;
  maintenanceCost?: IValues;
  harvestTonnes?: IValues;
  harvestIncome?: IValues;
}

export interface IValues {
  value?: number;
  isGrow?: boolean;
  interest?: number;
  isReverse?: boolean;
}

export type ProfileTypes =
  | IGetTotal
  | IGetBudget
  | IGetBudgetFarm
  | IGetBudgetLine
  | IGetMessage
  | ICreateSeed
  | IDeleteMessage
  | ICreateMaintenance
  | IUpdateValue
  | IInitialState;
