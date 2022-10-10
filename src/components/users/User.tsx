import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Radio, Collapse } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import classnames from 'classnames';

import {
  Title,
  Button,
  Input,
  RadioButton,
  Paragrapgh,
  ToggleButton,
  CheckboxButton,
  CaretDownIcon,
  Feedback,
  Spinner,
} from '../shared';

import { useWidth } from '../../util/useWidth';
import { IRootState } from '../../store/rootReducer';
import { UsersState } from '../../store/users/users.type';
import {
  createUser,
  deleteMessage,
  updateUser,
} from '../../store/users/users.actions';
import { AuthState } from '../../store/auth/auth.type';
import { IFarmState } from '../../store/farms/farms.type';
import { IFarmsUser } from '../../types/apiDataTypes';
import { composeApi } from '../../apis/compose';

import './styles.scss';

const User = () => {
  const params = useParams<{ id: string }>();
  const width = useWidth();
  const dispatch = useDispatch();
  const history = useHistory();
  const [disabled, setDisabled] = useState(false);
  const [isValidateEmail, setIsValidateEmail] = useState(false);
  const { Panel } = useMemo(() => Collapse, []);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<number>();
  const [isSpinner, setIsSpinner] = useState(true);
  const usersStore = useSelector<IRootState, UsersState['message']>(
    state => state.users.message,
  );
  const authStore = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );
  const farmsData = useSelector<IRootState, IFarmState['farmsData']>(
    state => state.farms.farmsData,
  );
  const [switchList, setSwitchList] = useState<any>([]);

  const list = [
    { label: 'View', value: false, key: '1' },
    { label: 'Edit', value: false, key: '2' },
    { label: 'Show financials', value: false, key: '3' },
    { label: 'Manage farm and lists', value: false, key: 'manage' },
  ];
  const [farms, setFarms] = useState<IFarmsUser[]>([]);

  const getUser = async (defaultFarms: IFarmsUser[] = []) => {
    const res = await composeApi(
      {
        data: { user_id: Number(params?.id) },
        method: 'POST',
        url: 'api/user/role-permissions',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (res.data) {
      setUserType(res.data.role[0].role_id);
      const newPermissions = list.map((perm, index) => {
        if (
          res.data.permissions.find(
            (item: any) => item.permission_id == perm.key,
          )
        ) {
          return { ...perm, value: true };
        }
        if (list.length === index + 1 && defaultFarms.length) {
          return { ...perm, value: true };
        }
        return { ...perm };
      });

      setSwitchList(newPermissions);
      setEmail(res?.data?.email ? res?.data?.email : '');

      /* eslint eqeqeq: 1 */
      const defaultFarm: IFarmsUser[] = defaultFarms.map(farm => {
        let counter = 0;
        const newLine = farm.lines.map(line => {
          if (res.data.lines.find((item: any) => item.line_id == line.id)) {
            counter += 1;
            return { ...line, value: true };
          }
          return { ...line, value: false };
        });
        if (
          farm.lines.length === counter &&
          res.data.farms.find((item: any) => item.farm_id == farm.id)
        ) {
          return { ...farm, typeChecked: 'full', lines: newLine };
        }
        if (counter) {
          return { ...farm, typeChecked: 'part', lines: newLine };
        }
        return { ...farm, line: newLine };
      });

      setFarms(defaultFarm);
    }
    setIsSpinner(false);
  };

  useEffect(() => {
    return () => {
      dispatch(deleteMessage());
    };
  }, []);

  useEffect(() => {
    const defaultFarm: IFarmsUser[] = farmsData.map(farm => {
      const newLine = farm.lines.map(line => {
        return {
          name: line?.line_name as string,
          id: line?.id as string,
          value: false,
        };
      });
      return {
        title: farm.name as string,
        id: farm?.id?.toString() as string,
        typeChecked: 'empty',
        lines: newLine,
      };
    });

    if (params?.id) {
      getUser(defaultFarm);
    } else {
      setUserType(2);
      setSwitchList(list);
      setFarms(defaultFarm);
      setIsSpinner(false);
    }
  }, []);

  const handleOnEmail = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEmail(e.target.value);
  };

  const onChangeUserType = (e: RadioChangeEvent) => {
    setUserType(e.target.value);
  };

  const handleOnPermissions = (e: boolean, key: string) => {
    setSwitchList(
      switchList.map((item: any) => {
        if (item.key === key) return { ...item, value: e };
        if (key === '2' && e && item.key === '1') return { ...item, value: e };
        return item;
      }),
    );
  };

  const handleOnFarmCheck = (checked: boolean, farmId: string) => {
    const newArr = farms.map(farm => {
      if (farm.id === farmId) {
        const newLine = farm.lines.map(line => {
          return { ...line, value: checked };
        });
        if (checked) {
          return { ...farm, typeChecked: 'full', lines: newLine };
        }
        return { ...farm, typeChecked: 'empty', lines: newLine };
      }
      return farm;
    });

    setFarms(newArr);
  };

  const genExtra = (type: string, farmId: string) => (
    <CheckboxButton
      disabled={!switchList[switchList.length - 1].value}
      label=''
      checked={type === 'part' || type === 'full'}
      isNegative={type === 'part'}
      onChange={e => handleOnFarmCheck(e.target.checked, farmId)}
    />
  );

  const CaretLeftOutlined = ({ rotate }: any) => (
    <div
      className={classnames(
        'accordion__icon',
        `accordion__icon--rotate-${rotate}`,
      )}
    >
      <CaretDownIcon />
    </div>
  );

  const handleOnSelectFarm = (
    checked: boolean,
    farmId: string,
    lineId: string,
  ) => {
    let counter = 0;
    const newArr = farms.map(farm => {
      if (farm.id === farmId) {
        const newLine = farm.lines.map(line => {
          if (line.id === lineId) {
            /* eslint-disable*/
            if (checked) counter++;
            return { ...line, value: checked };
          }
          if (line.value) counter++;
          return line;
        });
        if (farm.lines.length === counter) {
          return { ...farm, typeChecked: 'full', lines: newLine };
        }
        if (counter) {
          return { ...farm, typeChecked: 'part', lines: newLine };
        }
        return { ...farm, typeChecked: 'empty', lines: newLine };
      }
      return farm;
    });

    setFarms(newArr);
  };

  const handleOnConfirm = async () => {
    setDisabled(true);
    const permission_id = getPermissions();
    const farmsAndLines = getFarms();
    const data: any = {
      email,
      inviting_user_id: Number(authStore.id),
      account_id: Number(authStore.account_id),
      role_id: userType,
      permission_id,
      farm_id: farmsAndLines.farm_id,
      line_id: farmsAndLines.line_id,
    };

    if (params?.id) {
      data.user_id = Number(params?.id);
      delete data.inviting_user_id;
      delete data.email;
      await dispatch(updateUser(data, history));
    } else {
      await dispatch(createUser(data, history));
    }
  };

  const getPermissions = () => {
    let counter = 0;
    let permission_id = {};
    switchList.map((item: any, index: number) => {
      if ((item.value || userType === 2) && switchList.length - 1 !== index) {
        permission_id = {
          ...permission_id,
          [counter]: Number(item.key),
        };
        counter++;
      }
    });

    return permission_id;
  };

  const getFarms = () => {
    let counterFarm = 0;
    let counterLine = 0;
    let farm_id = {};
    let line_id = {};
    farms.map((farm, index) => {
      farm.lines?.map(line => {
        if (line.value || userType === 2) {
          line_id = {
            ...line_id,
            [counterLine]: Number(line.id),
          };
          counterLine++;
        }
      });
      if (farm.typeChecked !== 'empty' || userType === 2) {
        farm_id = {
          ...farm_id,
          [counterFarm]: Number(farm.id),
        };
        counterFarm++;
      }
    });

    return { farm_id, line_id };
  };

  useEffect(() => {
    if (usersStore.message === 'Success' || usersStore.message === 'success') {
      setTimeout(() => {
        history.push('/users');
      }, 3000);
    } else if (usersStore.message) {
      setDisabled(false);
      setTimeout(() => {
        dispatch(deleteMessage());
      }, 3000);
    }
  }, [usersStore.message]);

  return (
    <>
      <div className='bg-secondary min-height d-flex justify-content-center'>
        <div className='card user-card'>
          <div className='card-wrapper'>
            <Title
              className='mb-20'
              size={5}
              color='black'
              align='default'
              fontWeight={700}
            >
              {params?.id ? 'Edit user' : 'Add new user'}
            </Title>
            {isSpinner ? (
              <div className='mt-20'>
                <Spinner />
              </div>
            ) : (
              <>
                <Input
                  className='mb-24'
                  type='email'
                  onChange={handleOnEmail}
                  value={email}
                  label='Email'
                  placeholder=''
                  dataType='email'
                  onValidate={(e, data) => setIsValidateEmail(!e)}
                  disabled={params?.id ? true : false}
                />
                <Paragrapgh
                  size={1}
                  color='black'
                  align='left'
                  fontWeight={500}
                >
                  User type
                </Paragrapgh>
                <Radio.Group
                  className='d-flex mt-14 mb-32'
                  onChange={onChangeUserType}
                  value={userType}
                >
                  <RadioButton label='Admin' value={2} />
                  <RadioButton className='ml-34' label='User' value={3} />
                </Radio.Group>
                {userType !== 2 && (
                  <>
                    <Paragrapgh
                      className='mb-14'
                      size={1}
                      color='black'
                      align='left'
                      fontWeight={500}
                    >
                      Permissions
                    </Paragrapgh>
                    <div className='w-100 mb-16'>
                      {switchList &&
                        switchList.map((item: any) => {
                          return (
                            <ToggleButton
                              key={item.key}
                              className='mb-16'
                              label={item.label}
                              isfullWidth
                              checked={item.value}
                              isLeftText
                              onChange={e => handleOnPermissions(e, item.key)}
                            />
                          );
                        })}
                    </div>
                    <Paragrapgh
                      className='mb-8'
                      size={2}
                      color='black-2'
                      align='left'
                      fontWeight={400}
                    >
                      Select farm and lines
                    </Paragrapgh>
                    <div className='user-collapse'>
                      <Collapse
                        expandIcon={({ isActive }) => (
                          <CaretLeftOutlined
                            rotate={
                              isActive && switchList[switchList.length - 1].value
                                ? 180
                                : 0
                            }
                          />
                        )}
                      >
                        {farms.map(farm => (
                          <Panel
                            className={
                              switchList[switchList.length - 1].value
                                ? 'ant-collapse-item'
                                : 'ant-collapse-item-disabled'
                            }
                            header={farm.title}
                            key={farm.id}
                            extra={genExtra(farm.typeChecked, farm.id)}
                          >
                            {farm.lines.map(line => (
                              <CheckboxButton
                                key={line?.id}
                                label={line?.name as string}
                                checked={line?.value}
                                isfullWidth
                                isLeftText
                                onChange={e =>
                                  handleOnSelectFarm(
                                    e.target.checked,
                                    farm.id,
                                    line?.id as string,
                                  )
                                }
                              />
                            ))}
                          </Panel>
                        ))}
                      </Collapse>
                    </div>
                  </>
                )}
                <div className='mt-24 user-button d-flex justify-content-end align-items-center'>
                  <Link to='/users'>
                    <Button
                      width={width < 769 ? 'wide' : 'default'}
                      size={1}
                      type='transparent'
                      color='blue'
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    width={width < 769 ? 'wide' : 'default'}
                    size={1}
                    type='fill'
                    color='blue'
                    className='ml-16'
                    disabled={disabled || isValidateEmail}
                    onClick={handleOnConfirm}
                  >
                    Confirm
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {usersStore.message && (
        <Feedback
          message={usersStore.message}
          type={
            usersStore.message !== 'Success' && usersStore.message !== 'success'
              ? 'error'
              : 'success'
          }
          theme='light'
          isGlobal
        />
      )}
    </>
  );
};

export default User;
