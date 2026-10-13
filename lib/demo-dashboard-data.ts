import type { DashboardResponse } from "./dashboard-types";

export const demoDashboardData: DashboardResponse = {
  metadata: {
    generatedAt: "2025-11-08T07:45:23.033Z",
    currency: "INR",
  },
  account: {
    currentStreak: 42,
    balance: {
      initial: 50000,
      current: 67500,
      maxEverReached: 72000,
    },
  },
  transactions: {
    trend: {
      daily: [
        { date: "2026-10-01", count: 4, credit: 12000, debit: 3500, net: 8500 },
        { date: "2026-10-02", count: 3, credit: 5000, debit: 2200, net: 2800 },
        { date: "2026-10-03", count: 5, credit: 8500, debit: 4100, net: 4400 },
        { date: "2026-10-04", count: 2, credit: 0, debit: 1800, net: -1800 },
        { date: "2026-10-05", count: 6, credit: 15000, debit: 5200, net: 9800 },
        { date: "2026-10-06", count: 3, credit: 4000, debit: 2500, net: 1500 },
        { date: "2026-10-07", count: 4, credit: 7000, debit: 3100, net: 3900 },
      ],
    },
    categoryBreakdown: {
      periods: {
        weekly: {
          currency: "INR",
          label: "This Week",
          totalDebit: 22400,
          data: [
            { category: "groceries", total: 7200, type: "debit", color: "hsl(var(--chart-1))" },
            { category: "utilities", total: 4800, type: "debit", color: "hsl(var(--chart-2))" },
            { category: "transport", total: 3900, type: "debit", color: "hsl(var(--chart-3))" },
            { category: "family_care", total: 3100, type: "debit", color: "hsl(var(--chart-4))" },
            { category: "dining", total: 2100, type: "debit", color: "hsl(var(--chart-5))" },
            { category: "subscriptions", total: 1300, type: "debit" },
          ],
        },
        monthly: {
          currency: "INR",
          label: "This Month",
          totalDebit: 22400,
          data: [
            { category: "groceries", total: 7200, type: "debit", color: "hsl(var(--chart-1))" },
            { category: "utilities", total: 4800, type: "debit", color: "hsl(var(--chart-2))" },
            { category: "transport", total: 3900, type: "debit", color: "hsl(var(--chart-3))" },
            { category: "family_care", total: 3100, type: "debit", color: "hsl(var(--chart-4))" },
            { category: "dining", total: 2100, type: "debit", color: "hsl(var(--chart-5))" },
            { category: "subscriptions", total: 1300, type: "debit" },
          ],
        },
        allTime: {
          currency: "INR",
          label: "All Time",
          totalDebit: 77500,
          data: [
            { category: "groceries", total: 27500, type: "debit", color: "hsl(var(--chart-1))" },
            { category: "utilities", total: 16800, type: "debit", color: "hsl(var(--chart-2))" },
            { category: "transport", total: 13200, type: "debit", color: "hsl(var(--chart-3))" },
            { category: "family_care", total: 11200, type: "debit", color: "hsl(var(--chart-4))" },
            { category: "dining", total: 5400, type: "debit", color: "hsl(var(--chart-5))" },
            { category: "subscriptions", total: 3400, type: "debit" },
          ],
        },
      },
    },
  },
  insights: {
    habitTips: [
      {
        id: "demo-habit",
        habitLabel: "Consistent tracking",
        counsel: "Keeping your transactions up to date makes your financial trends easier to understand.",
        accent: "primary",
        recordedAt: "2026-10-07T08:00:00Z",
      },
    ],
    coachAdvice: [
      {
        id: "demo-advice",
        coach: "Financial Coach",
        summary: "Your spending is stable. Keep an eye on dining and subscription costs this month.",
        priority: "medium",
        issuedAt: "2026-10-07T08:30:00Z",
      },
    ],
  },
  paramInsights: {
    savingsRate: 18.4,
    monthlyBudget: 30000,
    budgetUsage: 74,
  },
  wishlistItems: [
    {
      name: "New laptop",
      targetAmount: 85000,
      savedAmount: 42000,
      status: "in-progress",
    },
  ],
  tableData: [
    { id: "demo-001", name: "Salary Credit", email: "Income", status: "Income", amount: 12000 },
    { id: "demo-002", name: "Grocery Store", email: "Groceries", status: "Expense", amount: 2200 },
    { id: "demo-003", name: "Electricity Bill", email: "Utilities", status: "Expense", amount: 1800 },
    { id: "demo-004", name: "Metro Card", email: "Transport", status: "Expense", amount: 950 },
  ],
};
