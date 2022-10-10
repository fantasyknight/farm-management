import React, { useState, FC, useEffect, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  withScriptjs,
  withGoogleMap,
} from 'react-google-maps';

import mapPin from '../../../images/map-pin.svg';

import './styles.scss';

type ISetState = ILocation | undefined;

interface ILocation {
  lat: number;
  lng: number;
}

const MapWithMarkers: FC<any> = ({
  position,
  zoom,
  defaultPosition,
  onCalback,
}) => {
  const [state, setState] = useState<ISetState>(undefined);

  const defaultCenter = useRef(defaultPosition);

  useEffect(() => {
    if (position) {
      setState(position);
    }
  }, [position]);

  const handleSetPosition = (event: any) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    onCalback(newPosition);
    setState(newPosition);
  };

  const options = {
    minZoom: 3,
    maxZoom: 20,
  };

  return (
    <GoogleMap
      options={options}
      // eslint-disable-next-line react/destructuring-assignment
      defaultZoom={zoom}
      // eslint-disable-next-line react/destructuring-assignment
      defaultCenter={defaultCenter.current}
      center={state || defaultCenter.current}
      onClick={handleSetPosition}
    >
      {state && (
        <Marker
          position={state}
          icon={{
            url: mapPin,
          }}
        >
          <InfoWindow>
            <div className='map__pin-label'>
              <span className='pr-15'>{state && state.lat}</span>
              <span>{state?.lng}</span>
            </div>
          </InfoWindow>
        </Marker>
      )}
    </GoogleMap>
  );
};

export default withScriptjs(withGoogleMap(MapWithMarkers));
