const validationForZeroMinus = (value: string | number): string => {
  const newValue = value.toString().split('');
  const validValue = newValue
    .filter((word, i) => {
      if (i === 0 && word === '0') return !(newValue.length - 1);
      return word;
    })
    .filter(word => word !== '-')
    .join('');

  return validValue;
};

export default validationForZeroMinus;
