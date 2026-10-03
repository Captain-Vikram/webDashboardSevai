import prisma from "@/lib/db";

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

interface DashboardResponse {
  metadata: {
    timestamp: string;
    version: string;
  };
  user: User;
  currentStreak: number;
  transactions: Transaction[];
  habitInsights: HabitInsight[];
  coachAdvice: CoachAdvice[];
}

// Compute transaction streaks - only counts if streak is active (includes today or yesterday)
function computeStreakFromTransactions(transactions: Transaction[]): number {
  if (!transactions || transactions.length === 0) return 0;

  // Group transactions by date
  const transactionsByDate: { [date: string]: number } = {};
  transactions.forEach((txn) => {
    if (txn.dateOfTransaction) {
      const date = txn.dateOfTransaction.split("T")[0];
      transactionsByDate[date] = (transactionsByDate[date] || 0) + 1;
    }
  });

  // Get sorted dates (newest to oldest)
  const dates = Object.keys(transactionsByDate)
    .filter((date) => transactionsByDate[date] > 0)
    .sort()
    .reverse();

  if (dates.length === 0) return 0;

  const DAY_IN_MS = 1000 * 60 * 60 * 24;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const latestTxnDate = new Date(`${dates[0]}T00:00:00Z`);
  latestTxnDate.setHours(0, 0, 0, 0);

  // Check if streak is broken (more than 1 day gap from today)
  const gapFromToday = Math.round((today.getTime() - latestTxnDate.getTime()) / DAY_IN_MS);
  if (gapFromToday > 1) {
    // Streak is broken, return 0
    return 0;
  }

  // Calculate consecutive days from most recent transaction
  let streak = 1; // Start at 1 for the most recent day
  let previousDate = latestTxnDate;

  for (let i = 1; i < dates.length; i++) {
    const currentDate = new Date(`${dates[i]}T00:00:00Z`);
    currentDate.setHours(0, 0, 0, 0);

    const deltaDays = Math.round((previousDate.getTime() - currentDate.getTime()) / DAY_IN_MS);

    if (deltaDays === 1) {
      // Consecutive day
      streak++;
      previousDate = currentDate;
    } else if (deltaDays > 1) {
      // Gap found - stop counting
      break;
    }
    // If deltaDays === 0, skip duplicate dates
  }

  // Only return streak if we have 2+ consecutive days, otherwise return 0
  return streak >= 2 ? streak : 0;
}

async function fetchUserDashboardData(userId: number): Promise<DashboardResponse | null> {
  try {
    // Fetch user
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error(`User not found: ${userId}`);
      return null;
    }

    // Fetch transactions
    const transactions = await prisma.tranasctions.findMany({
      where: { owner: userId },
      orderBy: { date_of_transaction: "desc" },
    });

    // Fetch habit insights
    const habitInsights = await prisma.habit_insights.findMany({
      where: { owner: userId },
      orderBy: { recorded_at: "desc" },
    });

    // Fetch coach briefings
    const coachAdvice = await prisma.coach_briefings.findMany({
      where: { owner: userId },
      orderBy: { date_created: "desc" },
    });

    // Map transactions to proper format
    const mappedTransactions = transactions.map((txn) => ({
      id: txn.id,
      type: txn.type,
      category: txn.category,
      amount: txn.amount || 0,
      description: txn.description,
      dateOfTransaction: txn.date_of_transaction?.toISOString() || null,
      status: txn.status || "draft",
      targetParty: txn.target_party,
      medium: txn.medium,
    }));

    // Calculate current streak
    const currentStreak = computeStreakFromTransactions(mappedTransactions);

    const response: DashboardResponse = {
      metadata: {
        timestamp: new Date().toISOString(),
        version: "1.0",
      },
      user: {
        id: user.id,
        name: user.name,
        phone: user.whatsapp_number,
        age: user.approx_age,
        balance: user.approx_bank_balance || 0,
        status: user.status || "active",
        dateCreated: user.date_created?.toISOString() || new Date().toISOString(),
        dateUpdated: user.date_updated?.toISOString() || new Date().toISOString(),
      },
      currentStreak,
      transactions: mappedTransactions,
      habitInsights: habitInsights.map((insight) => ({
        id: insight.id,
        habitLabel: insight.habit_label,
        counsel: insight.counsel,
        evidence: insight.evidence,
        recordedAt: insight.recorded_at?.toISOString() || new Date().toISOString(),
      })),
      coachAdvice: coachAdvice.map((advice) => ({
        id: advice.id,
        headline: advice.headline,
        counsel: advice.counsel,
        dateCreated: advice.date_created?.toISOString() || new Date().toISOString(),
      })),
    };

    return response;
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    return null;
  }
}

export { fetchUserDashboardData, type DashboardResponse };
