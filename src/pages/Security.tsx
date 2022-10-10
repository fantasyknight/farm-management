import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Input, Title, Button, Paragrapgh } from '../components/shared';
import { updateEmail, updatePassword } from '../store/profile/profile.actions';
import { IChangePassword } from '../types/apiDataTypes';
import { IRootState } from '../store/rootReducer';
import { ProfileState } from '../store/profile/profile.type';
import { useWidth } from '../util/useWidth';

const Security = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userStore = useSelector<IRootState, ProfileState['user']>(
    state => state.profile.user,
  );
  const profileMessage = useSelector<IRootState, ProfileState['message']>(
    state => state.profile.message,
  );
  const width = useWidth();
  const [currentEmail, setCurrentEmail] = useState({
    current: '',
    pending: '',
  });
  const [emailFields, setEmailFields] = useState({ email: '', password: '' });
  const [passwordFields, setPasswordFields] = useState({
    password: '',
    new_password: '',
  });
  const [isClearEmail, setIsClearEmail] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [isValidFieldsPassword, setIsValidFieldsPassword] = useState<boolean>();
  const [passwordFieldsValid, setPasswordFieldsValid] = useState([
    {
      name: 'password',
      isValidate: false,
      isErrorRes: false,
    },
    {
      name: 'new_password',
      isValidate: false,
      isErrorRes: false,
    },
  ]);
  const [isValidFields, setIsValidFields] = useState<boolean>();
  const [fieldsValid, setFieldsValid] = useState([
    {
      name: 'password',
      isValidate: false,
      isErrorRes: false,
    },
    {
      name: 'email',
      isValidate: false,
      isErrorRes: false,
    },
  ]);

  useEffect(() => {
    setCurrentEmail({
      current: userStore.email as string,
      pending: userStore.pendingEmail ? userStore.pendingEmail : '',
    });
  }, [userStore]);

  useEffect(() => {
    if (!profileMessage.isError && profileMessage?.type === 'email') {
      setIsValidFields(false);
      setEmailFields({ email: '', password: '' });
      setFieldsValid(
        fieldsValid.map(item => {
          return { ...item, isValidate: false, isErrorRes: false };
        }),
      );
      setIsClearEmail(true);
    }
    if (!profileMessage.isError && profileMessage?.type === 'password') {
      setIsValidFieldsPassword(false);
      setPasswordFields({
        password: '',
        new_password: '',
      });
      setPasswordFieldsValid(
        passwordFieldsValid.map(item => {
          return { ...item, isValidate: false, isErrorRes: false };
        }),
      );
      setIsClear(true);
    }
    if (
      profileMessage.isError &&
      profileMessage.type === 'password' &&
      profileMessage?.message === 'Current password is invalid'
    ) {
      setPasswordFieldsValid(
        passwordFieldsValid.map(item => {
          if (item.name === 'password') {
            return { ...item, isErrorRes: true };
          }
          return { ...item };
        }),
      );
    }
    if (
      profileMessage.isError &&
      profileMessage.type === 'email' &&
      profileMessage?.message === 'Mismatch credentials'
    ) {
      setFieldsValid(
        fieldsValid.map(item => {
          if (item.name === 'password') {
            return { ...item, isErrorRes: true };
          }
          return { ...item };
        }),
      );
    }
  }, [profileMessage]);

  useEffect(() => {
    if (isClearEmail) {
      setIsClearEmail(false);
    }
  }, [isClearEmail]);

  useEffect(() => {
    if (isClear) {
      setIsClear(false);
    }
  }, [isClear]);

  useEffect(() => {
    if (passwordFieldsValid[0].isErrorRes) {
      setPasswordFieldsValid(
        passwordFieldsValid.map(item => {
          if (item.name === 'password') {
            return { ...item, isErrorRes: false };
          }
          return { ...item };
        }),
      );
    }
  }, [passwordFieldsValid[0].isErrorRes]);

  useEffect(() => {
    if (fieldsValid[0].isErrorRes) {
      setFieldsValid(
        fieldsValid.map(item => {
          if (item.name === 'password') {
            return { ...item, isErrorRes: false };
          }
          return { ...item };
        }),
      );
    }
  }, [fieldsValid[0].isErrorRes]);

  const handleOnChangePassword = async () => {
    setIsValidFieldsPassword(false);
    const changeData: IChangePassword = {
      password: passwordFields.password,
      new_password: passwordFields.new_password,
    };
    await dispatch(updatePassword(changeData, history));
    setIsValidFieldsPassword(true);
  };

  const handleOnChangeEmail = async () => {
    setIsValidFields(false);
    await dispatch(updateEmail(emailFields, history));
    setIsValidFields(true);
  };

  const handleOnValidFields = (value: boolean, type: string | undefined) => {
    let counter = 0;
    const newArr = fieldsValid.map(field => {
      /* eslint-disable*/
      if (field.name == type) {
        if (value) counter++;
        return { ...field, isValidate: value };
      }
      if (field.name !== type && field.isValidate) counter++;
      return field;
    });

    setFieldsValid(newArr);
    setIsValidFields(2 === counter || false);
  };

  const handleOnValidatePassword = (
    value: boolean,
    type: string | undefined,
  ) => {
    let counter = 0;
    const newArr = passwordFieldsValid.map(field => {
      /* eslint-disable*/
      if (field.name == type) {
        if (value) counter++;
        return { ...field, isValidate: value };
      }
      if (field.name !== type && field.isValidate) counter++;
      return field;
    });

    setPasswordFieldsValid(newArr);
    setIsValidFieldsPassword(2 === counter || false);
  };

  return (
    <div className='content pb-32'>
      {width > 768 && (
        <Title
          className='mb-24'
          size={5}
          color='black-3'
          align='default'
          fontWeight={700}
        >
          Security
        </Title>
      )}
      <Title
        className='mb-16'
        size={6}
        color='black-3'
        align='default'
        fontWeight={500}
      >
        Change email
      </Title>
      <Paragrapgh
        className='mb-16'
        size={1}
        color='black'
        align='default'
        fontWeight={400}
      >
        Current email -{' '}
        <span className='font-weight-600'>{currentEmail.current}</span>
      </Paragrapgh>
      {currentEmail.pending && (
        <Paragrapgh
          className='mb-16'
          size={1}
          color='black'
          align='default'
          fontWeight={400}
        >
          Pending email -{' '}
          <span className='font-weight-600'>{currentEmail.pending}</span>
        </Paragrapgh>
      )}
      <Input
        className='mb-16'
        type='email'
        onChange={e =>
          setEmailFields({ ...emailFields, email: e.target.value })
        }
        value={emailFields.email}
        label='New email'
        dataType='email'
        onValidate={(e, data) => handleOnValidFields(e, data)}
        placeholder=''
        isClear={isClearEmail}
      />
      <Input
        className='mb-24'
        type='password'
        onChange={e =>
          setEmailFields({ ...emailFields, password: e.target.value })
        }
        value={emailFields.password}
        label='Current password'
        dataType='password'
        onValidate={(e, data) => handleOnValidFields(e, data)}
        placeholder=''
        isClear={isClearEmail}
        isErrorRes={fieldsValid[0].isErrorRes}
      />
      <Button
        className={width < 769 ? 'mt-12' : 'h-max'}
        color='blue'
        size={2}
        width={width < 769 ? 'wide' : 'small'}
        type='bordered'
        disabled={!isValidFields}
        onClick={handleOnChangeEmail}
      >
        <span>Change email</span>
      </Button>
      <Title
        className='mb-16 mt-32'
        size={6}
        color='black-3'
        align='default'
        fontWeight={500}
      >
        Change password
      </Title>
      <Input
        className='mb-16'
        type='password'
        onChange={e =>
          setPasswordFields({ ...passwordFields, password: e.target.value })
        }
        value={passwordFields.password}
        label='Current password'
        dataType='password'
        onValidate={(e, data) => handleOnValidatePassword(e, data)}
        placeholder=''
        isClear={isClear}
        isErrorRes={passwordFieldsValid[0].isErrorRes}
      />
      <Input
        className='mb-24'
        type='password'
        value={passwordFields.new_password}
        onChange={e =>
          setPasswordFields({ ...passwordFields, new_password: e.target.value })
        }
        dataType='new_password'
        label='New password'
        onValidate={(e, data) => handleOnValidatePassword(e, data)}
        placeholder=''
        isClear={isClear}
      />
      <Button
        className={width < 769 ? 'mt-12' : 'h-max'}
        color='blue'
        size={2}
        width={width < 769 ? 'wide' : 'small'}
        type='bordered'
        disabled={!isValidFieldsPassword}
        onClick={handleOnChangePassword}
      >
        <span>Change password</span>
      </Button>
    </div>
  );
};

export default Security;
