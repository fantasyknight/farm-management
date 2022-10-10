const validPrice = (value: string | number): string => {
  const splitValue = value
    .toString()
    .split('')
    .filter((word: string) => word !== '-');
  let length: number | undefined;
  let newPrice = splitValue.join('');

  if (
    splitValue.length >= 2 &&
    splitValue[0] === '0' &&
    splitValue[1] !== '.'
  ) {
    return splitValue[1];
  }

  splitValue.forEach((word: any, i: number) => {
    if (word === '.') {
      length = i;
    }
  });

  if (length) {
    const valueBefore: any = [];
    const valueAffter: any = [];

    splitValue.forEach((word: any, i: number) => {
      if (length !== undefined && i <= length) {
        valueBefore.push(word);
      }
      if (length !== undefined && i > length) {
        valueAffter.push(word);
      }
    });

    let newValidValue = [...valueBefore];
    if (valueAffter[0]) {
      newValidValue = [...valueBefore, valueAffter[0]];
    }
    if (valueAffter[1]) {
      newValidValue = [...valueBefore, valueAffter[0], valueAffter[1]];
    }

    newPrice = newValidValue.join('');
  }

  return newPrice;
};

export default validPrice;
