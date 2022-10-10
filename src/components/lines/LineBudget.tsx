import React, { FC, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { IRootState } from '../../store/rootReducer';
import { IBudget } from '../../store/farms/farms.type';
import { addLine, showFeedback } from '../../store/farms/farms.actions';
import { IUtilState, IUtilData } from '../../store/utils/utils.type';
import { getUtilData } from '../../store/utils/utils.actions';
import { IMainList } from '../../types/basicComponentsTypes';
import { ILineData, IBudgetLocal } from '../../types/farmTypes';
import { useWidth } from '../../util/useWidth';
import randomKey from '../../util/randomKey';
import validPrice from '../../util/validPrice';

import {
  Input,
  Title,
  Button,
  Dropdown,
  DollarIcon,
  Paragrapgh,
  Subtitle,
  CloseIcon,
  PlusIcon,
} from '../shared';

import './styles.scss';

interface ILineBudget {
  onPrev: (data: IBudgetLocal, isSkip: boolean) => void;
  lineData: ILineData;
  budgetOrig: IBudgetLocal;
  skipOrigin: boolean;
}

const LineBudget: FC<ILineBudget> = ({
  onPrev,
  lineData,
  budgetOrig,
  skipOrigin,
}) => {
  const width = useWidth();
  const history = useHistory();
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);
  const isSkip = useRef(false);

  const seedData = useSelector<IRootState, IUtilState['seeds']>(
    state => state.utils.seeds,
  );

  const maintenanceData = useSelector<IRootState, IUtilState['maintenances']>(
    state => state.utils.maintenances,
  );

  useEffect(() => {
    dispatch(getUtilData('all', history));
  }, []);

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

  const handleSkip = (): void => {
    if (!isSkip.current) {
      isSkip.current = true;
    }
  };

  const handleOnSelectType = (value: string, type: number, id: string) => {
    handleSkip();
    if (type === 1) {
      const seedingCosts = budget.seedingCosts.map(cost => {
        if (cost.id === id) {
          const newCost = { ...cost };
          newCost.name = value;
          return newCost;
        }

        return cost;
      });

      setBudget(prev => ({ ...prev, seedingCosts }));
    }
    if (type === 2) {
      const maintenanceCosts = budget.maintenanceCosts.map(cost => {
        if (cost.id === id) {
          const newCost = { ...cost };
          newCost.name = value;
          return newCost;
        }

        return cost;
      });

      setBudget(prev => ({ ...prev, maintenanceCosts }));
    }
  };

  const handleOnAddLine = (type: number) => {
    if (!isSkip.current) {
      handleSkip();
    }
    if (type === 1) {
      setBudget(prev => ({
        ...prev,
        seedingCosts: [
          ...prev.seedingCosts,
          { name: '', price: '', id: randomKey(), type: 'select' },
        ],
      }));
    }
    if (type === 2) {
      setBudget(prev => ({
        ...prev,
        maintenanceCosts: [
          ...prev.maintenanceCosts,
          { name: '', price: '', id: randomKey(), type: 'select' },
        ],
      }));
    }
  };

  const handleOnAddCustomLine = (type: number) => {
    if (!isSkip.current) {
      handleSkip();
    }
    if (type === 1) {
      setBudget(prev => ({
        ...prev,
        seedingCosts: [
          ...prev.seedingCosts,
          { name: '', price: '', id: randomKey(), type: 'text' },
        ],
      }));
    }
    if (type === 2) {
      setBudget(prev => ({
        ...prev,
        maintenanceCosts: [
          ...prev.maintenanceCosts,
          { name: '', price: '', id: randomKey(), type: 'text' },
        ],
      }));
    }
  };

  const handleOnDeleteLine = (type: number, id: string) => {
    if (!isSkip.current) {
      handleSkip();
    }
    if (type === 1) {
      const newCosts = budget.seedingCosts.filter(cost => cost.id !== id);

      const sumSeedingCosts = newCosts.reduce((acum, cost) => {
        return acum + Number(cost.price);
      }, 0);

      const totalExpenses =
        sumSeedingCosts + Number(budget.maintenanceCostsTotal);
      setBudget(prev => ({
        ...prev,
        seedingCosts: newCosts,
        seedingCostsTotal: String(sumSeedingCosts),
        totalExpenses,
      }));
    }
    if (type === 2) {
      const newCosts = budget.maintenanceCosts.filter(cost => cost.id !== id);

      const sumSeedingCosts = newCosts.reduce((acum, cost) => {
        return acum + Number(cost.price);
      }, 0);

      const totalExpenses = sumSeedingCosts + Number(budget.seedingCostsTotal);
      // const totalExpenses = isNumThousand(sumExpenses);
      setBudget(prev => ({
        ...prev,
        maintenanceCosts: newCosts,
        maintenanceCostsTotal: String(sumSeedingCosts),
        totalExpenses,
      }));
    }
  };

  const validValueNoNull = (value: any): any => {
    const newValue = value.toString().split('');
    const validValue = newValue
      .filter((word: any) => word !== '-')
      .filter((word: any, i: number) => {
        if (i === 0) {
          return word !== '0';
        }
        return word;
      })
      .join('');

    return validValue;
  };

  const handleOnPrice = (value: string, type: number, id: string) => {
    if (!isSkip.current) {
      handleSkip();
    }
    if (type === 1) {
      const seedingCosts2 = budget.seedingCosts.map(cost => {
        if (cost.id === id) {
          const newCost = { ...cost };
          if (!value && cost.price.length > 1) {
            newCost.price = cost.price;
            return newCost;
          }
          const priceValue = validPrice(value);

          newCost.price = priceValue;
          return newCost;
        }
        return cost;
      });

      const sumSeedingCosts = seedingCosts2.reduce((acum, cost) => {
        return acum + Number(cost.price);
      }, 0);

      const totalExpenses = (
        sumSeedingCosts + Number(budget.maintenanceCostsTotal)
      ).toFixed(2);

      setBudget(prev => ({
        ...prev,
        seedingCosts: seedingCosts2,
        seedingCostsTotal: String(sumSeedingCosts),
        totalExpenses: Number(totalExpenses),
      }));
    }

    if (type === 2) {
      const seedingCosts2 = budget.maintenanceCosts.map(cost => {
        if (cost.id === id) {
          const newCost = { ...cost };
          if (!value && cost.price.length > 1) {
            newCost.price = cost.price;
            return newCost;
          }

          const priceValue = validPrice(value);
          newCost.price = priceValue;
          return newCost;
        }
        return cost;
      });

      const sumCosts = seedingCosts2.reduce((acum, cost) => {
        return acum + Number(cost.price);
      }, 0);

      const totalExpenses = (
        sumCosts + Number(budget.seedingCostsTotal)
      ).toFixed(2);

      setBudget(prev => ({
        ...prev,
        maintenanceCosts: seedingCosts2,
        maintenanceCostsTotal: String(sumCosts),
        totalExpenses: Number(totalExpenses),
      }));
    }
  };

  const handlePlanned = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    if (name === 'harvestTonnes') {
      const valueNoNull = validValueNoNull(value);
      setBudget(prev => ({ ...prev, [name]: valueNoNull }));
    }

    if (name === 'harvestIncome') {
      const priceValue = validPrice(value);
      setBudget(prev => ({ ...prev, [name]: priceValue }));
    }
  };

  const handleOnPrev = () => {
    onPrev(budget, isSkip.current);
  };

  const validBudget = (): boolean => {
    const isSeedingCosts = budget.seedingCosts.filter(cost => {
      return (
        (cost.name.length > 1 && cost.price === '') ||
        (cost.price.length > 1 && cost.name === '')
      );
    });

    if (isSeedingCosts.length) {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Fill in all the fields seeding cost',
        }),
      );
      return false;
    }
    const isMaintenanceCosts = budget.maintenanceCosts.filter(cost => {
      return (
        (cost.name.length > 1 && cost.price === '') ||
        (cost.price.length > 1 && cost.name === '')
      );
    });

    if (isMaintenanceCosts.length) {
      dispatch(
        showFeedback({
          isMessage: true,
          type: 'error',
          message: 'Fill in all the fields maintenanceCosts cost',
        }),
      );
      return false;
    }

    return true;
  };

  const budgetData = (budgetD: any): any => {
    const data: IBudget = {};
    const seedingCosts = budgetD.seedingCosts
      .filter((cost: any) => cost.name.length >= 1 && cost.price.length >= 1)
      .map((cost: any) => {
        const { name, price } = cost;
        return {
          price_budget: price,
          price_actual: 0,
          expenses_name: name,
          type: 's',
        };
      });
    const maintenanceCosts = budgetD.maintenanceCosts
      .filter((cost: any) => cost.name.length >= 1 && cost.price.length >= 1)
      .map((cost: any) => {
        const { name, price } = cost;
        return {
          price_budget: price,
          price_actual: 0,
          expenses_name: name,
          type: 'm',
        };
      });

    if (seedingCosts.length) {
      data.expenses = seedingCosts;
    }
    if (maintenanceCosts.length) {
      if (data.expenses) {
        data.expenses = data.expenses.concat(maintenanceCosts);
      } else {
        data.expenses = maintenanceCosts;
      }
    }

    if (budget.harvestTonnes.length) {
      data.planned_harvest_tones = budgetD.harvestTonnes;
    }

    if (budget.harvestIncome.length) {
      data.budgeted_harvest_income = budgetD.harvestIncome;
    }
    return data;
  };

  const handleConfirm = async () => {
    const isValidBudget = validBudget();
    if (isValidBudget) {
      const budgetValid = budgetData(budget);
      setDisabled(true);
      await dispatch(addLine(lineData, budgetValid, history));
    }
  };

  useEffect(() => {
    setBudget(budgetOrig);
    isSkip.current = skipOrigin;
  }, [budgetOrig]);

  return (
    <>
      <div className='content budget pb-40 farms__line-budget'>
        <Title
          className='mb-16'
          size={5}
          color='black'
          align='default'
          fontWeight={700}
        >
          Budget
        </Title>
        <div className='line-bottom pb-16 mb-12'>
          <Title size={6} color='default' align='left' fontWeight={500}>
            Planned expenses
          </Title>
        </div>
        <Paragrapgh
          className='mb-12'
          size={1}
          color='black-3'
          align='left'
          fontWeight={500}
        >
          Seeding cost
        </Paragrapgh>
        <div>
          {budget.seedingCosts.map(seedingCost => (
            <div
              className='mb-12 budget__seeding pos-relative d-flex align-items-center justify-content-between farms__line-budget__inputs'
              key={seedingCost.id}
            >
              <div className='budget__wrapper'>
                {seedingCost.type === 'select' && (
                  <Dropdown
                    className='mr-16 w-100'
                    placeholder='seed name'
                    onChange={(value, event) =>
                      handleOnSelectType(value, 1, seedingCost.id)
                    }
                    label='Seed name'
                    options={seedData.map(
                      (seed: IUtilData) =>
                        ({
                          value: seed.name,
                          label: seed.name,
                          id: seed.id,
                        } as IMainList),
                    )}
                    defaultValue={
                      seedingCost.name ? seedingCost.name : undefined
                    }
                  />
                )}
                {seedingCost.type === 'text' && (
                  <Input
                    type='text'
                    onChange={e =>
                      handleOnSelectType(e.target.value, 1, seedingCost.id)
                    }
                    className='mr-16 w-100'
                    value={seedingCost.name}
                    label='Seed name'
                    placeholder='seed name'
                  />
                )}
              </div>
              <div className='budget__price-wrapper pl-16'>
                <Input
                  type='number'
                  onChange={e =>
                    handleOnPrice(e.target.value, 1, seedingCost.id)
                  }
                  value={seedingCost.price.toString()}
                  unit={<DollarIcon />}
                  label='Price'
                  placeholder='0'
                />
              </div>
              <span
                className='budget__close-icon'
                onKeyDown={() => undefined}
                onClick={() => handleOnDeleteLine(1, seedingCost.id)}
                role='button'
                tabIndex={0}
              >
                <CloseIcon />
              </span>
            </div>
          ))}
        </div>
        <div className='d-flex'>
          <Button
            className='pt-7 pb-7 pl-10 pr-10'
            color='blue'
            size={0}
            width={width < 768 ? 'wide' : 'default'}
            type='bordered'
            isNoneBorder={width > 767}
            iconLeft
            onClick={() => handleOnAddLine(1)}
          >
            <span className='mr-4 ml-6 font-size-0'>
              <PlusIcon />
            </span>
            <span className='mr-6'>Add</span>
          </Button>
          <Button
            className='pt-7 pb-7 pl-10 pr-10'
            color='blue'
            size={0}
            width={width < 768 ? 'wide' : 'default'}
            type='bordered'
            isNoneBorder={width > 767}
            iconLeft
            onClick={() => handleOnAddCustomLine(1)}
          >
            <span className='mr-4 ml-6 font-size-0'>
              <PlusIcon />
            </span>
            <span className='mr-6'>Add Custom</span>
          </Button>
        </div>
        <div className='mb-12 pt-16 line-bottom' />
        <Paragrapgh
          className='mb-12 '
          size={1}
          color='black-3'
          align='left'
          fontWeight={500}
        >
          Maintenance cost
        </Paragrapgh>
        <div>
          {budget.maintenanceCosts.map(maintenanceCost => (
            <div
              className='mb-12 budget__maintenance pos-relative d-flex align-items-center justify-content-between farms__line-budget__inputs'
              key={maintenanceCost.id}
            >
              <div className='budget__wrapper'>
                {maintenanceCost.type === 'select' && (
                  <Dropdown
                    className='mr-16 w-100'
                    placeholder='maintenance name'
                    onChange={(value, event) =>
                      handleOnSelectType(value, 2, maintenanceCost.id)
                    }
                    label='Maintenance name'
                    options={
                      maintenanceData &&
                      maintenanceData.map(
                        (maintenance: IUtilData) =>
                          ({
                            value: maintenance.name,
                            label: maintenance.name,
                            id: maintenance.id,
                          } as IMainList),
                      )
                    }
                    defaultValue={
                      maintenanceCost.name ? maintenanceCost.name : undefined
                    }
                  />
                )}
                {maintenanceCost.type === 'text' && (
                  <Input
                    className='mr-16'
                    type='text'
                    value={maintenanceCost.name}
                    placeholder='new maintenance'
                    onChange={e =>
                      handleOnSelectType(e.target.value, 2, maintenanceCost.id)
                    }
                    label='Maintenance name'
                  />
                )}
              </div>
              <div className='budget__price-wrapper pl-16'>
                <Input
                  type='number'
                  onChange={e =>
                    handleOnPrice(e.target.value, 2, maintenanceCost.id)
                  }
                  value={maintenanceCost.price.toString()}
                  unit={<DollarIcon />}
                  label='Price'
                  placeholder='0'
                />
              </div>
              <span
                className='budget__close-icon'
                onKeyDown={() => undefined}
                onClick={() => handleOnDeleteLine(2, maintenanceCost.id)}
                role='button'
                tabIndex={0}
              >
                <CloseIcon />
              </span>
            </div>
          ))}
        </div>
        <div className='d-flex'>
          <Button
            className='pt-7 pb-7'
            color='blue'
            size={0}
            width={width < 768 ? 'wide' : 'default'}
            type='bordered'
            isNoneBorder={width > 767}
            iconLeft
            onClick={() => handleOnAddLine(2)}
          >
            <span className='mr-4 ml-6 font-size-0'>
              <PlusIcon />
            </span>
            <span className='mr-6'>Add</span>
          </Button>
          <Button
            className='pt-7 pb-7'
            color='blue'
            size={0}
            width={width < 768 ? 'wide' : 'default'}
            type='bordered'
            isNoneBorder={width > 767}
            iconLeft
            onClick={() => handleOnAddCustomLine(2)}
          >
            <span className='mr-4 ml-6 font-size-0'>
              <PlusIcon />
            </span>
            <span className='mr-6'>Add Custom</span>
          </Button>
        </div>
        <div className='mb-18 pt-16 line-bottom' />
        <div className='pb-16 mb-28 line-bottom d-flex align-items-center justify-content-between'>
          <Paragrapgh size={1} color='default' align='left' fontWeight={400}>
            Total expenses:
          </Paragrapgh>
          <Subtitle size={1} color='black' align='left' fontWeight={600}>
            $ {budget.totalExpenses}
          </Subtitle>
        </div>
        <Title
          size={6}
          color='default'
          align='left'
          fontWeight={500}
          className='pb-17'
        >
          Planned incomes
        </Title>
        <Input
          type='number'
          className='mb-12'
          onChange={handlePlanned}
          value={budget.harvestTonnes}
          label='Planned harvest tonnes'
          placeholder='planned harvest tonnes'
          name='harvestTonnes'
        />
        <Input
          type='number'
          onChange={handlePlanned}
          value={budget.harvestIncome}
          unit={<DollarIcon />}
          label='Budgeted harvest income'
          placeholder='budgeted harvest income'
          name='harvestIncome'
        />
        <div className='mt-32 line-button d-flex justify-content-end align-items-center'>
          <Button
            width={width < 769 ? 'wide' : 'small'}
            size={1}
            type='transparent'
            color='blue'
            onClick={handleOnPrev}
          >
            Back
          </Button>
          <Button
            width={width < 769 ? 'wide' : 'small'}
            size={1}
            type='fill'
            color='blue'
            className='ml-16'
            onClick={handleConfirm}
            disabled={disabled}
          >
            {isSkip.current ? <>Confirm</> : <>Skip and confirm</>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default LineBudget;
