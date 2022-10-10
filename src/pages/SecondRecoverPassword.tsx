import React, { FC, FormEvent, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { Button, Feedback, Input, Title } from '../components/shared';
import { sendRequest } from '../apis';
import { IChangePassword } from '../types/apiDataTypes';
import { deleteMessage } from '../store/profile/profile.actions';
import { nextView } from '../store/auth/auth.actions';
import { useWidth } from '../util/useWidth';

const SecondRecoverPassword: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const width = useWidth();
  const params = useParams<{ token: string; email: string }>();
  const [disabled, setDisabled] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string>();
  const [isValidFields, setIsValidFields] = useState<boolean>();
  const [fieldsValid, setFieldsValid] = useState([
    {
      name: 'password',
      isValidate: false,
    },
    {
      name: 'passwordConfirm',
      isValidate: false,
    },
  ]);

  const handleOnChangePassword = (value: string) => {
    setPassword(value);
  };
  const handleOnChangeConfirm = (value: string) => {
    setConfirmPassword(value);
  };

  const handleOnRecover = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    const data: IChangePassword = {
      email: params.email,
      password,
      password_confirmation: confirmPassword,
      token: params.token,
    };
    const res = await sendRequest(data, 'POST', 'api/password/reset');
    if (res.email) {
      setMessage('Success');
    } else {
      setMessage(res.message);
    }
    setDisabled(false);
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  }, [message]);

  useEffect(() => {
    if (message === 'Success') {
      setTimeout(() => {
        history.push(`/`);
      }, 3000);
    }
    dispatch(
      nextView({
        isSuccess: false,
        message: '',
      }),
    );
  }, [message]);

  const handleOnValidFields = (value: boolean, data: string | undefined) => {
    let counter = 0;
    const newArr = fieldsValid.map(field => {
      /* eslint-disable*/
      if (field.name == data) {
        if (value) counter++;
        return { ...field, isValidate: value };
      }
      if (field.name !== data && field.isValidate) counter++;
      return field;
    });

    setFieldsValid(newArr);
    setIsValidFields(2 === counter || false);
  };

  return (
    <>
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
                onChange={e => handleOnChangePassword(e.target.value)}
                type='password'
                value={password}
                label='Password'
                className='mb-16'
                dataType='password'
                onValidate={(e, data) => handleOnValidFields(e, data)}
                placeholder='password'
              />
              <Input
                onChange={e => handleOnChangeConfirm(e.target.value)}
                type='password'
                value={confirmPassword}
                label='Confirm password'
                className='mb-24'
                dataType='passwordConfirm'
                onValidate={(e, data) => handleOnValidFields(e, data)}
                placeholder='confirm password'
              />
              <div className='card-bottom mb-28'>
                <Button
                  disabled={!isValidFields || disabled}
                  color='blue'
                  size={1}
                  width='wide'
                  type='fill'
                >
                  Recover
                </Button>
                <Link to='/sign-in' className='mt-8 w-100'>
                  <Button color='blue' size={1} width='wide' type='bordered'>
                    Back to login
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      {message && (
        <Feedback
          className='mt-4'
          message={message === 'Success' ? 'You successfully changed your password' : message}
          type={message === 'Success' ? 'success' : 'error'}
          theme='light'
          isGlobal
        />
      )}
    </>
  );
};

export default SecondRecoverPassword;
