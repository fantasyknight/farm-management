import React from 'react';
import moment from 'moment';

import { IList } from '../../../types/basicComponentsTypes';
import { IFarmData, IOwners } from '../../../store/farms/farms.type';
import { IAutomation } from '../../../store/automation/automation.type';
import randomKey from '../../../util/randomKey';
import amountDays from '../../../util/amountDays';
import toggleSecondMillisecond from '../../../util/toggleSecondMillisecond';

import Tooltip from '../tooltip/Tooltip';
import PositiveNegativeTitle from '../positive-negative-title/PositiveNegativeTitle';
import NameWithPercent from '../name-with-percent/NameWithPercent';
import TagComponent from '../tag/Tag';
import InterestGrowth from '../tables-card/InterestGrowth';
import Subtitle from '../subtitle/Subtitle';

const useColumns = (column: string) => {
  const dataColumns = {
    isFarms: [
      {
        title: 'Farm',
        dataIndex: 'farm',
        key: 'farm',
        className: 'drag-farm',
        render: (farm: any, data: IFarmData) => (
          <div>
            <p>{data?.name}</p>
            <div>
              <span className='pr-6'>{data?.farm_number}</span>
            </div>
          </div>
        ),
      },
      {
        title: '',
        dataIndex: '',
        key: 'area',
      },
      {
        title: 'Area',
        dataIndex: 'area',
        key: 'area',
        className: 'drag-area',
        render: (area: string) => {
          return <span>{area}ha</span>;
        },
      },
      {
        title: 'Owner',
        dataIndex: 'owners',
        key: 'owners',
        render: (owners: Array<IOwners>) => {
          const tooltipItems: Array<IList> = owners.map(owner => ({
            title: `${owner?.title} - ${owner?.percent}%`,
            id: randomKey(),
          }));
          return (
            <Tooltip content={tooltipItems} position='bottom'>
              <div className='tooltip d-flex'>
                {owners.map(({ title, percent }: any, i: number) => {
                  const key = randomKey();
                  return (
                    <div key={key} className='table__owner'>
                      <NameWithPercent
                        title={title}
                        percent={percent}
                        index={i + 1}
                      />
                    </div>
                  );
                })}
              </div>
            </Tooltip>
          );
        },
      },
    ],
    isFarm: [
      {
        title: 'Line',
        dataIndex: 'line_name',
        key: 'line_name',
        render: (line: string) => <div data-line='line'>{line}</div>,
      },
      {
        title: 'Length',
        dataIndex: 'length',
        key: 'length',
        render: (length: string) => (
          <>
            <span className='pr-6'>{length}</span>
            <span>m</span>
          </>
        ),
      },
      {
        title: 'Date Seed',
        dataIndex: 'seeded_date',
        key: 'seeded_date',
        render: (seededDate: number, data: any) => {
          const dateIdle = amountDays(data?.line_idle);

          return (
            <>
              {data?.group !== null && data?.line_idle === null ? (
                moment(
                  toggleSecondMillisecond(data?.group?.planned_date),
                ).format('DD.MM.YYYY')
              ) : (
                <div className='d-flex flex-wrap'>
                  <span className='min-width-74 pr-4'>Line empty</span>
                  <Subtitle
                    size={5}
                    color='black'
                    align='left'
                    fontWeight={600}
                  >
                    {dateIdle}
                  </Subtitle>
                </div>
              )}
            </>
          );
        },
      },
      {
        title: 'Planned date harvested',
        dataIndex: 'planned_date',
        key: 'planned_date',
        render: (plannedDate: number, data: any) => {
          return (
            <span>
              {data?.group !== null && data?.line_idle === null
                ? moment(
                    data?.group?.assessments?.length
                      ? toggleSecondMillisecond(
                          data?.group?.planned_date_harvest,
                        )
                      : toggleSecondMillisecond(
                          data?.group?.planned_date_harvest_original,
                        ),
                  ).format('DD.MM.YYYY')
                : ''}
            </span>
          );
        },
      },
      {
        title: 'Seed Type',
        dataIndex: 'seed',
        key: 'seed',
        render: (seed: string, data: any) => (
          <span>
            {data?.group !== null && data?.line_idle === null
              ? data?.group?.seed
              : ''}
          </span>
        ),
      },
      {
        title: 'Income per meter',
        dataIndex: 'profit_per_meter',
        key: 'profit_per_meter',
        render: (profitMeter: number, data: any) => (
          <span>
            {data?.group !== null && data?.line_idle === null
              ? data?.group?.profit_per_meter
              : ''}
          </span>
        ),
      },
      {
        title: 'Condition',
        dataIndex: 'condition',
        key: 'condition',
        render: (condition: string, data: any) =>
          data?.group !== null && data?.line_idle === null ? (
            <PositiveNegativeTitle isColor={data?.group?.color}>
              {data?.group?.condition}
            </PositiveNegativeTitle>
          ) : (
            ''
          ),
      },
    ],
    isLine: [
      {
        title: 'Date of assessment',
        dataIndex: 'date_assessment',
        key: 'date_assessment',
        render: (date: any, data: any) => {
          return (
            <span>
              {moment(toggleSecondMillisecond(date)).format('DD.MM.YYYY')}
            </span>
          );
        },
      },
      {
        title: 'Color',
        dataIndex: 'color',
        key: 'color',
        render: (color: string) => (
          <span className='first-letter-upper'>{color}</span>
        ),
      },
      {
        title: 'Condition min',
        dataIndex: 'condition_min',
        key: 'condition_min',
        render: (date: any) => <span>{date}</span>,
      },
      {
        title: 'Condition Max',
        dataIndex: 'condition_max',
        key: 'condition_max',
      },
      {
        title: 'Condition average',
        dataIndex: 'condition_avg',
        key: 'condition_avg',
      },
      {
        title: 'Condition Score',
        dataIndex: 'condition_score',
        key: 'condition_score',
      },
      {
        title: 'Blues',
        dataIndex: 'blues',
        key: 'blues',
      },
      {
        title: 'Tonnes',
        dataIndex: 'tones',
        key: 'tones',
      },
      {
        title: 'Planned harvest date',
        dataIndex: 'planned_date_harvest',
        key: 'planned_date_harvest',
        render: (date: any) => (
          <span>
            {moment(toggleSecondMillisecond(date)).format('DD.MM.YYYY')}
          </span>
        ),
      },
    ],
    isUsers: [
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Full Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',

        className: 'user-status',
        render: (status: string) => {
          return (
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
          );
        },
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
      },
    ],
    isBudget: [
      {
        title: 'Farm',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Total length',
        dataIndex: 'totalLength',
        key: 'totalLength',
        render: (data: any) => (
          <div className='d-flex align-items-center'>
            <div className='pr-6'>{data.value}</div>
            {data.interest !== undefined && (
              <InterestGrowth isGrow={data.isGrow} interest={data.interest} />
            )}
          </div>
        ),
      },
      {
        title: 'Total seeding cost',
        dataIndex: 'totalSeedingCost',
        key: 'totalSeedingCost',
        render: (data: any) => (
          <div className='d-flex align-items-center'>
            <div className='pr-6'>${data.value}</div>
            {data.interest !== undefined && (
              <InterestGrowth isGrow={data.isGrow} interest={data.interest} />
            )}
          </div>
        ),
      },
      {
        title: 'Total maintenance cost',
        dataIndex: 'totalMaintenanceCost',
        key: 'totalMaintenanceCost',
        render: (data: any) => (
          <div className='d-flex align-items-center'>
            <div className='pr-6'>${data.value}</div>
            {data.interest !== undefined && (
              <InterestGrowth isGrow={data.isGrow} interest={data.interest} />
            )}
          </div>
        ),
      },
      {
        title: 'Total harvest tonnes',
        dataIndex: 'totalHarvestTonnes',
        key: 'totalHarvestTonnes',
        render: (data: any) => (
          <div className='d-flex align-items-center'>
            <div className='pr-6'>{data.value}</div>
            {data.interest !== undefined && (
              <InterestGrowth isGrow={data.isGrow} interest={data.interest} />
            )}
          </div>
        ),
      },
      {
        title: 'Total harvest income',
        dataIndex: 'totalHarvestIncome',
        key: 'totalHarvestIncome',
        render: (data: any) => (
          <div className='d-flex align-items-center'>
            <div className='pr-6'>${data.value}</div>
            {data.interest !== undefined && (
              <InterestGrowth isGrow={data.isGrow} interest={data.interest} />
            )}
          </div>
        ),
      },
    ],
    isBudgetLine: [
      {
        title: '',
        dataIndex: 'default',
        key: 'default',
        width: '48px',
      },
      {
        title: 'Line',
        dataIndex: 'line_name',
        key: 'line_name',
      },
      {
        title: 'Length',
        dataIndex: 'length',
        key: 'length',
        render: (data: any) => (
          <div className='d-flex align-items-center'>
            <div className='pr-6'>{data.value}</div>
            {data.interest !== undefined && (
              <InterestGrowth isGrow={data.isGrow} interest={data.interest} />
            )}
          </div>
        ),
      },
      {
        title: 'Seeding cost',
        dataIndex: 'seedingCost',
        key: 'seedingCost',
        render: (data: any) => (
          <div className='d-flex align-items-center'>
            <div className='pr-6'>${data.value}</div>
            {data.interest !== undefined && (
              <InterestGrowth isGrow={data.isGrow} interest={data.interest} />
            )}
          </div>
        ),
      },
      {
        title: 'Maintenance cost',
        dataIndex: 'maintenanceCost',
        key: 'maintenanceCost',
        render: (data: any) => (
          <div className='d-flex align-items-center'>
            <div className='pr-6'>${data.value}</div>
            {data.interest !== undefined && (
              <InterestGrowth isGrow={data.isGrow} interest={data.interest} />
            )}
          </div>
        ),
      },
      {
        title: 'Harvest tonnes',
        dataIndex: 'harvestTonnes',
        key: 'harvestTonnes',
        render: (data: any) => (
          <div className='d-flex align-items-center'>
            <div className='pr-6'>{data.value}</div>
            {data.interest !== undefined && (
              <InterestGrowth isGrow={data.isGrow} interest={data.interest} />
            )}
          </div>
        ),
      },
      {
        title: 'Harvest income',
        dataIndex: 'harvestIncome',
        key: 'harvestIncome',
        render: (data: any) => (
          <div className='d-flex align-items-center'>
            <div className='pr-6'>${data.value}</div>
            {data.interest !== undefined && (
              <InterestGrowth isGrow={data.isGrow} interest={data.interest} />
            )}
          </div>
        ),
      },
    ],
    isBudgetLog: [
      {
        title: 'Farm',
        dataIndex: 'farm_name',
        key: 'farm_name',
      },
      {
        title: 'Line',
        dataIndex: 'line_name',
        key: 'line_name',
      },
      {
        title: 'Type',
        dataIndex: 'type_human',
        key: 'type_human',
      },
      {
        title: 'Change',
        dataIndex: 'change',
        key: 'change',
        render: (data: any) => (
          <span>
            {data.old} &#x2192;{' '}
            <span className='font-weight-600'>{data.new}</span>
          </span>
        ),
      },
      {
        title: 'User',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (data: any) => (
          <span>{moment(Number(data) * 1000).format('DD.MM.YYYY')}</span>
        ),
      },
    ],
    isAutomation: [
      {
        title: '',
        dataIndex: 'id',
        key: 'id',
        render: (id: number) => (
          <>
            <span className='mr-10'>{id}</span>
            <span className='ml-3'>If</span>
          </>
        ),
      },
      {
        title: 'Condition',
        dataIndex: 'condition',
        key: 'condition',
        render: (condition: string) => (
          <>
            <span className='mr-10'>{condition}</span>
            <span>Is</span>
          </>
        ),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (action: string) => (
          <>
            <span className='mr-10'>{action}</span>
            <span>Then</span>
          </>
        ),
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        render: (time: number, row: IAutomation) => {
          if (time === 0) {
            return <span>At the day</span>;
          }
          if (time > 0) {
            return <span>{`${row.time} ${row.unit}(s) After`}</span>;
          }
          return <span>{`${-row.time} ${row.unit}(s) Before`}</span>;
        },
      },
      {
        title: 'Outcome',
        dataIndex: 'outcome',
        key: 'outcome',
        render: (outcome: any) => (
          <div className='d-flex'>
            <div className='mr-15 tx-left' style={{ width: 80 }}>
              Create Task
            </div>
            <div
              className='d-flex flex-direction-col tx-left'
              style={{ flex: 1 }}
            >
              <div>
                <span>Title:</span>
                <span>{outcome.title}</span>
              </div>
              <div>
                <span>Desc:</span>
                <span>
                  {outcome.description.length >= 70
                    ? `${outcome.description.slice(0, 70)}...`
                    : outcome.description}
                </span>
              </div>
            </div>
          </div>
        ),
      },
    ],
  };

  if (column) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return dataColumns[column];
  }

  return dataColumns.isUsers;
};

export default useColumns;
