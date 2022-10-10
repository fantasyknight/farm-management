import React, { useState, useEffect, useRef, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import { IRootState } from '../../store/rootReducer';
import { IFarmState } from '../../store/farms/farms.type';
import { IUtilState, IUtilData } from '../../store/utils/utils.type';
import { getUtilData } from '../../store/utils/utils.actions';
import { IMainList } from '../../types/basicComponentsTypes';
import { hideFeedback, showFeedback } from '../../store/farms/farms.actions';
import toggleSecondMillisecond from '../../util/toggleSecondMillisecond';

import PercentIcon from '../shared/PercentIcon';
import Datepicker from '../shared/datepicker/Datepicker';
import Dropdown from '../shared/dropdown/Dropdown';
import Input from '../shared/input/Input';
import Feedback from '../shared/feedback/Feedback';

import './styles.scss';
import validationForZeroMinus from '../../util/validationForZeroMinus';
import validationForMinus from '../../util/validationForMinus';

type IAssessmentModal = {
  data: any;
  onConfirm: (data: any) => void;
  trigger: boolean;
  dataLine?: any;
};

const AssessmentModal: FC<IAssessmentModal> = ({
  data,
  onConfirm,
  trigger,
  dataLine,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const initTrigger = useRef(false);

  const allFeedback = useSelector<IRootState, IFarmState['allFeedback']>(
    state => state.farms.allFeedback,
  );

  const colorData = useSelector<IRootState, IUtilState['colors']>(
    state => state.utils.colors,
  );

  const [state, setState] = useState({
    color: '',
    conditionMin: '',
    conditionMax: '',
    conditionAverage: '',
    conditionScore: '',
    blues: '0',
    tones: '',
    plannedDateHarvest: toggleSecondMillisecond(
      Number(dataLine?.planned_date_harvest),
    ),
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
        if (type === 'conditionScore') {
          return {
            ...prev,
            [isType]: Number(value) > 100 ? 100 : `${Number(value)}`,
          };
        }

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
          const validValue = validationForMinus(value);

          return { ...prev, [isType]: validValue };
        }

        if (type === 'tones') {
          const validValue = validationForZeroMinus(value);
          return { ...prev, [isType]: validValue };
        }

        return { ...prev, [isType]: value };
      }
      return { ...prev };
    });
  };

  const handleOnSelectType = (value: string) => {
    setState(prev => ({ ...prev, color: value }));
  };

  const fieldValid = () => {
    if (
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
    dispatch(getUtilData('color', history));
  }, []);

  useEffect(() => {
    if (initTrigger.current) {
      const valid = fieldValid();
      if (valid) {
        const {
          conditionAverage,
          conditionMax,
          conditionMin,
          dateAssessment,
          plannedDateHarvest,
          conditionScore,
          ...allData
        } = state;

        const validData = {
          ...allData,
          condition_min: conditionMin,
          condition_max: conditionMax,
          condition_avg: conditionAverage,
          condition_score: conditionScore,
          date_assessment: toggleSecondMillisecond(dateAssessment),
          planned_date_harvest: toggleSecondMillisecond(plannedDateHarvest),
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
        condition_score,
        planned_date_harvest,
        date_assessment,
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
        conditionScore: condition_score,
        dateAssessment: toggleSecondMillisecond(date_assessment),
        plannedDateHarvest: toggleSecondMillisecond(planned_date_harvest),
        comment,
        id,
      };

      setState(prev => ({ ...prev, ...validData }));
    }
  }, [data]);

  return (
    <div className='assessment-modal'>
      {allFeedback.map((feedback: any) => {
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
        options={colorData.map(
          (color: IUtilData) =>
            ({
              value: color.name,
              label: color.name,
              id: color.id,
            } as IMainList),
        )}
        defaultValue={state.color ? state.color : undefined}
      />
      <div className='assessment-modal__condition d-flex justify-content-between'>
        <div className='assessment-modal__condition-item'>
          <Input
            type='number'
            placeholder='0'
            label='Condition min'
            dataType='conditionMin'
            value={state.conditionMin.toString()}
            onChange={handleChangeInput}
          />
        </div>
        <div className='assessment-modal__condition-item'>
          <Input
            type='number'
            placeholder='0'
            label='Condition max'
            dataType='conditionMax'
            value={state.conditionMax.toString()}
            onChange={handleChangeInput}
          />
        </div>
        <div className='assessment-modal__condition-item'>
          <Input
            type='number'
            placeholder='0'
            label='Condition average'
            dataType='conditionAverage'
            value={state.conditionAverage.toString()}
            onChange={handleChangeInput}
          />
        </div>
      </div>
      <div className='mb-17'>
        <Input
          type='number'
          value={state.conditionScore}
          dataType='conditionScore'
          label='Condition Score'
          unit={<PercentIcon />}
          onChange={handleChangeInput}
        />
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
        label='Assessment date'
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
      <Datepicker
        className='mb-17'
        defaultValue={state.plannedDateHarvest}
        label='Planned harvest date'
        onChange={e => {
          if (e!.toDate().getTime() < Number(dataLine?.planned_date)) {
            setState(prev => ({
              ...prev,
              plannedDateHarvest: moment().toDate().getTime(),
            }));
          } else {
            setState(prev => ({
              ...prev,
              plannedDateHarvest: e!.toDate().getTime(),
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

export default AssessmentModal;
