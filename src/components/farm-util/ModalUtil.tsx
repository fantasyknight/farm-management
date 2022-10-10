import React, { FC, useState } from 'react';
import { InputModal, Input, Paragrapgh } from '../shared';

import './styles.scss';

interface IOwnProps {
  type: string;
  defaultValue: string;
  onCancel: () => void;
  onConfirm: (newV: string) => void;
  title: string;
  visible: boolean;
}

const ModalTask: FC<IOwnProps> = ({
  type,
  defaultValue,
  onCancel,
  onConfirm,
  title,
  visible,
}) => {
  const [value, setValue] = useState('');

  return (
    <InputModal
      visible={visible}
      onCancel={() => {
        setValue('');
        onCancel();
      }}
      title={title}
      type={type === 'add' ? 'create' : 'confirm'}
      onConfirm={() => {
        onConfirm(value);
        setValue('');
      }}
    >
      {type !== 'delete' && (
        <Input
          type='text'
          className='mb-16'
          onChange={e => setValue(e.target.value)}
          placeholder={defaultValue}
          value={value}
          label='Name'
          dataType='name'
          max={255}
          required
        />
      )}
      {type === 'delete' && (
        <Paragrapgh
          color='black'
          align='left'
          className='mb-16'
          size={2}
          fontWeight={400}
        >
          Are you sure to delete the record?
        </Paragrapgh>
      )}
    </InputModal>
  );
};

export default ModalTask;
