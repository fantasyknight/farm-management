import React, { FC } from 'react';
import moment from 'moment';

import randomKey from '../../../util/randomKey';
import Paragrapgh from '../paragrapgh/Paragrapgh';
import InterestGrowth from './InterestGrowth';
import { IFarmCard } from '../../../types/apiDataTypes';

import './styles.scss';

interface IOwnProps {
  data: IFarmCard[];
  type?: string;
}

const TablesCard: FC<IOwnProps> = ({ type, data }) => {
  return (
    <div className='tables-card'>
      {(type === 'next-seed' || type === 'next-harvest') && (
        <Paragrapgh
          className='pb-4'
          size={3}
          color='black-2'
          align='default'
          fontWeight={400}
        >
          {type === 'next-seed' ? 'Next seeds' : 'Next Harvests'}
        </Paragrapgh>
      )}
      {(type === 'next-seed' || type === 'next-harvest') && !data.length && (
        <Paragrapgh
          className='pb-4'
          size={1}
          color='default'
          align='default'
          fontWeight={500}
        >
          {type === 'next-seed'
            ? 'No planned seedings yet'
            : 'No planned harvests yet'}
        </Paragrapgh>
      )}
      <div className='d-flex justify-content-between'>
        <div>
          {data.map((info: IFarmCard) => (
            <div className='tables-card__item' key={randomKey()}>
              {info.name && (
                <Paragrapgh
                  className='pt-16'
                  size={3}
                  color='black-2'
                  align='default'
                  fontWeight={400}
                >
                  {info.name}
                </Paragrapgh>
              )}
              <Paragrapgh
                className='pb-4'
                size={1}
                color='default'
                align='default'
                fontWeight={500}
              >
                {info?.date
                  ? moment(Number(info?.date) * 1000).format('DD.MM.YYYY')
                  : info.value}
                {info?.unit}
              </Paragrapgh>
            </div>
          ))}
        </div>
        {data.length > 0 && data[0].interest && (
          <div className='pt-4'>
            <InterestGrowth
              interest={data[0].interest.interest}
              isGrow={data[0].interest.isGrow}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TablesCard;
