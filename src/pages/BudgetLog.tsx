import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useWidth } from '../util/useWidth';
import {
  Feedback,
  ModalComponent,
  Spinner,
  TableMobile,
  Tables,
  Title,
} from '../components/shared';
import { composeApi } from '../apis/compose';
import { IRootState } from '../store/rootReducer';
import { AuthState } from '../store/auth/auth.type';

const BudgetLog: FC = (): ReactElement => {
  const width = useWidth();
  const dispatch = useDispatch();
  const history = useHistory();
  const [logs, setLogs] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState(0);
  const [message, setMessage] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 200,
  });
  const [isSpinner, setIsSpinner] = useState(false);

  const authStore = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );

  const getLogs = async () => {
    setIsSpinner(true);
    const responseData = await composeApi(
      {
        data: {},
        method: 'GET',
        url: `api/farm/line/budget-logs?current_page=${pagination.current}&page_size=${pagination.pageSize}`,
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    setLogs(responseData?.data);
    setPagination({ ...pagination, total: responseData?.meta?.total });
    setIsSpinner(false);
  };

  const handleOnDelete = (rowData: any) => {
    setDeleteId(rowData.id);
  };

  const handleConfirmDelete = async () => {
    const responseData = await composeApi(
      {
        data: { budget_log_id: deleteId },
        method: 'POST',
        url: 'api/farm/line/retrieve-log',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (responseData.status === 'Success') {
      setLogs(logs.filter(item => item?.id !== deleteId));
      setPagination({ ...pagination, total: pagination.total - 1 });
      setMessage('Success');
    } else {
      setMessage(responseData?.message ? responseData?.message : 'Error');
    }
    setDeleteId(0);
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  }, [message]);

  const paginationOnChange = (changePagination: any) => {
    setPagination(changePagination);
  };

  useEffect(() => {
    getLogs();
  }, [pagination.current]);

  return (
    <>
      <div className='bg-secondary min-height budget-log'>
        <div className='container'>
          <div className='users d-flex justify-content-between align-items-center'>
            <Title size={5} color='black' align='default' fontWeight={700}>
              Budget Log
            </Title>
          </div>
          {!isSpinner ? (
            <div className='users__content'>
              {width > 768 ? (
                <Tables
                  column='isBudgetLog'
                  onDeleteRow={(rowData: any) => handleOnDelete(rowData)}
                  data={logs}
                  onChange={paginationOnChange}
                  isNotCursor
                  pagination={pagination}
                />
              ) : (
                <TableMobile
                  column='isBudgetLog'
                  onDeleteRow={(rowData: any) => handleOnDelete(rowData)}
                  data={logs}
                  onChange={paginationOnChange}
                  isNotCursor
                  pagination={pagination}
                />
              )}
            </div>
          ) : (
            <div className='mt-20'>
              <Spinner />
            </div>
          )}
        </div>
        <ModalComponent
          visible={deleteId !== 0}
          onCancel={() => setDeleteId(0)}
          type='delete'
          title='Error / Delete '
          text='This is place holder text. The basic dialog for modals should contain only valuable and relevant information. Simplify dialogs by removing unnecessary elements or content that does not support user tasks. If you find that the number of required elements for your design are making the dialog excessively large, then try a different design solution. '
          onConfirm={() => handleConfirmDelete()}
        />
      </div>
      {message && (
        <Feedback
          message={message}
          type={message === 'Success' ? 'success' : 'error'}
          theme='light'
          isGlobal
        />
      )}
    </>
  );
};

export default BudgetLog;
