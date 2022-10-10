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

const Title: FC<IOwnProps> = ({
  children,
  size,
  align,
  fontWeight,
  color,
  className,
}) => {
  const titleClasses = classNames(
    className,
    'title',
    `title--${size}`,
    `title--${fontWeight}`,
    `title--${color}`,
    `title--${align}`,
  );
  return (
    <>
      {size === 1 && <h1 className={titleClasses}>{children}</h1>}
      {size === 2 && <h2 className={titleClasses}>{children}</h2>}
      {size === 3 && <h3 className={titleClasses}>{children}</h3>}
      {size === 4 && <h4 className={titleClasses}>{children}</h4>}
      {size === 5 && <h5 className={titleClasses}>{children}</h5>}
      {size === 6 && <h6 className={titleClasses}>{children}</h6>}
    </>
  );
};

export default Title;
