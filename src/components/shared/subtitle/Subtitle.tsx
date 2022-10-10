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
  disabled?: boolean | undefined;
}

const Subtitle: FC<IOwnProps> = ({
  children,
  size,
  align,
  fontWeight,
  color,
  className,
  disabled,
}) => {
  const subtitleClasses = classNames(
    className,
    'subtitle',
    `subtitle--${size}`,
    `subtitle--${fontWeight}`,
    `subtitle--${color}`,
    `subtitle--${align}`,
    {
      'subtitle--disabled': disabled,
    },
  );
  return <div className={subtitleClasses}>{children}</div>;
};

export default Subtitle;
