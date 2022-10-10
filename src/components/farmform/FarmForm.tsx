import React, { useState, useEffect, FC, ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { IFarmData } from '../../store/farms/farms.type';
import {
  addFarm,
  editFarm,
  showFeedback,
} from '../../store/farms/farms.actions';

import {
  Button,
  CloseIcon,
  Input,
  PlusIcon,
  PercentIcon,
  Title,
} from '../shared';
import './styles.scss';
import randomKey from '../../util/randomKey';
import { useWidth } from '../../util/useWidth';
import validationForZeroMinus from '../../util/validationForZeroMinus';

interface IFarmForm {
  typeOf: string;
  idFarm?: string | undefined;
  dataFarm?: IFarmData | undefined | any;
  onPosition: (d: any) => void;
  positionInMap: any;
}

interface IFields {
  [key: string]:
    | number
    | string
    | boolean
    | undefined
    | Array<IOwners>
    | ILocation;
  name: string;
  lat: number | string;
  lng: number | string;
  area: string;
  farm_number: string;
  owners: Array<IOwners>;
}

interface ILocation {
  lat: string;
  lng: string;
}

interface IOwners {
  [key: string]: number | string | boolean | undefined;
  title: string;
  percent: number | string;
  id: number | string;
}

const FarmForm: FC<IFarmForm> = ({
  typeOf,
  idFarm,
  onPosition,
  dataFarm,
  positionInMap,
}): ReactElement => {
  const history = useHistory();
  const dispatch = useDispatch();
  const width = useWidth();
  const maxLatitude = 84.85;
  const maxLongitude = 180;
  const [fields, setFields] = useState<IFields>({
    name: '',
    lat: '',
    lng: '',
    area: '',
    owners: [{ title: '', percent: '', id: randomKey() }],
    farm_number: '',
  });
  const [isDisableOwner, setIsDisableOwner] = useState(false);

  const handleOnAddLine = () => {
    setFields(prev => ({
      ...prev,
      owners: [...prev.owners, { title: '', percent: '', id: randomKey() }],
    }));
  };

  const handleOnDeleteLine = (id: number | string) => {
    setFields(prev => ({
      ...prev,
      owners: [...prev.owners.filter(line => line.id !== id)],
    }));
    setIsDisableOwner(false);
  };

  const handleChangeLineData = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: number | string,
  ) => {
    const {
      value,
      dataset: { type },
    } = event.target as HTMLInputElement;

    const newLines = fields.owners.map((line: IOwners) => {
      if (line.id === id) {
        const obj: IOwners = { ...line };
        const objIng: string | undefined = type;

        if (objIng === 'percent') {
          const isValue = validationForZeroMinus(value);

          if (fields.owners.length === 1) {
            let validValue = isValue;
            if (Number(isValue) >= 100) {
              validValue = '100';
              setIsDisableOwner(true);
            } else {
              setIsDisableOwner(false);
            }

            if (objIng) {
              obj[objIng] = validValue;
            }

            return obj;
          }

          if (fields.owners.length > 1) {
            const sum = fields.owners.reduce((acum: any, owner: any) => {
              if (owner.id === id) {
                return acum + Number(isValue);
              }
              return acum + Number(owner.percent);
            }, 0);

            let validValue = isValue;
            if (sum >= 100) {
              validValue = (Number(isValue) - (sum - 100)).toString();
              setIsDisableOwner(true);
            } else {
              setIsDisableOwner(false);
            }

            if (objIng) {
              obj[objIng] = validValue;
            }

            return obj;
          }
        }

        if (objIng) {
          obj[objIng] = value;
        }
        return obj;
      }
      return line;
    });

    setFields(prev => ({ ...prev, owners: [...newLines] }));
  };

  const validLocation = (value: string, type: string): string => {
    if (type === 'lat') {
      const valueArray = value.split('');

      if (valueArray[0] !== '-') {
        if (valueArray.length >= 2) {
          const sum = Number(valueArray[0] + valueArray[1]);
          const sumValid = sum >= maxLatitude;

          if (sumValid) {
            valueArray.splice(
              0,
              2,
              maxLatitude.toString()[0],
              maxLatitude.toString()[1],
            );
          }
        }

        if (valueArray.length >= 3 && Number.isNaN(Number(valueArray[1]))) {
          return value;
        }

        if (valueArray.length >= 3) {
          const newV = valueArray.filter(
            (word: string) => !Number.isNaN(Number(word)),
          );
          newV.splice(2, 0, '.');

          const b = newV.join('');

          if (b) {
            return b;
          }
        }

        return valueArray.join('');
      }

      if (valueArray[0] === '-') {
        if (valueArray.length >= 3) {
          const sum = Number(valueArray[1] + valueArray[2]);
          const sumValid = sum > maxLatitude;

          if (sumValid) {
            valueArray.splice(
              1,
              3,
              maxLatitude.toString()[0],
              maxLatitude.toString()[1],
            );
          }
        }

        if (valueArray.length >= 4 && Number.isNaN(Number(valueArray[2]))) {
          return value;
        }

        if (valueArray.length >= 4) {
          const newV = valueArray.filter(
            (word: string) => word === '-' || !Number.isNaN(Number(word)),
          );

          newV.splice(3, 0, '.');

          const b = newV.join('');

          if (b) {
            return b;
          }
        }

        return valueArray.join('');
      }
    }
    if (type === 'lng') {
      const valueArray = value.split('');

      if (valueArray[0] !== '-') {
        if (valueArray.length >= 3) {
          const sum = Number(valueArray[0] + valueArray[1] + valueArray[2]);
          const sumValid = sum >= maxLongitude;

          if (sumValid) {
            valueArray.splice(
              0,
              3,
              maxLongitude.toString()[0],
              maxLongitude.toString()[1],
              maxLongitude.toString()[2],
            );
          }
        }

        if (valueArray.length >= 3 && Number.isNaN(Number(valueArray[1]))) {
          return value;
        }
        if (valueArray.length >= 4 && Number.isNaN(Number(valueArray[2]))) {
          return value;
        }

        if (valueArray.length >= 4) {
          const newV = valueArray.filter(
            (word: string) => !Number.isNaN(Number(word)),
          );
          newV.splice(3, 0, '.');

          const b = newV.join('');

          if (b) {
            return b;
          }
        }

        return valueArray.join('');
      }

      if (valueArray[0] === '-') {
        if (valueArray.length >= 4) {
          const sum = Number(valueArray[1] + valueArray[2] + valueArray[3]);
          const sumValid = sum > maxLongitude;

          if (sumValid) {
            valueArray.splice(
              1,
              4,
              maxLongitude.toString()[0],
              maxLongitude.toString()[1],
              maxLongitude.toString()[2],
            );
          }
        }

        if (valueArray.length >= 4 && Number.isNaN(Number(valueArray[2]))) {
          return value;
        }

        if (valueArray.length >= 5 && Number.isNaN(Number(valueArray[3]))) {
          return value;
        }

        if (valueArray.length >= 6 && Number.isNaN(Number(valueArray[4]))) {
          return value;
        }

        if (valueArray.length >= 5) {
          const newV = valueArray.filter(
            (word: string) => word === '-' || !Number.isNaN(Number(word)),
          );

          newV.splice(4, 0, '.');

          const b = newV.join('');

          if (b) {
            return b;
          }
        }

        return valueArray.join('');
      }
    }
    return value;
  };

  const handleChangeFields = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {
      value,
      dataset: { type },
    } = event.target as HTMLInputElement;

    setFields(prev => {
      const objIng: string | undefined = type;

      if (objIng) {
        if (type === 'lat') {
          const validValue = validLocation(value, 'lat');
          const location = { lng: fields.lng, lat: validValue };

          if (location.lat && location.lng) {
            onPosition(location);
          }

          return {
            ...prev,
            [objIng]: validValue.toString(),
          };
        }

        if (type === 'lng') {
          const validValue = validLocation(value, 'lng');
          const location = { lat: fields.lat, lng: validValue };

          if (location.lat && location.lng) {
            // console.log(location);
            onPosition(location);
          }
          return {
            ...prev,
            [objIng]: validValue,
          };
        }

        if (type === 'area') {
          const validValue = validationForZeroMinus(value);
          return { ...prev, [objIng]: validValue };
        }

        if (type === 'farm_number') {
          return { ...prev, [objIng]: value.slice(0, 16) };
        }
        return { ...prev, [objIng]: value };
      }
      return { ...prev };
    });
  };

  const validLat = (): boolean | string => {
    const lat = fields.lat.toString().split('');

    if (!fields.lat) {
      setFields(prev => ({ ...prev, lat: prev.lat }));
      return false;
    }

    if (lat[0] !== '-' && lat.length >= 3) {
      const sum = lat[0] + lat[1];
      if (Number(sum) === maxLatitude) {
        const l = lat.slice(0, 2);
        l.splice(2, 0, '.', '0');
        return l.join('');
      }
    }

    if (lat[0] !== '-' && lat.length <= 2) {
      const sum = lat[0] + lat[1];
      if (Number(sum) === maxLatitude) {
        lat.splice(2, 0, '.', '0');
        return lat.join('');
      }
      lat.splice(2, 0, '.', '0');
      return lat.join('');
    }

    if (lat[0] === '-' && lat.length >= 4) {
      const sum = lat[1] + lat[2];
      if (Number(sum) === maxLatitude) {
        const l = lat.slice(0, 3);
        l.splice(3, 0, '.', '0');
        return l.join('');
      }
    }

    if (lat[0] === '-' && lat.length <= 3) {
      lat.splice(3, 0, '.', '0');
      return lat.join('');
    }

    return fields.lat.toString();
  };

  const validLng = (): boolean | string => {
    const lng = fields.lng.toString().split('');

    if (!fields.lng) {
      setFields(prev => ({ ...prev, lng: fields.lng }));
      return false;
    }

    if (lng[0] !== '-' && lng.length >= 3) {
      const sum = lng[0] + lng[1] + lng[2];
      if (Number(sum) === maxLongitude) {
        const l = lng.slice(0, 3);
        l.splice(3, 0, '.', '0');
        return l.join('');
      }
    }

    if (lng[0] !== '-' && lng.length <= 3) {
      lng.splice(3, 0, '.', '0');
      return lng.join('');
    }

    if (lng[0] === '-' && lng.length >= 4) {
      const sum = lng[1] + lng[2] + lng[3];
      if (Number(sum) === maxLongitude) {
        const l = lng.slice(0, 4);
        l.splice(4, 0, '.', '0');
        return l.join('');
      }
    }

    if (lng[0] === '-' && lng.length <= 4) {
      lng.splice(4, 0, '.', '0');
      return lng.join('');
    }

    return fields.lng.toString();
  };

  const handleComplites = (): null => {
    if (!fields.name) {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Field farm name filled in incorrectly',
        }),
      );
      return null;
    }

    const lat = validLat();
    const lng = validLng();

    if (!lat) {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Field latitude filled in incorrectly',
        }),
      );
      return null;
    }

    if (!lng) {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Field longitude filled in incorrectly',
        }),
      );
      return null;
    }

    if (!fields.area) {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Field area filled in incorrectly',
        }),
      );
      return null;
    }

    const valid = fields.owners.filter(
      line =>
        line.title === '' ||
        line.title === undefined ||
        line.percent === '' ||
        line.percent === undefined ||
        Number(line.percent) <= 0,
    );

    if (!fields.owners.length || valid.length) {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Field owners filled in incorrectly',
        }),
      );
      return null;
    }

    const filterOwners = fields.owners.map((owner: IOwners) => {
      const { id, ...own } = owner;
      return own;
    });

    const data = {
      name: fields.name.trim(),
      long: lng ? lng.toString() : fields.lng,
      lat: lat ? lat.toString() : fields.lat,
      area: Number(fields.area),
      owner: filterOwners,
      farm_number: fields.farm_number,
    };

    if (typeOf === 'add') {
      dispatch(addFarm(data, history));
    }

    if (typeOf === 'edit') {
      dispatch(editFarm(data, idFarm, history));
    }
    return null;
  };

  useEffect(() => {
    if (Object.values(dataFarm).length) {
      const { location, owners, ...farmData } = dataFarm;

      const ownersWithId = owners?.map((owner: any) => {
        const newOwner = { ...owner };
        newOwner.id = randomKey();
        return newOwner;
      });

      const farm = {
        ...farmData,
        owners: ownersWithId,
        lat: dataFarm.location.lat,
        lng: dataFarm.location.lng,
      };

      const sumPercent = dataFarm?.owners?.reduce(
        (acum: number, owner: any) => {
          const sum = acum + Number(owner.percent);
          return sum;
        },
        0,
      );

      if (sumPercent >= 100) {
        setIsDisableOwner(true);
      }

      setFields(farm);
      onPosition({ lat: dataFarm.location.lat, lng: dataFarm.location.lng });
    }
  }, [dataFarm]);

  useEffect(() => {
    if (positionInMap) {
      setFields(prev => ({ ...prev, ...positionInMap }));
    }
  }, [positionInMap]);

  return (
    <div className='farm-form'>
      <Title
        size={5}
        color='black-3'
        align='default'
        fontWeight={700}
        className='pb-25'
      >
        <p className='first-letter-upper'>{typeOf}</p> Farm
      </Title>
      <div className='pb-17 farm-form__row'>
        <Input
          type='text'
          value={fields.name}
          label='Farm Name'
          dataType='name'
          required
          onChange={handleChangeFields}
        />
      </div>
      <div className='pb-17 farm-form__row'>
        <Input
          type='text'
          value={fields.farm_number}
          label='Farm Number'
          dataType='farm_number'
          onChange={handleChangeFields}
        />
      </div>
      <div className='d-flex pb-17 farm-form__row'>
        <div className='mr-24 w-100'>
          <Input
            type='number'
            value={fields.lat.toString()}
            label='Latitude'
            dataType='lat'
            required
            onChange={handleChangeFields}
          />
        </div>
        <div className='w-100'>
          <Input
            type='number'
            value={fields.lng.toString()}
            label='Longitude'
            dataType='lng'
            required
            onChange={handleChangeFields}
          />
        </div>
      </div>
      <div className='pb-17 farm-form__area'>
        <Input
          type='number'
          value={fields.area}
          label='Area'
          dataType='area'
          unit='ha'
          required
          onChange={handleChangeFields}
        />
      </div>
      <div>
        {fields.owners.map(line => (
          <div
            className='mb-12 pr-34 pos-relative budget__seeding d-flex align-items-center justify-content-between'
            key={line.id}
          >
            <div className='budget__wrapper'>
              <Input
                className='mr-16'
                type='text'
                value={line.title}
                required
                dataType='title'
                label='Owner'
                onChange={event => handleChangeLineData(event, line.id)}
              />
            </div>
            <div className='budget__price-wrapper pl-24'>
              <Input
                type='number'
                value={line.percent.toString()}
                dataType='percent'
                label='Percent'
                unit={<PercentIcon />}
                onChange={event => handleChangeLineData(event, line.id)}
              />
            </div>
            <span
              className='farm-form__close-icon pl-24'
              onKeyDown={() => undefined}
              onClick={e => handleOnDeleteLine(line.id)}
              role='button'
              tabIndex={0}
            >
              <CloseIcon />
            </span>
          </div>
        ))}
        {width < 768 ? (
          <Button
            color='blue'
            size={1}
            width='wide'
            type='bordered'
            iconLeft
            onClick={handleOnAddLine}
            disabled={isDisableOwner}
          >
            <span className='ml-4 mr-4 font-size-0'>
              <PlusIcon />
            </span>
            <span className='pr-10'>Add</span>
          </Button>
        ) : (
          <Button
            color='blue'
            size={0}
            width='default'
            type='bordered'
            isNoneBorder
            iconLeft
            onClick={handleOnAddLine}
            disabled={isDisableOwner}
          >
            <span className='ml-4 mr-4 font-size-0'>
              <PlusIcon />
            </span>
            <span className='pr-10'>Add</span>
          </Button>
        )}
      </div>
      <div className='farm-form__buttons d-flex justify-content-end'>
        <Link to='/farms'>
          <Button
            size={1}
            width={width < 768 ? 'wide' : 'small'}
            color='blue'
            type='transparent'
          >
            Cancel
          </Button>
        </Link>
        <Button
          color='green'
          className={`${width < 768 ? 'mb-8' : 'ml-15'}`}
          size={1}
          width={width < 768 ? 'wide' : 'small'}
          type='fill'
          onClick={handleComplites}
        >
          {typeOf === 'add' ? <span>Create Farm</span> : <span>Save</span>}
        </Button>
      </div>
    </div>
  );
};

export default FarmForm;
