import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { IRootState } from '../store/rootReducer';
import { ILineData, IBudgetLocal } from '../types/farmTypes';
import { IList } from '../types/basicComponentsTypes';
import { IFarmData } from '../store/farms/farms.type';
import randomKey from '../util/randomKey';

import LineDetails from '../components/lines/LineDetails';
import LineBudget from '../components/lines/LineBudget';
import { StepsComponent } from '../components/shared';
import { useWidth } from '../util/useWidth';

const AddLines = () => {
  const width = useWidth();
  const params = useParams<{ idFarm: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const skipOrigin = useRef(false);
  const stepsItems: IList[] = [
    { title: 'Line details', id: 'line' },
    { title: 'Budget', id: 'budget' },
  ];

  const [lineData, setLineData] = useState<ILineData>({
    farm_id: '',
    line_name: '',
    length: '',
  });

  const [budget, setBudget] = useState<IBudgetLocal>({
    seedingCosts: [{ name: '', price: '', id: randomKey(), type: 'select' }],
    seedingCostsTotal: '0',
    maintenanceCosts: [
      { name: '', price: '', id: randomKey(), type: 'select' },
    ],
    maintenanceCostsTotal: '0',
    totalExpenses: 0,
    harvestTonnes: '',
    harvestIncome: '',
  });

  const handleOnNext = (value: any): void => {
    setCurrentStep(1);
    setLineData(prev => ({ ...prev, ...value }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOnPrev = (data: IBudgetLocal, skip: boolean): void => {
    setCurrentStep(0);
    setBudget(data);
    skipOrigin.current = skip;
  };

  const isFarmData = (paramsId: { idFarm: string }, { farms }: any) => {
    const newFarm = farms.farmsData.filter((farm: { id: string | number }) => {
      return farm.id.toString() === paramsId.idFarm;
    });

    if (newFarm.length) {
      return newFarm[0];
    }

    return {};
  };

  const farmData = useSelector<IRootState, IFarmData>(
    isFarmData.bind(null, params),
  );

  useEffect(() => {
    if (Object.values(farmData).length) {
      let name = '0';
      if (!farmData?.lines?.length) {
        name = '1';
      } else {
        let nNum = farmData?.lines?.reduce((acum: any, curent: any): any => {
          return acum < Number(curent.line_name)
            ? Number(curent.line_name)
            : acum;
        }, 0);

        if (farmData?.lines?.length > nNum) {
          nNum = farmData?.lines?.length;
        }

        name = `${nNum + 1}`;
      }

      setLineData(prev => ({ ...prev, line_name: name, farm_id: farmData.id }));
    }
  }, [farmData]);

  return (
    <div className='h-calc-80 bg-main'>
      <div className='container w-100'>
        <div className='add-line d-flex'>
          <div className='steps'>
            <StepsComponent
              className='h-max mt-60'
              current={currentStep}
              direction={width < 768 ? 'horizontal' : 'vertical'}
              items={stepsItems}
            />
          </div>
          {currentStep === 0 && (
            <LineDetails onNext={handleOnNext} lineData={lineData} />
          )}
          {currentStep === 1 && (
            <LineBudget
              onPrev={handleOnPrev}
              lineData={lineData}
              budgetOrig={budget}
              skipOrigin={skipOrigin.current}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddLines;
