import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { IRootState } from '../store/rootReducer';

import { Title, Spinner, Paragrapgh, Feedback } from '../components/shared';
import { useWidth } from '../util/useWidth';
import BudgetTable from '../components/budget/BudgetTable';
import InterestGrowth from '../components/shared/tables-card/InterestGrowth';
import { BudgetState } from '../store/budget/budget.type';
import { deleteMessage, getBudget } from '../store/budget/budget.action';

const Budget: FC = (): ReactElement => {
  const width = useWidth();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isSpinner, setIsSpinner] = useState(false);
  const [totalValues, setTotalValues] = useState<any[]>([]);
  const [farms, setFarms] = useState<any>();
  const budgetMessageStore = useSelector<IRootState, BudgetState['message']>(
    state => state.budget.message,
  );
  const totalMessageStore = useSelector<IRootState, BudgetState['total']>(
    state => state.budget.total,
  );
  const budgetStore = useSelector<IRootState, BudgetState['budget']>(
    state => state.budget.budget,
  );

  const total = [
    {
      name: 'Total length',
      value: 'm',
    },
    {
      name: 'Total seeding cost',
      value: '$',
    },
    {
      name: 'Total maintenance cost',
      value: '$',
    },
    {
      name: 'Total harvest tonnes',
      value: '0',
    },
    {
      name: 'Total harvest income',
      value: '$',
    },
  ];

  const getDataFarms = async () => {
    setIsSpinner(true);
    await dispatch(getBudget(history));
    setIsSpinner(false);
  };

  useEffect(() => {
    setFarms(budgetStore);
  }, [budgetStore]);

  useEffect(() => {
    getDataFarms();
  }, []);

  useEffect(() => {
    if (budgetMessageStore.message) {
      setTimeout(() => {
        dispatch(deleteMessage());
      }, 3000);
    }
  }, [budgetMessageStore.message]);

  useEffect(() => {
    const newTotal = total.map(item => {
      if (item.name === 'Total length') {
        return {
          ...item,
          ...totalMessageStore?.length,
          value: `${
            totalMessageStore?.length?.value
              ? totalMessageStore?.length?.value
              : 0
          } m`,
        };
      }
      if (item.name === 'Total seeding cost') {
        return {
          ...item,
          ...totalMessageStore?.seedingCost,
          value: `$${
            totalMessageStore?.seedingCost?.value
              ? totalMessageStore?.seedingCost?.value
              : 0
          }`,
        };
      }
      if (item.name === 'Total maintenance cost') {
        return {
          ...item,
          ...totalMessageStore?.maintenanceCost,
          value: `$${
            totalMessageStore?.maintenanceCost?.value
              ? totalMessageStore?.maintenanceCost?.value
              : 0
          }`,
        };
      }
      if (item.name === 'Total harvest tonnes') {
        return {
          ...item,
          ...totalMessageStore?.harvestTonnes,
          value: totalMessageStore?.harvestTonnes?.value
            ? totalMessageStore?.harvestTonnes?.value
            : 0,
        };
      }
      if (item.name === 'Total harvest income') {
        return {
          ...item,
          ...totalMessageStore?.harvestIncome,
          value: `$${
            totalMessageStore?.harvestIncome?.value
              ? totalMessageStore?.harvestIncome?.value
              : 0
          }`,
        };
      }
      return null;
    });

    setTotalValues(newTotal);
  }, [totalMessageStore]);

  useEffect(() => {
    if (budgetMessageStore.message) {
      setTimeout(() => {
        dispatch(deleteMessage());
      }, 3000);
    }
  }, [budgetMessageStore.message]);

  return (
    <div className='budget bg-secondary min-height'>
      <div className='container'>
        <Title
          className={width > 768 ? 'pl-21 pt-32 pb-34' : 'pb-14 pt-20'}
          size={5}
          color='black-3'
          align='default'
          fontWeight={700}
        >
          Budget
        </Title>
        {isSpinner ? (
          <div className='mt-20'>
            <Spinner />
          </div>
        ) : (
          <>
            <div className='budget__title-line'>
              {totalValues.map(item => (
                <div key={item.name} className='budget__item'>
                  <Paragrapgh
                    size={3}
                    color='black-2'
                    align='left'
                    fontWeight={400}
                  >
                    {item.name}
                  </Paragrapgh>
                  <div className='d-flex align-items-center'>
                    <Paragrapgh
                      className={width > 768 ? 'pr-10' : 'pr-4'}
                      size={width > 768 ? 1 : 2}
                      color='black'
                      align='left'
                      fontWeight={width > 768 ? 500 : 400}
                    >
                      {item.value}
                    </Paragrapgh>
                    {(item?.isGrow === true || item?.isGrow === false) && (
                      <InterestGrowth
                        isGrow={item.isGrow}
                        interest={item.interest}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div
              className={
                width > 768 ? 'd-flex justify-content-between pl-15 pr-15' : ''
              }
            >
              <div className='width-100 pos-relative'>
                <BudgetTable data={farms} column='isBudget' />
              </div>
            </div>
          </>
        )}
      </div>
      {budgetMessageStore.message && (
        <Feedback
          message={budgetMessageStore.message}
          type={
            budgetMessageStore.message === 'Success' ||
            budgetMessageStore.message === 'success'
              ? 'success'
              : 'error'
          }
          theme='light'
          isGlobal
        />
      )}
    </div>
  );
};

export default Budget;
