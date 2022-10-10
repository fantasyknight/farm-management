import React, { useState, FC } from 'react';
/* eslint-disable */
import { Select } from 'antd';
const { Option }: any = Select;

import { IMainList } from '../../../types/basicComponentsTypes';
import CaretUpIcon from '../CaretUpIcon';
import CaretDownIcon from '../CaretDownIcon';

interface IOwnProps {
  defaultValue?: string;
  onChange?: (value: string, event: any) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label: string;
  options: IMainList[];
}

const Dropdown: FC<IOwnProps> = ({
  defaultValue,
  onChange,
  placeholder,
  className,
  disabled,
  label,
  options,
}) => {
  const [open, setOpen] = useState(false);

  let suffixIcon;
  if (open) {
    suffixIcon = (
      <div className='dropdown__icon dropdown__icon--rotate-180'>
        <CaretDownIcon />
      </div>
    );
  } else {
    suffixIcon = (
      <div className='dropdown__icon dropdown__icon--rotate-0'>
        <CaretDownIcon />
      </div>
    );
  }

  return (
    <div className={className}>
      <label className='dropdown__label' htmlFor='dropdown'>
        {label}
      </label>
      <Select
        size='large'
        open={open}
        disabled={disabled}
        suffixIcon={suffixIcon}
        placeholder={placeholder}
        value={defaultValue}
        onDropdownVisibleChange={o => setOpen(o)}
        onChange={onChange}
      >
        {options && options.map((option: IMainList) => (
          <Option value={option.value} key={option.id}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default Dropdown;
