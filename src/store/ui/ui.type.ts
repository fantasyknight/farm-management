import { IS_MODAL, IS_SPINNER } from './ui.constants';

export interface IUiState {
  isModal: IIsModalType;
  isSpinner: boolean;
}

export interface IIsModal {
  type: typeof IS_MODAL;
  payload: IIsModalType;
}

export type IIsModalType = {
  activeModal: boolean;
  textModal?: string;
};

export interface IIsSpinner {
  type: typeof IS_SPINNER;
  payload: boolean;
}

export type UiTypes = IIsModal | IIsSpinner;
