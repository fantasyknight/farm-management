import React, { FC, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Table, Modal } from 'antd';
import classNames from 'classnames';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import { IUiState } from '../../../store/ui/ui.type';
import { IRootState } from '../../../store/rootReducer';
import { ProfileState } from '../../../store/profile/profile.type';
import {
  editLine,
  editAssessment,
  deleteItems,
} from '../../../store/farms/farms.actions';
import { isModal } from '../../../store/ui/ui.actions';
import useColumns from './useColumns';
import useMenuHandler from './useMenuHandler';

import ModalComponent from '../modal/Modal';
import InputModal from '../modal/InputModal';
import CaretDownIcon from '../CaretDownIcon';
import DropdownMenu from '../dropdown-menu/DropdownMenu';
import ModalLineForm from '../../farm-modals/ModalLineForm';
import AssessmentModal from '../../farm-modals/AssessmentModal';

import './styles.scss';

interface ITables {
  data: Array<any>;
  column: string;
  isTableChild?: boolean;
  isHaveChild?: boolean;
  isActivate?: boolean;
  onDeleteRow?: (data: any) => void;
  onDeactivate?: (data: any) => void;
  onActivateUser?: (data: any) => void;
  isNotCursor?: boolean | undefined;
  onChange?: (pagination: any) => void;
  pagination?: { current: number; pageSize: number; total: number };
  hideDots?: boolean | undefined;
}

interface IImage {
  photo: string;
}

interface IGalleryImage {
  original: string;
  thumbnail: string;
}

