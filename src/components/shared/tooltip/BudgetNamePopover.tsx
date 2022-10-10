import React, { FC, ReactNode, useState } from 'react';
import { Popover } from 'antd';

import Button from '../button/Button';
import { Input } from '../index';

import './styles.scss';

interface IOwnProps {
  children: ReactNode;
  className?: string;
  value: string;
}

const BudgetNameTooltip: FC<IOwnProps> = ({ className, children, value }) => {
  const [name, setName] = useState(value);
  const [visible, setVisible] = useState(false);

  const onConfirm = () => {};

  return (
    <Popover
      visible={visible}
      onVisibleChange={(v: boolean) => setVisible(v)}
      overlayClassName={className}
      placement='bottomLeft'
      content={
        <div>
          <Input
            onChange={e => setName(e.target.value)}
            type='text'
            required
            value={name}
            className='mb-16'
            label='Name'
            placeholder=''
          />
          <div className='d-flex justify-content-end align-items-center'>
            <Button
              width='small'
              size={1}
              type='transparent'
              color='blue'
              onClick={() => setVisible(false)}
            >
              Cancel
            </Button>
            <Button
              width='small'
              size={3}
              type='fill'
              color='green'
              className='ml-16'
              onClick={onConfirm}
            >
              Submit
            </Button>
          </div>
        </div>
      }
      trigger='click'
    >
      {children}
    </Popover>
  );
};

export default BudgetNameTooltip;
