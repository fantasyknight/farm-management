import React, { useState, FC } from 'react';
import classNames from 'classnames';

import './styles.scss';

interface INameWithPercent {
  title: string;
  percent: string;
  index: number;
}

const NameWithPercent: FC<INameWithPercent> = ({
  title = '',
  percent,
  index = 1,
}) => {
  const [isNextBg] = useState(index % 2 === 0);
  const [initials] = useState(() => {
    const initial = title.split(' ').reduce((acum: string, value: string) => {
      return acum + value.substring(0, 1);
    }, '');

    return initial;
  });

  return (
    <div
      className={classNames('name-percent', {
        'name-percent--next-color': isNextBg,
      })}
    >
      <div className='letter-upper'>{initials}</div>
      <span>-</span>
      <div>{percent}%</div>
    </div>
  );
};

export default NameWithPercent;
