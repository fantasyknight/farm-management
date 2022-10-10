import React, { useRef, FC, ReactElement, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';
import classNames from 'classnames';

import { IBreadcrumb, IList } from '../types/basicComponentsTypes';
import { ProfileState } from '../store/profile/profile.type';
import { IFarmState } from '../store/farms/farms.type';
import { IRootState } from '../store/rootReducer';
import { IUiState } from '../store/ui/ui.type';
import amountDays from '../util/amountDays';
import { useWidth } from '../util/useWidth';
import randomKey from '../util/randomKey';

import {
  Button,
  Tables,
  TablesCard,
  BreadcrumbComponent,
  Title,
  Subtitle,
  DropdownMenu,
  BgIcon,
  ExpandArrowIcon,
  OwnerIcon,
  ClockIcon,
  Spinner,
  TableMobile,
  DynamicCard,
} from '../components/shared';
import NameWithPercent from '../components/shared/name-with-percent/NameWithPercent';
import Tooltip from '../components/shared/tooltip/Tooltip';
import { getInterest } from '../util/getInterest';
import { IApiFarmCard, IFarmCard } from '../types/apiDataTypes';
import { composeApi } from '../apis/compose';
import { AuthState } from '../store/auth/auth.type';

const Farm: FC = (): ReactElement => {
  const width = useWidth();
  const history = useHistory();
  const dispatch = useDispatch();
  const [generalStats, setGeneralStats] = useState<any[]>([]);
  const params = useParams<{ idFarm: string }>();
  const currentFarm = useRef<undefined | any>({});
  const [isCardsSpinner, setIsCardsSpinner] = useState(false);
  const isSpinner = useSelector<IRootState, IUiState['isSpinner']>(
    state => state.ui.isSpinner,
  );

  const permission = useSelector<IRootState, ProfileState['permission']>(
    state => state.profile.permission,
  );

  const authStore = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );

  const breadcrumItems: IBreadcrumb[] = [
    { link: '/', linkName: 'Overview', id: '456' },
    { link: '/farms', linkName: 'Farms', id: '678' },
    {
      link: `/farms/${params.idFarm}`,
      linkName: `${currentFarm?.current?.name}`,
      id: '345',
    },
  ];

  const getGeneralStats = async () => {
    setIsCardsSpinner(true);
    const responseData = await composeApi(
      {
        data: { farm_id: params.idFarm },
        method: 'POST',
        url: 'api/overview/farm-budget-info',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (responseData?.length) {
      const newGeneralStats = responseData?.map((item: IApiFarmCard) => {
        const interest = getInterest(
          item?.this_year,
          item?.last_year ? item?.last_year : null,
        );
        const general = [
          {
            name: `${item?.name} this year`,
            value: item?.this_year,
            interest,
          },
          {
            name: `${item?.name} last year`,
            value: item?.last_year,
          },
        ];
        return general;
      });
      setGeneralStats(newGeneralStats);
    }
    setIsCardsSpinner(false);
  };

  useEffect(() => {
    getGeneralStats();
  }, []);

  const handleOnEdit = () => {
    history.push(`/farms/farm-edit/${params.idFarm}`);
  };

  const tooltipItems: IList[] = currentFarm?.current?.owners?.map(
    ({ title, percent }: any, i: number) => {
      return {
        title: `${title} - ${percent}%`,
        id: i + 1,
      };
    },
  );

  const isFarmData = (paramsId: { idFarm: string }, { farms }: any) => {
    const newFarm = farms.farmsData.filter((farm: { id: string | number }) => {
      return farm.id.toString() === paramsId.idFarm;
    });

    if (newFarm.length) {
      currentFarm.current = { ...newFarm[0] };
    }

    if (newFarm.length && newFarm[0]?.lines) {
      const lines = newFarm[0]?.lines?.sort(
        (a: any, b: any) => Number(a.line_name) - Number(b.line_name),
      );
      return lines;
    }

    return [];
  };

  const farmLines = useSelector<IRootState, IFarmState['farmsData']>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    isFarmData.bind(null, params),
  );

  return (
    <div className='h-calc-80 bg-secondary'>
      <div className='container pos-relative farms__line'>
        {width > 768 && (
          <div className='d-flex justify-content-between align-items-center pl-21 pr-15 pt-28 pb-28'>
            <BreadcrumbComponent items={breadcrumItems} />
            {permission?.isEdit && (
              <Link to={`/farms/${params.idFarm}/add-line`}>
                <Button color='blue' size={1} width='middle' type='fill'>
                  Add Line
                </Button>
              </Link>
            )}
          </div>
        )}

        <div className='farms__line-content'>
          <div className='d-flex justify-content-between white-card farms__line--header'>
            <div className='farms__line--header__name'>
              <div>
                <Title
                  size={5}
                  color='black-3'
                  align='default'
                  fontWeight={500}
                >
                  {currentFarm?.current?.name}
                </Title>
                <Subtitle size={4} color='black' align='left' fontWeight={400}>
                  <span className='pr-6'>
                    {currentFarm?.current?.farm_number}
                  </span>
                </Subtitle>
              </div>
              {width <= 768 && (
                <div
                  className={classNames('d-flex align-items-center', {
                    'hide-element': !permission?.isEdit,
                  })}
                >
                  <DropdownMenu
                    data={currentFarm.current}
                    column='isFarms'
                    onEdit={handleOnEdit}
                    type='isRedirect'
                    isRedirect='isFarms'
                  />
                </div>
              )}
            </div>
            <div className='d-flex align-items-center farms__line--header__item'>
              <BgIcon color='orange' icon={<ExpandArrowIcon />} />
              <div className='pl-12'>
                <Subtitle size={3} color='black' align='left' fontWeight={400}>
                  Area
                </Subtitle>
                <Subtitle size={4} color='black' align='left' fontWeight={500}>
                  {currentFarm?.current?.area} ha
                </Subtitle>
              </div>
            </div>
            <div className='d-flex align-items-center farms__line--header__item'>
              <BgIcon color='blue' icon={<OwnerIcon />} />
              <div className='pl-12'>
                <Subtitle
                  size={3}
                  color='black'
                  align='left'
                  fontWeight={400}
                  className='pb-4'
                >
                  Owner
                </Subtitle>
                <Tooltip content={tooltipItems} position='bottom'>
                  <div className='tooltip d-flex'>
                    {currentFarm?.current?.owners?.map(
                      ({ title, percent }: any, i: number) => {
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
                      },
                    )}
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className='d-flex align-items-center farms__line--header__item'>
              <BgIcon color='green' icon={<ClockIcon />} />
              <div className='pl-12'>
                <Subtitle size={3} color='black' align='left' fontWeight={400}>
                  Avg. line empty per year
                </Subtitle>
                <Subtitle size={4} color='black' align='left' fontWeight={500}>
                  {currentFarm?.current?.idle_avg === 1
                    ? '1 day'
                    : `${currentFarm?.current?.idle_avg} days`}
                </Subtitle>
              </div>
            </div>
            {width > 768 ? (
              <div
                className={classNames('d-flex align-items-center', {
                  'hide-element': !permission?.isEdit,
                })}
              >
                <DropdownMenu
                  data={currentFarm.current}
                  column='isFarms'
                  onEdit={handleOnEdit}
                  type='isRedirect'
                  isRedirect='isFarms'
                />
              </div>
            ) : (
              <>
                {permission?.isEdit && (
                  <Link to={`/farms/${params.idFarm}/add-line`}>
                    <Button
                      color='blue'
                      size={1}
                      width='wide'
                      type='fill'
                      className='farms__line--header__btn'
                    >
                      Add Line
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
          <div className='d-flex justify-content-between farms__main'>
            <div className='width-100'>
              {width > 768 ? (
                <Tables column='isFarm' data={farmLines} />
              ) : (
                <TableMobile column='isFarm' data={farmLines} />
              )}
            </div>
            {generalStats.length > 0 && (
              <div className='farms__statistic'>
                {!isCardsSpinner ? (
                  <>
                    {generalStats?.map((general, index) => (
                      <TablesCard
                        key={(index * 1000).toString()}
                        data={general}
                      />
                    ))}
                  </>
                ) : (
                  <div className='mt-24'>
                    <Spinner />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {isSpinner && <Spinner position='global' />}
      </div>
    </div>
  );
};

export default Farm;
