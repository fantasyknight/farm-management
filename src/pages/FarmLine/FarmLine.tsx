import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import classNames from 'classnames';

import { IRootState } from '../../store/rootReducer';
import { IFarmState, IHarvest } from '../../store/farms/farms.type';
import { IUiState } from '../../store/ui/ui.type';
import { IBreadcrumb } from '../../types/basicComponentsTypes';
import { ProfileState } from '../../store/profile/profile.type';
import {
  getLineData,
  harvestComplete,
  editLine,
  addAssessment,
  createSeedLine,
  harvestUpdate,
  createCatchSpat,
} from '../../store/farms/farms.actions';
import { useWidth } from '../../util/useWidth';

import {
  Tables,
  DropdownMenu,
  InputModal,
  Spinner,
  TableMobile,
} from '../../components/shared';
import ModalLineForm from '../../components/farm-modals/ModalLineForm';
import SeedLineModal from '../../components/farm-modals/SeedLineModal';
import EditGroupModal from '../../components/farm-modals/EditGroupModal';
import CatchSpatModal from '../../components/farm-modals/CatchSpatModal';
import AssessmentModal from '../../components/farm-modals/AssessmentModal';
import HarvestCompleteModal from '../../components/farm-modals/HarvestCompleteModal';
import FarmLineTemplateDesktop from './FarmLineTemplateDesktop';
import FarmLineTemplateMobile from './FarmLineTemplateMobile';

