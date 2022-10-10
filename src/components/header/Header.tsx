import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { ILink } from '../../types/basicComponentsTypes';
import { BellIcon, Paragrapgh } from '../shared';
import NotificationsDropdown from './NotifcationsDropdown';
import { logOut } from '../../store/auth/auth.actions';
import { useWidth } from '../../util/useWidth';
import MobileMenu from './MobileMenu';
import { IRootState } from '../../store/rootReducer';
import { ProfileState } from '../../store/profile/profile.type';
import { getInitialProfile } from '../../store/profile/profile.actions';
import { getInitialUser } from '../../store/users/users.actions';
import { getInitialBudget } from '../../store/budget/budget.action';

import './styles.scss';

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const width = useWidth();
  const [menuItems, setMenuItems] = useState<ILink[]>([
    { link: '/', name: 'Overview', isExact: true },
    { link: '/farms', name: 'Farms', isExact: false },
    { link: '/budget', name: 'Budget', isExact: false },
    { link: '/budget-log', name: 'Budget log', isExact: false },
    { link: '/to-do', name: 'Tasks', isExact: false },
    { link: '/automation', name: 'Automations', isExact: false },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const profile = useSelector<IRootState, ProfileState['user']>(
    state => state.profile.user,
  );
  const [avatar, setAvatar] = useState<string>();

  useEffect(() => {
    setAvatar(profile.avatar as string);
  }, [profile.avatar]);

  useEffect(() => {
    if (profile?.permissions) {
      const isFinance = profile?.permissions?.find(
        permission => permission?.name === 'finance',
      );
      if (!isFinance) {
        setMenuItems(
          menuItems.filter(
            item => item.link !== '/budget' && item.link !== '/budget-log',
          ),
        );
      }
    }
  }, [profile.permissions]);

  const onDropdownClick = () => {
    history.push(`/sign-in`);
    dispatch(logOut());
    dispatch(getInitialProfile());
    dispatch(getInitialUser());
    dispatch(getInitialBudget());
  };

  useEffect(() => {
    if (isOpen) {
      const bodyElement = document.getElementsByTagName('body');
      bodyElement[0].style.overflow = 'hidden';
    } else {
      const bodyElement = document.getElementsByTagName('body');
      bodyElement[0].style.overflow = 'visible';
    }
  }, [isOpen]);

  const menu = (
    <Menu className='header'>
      <Menu.Item>
        <Link to='/profile'>
          <Paragrapgh size={2} color='default' align='left' fontWeight={400}>
            {profile.name}
          </Paragrapgh>
          <Paragrapgh size={3} color='black-4' align='left' fontWeight={400}>
            View profile
          </Paragrapgh>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/users'>
          <Paragrapgh size={2} color='default' align='left' fontWeight={400}>
            Users
          </Paragrapgh>
        </Link>
      </Menu.Item>
      <Menu.Item onClick={onDropdownClick}>Log out</Menu.Item>
    </Menu>
  );

  return (
    <header className='header'>
      <div className='container h-100'>
        <div className='header__wrapper d-flex h-100 align-items-center justify-content-between'>
          {width < 769 ? (
            <>
              <div
                className={`header__burger ${
                  isOpen && `header__burger--active`
                }`}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={() => setIsOpen(!isOpen)}
                role='button'
                tabIndex={0}
              >
                <span />
                <span />
                <span />
                <span />
              </div>
              {isOpen && (
                <MobileMenu
                  onClick={() => setIsOpen(!isOpen)}
                  menuItems={menuItems}
                />
              )}
            </>
          ) : (
            <nav className='w-100 align-items-center'>
              <ul
                className={`header__nav-list d-flex list-reset align-items-center justify-content-between ${
                  menuItems.length === 2 && 'header__nav-list--small'
                }`}
              >
                {menuItems.map(item => (
                  <li key={item.link} className='header__link-item'>
                    <NavLink
                      exact={item.isExact}
                      className='header__link'
                      activeClassName='header__link--active'
                      to={item.link}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className='d-flex align-items-center ml-10 z-10'>
            <Dropdown
              overlay={menu}
              placement='bottomRight'
              trigger={['click']}
            >
              <Avatar
                shape='circle'
                className='ml-24'
                size={width < 769 ? 32 : 48}
                src={avatar}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
