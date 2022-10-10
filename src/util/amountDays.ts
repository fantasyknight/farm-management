const amountDays = (time: number | undefined | null): string => {
  if (time === null) {
    return '0 days';
  }

  if (Number(time) === 1) {
    return '1 day';
  }

  return `${time} days`;
};

export default amountDays;
