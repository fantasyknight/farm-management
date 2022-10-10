import { IRootState, IThunkType } from '../rootReducer';
import { ISubscriptionState, ISubscriptionTypes } from './subscription.type';
import { SET_SUBSCRIPTION_STATUS } from './subscription.constants';

export const setSubscriptionStatus = (
  payload: ISubscriptionState,
): ISubscriptionTypes => ({
  type: SET_SUBSCRIPTION_STATUS,
  payload,
});
