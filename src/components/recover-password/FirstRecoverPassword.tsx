import React, { FC, FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Title } from '../shared';
import { logOut, signUp } from '../../store/auth/auth.actions';
import { IRootState } from '../../store/rootReducer';
import { AuthState } from '../../store/auth/auth.type';
import { useWidth } from '../../util/useWidth';

const FirstRecoverPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState<boolean>();
  const [disabled, setDisabled] = useState(false);
  const width = useWidth();
  const dispatch = useDispatch();
  const authStore = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );

  useEffect(() => {
    if (authStore.message) {
      dispatch(logOut());
    }
  }, []);

  const handleOnChangeEmail = (value: string) => {
    setEmail(value);
  };

  const handleOnRecover = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    if (isValid) {
      await dispatch(signUp({ email }, 'forgotPassword'));
      setDisabled(false);
    }
  };

  return (
    <div
      className={
        width > 768
          ? 'd-flex justify-content-center align-items-center h-80-vh'
          : 'd-block'
      }
    >
      <div className='card'>
        <div className='card-wrapper'>
          <Title
            className='mb-16'
            size={5}
            align='default'
            color='black-3'
            fontWeight={600}
          >
            Recover Password
          </Title>
          <form onSubmit={handleOnRecover}>
            <Input
              onChange={e => handleOnChangeEmail(e.target.value)}
              type='email'
              value={email}
              label='Email'
              className='mb-16'
              placeholder='email'
              onValidate={(e: boolean) => setIsValid(e)}
            />
            <div className='card-bottom mb-28'>
              <Button
                color='blue'
                size={1}
                width='wide'
                type='fill'
                disabled={!isValid || disabled}
              >
                Recover Password
              </Button>
              <Link to='/sign-in' className='mt-8 w-100'>
                <Button color='blue' size={1} width='wide' type='bordered'>
                  Back
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FirstRecoverPassword;
