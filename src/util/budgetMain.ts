import { IBudgetPayload } from '../store/budget/budget.type';
import { getInterest } from './getInterest';

export const getBudgetMain = (data: any) => {
  const totalArray: any = [
    {
      length: 0,
      seedingCost: 0,
      maintenanceCost: 0,
      harvestTonnes: 0,
      harvestIncome: 0,
    },
  ];
  const budget: IBudgetPayload[] = data.map((item: any, index: number) => {
    const totalFarmArray: any = [
      {
        totalLength: 0,
        totalSeedingCost: 0,
        totalMaintenanceCost: 0,
        totalHarvestTonnes: 0,
        totalHarvestIncome: 0,
      },
    ];

    const lines = item?.lines.map((line: any, indexArray: number) => {
      if (line?.line_budget?.length) {
        totalFarmArray[0].totalLength += Number(
          line.line_budget[0]?.length_actual,
        );
        totalFarmArray[0].totalHarvestTonnes += Number(
          line.line_budget[0]?.planned_harvest_tones_actual,
        );
        totalFarmArray[0].totalHarvestIncome += Number(
          line.line_budget[0]?.budgeted_harvest_income_actual,
        );
      }
      if (line.line_budget.length > 1) {
        if (totalFarmArray.length === 1) {
          totalFarmArray.push({
            totalLength: 0,
            totalSeedingCost: 0,
            totalMaintenanceCost: 0,
            totalHarvestTonnes: 0,
            totalHarvestIncome: 0,
          });

          if (totalArray.length === 1) {
            totalArray.push({
              length: 0,
              seedingCost: 0,
              maintenanceCost: 0,
              harvestTonnes: 0,
              harvestIncome: 0,
            });
          }
        }

        totalFarmArray[1].totalLength += Number(
          line.line_budget[1]?.length_actual,
        );
        totalFarmArray[1].totalHarvestTonnes += Number(
          line.line_budget[1]?.planned_harvest_tones_actual,
        );
        totalFarmArray[1].totalHarvestIncome += Number(
          line.line_budget[1]?.budgeted_harvest_income_actual,
        );
      }

      const maintenanceCostValue: any = [0, 0];
      const seedingCostValue: any = [0, 0];

      if (line.line_budget?.length) {
        line?.line_budget[0]?.expenses.map((expense: any) => {
          if (expense?.type === 'm') {
            maintenanceCostValue[0] += Number(expense?.price_actual);
            return maintenanceCostValue[0];
          }
          if (expense?.type === 's') {
            seedingCostValue[0] += Number(expense?.price_actual);
            return seedingCostValue[0];
          }
          return null;
        });
      }

      if (line?.line_budget?.length > 1) {
        line?.line_budget[1]?.expenses.map((expense: any) => {
          if (expense?.type === 'm') {
            maintenanceCostValue[1] += Number(expense?.price_actual);
            return maintenanceCostValue[1];
          }
          if (expense?.type === 's') {
            seedingCostValue[1] += Number(expense?.price_actual);
            return seedingCostValue[1];
          }
          return null;
        });

        totalFarmArray[1].totalSeedingCost =
          Number(totalFarmArray[1]?.totalSeedingCost) + seedingCostValue[1];
        totalFarmArray[1].totalMaintenanceCost =
          Number(totalFarmArray[1]?.totalMaintenanceCost) +
          maintenanceCostValue[1];
      }

      const length = getInterest(
        line?.line_budget[0]?.length_actual,
        line?.line_budget?.length > 1
          ? line?.line_budget[1]?.length_actual
          : null,
      );

      const seedingCost = getInterest(
        seedingCostValue[0],
        line?.line_budget?.length > 1 ? seedingCostValue[1] : null,
      );

      const maintenanceCost = getInterest(
        maintenanceCostValue[0],
        line?.line_budget?.length > 1 ? maintenanceCostValue[1] : null,
      );

      const harvestTonnes = getInterest(
        line?.line_budget[0]?.planned_harvest_tones_actual,
        line?.line_budget?.length > 1
          ? line?.line_budget[1]?.planned_harvest_tones_actual
          : null,
      );

      const harvestIncome = getInterest(
        line?.line_budget[0]?.budgeted_harvest_income_actual,
        line?.line_budget?.length > 1
          ? line?.line_budget[1]?.budgeted_harvest_income_actual
          : null,
      );

      return {
        key: indexArray + 100,
        id: line?.line_id,
        line_name: line?.line_name,
        length,
        seedingCost,
        maintenanceCost,
        harvestTonnes,
        harvestIncome,
      };
    });

    // totalFarmArray[0].totalSeedingCost =
    //   Number(totalFarmArray[0]?.totalSeedingCost) + seedingCostValue[0];
    // totalFarmArray[0].totalMaintenanceCost =
    //   Number(totalFarmArray[0]?.totalMaintenanceCost) +
    //   maintenanceCostValue[0];
    totalFarmArray[0].totalSeedingCost =
      Number(totalFarmArray[0]?.totalSeedingCost) +
      item?.farm_expense_info?.actual_seeding_cost;
    totalFarmArray[0].totalMaintenanceCost =
      Number(totalFarmArray[0]?.totalMaintenanceCost) +
      item?.farm_expense_info?.actual_maintenance_cost;

    const totalLength = getInterest(
      totalFarmArray[0]?.totalLength,
      totalFarmArray?.length > 1 ? totalFarmArray[1]?.totalLength : null,
    );

    const totalSeedingCost = getInterest(
      totalFarmArray[0]?.totalSeedingCost,
      totalFarmArray?.length > 1 ? totalFarmArray[1]?.totalSeedingCost : null,
    );

    const totalMaintenanceCost = getInterest(
      totalFarmArray[0]?.totalMaintenanceCost,
      totalFarmArray?.length > 1
        ? totalFarmArray[1]?.totalMaintenanceCost
        : null,
    );

    const totalHarvestTonnes = getInterest(
      totalFarmArray[0]?.totalHarvestTonnes,
      totalFarmArray?.length > 1 ? totalFarmArray[1]?.totalHarvestTonnes : null,
    );

    const totalHarvestIncome = getInterest(
      totalFarmArray[0]?.totalHarvestIncome,
      totalFarmArray?.length > 1 ? totalFarmArray[1]?.totalHarvestIncome : null,
    );

    const infoItem = {
      key: index,
      id: item?.farm_id,
      name: item?.farm_name,
      lines: [...lines],
      totalLength,
      totalSeedingCost,
      totalMaintenanceCost,
      totalHarvestTonnes,
      totalHarvestIncome,
    };

    if (totalFarmArray?.length) {
      totalArray[0].length =
        Number(totalArray[0].length) + totalFarmArray[0]?.totalLength;
      totalArray[0].seedingCost =
        Number(totalArray[0].seedingCost) + totalFarmArray[0]?.totalSeedingCost;
      totalArray[0].maintenanceCost =
        Number(totalArray[0].maintenanceCost) +
        totalFarmArray[0]?.totalMaintenanceCost;
      totalArray[0].harvestTonnes =
        Number(totalArray[0].harvestTonnes) +
        totalFarmArray[0]?.totalHarvestTonnes;
      totalArray[0].harvestIncome =
        Number(totalArray[0].harvestIncome) +
        totalFarmArray[0]?.totalHarvestIncome;
    }

    if (totalFarmArray.length > 1) {
      totalArray[1].length =
        Number(totalArray[1].length) + totalFarmArray[1]?.totalLength;
      totalArray[1].seedingCost =
        Number(totalArray[1].seedingCost) + totalFarmArray[1]?.totalSeedingCost;
      totalArray[1].maintenanceCost =
        Number(totalArray[1].maintenanceCost) +
        totalFarmArray[1]?.totalMaintenanceCost;
      totalArray[1].harvestTonnes =
        Number(totalArray[1].harvestTonnes) +
        totalFarmArray[1]?.totalHarvestTonnes;
      totalArray[1].harvestIncome =
        Number(totalArray[1].harvestIncome) +
        totalFarmArray[1]?.totalHarvestIncome;
    }

    return infoItem;
  });

  const length = getInterest(
    totalArray[0].length as number,
    totalArray?.length > 1 ? (totalArray[1]?.length as number) : null,
  );

  const seedingCost = getInterest(
    totalArray[0].seedingCost as number,
    totalArray?.length > 1 ? (totalArray[1]?.seedingCost as number) : null,
  );

  const maintenanceCost = getInterest(
    totalArray[0].maintenanceCost as number,
    totalArray?.length > 1 ? (totalArray[1]?.maintenanceCost as number) : null,
  );

  const harvestTonnes = getInterest(
    totalArray[0].harvestTonnes as number,
    totalArray?.length > 1 ? (totalArray[1]?.harvestTonnes as number) : null,
  );

  const harvestIncome = getInterest(
    totalArray[0].harvestIncome as number,
    totalArray?.length > 1 ? (totalArray[1]?.harvestIncome as number) : null,
  );

  const totals = {
    length,
    seedingCost,
    maintenanceCost,
    harvestTonnes,
    harvestIncome,
  };

  return { budget, totals };
};
