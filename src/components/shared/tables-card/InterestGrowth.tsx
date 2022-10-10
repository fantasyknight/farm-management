import React, { FC } from 'react';
import classNames from 'classnames';

import { useWidth } from '../../../util/useWidth';
import CaretMainIcon from '../CaretMainIcon';
import ShortArrow from '../ShortArrow';

import './styles.scss';

interface IOwnProps {
  isGrow: boolean;
  interest: number;
  isReverse?: boolean;
}

const InterestGrowth: FC<IOwnProps> = ({ isReverse, isGrow, interest }) => {
  const width = useWidth();
  return (
    <div
      className={classNames('tables-card__coefficient', {
        'tables-card__coefficient--negative': !isGrow,
        'tables-card__coefficient--reverse': isReverse,
        'tables-card__coefficient--null': interest === 0,
      })}
    >
      <div className='tables-card__icon'>
        {width > 768 ? <CaretMainIcon /> : <ShortArrow />}
      </div>
      <div>{interest}%</div>
    </div>
  );
};

export default InterestGrowth;
