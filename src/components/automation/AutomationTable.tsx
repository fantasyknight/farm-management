import React, { FC, useEffect } from 'react';
import { Table } from 'antd';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import './styles.scss';
import useColumns from '../shared/tables/useColumns';
import MobileAutomationTable from './MobileAutomationTable';
import DropdownMenu from '../shared/dropdown-menu/DropdownMenu';
import { useWidth } from '../../util/useWidth';

import { ProfileState } from '../../store/profile/profile.type';
import { IRootState } from '../../store/rootReducer';

interface ITables {
  data: any[];
  column: string;
  isTableChild?: boolean;
  onEdit: (dat: any) => void;
  onDelete: (dat: any) => void;
}

const AutomationTable: FC<ITables> = ({
  data,
  column,
  isTableChild,
  onEdit,
  onDelete,
}) => {
  const columns = useColumns(column);
  const width = useWidth();

  const profile = useSelector<IRootState, ProfileState['user']>(
    state => state.profile.user,
  );

  const handleOnEdit = (dat: any) => {
    onEdit(dat);
  };

  const onDeleteRow = (dat: any) => {
    onDelete(dat);
  };

  const checkPermission = (d: any) => {
    if (profile.role === 'admin' || profile.role === 'owner') {
      return 1;
    }
    if (profile.user_id === d.creator_id || profile.user_id === d.assigned_to) {
      return 1;
    }
    return 0;
  };

  const editField = {
    title: '',
    key: 'more',
    align: 'right',
    render: (d: any) =>
      checkPermission(d) ? (
        <>
          <DropdownMenu
            data={d}
            column={column}
            onEdit={handleOnEdit}
            onDeleteRow={onDeleteRow}
            type='automations'
          />
        </>
      ) : (
        <></>
      ),
  };

  const getColumns = () => {
    return [...columns, editField];
  };

  return (
    <>
      {width > 820 ? (
        <Table
          className={classNames(`budget table table--${column}`, {
            'table--is__shild': isTableChild,
          })}
          pagination={false}
          columns={getColumns()}
          dataSource={data}
        />
      ) : (
        <MobileAutomationTable
          data={data}
          handleOnEdit={handleOnEdit}
          onDeleteRow={onDeleteRow}
        />
      )}
    </>
  );
};

export default AutomationTable;
