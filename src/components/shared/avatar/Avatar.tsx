import React, { FC, ReactNode } from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import './styles.scss';

interface IOwnProps {
  color?: string;
  image?: string;
  className?: string;
  children?: ReactNode;
  size?: number;
}

const AvatarComponent: FC<IOwnProps> = ({
  color,
  image,
  children,
  size,
  className,
}) => {
  const avatarClasses = classNames(className, `ant-avatar--${color}`);
  return (
    <Avatar
      shape='circle'
      size={size || 48}
      className={avatarClasses}
      src={image}
      icon={<UserOutlined />}
    >
      {children}
    </Avatar>
  );
};

export default AvatarComponent;
