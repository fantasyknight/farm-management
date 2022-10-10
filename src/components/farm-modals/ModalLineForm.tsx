import React, { useState, useEffect, useRef, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { hideFeedback, showFeedback } from '../../store/farms/farms.actions';
import { IRootState } from '../../store/rootReducer';
import { IFarmState, IFeedback } from '../../store/farms/farms.type';
import Input from '../shared/input/Input';
import Feedback from '../shared/feedback/Feedback';

interface IModalLineForm {
  data: any;
  onConfirm: (data: any) => void;
  trigger: boolean;
}

const ModalLineForm: FC<IModalLineForm> = ({ data, onConfirm, trigger }) => {
  const initTrigger = useRef(false);
  const dispatch = useDispatch();
  const allFeedback = useSelector<IRootState, IFarmState['allFeedback']>(
    state => state.farms.allFeedback,
  );

  const [state, setState] = useState({
    line_name: '',
    length: '',
    line_id: '',
  });

  const handleChangeInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {
      value,
      dataset: { type },
    } = event.target;

    setState(prev => {
      const isType: string | undefined = type;

      if (isType) {
        return { ...prev, [isType]: value };
      }
      return { ...prev };
    });
  };

  const fieldValid = () => {
    if (!state.length) {
      dispatch(
        showFeedback({
          isMessageModal: true,
          type: 'error',
          message: 'Fill in the field length',
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
        onConfirm(state);
      }
    } else {
      initTrigger.current = true;
    }
  }, [trigger]);

  useEffect(() => {
    const { line_name, length, id } = data;
    setState({ line_name, length, line_id: id });
  }, [data]);

  return (
    <div>
      {allFeedback.map((feedback: IFeedback) => {
        if (feedback.isMessageModal) {
          return (
            <Feedback
              message={feedback.message}
              type={feedback.type}
              theme='light'
              key={feedback.id}
              onClose={() =>
                dispatch(hideFeedback(feedback?.id ? feedback.id : ''))
              }
            />
          );
        }

        return '';
      })}
      <Input
        type='text'
        label='Line number'
        dataType='line_name'
        value={state.line_name}
        onChange={handleChangeInput}
      />
      <div className='pt-17 pb-24'>
        <Input
          type='number'
          placeholder='0'
          label='Length'
          dataType='length'
          unit='m'
          value={state.length.toString()}
          onChange={handleChangeInput}
        />
      </div>
    </div>
  );
};

export default ModalLineForm;
