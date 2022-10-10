import React, { FC, ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Map, Spinner } from '../components/shared';
import FarmForm from '../components/farmform/FarmForm';
import { IRootState } from '../store/rootReducer';
import { IFarmState } from '../store/farms/farms.type';
import { IUiState } from '../store/ui/ui.type';
import { useWidth } from '../util/useWidth';

const FarmsForm: FC = (): ReactElement => {
  const width = useWidth();
  const params = useParams<{ id: string; idFarm: string }>();
  const [position, setPposition] = useState(undefined);
  const [positionInMap, setPpositionInMap] = useState(undefined);

  const isSpinner = useSelector<IRootState, IUiState['isSpinner']>(
    state => state.ui.isSpinner,
  );

  const handleOnPosition = (mapPosition: any) => {
    if (mapPosition.lat && mapPosition.lng) {
      setTimeout(() => {
        setPposition({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          lat: Number(mapPosition.lat),
          lng: Number(mapPosition.lng),
        });
      }, 0);
    }
  };
  const isFarmData = (paramsId: { idFarm: string }, { farms }: any) => {
    const newFarm = farms.farmsData.filter(
      (farm: { id: string }) => farm.id.toString() === paramsId.idFarm,
    );

    if (newFarm?.length) {
      return newFarm[0];
    }

    return {};
  };

  const farmData = useSelector<IRootState, IFarmState['farmsData']>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    isFarmData.bind(null, params),
  );

  const handleonCalback = (newPosition: any) => {
    setPpositionInMap(newPosition);
  };

  return (
    <div className='h-calc-80 bg-main'>
      <div className='container container--not-pr pos-relative'>
        <div className='farms__form h-calc-80'>
          <div className='farms__form-form'>
            <FarmForm
              typeOf={params.id}
              idFarm={params.idFarm}
              dataFarm={farmData}
              onPosition={handleOnPosition}
              positionInMap={positionInMap}
            />
          </div>
          <div
            className='farms__form-map'
            style={{ height: width < 768 ? `${width}px` : '' }}
          >
            <Map
              googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `100%` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              zoom={10}
              position={position}
              defaultPosition={{
                lat: -41.0917585,
                lng: 173.828391,
              }}
              onCalback={handleonCalback}
            />
          </div>
        </div>
        {isSpinner && <Spinner position='global' />}
      </div>
    </div>
  );
};

export default FarmsForm;
