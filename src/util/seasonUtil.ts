export const transformSeason = (data: any = []): any => {
  const utilDataWithKey = data.map((season: any) => ({
    ...season,
    key: season.id,
  }));

  return utilDataWithKey;
};
