import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dropdown,
  Feedback,
  ModalComponent,
  PlusIcon,
  Search,
  SearchBigIcon,
  SortIcon,
  Spinner,
  Tables,
  Title,
} from '../components/shared';
import {
  activateUser,
  deactivateUser,
  deleteMessage,
  deleteUser,
  getAllUsers,
} from '../store/users/users.actions';
import { IMainList } from '../types/basicComponentsTypes';
import { useWidth } from '../util/useWidth';
import { IRootState } from '../store/rootReducer';
import { IUserPayload, UsersState } from '../store/users/users.type';
import UserCard from '../components/users/UserCard';
import { ProfileState } from '../store/profile/profile.type';

const Users = () => {
  const dispatch = useDispatch();
  const width = useWidth();
  const history = useHistory();
  const [value, setValue] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const [roleSelected, setRoleSelected] = useState();
  const [statusSelected, setStatusSelected] = useState<string>();
  const [users, setUsers] = useState<IUserPayload[]>([]);
  const [deleteId, setDeleteId] = useState('');
  const usersStore = useSelector<IRootState, UsersState['users']>(
    state => state.users.users,
  );
  const usersMessageStore = useSelector<IRootState, UsersState['message']>(
    state => state.users.message,
  );
  const profile = useSelector<IRootState, ProfileState['user']>(
    state => state.profile.user,
  );
  const [isDelete, setIsDelete] = useState(false);
  const [isDeactivate, setIsDeactivate] = useState(false);
  const [isActivate, setIsActivate] = useState(false);
  const [deactivateId, setDeactivateId] = useState('');
  const [isSpinner, setIsSpinner] = useState(false);

  const handleFilter = () => {
    setIsSpinner(true);
    let defaultUser = usersStore;
    if (statusSelected) {
      defaultUser = defaultUser.filter(user => user.status === statusSelected);
    }
    if (roleSelected) {
      defaultUser = defaultUser.filter(user => user.role === roleSelected);
    }
    if (value) {
      defaultUser = defaultUser.filter(
        user => user.email?.includes(value) || user.name?.includes(value),
      );
    }
    setUsers(defaultUser);
    setIsSpinner(false);
  };

  useEffect(() => {
    handleFilter();
  }, [roleSelected, statusSelected]);

  useEffect(() => {
    handleFilter();
  }, [usersStore]);

  const getUsers = async () => {
    setIsSpinner(true);
    await dispatch(getAllUsers(history));
    setIsSpinner(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (usersMessageStore.message) {
      setTimeout(() => {
        dispatch(deleteMessage());
      }, 3000);
    }
  }, [usersMessageStore.message]);

  const handleOnSearch = () => {
    handleFilter();
  };

  const roles: IMainList[] = [
    { value: '3', label: 'All', id: '' },
    { value: '0', label: 'Admin', id: 'admin' },
    { value: '1', label: 'User', id: 'user' },
    { value: '2', label: 'Owner', id: 'owner' },
  ];

  const status: IMainList[] = [
    { value: '', label: 'All', id: '' },
    { value: 'active', label: 'Active', id: 'active' },
    { value: 'pending', label: 'Pending', id: 'pending' },
    { value: 'deactivated', label: 'Deactivated', id: 'deactivated' },
  ];

  const handleOnStatus = (select: string) => {
    setStatusSelected(select);
  };

  const handleOnRole = (event: any) => {
    setRoleSelected(event.key);
  };

  const handleOnActiveSearch = () => {
    setIsSearch(!isSearch);
    if (isSort) {
      setIsSort(false);
    }
  };

  const handleOnActiveSort = () => {
    setIsSort(!isSort);
    if (isSearch) {
      setIsSearch(false);
    }
  };

  const handleOnDelete = (data: IUserPayload) => {
    const id = data?.status !== 'pending' ? data.id : data.email;
    setDeleteId(id as string);
    setIsDelete(true);
  };

  const handleConfirmDelete = async () => {
    await dispatch(deleteUser(deleteId, history));
    setIsDelete(false);
    await dispatch(getAllUsers(history));
  };

  const handleOnDeactivate = (data: IUserPayload) => {
    setDeactivateId(data.id as string);
    setIsDeactivate(true);
  };

  const handleConfirmDeactivate = async () => {
    if (isDeactivate) {
      await dispatch(deactivateUser(Number(deactivateId), history));
      setIsDeactivate(false);
    }
    if (isActivate) {
      await dispatch(activateUser(deactivateId, history));
      setIsActivate(false);
    }
  };

  const handleOnActivate = (data: IUserPayload) => {
    setDeactivateId(data.id as string);
    setIsActivate(true);
  };

  return (
    <>
      <div className='bg-secondary min-height'>
        <div className='container'>
          <div className='users d-flex justify-content-between align-items-center'>
            <Title size={5} color='black' align='default' fontWeight={700}>
              Users
            </Title>
            {profile?.role !== 'user' && (
              <Link to='/users/add-user'>
                {width > 768 ? (
                  <Button color='blue' size={1} width='middle' type='fill'>
                    Add New User
                  </Button>
                ) : (
                  <Button
                    color='blue'
                    size={0}
                    width='default'
                    type='fill'
                    iconOnly
                  >
                    <PlusIcon />
                  </Button>
                )}
              </Link>
            )}
          </div>
          {width < 769 ? (
            <>
              <div className='filter mobile-sort '>
                <span
                  className='filter__icon'
                  onClick={handleOnActiveSort}
                  onKeyDown={handleOnActiveSort}
                  role='button'
                  tabIndex={0}
                >
                  <SortIcon active={isSort} />
                </span>
                <span
                  className='filter__icon'
                  onClick={handleOnActiveSearch}
                  onKeyDown={handleOnActiveSearch}
                  role='button'
                  tabIndex={0}
                >
                  <SearchBigIcon active={isSearch} />
                </span>
              </div>
              {(isSearch || isSort) && (
                <div className='filter'>
                  {isSort && (
                    <div className='d-flex'>
                      <Dropdown
                        placeholder='Role'
                        onChange={(select, event) => handleOnRole(event)}
                        label=''
                        options={roles}
                      />
                      <span className='horizontal-line' />
                      <Dropdown
                        placeholder='Status'
                        onChange={select => handleOnStatus(select)}
                        label=''
                        options={status}
                      />
                    </div>
                  )}
                  {isSearch && (
                    <Search
                      onSearch={handleOnSearch}
                      onChange={e => setValue(e.target.value)}
                      value={value}
                    />
                  )}
                </div>
              )}
            </>
          ) : (
            <div className='filter'>
              <div className='d-flex'>
                <Dropdown
                  placeholder='Role'
                  onChange={(select, event) => handleOnRole(event)}
                  label=''
                  options={roles}
                />
                <span className='horizontal-line' />
                <Dropdown
                  placeholder='Status'
                  onChange={(select, event) => handleOnStatus(select)}
                  label=''
                  options={status}
                />
              </div>
              <Search
                onSearch={handleOnSearch}
                onChange={e => setValue(e.target.value)}
                value={value}
              />
            </div>
          )}
          {!isSpinner && (
            <>
              {width > 768 ? (
                <div className='users__content'>
                  <Tables
                    column='isUsers'
                    onDeactivate={(data: any) => handleOnDeactivate(data)}
                    onDeleteRow={(data: any) => handleOnDelete(data)}
                    onActivateUser={(data: any) => handleOnActivate(data)}
                    data={users}
                  />
                </div>
              ) : (
                <div className='d-flex flex-wrap mt-6'>
                  {users.map((user, index) => (
                    <UserCard
                      name={user.name}
                      email={user.email}
                      key={index.toString()}
                      status={user.status}
                      role={user.role}
                      id={user.id}
                      onDeactivate={(data: any) => handleOnDeactivate(data)}
                      onDeleteRow={(data: any) => handleOnDelete(data)}
                      onActivateUser={(data: any) => handleOnActivate(data)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
          {isSpinner && (
            <div className='mt-20'>
              <Spinner />
            </div>
          )}
        </div>
      </div>
      <ModalComponent
        visible={isDelete}
        onCancel={() => setIsDelete(false)}
        type='delete'
        title='Error / Delete '
        text='This is place holder text. The basic dialog for modals should contain only valuable and relevant information. Simplify dialogs by removing unnecessary elements or content that does not support user tasks. If you find that the number of required elements for your design are making the dialog excessively large, then try a different design solution. '
        onConfirm={() => handleConfirmDelete()}
      />
      <ModalComponent
        visible={isDeactivate || isActivate}
        onCancel={() => {
          if (isDeactivate) {
            setIsDeactivate(false);
          } else {
            setIsActivate(false);
          }
        }}
        type='confirm'
        title='Modal dialog'
        text='This is place holder text. The basic dialog for modals should contain only valuable and relevant information. Simplify dialogs by removing unnecessary elements or content that does not support user tasks. If you find that the number of required elements for your design are making the dialog excessively large, then try a different design solution. '
        onConfirm={() => handleConfirmDeactivate()}
      />
      {usersMessageStore.message && (
        <Feedback
          message={usersMessageStore.message}
          type={
            usersMessageStore.message === 'Success' ||
            usersMessageStore.message === 'success'
              ? 'success'
              : 'error'
          }
          theme='light'
          isGlobal
        />
      )}
    </>
  );
};

export default Users;
