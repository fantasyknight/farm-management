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

const Paragrapgh: FC<IOwnProps> = ({
  children,
  size,
  align,
  fontWeight,
  color,
  className,
}) => {
  const paragrapghClasses = classNames(
    className,
    'paragrapgh',
    `paragrapgh--${size}`,
    `paragrapgh--${fontWeight}`,
    `paragrapgh--${color}`,
    `paragrapgh--${align}`,
  );
  return <p className={paragrapghClasses}>{children}</p>;
};

export default Paragrapgh;
