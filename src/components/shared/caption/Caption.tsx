import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';

import './styles.scss';

interface IOwnProps {
  children: ReactNode;
  size: number;
  align: string;
  fontWeight: number;
  color: string;
  className?: string;
}

const Caption: FC<IOwnProps> = ({
  children,
  size,
  align,
  fontWeight,
  color,
  className,
}) => {
  const captionClasses = classNames(
    className,
    'caption',
    `caption--${size}`,
    `caption--${fontWeight}`,
    `caption--${color}`,
    `caption--${align}`,
  );
  return <div className={captionClasses}>{children}</div>;
};

export default Caption;
