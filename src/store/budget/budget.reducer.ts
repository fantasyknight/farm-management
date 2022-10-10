import { BudgetState, ProfileTypes } from './budget.type';
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

const initialState: BudgetState = {
  total: {},
  budget: [],
  info: [],
  message: {
    isError: false,
    message: '',
  },
};

const budgetReducer = (
  state: BudgetState = initialState,
  action: ProfileTypes,
) => {
  switch (action.type) {
    case GET_TOTAL:
      return {
        ...state,
        total: {
          ...action.payload,
        },
      };
    case GET_MESSAGE:
      return {
        ...state,
        message: {
          ...action.payload,
        },
      };
    case GET_BUDGET:
      return {
        ...state,
        budget: [...action.payload],
      };
    case GET_BUDGET_FARM:
      return {
        ...state,
        info: [...action.payload],
      };
    case GET_BUDGET_LINE:
      return {
        ...state,
        info: [...action.payload],
      };
    case CREATE_SEEDING:
      return {
        ...state,
        message: {
          ...state.message,
          message: 'Success',
          isError: false,
        },
      };
    case CREATE_MAINTENANCE:
      return {
        ...state,
        message: {
          ...state.message,
          message: 'Success',
          isError: false,
        },
      };
    case UPDATE_VALUE:
      return {
        ...state,
        info: state.info.map(item =>
          item.key === action.payload.key ? { ...action.payload } : { ...item },
        ),
      };
    case DELETE_MESSAGE:
      return {
        ...state,
        message: {
          ...initialState.message,
        },
      };
    case INITIAL_STATE:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default budgetReducer;
