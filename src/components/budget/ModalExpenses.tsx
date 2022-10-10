import React, { FC, ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'antd';

import { Button, CloseIcon, Subtitle } from '../shared';
import ModalAddExpenses from './ModalAddExpenses';
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
}

const ModalExpenses: FC<IOwnProps> = ({
  onConfirm,
  visible,
  onCancel,
  className,
}) => {
  const width = useWidth();
  const budgetInfoStore = useSelector<IRootState, BudgetState['info']>(
    state => state.budget.info,
  );
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
      <ModalAddExpenses
        paramId={
          budgetInfoStore.length ? (budgetInfoStore[1]?.budget_id as number) : 0
        }
        className='budget-modal'
        onConfirm={handleOnConfirm}
        type={type}
        visible={addVisible}
        onCancel={() => setAddVisible(false)}
      />
    </Modal>
  );
};

export default ModalExpenses;
