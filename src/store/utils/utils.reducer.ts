import { IUtilState, UtilsTypes } from './utils.type';
import {
  SET_SEED_DATA,
  SET_MAINTENANCE_DATA,
  SET_COLOR_DATA,
  SET_SEEDTYPE_DATA,
  SET_XERO_ACCOUNT_DATA,
  SET_XERO_CONTACT_DATA,
} from './utils.constants';

const initialState: IUtilState = {
  seeds: [],
  maintenances: [],
  colors: [],
  seedtypes: [],
  xero_contacts: [],
  xero_accounts: [],
};

const utilsReducer = (state = initialState, action: UtilsTypes): IUtilState => {
  switch (action.type) {
    case SET_XERO_CONTACT_DATA:
      return { ...state, xero_contacts: action.payload };
    case SET_XERO_ACCOUNT_DATA:
      return { ...state, xero_accounts: action.payload };
    case SET_SEED_DATA:
      return { ...state, seeds: action.payload };
    case SET_MAINTENANCE_DATA:
      return { ...state, maintenances: action.payload };
    case SET_COLOR_DATA:
      return { ...state, colors: action.payload };
    case SET_SEEDTYPE_DATA:
      return { ...state, seedtypes: action.payload };
    default:
      return state;
  }
};

export default utilsReducer;
