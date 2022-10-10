import { combineReducers, Dispatch } from 'redux';

import authReducer from './auth/auth.reducer';
import automationReducer from './automation/automation.reducer';
import farmsReducer from './farms/farms.reducer';
import profileReducer from './profile/profile.reducer';
import uiReducer from './ui/ui.reducer';
import usersReducer from './users/users.reducer';
import budgetReducer from './budget/budget.reducer';
import utilsReducer from './utils/utils.reducer';
import tasksReducer from './tasks/tasks.reducer';
import subscriptReducer from './subscription/subscription.reducer';
import seasonReducer from './seasons/seasons.reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  automation: automationReducer,
  farms: farmsReducer,
  profile: profileReducer,
  ui: uiReducer,
  users: usersReducer,
  budget: budgetReducer,
  subscription: subscriptReducer,
  utils: utilsReducer,
  seasons: seasonReducer,
  tasks: tasksReducer,
});

export default rootReducer;
export type IRootState = ReturnType<typeof rootReducer> | any;
export type IThunkType = Dispatch;
