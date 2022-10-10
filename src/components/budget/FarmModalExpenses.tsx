import React, { FC, ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'antd';

import { Button, CloseIcon, Subtitle } from '../shared';
import FarmModalAddExpenses from './FarmModalAddExpenses';
import { IRootState } from '../../store/rootReducer';
import { BudgetState } from '../../store/budget/budget.type';
import { IMainList } from '../../types/basicComponentsTypes';
import randomKey from '../../util/randomKey';
import { useWidth } from '../../util/useWidth';

interface IOwnProps {
  onCancel: () => void;
  onConfirm: () => void;
  visible: boolean;
  className?: string;
  farmId: string | null;
}

const FarmModalExpenses: FC<IOwnProps> = ({
  onConfirm,
  visible,
  onCancel,
  className,
  farmId,
}) => {
  const width = useWidth();
  const [type, setType] = useState('');
  const [addVisible, setAddVisible] = useState(false);

  const handleOnAdd = (selectedType: string) => {
    setType(selectedType);
    setAddVisible(true);
  };

  const handleOnConfirm = () => {
    setAddVisible(false);
    onConfirm();
  };

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
      <div className='wrap mb-24'>
        <div className='d-flex align-items-center'>
          <Subtitle color='black-1' align='left' size={1} fontWeight={600}>
            Select expenses
          </Subtitle>
        </div>
      </div>
      <div className={width > 460 ? 'd-flex align-items-center' : 'd-block'}>
        <Button
          className={width > 460 ? 'mr-16' : 'mb-12'}
          width={width > 460 ? 'small' : 'wide'}
          size={1}
          type='bordered'
          color='blue'
          onClick={() => handleOnAdd('maintenance')}
        >
          {width > 460 ? 'Maintenance expenses' : 'Add maintenance expenses'}
        </Button>
        <Button
          width={width > 460 ? 'small' : 'wide'}
          size={1}
          type='bordered'
          color='blue'
          onClick={() => handleOnAdd('seed')}
        >
          {width > 460 ? 'Seeding expenses' : 'Add seeding expenses'}
        </Button>
      </div>
      <FarmModalAddExpenses
        paramId={Number(farmId)}
        className='budget-modal'
        onConfirm={handleOnConfirm}
        type={type}
        visible={addVisible}
        onCancel={() => setAddVisible(false)}
      />
    </Modal>
  );
};

export default FarmModalExpenses;
