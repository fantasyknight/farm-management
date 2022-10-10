import { IValues } from '../store/budget/budget.type';

export const getInterest = (
  firstValue: number,
  secondValue: number | null,
): IValues => {
  let interest;
  let values: IValues = {};
  if (secondValue !== null && secondValue !== 0) {
    interest = ((firstValue - secondValue) / secondValue) * 100;
    values = {
      isGrow: !(secondValue > firstValue),
      interest: Number(Math.abs(interest).toFixed(2)),
      value: firstValue,
    };
  } else if (secondValue === 0) {
    values = {
      isGrow: !(+firstValue < 0),
      interest: +firstValue === 0 ? 0 : 100,
      value: firstValue,
    };
  } else if (secondValue === null) {
    values = {
      isGrow: true,
      interest: 0,
      value: firstValue,
    };
  } else {
    values = {
      value: firstValue,
    };
  }

  return values;
};
