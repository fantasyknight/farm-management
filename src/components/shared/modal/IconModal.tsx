import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';

import Title from '../title/Title';
import Paragraph from '../paragrapgh/Paragrapgh';
import Button from '../button/Button';
import CheckModalIcon from '../CheckModalIcon';
import ErrorModalIcon from '../ErrorModalIcon';
import CloseIcon from '../CloseIcon';

interface IOwnProps {
  visible: boolean;
  type: string;
  title: string;
  text: string;
  onCancel: () => void;
}

const IconModal: FC<IOwnProps> = ({ onCancel, visible, type, title, text }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      closeIcon={<CloseIcon />}
      footer={null}
      closable
      width={600}
    >
      <div className='pt-18 pb-18 w-100 tx-center'>
        {type === 'success' && <CheckModalIcon />}
        {type === 'error' && <ErrorModalIcon />}
        <Title
          className='mb-8 mt-24'
          size={6}
          color='black-3'
          align='default'
          fontWeight={600}
        >
          {title}
        </Title>
        <Paragraph
          className='mb-32'
          size={1}
          color='black'
          align='default'
          fontWeight={400}
        >
          {text}
        </Paragraph>
        <Link to='/profile/subscriptions'>
          <Button color='blue' size={1} width='small' type='bordered'>
            Back to subscriptions
          </Button>
        </Link>
      </div>
    </Modal>
  );
};

export default IconModal;
