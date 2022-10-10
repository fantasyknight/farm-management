import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logOut, nextView, signUp } from '../../store/auth/auth.actions';

import { Button, Title, Paragrapgh, Feedback } from '../shared';
import { sendRequest } from '../../apis';
import { IRootState } from '../../store/rootReducer';
import { AuthState } from '../../store/auth/auth.type';
import { useWidth } from '../../util/useWidth';

const RegistrationMessage = () => {
  const [message, setMessage] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [disabled, setDisabled] = useState(false);
  const width = useWidth();
  const nextViewStore = useSelector<IRootState, AuthState['nextView']>(
    state => state.auth.nextView,
  );
  const authStore = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );
  const dispatch = useDispatch();

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
    const res = await sendRequest(
      { email },
      'POST',
      'api/auth/resend-activation-email',
    );
    if (res.status === 'Success') {
      setMessage('Success');
    } else {
      setMessage(res?.message);
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
              Thank you for registering
            </Title>
            <Paragrapgh
              className='mb-24 mt-12'
              size={1}
              fontWeight={400}
              color='default'
              align='default'
            >
              We have sent a confirmation email to your mail. Confirm your mail
              to start using the resource. If you have not received your
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

export default RegistrationMessage;
