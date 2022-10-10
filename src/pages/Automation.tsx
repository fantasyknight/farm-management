import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  Button,
  PlusIcon,
  Title,
  Spinner,
  ModalComponent,
  Feedback,
} from '../components/shared';
import ModalAutomation from '../components/automation/ModalAutomation';
import AutomationTable from '../components/automation/AutomationTable';

import { IUiState } from '../store/ui/ui.type';
import { ProfileState } from '../store/profile/profile.type';
import { IAutomationState } from '../store/automation/automation.type';
import {
  getAutomationsData,
  removeAutomation,
  removeMessage,
} from '../store/automation/automation.actions';
import { IRootState } from '../store/rootReducer';
import { useWidth } from '../util/useWidth';

const ToDo = () => {
  const dispatch = useDispatch();
  const width = useWidth();
  const history = useHistory();

  const permission = useSelector<IRootState, ProfileState['permission']>(
    state => state.profile.permission,
  );
  const isSpinner = useSelector<IRootState, IUiState['isSpinner']>(
    state => state.ui.isSpinner,
  );
  const message = useSelector<IRootState, IAutomationState['message']>(
    state => state.automation.message,
  );
  const automations = useSelector<
    IRootState,
    IAutomationState['automationsData']
  >(state => state.automation.automationsData);

  const [isEdit, setIsEdit] = useState(false);
  const [autoData, setAutoData] = useState(null);
  const [automationModalVisible, setAutomationModalVisible] = useState(false);
  const [deleteAutomation, setDeleteAutomation] = useState(false);
  const [autoId, setAutoId] = useState(0);

  useEffect(() => {
    dispatch(getAutomationsData(history));
  }, []);

  useEffect(() => {
    if (message?.message) {
      setTimeout(() => {
        dispatch(removeMessage());
      }, 3000);
    }
  }, [message]);

  const showAutomationAddModal = () => {
    setAutoData(null);
    setIsEdit(false);
    setAutomationModalVisible(!automationModalVisible);
  };

  const onEdit = (dat: any) => {
    setAutoData(dat);
    setIsEdit(true);
    setAutomationModalVisible(!automationModalVisible);
  };

  const onDelete = (dat: any) => {
    setAutoId(dat.id);
    setDeleteAutomation(!deleteAutomation);
  };

  const onConfirmDelete = async () => {
    setDeleteAutomation(!deleteAutomation);
    await dispatch(removeAutomation(autoId, history));
    setAutoId(0);
  };

  return (
    <div className='budget bg-secondary min-height'>
      <div className='container'>
        <div className='d-flex justify-content-between align-items-center'>
          <Title
            className={width > 768 ? 'pl-21 pt-32 pb-34' : 'pb-14 pt-20'}
            size={5}
            color='black-3'
            align='default'
            fontWeight={700}
          >
            Automation
          </Title>
          {permission?.isEdit && width > 768 && (
            <Button
              color='blue'
              size={1}
              width='middle'
              type='fill'
              onClick={showAutomationAddModal}
            >
              Add Automation
            </Button>
          )}
          {permission?.isEdit && width <= 768 && (
            <Button
              color='blue'
              size={0}
              width='default'
              type='fill'
              iconOnly
              onClick={showAutomationAddModal}
            >
              <PlusIcon />
            </Button>
          )}
        </div>
        <div
          className={
            width > 768 ? 'd-flex justify-content-between pl-15 pr-15' : ''
          }
        >
          {!isSpinner && (
            <div className='width-100 pos-relative'>
              <AutomationTable
                data={automations}
                column='isAutomation'
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          )}
          {isSpinner && (
            <div className='w-100 d-flex justify-content-center'>
              <Spinner />
            </div>
          )}
        </div>
      </div>
      <ModalAutomation
        onCancel={() => {
          setAutomationModalVisible(!automationModalVisible);
          setAutoData(null);
        }}
        onConfirm={showAutomationAddModal}
        visible={automationModalVisible}
        type={isEdit}
        data={autoData}
      />
      <ModalComponent
        visible={deleteAutomation}
        onCancel={() => {
          setDeleteAutomation(!deleteAutomation);
          setAutoData(null);
        }}
        type='delete'
        title='Error / Delete'
        text='Do you really want to delete this automation?'
        onConfirm={onConfirmDelete}
      />
      {message?.message && (
        <Feedback
          message={message.message}
          type={
            message.message === 'Success' || message.message === 'success'
              ? 'success'
              : 'error'
          }
          theme='light'
          isGlobal
        />
      )}
    </div>
  );
};

export default ToDo;
