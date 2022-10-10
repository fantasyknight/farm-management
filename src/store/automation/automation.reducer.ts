import { IAutomationState, AutomationTypes } from './automation.type';
import {
  SET_AUTOMATIONS_DATA,
  REMOVE_AUTOMATIONS_MESSAGE,
  SET_AUTOMATIONS_MESSAGE,
} from './automation.constants';

const initialState: IAutomationState = {
  automationsData: [],
  message: {
    isError: false,
    message: '',
  },
};

const automationReducer = (
  state = initialState,
  action: AutomationTypes,
): IAutomationState => {
  switch (action.type) {
    case SET_AUTOMATIONS_DATA:
      return { ...state, automationsData: [...action.payload] };
    case REMOVE_AUTOMATIONS_MESSAGE:
      return { ...state, message: { ...initialState.message } };
    case SET_AUTOMATIONS_MESSAGE:
      return { ...state, message: { ...action.payload } };
    default:
      return state;
  }
};

export default automationReducer;
