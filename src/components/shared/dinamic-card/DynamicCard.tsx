import React, { FC, ReactNode, useEffect } from 'react';

import Paragrapgh from '../paragrapgh/Paragrapgh';
import Title from '../title/Title';
import BgIcon from '../bg-icon/BgIcon';

import './styles.scss';
import { IOverviewCardValue } from '../../../types/apiDataTypes';

interface IOwnProps {
  idDynamic?: boolean;
  icon: ReactNode;
  color: string;
  text: string | null;
  value: number | IOverviewCardValue[];
  id: number;
  checked: boolean;
  onChange: (color: string, value: boolean) => void;
}

const DynamicCard: FC<IOwnProps> = ({
  idDynamic,
  icon,
  color,
  text,
  value,
  checked,
  id,
  onChange,
}) => {
  return (
    <div className=''>
      <div className='d-flex align-items-center justify-content-between'>
        <BgIcon color={color} icon={icon} />
        {idDynamic && (
          <div>
            <input
              id={id.toString()}
              type='checkbox'
              className='dynamic-button'
              checked={checked}
              onChange={e => onChange(color, e.target.checked)}
            />
            <label htmlFor={id.toString()} className='dynamic-label' />
          </div>
        )}
      </div>
      <Paragrapgh
        className='mt-24 mb-10'
        size={3}
        fontWeight={400}
        align='default'
        color='black-2'
      >
        {typeof text !== 'string' && typeof value !== 'number'
          ? `${checked ? value[0].label : value[1].label}`
          : text}
      </Paragrapgh>
      <Title size={4} fontWeight={600} align='default' color='black-3'>
        {typeof value === 'number'
          ? value
          : `${checked ? value[0].value : value[1].value}`}
      </Title>
    </div>
  );
};

export default DynamicCard;
