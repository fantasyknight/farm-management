import React, { FC } from 'react';
import classNames from 'classnames';

import './styles.scss';

interface IPositiveNegativeTitle {
  isColor: string | undefined;
}

const PositiveNegativeTitle: FC<IPositiveNegativeTitle> = ({
  isColor,
  children,
}) => {
  return (
    <span
      className={classNames('positiv-negativ-title', {
        'positiv-negativ-title--fair': isColor === 'fair',
        'positiv-negativ-title--good': isColor === 'good',
      })}
    >
      {children}
    </span>
  );
};

export default PositiveNegativeTitle;
