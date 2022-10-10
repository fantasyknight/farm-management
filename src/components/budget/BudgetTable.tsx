import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Table } from 'antd';
import classNames from 'classnames';

import useColumns from '../shared/tables/useColumns';
import { CaretDownIcon } from '../shared';
import MobileBudgetTable from './MobileBudgetTable';
import { useWidth } from '../../util/useWidth';

interface ITables {
  data: any[];
  column: string;
  isTableChild?: boolean;
}

const BudgetTable: FC<ITables> = ({ data, column, isTableChild }) => {
  const columns = useColumns(column);
  const width = useWidth();
  const history = useHistory();

  const redirectTo = (dataRow: any): void => {
    if (dataRow?.name) {
      history.push(`/budget/info?farm=${dataRow.id}`);
    } else {
      history.push(`/budget/info?line=${dataRow.id}`);
    }
  };

  return (
    <>
      {width > 820 ? (
        <Table
          className={classNames(`budget table table--${column}`, {
            'table--is__shild': isTableChild,
          })}
          pagination={false}
          columns={columns}
          dataSource={data}
          onRow={(dataRow: any) => ({
            onClick: () => redirectTo(dataRow),
          })}
          expandable={
            isTableChild
              ? undefined
              : {
                  expandedRowRender: (d: any) => {
                    if (d.lines.length) {
                      return (
                        <BudgetTable
                          column='isBudgetLine'
                          data={d.lines}
                          isTableChild
                        />
                      );
                    }

                    return [];
                  },
                  expandIcon: ({ expanded, onExpand, record }) => {
                    return (
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                      <div
                        onClick={event => {
                          event.stopPropagation();
                          onExpand(record, event);
                        }}
                      >
                        <CaretDownIcon />
                      </div>
                    );
                  },
                }
          }
        />
      ) : (
        <MobileBudgetTable data={data} />
      )}
    </>
  );
};

export default BudgetTable;
