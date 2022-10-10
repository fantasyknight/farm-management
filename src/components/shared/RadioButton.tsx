import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { Radio } from 'antd';

import Paragrapgh from './paragrapgh/Paragrapgh';

interface IOwnProps {
  label: string;
  disabled?: boolean;
  isError?: boolean;
  value?: string | number;
  className?: string;
  isLeftText?: boolean;
  isfullWidth?: boolean;
  icon?: ReactNode;
  date?: string;
}

const RadioButton: FC<IOwnProps> = ({
  label,
  disabled,
  isError,
  value,
  className,
  isLeftText,
  isfullWidth,
  icon,
  date,
}) => {
  const radioClasses = classNames(className, {
    'ant-radio-wrapper-error': isError,
    'ant-wrapper-fullWidth': isfullWidth,
    'ant-wrapper-leftText': isLeftText,
  });

  return (
    <Radio className={radioClasses} disabled={disabled} value={value}>
      {icon && <span className='radio-icon'>{icon}</span>}
      <Paragrapgh size={1} color='default' align='default' fontWeight={400}>
        {label}
      </Paragrapgh>
      {date && (
        <Paragrapgh
          className='d-block mt-4'
          size={2}
          color='black-2'
          align='default'
          fontWeight={400}
        >
          {date}
        </Paragrapgh>
      )}
    </Radio>
  );
};

export default RadioButton;
