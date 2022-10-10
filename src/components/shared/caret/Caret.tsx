import React, { FC } from 'react';
import classNames from 'classnames';
import './styles.scss';

interface ICaret {
  color?: string;
  direction?: string;
  fontWeight?: string;
}

const Caret: FC<ICaret> = ({
  color = '#07689F',
  direction,
  fontWeight = 'small',
}) => (
  <div
    className={classNames('caret', {
      'caret--top': direction === 'top',
      'caret--left': direction === 'left',
      'caret--bottom': direction === 'bottom',
    })}
  >
    {fontWeight === 'small' && (
      <svg
        width='7'
        height='12'
        viewBox='0 0 7 12'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M1 1L6 6L1 11'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    )}

    {fontWeight === 'big' && (
      <div style={{ transform: 'rotate(90deg)' }}>
        <svg
          width='20'
          height='12'
          viewBox='0 0 20 12'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M0.920883 10.3039L1.74584 11.1288C1.94109 11.3241 2.25767 11.3241 2.45297 11.1288L10 3.59971L17.5471 11.1288C17.7423 11.324 18.0589 11.324 18.2542 11.1288L19.0792 10.3038C19.2744 10.1086 19.2744 9.792 19.0792 9.59671L10.3535 0.871169C10.1583 0.675919 9.84172 0.675919 9.64643 0.871169L0.920883 9.59675C0.725591 9.79204 0.725591 10.1086 0.920883 10.3039Z'
            fill={color}
          />
        </svg>
      </div>
    )}
  </div>
);

export default Caret;
