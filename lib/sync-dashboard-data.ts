/**
 * Dashboard Data Sync Service
 * 
 * Fetches data from the API endpoint and transforms it into the format
 * expected by the dashboard components, then saves to dashboard-data.json
 */

import fs from "fs";
import path from "path";
import { fetchUserDashboardData } from "./dashboard-service";

interface Transaction {
  id: string;
  type: string | null;
  category: string | null;
  amount: number;
  description: string | null;
  dateOfTransaction: string | null;
  status: string;
  targetParty: string | null;
  medium: string | null;
}

interface User {
  id: number;
  name: string | null;
  phone: string | null;
  age: number | null;
  balance: number;
  status: string;
  dateCreated: string;
  dateUpdated: string;
}

interface HabitInsight {
  id: number;
  habitLabel: string;
  counsel: string;
  evidence: string;
  recordedAt: string;
}

interface CoachAdvice {
  id: string;
  headline: string;
  counsel: string;
  dateCreated: string;
}

// Get transaction summary
function getTransactionSummary(transactions: Transaction[]) {
  const summary = {
    totalCount: transactions.length,
    totalCredit: 0,
    totalDebit: 0,
    netFlow: 0,
    firstTransactionDate: null as string | null,
    lastTransactionDate: null as string | null,
    dateRange: {
      start: null as string | null,
      end: null as string | null,
    },
  };

  let firstDate: Date | null = null;
  let lastDate: Date | null = null;

  transactions.forEach((txn) => {
    if (txn.type === "credit") {
      summary.totalCredit += txn.amount;
    } else if (txn.type === "debit") {
      summary.totalDebit += txn.amount;
    }

    if (txn.dateOfTransaction) {
      const date = new Date(txn.dateOfTransaction);
      if (!firstDate || date < firstDate) firstDate = date;
      if (!lastDate || date > lastDate) lastDate = date;
    }
  });

  summary.netFlow = summary.totalCredit - summary.totalDebit;
  summary.firstTransactionDate = firstDate?.toISOString().split("T")[0] || null;
  summary.lastTransactionDate = lastDate?.toISOString().split("T")[0] || null;
  summary.dateRange.start = summary.firstTransactionDate;
  summary.dateRange.end = summary.lastTransactionDate;

  return summary;
}

// Get category breakdown
function getCategoryBreakdown(transactions: Transaction[]) {
  // Dynamic color palette - assigns colors from largest to smallest category
  const colorPalette = [
    "#3b82f6", // Blue
    "#ef4444", // Red
    "#10b981", // Green
    "#f59e0b", // Amber
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#14b8a6", // Teal
    "#f97316", // Orange
    "#06b6d4", // Cyan
    "#eab308", // Yellow
    "#6366f1", // Indigo
    "#f43f5e", // Rose
  ];

  const groupByPeriod = (txns: Transaction[], days: number) => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const filtered = txns.filter((txn) => {
      if (!txn.dateOfTransaction) return false;
      return new Date(txn.dateOfTransaction) >= cutoff && txn.type === "debit";
    });

    const categoryMap: { [key: string]: number } = {};
    let totalDebit = 0;

    filtered.forEach((txn) => {
      if (txn.category) {
        categoryMap[txn.category] = (categoryMap[txn.category] || 0) + txn.amount;
        totalDebit += txn.amount;
      }
    });

    const data = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1]) // Sort by amount (largest to smallest)
      .map(([category, total], index) => ({
        category,
        type: "debit",
        total,
        percentage: totalDebit > 0 ? (total / totalDebit) * 100 : 0,
        color: colorPalette[index % colorPalette.length], // Assign color based on order
      }));

    return { totalDebit, data };
  };

  const weekly = groupByPeriod(transactions, 7);
  const monthly = groupByPeriod(transactions, 30);
  const allTime = groupByPeriod(transactions, 36500); // ~100 years

  return {
    periods: {
      weekly: {
        currency: "INR",
        totalDebit: weekly.totalDebit,
        label: "Last 7 Days",
        data: weekly.data,
      },
      monthly: {
        currency: "INR",
        totalDebit: monthly.totalDebit,
        label: "Last 30 Days",
        data: monthly.data,
      },
      allTime: {
        currency: "INR",
        totalDebit: allTime.totalDebit,
        label: "All Time",
        data: allTime.data,
      },
    },
  };
}

// Get transaction trend
function getTransactionTrend(transactions: Transaction[]) {
  const trendMap: { [date: string]: { count: number; credit: number; debit: number } } = {};
  let runningBalance = 0;

  // Organize by date
  transactions.forEach((txn) => {
    if (txn.dateOfTransaction) {
      const date = txn.dateOfTransaction.split("T")[0];
      if (!trendMap[date]) {
        trendMap[date] = { count: 0, credit: 0, debit: 0 };
      }
      trendMap[date].count++;
      if (txn.type === "credit") {
        trendMap[date].credit += txn.amount;
      } else {
        trendMap[date].debit += txn.amount;
      }
    }
  });

  // Convert to daily entries and calculate running balance
  const daily = Object.entries(trendMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, data]) => {
      const net = data.credit - data.debit;
      runningBalance += net;
      return {
        date,
        count: data.count,
        credit: data.credit,
        debit: data.debit,
        net,
        balanceAfter: runningBalance,
        averageAccountBalance: runningBalance,
      };
    });

  return {
    daily,
    lastComputed: new Date().toISOString(),
  };
}

