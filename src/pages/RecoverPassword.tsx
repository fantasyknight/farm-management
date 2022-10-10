import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  FirstRecoverPassword,
  PasswordMessage,
} from '../components/recover-password';
import { IRootState } from '../store/rootReducer';
import { AuthState } from '../store/auth/auth.type';
import { Feedback } from '../components/shared';
import { nextView } from '../store/auth/auth.actions';

const RecoverPassword = () => {
  const nextViewStore = useSelector<IRootState, AuthState['nextView']>(
    state => state.auth.nextView,
  );
  const [isNextVeiw, setIsNextVeiw] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (nextViewStore.message) {
      setTimeout(() => {
        dispatch(
          nextView({
            isSuccess: nextViewStore.isSuccess,
            email: nextViewStore?.email,
            message: '',
          }),
        );
      }, 3000);
    }
  }, [nextViewStore.message]);

  useEffect(() => {
    setIsNextVeiw(nextViewStore.isSuccess as boolean);
  }, [nextViewStore.isSuccess]);

  return (
    <>
      {!isNextVeiw && <FirstRecoverPassword />}
      {isNextVeiw && <PasswordMessage />}
      {!nextViewStore.isSuccess && nextViewStore.message && (
        <Feedback
          className='mt-4'
          message={nextViewStore.message}
          type='error'
          theme='light'
          isGlobal
        />
      )}
    </>
  );
};

export default RecoverPassword;
