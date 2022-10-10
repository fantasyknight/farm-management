import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  CreditCardIcon,
  Dropdown,
  Feedback,
  KeyIcon,
  Navbar,
  UserIcon,
  SettingIcon,
} from '../components/shared';
import Profile from './Profile';
import Security from './Security';
import Setting from './Setting';
import Xero from './Xero';
import { IMainList, INavbar } from '../types/basicComponentsTypes';
import Subscription from './Subscription';
import { IRootState } from '../store/rootReducer';
import { ProfileState } from '../store/profile/profile.type';
import { deleteMessage } from '../store/profile/profile.actions';
import { useWidth } from '../util/useWidth';

const ProfileRouter = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const width = useWidth();
  const [current, setCurrent] = useState(history.location.pathname);
  const messageStore = useSelector<IRootState, ProfileState['message']>(
    state => state.profile.message,
  );
  const [isMassage, setIsMessage] = useState<boolean>();

  useEffect(() => {
    return history.listen(location => {
      setCurrent(location.pathname);
    });
  }, [history]);

  useEffect(() => {
    setIsMessage(true);
  }, [messageStore.message]);

  useEffect(() => {
    if (isMassage) {
      setTimeout(() => {
        setIsMessage(false);
        dispatch(deleteMessage());
      }, 3000);
    }
  }, [isMassage]);

  const items: IMainList[] = [
    {
      value: '/profile',
      label: (
        <p className='d-flex align-items-center mb-0'>
          <UserIcon /> <span className='ml-16'>Profile</span>
        </p>
      ),
      id: '/profile',
    },
    {
      value: '/profile/security',
      label: (
        <p className='d-flex align-items-center mb-0'>
          <KeyIcon /> <span className='ml-16'>Security</span>
        </p>
      ),
      id: '/profile/security',
    },
    {
      value: '/profile/subscription',
      label: (
        <p className='d-flex align-items-center mb-0'>
          <CreditCardIcon /> <span className='ml-16'>Plan & billing</span>
        </p>
      ),
      id: '/profile/subscription',
    },
    {
      value: '/profile/setting',
      label: (
        <p className='d-flex align-items-center mb-0'>
          <SettingIcon /> <span className='ml-16'> User Setting </span>
        </p>
      ),
      id: '/profile/subscription',
    },
    {
      value: '/profile/xero',
      label: (
        <p className='d-flex align-items-center mb-0'>
          <SettingIcon /> <span className='ml-16'> Xero Integration </span>
        </p>
      ),
      id: '/profile/xero',
    },
  ];

  const navbarItems: INavbar[] = [
    {
      title: 'Profile',
      icon: <UserIcon />,
      link: '/profile',
      id: '/profile',
    },
    {
      title: 'Security',
      icon: <KeyIcon />,
      link: '/profile/security',
      id: '/profile/security',
    },
    {
      title: 'Plan & billing',
      icon: <CreditCardIcon />,
      link: '/profile/subscription',
      id: '/profile/subscription',
    },
    {
      title: 'Setting',
      icon: <SettingIcon />,
      link: '/profile/setting',
      id: '/profile/setting',
    },
    {
      title: 'Xero',
      icon: <SettingIcon />,
      link: '/profile/xero',
      id: '/profile/xero',
    },
  ];

  const handleOnSelectPage = (value: string) => {
    history.push(value);
  };

  return (
    <>
      <div className='container w-100'>
        {width < 769 && (
          <Dropdown
            className='mt-16 dropdown-profile'
            placeholder='placeholder'
            defaultValue={current}
            label=''
            onChange={value => handleOnSelectPage(value)}
            options={items}
          />
        )}
        <div className='user-layout'>
          <div className='navbar'>
            {width > 768 && (
              <Navbar
                current={current}
                direction='vertical'
                items={navbarItems}
              />
            )}
          </div>
          <Switch>
            <Route exact path='/profile'>
              <Profile />
            </Route>
            <Route path='/profile/security'>
              <Security />
            </Route>
            <Route path='/profile/subscription'>
              <Subscription />
            </Route>
            <Route path='/profile/setting'>
              <Setting />
            </Route>
            <Route path='/profile/xero'>
              <Xero />
            </Route>
          </Switch>
        </div>
      </div>
      {messageStore.message && (
        <Feedback
          isGlobal
          message={messageStore.message}
          type={messageStore.isError ? 'error' : 'success'}
          theme='light'
        />
      )}
    </>
  );
};

export default ProfileRouter;
