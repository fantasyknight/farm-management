import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { Paragrapgh } from '../shared';
import DropdownMenu from '../shared/dropdown-menu/DropdownMenu';

import { ProfileState } from '../../store/profile/profile.type';
import { IRootState } from '../../store/rootReducer';

interface ITableMobileHeader {
  data: any;
  handleOnEdit: (data: any, col?: string | undefined) => void;
  onDeleteRow: (data: any) => void;
}

const MobileAutomation: FC<ITableMobileHeader> = ({
  data,
  handleOnEdit,
  onDeleteRow,
}) => {
  const profile = useSelector<IRootState, ProfileState['user']>(
    state => state.profile.user,
  );

  const checkPermission = () => {
    if (profile.role === 'admin' || profile.role === 'owner') {
      return 1;
    }
    if (
      profile.user_id === data.creator_id ||
      profile.user_id === data.assigned_to
    ) {
      return 1;
    }
    return 0;
  };

  return (
    <div className='table-mobile__card mb-12'>
      {checkPermission() && (
        <div
          className={classNames('table-mobile__card-dots', {
            'hide-element': false,
          })}
        >
          <DropdownMenu
            data={data}
            column='isAutomation'
            onEdit={handleOnEdit}
            onDeleteRow={onDeleteRow}
            type='automations'
          />
        </div>
      )}
      <div className='d-flex pb-23 mt-24'>
        <div className='flex-basis-50'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Contidion
          </Paragrapgh>
          <div className='d-flex align-items-center'>
            <div className='pr-6 tx-color-3'>{`IF ${data?.condition} Is`}</div>
          </div>
        </div>
        <div className='flex-basis-50'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Action
          </Paragrapgh>
          <div className='d-flex align-items-center'>
            <div className='pr-6 tx-color-3'>{`${data?.action} Then`}</div>
          </div>
        </div>
      </div>
      <div className='d-flex pb-23'>
        <div className='flex-basis-100'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Time
          </Paragrapgh>
          <div className='d-flex align-items-center'>
            <div className='pr-6 tx-color-3'>
              {data.time === 0 && <span>At the day</span>}
              {data.time > 0 && (
                <span>{`${data.time} ${data.unit}(s) After`}</span>
              )}
              {data.time < 0 && (
                <span>{`${-data.time} ${data.unit}(s) Before`}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='d-flex pb-23'>
        <div className='flex-basis-100'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Outcome
          </Paragrapgh>
          <div className='d-flex flex-direction-col'>
            <div className='mr-15 tx-left mb-15' style={{ width: 80 }}>
              Create Task
            </div>
            <div
              className='d-flex flex-direction-col tx-left'
              style={{ flex: 1 }}
            >
              <div>
                <span>Title:</span>
                <span>{data.outcome.title}</span>
              </div>
              <div>
                <span>Desc:</span>
                <span>
                  {data.outcome.description.length >= 70
                    ? `${data.outcome.description.slice(0, 70)}...`
                    : data.outcome.description}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAutomation;
