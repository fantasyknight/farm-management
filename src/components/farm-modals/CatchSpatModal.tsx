import React, { useState, useEffect, useRef, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from 'antd';

import { hideFeedback, showFeedback } from '../../store/farms/farms.actions';
import { IRootState } from '../../store/rootReducer';
import { IFarmState } from '../../store/farms/farms.type';
import toggleSecondMillisecond from '../../util/toggleSecondMillisecond';
import { Feedback } from '../shared';

const { RangePicker } = DatePicker;

interface ITablesModal {
  data: any;
  onConfirm: (data: any) => void;
  trigger: boolean;
}

const CatchSpatModal: FC<ITablesModal> = ({ data, onConfirm, trigger }) => {
  const dispatch = useDispatch();
  const initTrigger = useRef(false);

  const allFeedback = useSelector<IRootState, IFarmState['allFeedback']>(
    state => state.farms.allFeedback,
  );

  const [startDate, setStartDate] = useState(0);
  const [endDate, setEndDate] = useState(0);

  const fieldValid = () => {
    if (startDate === 0 || endDate === 0) {
      dispatch(
        showFeedback({
          isMessageModal: true,
          type: 'error',
          message: `Please select range`,
        }),
      );
      return null;
    }
    return true;
  };

  const onRangeChange = (dates: any, dateStrings: any) => {
    setStartDate(dates[0].toDate().getTime());
    setEndDate(dates[1].toDate().getTime());
  };

  useEffect(() => {
    if (initTrigger.current) {
      const valid = fieldValid();
      if (valid) {
        const validData = {
          planned_date: toggleSecondMillisecond(startDate),
          planned_date_harvest: toggleSecondMillisecond(endDate),
        };

        onConfirm(validData);
      }
    } else {
      initTrigger.current = true;
    }
  }, [trigger]);

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
      <label>
        Mark this line as a line catching the spat. Select the date the line has
        been installed and expected date you&apos;d like to harvest it
      </label>
      <div className='mt-16 mb-16'>
        <RangePicker onChange={onRangeChange} />
      </div>
    </div>
  );
};

export default CatchSpatModal;
