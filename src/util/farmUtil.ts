export const transformFarmData = (data: any = []): any => {
  const newData = data.map((farm: any) => {
    if (farm?.lines?.length) {
      const newLines = farm?.lines.map((line: any) => {
        if (!line?.group?.length) {
          const lineObj = {
            seeded_date: '',
            planned_date: '',
            seed: '',
            profit_per_meter: '',
            condition: '',
            color: '',
          };
          const newLine = { ...line, ...lineObj };
          return newLine;
        }

        if (line?.group?.length) {
          const lineObj = {
            seeded_date: Number(line?.group[0]?.planned_date),
            planned_date: Number(line?.group[0]?.planned_date_harvest),
            seed: line?.group[0]?.seed,
            profit_per_meter: line?.group[0]?.profit_per_meter,
            condition: line?.group[0]?.condition,
            color: line?.group[0]?.color,
          };
          const newLine = { ...line, ...lineObj };

          return newLine;
        }
        return line;
      });
      const newFarm = { ...farm, lines: newLines };
      return newFarm;
    }
    return farm;
  });
  return newData;
};

export const transformFarmWithKey = (data: any = []): any => {
  const dataWithKey = data.map((farm: any, i: number) => {
    const newFarm = { ...farm };
    newFarm.key = i + 1;

    const newLines = farm?.lines?.map((line: any, y: number) => {
      const newLine = { ...line };
      newLine.key = y + 1;
      return newLine;
    });

    return { ...newFarm, lines: newLines };
  });

  return dataWithKey;
};

export const transformUtil = (category: string, data: any = []): any => {
  const utilData = data.filter((util: any) => {
    return util.type === category.toLowerCase();
  });

  const utilDataWithKey = utilData.map((seed: any, i: number) => ({
    ...seed,
    key: i + 1,
  }));

  return utilDataWithKey;
};
