const validationForZeroMinus = (value: string | number): string => {
  const newValue = value.toString().split('');
  const validValue = newValue
    .filter((word, i) => {
      if (i === 0) {
        return Number(word) !== 0;
      }

      return word;
    })
    .filter(word => word !== '-')
    .join('');

  return validValue;
};

export default validationForZeroMinus;
