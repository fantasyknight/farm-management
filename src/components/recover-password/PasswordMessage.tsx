import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Title, Paragrapgh, Feedback } from '../shared';
import { logOut, nextView, signUp } from '../../store/auth/auth.actions';
import { IRootState } from '../../store/rootReducer';
import { AuthState } from '../../store/auth/auth.type';
import { sendRequest } from '../../apis';
import { useWidth } from '../../util/useWidth';

const PasswordMessage = () => {
  const dispatch = useDispatch();
  const width = useWidth();
  const [message, setMessage] = useState<string>();
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState<string>();
  const nextViewStore = useSelector<IRootState, AuthState['nextView']>(
    state => state.auth.nextView,
  );
  const authStore = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  }, [message]);

  useEffect(() => {
    setEmail(nextViewStore.email);
    return () => {
      dispatch(
        nextView({
          isSuccess: false,
          email: '',
        }),
      );
      if (authStore.message) {
        dispatch(logOut());
      }
    };
  }, []);

  const handlerOnReSend = async () => {
    setDisabled(true);
    const res = await sendRequest({ email }, 'POST', 'api/password/create');
    if (res.message) {
      setMessage('Success');
    } else {
      setMessage(res.message);
    }
    setDisabled(false);
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
            <Title size={5} align='default' color='black-3' fontWeight={600}>
              Recover password
            </Title>
            <Paragrapgh
              className='mb-24 mt-12'
              size={1}
              fontWeight={400}
              color='default'
              align='default'
            >
              We have sent email to your mail. If you have not received your
              message, check your spam folder or request a new message
            </Paragrapgh>
            <div className='card-bottom mb-28'>
              <Link to='/sign-in' className='mb-8 w-100'>
                <Button color='blue' size={1} width='wide' type='fill'>
                  Sign In
                </Button>
              </Link>
              <Button
                onClick={handlerOnReSend}
                color='blue'
                size={1}
                width='wide'
                type='bordered'
                disabled={disabled}
              >
                Resend message
              </Button>
            </div>
          </div>
        </div>
      </div>
      {message && (
        <Feedback
          className='mt-4'
          message={message}
          type={message === 'Success' ? 'success' : 'error'}
          theme='light'
          isGlobal
        />
      )}
    </>
  );
};

export default PasswordMessage;
