import React, { useState, useEffect, useRef, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import { IMainList } from '../../types/basicComponentsTypes';
import randomKey from '../../util/randomKey';
import { hideFeedback, showFeedback } from '../../store/farms/farms.actions';
import { IRootState } from '../../store/rootReducer';
import { IFarmState } from '../../store/farms/farms.type';
import { IUtilState, IUtilData } from '../../store/utils/utils.type';
import { getUtilData } from '../../store/utils/utils.actions';

import { Datepicker, Dropdown, Input, Feedback } from '../shared';
import toggleSecondMillisecond from '../../util/toggleSecondMillisecond';

interface IEditGroupModal {
  data: any;
  onConfirm: (data: any) => void;
  trigger: boolean;
}

export interface IFieldData {
  planned_date: number;
  planned_date_harvest: number;
  seed_id: string;
  name: string;
  season_name?: string;
  id?: string;
  drop: number;
  spat_size: number;
  submersion: number;
  spacing: number;
  density: number;
  floats: number;
  line_length: number;
}

const EditGroupModal: FC<IEditGroupModal> = ({ data, onConfirm, trigger }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const initTrigger = useRef(false);

  const seedtypeData = useSelector<IRootState, IUtilState['seedtypes']>(
    state => state.utils.seedtypes,
  );

  const allFeedback = useSelector<IRootState, IFarmState['allFeedback']>(
    state => state.farms.allFeedback,
  );

  const [fieldData, setFieldData] = useState<IFieldData>({
    planned_date: moment().toDate().getTime(),
    planned_date_harvest: moment().toDate().getTime(),
    seed_id: '',
    name: '',
    id: '',
    season_name: '',
    drop: 0,
    spat_size: 0,
    submersion: 0,
    spacing: 0,
    density: 0,
    line_length: 0,
    floats: 0,
  });

  const handleOnSelectType = (value: string): void => {
    setFieldData(prev => ({ ...prev, seed_id: value }));
  };

  const handleChangeName = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    setFieldData(prev => ({ ...prev, name: value }));
  };

  const fieldValid = () => {
    if (
      Number(fieldData.planned_date) > Number(fieldData.planned_date_harvest)
    ) {
      dispatch(
        showFeedback({
          isMessageModal: true,
          type: 'error',
          message: 'Date seeded cannot be greater than date harvested',
        }),
      );
      return false;
    }

    if (Number(fieldData.line_length) === 0) {
      dispatch(
        showFeedback({
          isMessageModal: true,
          type: 'error',
          message: 'Line length must be greater then 0',
        }),
      );
      return false;
    }

    return true;
  };

  useEffect(() => {
    dispatch(getUtilData('seedtype', history));
  }, []);

  useEffect(() => {
    if (initTrigger.current) {
      const valid = fieldValid();
      if (valid) {
        const validData = {
          ...fieldData,
          planned_date: toggleSecondMillisecond(fieldData.planned_date),
          planned_date_harvest: toggleSecondMillisecond(
            fieldData.planned_date_harvest,
          ),
        };

        onConfirm(validData);
      }
    } else {
      initTrigger.current = true;
    }
  }, [trigger]);

  useEffect(() => {
    const isSeed = seedtypeData.filter(item => item.name === data?.seed);
    const newData = {
      name: data?.name,
      planned_date: toggleSecondMillisecond(data?.planned_date),
      planned_date_harvest: data?.assessments?.length
        ? toggleSecondMillisecond(data?.planned_date_harvest)
        : toggleSecondMillisecond(data?.planned_date_harvest_original),
      seed_id: isSeed.length ? `${isSeed[0].id}` : '',
      id: data?.id,
      season_name: data?.season_name,
      drop: data?.drop,
      submersion: data?.submersion,
      spacing: data?.spacing,
      line_length: data?.line_length,
      spat_size: data?.spat_size,
      density: data?.density,
      floats: data?.floats,
    };
    setFieldData(newData);
  }, [data, seedtypeData]);

  return (
    <div>
      {allFeedback.map((feedback: any, i: number) => {
        if (feedback.isMessageModal) {
          return (
            <Feedback
              message={feedback.message}
              type={feedback.type}
              theme='light'
              key={feedback.id}
              onClose={() => dispatch(hideFeedback(feedback.id))}
            />
          );
        }

        return '';
      })}
      <Input
        className='mb-16'
        type='text'
        onChange={handleChangeName}
        value={fieldData.season_name!}
        label='Name'
        placeholder='Name'
        disabled
      />
      <Datepicker
        className='mb-16 mt-16'
        label='Planned date seeded'
        defaultValue={fieldData.planned_date}
        onChange={e =>
          setFieldData(prev => ({
            ...prev,
            planned_date: e
              ? e!.toDate().getTime()
              : moment().toDate().getTime(),
          }))
        }
        required
      />
      <Datepicker
        className='mb-16'
        label='Planned date harvested'
        defaultValue={fieldData?.planned_date_harvest}
        onChange={e => {
          if (
            fieldData.planned_date !== undefined &&
            e &&
            e!.toDate().getTime() < fieldData.planned_date
          ) {
            setFieldData(prev => ({
              ...prev,
              planned_date_harvest: moment().toDate().getTime(),
            }));
          } else {
            setFieldData(prev => ({
              ...prev,
              planned_date_harvest: e
                ? e!.toDate().getTime()
                : moment().toDate().getTime(),
            }));
          }
        }}
        required
      />
      <div className='mb-16'>
        <Input
          type='number'
          value={fieldData.line_length.toString()}
          label='Line Length'
          dataType='line_length'
          unit='m'
          required
          onChange={e =>
            setFieldData(prev => ({
              ...prev,
              line_length: Number(e.target.value),
            }))
          }
        />
      </div>
      <Dropdown
        className='mb-16'
        placeholder='seed type'
        onChange={(value, event) => handleOnSelectType(value)}
        label='Seed Type'
        options={seedtypeData.map(
          (seedtype: IUtilData) =>
            ({
              value: `${seedtype.id}`,
              label: seedtype.name,
              id: seedtype.id,
            } as IMainList),
        )}
        defaultValue={fieldData.seed_id ? fieldData.seed_id : undefined}
      />
      <div className='mb-16'>
        <Input
          type='number'
          value={fieldData.drop.toString()}
          label='Drop'
          dataType='drop'
          unit='m'
          required
          onChange={e =>
            setFieldData(prev => ({ ...prev, drop: Number(e.target.value) }))
          }
        />
      </div>
      <div className='mb-16'>
        <Input
          type='number'
          value={fieldData.spat_size.toString()}
          label='Spat Size'
          dataType='spat_size'
          unit='mm'
          required
          onChange={e =>
            setFieldData(prev => ({
              ...prev,
              spat_size: Number(e.target.value),
            }))
          }
        />
      </div>
      <div className='d-flex pb-17'>
        <div className='mr-24 w-100'>
          <Input
            type='number'
            value={fieldData.submersion.toString()}
            label='Submersion'
            dataType='submersion'
            unit='m'
            required
            onChange={e =>
              setFieldData(prev => ({
                ...prev,
                submersion: Number(e.target.value),
              }))
            }
          />
        </div>
        <div className='w-100'>
          <Input
            type='number'
            value={fieldData.spacing.toString()}
            label='Spacing'
            dataType='spacing'
            unit='mm'
            required
            onChange={e =>
              setFieldData(prev => ({
                ...prev,
                spacing: Number(e.target.value),
              }))
            }
          />
        </div>
      </div>
      <div className='d-flex pb-17'>
        <div className='mr-24 w-100'>
          <Input
            type='number'
            value={fieldData.density.toString()}
            label='Density'
            dataType='density'
            required
            onChange={e =>
              setFieldData(prev => ({
                ...prev,
                density: Number(e.target.value),
              }))
            }
          />
        </div>
        <div className='w-100'>
          <Input
            type='number'
            value={fieldData.floats.toString()}
            label='Floats'
            dataType='floats'
            required
            onChange={e =>
              setFieldData(prev => ({
                ...prev,
                floats: Number(e.target.value),
              }))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default EditGroupModal;
