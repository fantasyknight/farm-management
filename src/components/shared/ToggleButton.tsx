import React, { FC } from 'react';
import { Switch } from 'antd';
import classNames from 'classnames';

import Paragrapgh from './paragrapgh/Paragrapgh';

interface IOwnProps {
  label: string;
  disabled?: boolean;
  defaultChecked?: boolean;
  checked?: boolean;
  className?: string;
  isLeftText?: boolean;
  isfullWidth?: boolean;
  onChange: (event: boolean) => void;
}

const ToggleButton: FC<IOwnProps> = ({
  label,
  disabled,
  defaultChecked,
  checked,
  onChange,
  className,
  isLeftText,
  isfullWidth,
}) => {
  const toggleClasses = classNames(className, 'd-flex align-items-center', {
    'ant-wrapper-fullWidth': isfullWidth,
    'ant-wrapper-leftText': isLeftText,
  });

  const labelClasses = classNames(`ant-switch-label`);

  return (
    <div className={toggleClasses}>
      <Switch checked={checked} disabled={disabled} onChange={onChange} />
      <Paragrapgh
        className={labelClasses}
        size={1}
        color='default'
        align='default'
        fontWeight={400}
      >
        {label}
      </Paragrapgh>
    </div>
  );
};

export default ToggleButton;
