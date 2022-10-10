import { SET_SUBSCRIPTION_STATUS } from './subscription.constants';

export interface IInvoice {
  total: string;
  date: string;
  id: string;
}

export interface IPlan {
  expire_at: string;
  quantity: number;
}

export interface ISubscriptionState {
  status: string;
  plan_data?: any;
  history?: any;
  payment_method?: any;
  url?: string;
}

export interface ICardDetails {
  cvv: string;
  date: string;
  number: string;
  email?: string;
  holder?: string;
  brand?: string;
}

export interface ISubscriptAction {
  type: typeof SET_SUBSCRIPTION_STATUS;
  payload: ISubscriptionState;
}

export type ISubscriptionTypes = ISubscriptAction;
