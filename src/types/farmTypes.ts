export interface ILineData {
  farm_id: string | number;
  line_name: string;
  length: string;
}

export interface ICost {
  name: string;
  price: string;
  id: string;
  type: string;
}

export interface IBudgetLocal {
  [key: string]: number | string | boolean | Array<ICost>;
  seedingCosts: Array<ICost>;
  seedingCostsTotal: string;
  maintenanceCosts: Array<ICost>;
  maintenanceCostsTotal: string;
  totalExpenses: number;
  harvestTonnes: string;
  harvestIncome: string;
}
