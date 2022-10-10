import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { Paragrapgh } from '../shared';
import InterestGrowth from '../shared/tables-card/InterestGrowth';

interface ITableMobileHeader {
  data: any;
}

const MobileBudgetFarm: FC<ITableMobileHeader> = ({ data }) => {
  const history = useHistory();

  const handleCLick = () => {
    history.push(`/budget/info?farm=${data.id}`);
  };

  return (
    <div
      className='table-mobile__header'
      onKeyDown={() => undefined}
      onClick={handleCLick}
    >
      <Paragrapgh
        className='pl-48 pt-6'
        size={2}
        color='black-3'
        align='left'
        fontWeight={600}
      >
        {data?.name}
      </Paragrapgh>

      <div className='d-flex pb-23 mt-24'>
        <div className='flex-basis-50'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Total length
          </Paragrapgh>
          <div className='d-flex align-items-center'>
            <div className='pr-6 tx-color-3'>{data?.totalLength?.value}</div>
            {data?.totalLength?.interest !== undefined && (
              <InterestGrowth
                isGrow={data?.totalLength?.isGrow}
                interest={data?.totalLength?.interest}
              />
            )}
          </div>
        </div>
        <div className='flex-basis-50'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Total seeding cost
          </Paragrapgh>
          <div className='d-flex align-items-center'>
            <div className='pr-6 tx-color-3'>
              ${data?.totalSeedingCost?.value}
            </div>
            {data?.totalSeedingCost?.interest !== undefined && (
              <InterestGrowth
                isGrow={data?.totalSeedingCost?.isGrow}
                interest={data?.totalSeedingCost?.interest}
              />
            )}
          </div>
        </div>
      </div>
      <div className='d-flex pb-23'>
        <div className='flex-basis-50'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Total maintenance cost
          </Paragrapgh>
          <div className='d-flex align-items-center'>
            <div className='pr-6 tx-color-3'>
              ${data?.totalMaintenanceCost?.value}
            </div>
            {data?.totalMaintenanceCost?.interest !== undefined && (
              <InterestGrowth
                isGrow={data?.totalMaintenanceCost?.isGrow}
                interest={data?.totalMaintenanceCost?.interest}
              />
            )}
          </div>
        </div>
        <div className='flex-basis-50'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Total harvest tonnes
          </Paragrapgh>
          <div className='d-flex align-items-center'>
            <div className='pr-6 tx-color-3'>
              {data?.totalHarvestTonnes?.value}
            </div>
            {data?.totalHarvestTonnes?.interest !== undefined && (
              <InterestGrowth
                isGrow={data?.totalHarvestTonnes?.isGrow}
                interest={data?.totalHarvestTonnes?.interest}
              />
            )}
          </div>
        </div>
      </div>
      <div className='d-flex'>
        <div className='flex-basis-50'>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Total harvest income
          </Paragrapgh>
          <div className='d-flex align-items-center'>
            <div className='pr-6 tx-color-3'>
              ${data?.totalHarvestIncome?.value}
            </div>
            {data?.totalHarvestIncome?.interest !== undefined && (
              <InterestGrowth
                isGrow={data?.totalHarvestIncome?.isGrow}
                interest={data?.totalHarvestIncome?.interest}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBudgetFarm;
