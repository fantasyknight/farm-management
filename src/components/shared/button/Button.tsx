import React, { FC, ReactNode, MouseEvent } from 'react';
import classNames from 'classnames';

import './styles.scss';

interface IOwnProps {
  disabled?: boolean;
  width: string;
  size: number;
  type: string;
  iconRight?: boolean;
  iconLeft?: boolean;
  iconOnly?: boolean;
  isNoneBorder?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  color?: string;
  className?: string;
  children?: ReactNode;
  name?: string;
  onlyIconDisabled?: boolean | undefined;
}

const Button: FC<IOwnProps> = ({
  disabled,
  size,
  width,
  type,
  color,
  className,
  isNoneBorder,
  onClick,
  iconOnly,
  iconLeft,
  iconRight,
  name,
  children,
  onlyIconDisabled,
}) => {
  const buttonClasses = classNames(
    className,
    'button',
    `button--${size}`,
    `button--${color}`,
    `button--${width}`,
    `button--${type}`,
    {
      'button--disabled': disabled,
      'button--rightIcon': iconRight,
      'button--leftIcon': iconLeft,
      'button--onlyIcon': iconOnly,
      'button--border-none': isNoneBorder,
      'button--disabled-icon': onlyIconDisabled,
    },
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      name={name}
    >
      {children}
    </button>
  );
};

export default Button;
