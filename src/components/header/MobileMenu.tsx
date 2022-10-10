import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { ILink } from '../../types/basicComponentsTypes';

import './styles.scss';

interface IOwnProps {
  menuItems: ILink[];
  onClick: () => void;
}

const MobileMenu: FC<IOwnProps> = ({ menuItems, onClick }) => {
  return (
    <nav className='header__mobile-menu'>
      <ul className='list-reset header__mobile-nav'>
        {menuItems.map(item => (
          <li key={item.link} className='header__item'>
            <NavLink
              exact={item.isExact}
              className='header__link'
              activeClassName='header__link--active'
              onClick={onClick}
              to={item.link}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileMenu;
