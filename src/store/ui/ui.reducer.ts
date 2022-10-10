import { IUiState, UiTypes } from './ui.type';
import { IS_MODAL, IS_SPINNER } from './ui.constants';

const initialState: IUiState = {
  isModal: {
    activeModal: false,
    textModal:
      'This is place holder text. The basic dialog for modals should contain only valuable and relevant information. Simplify dialogs by removing unnecessary elements or content that does not support user tasks. If you find that the number of required elements for your design are making the dialog excessively large, then try a different design solution.',
  },
  isSpinner: false,
};

const uiReducer = (state = initialState, action: UiTypes): IUiState => {
  switch (action.type) {
    case IS_MODAL:
      return { ...state, isModal: { ...action.payload } };
    case IS_SPINNER:
      return { ...state, isSpinner: action.payload };
    default:
      return state;
  }
};

export default uiReducer;
