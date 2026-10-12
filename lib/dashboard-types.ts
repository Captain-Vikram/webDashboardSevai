export type DataPeriod = "weekly" | "monthly" | "allTime";

export type CategoryEntry = {
  category?: string;
  type?: string;
  total?: number;
  percentage?: number;
  color?: string;
};

export type TrendDailyEntry = {
  date?: string;
  count?: number;
  credit?: number;
  debit?: number;
  net?: number;
  balanceAfter?: number;
  averageAccountBalance?: number;
};

export type DashboardResponse = {
  metadata?: {
    generatedAt?: string;
    currency?: string;
  };
  account?: {
    currentStreak?: number;
    balance?: {
      initial?: number;
      current?: number;
      maxEverReached?: number;
    };
  };
  transactions?: {
    categoryBreakdown?: {
      periods?: Partial<Record<DataPeriod, {
        currency?: string;
        totalDebit?: number;
        label?: string;
        data?: CategoryEntry[];
      }>>;
    };
    trend?: {
      daily?: TrendDailyEntry[];
    };
  };
  insights?: {
    habitTips?: Array<{
      id?: string;
      habitId?: string;
      habitLabel?: string;
      counsel?: string;
      recordedAt?: string;
      accent?: string;
    }>;
    coachAdvice?: Array<{
      id?: string;
      summary?: string;
      issuedAt?: string;
      coach?: string;
      priority?: string;
    }>;
  };
  habitInsights?: Array<{
    id?: number;
    habitLabel?: string;
    counsel?: string;
    recordedAt?: string;
  }>;
  coachAdvice?: Array<{
    id?: string;
    headline?: string;
    counsel?: string;
    dateCreated?: string;
  }>;
  paramInsights?: unknown;
  wishlistItems?: unknown;
  tableData?: Array<{
    id?: string | number;
    name?: string;
    email?: string;
    status?: string;
    amount?: string | number;
  }>;
};
