import React, { FC, useRef, useState } from 'react';
import { Table } from 'antd';

import InterestGrowth from '../shared/tables-card/InterestGrowth';
import BudgetTooltip from '../shared/tooltip/BudgetPopover';

import './styles.scss';
import BudgetNameTooltip from '../shared/tooltip/BudgetNamePopover';

interface IOwnProps {
  type: string;
  dataLine: any;
}

const OverallTable: FC<IOwnProps> = ({ type, dataLine }) => {
  const columns = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      width: '16%',
      // render: (value: string, record: any) => {
      //   if (!record.isEdit || type === 'farm') {
      //     return value;
      //   }
      //   return (
      //     <BudgetNameTooltip className='budget-popover' value={value}>
      //       <span className='table-editName'>{value}</span>
      //     </BudgetNameTooltip>
      //   );
      // },
    },
    {
      title: 'Budgeted',
      dataIndex: 'budgeted',
      key: 'budgeted',
      render: (value: string, record: any) => {
        if (
          record.name === 'Profit' ||
          record.name === 'Seeding cost' ||
          record.name === 'Maintenance cost' ||
          record.name === 'Total expenses' ||
          (type === 'farm' && record.budget_id !== -1)
        ) {
          return value;
        }
        return (
          <BudgetTooltip
            type='budgeted'
            className='budget-popover'
            value={value}
            data={record}
          >
            {value}
          </BudgetTooltip>
        );
      },
    },
    {
      title: 'Actual',
      dataIndex: 'actual',
      key: 'actual',
      render: (value: string, record: any) => {
        if (
          record.name === 'Profit' ||
          record.name === 'Seeding cost' ||
          record.name === 'Maintenance cost' ||
          record.name === 'Total expenses' ||
          (type === 'farm' && record.budget_id !== -1)
        ) {
          return value;
        }
        return (
          <BudgetTooltip
            type='actual'
            className='budget-popover'
            value={value}
            data={record}
          >
            {value}
          </BudgetTooltip>
        );
      },
    },
    {
      title: 'Var, %',
      dataIndex: 'var',
      key: 'var',
      width: '11%',
      render: (data: any) => (
        <div className='d-flex align-items-center'>
          {data?.interest !== undefined && (
            <InterestGrowth
              isReverse={data?.isReverse}
              isGrow={data?.isGrow}
              interest={data?.interest}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      className='mr-table mr-table-budget mt-12'
      pagination={false}
      bordered
      columns={columns}
      dataSource={dataLine}
      rowClassName={(d: any) => {
        if (d?.name === 'Profit' || d?.name === 'Total expenses') {
          return 'mr-table__row-footer';
        }
        if (
          d?.name === 'Harvest' ||
          d?.name === 'Income' ||
          d?.name === 'Expenses'
        ) {
          return 'mr-table__row-title';
        }
        if (d?.name === 'Seeding cost' || d?.name === 'Maintenance cost') {
          return 'mr-table__row-sub-title';
        }
        if (d?.isBg) {
          return 'mr-table__row-bg';
        }

        return '';
      }}
    />
  );
};

export default OverallTable;
