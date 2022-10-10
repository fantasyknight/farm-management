import React, { FC, useState, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useHistory } from 'react-router-dom';

import { Button, Input, Title, Paragrapgh, CheckboxButton } from '../shared';

import { logOut, signUp } from '../../store/auth/auth.actions';
import { IRegistration } from '../../types/apiDataTypes';
import { IRootState } from '../../store/rootReducer';
import { AuthState } from '../../store/auth/auth.type';
import { useWidth } from '../../util/useWidth';

const SignUpMain: FC = () => {
  const dispatch = useDispatch();
  const width = useWidth();
  const [disabled, setDisabled] = useState(false);
  const [hasCoupon, setHasCoupon] = useState(false);
  const authStore = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );
  const nextViewStore = useSelector<IRootState, AuthState['nextView']>(
    state => state.auth.nextView,
  );
  const query = new URLSearchParams(useLocation().search);
  const [isValidFields, setIsValidFields] = useState<boolean>();
  const [coupon, setCoupon] = useState('');
  const [fields, setFields] = useState([
    {
      name: 'fullName',
      value: '',
    },
    {
      name: 'password',
      value: '',
    },
    {
      name: 'email',
      value: '',
    },
  ]);
  const [fieldsValid, setFieldsValid] = useState([
    {
      name: 'fullName',
      isValidate: false,
    },
    {
      name: 'password',
      isValidate: false,
    },
    {
      name: 'email',
      isValidate: false,
    },
  ]);

  useEffect(() => {
    if (authStore.message) {
      dispatch(logOut());
    }
    if (query.get('email')) {
      const email = query.get('email') as string;
      setFields(
        fields.map(field =>
          field.name === 'email'
            ? { ...field, value: email.replace(' ', '+') }
            : field,
        ),
      );
      setFieldsValid(
        fieldsValid.map(field =>
          field.name === 'email' ? { ...field, isValidate: true } : field,
        ),
      );
    }
  }, []);

  useEffect(() => {
    if (
      nextViewStore.message !== 'Success' &&
      query.get('email') &&
      query.get('token')
    ) {
      setDisabled(false);
    }
  }, [nextViewStore.message]);

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
    setIsValidFields(fields.length === counter || false);
  };

  const handleOnChangeFields = (value: string, data: string | undefined) => {
    setFields(
      fields.map(field => (field.name === data ? { ...field, value } : field)),
    );
  };

  const onRegistration = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    let data: IRegistration = {};
    if (query.get('email') && query.get('token')) {
      data = {
        email: fields[2].value,
        password: fields[1].value,
        name: fields[0].value,
        token: query.get('token') as string,
      };
      if (isValidFields) {
        await dispatch(signUp(data, 'invite'));
      }
    } else {
      data = {
        email: fields[2].value,
        password: fields[1].value,
        password_confirmation: fields[1].value,
        name: fields[0].value,
        remember: true,
        coupon: 'none',
      };

      if (hasCoupon) {
        data.coupon = coupon;
      }
      if (isValidFields) {
        await dispatch(signUp(data, 'signUp'));
      }
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
            className={width < 769 ? 'mb-20' : 'mb-4'}
            size={5}
            align='default'
            color='black-3'
            fontWeight={600}
          >
            Sign Up
          </Title>
          {width > 768 && (
            <div className='d-flex mb-16'>
              <Paragrapgh
                size={2}
                fontWeight={500}
                color='default'
                align='default'
              >
                Have an account?
              </Paragrapgh>
              <Link to='/sign-in' className='ml-4'>
                <Paragrapgh
                  size={2}
                  fontWeight={500}
                  color='blue-1'
                  align='default'
                >
                  Sign In
                </Paragrapgh>
              </Link>
            </div>
          )}
          <form onSubmit={onRegistration}>
            <Input
              onChange={(e, data) => handleOnChangeFields(e.target.value, data)}
              type='text'
              className='mb-16'
              value={fields[0].value}
              label='Full Name'
              dataType='fullName'
              placeholder='full name'
              onValidate={(e, data) => handleOnValidFields(e, data)}
              required
            />
            <Input
              onChange={(e, data) => handleOnChangeFields(e.target.value, data)}
              type='email'
              value={fields[2].value}
              label='Email'
              className='mb-16'
              dataType='email'
              placeholder='email'
              onValidate={(e, data) => handleOnValidFields(e, data)}
            />
            <Input
              onChange={(e, data) => handleOnChangeFields(e.target.value, data)}
              type='password'
              value={fields[1].value}
              label='Password'
              className='mb-24'
              dataType='password'
              onValidate={(e, data) => handleOnValidFields(e, data)}
              placeholder='password'
            />
            <div className='w-100 mb-20 d-flex align-items-center justify-content-between'>
              <CheckboxButton
                label='Have coupon?'
                checked={hasCoupon}
                onChange={e => setHasCoupon(e.target.checked)}
              />
              <Link to='/recover-password/email'>
                <Paragrapgh
                  size={2}
                  fontWeight={400}
                  color='blue-1'
                  align='default'
                >
                  Forgot Password?
                </Paragrapgh>
              </Link>
            </div>
            {hasCoupon && (
              <Input
                onChange={(e, data) => setCoupon(e.target.value)}
                type='text'
                value={coupon}
                label='Coupon Code'
                className='mb-16'
                placeholder='coupon code'
              />
            )}
            <div className='card-bottom'>
              <Button
                color='blue'
                disabled={!isValidFields || disabled}
                size={1}
                width='wide'
                type='fill'
              >
                {query.get('email') && query.get('token')
                  ? 'Sign up'
                  : 'Start my free trial'}
              </Button>
              {width < 769 && (
                <div className='d-flex mt-28 mb-36 justify-content-center'>
                  <Paragrapgh
                    size={2}
                    fontWeight={500}
                    color='default'
                    align='default'
                  >
                    Have an account?
                  </Paragrapgh>
                  <Link to='/sign-in' className='ml-4'>
                    <Paragrapgh
                      size={2}
                      fontWeight={500}
                      color='blue-1'
                      align='default'
                    >
                      Sign In
                    </Paragrapgh>
                  </Link>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpMain;
