const isNumThousand = (isThousand: any): any => {
  const val = isThousand.toString().split('');
  const newVa = val.filter((word: string, i: number) => {
    return word !== '-';
  });
  const newVal = newVa.filter((word: string, i: number) => {
    if (i === 0) {
      return word !== '0';
    }

    return !Number.isNaN(Number(word));
  });

  newVal.reverse();
  newVal.splice(3, 0, '.');
  newVal.reverse();

  const newVal2 = newVal.filter((word: string, i: number) => {
    if (i === 0) {
      return !Number.isNaN(Number(word));
    }

    return word;
  });
  const newVal3 = newVal2.filter((word: string, i: number) => {
    if (i === 0) {
      return !Number.isNaN(Number(word));
    }

    return word;
  });

  return newVal3.join('');
};
export default isNumThousand;
