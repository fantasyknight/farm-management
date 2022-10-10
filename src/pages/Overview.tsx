import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { IRootState } from '../store/rootReducer';
import { IFarmState } from '../store/farms/farms.type';
import { getFarmsData } from '../store/farms/farms.actions';

import {
  Title,
  Button,
  DynamicCard,
  FarmIcon,
  TruckIcon,
  AbacusIcon,
  WaterIcon,
  Tables,
  ArrowLinkIcon,
  TableMobile,
  Spinner,
  PlusIcon,
  Dropdown,
} from '../components/shared';
import Chart from '../components/chart/Chart';
import ToDoList from '../components/todo/ToDoListComponent';
import ModalTask from '../components/todo/ModalTask';
import { ProfileState } from '../store/profile/profile.type';
import { IOverviewCard } from '../types/apiDataTypes';
import { composeApi } from '../apis/compose';
import { AuthState } from '../store/auth/auth.type';

const Overview: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const ref: any = useRef();
  const [width, setWidth] = useState(0);
  const [cardsData, setCardsData] = useState<IOverviewCard[]>([]);
  const [isCardsSpinner, setIsCardsSpinner] = useState(false);
  const [isChartSpinner, setIsChartSpinner] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [chartData, setChartData] = useState<any>();
  const [createTask, setCreateTask] = useState(false);

  const authStore = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );

  const permission = useSelector<IRootState, ProfileState['permission']>(
    state => state.profile.permission,
  );

  const farmsData = useSelector<IRootState, IFarmState['farmsData']>(
    state => state.farms.farmsData,
  );

  const getCards = async () => {
    setIsCardsSpinner(true);
    const responseData = await composeApi(
      {
        data: {},
        method: 'POST',
        url: 'api/overview/account-info',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (responseData?.length) {
      const newCard: IOverviewCard[] = responseData?.map(
        (card: IOverviewCard) => {
          if (card.name === 'Farms') {
            return { ...card, color: 'orange', icon: <FarmIcon /> };
          }
          if (card.name === 'Lines') {
            return {
              ...card,
              checked: true,
              color: 'blue',
              icon: <WaterIcon />,
            };
          }
          if (card.name.includes('Income')) {
            return {
              ...card,
              checked: true,
              color: 'green',
              icon: <AbacusIcon />,
            };
          }
          if (card.name.includes('Harvest')) {
            return {
              ...card,
              checked: true,
              color: 'purple',
              icon: <TruckIcon />,
            };
          }

          return { ...card };
        },
      );

      setCardsData(newCard);
    }
    setIsCardsSpinner(false);
  };

  const getDataChart = async () => {
    setIsChartSpinner(true);
    const responseData = await composeApi(
      {
        data: {},
        method: 'POST',
        url: 'api/overview/chart-info',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (responseData?.length) {
      const newChartData = responseData?.map((line: any) => {
        const newLine = line?.values?.map((valueLine: any) => {
          const newInfos = valueLine?.information?.map((info: any) => {
            return `${info?.farms} - ${
              info?.lines?.length > 1 ? 'Lines' : 'Line'
            } ${info?.lines?.join()}`;
          });
          let oneDateLine = valueLine.date;
          if (line.name === 'harvest') {
            oneDateLine += '01';
          }
          if (line.name === 'seedings') {
            oneDateLine += '04';
          }
          if (line.name === 'assessments') {
            oneDateLine += '07';
          }
          return {
            ...valueLine,
            date: Number(oneDateLine),
            information: newInfos || null,
          };
        });
        return { ...line, values: newLine };
      });
      setChartData(newChartData);
    }
    setIsChartSpinner(false);
  };

  const getFarms = async () => {
    await dispatch(getFarmsData(history));
  };

  const getDatas = () => {
    getDataChart();
    getCards();
    getFarms();
  };

  useEffect(() => {
    getDatas();

    if (ref?.current?.clientWidth) {
      setWidth(ref.current.clientWidth);
    }

    const resizeWidth = () => {
      if (ref?.current?.clientWidth) {
        setWidth(ref.current.clientWidth);
      }
    };

    window.addEventListener('resize', resizeWidth);

    return () => {
      window.removeEventListener('scroll', resizeWidth);
    };
  }, []);

  useEffect(() => {
    const interval = setTimeout(() => {
      if (cardsData.length) {
        setCardsData(
          cardsData.map(card =>
            card.name !== 'Farms'
              ? { ...card, checked: !card.checked }
              : { ...card },
          ),
        );
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [cardsData]);

  const handleOnCheckCard = (color: string, checked: boolean) => {
    setCardsData(
      cardsData.map(card =>
        card.color === color ? { ...card, checked } : { ...card },
      ),
    );
  };

  const handleOnCreateTask = () => {
    setCreateTask(!createTask);
  };

  const handleOnAddTask = () => {
    setCreateTask(false);
  };

  return (
    <>
      <div className='bg-secondary min-h-100'>
        <div className='container'>
          <div className='overview d-flex justify-content-between align-items-center'>
            <Title size={5} color='black' align='default' fontWeight={700}>
              Overview
            </Title>
            {permission?.isEdit && (
              <Link to='/farms/farm-add' className='overview__button'>
                <Button color='blue' size={1} width='middle' type='fill'>
                  Add Farm
                </Button>
              </Link>
            )}
          </div>
          <div className='overview__content'>
            <div className='overview__left-content' ref={ref}>
              {!isChartSpinner ? (
                <>
                  {chartData?.length && (
                    <Chart
                      data={chartData}
                      width={width < 600 ? 800 : width - 50}
                    />
                  )}
                </>
              ) : (
                <div className='m-auto'>
                  <Spinner />
                </div>
              )}
            </div>
            <div className='overview__right-content'>
              {!isCardsSpinner ? (
                <>
                  {cardsData?.map((item, index) => (
                    <div className='dynamicCard' key={item.name}>
                      <DynamicCard
                        idDynamic={item.name !== 'Farms'}
                        id={index + 100}
                        icon={item.icon}
                        color={item.color as string}
                        text={item.name !== 'Farms' ? null : item.name}
                        value={item.value}
                        checked={item.checked as boolean}
                        onChange={handleOnCheckCard}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <div className='m-auto'>
                  <Spinner />
                </div>
              )}
            </div>
          </div>
          <div className='overview__content pt-24'>
            <div className='overview__left-content'>
              <div className='pt-12 pb-12 pl-16 pr-16 mb-8 d-flex justify-content-between align-items-center white-card'>
                <Link to='/farms'>
                  <Title size={6} color='black-3' align='left' fontWeight={500}>
                    <span className='pr-12'>Farms</span>
                    <ArrowLinkIcon />
                  </Title>
                </Link>
              </div>
              <div className='width-100'>
                {width > 768 ? (
                  <Tables column='isFarms' data={farmsData} isHaveChild />
                ) : (
                  <TableMobile column='isFarms' data={farmsData} isHaveChild />
                )}
              </div>
            </div>
            <div className='overview__right-content'>
              <div className='width-100 pt-12 pb-12 pl-16 pr-16 white-card'>
                <div>
                  <Link to='/tasks'>
                    <Title
                      size={6}
                      color='black-3'
                      align='left'
                      fontWeight={500}
                    >
                      <span className='pr-12'>Upcoming tasks</span>
                      <ArrowLinkIcon />
                    </Title>
                  </Link>
                  <Button
                    color='blue'
                    size={1}
                    width='default'
                    type='transparent'
                    className='overview_task_add'
                    onClick={handleOnCreateTask}
                  >
                    <PlusIcon />
                  </Button>
                </div>
                <Dropdown
                  className='mr-6'
                  onChange={(value, event) => setFilterType(value)}
                  label=''
                  options={[
                    {
                      value: 'all',
                      label: 'View all Tasks',
                      id: 'all',
                    },
                    {
                      value: 'mine',
                      label: 'View mine only',
                      id: 'mine',
                    },
                  ]}
                  defaultValue={filterType}
                />
                <div className='width-100 pt-12 d-flex justify-content-between align-items-center'>
                  <ToDoList isActivePage filterType={filterType} />
                </div>
              </div>
            </div>
          </div>
          <ModalTask
            onCancel={handleOnCreateTask}
            data={null}
            type='create'
            title='Create task'
            onConfirm={handleOnAddTask}
            visible={createTask}
          />
        </div>
      </div>
    </>
  );
};

export default Overview;
