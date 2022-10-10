import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

import { SignUpMain, RegistrationMessage } from '../components/sign-up';
import { IRootState } from '../store/rootReducer';
import { AuthState } from '../store/auth/auth.type';
import { Feedback } from '../components/shared';
import { nextView } from '../store/auth/auth.actions';

const SignUp = () => {
  const nextViewStore = useSelector<IRootState, AuthState['nextView']>(
    state => state.auth.nextView,
  );
  const query = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const history = useHistory();
  const [isNextVeiw, setIsNextVeiw] = useState(false);

  const handleOnClose = () => {
    dispatch(
      nextView({
        isSuccess: nextViewStore.isSuccess,
        email: nextViewStore?.email,
        message: '',
      }),
    );
  };

  useEffect(() => {
    if (nextViewStore.message) {
      setTimeout(() => {
        handleOnClose();
      }, 3000);
    }
    if (
      nextViewStore.message === 'Success' &&
      query.get('email') &&
      query.get('token')
    ) {
      setTimeout(() => {
        history.push('/sign-in');
      }, 3000);
    }
  }, [nextViewStore.message]);

  useEffect(() => {
    setIsNextVeiw(nextViewStore.isSuccess as boolean);
  }, [nextViewStore.isSuccess]);

  return (
    <>
      {!isNextVeiw && <SignUpMain />}
      {isNextVeiw && <RegistrationMessage />}
      {nextViewStore.message && (
        <Feedback
          message={nextViewStore.message}
          type={nextViewStore.message === 'Success' ? 'success' : 'error'}
          theme='light'
          isGlobal
          onClose={() => handleOnClose()}
        />
      )}
    </>
  );
};

export default SignUp;
