import React, { FC } from 'react';
import { Modal } from 'antd';

import Button from '../button/Button';
import CloseIcon from '../CloseIcon';
import WarningIcon from '../WarningIcon';
import ErrorIcon from '../ErrorIcon';
import Paragrapgh from '../paragrapgh/Paragrapgh';
import Subtitle from '../subtitle/Subtitle';
import Feedback from '../feedback/Feedback';
import { useWidth } from '../../../util/useWidth';

import './styles.scss';

interface IOwnProps {
  type: string;
  onCancel: () => void;
  onConfirm?: () => void;
  className?: string;
  hideCancelBtn?: boolean;
  text: string;
  title: string;
  visible: boolean;
  disabled?: boolean;
  buttonText?: string;
  warningText?: string;
}

const ModalComponent: FC<IOwnProps> = ({
  visible,
  onCancel,
  onConfirm,
  hideCancelBtn,
  title,
  text,
  type,
  className,
  disabled,
  buttonText,
  warningText,
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
      width={600}
    >
      <div className='d-flex align-items-center mb-16'>
        {type === 'warning' && !warningText && (
          <WarningIcon className='mr-10' />
        )}
        {type === 'delete' && <ErrorIcon className='mr-10' />}
        <Subtitle color='black-1' align='left' size={1} fontWeight={600}>
          {title}
        </Subtitle>
      </div>
      <Paragrapgh
        color='black'
        align='left'
        className='mb-16'
        size={2}
        fontWeight={400}
      >
        {text}
      </Paragrapgh>
      {warningText && (
        <Feedback
          isWithoutClosable
          isIcon
          theme='light'
          className='mb-24'
          message={warningText}
          type='warning'
        />
      )}
      <div className='modal-button d-flex justify-content-end align-items-center'>
        {type && !hideCancelBtn && (
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
            {typeof buttonText === 'string' ? buttonText : 'Confirm'}
          </Button>
        )}
        {type === 'warning' && (
          <Button
            width={width < 769 ? 'wide' : 'small'}
            size={2}
            type='fill'
            color='orange'
            className='ml-16'
            onClick={onConfirm}
            disabled={disabled}
          >
            {typeof buttonText === 'string' ? buttonText : 'Warning'}
          </Button>
        )}
        {type === 'delete' && (
          <Button
            width={width < 769 ? 'wide' : 'small'}
            size={2}
            type='fill'
            color='red'
            className='ml-16'
            onClick={onConfirm}
            disabled={disabled}
          >
            Delete
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ModalComponent;
