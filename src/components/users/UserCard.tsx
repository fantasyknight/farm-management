import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IUserPayload } from '../../store/users/users.type';
import { Paragrapgh, DotsIcon, DropdownMenu } from '../shared';
import TagComponent from '../shared/tag/Tag';
import { IRootState } from '../../store/rootReducer';
import { ProfileState } from '../../store/profile/profile.type';

interface IOwnProps {
  name?: string;
  email?: string;
  status?: string;
  role?: string;
  id?: string;
  onDeleteRow?: (data: any) => void;
  onDeactivate?: (data: any) => void;
  onActivateUser?: (data: any) => void;
}

const UserCard: FC<IOwnProps> = ({
  email,
  name,
  status,
  role,
  onDeactivate,
  id,
  onDeleteRow,
  onActivateUser,
}) => {
  useEffect(() => {}, []);
  const history = useHistory();
  const profile = useSelector<IRootState, ProfileState['user']>(
    state => state.profile.user,
  );

  const handleOnEdit = (d: any) => {
    history.push(`/users/edit-user/${d.id}`);
  };

  return (
    <div className='user-smallCard'>
      <div className='d-flex mb-28 justify-content-between align-items-center'>
        <Paragrapgh size={2} color='black' align='left' fontWeight={600}>
          {email}
        </Paragrapgh>
        {profile?.role !== 'user' &&
          role !== 'owner' &&
          email !== profile.email && (
            <DropdownMenu
              type='farms'
              onEdit={d => handleOnEdit(d)}
              onDeleteRow={onDeleteRow}
              onDeactivate={onDeactivate}
              onActivateUser={onActivateUser}
              data={{ id, email, status }}
              column='isUsers'
              icon={<DotsIcon />}
              isAdmin
            />
          )}
      </div>
      <div className='d-flex justify-content-between align-items-end'>
        <div>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Full Name
          </Paragrapgh>
          <Paragrapgh size={2} color='black' align='left' fontWeight={400}>
            {name}
          </Paragrapgh>
        </div>
        <div>
          <Paragrapgh size={3} color='black-2' align='left' fontWeight={400}>
            Role
          </Paragrapgh>
          <Paragrapgh size={2} color='black' align='left' fontWeight={400}>
            {role}
          </Paragrapgh>
        </div>
        <div>
          {status === 'active' && (
            <TagComponent color='green'>{status}</TagComponent>
          )}
          {status === 'pending' && (
            <TagComponent color='orange'>{status}</TagComponent>
          )}
          {status === 'deactivated' && (
            <TagComponent color='gray'>{status}</TagComponent>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
