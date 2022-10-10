import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Dropdown, InputModal, Input } from '../shared';
import {
  addAutomation,
  updateAutomation,
} from '../../store/automation/automation.actions';
import { IRootState } from '../../store/rootReducer';
import { UsersState } from '../../store/users/users.type';
import { ProfileState } from '../../store/profile/profile.type';
import { IAutomation } from '../../store/automation/automation.type';

interface IOwnProps {
  onCancel: () => void;
  onConfirm: () => void;
  visible: boolean;
  className?: string;
  type: boolean;
  data?: any;
}

const ModalAutomation: FC<IOwnProps> = ({
  onConfirm,
  visible,
  onCancel,
  type,
  data,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const usersStore = useSelector<IRootState, UsersState['users']>(
    state => state.users.users,
  );
  const profile = useSelector<IRootState, ProfileState['user']>(
    state => state.profile.user,
  );

  const conditionsList = [
    {
      value: 'Seeding',
      label: 'Seeding',
      id: 'seeding',
    },
    {
      value: 'Harvesting',
      label: 'Harvesting',
      id: 'harvesting',
    },
    {
      value: 'Assessment',
      label: 'Assessment',
      id: 'assessment',
    },
  ];

  const actionsList = [
    {
      value: 'Created',
      label: 'Created',
      id: 'created',
    },
    {
      value: 'Completed',
      label: 'Completed',
      id: 'completed',
    },
    {
      value: 'Upcoming',
      label: 'Upcoming',
      id: 'upcoming',
    },
  ];

  const units = [
    {
      id: '1',
      value: 'hour',
      label: 'Hour',
    },
    {
      id: '2',
      value: 'day',
      label: 'Day',
    },
    {
      id: '3',
      value: 'week',
      label: 'Week',
    },
    {
      id: '4',
      value: 'month',
      label: 'Month',
    },
  ];

  const [isEdit, setIsEdit] = useState(false);
  const [automationId, setAutomationId] = useState(0);
  const [condition, setCondition] = useState('Seeding');
  const [action, setAction] = useState('Created');
  const [time, setTime] = useState(0);
  const [unit, setUnit] = useState('day');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creatorID, setCreatorID] = useState(0);
  const [charger, setCharger] = useState(0);

  useEffect(() => {
    if (data) {
      setAutomationId(data.id);
      setCondition(data.condition);
      setAction(data.action);
      setTime(data.time);
      setUnit(data.unit);
      setTitle(data.outcome.title);
      setDescription(data.outcome.description);
      setIsEdit(true);
      setCreatorID(data.creator_id);
      setCharger(data.assigned_to);
    } else {
      if (
        profile.role !== 'admin' &&
        profile.role !== 'owner' &&
        profile.user_id
      ) {
        setCharger(parseInt(profile.user_id, 10));
      }
      setIsEdit(false);
    }
  }, [data]);

  const handleConfirmAction = async (e: any) => {
    if (!type) {
      await dispatch(addAutomation(e, history));
    } else {
      await dispatch(
        updateAutomation(
          {
            id: automationId,
            ...e,
          },
          history,
        ),
      );
    }
    onConfirm();
  };

  const handleOnSelectCharger = (value: string) => {
    setCharger(Number(value));
  };

  return (
    <InputModal
      visible={visible}
      onCancel={() => {
        setCondition('Seeding');
        setAction('Created');
        setTime(0);
        setUnit('day');
        setTitle('');
        setDescription('');
        setIsEdit(false);
        setCreatorID(0);
        setCharger(0);
        onCancel();
      }}
      type={!type ? 'create' : 'confirm'}
      title={!type ? 'Add Automation' : 'Edit Automation'}
      onConfirm={() => {
        if (title !== '' && description !== '') {
          let dat = {
            condition,
            action,
            time,
            unit,
            title,
            description,
            assigned_to: 0,
          };
          if (charger) {
            dat = { ...dat, assigned_to: charger };
          }
          handleConfirmAction(dat);
          setCondition('Seeding');
          setAction('Created');
          setTime(0);
          setUnit('day');
          setTitle('');
          setDescription('');
          setIsEdit(false);
          setCreatorID(0);
          setCharger(0);
          onCancel();
        }
      }}
    >
      <Dropdown
        className='mr-16 w-100 mb-24'
        placeholder='Choose Condition'
        onChange={value => setCondition(value)}
        label='Condition'
        options={conditionsList}
        defaultValue={condition}
      />
      <Dropdown
        className='mr-16 w-100 mb-24'
        placeholder='Choose Action'
        onChange={value => setAction(value)}
        label='Action'
        options={actionsList}
        defaultValue={action}
      />
      <div className='d-flex pb-17 time-input'>
        <div className='mr-16 w-50 mb-24'>
          <Input
            type='number'
            onChange={e => setTime(parseInt(e.target.value, 10))}
            className='w-100'
            value={`${time}`}
            label='Time'
            placeholder='time'
          />
        </div>
        <div className='w-50 mb-24'>
          <Dropdown
            className='w-100'
            placeholder='Choose Unit'
            onChange={value => setUnit(value)}
            label='Unit'
            options={units}
            defaultValue={unit}
          />
        </div>
      </div>
      {(profile?.role === 'owner' || profile?.role === 'admin') &&
        (isEdit === false ||
          (isEdit === true && `${profile.user_id}` === `${creatorID}`)) && (
          <Dropdown
            className='mb-16'
            placeholder='select person responsible'
            defaultValue={charger ? charger.toString() : '0'}
            onChange={(value, event) => handleOnSelectCharger(value)}
            label='Select person responsible'
            options={[
              {
                value: '0',
                id: '0',
                label: ' -- No Person -- ',
              },
              ...usersStore.map(el => {
                return {
                  value: el.id!.toString(),
                  id: el.id!.toString(),
                  label: el.name,
                };
              }),
            ]}
          />
        )}
      <Input
        type='text'
        onChange={e => setTitle(e.target.value)}
        className='mr-16 w-100 mb-24'
        value={title}
        label='Title'
        placeholder='title'
      />
      <Input
        type='textarea'
        onChange={e => setDescription(e.target.value)}
        className='mr-16 w-100 mb-24'
        value={description}
        label='Description'
        placeholder='description'
      />
    </InputModal>
  );
};
export default ModalAutomation;

/*

Action should be: created, completed, upcoming
Time should be have option: before/after and select 1-14 days
Outcome would be: Create task with the title and description.

*/
