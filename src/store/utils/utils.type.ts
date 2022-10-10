import {
  SET_SEED_DATA,
  SET_MAINTENANCE_DATA,
  SET_COLOR_DATA,
  SET_SEEDTYPE_DATA,
  SET_XERO_ACCOUNT_DATA,
  SET_XERO_CONTACT_DATA,
} from './utils.constants';

export type IUtilState = {
  seeds: IUtilsData;
  maintenances: IUtilsData;
  colors: IUtilsData;
  seedtypes: IUtilsData;
  xero_contacts: IXeroContacts;
  xero_accounts: IXeroAccounts;
};

interface ISetSeedData {
  type: typeof SET_SEED_DATA;
  payload: IUtilsData;
}

interface ISetMaintenanceData {
  type: typeof SET_MAINTENANCE_DATA;
  payload: IUtilsData;
}

interface ISetColorData {
  type: typeof SET_COLOR_DATA;
  payload: IUtilsData;
}

interface ISetSeedTypeData {
  type: typeof SET_SEEDTYPE_DATA;
  payload: IUtilsData;
}

interface ISetXeroContactData {
  type: typeof SET_XERO_CONTACT_DATA;
  payload: IXeroContacts;
}

interface ISetXeroAccountData {
  type: typeof SET_XERO_ACCOUNT_DATA;
  payload: IXeroAccounts;
}

export type IXeroContacts = Array<IXeroContact>;
export interface IXeroContact {
  ContactID: string;
  Name: string;
}

export type IXeroAccounts = Array<IXeroAccount>;
export interface IXeroAccount {
  Code: string;
  Name: string;
}

export type IUtilsData = Array<IUtilData>;
export interface IUtilData {
  key?: number;
  id: string | number;
  name: string;
  type: string;
}

export type UtilsTypes =
  | ISetXeroAccountData
  | ISetXeroContactData
  | ISetSeedData
  | ISetMaintenanceData
  | ISetColorData
  | ISetSeedTypeData;
