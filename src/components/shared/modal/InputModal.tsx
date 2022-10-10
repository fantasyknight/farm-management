import React, { FC, ReactNode } from 'react';
import { Modal } from 'antd';
// import { RandomNumberGenerationSource } from 'd3-random';

import Button from '../button/Button';
import CloseIcon from '../CloseIcon';
import Subtitle from '../subtitle/Subtitle';

import './styles.scss';
import { useWidth } from '../../../util/useWidth';

interface IOwnProps {
  type: string;
  onCancel: () => void;
  onConfirm: () => void;
  className?: string;
  children: ReactNode;
  hideCancelBtn?: boolean;
  title: string;
  visible: boolean;
  disabled?: boolean;
  confirmNameBtn?: string | undefined;
  modalWidth?: number | undefined;
}

const InputModal: FC<IOwnProps> = ({
  visible,
  onCancel,
  onConfirm,
  hideCancelBtn,
  title,
  children,
  type,
  disabled,
  className,
  confirmNameBtn,
  modalWidth,
}) => {
  const width = useWidth();

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      className={className}
      footer={null}
      closable
      closeIcon={<CloseIcon />}
      width={modalWidth !== undefined ? modalWidth : 600}
    >
      <div className='wrap'>
        <div className='d-flex align-items-center mb-16'>
          <Subtitle color='black-1' align='left' size={1} fontWeight={600}>
            {title}
          </Subtitle>
        </div>
        {children}
      </div>
      <div className='modal-button d-flex justify-content-end align-items-center'>
        {hideCancelBtn && (
          <Button
            width={width < 769 ? 'wide' : 'small'}
            size={2}
            type='transparent'
            color='blue'
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        {type === 'confirm' && (
          <Button
            width={width < 769 ? 'wide' : 'small'}
            size={2}
            type='fill'
            color='green'
            className='ml-16'
            onClick={onConfirm}
            disabled={disabled}
          >
            {confirmNameBtn || <>Confirm</>}
          </Button>
        )}
        {type === 'create' && (
          <Button
            width={width < 769 ? 'wide' : 'small'}
            size={2}
            type='fill'
            color='green'
            className='ml-16'
            onClick={onConfirm}
            disabled={disabled}
          >
            Create
          </Button>
        )}
        {type === 'close' && (
          <Button
            width={width < 769 ? 'wide' : 'small'}
            size={2}
            type='fill'
            color='green'
            className='ml-16'
            onClick={onConfirm}
            disabled={disabled}
          >
            Close
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default InputModal;
