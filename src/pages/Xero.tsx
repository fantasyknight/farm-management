import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Title, Feedback, Input, Button } from '../components/shared';
import { useWidth } from '../util/useWidth';

import { composeApi } from '../apis/compose';
import { IRootState } from '../store/rootReducer';
import { AuthState } from '../store/auth/auth.type';
import { ProfileState } from '../store/profile/profile.type';

const Xero = () => {
  const width = useWidth();
  const history = useHistory();
  const dispatch = useDispatch();

  const [clientId, setClientId] = useState('');
  const [redirectUri, setRedirectURI] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);

  const authStore = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );
  const profile = useSelector<IRootState, ProfileState['user']>(
    state => state.profile.user,
  );

  const onConnect = () => {
    let url = `${process.env.REACT_APP_API_URL}xero/connect?`;
    url += `user_id=${authStore.id}&`;
    url += `client_id=${clientId}&`;
    url += `client_secret=${clientSecret}&`;
    url += `redirect_url=${redirectUri}`;
    window.location.replace(url);
  };

  useEffect(() => {
    setRedirectURI(`${process.env.REACT_APP_API_URL}xero/callback/${btoa(
      profile.user_id!.toString(),
    )}
    `);
  }, []);

  return (
    <>
      <div className='content pb-32'>
        {width > 768 && (
          <Title
            className='mb-24'
            size={5}
            color='black-3'
            align='default'
            fontWeight={600}
          >
            Xero
          </Title>
        )}
        {showMsg && (
          <Feedback
            className='mb-32'
            isWithoutClosable
            theme='light'
            message={responseMsg}
            type='error'
          />
        )}
        {!authStore.xero && (
          <Feedback
            className='mb-32'
            isWithoutClosable
            theme='light'
            message='Not connected yet. You should set OAuth 2.0 redirect URI as below on your xero project.'
            type='warning'
          />
        )}
        {authStore.xero && (
          <Feedback
            className='mb-32'
            isWithoutClosable
            theme='light'
            message='Connected'
            type='info'
          />
        )}
        {!authStore.xero && (
          <>
            <Input
              type='text'
              className='mb-16'
              onChange={e => setClientId(e.target.value)}
              value={clientId}
              label='Client ID'
              placeholder='client id'
              max={255}
              required
            />
            <Input
              type='text'
              className='mb-16'
              onChange={e => setClientSecret(e.target.value)}
              value={clientSecret}
              label='Client Secret'
              placeholder='client secret'
              max={255}
              required
            />
            <Input
              type='text'
              className='mb-16'
              value={redirectUri}
              label='OAuth 2.0 redirect URI'
              placeholder='OAuth 2.0 redirect URI'
              max={255}
              required
              disabled
            />
            <Button
              className='mt-16'
              color='blue'
              size={1}
              width={width < 769 ? 'wide' : 'small'}
              onClick={onConnect}
              type='fill'
              disabled={clientId === '' || clientSecret === ''}
            >
              <span>Connect</span>
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default Xero;
