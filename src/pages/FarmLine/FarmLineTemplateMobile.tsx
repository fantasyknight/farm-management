import React, { FC } from 'react';
import TableMobileLine from '../../components/shared/table-mobile/TableMobileLine';
import {
  Button,
  Caret,
  DropdownMenu,
  Pen,
  Subtitle,
} from '../../components/shared';
import amountDays from '../../util/amountDays';

interface IFarmLineTemplateMobile {
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
  hideCatchSpatModal: any;
}

const FarmLineTemplateMobile: FC<IFarmLineTemplateMobile> = ({
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
  hideCatchSpatModal,
}) => {
  return (
    <>
      <div className='pt-16 pb-4'>
        <TableMobileLine
          data={{
            ...currentGroup,
            id: lineData?.id,
            farm_id: lineData?.farm_id,
            isRedirectLine: true,
          }}
          dotMenuField={dotMenuField}
          column='isLine'
          hideDots={!permission?.isEdit || currentGroup?.harvest_complete_date}
        />
      </div>
      <div className='white-card pt-16 pl-12 pb-16 pr-12 mb-8'>
        <div className='d-flex justify-content-between'>
          <div className='width-100 d-flex justify-content-between align-items-center  white-card-small pt-3 pb-3'>
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

          {currentGroup?.archive_line === null ? (
            <Button
              color='blue'
              size={0}
              width='default'
              type='bordered'
              className='ml-12'
              iconOnly
              onClick={showEditGoupModal}
              disabled={!isActiveHarvest}
            >
              <Pen />
            </Button>
          ) : (
            <Button
              color='blue'
              size={0}
              width='default'
              type='bordered'
              className='ml-12'
              iconOnly
              onClick={showEditGoupModal}
              disabled
            >
              <Pen />
            </Button>
          )}
        </div>
        <div className='pt-16'>
          {currentGroup?.harvest_complete_date ? (
            <>
              <Button
                color='blue'
                size={1}
                width='wide'
                type='bordered'
                disabled
              >
                Harvest complete
              </Button>
            </>
          ) : (
            <>
              {isActiveHarvest ? (
                <div className='d-flex flex-direction-col'>
                  <Button
                    color='blue'
                    size={1}
                    width='wide'
                    type='fill'
                    onClick={hideEditModalData}
                    disabled={!permission?.isEdit}
                  >
                    Add assessment
                  </Button>
                  <Button
                    color='blue'
                    size={1}
                    width='wide'
                    type='bordered'
                    className='mt-8'
                    onClick={showCompleteModal}
                    disabled={!isActiveHarvest}
                  >
                    Harvest complete
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    color='blue'
                    size={1}
                    width='wide'
                    type='fill'
                    onClick={hideCatchSpatModal}
                    disabled={!permission?.isEdit}
                  >
                    Catch Spat
                  </Button>
                  <Button
                    className='mt-10'
                    color='blue'
                    size={1}
                    width='wide'
                    type='fill'
                    onClick={hideSeedModal}
                    disabled={!permission?.isEdit}
                  >
                    Seed the line
                  </Button>
                  <div className='d-flex justify-content-center align-items-center mt-10'>
                    <Subtitle
                      size={5}
                      color='black'
                      align='left'
                      fontWeight={400}
                    >
                      Line empty for
                    </Subtitle>
                    <Subtitle
                      size={5}
                      color='black'
                      align='left'
                      fontWeight={600}
                      className='ml-4 mr-27'
                    >
                      {amountDays(lineData?.line_idle)}
                    </Subtitle>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FarmLineTemplateMobile;
