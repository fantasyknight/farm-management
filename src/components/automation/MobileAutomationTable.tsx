import React, { useMemo, FC } from 'react';
import { Collapse } from 'antd';

import randomKey from '../../util/randomKey';
import MobileAutomation from './MobileAutomation';
import { Caret, Paragrapgh } from '../shared';

interface ITableMobile {
  data: Array<any>;
  handleOnEdit: (data: any, col?: string | undefined) => void;
  onDeleteRow: (data: any) => void;
}

const MobileAutomationTable: FC<ITableMobile> = ({
  data,
  handleOnEdit,
  onDeleteRow,
}) => {
  const { Panel } = useMemo(() => Collapse, []);

  return (
    <div className='table-mobile'>
      {data?.length ? (
        <>
          <Collapse
            expandIcon={(props: any) => (
              <div>
                <Caret
                  color='#131523'
                  direction={props.isActive ? 'top' : 'bottom'}
                  fontWeight='big'
                />
              </div>
            )}
          >
            {data?.map(automation => {
              return (
                <div key={randomKey()}>
                  {automation ? (
                    <MobileAutomation
                      data={automation}
                      key={randomKey()}
                      handleOnEdit={handleOnEdit}
                      onDeleteRow={onDeleteRow}
                    />
                  ) : (
                    <div className='table-mobile__not-data'>
                      <Paragrapgh
                        size={1}
                        color='black-5'
                        align='left'
                        fontWeight={400}
                      >
                        No data available
                      </Paragrapgh>
                    </div>
                  )}
                </div>
              );
            })}
          </Collapse>
        </>
      ) : (
        <div className='table-mobile__not-data'>
          <Paragrapgh size={1} color='black-5' align='left' fontWeight={400}>
            No data available
          </Paragrapgh>
        </div>
      )}
    </div>
  );
};

export default MobileAutomationTable;