const Tables: FC<ITables> = ({
  data,
  column, // isFarms or isFarm or isLine
  isTableChild,
  isHaveChild,
  onDeleteRow,
  onDeactivate,
  onActivateUser,
  isNotCursor,
  onChange,
  pagination,
  hideDots,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams<{ idLine: string }>();

  const infoModalData = useRef('');
  const editModalData = useRef({});
  const currentColumn = useColumns(column);
  const { redirectToFarm, redirectToLine } = useMenuHandler();
  const [infoModal, setInfoModal] = useState(false);
  const [infoModalHeading, setInfoModalHeading] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [editLineModal, setEditLineModal] = useState(false);
  const [asPhotoModalVisible, setAsPhotoModalVisible] = useState(false);
  const [assessPhotos, setAssessPhotos] = useState<Array<IGalleryImage>>([]);

  const profile = useSelector<IRootState, ProfileState['user']>(
    state => state.profile.user,
  );
  const permission = useSelector<IRootState, ProfileState['permission']>(
    state => state.profile.permission,
  );

  const uiModal = useSelector<IRootState, IUiState['isModal']>(
    state => state.ui.isModal,
  );

  const [disableBtn, setDisableBtn] = useState(false);

  const handleOnDelete = async () => {
    setDisableBtn(true);
    await dispatch(deleteItems(history));
    setDisableBtn(false);
  };

  const showInfoModal = (d: any, event: any): void => {
    event.stopPropagation();
    if (!d.comment) {
      infoModalData.current = 'No comments yet';
    } else {
      infoModalData.current = d.comment;
    }

    setInfoModalHeading(d.heading);
    setInfoModal(!infoModal);
  };

  const hideInfoModal = (): void => {
    setInfoModal(!infoModal);
  };

  const hideEditModalData = (): void => {
    setEditModal(!editModal);
  };
  const hideEditLineModalData = (): void => {
    setEditLineModal(!editLineModal);
  };

  const redirectTo = (dataRow: any): void => {
    if (column === 'isFarms') {
      redirectToFarm(dataRow.id);
    }

    if (column === 'isFarm') {
      redirectToLine(dataRow.farm_id, dataRow.id);
    }
  };

  const handleOnEdit = (d: any, col: string | undefined) => {
    editModalData.current = d;
    if (col === 'isFarm') {
      setEditLineModal(!editLineModal);
    }

    if (col === 'isLine') {
      setEditModal(!editModal);
    }

    if (column === 'isUsers') {
      history.push(`/users/edit-user/${d.id}`);
    }
  };

  const dottedField = {
    title: '',
    key: 'more',
    align: 'right',
    render: (d: any, allData: any, element: any, isRedirect: any) => {
      return (
        <div
          className={classNames('wwrap', {
            'hide-element': hideDots,
          })}
        >
          <div
            className={classNames({
              'hide-element': !permission?.isEdit && column === 'isLine',
            })}
          >
            <DropdownMenu
              data={d}
              column={column}
              onEdit={handleOnEdit}
              onDeleteRow={onDeleteRow}
              onDeactivate={onDeactivate}
              onActivateUser={onActivateUser}
              type='farms'
              lineId={params?.idLine}
              isRedirect={isRedirect}
            />
          </div>
        </div>
      );
    },
  };

  const dotMenuField = {
    title: '',
    key: 'more',
    align: 'right',
    render: (d: any) => (
      <>
        {d?.role !== 'owner' &&
          profile.role !== 'user' &&
          profile.email !== d.email && (
            <DropdownMenu
              data={d}
              column={column}
              onEdit={handleOnEdit}
              onDeleteRow={onDeleteRow}
              onDeactivate={onDeactivate}
              onActivateUser={onActivateUser}
              type='farms'
            />
          )}
      </>
    ),
  };

  const adminMenuField = {
    title: '',
    key: 'more',
    align: 'right',
    render: (d: any) => (
      <>
        {d?.role === 'user' && (
          <DropdownMenu
            data={d}
            column={column}
            onEdit={handleOnEdit}
            onDeleteRow={onDeleteRow}
            onDeactivate={onDeactivate}
            onActivateUser={onActivateUser}
            type='farms'
          />
        )}
      </>
    ),
  };

  const viewField = {
    title: 'Comment',
    dataIndex: 'comment',
    key: 'comment',
    render: (comment: string) => (
      <div
        className='btn__modal'
        onKeyDown={() => undefined}
        onClick={showInfoModal.bind(null, { comment, heading: 'Comment' })}
      >
        View
      </div>
    ),
  };

  const photoField = {
    title: 'Photo',
    dataIndex: 'images',
    key: 'images',
    render: (images: Array<IImage>) => {
      if (images.length === 0) {
        return (
          <div
            className='btn__modal'
            onKeyDown={() => undefined}
            onClick={showInfoModal.bind(null, {
              comment: 'No photos attached',
              heading: 'Photo',
            })}
          >
            View
          </div>
        );
      }
      return (
        <div
          className='btn__modal'
          onKeyDown={() => undefined}
          onClick={() => {
            setAsPhotoModalVisible(true);
            setAssessPhotos(
              images.map(image => {
                return {
                  original: `${process.env.REACT_APP_API_URL}uploads/${image.photo}`,
                  thumbnail: `${process.env.REACT_APP_API_URL}uploads/${image.photo}`,
                };
              }),
            );
          }}
        >
          View
        </div>
      );
    },
  };

  const [triggerEdit, setTriggerEdit] = useState(false);

  const editOnConfirm = (assesmentData: any) => {
    setEditModal(!editModal);
    dispatch(editAssessment(assesmentData, params.idLine, history));
  };

  const editLineOnConfirm = (lineData: any) => {
    setEditLineModal(!editLineModal);
    dispatch(editLine(lineData, history));
  };

  const changeColumns = () => {
    if (column === 'isLine') {
      return [...currentColumn, viewField, photoField, dottedField];
    }
    if (column === 'isBudgetLog') {
      return [...currentColumn, viewField, dottedField];
    }
    if (column === 'isUsers' && profile.role !== 'admin') {
      return [...currentColumn, dotMenuField];
    }
    if (column === 'isUsers' && profile.role === 'admin') {
      return [...currentColumn, adminMenuField];
    }

    return [...currentColumn, dottedField];
  };

  const [columns, setColumns] = useState(() => changeColumns());
  const [scroll] = useState(() => {
    return column === 'isLine' ? { x: 530 } : {};
  });

  useEffect(() => {
    const currentColumns = changeColumns();
    setColumns(currentColumns);
  }, [hideDots]);

  return (
    <>
      {isHaveChild ? (
        <Table
          className={classNames(`table table--${column}`, {
            'table--is__shild': isTableChild,
          })}
          pagination={false}
          columns={columns}
          dataSource={data}
          onRow={(dataRow: any) => ({
            onClick: redirectTo.bind(null, dataRow),
          })}
          expandable={{
            expandedRowRender: (d: any) => {
              return <Tables column='isFarm' data={d.lines} isTableChild />;
            },
            expandIcon: ({ onExpand, record }) => (
              <div
                className='pt-20 pb-20'
                onKeyDown={() => undefined}
                onClick={event => {
                  event.stopPropagation();
                  onExpand(record, event);
                }}
              >
                <CaretDownIcon />
              </div>
            ),
          }}
        />
      ) : (
        <Table
          scroll={scroll}
          className={classNames(`table table--${column}`, {
            'table--is__shild': isTableChild,
            'table--is__cursor': isNotCursor,
          })}
          pagination={pagination === undefined ? false : pagination}
          columns={columns}
          dataSource={data}
          onRow={(dataRow: any) => ({
            onClick: redirectTo.bind(null, dataRow),
          })}
          onChange={onChange}
        />
      )}
      <ModalComponent
        visible={infoModal}
        onCancel={hideInfoModal}
        type=''
        title={infoModalHeading}
        text={infoModalData.current}
      />
      {editModal && (
        <InputModal
          visible={editModal}
          onCancel={hideEditModalData}
          type='confirm'
          title='Edit assessment'
          onConfirm={() => setTriggerEdit(!triggerEdit)}
        >
          <AssessmentModal
            data={editModalData.current}
            onConfirm={editOnConfirm}
            trigger={triggerEdit}
            dataLine={data}
          />
        </InputModal>
      )}
      {editLineModal && (
        <InputModal
          visible={editLineModal}
          onCancel={hideEditLineModalData}
          type='confirm'
          title='Edit line details'
          onConfirm={() => setTriggerEdit(!triggerEdit)}
        >
          <ModalLineForm
            data={editModalData.current}
            onConfirm={editLineOnConfirm}
            trigger={triggerEdit}
          />
        </InputModal>
      )}
      {asPhotoModalVisible && (
        <Modal
          title='Assessment Photos'
          centered
          visible={asPhotoModalVisible}
          onOk={() => setAsPhotoModalVisible(false)}
          onCancel={() => setAsPhotoModalVisible(false)}
          width={1000}
        >
          <ImageGallery items={assessPhotos} />
        </Modal>
      )}
      <ModalComponent
        visible={uiModal.activeModal}
        onCancel={() => dispatch(isModal({ activeModal: false }))}
        type='delete'
        title='Error / Delete '
        text={`${uiModal.textModal}`}
        onConfirm={handleOnDelete}
        disabled={disableBtn}
      />
    </>
  );
};

export default Tables;
