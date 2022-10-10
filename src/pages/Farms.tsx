import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { IFarmState } from '../store/farms/farms.type';
import { IUiState } from '../store/ui/ui.type';
import { IRootState } from '../store/rootReducer';
import { useWidth } from '../util/useWidth';

import {
  Button,
  Tables,
  Title,
  TablesCard,
  Spinner,
  PlusIcon,
  TableMobile,
} from '../components/shared';
import { ProfileState } from '../store/profile/profile.type';
import { IFarmCard } from '../types/apiDataTypes';
import { composeApi } from '../apis/compose';
import { AuthState } from '../store/auth/auth.type';

const Farms: FC = (): ReactElement => {
  const width = useWidth();
  const history = useHistory();
  const dispatch = useDispatch();
  const [nextSeeds, setNextSeeds] = useState<IFarmCard[]>([]);
  const [nextHarvest, setNextHarvest] = useState<IFarmCard[]>([]);
  const [total, setTotal] = useState<IFarmCard[]>([]);
  const [isCardsSpinner, setIsCardsSpinner] = useState(false);
  const farmsData = useSelector<IRootState, IFarmState['farmsData']>(
    state => state.farms.farmsData,
  );

  const authStore = useSelector<IRootState, AuthState['auth']>(
    state => state.auth.auth,
  );

  const permission = useSelector<IRootState, ProfileState['permission']>(
    state => state.profile.permission,
  );

  const isSpinner = useSelector<IRootState, IUiState['isSpinner']>(
    state => state.ui.isSpinner,
  );

  const getSeeds = async () => {
    const responseData = await composeApi(
      {
        data: {},
        method: 'POST',
        url: 'api/overview/next-seeding',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (responseData?.data) {
      setNextSeeds(responseData?.data);
    }
  };

  const getHarvest = async () => {
    const responseData = await composeApi(
      {
        data: {},
        method: 'POST',
        url: 'api/overview/next-harvest',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (responseData?.data) {
      setNextHarvest(responseData?.data);
    }
  };

  const getTotals = async () => {
    const responseData = await composeApi(
      {
        data: {},
        method: 'POST',
        url: 'api/overview/farm-review',
        requireAuth: true,
      },
      dispatch,
      authStore,
      history,
    );
    if (responseData?.length) {
      setTotal(responseData);
    }
  };

  const getDatas = async () => {
    setIsCardsSpinner(true);
    await getSeeds();
    await getHarvest();
    await getTotals();
    setIsCardsSpinner(false);
  };

  useEffect(() => {
    getDatas();
  }, []);

  return (
    <div className='h-calc-80 bg-secondary'>
      <div className='container pos-relative'>
        <div className='farms'>
          <div className='farms__header d-flex justify-content-between align-items-center'>
            <Title size={5} color='black-3' align='default' fontWeight={700}>
              Farms
            </Title>
            {permission?.isEdit && (
              <Link to='/farms/farm-add'>
                {width > 768 ? (
                  <Button color='blue' size={1} width='middle' type='fill'>
                    Add Farm
                  </Button>
                ) : (
                  <Button
                    color='blue'
                    size={0}
                    width='default'
                    type='fill'
                    iconOnly
                  >
                    <PlusIcon />
                  </Button>
                )}
              </Link>
            )}
          </div>
          <div className='farms__content d-flex justify-content-between'>
            <div className='width-100 pos-relative'>
              {width > 768 ? (
                <Tables column='isFarms' data={farmsData} isHaveChild />
              ) : (
                <TableMobile column='isFarms' data={farmsData} isHaveChild />
              )}
            </div>
            <div className='farms__content-cards flex-basis-32'>
              {!isCardsSpinner ? (
                <>
                  <TablesCard data={nextSeeds} type='next-seed' />
                  <TablesCard data={nextHarvest} type='next-harvest' />
                  {total?.length > 0 && <TablesCard data={total} />}
                </>
              ) : (
                <div className='mt-24'>
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        </div>
        {!farmsData?.length && isSpinner && <Spinner position='global' />}
      </div>
    </div>
  );
};

export default Farms;
