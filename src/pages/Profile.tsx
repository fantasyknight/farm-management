import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';

import {
  Input,
  Title,
  Button,
  AvatarComponent,
  CameraIcon,
  Spinner,
} from '../components/shared';
import { useWidth } from '../util/useWidth';
import { updateAvatar, updateProfile } from '../store/profile/profile.actions';
import { IRootState } from '../store/rootReducer';
import { AuthState } from '../store/auth/auth.type';
import { IProfilePayload, ProfileState } from '../store/profile/profile.type';

const Profile = () => {
  const width = useWidth();
  const dispatch = useDispatch();
  const history = useHistory();
  const [disabled, setDisabled] = useState(false);
  const [isSpinner, setIsSpinner] = useState(false);
  const [isValidFields, setIsValidFields] = useState<boolean>();
  const [fieldsValid, setFieldsValid] = useState([
    {
      name: 'fullName',
      isValidate: true,
    },
    {
      name: 'phone',
      isValidate: true,
    },
    {
      name: 'companyName',
      isValidate: true,
    },
    {
      name: 'companyAddress',
      isValidate: true,
    },
  ]);
  const auth = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );

  const handleOnValidFields = (value: boolean, data: string | undefined) => {
    let counter = 0;
    const newArr = fieldsValid.map(field => {
      /* eslint-disable*/
      if (field.name == data) {
        if (value) counter++;
        return { ...field, isValidate: value };
      }
      if (field.name !== data && field.isValidate) counter++;
      return field;
    });

    setFieldsValid(newArr);
    setIsValidFields(fieldsValid.length === counter || false);
  };

  const profile = useSelector<IRootState, ProfileState['user']>(
    state => state.profile.user,
  );
  const [user, setUser] = useState<IProfilePayload>();

  useEffect(() => {
    const getUser = {
      name: profile.name,
      phone_number: profile.phone_number,
      company_name: profile.company_name,
      company_address: profile.company_address,
      avatar: profile.avatar,
    };

    setUser(getUser);
  }, [profile]);

  const handleOnAvatar = async (e: any) => {
    setIsSpinner(true);
    const data = new FormData();
    data.append('image', e.file);
    data.append('user_id', auth.id as string);
    await dispatch(updateAvatar(data, history));
    setIsSpinner(false);
  };

  const handleOnSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    await dispatch(
      updateProfile({ ...user, id: auth.id, _method: 'patch' }, history),
    );
    setDisabled(false);
  };

  const checkPhoneNumber = (e: any) => {
    let phoneNumber = e.target.value
      .replace(/\D/g, '')
      .match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})/);
    if (e.target.value !== '') {
      phoneNumber = !phoneNumber[3]
        ? `+${phoneNumber[1]}${phoneNumber[2] ? ` ${phoneNumber[2]}` : ''}`
        : `+${phoneNumber[1]} (${phoneNumber[2]}) ${phoneNumber[3]}${
            phoneNumber[4] ? `-${phoneNumber[4]}` : ''
          }`;
    } else {
      phoneNumber = '';
    }

    setUser({ ...user, phone_number: phoneNumber });
  };

  return (
    <>
      <div className='content pb-32'>
        {width > 768 && (
          <Title
            className='mb-24'
            size={5}
            color='black-3'
            align='default'
            fontWeight={600}
          >
            Profile
          </Title>
        )}
        <div className='d-flex align-items-center mb-32'>
          {isSpinner ? (
            <div className='m-auto mt-12'>
              <Spinner />
            </div>
          ) : (
            <>
              <AvatarComponent
                size={width < 769 ? 64 : 72}
                image={user?.avatar}
              />
              <ImgCrop>
                <Upload
                  customRequest={(e: any) => handleOnAvatar(e)}
                  fileList={[]}
                  listType='picture-card'
                  accept='image/x-png,image/gif,image/jpeg'
                >
                  <label htmlFor='upload-avatar' className='upload-button'>
                    <CameraIcon />
                    <span className='upload-button__text'>Upload photo</span>
                  </label>
                </Upload>
              </ImgCrop>
            </>
          )}
        </div>
        <div className='d-flex mb-16 align-items-center justify-content-between'>
          <Title size={6} color='black' align='default' fontWeight={600}>
            General info
          </Title>
        </div>
        <form onSubmit={handleOnSave}>
          <Input
            type='text'
            className='mb-16'
            onChange={e => setUser({ ...user, name: e.target.value })}
            value={user?.name ? user.name : ''}
            label='Full Name'
            placeholder=''
            dataType='fullName'
            max={255}
            required
            onValidate={(e, data) => handleOnValidFields(e, data)}
          />
          <Input
            type='text'
            className='mb-16'
            onChange={e => checkPhoneNumber(e)}
            value={user?.phone_number ? user.phone_number : ''}
            label='Phone'
            dataType='phone'
            min={17}
            placeholder=''
            onValidate={(e, data) => handleOnValidFields(e, data)}
          />
          <Input
            type='text'
            className='mb-16'
            onChange={e => setUser({ ...user, company_name: e.target.value })}
            value={user?.company_name ? user.company_name : ''}
            label='Company Name'
            dataType='companyName'
            max={255}
            placeholder=''
            onValidate={(e, data) => handleOnValidFields(e, data)}
          />
          <Input
            type='text'
            onChange={e =>
              setUser({ ...user, company_address: e.target.value })
            }
            value={user?.company_address ? user.company_address : ''}
            label='Company Address'
            dataType='companyAddress'
            max={255}
            placeholder=''
            onValidate={(e, data) => handleOnValidFields(e, data)}
          />
          <Button
            className='mt-16'
            color='blue'
            size={1}
            width={width < 769 ? 'wide' : 'small'}
            type='fill'
            disabled={disabled || !isValidFields}
          >
            <span>Save</span>
          </Button>
        </form>
      </div>
    </>
  );
};

export default Profile;
