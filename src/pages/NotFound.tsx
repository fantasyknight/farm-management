import React, { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  ErrorPageIcon,
  ErrorSmallIcon,
  Paragrapgh,
  Title,
} from '../components/shared';
import { useWidth } from '../util/useWidth';

const NotFound: FC = (): ReactElement => {
  const width = useWidth();

  return (
    <div className='d-flex justify-content-center align-items-center bg-second h-80-vh mr-12 ml-12'>
      <div className='error-wrapper tx-center'>
        {width > 660 ? <ErrorPageIcon /> : <ErrorSmallIcon />}
        <Title
          className={width > 660 ? 'pt-48' : 'pt-32'}
          size={5}
          fontWeight={500}
          align='default'
          color='black-3'
        >
          Page does not exist
        </Title>
        <Paragrapgh
          className='pt-12'
          size={1}
          color='default'
          align='default'
          fontWeight={400}
        >
          Maybe you got a broken link, or maybe you made a misprint in the
          address bar. Please check the entered data is correct and try again
        </Paragrapgh>
        <Link to='/' className={width > 660 ? 'mt-24' : 'mt-32'}>
          <Button
            className='bg-transparent'
            width='normal'
            size={1}
            type='bordered'
            color='blue'
            isNoneBorder
          >
            Take me to the home page
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
