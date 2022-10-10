import React, { FC, ReactNode, MouseEvent, useState } from 'react';

import Caret from '../caret/Caret';
import Subtitle from '../subtitle/Subtitle';
import Button from './Button';

import './styles.scss';

interface IOwnProps {
  year: number;
  onChange(e: number): void;
  disabledNext?: boolean;
  disabledPrev?: boolean;
}

const ButtonArrows: FC<IOwnProps> = ({
  year,
  onChange,
  disabledNext,
  disabledPrev,
}) => {
  const handleClickPrev = () => {
    onChange(year - 1);
  };

  const handleClickNext = () => {
    onChange(year + 1);
  };

  return (
    <div className='budget-year-button d-flex justify-content-between align-items-center white-card-small pt-3 pb-3'>
      <Button
        color='blue'
        size={3}
        width='default'
        type='transparent'
        className='mr-26'
        name='prev'
        onClick={handleClickPrev}
        disabled={disabledPrev}
        onlyIconDisabled
      >
        <Caret color='#5A607F' direction='left' />
      </Button>
      <Subtitle size={4} color='black' align='left' fontWeight={500}>
        {year}
      </Subtitle>
      <Button
        color='blue'
        size={3}
        width='default'
        type='transparent'
        className='ml-26'
        name='next'
        onClick={handleClickNext}
        disabled={disabledNext}
        onlyIconDisabled
      >
        <Caret color='#5A607F' direction='right' />
      </Button>
    </div>
  );
};

export default ButtonArrows;
