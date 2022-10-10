import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

import { INavbar } from '../../../types/basicComponentsTypes';
import Paragrapgh from '../paragrapgh/Paragrapgh';

import './styles.scss';

interface IOwnProps {
  current: string;
  direction: 'horizontal' | 'vertical' | undefined;
  items: INavbar[];
  className?: string;
  onClick?: () => void;
}

const Navbar: FC<IOwnProps> = ({
  current,
  direction,
  items,
  className,
  onClick,
}) => {
  return (
    <Menu
      onClick={onClick}
      className={className}
      selectedKeys={[current]}
      mode={direction}
    >
      {items.map(item => (
        <Menu.Item key={item.id} icon={item.icon}>
          <Link to={item.link}>
            <Paragrapgh
              size={1}
              className='ml-16'
              color='black-2'
              align='default'
              fontWeight={500}
            >
              {item.title}
            </Paragrapgh>
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default Navbar;
