import React from 'react';

export default ({ color = '#07689F' }) => (
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
);
