import React, {
  FC,
  ReactNode,
  ChangeEvent,
  FocusEvent,
  useEffect,
  useState,
} from 'react';
import classNames from 'classnames';
import NumberFormat from 'react-number-format';

import CalendarIcon from '../CalendarIcon';
import Paragrapgh from '../paragrapgh/Paragrapgh';

import './styles.scss';

interface IOwnProps {
  disabled?: boolean;
  type: string;
  className?: string;
  label: string;
  placeholder?: string;
  value: string;
  unit?: ReactNode;
  readonly?: boolean;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    data?: string,
  ) => void;
  onValChange?: (data: string) => void;
  required?: boolean;
  onValidate?: (e: boolean, data?: string) => void;
  dataType?: string;
  name?: string;
  min?: number;
  max?: number;
  isOptional?: boolean;
  isClear?: boolean;
  isErrorRes?: boolean;
}

const Input: FC<IOwnProps> = ({
  disabled,
  className,
  label,
  type,
  placeholder,
  value,
  unit,
  onChange,
  onValChange,
  required,
  readonly,
  onValidate,
  dataType,
  name,
  min,
  max,
  isOptional,
  isClear,
  isErrorRes,
}) => {
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputClasses = classNames(className, 'input', {
    'input--disabled': disabled,
    'input--success': isSuccess,
    'input--error': isError,
    'input--marker': unit,
    'input--textarea': type === 'textarea',
    'input--readonly': readonly,
  });

  const handleOnChangeValue = (isValid: any) => {
    if (isValid && onValidate) {
      onValidate(true, dataType);
    } else if (onValidate) {
      onValidate(false, dataType);
    }
  };

  const handleOnChangeState = (isValid: any) => {
    if (isValid) {
      setIsSuccess(true);
      setIsError(false);
      if (onValidate) {
        onValidate(true, dataType);
      }
    } else {
      setIsError(true);
      setIsSuccess(false);

      if (onValidate) {
        onValidate(false, dataType);
      }
    }

    if (
      (!required && type === 'text' && !min && !max) ||
      type === 'textarea' ||
      type === 'number'
    ) {
      setIsError(false);
      setIsSuccess(false);
    }
  };

  const checkInputh = (inputValue: string, isHandler: boolean) => {
    let isValid;
    if (required) {
      isValid = inputValue.length >= 1;
    }
    if (type === 'date') {
      isValid = new Date(inputValue).getTime();
    } else if (type === 'email') {
      isValid = inputValue.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    } else if (type === 'password') {
      isValid = inputValue.length >= 8;
    } else if (min) {
      isValid = inputValue.length >= min;
      if (!required && inputValue === '') {
        isValid = true;
      }
    } else if (max) {
      isValid = inputValue.length <= max;
    }

    if (isHandler) {
      handleOnChangeState(isValid);
    } else {
      handleOnChangeValue(isValid);
    }
  };

  useEffect(() => {
    checkInputh(value, false);
  }, []);

  useEffect(() => {
    if (isErrorRes) {
      setIsError(true);
      if (isSuccess) {
        setIsSuccess(false);
      }
    }
  }, [isErrorRes]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    checkInputh(e.target.value, true);

    if (onChange) {
      onChange(e, dataType);
    }
  };

  const handleOnFocus = (e: FocusEvent<HTMLInputElement>) => {
    checkInputh(e.target.value, true);
  };

  useEffect(() => {
    if (isClear) {
      if (isSuccess) {
        setIsSuccess(false);
      }
      if (isError) {
        setIsError(false);
      }
    }
  }, [value]);

  if (type === 'search') {
    return (
      <div className='w-100'>
        <div className={unit ? 'd-flex' : 'pos-relative'}>
          <input
            type={type}
            onChange={handleOnChange}
            disabled={disabled}
            className={inputClasses}
            placeholder={placeholder}
            value={value}
            readOnly={readonly}
            data-type={dataType}
            name={name}
          />

          {unit && <span className='input__marker'>{unit}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className='w-100'>
      {label && (
        <div className='d-flex align-items-center justify-content-between'>
          <Paragrapgh
            className='mb-4 d-block'
            size={2}
            color='black-2'
            align='default'
            fontWeight={400}
          >
            {label}
          </Paragrapgh>
          {isOptional && (
            <Paragrapgh
              className='mb-4 d-block'
              size={3}
              color='black-2'
              align='default'
              fontWeight={400}
            >
              Optional
            </Paragrapgh>
          )}
        </div>
      )}
      <div className={unit ? 'd-flex' : 'pos-relative'}>
        {type === 'cardnumber' && (
          <NumberFormat
            format='#### #### #### ####'
            mask='_'
            onValueChange={values => onValChange && onValChange(values.value)}
            disabled={disabled}
            className={inputClasses}
            placeholder={placeholder}
            value={value}
            data-type={dataType}
            name={name}
          />
        )}
        {type === 'expiration' && (
          <NumberFormat
            format='##/##'
            mask={['M', 'M', 'Y', 'Y']}
            onValueChange={values =>
              onValChange && onValChange(values.formattedValue)
            }
            disabled={disabled}
            className={inputClasses}
            placeholder={placeholder}
            value={value}
            data-type={dataType}
            name={name}
          />
        )}
        {type === 'cvv' && (
          <NumberFormat
            format='###'
            onValueChange={values => onValChange && onValChange(values.value)}
            type='password'
            disabled={disabled}
            className={inputClasses}
            placeholder={placeholder}
            value={value}
            data-type={dataType}
            name={name}
          />
        )}
        {type === 'textarea' && (
          <textarea
            onChange={onChange}
            disabled={disabled}
            className={inputClasses}
            placeholder={placeholder}
            value={value}
            data-type={dataType}
            name={name}
          />
        )}
        {type !== 'textarea' &&
          type !== 'cardnumber' &&
          type !== 'expiration' &&
          type !== 'cvv' && (
            <input
              type={type}
              onChange={handleOnChange}
              // onFocus={handleOnFocus}
              disabled={disabled}
              className={inputClasses}
              placeholder={placeholder}
              value={value}
              readOnly={readonly}
              data-type={dataType}
              name={name}
            />
          )}
        {type === 'date' && disabled && (
          <span className='input__icon'>
            <CalendarIcon color='#C0C0C0' />
          </span>
        )}
        {unit && <span className='input__marker'>{unit}</span>}
      </div>
    </div>
  );
};

export default Input;
