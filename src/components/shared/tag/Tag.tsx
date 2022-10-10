import React, { FC, FormEvent, MouseEvent, ReactNode } from 'react';
import { Tag } from 'antd';
import classNames from 'classnames';

import './styles.scss';

interface IOwnProps {
  children: ReactNode;
  color: 'green' | 'red' | 'orange' | 'gray';
  className?: string;
  onChange?: (event: FormEvent<HTMLSpanElement>) => void;
}

const TagComponent: FC<IOwnProps> = ({ children, color, className }) => {
  const tagClasses = classNames(className, `ant-tag--${color}`);
  return <Tag className={tagClasses}>{children}</Tag>;
};

export default TagComponent;