const FarmLine: FC = (): ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const width = useWidth();
  const params = useParams<{ idFarm: string; idLine: string }>();

  const [currentGroup, setCurrentGroup] = useState<any>({});
  const [allGroup, setAllGroup] = useState<Array<IHarvest>>([]);
  const [isActiveHarvest, setIsActiveHarvest] = useState(false);
  const [isPrevOrNext, setIsPrevOrNext] = useState(false);

  const lineData = useSelector<IRootState, IFarmState['lineData']>(
    state => state.farms.lineData,
  );

  const permission = useSelector<IRootState, ProfileState['permission']>(
    state => state.profile.permission,
  );

  const isSpinner = useSelector<IRootState, IUiState['isSpinner']>(
    state => state.ui.isSpinner,
  );

  // modals

  const editModalData = useRef({});
  const [editModal, setEditModal] = useState(false);
  const [catchSpatModal, setCatchSpatModal] = useState(false);
  const [seedModal, setSeedModal] = useState(false);
  const [editLineModal, setEditLineModal] = useState(false);
  const [triggerEdit, setTriggerEdit] = useState(false);
  const [editGoupModal, setEditGoupModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);

  const showEditGoupModal = () => {
    setEditGoupModal(prev => !prev);
  };
  const showCompleteModal = () => {
    setCompleteModal(prev => !prev);
  };

  const breadcrumItems: IBreadcrumb[] = [
    { link: '/', linkName: 'Overview', id: '456' },
    { link: '/farms', linkName: 'Farms', id: '678' },
    {
      link: `/farms/${params.idFarm}`,
      linkName: `${lineData?.farm_name ? lineData.farm_name : ''}`,
      id: '345',
    },
    {
      link: `/farms/${params.idFarm}/${params.idLine}`,
      linkName: `Line ${lineData?.line_name ? lineData.line_name : ''}`,
      id: '342',
    },
  ];

  const hideCatchSpatModal = () => {
    setCatchSpatModal(!catchSpatModal);
  };

  const hideSeedModal = () => {
    setSeedModal(prev => !prev);
  };

  const hideEditModalData = (): void => {
    setEditModal(!editModal);
  };

  const hideEditLineModalData = (): void => {
    setEditLineModal(!editLineModal);
  };

  const seedOnConfirm = (data: any): void => {
    hideSeedModal();
    dispatch(createSeedLine(data, lineData?.id, history));
  };

  const editOnConfirm = (data: any): void => {
    setEditModal(!editModal);
    dispatch(addAssessment(data, lineData?.id, currentGroup, history));
  };

  const editLineOnConfirm = (data: any): void => {
    setEditLineModal(!editLineModal);
    dispatch(editLine(data, history, true));
  };
  const editGroupOnConfirm = (data: any): void => {
    showEditGoupModal();
    dispatch(harvestUpdate(data, lineData?.id, history));
  };

  const editCatchOnConfirm = (data: any): void => {
    hideCatchSpatModal();
    dispatch(createCatchSpat(data, lineData?.id, history));
  };

  // handlers

  const sortAssessmet = (assessments: any): any => {
    const assessment = assessments
      ?.sort((a: any, b: any) => {
        return a.created_at - b.created_at;
      })
      .reverse();
    return assessment;
  };

  const changeActiveHarvest = (groups: Array<any>): void => {
    if (groups.length) {
      setAllGroup(groups);

      const result = groups.filter((group: any) => {
        return group?.harvest_complete_date === null;
      });

      if (result.length) {
        const assessments = sortAssessmet(result[0]?.assessments);
        setIsActiveHarvest(true);
        setCurrentGroup({
          ...result[0],
          assessments,
          length: lineData?.length,
          line_name: lineData?.line_name,
        });
        setAllGroup(groups);
      } else {
        setIsActiveHarvest(false);
        setCurrentGroup({
          length: lineData?.length,
          line_name: lineData?.line_name,
          harvest_complete_date: null,
        });
        setAllGroup([
          ...groups,
          {
            length: lineData?.length,
            line_name: lineData?.line_name,
            harvest_complete_date: null,
          },
        ]);
      }
    } else {
      setIsActiveHarvest(false);
      setCurrentGroup({
        length: lineData?.length,
        line_name: lineData?.line_name,
        harvest_complete_date: null,
      });
      setAllGroup([]);
    }
  };

  const handleComplete = (data: any) => {
    showCompleteModal();
    dispatch(harvestComplete(data, lineData?.id, history));
  };

  const handleOnEdit = (d: any) => {
    editModalData.current = d;
    setEditLineModal(!editLineModal);
  };

  const handleClickPrevGroup = () => {
    const newD = allGroup
      .filter((group: any) => {
        return group.harvest_complete_date !== null;
      })
      .filter((group: any) => {
        return (
          currentGroup?.harvest_complete_date === null ||
          Number(group?.harvest_complete_date) <
            Number(currentGroup?.harvest_complete_date)
        );
      })
      .sort(
        (a, b) =>
          Number(a?.harvest_complete_date) - Number(b?.harvest_complete_date),
      )
      .reverse();

    if (newD.length) {
      const assessments = sortAssessmet(newD[0]?.assessments);
      const newCurrentGroup = {
        ...newD[0],
        ...newD[0]?.archive_line,
        harvest_complete_date: newD[0].harvest_complete_date,
        color: newD[0].color,
        line_name: lineData?.line_name,
        assessments,
      };
      setCurrentGroup(newCurrentGroup);
    }
  };

  const handleClickNextGroup = () => {
    if (currentGroup?.harvest_complete_date !== null) {
      const groupHarvestIsNull = allGroup.filter((group: any) => {
        return group.harvest_complete_date === null;
      });

      const groupHarvestIsComplete = allGroup.filter((group: any) => {
        return group.harvest_complete_date !== null;
      });

      const newD = groupHarvestIsComplete
        .filter((group: any) => {
          return (
            currentGroup?.harvest_complete_date === null ||
            Number(group?.harvest_complete_date) >
              Number(currentGroup?.harvest_complete_date)
          );
        })
        .sort(
          (a, b) =>
            Number(a?.harvest_complete_date) - Number(b?.harvest_complete_date),
        );

      if (newD.length) {
        const assessments = sortAssessmet(newD[0]?.assessments);
        const newCurrentGroup = {
          ...newD[0],
          ...newD[0]?.archive_line,
          harvest_complete_date: newD[0].harvest_complete_date,
          color: newD[0].color,
          line_name: lineData?.line_name,
          assessments,
        };
        setCurrentGroup(newCurrentGroup);
      } else {
        setCurrentGroup({
          ...groupHarvestIsNull[0],
          length: lineData?.length,
          line_name: lineData?.line_name,
        });
      }
    }
  };

  const validPrevNextBtn = () => {
    let valid = false;
    if (isActiveHarvest === false) {
      valid = true;
    }
    if (isActiveHarvest === true) {
      valid = false;
    }

    if (allGroup.length) {
      valid = false;
    }

    return valid;
  };

  const dotMenuField = {
    render: (data: any) => (
      <div
        className={classNames({
          'hide-element': !permission?.isEdit,
        })}
      >
        <DropdownMenu
          data={data}
          onEdit={handleOnEdit}
          column='isFarm'
          isRedirect={`/farms/${data?.farm_id}`}
        />
      </div>
    ),
  };

  useEffect(() => {
    dispatch(getLineData(params.idLine, history, params.idFarm));
  }, []);

  useEffect(() => {
    if (lineData?.group) {
      changeActiveHarvest(lineData?.group);
    }
  }, [lineData]);

  useEffect(() => {
    const isValidPrevNextBtn = validPrevNextBtn();
    setIsPrevOrNext(isValidPrevNextBtn);
  }, [isActiveHarvest, allGroup]);

  return (
    <div className='h-calc-80 bg-secondary'>
      <div className='container pos-relative'>
        <div className='farms__harvest pb-36'>
          {width <= 768 ? (
            <FarmLineTemplateMobile
              lineData={lineData}
              currentGroup={currentGroup}
              dotMenuField={dotMenuField}
              handleClickPrevGroup={handleClickPrevGroup}
              handleClickNextGroup={handleClickNextGroup}
              showEditGoupModal={showEditGoupModal}
              showCompleteModal={showCompleteModal}
              hideEditModalData={hideEditModalData}
              isPrevOrNext={isPrevOrNext}
              isActiveHarvest={isActiveHarvest}
              permission={permission}
              hideSeedModal={hideSeedModal}
              hideCatchSpatModal={hideCatchSpatModal}
            />
          ) : (
            <FarmLineTemplateDesktop
              lineData={lineData}
              currentGroup={currentGroup}
              dotMenuField={dotMenuField}
              handleClickPrevGroup={handleClickPrevGroup}
              handleClickNextGroup={handleClickNextGroup}
              showEditGoupModal={showEditGoupModal}
              showCompleteModal={showCompleteModal}
              hideEditModalData={hideEditModalData}
              isPrevOrNext={isPrevOrNext}
              isActiveHarvest={isActiveHarvest}
              permission={permission}
              hideSeedModal={hideSeedModal}
              breadcrumItems={breadcrumItems}
              handleOnEdit={handleOnEdit}
              hideCatchSpatModal={hideCatchSpatModal}
            />
          )}
          <div className='width-100'>
            {width > 768 ? (
              <Tables
                column='isLine'
                data={currentGroup.assessments}
                isNotCursor
                hideDots={currentGroup.harvest_complete_date !== null}
              />
            ) : (
              <TableMobile
                column='isLine'
                data={currentGroup.assessments}
                isNotCursor
                hideDots={currentGroup.harvest_complete_date !== null}
              />
            )}
          </div>
        </div>

        {isSpinner && <Spinner position='global' />}
      </div>
      {seedModal && (
        <InputModal
          visible={seedModal}
          onCancel={hideSeedModal}
          type='confirm'
          title='Seed the line'
          onConfirm={() => setTriggerEdit(!triggerEdit)}
          confirmNameBtn='Seed the line'
        >
          <SeedLineModal
            data={{}}
            onConfirm={seedOnConfirm}
            trigger={triggerEdit}
          />
        </InputModal>
      )}
      {editModal && (
        <InputModal
          visible={editModal}
          onCancel={hideEditModalData}
          type='confirm'
          title='Add assessment'
          onConfirm={() => setTriggerEdit(!triggerEdit)}
        >
          <AssessmentModal
            data={{}}
            onConfirm={editOnConfirm}
            trigger={triggerEdit}
            dataLine={currentGroup}
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
      {editGoupModal && (
        <InputModal
          visible={editGoupModal}
          onCancel={showEditGoupModal}
          title='Select Season'
          type='confirm'
          onConfirm={() => setTriggerEdit(!triggerEdit)}
        >
          <EditGroupModal
            data={currentGroup}
            onConfirm={editGroupOnConfirm}
            trigger={triggerEdit}
          />
        </InputModal>
      )}
      {completeModal && (
        <InputModal
          visible={completeModal}
          onCancel={showCompleteModal}
          title='Harvest Complete'
          type='confirm'
          onConfirm={() => setTriggerEdit(!triggerEdit)}
        >
          <HarvestCompleteModal
            data={currentGroup}
            onConfirm={handleComplete}
            trigger={triggerEdit}
          />
        </InputModal>
      )}
      {catchSpatModal && (
        <InputModal
          visible={catchSpatModal}
          onCancel={hideCatchSpatModal}
          title='Catch Spat'
          type='confirm'
          onConfirm={() => setTriggerEdit(!triggerEdit)}
        >
          <CatchSpatModal
            data={currentGroup}
            onConfirm={editCatchOnConfirm}
            trigger={triggerEdit}
          />
        </InputModal>
      )}
    </div>
  );
};

export default FarmLine;
