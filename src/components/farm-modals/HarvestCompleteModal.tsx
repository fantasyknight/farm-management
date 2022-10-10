import React, { useState, useEffect, useRef, FC } from 'react';
import moment from 'moment';

import validPrice from '../../util/validPrice';

import { Input, DollarIcon, Paragrapgh, Datepicker } from '../shared';
import toggleSecondMillisecond from '../../util/toggleSecondMillisecond';

interface IHarvestCompleteModal {
  data: any;
  onConfirm: (data: any) => void;
  trigger: boolean;
}

const HarvestCompleteModal: FC<IHarvestCompleteModal> = ({
  data,
  onConfirm,
  trigger,
}) => {
  const initTrigger = useRef(false);

  const [fieldData, setFieldData] = useState({
    tonesHarvested: '',
    harvestIncome: '',
    harvestDate: data?.assessments?.length
      ? toggleSecondMillisecond(data?.planned_date_harvest)
      : toggleSecondMillisecond(data?.planned_date_harvest_original),
  });

  const handleChangeInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value, name } = event.target;
    if (name === 'tonesHarvested') {
      setFieldData(prev => ({ ...prev, [name]: value }));
    }
    if (name === 'harvestIncome') {
      const validValue = validPrice(value);
      setFieldData(prev => ({ ...prev, [name]: validValue }));
    }
  };

  const validFieldData = () => {
    const completeData = {
      harvest_group_id: data?.id,
      planned_harvest_tones_actual: fieldData?.tonesHarvested
        ? Number(fieldData?.tonesHarvested)
        : 0,
      budgeted_harvest_income_actual: fieldData?.harvestIncome
        ? Number(fieldData?.harvestIncome)
        : 0,
      harvest_complete_date: toggleSecondMillisecond(fieldData?.harvestDate),
    };
    return completeData;
  };

  useEffect(() => {
    if (initTrigger.current) {
      const validData = validFieldData();
      onConfirm(validData);
    } else {
      initTrigger.current = true;
    }
  }, [trigger]);

  return (
    <div>
      <Paragrapgh
        size={2}
        color='black'
        align='left'
        fontWeight={400}
        className='pb-25'
      >
        {`You're completing a harvest with seeding date  `}
        <span className='pr-6 pl-3 font-weight-500'>
          {moment(toggleSecondMillisecond(data?.planned_date)).format(
            'DD.MM.YYYY',
          )}
        </span>
        and harvest complete date is
        <span className='pl-4 font-weight-500'>
          {moment(
            data?.assessments?.length
              ? toggleSecondMillisecond(data?.planned_date_harvest)
              : toggleSecondMillisecond(data?.planned_date_harvest_original),
          ).format('DD.MM.YYYY')}
        </span>
        . If you want to change this information before completing it, please do
        it either via assessments or editing harvest form.
      </Paragrapgh>

      <Input
        className='mb-16'
        type='number'
        onChange={handleChangeInput}
        value={fieldData.tonesHarvested}
        label='Tones harvested'
        placeholder='Tones harvested'
        name='tonesHarvested'
      />
      <div className='mb-16'>
        <Input
          type='number'
          onChange={handleChangeInput}
          value={fieldData.harvestIncome}
          unit={<DollarIcon />}
          label='Harvest income'
          placeholder='Harvest income'
          name='harvestIncome'
        />
      </div>
      <div className='pb-24'>
        <Datepicker
          className='mb-17'
          defaultValue={fieldData.harvestDate}
          label='Harvest complete date'
          onChange={e => {
            if (e?.toDate()) {
              setFieldData(prev => ({
                ...prev,
                harvestDate: e.toDate().getTime(),
              }));
            }
          }}
        />
      </div>
    </div>
  );
};

export default HarvestCompleteModal;
