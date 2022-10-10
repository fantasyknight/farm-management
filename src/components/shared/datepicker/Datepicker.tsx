import React, { FC, useState } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import classNames from 'classnames';

import CalendarIcon from '../CalendarIcon';
import Paragrapgh from '../paragrapgh/Paragrapgh';

import './styles.scss';

interface IOwnProps {
  onChange: (e: moment.Moment | null, value: string) => void;
  onRange?: (e: boolean) => void;
  disabled?: boolean;
  label: string;
  required?: boolean;
  className?: string;
  defaultValue?: number | undefined;
}

const Datepicker: FC<IOwnProps> = ({
  onChange,
  required,
  onRange,
  disabled,
  label,
  className,
  defaultValue,
}) => {
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const datepickerClasses = classNames(className, 'w-100', {
    'ant-picker-input--success': isSuccess,
    'ant-picker-input--error': isError,
  });

  const handleOnChange = (e: moment.Moment | null, value: string) => {
    if (e && onRange && required) {
      setIsSuccess(true);
      setIsError(false);
      onRange(true);
    } else if (onRange && required) {
      setIsSuccess(false);
      setIsError(true);
      onRange(false);
    }

    onChange(e, value);
  };

  return (
    <div className={datepickerClasses}>
      <Paragrapgh
        className='mb-4 d-block'
        size={2}
        color='black-2'
        align='default'
        fontWeight={400}
      >
        {label}
      </Paragrapgh>
      <DatePicker
        disabled={disabled}
        defaultValue={moment(defaultValue)}
        value={moment(defaultValue)}
        onChange={handleOnChange}
        suffixIcon={<CalendarIcon color={disabled ? '#C0C0C0' : '#5A607F'} />}
      />
    </div>
  );
};

export default Datepicker;
