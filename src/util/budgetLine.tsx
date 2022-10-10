import { IRowPayload } from '../store/budget/budget.type';
import { getInterest } from './getInterest';

export const getBudgetByLine = (defaultData: any): IRowPayload[] => {
  let counter = 1;
  const rows: IRowPayload[] = [
    {
      name: 'Harvest',
      key: '1',
    },
  ];
  counter += 1;
  const length = getInterest(
    defaultData?.lines[0]?.line_budget[0]?.length_actual,
    defaultData?.lines[0]?.line_budget[0]?.length_budget
      ? Number(defaultData?.lines[0]?.line_budget[0]?.length_budget)
      : null,
  );
  rows.push({
    name: 'Length',
    budgeted: defaultData?.lines[0]?.line_budget[0]?.length_budget || 0,
    actual: defaultData?.lines[0]?.line_budget[0]?.length_actual || 0,
    var: {
      ...length,
    },
    key: counter.toString(),
    budget_id: defaultData?.lines[0]?.line_budget[0]?.budget_id,
    data_row: 'length',
    farm_id: defaultData?.farm_id,
  });

  const harvestTonnes = getInterest(
    defaultData?.lines[0]?.line_budget[0]?.planned_harvest_tones_actual,
    defaultData?.lines[0]?.line_budget[0]?.planned_harvest_tones
      ? Number(defaultData?.lines[0]?.line_budget[0]?.planned_harvest_tones)
      : null,
  );
  counter += 1;
  rows.push({
    name: 'Harvest tonnes',
    budgeted: defaultData?.lines[0]?.line_budget[0]?.planned_harvest_tones || 0,
    actual:
      defaultData?.lines[0]?.line_budget[0]?.planned_harvest_tones_actual || 0,
    var: {
      ...harvestTonnes,
    },
    key: counter.toString(),
    budget_id: defaultData?.lines[0]?.line_budget[0]?.budget_id,
    data_row: 'planned_harvest_tones',
    farm_id: defaultData?.farm_id,
  });

  counter += 1;
  rows.push({
    name: 'Income',
    key: counter.toString(),
  });

  const harvestIncome = getInterest(
    defaultData?.lines[0]?.line_budget[0]?.budgeted_harvest_income_actual,
    defaultData?.lines[0]?.line_budget[0]?.budgeted_harvest_income
      ? Number(defaultData?.lines[0]?.line_budget[0]?.budgeted_harvest_income)
      : null,
  );

  counter += 1;
  rows.push({
    name: 'Harvest income',
    budgeted:
      defaultData?.lines[0]?.line_budget[0]?.budgeted_harvest_income || 0,
    actual:
      defaultData?.lines[0]?.line_budget[0]?.budgeted_harvest_income_actual ||
      0,
    var: {
      ...harvestIncome,
    },
    key: counter.toString(),
    budget_id: defaultData?.lines[0]?.line_budget[0]?.budget_id,
    data_row: 'budgeted_harvest_income',
    farm_id: defaultData?.farm_id,
  });

  counter += 1;
  rows.push({
    name: 'Expenses',
    key: counter.toString(),
  });

  counter += 1;
  const allSeed: any = {
    name: 'Seeding cost',
    budgeted: 0,
    actual: 0,
    var: {},
    key: counter.toString(),
    budget_id: defaultData?.lines[0]?.line_budget[0]?.budget_id,
    farm_id: defaultData?.farm_id,
  };

  counter += 1;
  const seeds: IRowPayload[] = [];
  defaultData?.lines[0]?.line_budget[0]?.expenses.filter(
    (expense: any, index: number) => {
      if (expense?.type === 's') {
        const values = getInterest(
          Number(expense?.price_actual),
          Number(expense?.price_budget),
        );
        seeds.push({
          name: expense?.expenses_name,
          budgeted: expense?.price_budget,
          actual: expense?.price_actual,
          var: {
            ...values,
            isReverse: true,
          },
          isBg: index % 2 !== 1,
          key: counter.toString(),
          budget_id: defaultData?.lines[0]?.line_budget[0]?.budget_id,
          data_row: 'price',
          expenses_id: expense.id,
          farm_id: defaultData?.farm_id,
          expense_date: expense?.expense_date,
          rdata: expense.rdata,
        });

        allSeed.budgeted += Number(expense?.price_budget);
        allSeed.actual += Number(expense?.price_actual);
        counter += 1;
      }
      return null;
    },
  );

  const valSeed = getInterest(allSeed?.actual, Number(allSeed?.budgeted));

  allSeed.var = { ...valSeed, isReverse: true };

  rows.push(allSeed);

  seeds.map((seedItem: any) => {
    rows.push(seedItem);
    return null;
  });

  counter += 1;
  const allMain: any = {
    name: 'Maintenance cost',
    budgeted: 0,
    actual: 0,
    var: {},
    key: counter.toString(),
    budget_id: defaultData?.lines[0]?.line_budget[0]?.budget_id,
    farm_id: defaultData?.farm_id,
  };

  counter += 1;
  const main: IRowPayload[] = [];
  defaultData?.lines[0]?.line_budget[0]?.expenses.filter(
    (expense: any, index: number) => {
      if (expense?.type === 'm') {
        const values = getInterest(
          Number(expense?.price_actual),
          Number(expense?.price_budget),
        );
        main.push({
          name: expense?.expenses_name,
          budgeted: expense?.price_budget,
          actual: expense?.price_actual,
          var: {
            ...values,
            isReverse: true,
          },
          isBg: index % 2 !== 1,
          key: counter.toString(),
          budget_id: defaultData?.lines[0]?.line_budget[0]?.budget_id,
          data_row: 'price',
          expenses_id: expense.id,
          farm_id: defaultData?.farm_id,
          expense_date: expense?.expense_date,
          rdata: expense.rdata,
        });

        allMain.budgeted += Number(expense?.price_budget);
        allMain.actual += Number(expense?.price_actual);
        counter += 1;
      }
      return null;
    },
  );

  const valMain = getInterest(allMain?.actual, Number(allMain?.budgeted));
  allMain.var = { ...valMain, isReverse: true };

  rows.push(allMain);

  main.map((mainItem: any) => {
    rows.push(mainItem);
    return null;
  });

  const total = getInterest(
    allMain.actual + allSeed?.actual,
    allMain.budgeted + allSeed?.budgeted,
  );

  counter += 1;
  rows.push({
    name: 'Total expenses',
    budgeted: allMain?.budgeted + allSeed?.budgeted,
    actual: allMain?.actual + allSeed?.actual,
    var: {
      ...total,
      isReverse: true,
    },
    key: counter.toString(),
    budget_id: defaultData?.lines[0]?.line_budget[0]?.budget_id,
    farm_id: defaultData?.farm_id,
  });

  counter += 1;
  const income = defaultData?.lines[0]?.line_budget[0]?.budgeted_harvest_income
    ? defaultData?.lines[0]?.line_budget[0]?.budgeted_harvest_income
    : 0;
  const income_actual = defaultData?.lines[0]?.line_budget[0]
    ?.budgeted_harvest_income_actual
    ? defaultData?.lines[0]?.line_budget[0]?.budgeted_harvest_income_actual
    : 0;
  const budgetedProfit = income - (allMain.budgeted + allSeed.budgeted);
  const actualProfit = income_actual - (allMain?.actual + allSeed?.actual);

  const interestProfit = getInterest(actualProfit, budgetedProfit);

  const profit: IRowPayload = {
    name: 'Profit',
    budgeted:
      budgetedProfit % 1 === 0
        ? budgetedProfit.toString()
        : budgetedProfit.toFixed(2),
    actual:
      actualProfit % 1 === 0
        ? actualProfit.toString()
        : actualProfit.toFixed(2),
    var: {
      ...interestProfit,
    },
    key: counter.toString(),
    budget_id: defaultData?.lines[0]?.line_budget[0]?.budget_id,
    farm_id: defaultData?.farm_id,
  };
  rows.splice(5, 0, profit);

  return rows;
};
