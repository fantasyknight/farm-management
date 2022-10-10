import React, { FC, useState, useEffect, KeyboardEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Tag } from 'antd';
import moment from 'moment';
import {
  Spinner,
  ModalComponent,
  TrashIcon,
  DropdownMenu,
  CheckboxButton,
} from '../shared';

import ModalTask from './ModalTask';

import { IRootState } from '../../store/rootReducer';
import { ITaskData, ITaskState } from '../../store/tasks/tasks.type';
import {
  getTaskData,
  removeTask,
  updateTask,
} from '../../store/tasks/tasks.actions';
import { ProfileState } from '../../store/profile/profile.type';
import { UsersState } from '../../store/users/users.type';
import { getAllUsers } from '../../store/users/users.actions';
import { IFarmState } from '../../store/farms/farms.type';
import { getFarmsData } from '../../store/farms/farms.actions';
import './styles.scss';

interface IOwnProps {
  activePage: string;
  filterType: string;
}

const ToDoComponent: FC<IOwnProps> = ({ activePage, filterType }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const tasksData = useSelector<IRootState, ITaskState['tasks']>(
    state => state.tasks.tasks,
  );
  const usersStore = useSelector<IRootState, UsersState['users']>(
    state => state.users.users,
  );
  const farmsData = useSelector<IRootState, IFarmState['farmsData']>(
    state => state.farms.farmsData,
  );
  const profile = useSelector<IRootState, ProfileState['user']>(
    state => state.profile.user,
  );

  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isSpinner, setIsSpinner] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [showTaskData, setShowTaskData] = useState<ITaskData>({
    key: 0,
    id: '',
    farm_id: 0,
    line_id: 0,
    title: '',
    content: '',
    due_date: 0,
    active: 0,
    assigned_to: 0,
    created_at: '',
    creator_id: 0,
  });
  const [editTask, setEditTask] = useState(false);
  const [editTaskData, setEditTaskData] = useState({
    farm_id: 0,
    line_id: 0,
    due_date: 0,
    title: '',
  });
  const [deleteTask, setDeleteTask] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | number>('0');
  const [archiveTask, setArchiveTask] = useState(false);
  const [archiveTaskId, setArchiveTaskId] = useState<string | number>('0');

  const getUsers = async () => {
    setIsSpinner(true);
    await dispatch(getAllUsers(history));
    setIsSpinner(false);
  };

  useEffect(() => {
    setIsSpinner(true);
    dispatch(getTaskData(history));
    dispatch(getFarmsData(history));
    getUsers();
    setIsSpinner(false);
  }, []);

  useEffect(() => {
    setCompletedTasks(
      tasksData.filter(item => item.active).map(item => item.id!),
    );
  }, [tasksData]);

  const handleOnDeleteRow = (data: ITaskData) => {
    setDeleteTask(true);
    setDeleteTaskId(data.id!);
  };

  const handleOnConfirmDelete = async () => {
    await dispatch(removeTask(Number(deleteTaskId), history));
    setDeleteTask(false);
  };

  const handleOnArchiveRow = (data: ITaskData) => {
    setArchiveTask(true);
    setArchiveTaskId(data.id!);
  };

  const handleOnConfirmArchive = async () => {
    const task = tasksData.find(e => {
      return e.id === archiveTaskId;
    });
    if (task) {
      await dispatch(
        updateTask(
          {
            ...task,
            active: 1,
          },
          history,
        ),
      );
      setArchiveTask(false);
    }
  };

  const handleOnEditTask = (data: any) => {
    setEditTaskData(data);
    setEditTask(true);
  };

  const handleOnConfirmEditTask = () => {
    setEditTask(false);
  };

  const onTaskComplete = async (value: boolean, itemId: string) => {
    const task = tasksData.find(e => {
      return e.id === itemId;
    });
    if (value && task) {
      setCompletedTasks([...completedTasks, itemId]);
      await dispatch(
        updateTask(
          {
            ...task,
            active: 1,
          },
          history,
        ),
      );
    } else if (!value && task) {
      setCompletedTasks(completedTasks.filter(item => item !== itemId));
      await dispatch(
        updateTask(
          {
            ...task,
            active: 0,
          },
          history,
        ),
      );
    }
  };

  const onShowTask = (data: ITaskData) => {
    setShowTask(true);
    setShowTaskData(data);
  };

  const onKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    const enterOrSpace =
      e.key === 'Enter' ||
      e.key === ' ' ||
      e.key === 'Spacebar' ||
      e.which === 13 ||
      e.which === 32;
    if (enterOrSpace) {
      e.preventDefault();
    }
  };

  const getTaskUrgentType = (date: number) => {
    const dateofvisit = moment.unix(date / 1000);
    const today = moment();
    const diff = today.diff(dateofvisit, 'days');
    if (diff <= 0 && diff > -10) return 'gold';
    if (diff <= -10) return 'green';
    return 'red';
  };

  const getDueDateString = (date: number) => {
    const dateofvisit = moment.unix(date / 1000);
    const today = moment();
    const diff = Math.round(today.diff(dateofvisit, 'days', true));
    if (diff > 0) return `Overdue ${diff} day(s)`;
    if (diff === 0) return 'Due today';
    if (diff < 0) return `Due in ${-diff} day(s)`;
    return '';
  };

  return (
    <div className='todo'>
      {!isSpinner &&
        tasksData
          .filter(e => {
            if (filterType === 'all') return true;
            return e.assigned_to === Number(profile.user_id);
          })
          .filter(e => {
            if (activePage === 'active') {
              return !e.active;
            }
            if (activePage === 'overdue') {
              const dateofvisit = moment.unix(e.due_date / 1000);
              const diff = moment().diff(dateofvisit, 'days');
              if (diff > 0) return !e.active;
              return false;
            }
            if (activePage === 'completed') {
              return !!e.active;
            }
            return !e.active;
          })
          .sort((a, b) => a.due_date - b.due_date)
          .map(item => (
            <div className='todo__item pb-20 mb-20 line-bottom' key={item.id}>
              <CheckboxButton
                key={item.id}
                label=''
                checked={completedTasks.includes(item.id!)}
                onChange={e => onTaskComplete(e.target.checked, item.id!)}
              />
              <div
                className='d-flex flex-direction-row info-row'
                onClick={e => onShowTask(item)}
                onKeyPress={e => onKeyPress(e)}
              >
                <div className='d-flex flex-direction-row align-items-end'>
                  <div>
                    <p className='paragrapgh paragrapgh--1 paragrapgh--400 paragrapgh--default paragrapgh--default'>
                      {item.title}
                    </p>
                    <p className='d-block mt-4 paragrapgh paragrapgh--2 paragrapgh--400 paragrapgh--black-2 paragrapgh--default'>
                      {moment.unix(item.due_date / 1000).format('DD.MM.YYYY')}
                    </p>
                  </div>
                  {(activePage === 'active' || activePage === 'overdue') && (
                    <div className='ml-10 due_date_tag'>
                      <Tag color={getTaskUrgentType(item.due_date)}>
                        {getDueDateString(item.due_date)}
                      </Tag>
                    </div>
                  )}
                </div>
                <div className='d-flex flex-direction-row'>
                  <div className='taskDetail'>
                    created by
                    <span className='taskCreator'>
                      {
                        usersStore.find(
                          el =>
                            el.user_id?.toString() ===
                            item.creator_id?.toString(),
                        )?.name
                      }
                    </span>
                    <br />
                    on {item.created_at!.slice(0, 10)}
                  </div>
                  {activePage === 'active' || activePage === 'overdue' ? (
                    <DropdownMenu
                      data={item}
                      type='todo'
                      onEdit={handleOnEditTask}
                      onDeleteRow={handleOnDeleteRow}
                      onArchiveRow={handleOnArchiveRow}
                    />
                  ) : (
                    <button
                      style={{ border: 'none', background: 'none' }}
                      onClick={e => {
                        setDeleteTask(true);
                        setDeleteTaskId(item.id!);
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      {isSpinner && (
        <div className='mt-20'>
          <Spinner />
        </div>
      )}
      <ModalComponent
        visible={deleteTask}
        onCancel={() => setDeleteTask(!deleteTask)}
        type='delete'
        title='Error / Delete'
        text='Do you really want to delete this task?'
        onConfirm={handleOnConfirmDelete}
      />
      <ModalComponent
        visible={archiveTask}
        onCancel={() => setArchiveTask(!archiveTask)}
        type='confirm'
        title='Confirm / Complete Task'
        text='Do you really want to complete this task?'
        onConfirm={handleOnConfirmArchive}
      />
      <ModalTask
        onCancel={() => setEditTask(!editTask)}
        type='confirm'
        data={editTaskData}
        title='Edit task'
        onConfirm={handleOnConfirmEditTask}
        visible={editTask}
      />
      <ModalTask
        onCancel={() => setShowTask(!showTask)}
        type='close'
        className='viewTaskModal'
        data={showTaskData}
        title='View task'
        viewOnly
        onConfirm={() => setShowTask(!showTask)}
        visible={showTask}
      />
    </div>
  );
};

export default ToDoComponent;
