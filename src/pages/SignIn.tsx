import React, { FormEvent, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  CheckboxButton,
  Input,
  Title,
  Paragrapgh,
  Feedback,
} from '../components/shared';
import { authLogin, logOut } from '../store/auth/auth.actions';
import { IRootState } from '../store/rootReducer';
import { AuthState, ILoginData } from '../store/auth/auth.type';
import {
  getInitialProfile,
  getUserEmail,
  getUserProfile,
  getInviters,
} from '../store/profile/profile.actions';
import { useWidth } from '../util/useWidth';
import { getFarmsData } from '../store/farms/farms.actions';
import { getInitialUser } from '../store/users/users.actions';
import { getInitialBudget } from '../store/budget/budget.action';

const SignIn = () => {
  const dispatch = useDispatch();
  const params = useParams<{ checked: string }>();
  const history = useHistory();
  const width = useWidth();
  const [disabled, setDisabled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isInviteAccpet, setIsInviteAccept] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidFields, setIsValidFields] = useState<boolean>(false);
  const [fieldsValid, setFieldsValid] = useState([
    {
      name: 'password',
      isValidate: false,
    },
    {
      name: 'email',
      isValidate: false,
    },
  ]);
  const [remember, setRemember] = useState<boolean>(false);
  const auth = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );

  useEffect(() => {
    if (auth.message) {
      setTimeout(() => {
        dispatch(logOut());
      }, 3000);
    }
  }, [auth.message]);

  useEffect(() => {
    if (auth.isAuth) {
      history.push(`/`);
      dispatch(getInitialProfile());
      dispatch(getInitialUser());
      dispatch(getInitialBudget());
      dispatch(getUserProfile(auth.id as string, history));
      dispatch(getUserEmail(history));
      dispatch(getFarmsData(history));
      // dispatch(getInviters(history));
    }
  }, [auth]);

  useEffect(() => {
    if (params.checked === 'checked') {
      setIsChecked(true);
    }

    if (params.checked === 'invite-accept') {
      setIsInviteAccept(true);
    }
    if (auth.message) {
      dispatch(logOut());
    }
  }, []);

  useEffect(() => {
    if (isChecked) {
      setTimeout(() => {
        setIsChecked(false);
      }, 3000);
    }
    if (isInviteAccpet) {
      setTimeout(() => {
        setIsInviteAccept(false);
      }, 3000);
    }
  }, [isChecked, isInviteAccpet]);

  const handleOnChangeEmail = (value: string) => {
    setEmail(value);
  };

  const handleOnChangePassword = (value: string) => {
    setPassword(value);
  };

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

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    const data: ILoginData = {
      email,
      password,
      remember,
    };
    if (isValidFields) {
      await dispatch(authLogin(data));
      // dispatch(changeEmail({ email }));
      setDisabled(false);
    }
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
              className={width < 769 ? 'mb-20' : 'mb-4'}
              size={5}
              align='default'
              color='black-3'
              fontWeight={600}
            >
              Sign In
            </Title>
            {width > 768 && (
              <div className='d-flex mb-16'>
                <Paragrapgh
                  size={2}
                  fontWeight={500}
                  color='default'
                  align='default'
                >
                  Don&#x27;t have an account?
                </Paragrapgh>
                <Link to='/sign-up' className='ml-4'>
                  <Paragrapgh
                    size={2}
                    fontWeight={500}
                    color='blue-1'
                    align='default'
                  >
                    Sign Up
                  </Paragrapgh>
                </Link>
              </div>
            )}
            <form onSubmit={onLogin}>
              <Input
                onChange={e => handleOnChangeEmail(e.target.value)}
                type='email'
                value={email}
                label='Email'
                className='mb-16'
                placeholder='email'
                dataType='email'
                onValidate={(e, data) => handleOnValidFields(e, data)}
              />
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
              <div className='w-100 mb-20 d-flex align-items-center justify-content-between'>
                <CheckboxButton
                  label='Remember me'
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
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
              <div className='card-bottom'>
                <Button
                  color='blue'
                  disabled={!isValidFields || disabled}
                  size={1}
                  width='wide'
                  type='fill'
                >
                  Sign In
                </Button>
                {width < 769 && (
                  <div className='d-flex mt-28 mb-36 justify-content-center'>
                    <Paragrapgh
                      size={2}
                      fontWeight={500}
                      color='default'
                      align='default'
                    >
                      Don&#x27;t have an account?
                    </Paragrapgh>
                    <Link to='/sign-up' className='ml-4'>
                      <Paragrapgh
                        size={2}
                        fontWeight={500}
                        color='blue-1'
                        align='default'
                      >
                        Sign Up
                      </Paragrapgh>
                    </Link>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      {!auth.isAuth && auth.message && (
        <Feedback message={auth.message} type='error' theme='light' isGlobal />
      )}
      {isChecked && (
        <Feedback
          className='mt-4'
          message='An email has been confirmed successfully'
          type='success'
          theme='light'
          isGlobal
        />
      )}
      {isInviteAccpet && (
        <Feedback
          className='mt-4'
          message='Invitation accepted successfully'
          type='success'
          theme='light'
          isGlobal
        />
      )}
    </>
  );
};

export default SignIn;
