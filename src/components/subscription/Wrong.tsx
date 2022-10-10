import React, { FC } from 'react';

import { Paragrapgh, Title } from '../shared';

import './styles.scss';

const Wrong = () => {
  return (
    <div className='wrong'>
      <Title
        className='mb-8'
        size={6}
        color='black-3'
        align='default'
        fontWeight={600}
      >
        Something went wrong
      </Title>
      <Paragrapgh size={1} color='black' align='left' fontWeight={400}>
        Contact your administrator{' '}
        <a href='mailto:admin@gmail.com'>
          <span className='tx-color-2'>admin@gmail.com</span>
        </a>{' '}
        to identify and resolve issues
      </Paragrapgh>
    </div>
  );
};

export default Wrong;
