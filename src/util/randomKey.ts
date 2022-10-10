const randomKey = (): string => {
  const key = `${Math.random().toString(36).substr(2, 9)}`;
  return key;
};

export default randomKey;
