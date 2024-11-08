export type PrismaSumResult = {
  s: number;
  e: number;
  d: number[];
  toStringTag: string;
  toNumber: () => number;
};

export type SaleSummary = {
  date: Date;
  amount: PrismaSumResult;
  commission: PrismaSumResult;
};

export type DepositSummary = {
  date: Date;
  total: PrismaSumResult;
};

export type Sale = {
  date: string;
  sales: number;
  commission: number;
  balance: number;
  serviceCost: string;
  serviceCostAmount: number;
  totalDeposits: number;
  availableBalance: number;
  cumulativeBalance: number;
};

export type HostingCenterUpdatedErrors = {
  name?: string[];
  companyName?: string[];
};
