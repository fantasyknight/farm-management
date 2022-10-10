import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { Paragrapgh } from '../shared';
import InterestGrowth from '../shared/tables-card/InterestGrowth';

import './styles.scss';

interface IOwnProps {
  data?: any;
}

const MobileBudgetLine: FC<IOwnProps> = ({ data }) => {
  const history = useHistory();
  const handleCLick = () => {
    history.push(`/budget/info?line=${data.id}`);
  };

  return (
    <div
      className='table-mobile__card table-mobile__card--cursor'
      onKeyDown={() => undefined}
      onClick={handleCLick}
    >
      <div className='d-flex justify-content-between align-items-center'>
        <Paragrapgh size={2} color='black-3' align='left' fontWeight={600}>
          Line - {data?.line_name}
        </Paragrapgh>
      </div>
      <div className='mt-30'>
        <div className='d-flex pb-23'>
          <div className='flex-basis-50'>
            <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
              Length
            </Paragrapgh>
            <div className='d-flex align-items-center'>
              <div className='pr-6 tx-color-3'>{data?.length?.value} m</div>
              {data?.length?.interest !== undefined && (
                <InterestGrowth
                  isGrow={data?.length?.isGrow}
                  interest={data?.length?.interest}
                />
              )}
            </div>
          </div>
          <div className='flex-basis-50 ml-24'>
            <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
              Seeding cost
            </Paragrapgh>
            <div className='d-flex align-items-center'>
              <div className='pr-6 tx-color-3'>${data?.seedingCost?.value}</div>
              {data?.seedingCost?.interest !== undefined && (
                <InterestGrowth
                  isGrow={data?.seedingCost?.isGrow}
                  interest={data?.seedingCost?.interest}
                />
              )}
            </div>
          </div>
        </div>

        <div className='d-flex pb-23'>
          <div className='flex-basis-50'>
            <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
              Maintenance cost
            </Paragrapgh>
            <div className='d-flex align-items-center'>
              <div className='pr-6 tx-color-3'>
                ${data?.maintenanceCost?.value}
              </div>
              {data?.maintenanceCost?.interest !== undefined && (
                <InterestGrowth
                  isGrow={data?.maintenanceCost?.isGrow}
                  interest={data?.maintenanceCost?.interest}
                />
              )}
            </div>
          </div>
          <div className='flex-basis-50 ml-24'>
            <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
              Harvest tonnes
            </Paragrapgh>
            <div className='d-flex align-items-center'>
              <div className='pr-6 tx-color-3'>
                {data?.harvestTonnes?.value}
              </div>
              {data?.harvestTonnes?.interest !== undefined && (
                <InterestGrowth
                  isGrow={data?.harvestTonnes?.isGrow}
                  interest={data?.harvestTonnes?.interest}
                />
              )}
            </div>
          </div>
        </div>

        <div className='d-flex'>
          <div className='flex-basis-50 '>
            <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
              Harvest incomes
            </Paragrapgh>
            <div className='d-flex align-items-center'>
              <div className='pr-6 tx-color-3'>
                ${data?.harvestIncome?.value}
              </div>
              {data?.harvestIncome?.interest !== undefined && (
                <InterestGrowth
                  isGrow={data?.harvestIncome?.isGrow}
                  interest={data?.harvestIncome?.interest}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBudgetLine;
