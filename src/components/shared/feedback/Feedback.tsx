import React, { FC, ReactNode } from 'react';
import { Alert } from 'antd';
import classNames from 'classnames';

import CloseIcon from '../CloseIcon';
import WarningIcon from '../WarningIcon';

import './styles.scss';

interface IOwnProps {
  message: ReactNode;
  type: string;
  isGlobal?: boolean;
  className?: string;
  theme: 'light' | 'dark';
  onClose?: () => void;
  position?: number | undefined;
  isWithoutClosable?: boolean;
  isIcon?: boolean;
}

const Feedback: FC<IOwnProps> = ({
  message,
  type,
  theme,
  className,
  isGlobal,
  onClose,
  position,
  isWithoutClosable,
  isIcon,
}) => {
  const feedbackClasses = classNames(
    className,
    'ant-alert',
    `ant-alert--${theme}`,
    `ant-alert--${type}`,
    { 'ant-alert--global': isGlobal },
    { 'ant-alert--withoutClose': isWithoutClosable },
    { 'ant-alert--icon': isIcon },
  );
  return (
    <Alert
      style={{
        top: position ? `${position}px` : `${isGlobal ? '16px' : '0px'}`,
      }}
      message={message}
      closeText={<CloseIcon />}
      closable
      className={feedbackClasses}
      onClose={onClose}
      icon={isIcon ? <WarningIcon /> : null}
      showIcon={isIcon}
    />
  );
};

export default Feedback;
