import React, { FC } from 'react';
import moment from 'moment';
import classNames from 'classnames';

import {
  BreadcrumbComponent,
  Button,
  Caret,
  DropdownMenu,
  Pen,
  PositiveNegativeTitle,
  Subtitle,
  Title,
} from '../../components/shared';

import toggleSecondMillisecond from '../../util/toggleSecondMillisecond';
import amountDays from '../../util/amountDays';

interface IFarmLineTemplateDesktop {
  lineData: any;
  currentGroup: any;
  dotMenuField: any;
  handleClickPrevGroup: any;
  handleClickNextGroup: any;
  isPrevOrNext: any;
  isActiveHarvest: any;
  permission: any;
  showEditGoupModal: any;
  showCompleteModal: any;
  hideEditModalData: any;
  hideSeedModal: any;
  breadcrumItems: any;
  handleOnEdit: any;
  hideCatchSpatModal: any;
}

const FarmLineTemplateDesktop: FC<IFarmLineTemplateDesktop> = ({
  currentGroup,
  lineData,
  dotMenuField,
  handleClickPrevGroup,
  isPrevOrNext,
  isActiveHarvest,
  permission,
  handleClickNextGroup,
  showEditGoupModal,
  showCompleteModal,
  hideEditModalData,
  hideSeedModal,
  breadcrumItems,
  handleOnEdit,
  hideCatchSpatModal,
}) => {
  return (
    <div>
      <div className='pt-28 pb-28 d-flex justify-content-between align-items-center'>
        <BreadcrumbComponent items={breadcrumItems} />
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex justify-content-between align-items-center white-card-small pt-3 pb-3'>
            <Button
              color='blue'
              size={3}
              width='default'
              type='transparent'
              className='mr-26'
              name='prev'
              onClick={handleClickPrevGroup}
              disabled={isPrevOrNext}
              onlyIconDisabled
            >
              <Caret color='#5A607F' direction='left' />
            </Button>
            <Subtitle
              size={4}
              color='black'
              align='left'
              fontWeight={500}
              disabled={!isActiveHarvest || currentGroup?.name === undefined}
            >
              {isActiveHarvest || currentGroup?.name !== undefined
                ? currentGroup?.season_name
                : 'Empty'}
            </Subtitle>
            <Button
              color='blue'
              size={3}
              width='default'
              type='transparent'
              className='ml-26'
              name='next'
              onClick={handleClickNextGroup}
              disabled={isPrevOrNext}
              onlyIconDisabled
            >
              <Caret color='#5A607F' direction='right' />
            </Button>
          </div>
          {!currentGroup?.harvest_complete_date && permission?.isEdit ? (
            <>
              <Button
                color='blue'
                size={0}
                width='default'
                type='bordered'
                className='ml-8'
                iconOnly
                onClick={showEditGoupModal}
                disabled={!isActiveHarvest}
              >
                <Pen />
              </Button>
              <Button
                color='blue'
                size={1}
                width='middle'
                type='bordered'
                className='ml-16'
                onClick={showCompleteModal}
                disabled={!isActiveHarvest}
              >
                Harvest complete
              </Button>
            </>
          ) : (
            <>
              <Button
                color='blue'
                size={0}
                width='default'
                type='bordered'
                className='ml-8'
                iconOnly
                disabled
              >
                <Pen />
              </Button>
              <Button
                color='blue'
                size={1}
                width='middle'
                type='bordered'
                className='ml-16'
                disabled
              >
                Harvest complete
              </Button>
            </>
          )}
        </div>
      </div>
      <div className='d-flex justify-content-between white-card pt-28 pr-16 pb-28 pl-24 mb-16'>
        <Title size={5} color='black-3' align='default' fontWeight={500}>
          Line {currentGroup?.line_name}
        </Title>
        <div>
          <Subtitle
            size={3}
            color='black'
            align='left'
            fontWeight={400}
            className='mb-4'
          >
            Length
          </Subtitle>
          <Subtitle size={4} color='black' align='left' fontWeight={500}>
            {`${currentGroup?.length} `}m
          </Subtitle>
          <Subtitle
            size={3}
            color='black'
            align='left'
            fontWeight={400}
            className='mb-4 mt-28'
          >
            Drop
          </Subtitle>
          <Subtitle size={4} color='black' align='left' fontWeight={500}>
            {currentGroup?.drop ? `${currentGroup?.drop} m` : '-'}
          </Subtitle>
        </div>
        <div>
          <Subtitle
            size={3}
            color='black'
            align='left'
            fontWeight={400}
            className='mb-4'
          >
            Date seeded
          </Subtitle>
          <Subtitle size={4} color='black' align='left' fontWeight={500}>
            {currentGroup?.planned_date
              ? moment(
                  toggleSecondMillisecond(currentGroup?.planned_date),
                ).format('DD.MM.YYYY')
              : '-'}
          </Subtitle>
          <Subtitle
            size={3}
            color='black'
            align='left'
            fontWeight={400}
            className='mb-4 mt-28'
          >
            Spat Size
          </Subtitle>
          <Subtitle size={4} color='black' align='left' fontWeight={500}>
            {currentGroup?.spat_size ? `${currentGroup?.spat_size} mm` : '-'}
          </Subtitle>
        </div>
        <div>
          <Subtitle
            size={3}
            color='black'
            align='left'
            fontWeight={400}
            className='mb-4'
          >
            {currentGroup?.harvest_complete_date
              ? 'Harvest Date'
              : 'Planned date harvested'}
          </Subtitle>
          <Subtitle size={4} color='black' align='left' fontWeight={500}>
            {currentGroup?.harvest_complete_date &&
              moment(
                toggleSecondMillisecond(currentGroup?.harvest_complete_date),
              ).format('DD.MM.YYYY')}
            {!currentGroup?.harvest_complete_date &&
              currentGroup?.planned_date_harvest &&
              moment(
                currentGroup?.assessments?.length
                  ? toggleSecondMillisecond(currentGroup?.planned_date_harvest)
                  : toggleSecondMillisecond(
                      currentGroup?.planned_date_harvest_original,
                    ),
              ).format('DD.MM.YYYY')}
            {!currentGroup?.harvest_complete_date &&
              !currentGroup?.planned_date_harvest &&
              '-'}
          </Subtitle>
          <Subtitle
            size={3}
            color='black'
            align='left'
            fontWeight={400}
            className='mb-4 mt-28'
          >
            Submersion
          </Subtitle>
          <Subtitle size={4} color='black' align='left' fontWeight={500}>
            {currentGroup?.submersion ? `${currentGroup?.submersion} m` : '-'}
          </Subtitle>
        </div>
        <div>
          <Subtitle
            size={3}
            color='black'
            align='left'
            fontWeight={400}
            className='mb-4'
          >
            Seed type
          </Subtitle>
          <Subtitle size={4} color='black' align='left' fontWeight={500}>
            {currentGroup?.seed ? currentGroup.seed : '-'}
          </Subtitle>
          <Subtitle
            size={3}
            color='black'
            align='left'
            fontWeight={400}
            className='mb-4 mt-28'
          >
            Spacing
          </Subtitle>
          <Subtitle size={4} color='black' align='left' fontWeight={500}>
            {currentGroup?.spacing ? `${currentGroup?.spacing} mm` : '-'}
          </Subtitle>
        </div>
        <div>
          <Subtitle
            size={3}
            color='black'
            align='left'
            fontWeight={400}
            className='mb-4'
          >
            Income per meter
          </Subtitle>
          <Subtitle size={4} color='black' align='left' fontWeight={500}>
            {currentGroup?.profit_per_meter
              ? currentGroup.profit_per_meter
              : '-'}
          </Subtitle>
          <Subtitle
            size={3}
            color='black'
            align='left'
            fontWeight={400}
            className='mb-4 mt-28'
          >
            Density
          </Subtitle>
          <Subtitle size={4} color='black' align='left' fontWeight={500}>
            {currentGroup?.density ? currentGroup?.density : '-'}
          </Subtitle>
        </div>
        <div>
          <Subtitle
            size={3}
            color='black'
            align='left'
            fontWeight={400}
            className='mb-4'
          >
            Condition
          </Subtitle>
          {currentGroup?.condition ? (
            <PositiveNegativeTitle isColor={currentGroup?.color}>
              {currentGroup?.condition}
            </PositiveNegativeTitle>
          ) : (
            '-'
          )}
          <Subtitle
            size={3}
            color='black'
            align='left'
            fontWeight={400}
            className='mb-4 mt-28'
          >
            Floats
          </Subtitle>
          <Subtitle size={4} color='black' align='left' fontWeight={500}>
            {currentGroup?.floats ? currentGroup?.floats : '-'}
          </Subtitle>
        </div>
        <div
          className={classNames({
            'hide-element':
              !permission?.isEdit || currentGroup?.harvest_complete_date,
          })}
        >
          <DropdownMenu
            data={{ ...lineData, isRedirectLine: true }}
            onEdit={handleOnEdit}
            column='isFarm'
          />
        </div>
      </div>
      {!currentGroup.harvest_complete_date && permission?.isEdit && (
        <div className='d-flex justify-content-end white-card pt-12 pr-16 pb-12 mb-8'>
          {isActiveHarvest ? (
            <Button
              color='blue'
              size={1}
              width='middle'
              type='fill'
              onClick={hideEditModalData}
              disabled={!permission?.isEdit}
            >
              Add assessment
            </Button>
          ) : (
            <div className='d-flex align-items-center'>
              <div className='d-flex align-items-center'>
                <Subtitle size={3} color='black' align='left' fontWeight={400}>
                  Line empty for
                </Subtitle>
                <Subtitle
                  size={4}
                  color='black'
                  align='left'
                  fontWeight={600}
                  className='ml-4 mr-27'
                >
                  {amountDays(lineData?.line_idle)}
                </Subtitle>
              </div>
              <Button
                className='mr-8'
                color='blue'
                size={1}
                width='small'
                type='fill'
                onClick={hideCatchSpatModal}
                disabled={!permission?.isEdit}
              >
                Catch Spat
              </Button>
              <Button
                color='blue'
                size={1}
                width='small'
                type='fill'
                onClick={hideSeedModal}
                disabled={!permission?.isEdit}
              >
                Seed the line
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmLineTemplateDesktop;
