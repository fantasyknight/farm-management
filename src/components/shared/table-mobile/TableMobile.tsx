import React, { useMemo, FC, useRef, useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Collapse, Pagination } from 'antd';
import classNames from 'classnames';

import { IRootState } from '../../../store/rootReducer';
import {
  deleteItems,
  editAssessment,
  editLine,
} from '../../../store/farms/farms.actions';
import { isModal } from '../../../store/ui/ui.actions';
import { IUiState } from '../../../store/ui/ui.type';
import { ProfileState } from '../../../store/profile/profile.type';
import randomKey from '../../../util/randomKey';
import useColumns from '../tables/useColumns';
import useMenuHandler from '../tables/useMenuHandler';

import Caret from '../caret/Caret';
import Subtitle from '../subtitle/Subtitle';
import ModalComponent from '../modal/Modal';
import InputModal from '../modal/InputModal';
import TableMobileLine from './TableMobileLine';
import TableMobileHeader from './TableMobileHeader';
import DropdownMenu from '../dropdown-menu/DropdownMenu';
import TableMobileBudgetLog from './TableModileBudgetLog';
import TableMobileAssessment from './TableMobileAssessment';
import ModalLineForm from '../../farm-modals/ModalLineForm';
import AssessmentModal from '../../farm-modals/AssessmentModal';

interface ITableMobile {
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

const TableMobile: FC<ITableMobile> = memo(
  ({
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
    const { Panel } = useMemo(() => Collapse, []);

    const handleOnChange = (page: number, pageSize: number | undefined) => {
      if (onChange) {
        onChange({
          current: page,
          pageSize: pageSize as number,
          total: pagination?.total,
        });
      }
    };

    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams<{ idLine: string }>();

    const infoModalData = useRef('');
    const editModalData = useRef({});
    const currentColumn = useColumns(column);
    const { redirectToFarm, redirectToLine } = useMenuHandler();
    const [infoModal, setInfoModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editLineModal, setEditLineModal] = useState(false);

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
      if (!d) {
        infoModalData.current = 'No comments yet';
      } else {
        infoModalData.current = d;
      }

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        redirectToFarm(dataRow.id);
      }

      if (column === 'isFarm') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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

    const dottedField = useMemo(() => {
      const dotted = {
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
      return dotted;
    }, [hideDots]);

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
          onClick={showInfoModal.bind(null, comment)}
        >
          View
        </div>
      ),
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
      if (column === 'isLine' || column === 'isBudgetLog') {
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

    useEffect(() => {
      const currentColumns = changeColumns();
      setColumns(currentColumns);
    }, [hideDots]);

    return (
      <>
        <div className='table-mobile'>
          {data?.length ? (
            <>
              {isHaveChild ? (
                <Collapse
                  expandIcon={(props: any) => (
                    <div>
                      <Caret
                        color='#131523'
                        direction={props.isActive ? 'top' : 'bottom'}
                        fontWeight='big'
                      />
                    </div>
                  )}
                >
                  {data?.map(farm => {
                    return (
                      <Panel
                        header={
                          <TableMobileHeader
                            data={farm}
                            dotMenuField={dottedField}
                          />
                        }
                        key={randomKey()}
                      >
                        {farm?.lines?.length ? (
                          <>
                            <TableMobile column='isFarm' data={farm?.lines} />
                          </>
                        ) : (
                          <div className='table-mobile__not-data'>
                            <Subtitle
                              size={4}
                              color='black-5'
                              align='left'
                              fontWeight={400}
                            >
                              No data available
                            </Subtitle>
                          </div>
                        )}
                      </Panel>
                    );
                  })}
                </Collapse>
              ) : (
                <>
                  {data?.map(line => {
                    if (column === 'isFarm') {
                      return (
                        <TableMobileLine
                          data={line}
                          dotMenuField={dottedField}
                          isRedirect
                          column={column}
                          key={randomKey()}
                        />
                      );
                    }
                    if (column === 'isLine') {
                      return (
                        <TableMobileAssessment
                          data={line}
                          dotMenuField={dottedField}
                          key={randomKey()}
                          hideDots
                        />
                      );
                    }
                    if (column === 'isBudgetLog') {
                      return (
                        <TableMobileBudgetLog
                          data={line}
                          dotMenuField={dottedField}
                          key={randomKey()}
                        />
                      );
                    }

                    return '';
                  })}
                  {column === 'isBudgetLog' && (
                    <div className='w-100 pb-24 d-flex justify-content-end'>
                      <Pagination
                        current={pagination?.current}
                        total={pagination?.total}
                        pageSize={pagination?.pageSize}
                        onChange={handleOnChange}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className='table-mobile__not-data'>
              <Subtitle size={4} color='black-5' align='left' fontWeight={400}>
                No data available
              </Subtitle>
            </div>
          )}
        </div>
        <ModalComponent
          visible={infoModal}
          onCancel={hideInfoModal}
          type=''
          title='Comment'
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
  },
);

export default TableMobile;
