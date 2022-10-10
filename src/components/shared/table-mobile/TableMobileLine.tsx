import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';

import Subtitle from '../subtitle/Subtitle';
import amountDays from '../../../util/amountDays';
import toggleSecondMillisecond from '../../../util/toggleSecondMillisecond';
import PositiveNegativeTitle from '../positive-negative-title/PositiveNegativeTitle';

import './styles.scss';

interface ITableMobileLine {
  data?: any;
  dotMenuField?: any;
  column?: string;
  hideDots?: boolean | undefined;
  isRedirect?: boolean | undefined;
}

const TableMobileLine: FC<ITableMobileLine> = ({
  data,
  dotMenuField,
  column,
  hideDots,
  isRedirect,
}) => {
  const history = useHistory();

  const handleCLick = () => {
    if (isRedirect) {
      const url =
        data?.farm_id && data?.id
          ? `/farms/${data?.farm_id}/${data?.id}`
          : '/farms';
      history.push(url);
    }
  };

  return (
    <div
      className={classNames('table-mobile__card', {
        'table-mobile__card--cursor': isRedirect,
      })}
      onKeyDown={() => undefined}
      onClick={handleCLick}
    >
      <div
        className={classNames('table-mobile__card-dots', {
          'hide-element': hideDots,
        })}
      >
        {dotMenuField?.render(data)}
      </div>
      <div className='d-flex justify-content-between align-items-center'>
        <Subtitle size={5} color='black-3' align='left' fontWeight={600}>
          Line - {data?.line_name}
        </Subtitle>
      </div>
      <div className='pt-16'>
        <div className='d-flex pb-23'>
          <div className='flex-basis-50'>
            <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
              Length
            </Subtitle>
            <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
              <>
                <span className='pr-6'>{`${data?.length}`}</span>
                <span>m</span>
              </>
            </Subtitle>
          </div>
          <div className='flex-basis-50 ml-24'>
            <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
              Date seed
            </Subtitle>
            <>
              {column === 'isLine' && (
                <>
                  {data?.planned_date
                    ? moment(
                        toggleSecondMillisecond(data?.planned_date),
                      ).format('DD.MM.YYYY')
                    : '-'}
                </>
              )}
              {(column === 'isFarms' || column === 'isFarm') && (
                <>
                  {data?.group !== null && data?.line_idle === null ? (
                    <Subtitle
                      size={5}
                      color='black-5'
                      align='left'
                      fontWeight={400}
                    >
                      {moment(
                        toggleSecondMillisecond(data?.group?.planned_date),
                      ).format('DD.MM.YYYY')}
                    </Subtitle>
                  ) : (
                    <div className='d-flex flex-wrap'>
                      <Subtitle
                        size={5}
                        color='black-5'
                        align='left'
                        fontWeight={400}
                        className='pr-4'
                      >
                        Line empty
                      </Subtitle>
                      <Subtitle
                        size={5}
                        color='black-5'
                        align='left'
                        fontWeight={600}
                      >
                        {amountDays(data?.line_idle)}
                      </Subtitle>
                    </div>
                  )}
                </>
              )}
            </>
          </div>
        </div>

        <div className='d-flex pb-23'>
          <div className='flex-basis-50'>
            <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
              Planned date harvested
            </Subtitle>
            <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
              {column === 'isLine' && (
                <>
                  {data?.planned_date_harvest
                    ? moment(
                        data?.assessments?.length
                          ? toggleSecondMillisecond(data?.planned_date_harvest)
                          : toggleSecondMillisecond(
                              data?.planned_date_harvest_original,
                            ),
                      ).format('DD.MM.YYYY')
                    : '-'}
                </>
              )}

              {(column === 'isFarms' || column === 'isFarm') && (
                <>
                  {data?.group !== null && data?.line_idle === null
                    ? moment(
                        data?.group?.assessments?.length
                          ? toggleSecondMillisecond(data?.planned_date_harvest)
                          : toggleSecondMillisecond(
                              data?.planned_date_harvest_original,
                            ),
                      ).format('DD.MM.YYYY')
                    : '-'}
                </>
              )}
            </Subtitle>
          </div>
          <div className='flex-basis-50 ml-24'>
            <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
              Seed type
            </Subtitle>
            <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
              {column === 'isLine' && <>{data?.seed ? data.seed : '-'}</>}

              {(column === 'isFarms' || column === 'isFarm') && (
                <>
                  {data?.group !== null && data?.line_idle === null
                    ? data?.group?.profit_per_meter
                    : '-'}
                </>
              )}
            </Subtitle>
          </div>
        </div>

        <div className='d-flex'>
          <div className='flex-basis-50 '>
            <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
              Income per meter
            </Subtitle>
            <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
              {column === 'isLine' && (
                <>{data?.profit_per_meter ? data.profit_per_meter : '-'}</>
              )}
              {(column === 'isFarms' || column === 'isFarm') && (
                <>
                  {data?.group !== null && data?.line_idle === null
                    ? data?.group?.profit_per_meter
                    : '-'}
                </>
              )}
            </Subtitle>
          </div>
          <div className='flex-basis-50 ml-24'>
            <Subtitle size={3} color='black-2' align='left' fontWeight={400}>
              Condition
            </Subtitle>
            <Subtitle size={5} color='black-5' align='left' fontWeight={400}>
              {column === 'isLine' && (
                <>
                  {data?.condition ? (
                    <PositiveNegativeTitle isColor={data?.color}>
                      {data?.condition}
                    </PositiveNegativeTitle>
                  ) : (
                    '-'
                  )}
                </>
              )}
              {(column === 'isFarms' || column === 'isFarm') && (
                <>
                  {data?.group !== null && data?.line_idle === null ? (
                    <PositiveNegativeTitle isColor={data?.group?.color}>
                      {data?.group?.condition}
                    </PositiveNegativeTitle>
                  ) : (
                    '-'
                  )}
                </>
              )}
            </Subtitle>
          </div>
        </div>

        {column === 'isLine' && (
          <>
            <div className='d-flex pt-23 pb-23'>
              <div className='flex-basis-50 '>
                <Subtitle
                  size={3}
                  color='black-2'
                  align='left'
                  fontWeight={400}
                >
                  Drop
                </Subtitle>
                <Subtitle
                  size={5}
                  color='black-5'
                  align='left'
                  fontWeight={400}
                >
                  {data?.drop ? `${data.drop} m` : '-'}
                </Subtitle>
              </div>
              <div className='flex-basis-50 ml-24'>
                <Subtitle
                  size={3}
                  color='black-2'
                  align='left'
                  fontWeight={400}
                >
                  Spat Size
                </Subtitle>
                <Subtitle
                  size={5}
                  color='black-5'
                  align='left'
                  fontWeight={400}
                >
                  {data?.spat_size ? `${data.spat_size} mm` : '-'}
                </Subtitle>
              </div>
            </div>
            <div className='d-flex pb-23'>
              <div className='flex-basis-50 '>
                <Subtitle
                  size={3}
                  color='black-2'
                  align='left'
                  fontWeight={400}
                >
                  Submersion
                </Subtitle>
                <Subtitle
                  size={5}
                  color='black-5'
                  align='left'
                  fontWeight={400}
                >
                  {data?.submersion ? `${data.submersion} m` : '-'}
                </Subtitle>
              </div>
              <div className='flex-basis-50 ml-24'>
                <Subtitle
                  size={3}
                  color='black-2'
                  align='left'
                  fontWeight={400}
                >
                  Spacing
                </Subtitle>
                <Subtitle
                  size={5}
                  color='black-5'
                  align='left'
                  fontWeight={400}
                >
                  {data?.spacing ? `${data.spacing} mm` : '-'}
                </Subtitle>
              </div>
            </div>
            <div className='d-flex'>
              <div className='flex-basis-50 '>
                <Subtitle
                  size={3}
                  color='black-2'
                  align='left'
                  fontWeight={400}
                >
                  Density
                </Subtitle>
                <Subtitle
                  size={5}
                  color='black-5'
                  align='left'
                  fontWeight={400}
                >
                  {data?.density ? `${data.density}` : '-'}
                </Subtitle>
              </div>
              <div className='flex-basis-50 ml-24'>
                <Subtitle
                  size={3}
                  color='black-2'
                  align='left'
                  fontWeight={400}
                >
                  Floats
                </Subtitle>
                <Subtitle
                  size={5}
                  color='black-5'
                  align='left'
                  fontWeight={400}
                >
                  {data?.floats ? `${data.floats}` : '-'}
                </Subtitle>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TableMobileLine;
