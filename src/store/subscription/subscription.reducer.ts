import { ISubscriptionState, ISubscriptionTypes } from './subscription.type';
import { SET_SUBSCRIPTION_STATUS } from './subscription.constants';

const initialState: ISubscriptionState = {
  status: 'not_subscribe',
  plan_data: null,
  history: null,
  payment_method: null,
};

const subscriptReducer = (
  state = initialState,
  action: ISubscriptionTypes,
): ISubscriptionState => {
  switch (action.type) {
    case SET_SUBSCRIPTION_STATUS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default subscriptReducer;
