import React, { useMemo, FC } from 'react';
import { Collapse } from 'antd';

import randomKey from '../../util/randomKey';
import { Caret, Paragrapgh } from '../shared';
import MobileBudgetFarm from './MobileBudgetFarm';
import MobileBudgetLine from './MobileBudgetLine';

interface ITableMobile {
  data: Array<any>;
}

const MobileBudgetTable: FC<ITableMobile> = ({ data }) => {
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
            {data?.map(farm => {
              return (
                <Panel
                  header={<MobileBudgetFarm data={farm} />}
                  key={randomKey()}
                >
                  {farm?.lines?.length ? (
                    <>
                      {farm?.lines?.map((line: any) => (
                        <MobileBudgetLine data={line} key={randomKey()} />
                      ))}
                    </>
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
                </Panel>
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

export default MobileBudgetTable;
