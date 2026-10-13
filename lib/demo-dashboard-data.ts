import type { DashboardResponse } from "./dashboard-types";

type DemoTransaction = {
  id?: string;
  category?: string;
  type?: string;
  amount?: number;
  targetParty?: string | null;
  description?: string | null;
};

type DemoDashboardData = DashboardResponse & {
  account?: DashboardResponse["account"] & {
    balance?: DashboardResponse["account"]["balance"] & {
      opening?: number;
    };
  };
  transactions?: DashboardResponse["transactions"] & {
    records?: DemoTransaction[];
  };
};

export async function fetchDemoDashboardData(): Promise<DashboardResponse> {
  const response = await fetch(`${import.meta.env.BASE_URL}data.json`);
  if (!response.ok) {
    throw new Error(`Failed to load demo dashboard data (${response.status}).`);
  }

  const rawData = (await response.json()) as DemoDashboardData;
  const records = rawData.transactions?.records ?? [];
  const balance = rawData.account?.balance;

  return {
    ...rawData,
    account: rawData.account
      ? {
          ...rawData.account,
          balance: balance
            ? {
                ...balance,
                initial: balance.initial ?? balance.opening,
              }
            : undefined,
        }
      : undefined,
    tableData: records.map((record) => ({
      id: record.id,
      name: record.targetParty ?? record.description ?? record.category,
      email: record.category,
      status: record.type,
      amount: record.amount,
    })),
  };
}
