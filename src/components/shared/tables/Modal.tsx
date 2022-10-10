import React, { useState, useEffect, useRef, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import Datepicker from '../datepicker/Datepicker';
import Dropdown from '../dropdown/Dropdown';
import Input from '../input/Input';
import { IMainList } from '../../../types/basicComponentsTypes';
import randomKey from '../../../util/randomKey';
import { hideFeedback, showFeedback } from '../../../store/farms/farms.actions';
import Feedback from '../feedback/Feedback';
import { IRootState } from '../../../store/rootReducer';
import { IFarmState } from '../../../store/farms/farms.type';
import toggleSecondMillisecond from '../../../util/toggleSecondMillisecond';

interface ITablesModal {
  data: any;
  onConfirm: (data: any) => void;
  trigger: boolean;
  dataLine?: any;
}

const TablesModal: FC<ITablesModal> = ({
  data,
  onConfirm,
  trigger,
  dataLine,
}) => {
  const dispatch = useDispatch();
  const initTrigger = useRef(false);

  const allFeedback = useSelector<IRootState, IFarmState['allFeedback']>(
    state => state.farms.allFeedback,
  );

  const [state, setState] = useState({
    color: '',
    conditionMin: '',
    conditionMax: '',
    conditionAverage: '',
    blues: '',
    tones: '',
    dateAssessment: moment().toDate().getTime(),
    comment: '',
  });

  const handleChangeInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {
      value,
      dataset: { type },
    } = event.target;

    setState((prev: any) => {
      const isType: string | undefined = type;

      if (isType) {
        if (type === 'conditionMin') {
          const newValue = value.split('');
          const validValue = newValue
            .filter((word, i) => {
              if (i === 0) {
                return Number(word) !== 0;
              }

              return word;
            })
            .filter(word => word !== '-')
            .join('');
          const conditionAverage = Math.round(
            (Number(state.conditionMax) + Number(validValue)) / 2,
          );
          return { ...prev, [isType]: validValue, conditionAverage };
        }

        if (type === 'conditionMax') {
          const newValue = value.split('');
          const validValue = newValue
            .filter((word, i) => {
              if (i === 0) {
                return Number(word) !== 0;
              }

              return word;
            })
            .filter(word => word !== '-')
            .join('');

          const conditionAverage = Math.round(
            (Number(state.conditionMin) + Number(validValue)) / 2,
          );
          return { ...prev, [isType]: validValue, conditionAverage };
        }

        if (type === 'blues') {
          const newValue = value.split('');
          const validValue = newValue
            .filter((word, i) => {
              if (i === 0) {
                return Number(word) !== 0;
              }

              return word;
            })
            .filter(word => word !== '-')
            .join('');

          return { ...prev, [isType]: validValue };
        }

        if (type === 'tones') {
          return { ...prev, [isType]: value };
        }

        return { ...prev, [isType]: value };
      }
      return { ...prev };
    });
  };

  const items: IMainList[] = [
    { value: 'fair', label: 'Fair', id: randomKey() },
    { value: 'good', label: 'Good', id: randomKey() },
  ];

  const handleOnSelectType = (value: string) => {
    setState(prev => ({ ...prev, color: value }));
  };

  const fieldValid = () => {
    if (
      !state.color ||
      state.conditionAverage === '' ||
      state.blues === '' ||
      state.tones === ''
    ) {
      dispatch(
        showFeedback({
          isMessageModal: true,
          type: 'error',
          message: 'Fill in all the fields',
        }),
      );
      return false;
    }

    if (Number(state.conditionMin) > Number(state.conditionMax)) {
      dispatch(
        showFeedback({
          isMessageModal: true,
          type: 'error',
          message: 'Сondition min cannot be greater than condition max',
        }),
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (initTrigger.current) {
      const valid = fieldValid();
      if (valid) {
        const {
          conditionAverage,
          conditionMax,
          conditionMin,
          dateAssessment,
          ...allData
        } = state;

        const validData = {
          ...allData,
          condition_min: conditionMin,
          condition_max: conditionMax,
          planned_date_harvest: toggleSecondMillisecond(dateAssessment),
        };
        onConfirm(validData);
      }
    } else {
      initTrigger.current = true;
    }
  }, [trigger]);

  useEffect(() => {
    if (Object.values(data).length) {
      const {
        condition_avg,
        condition_max,
        condition_min,
        planned_date_harvest,
        blues,
        color,
        comment,
        tones,
        id,
      } = data;

      const validData = {
        color,
        conditionMin: condition_min,
        conditionMax: condition_max,
        conditionAverage: condition_avg,
        blues,
        tones,
        dateAssessment: toggleSecondMillisecond(planned_date_harvest),
        comment,
        id,
      };

      setState(prev => ({ ...prev, ...validData }));
    }
  }, [data]);

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
      <Dropdown
        placeholder='color'
        onChange={(value, event) => handleOnSelectType(value)}
        label='Color'
        options={items}
        defaultValue={state.color ? state.color : undefined}
      />
      <div className='d-flex justify-content-between pt-17 pb-17'>
        <div className='max-w-149'>
          <Input
            type='number'
            placeholder='0'
            label='Condition min'
            dataType='conditionMin'
            value={state.conditionMin.toString()}
            onChange={handleChangeInput}
          />
        </div>
        <div className='max-w-149'>
          <Input
            type='number'
            placeholder='0'
            label='Condition max'
            dataType='conditionMax'
            value={state.conditionMax.toString()}
            onChange={handleChangeInput}
          />
        </div>
        <div className='max-w-149'>
          <Input
            className='max-w-149'
            type='number'
            placeholder='0'
            label='Condition average'
            dataType='conditionAverage'
            value={state.conditionAverage.toString()}
            onChange={handleChangeInput}
            disabled
          />
        </div>
      </div>
      <Input
        className='mb-17'
        type='number'
        placeholder='0'
        label='Blues'
        dataType='blues'
        value={state.blues.toString()}
        onChange={handleChangeInput}
      />
      <Input
        className='mb-17'
        type='number'
        placeholder='0'
        label='Tonnes'
        dataType='tones'
        value={state.tones.toString()}
        onChange={handleChangeInput}
      />
      <Datepicker
        className='mb-17'
        defaultValue={state.dateAssessment}
        label='Planned harvest date'
        onChange={e => {
          if (e!.toDate().getTime() < Number(dataLine?.planned_date)) {
            setState(prev => ({
              ...prev,
              dateAssessment: moment().toDate().getTime(),
            }));
          } else {
            setState(prev => ({
              ...prev,
              dateAssessment: e!.toDate().getTime(),
            }));
          }
        }}
      />
      <Input
        className='mb-24'
        label='Comment'
        type='textarea'
        value={state.comment}
        placeholder='Type your comment...'
        dataType='comment'
        onChange={handleChangeInput}
      />
    </div>
  );
};

export default TablesModal;
