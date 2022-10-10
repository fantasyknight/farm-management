import React, { ChangeEvent, FC, MouseEvent, ReactNode } from 'react';
import { Checkbox } from 'antd';
import classNames from 'classnames';
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';

import Paragrapgh from './paragrapgh/Paragrapgh';

interface IOwnProps {
  label: string;
  disabled?: boolean;
  isError?: boolean;
  isNegative?: boolean;
  checked?: boolean;
  className?: string;
  date?: string;
  isLeftText?: boolean;
  isfullWidth?: boolean;
  onChange: (event: CheckboxChangeEvent) => void;
}

const CheckboxButton: FC<IOwnProps> = ({
  label,
  disabled,
  isError,
  isNegative,
  checked,
  className,
  isLeftText,
  isfullWidth,
  date,
  onChange,
}) => {
  const checkboxClasses = classNames(className, {
    'ant-checkbox-wrapper-error': isError,
    'ant-checkbox-wrapper-negative': isNegative,
    'ant-wrapper-fullWidth': isfullWidth,
    'ant-wrapper-leftText': isLeftText,
  });

  return (
    <Checkbox
      onChange={onChange}
      className={checkboxClasses}
      disabled={disabled}
      checked={checked}
    >
      <Paragrapgh
        className='d-inline-block'
        size={1}
        color='default'
        align='default'
        fontWeight={400}
      >
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
    </Checkbox>
  );
};

export default CheckboxButton;
