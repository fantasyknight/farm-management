import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Spinner } from '../components/shared';
import { IRootState } from '../store/rootReducer';
import { AuthState } from '../store/auth/auth.type';
import { xeroActive } from '../store/auth/auth.actions';

const Loading = () => {
  const params = useParams<{ type: string }>();

  const history = useHistory();
  const dispatch = useDispatch();

  const auth = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );

  useEffect(() => {
    if (params.type === 'xero') {
      dispatch(xeroActive(true));
    } else {
      history.push('/');
    }
  }, []);

  useEffect(() => {
    if (auth.xero) history.push('/profile/xero');
  }, [auth]);

  return (
    <div className='d-flex h-80-vh align-items-center justify-content-center'>
      <Spinner />
    </div>
  );
};

export default Loading;
