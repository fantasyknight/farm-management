import { UiTypes, IIsModalType } from './ui.type';
import { IS_MODAL, IS_SPINNER } from './ui.constants';

export const isModal = (isOpen: IIsModalType): UiTypes => {
  const modalData = { ...isOpen };
  if (!isOpen.textModal) {
    modalData.textModal =
      'This is place holder text. The basic dialog for modals should contain only valuable and relevant information. Simplify dialogs by removing unnecessary elements or content that does not support user tasks. If you find that the number of required elements for your design are making the dialog excessively large, then try a different design solution.';
  }

  return {
    type: IS_MODAL,
    payload: modalData,
  };
};

export const isSpinner = (spinner: boolean): UiTypes => ({
  type: IS_SPINNER,
  payload: spinner,
});
