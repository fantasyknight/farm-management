import {
  SET_AUTOMATIONS_DATA,
  SET_AUTOMATIONS_MESSAGE,
  REMOVE_AUTOMATIONS_MESSAGE,
} from './automation.constants';

export type IAutomationState = {
  automationsData: IAutomationsData;
  message: IMessage;
};

export interface IAutomation {
  id: string | number;
  condition: string;
  action: string;
  time: number;
  unit: string;
  creator_id?: number;
  assigned_to?: number;
  outcome: {
    title: string;
    description: string;
  };
}

export type IAutomationsData = Array<IAutomation>;

export interface ISetAutomationData {
  type: typeof SET_AUTOMATIONS_DATA;
  payload: IAutomationsData;
}

export interface ISetMessage {
  type: typeof SET_AUTOMATIONS_MESSAGE;
  payload: IMessage;
}

export interface IRemoveMessage {
  type: typeof REMOVE_AUTOMATIONS_MESSAGE;
  payload: IMessage;
}
export interface IMessage {
  isError: boolean;
  message: string;
}

export type AutomationTypes = ISetAutomationData | ISetMessage | IRemoveMessage;
