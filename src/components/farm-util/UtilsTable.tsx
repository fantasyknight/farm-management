import React, { FC, useState, useEffect } from 'react';
import { Table } from 'antd';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Spinner, Title, Button, DropdownMenu } from '../shared';
import ModalUtil from './ModalUtil';

import { IRootState } from '../../store/rootReducer';
import { IUtilState, IUtilData } from '../../store/utils/utils.type';
import { IUiState } from '../../store/ui/ui.type';
import {
  getUtilData,
  updateUtil,
  removeUtil,
  addUtil,
} from '../../store/utils/utils.actions';

import './styles.scss';

interface Column {
  title: string;
  dataIndex?: string;
  key: string;
  align?: 'left' | 'right' | 'center' | undefined;
  render: any;
}

const columns: Array<Column> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name: string) => <div data-name='name'>{name}</div>,
  },
];

const defaultUtil: IUtilData = {
  key: 0,
  id: 0,
  name: '',
  type: 'seed',
};

interface IOwnProps {
  category: string;
}

const UtilsTable: FC<IOwnProps> = ({ category }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const cat = `${category.toLowerCase()}s`;

  const [utilModalVisible, setUtilModalVisible] = useState(false);
  const [currentUtil, setCurrentUtil] = useState<IUtilData>(defaultUtil);
  const [currentType, setCurrentType] = useState('');
  const utilData = useSelector<IRootState, IUtilState['seeds']>(
    state => state.utils[cat],
  );
  const isSpinner = useSelector<IRootState, IUiState['isSpinner']>(
    state => state.ui.isSpinner,
  );

  useEffect(() => {
    dispatch(getUtilData(category, history));
  }, []);

  const onDeleteRow = (d: any) => {
    setCurrentUtil(d);
    setCurrentType('delete');
    setUtilModalVisible(true);
  };

  const handleOnEdit = (d: any) => {
    setCurrentUtil(d);
    setCurrentType('edit');
    setUtilModalVisible(true);
  };

  const onModalConfirm = (newValue: string) => {
    if (currentType !== 'delete' && newValue) {
      if (currentType === 'edit') {
        const newUtil = { ...currentUtil, name: newValue };
        dispatch(updateUtil(newUtil, history));
      }
    }
    if (currentType === 'delete') {
      dispatch(removeUtil(currentUtil.id, currentUtil.type, history));
    }
    if (currentType === 'add') {
      dispatch(addUtil(newValue, category, history));
    }
    setUtilModalVisible(false);
  };

  const onModalCancel = () => {
    setUtilModalVisible(false);
  };

  const dottedField: Column = {
    title: '',
    key: 'more',
    align: 'right',
    render: (d: any, allData: any, element: any, isRedirect: any) => {
      return (
        <div className={classNames('wwrap')}>
          <div>
            <DropdownMenu
              data={d}
              column='isUtil'
              onEdit={handleOnEdit}
              onDeleteRow={onDeleteRow}
              type='utils'
              isRedirect={isRedirect}
            />
          </div>
        </div>
      );
    },
  };

  const cols = [...columns, dottedField];
  return (
    <>
      <div className='d-flex mb-16 align-items-center justify-content-between'>
        <Title
          className='mb-16'
          size={6}
          color='black-3'
          align='default'
          fontWeight={500}
        >
          {category} list
        </Title>
      </div>
      {!isSpinner && (
        <>
          <div className='d-flex white-card pt-12 pl-16 mb-8'>
            <div className='d-flex align-items-center'>
              <Button
                color='blue'
                size={3}
                width='small'
                type='fill'
                onClick={() => {
                  setCurrentUtil(defaultUtil);
                  setCurrentType('add');
                  setUtilModalVisible(true);
                }}
              >
                Add {category}
              </Button>
            </div>
          </div>
          <Table
            scroll={{}}
            className={classNames(`table table--units`, {
              'table--is__shild': false,
              'table--is__cursor': true,
            })}
            pagination={false}
            columns={cols}
            dataSource={utilData}
          />
        </>
      )}
      {isSpinner && <Spinner />}
      <ModalUtil
        visible={utilModalVisible}
        defaultValue={currentType === 'add' ? '' : currentUtil.name}
        type={currentType}
        onCancel={onModalCancel}
        onConfirm={onModalConfirm}
        title={category}
      />
    </>
  );
};

export default UtilsTable;