// Transform habit insights
function transformHabitInsights(habitInsights: HabitInsight[]) {
  return habitInsights.map((insight) => ({
    id: insight.id,
    habitId: `habit-${insight.id}`,
    habitLabel: insight.habitLabel,
    evidence: insight.evidence,
    counsel: insight.counsel,
    recordedAt: insight.recordedAt,
  }));
}

// Transform coach advice
function transformCoachAdvice(coachAdvice: CoachAdvice[]) {
  return coachAdvice.map((advice) => ({
    id: advice.id,
    headline: advice.headline,
    summary: advice.headline,
    counsel: advice.counsel,
    issuedAt: advice.dateCreated,
    coach: "Coach",
    priority: "medium",
  }));
}

// Main sync function
export async function syncDashboardData(userId: number): Promise<void> {
  try {
    console.log(`[Dashboard Sync] Fetching data for user ${userId}...`);

    const apiData = await fetchUserDashboardData(userId);

    if (!apiData) {
      throw new Error(`Failed to fetch data for user ${userId}`);
    }

    console.log(`[Dashboard Sync] Transforming data...`);

    // Use streak from API response (already calculated in dashboard-service)
    const streak = apiData.currentStreak;
    const transactionSummary = getTransactionSummary(apiData.transactions);
    const categoryBreakdown = getCategoryBreakdown(apiData.transactions);
    const transactionTrend = getTransactionTrend(apiData.transactions);

    const transformedData = {
      metadata: {
        version: "1.1",
        generatedAt: new Date().toISOString(),
        currency: "INR",
        source: {
          database: "postgresql",
          schema: "public",
          tables: ["users", "tranasctions", "habit_insights", "coach_briefings"],
        },
      },
      authorization: {
        userId: apiData.user.id,
        roleId: "member-01",
        roleName: "member",
        policies: [
          {
            policyId: "policy-dashboard-read",
            collection: "directus_access",
            action: "read",
          },
          {
            policyId: "policy-transactions-read",
            collection: "tranasctions",
            action: "read",
          },
        ],
        lastLogin: new Date().toISOString(),
        loginHistory: [],
      },
      user: {
        id: apiData.user.id,
        status: apiData.user.status,
        dateCreated: apiData.user.dateCreated,
        dateUpdated: apiData.user.dateUpdated,
        name: apiData.user.name || "User",
        whatsappNumber: apiData.user.phone || "",
        approxAge: apiData.user.age || 0,
        approxBankBalance: apiData.user.balance || 0,
        smsAppApiKey: "redacted",
        tags: ["active"],
        language: "en-IN",
        owner: {
          sourceTable: "users",
          id: apiData.user.id,
        },
      },
      account: {
        currentStreak: streak,
        balance: {
          opening: apiData.user.balance || 0,
          current: apiData.user.balance || 0,
          maxEverReached: apiData.user.balance || 0,
          averageToDate: apiData.user.balance || 0,
        },
      },
      transactions: {
        summary: transactionSummary,
        categoryBreakdown,
        trend: transactionTrend,
        records: apiData.transactions.map((txn) => ({
          id: txn.id,
          sourceTable: "tranasctions",
          status: txn.status,
          type: txn.type,
          category: txn.category,
          amount: txn.amount,
          currency: "INR",
          medium: txn.medium,
          targetParty: txn.targetParty,
          description: txn.description,
          comments: null,
          dateOfTransaction: txn.dateOfTransaction?.split("T")[0],
          dateCreated: txn.dateOfTransaction,
          dateUpdated: txn.dateOfTransaction,
          owner: apiData.user.id,
          originalSmsId: `sms_${txn.id}`,
          linkedHabitIds: [],
          userCreated: 12,
          userUpdated: 12,
        })),
      },
      logs: {
        lastSync: new Date().toISOString(),
        transactionLog: transactionTrend.daily
          .slice(-5)
          .reverse()
          .map((entry) => ({
            date: entry.date,
            count: entry.count,
            net: entry.net,
          })),
      },
      insights: {
        habitTips: transformHabitInsights(apiData.habitInsights),
        coachAdvice: transformCoachAdvice(apiData.coachAdvice),
      },
      analytics: {
        browserUsage: {
          weekly: {
            period: { type: "days", value: 7, label: "Last 7 Days" },
            total: 230,
            data: [],
          },
          monthly: {
            period: { type: "days", value: 30, label: "Last 30 Days" },
            total: 835,
            data: [],
          },
          allTime: {
            period: { type: "all", value: null, label: "All Time" },
            total: 3475,
            data: [],
          },
        },
      },
    };

    // Save to file
    const filePath = path.join(process.cwd(), "public", "dashboard-data.json");
    fs.writeFileSync(filePath, JSON.stringify(transformedData, null, 2), "utf-8");

    console.log(
      `[Dashboard Sync] ✅ Dashboard data synced successfully for user ${userId}`
    );
    console.log(`[Dashboard Sync] File saved to: ${filePath}`);
    console.log(`[Dashboard Sync] Transactions: ${apiData.transactions.length}`);
    console.log(`[Dashboard Sync] Streak: ${streak} days`);
  } catch (error) {
    console.error("[Dashboard Sync] ❌ Error syncing dashboard data:", error);
    throw error;
  }
}

// Export a function that can be called from API
export async function syncDashboardDataHandler(userId: number): Promise<void> {
  return syncDashboardData(userId);
}
