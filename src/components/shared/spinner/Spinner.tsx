import React, { FC } from 'react';

import './styles.scss';

interface ISpiner {
  position?: 'local' | 'global';
}

const Spinner: FC<ISpiner> = ({ position = 'local' }) => (
  <div className={`spinner__wrapper spinner__wrapper--${position}`}>
    <div className='spinner' />
  </div>
);

export default Spinner;
