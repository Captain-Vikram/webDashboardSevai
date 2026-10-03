"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AnimatedCounter } from "./animated-counter";

type TransactionData = {
  date: string;
  count: number;
  credit: number;
  debit: number;
  net?: number;
};

type DashboardData = {
  currentStreak: number;
  initialBalance: number;
  maxBalanceEverReached: number;
  currencyCode: string;
  transactionActivity: TransactionData[];
};

type RawActivityEntry = {
  date?: string;
  count?: number;
  credit?: number;
  debit?: number;
  net?: number;
};

type DashboardResponse = {
  metadata?: {
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
    trend?: {
      daily?: RawActivityEntry[];
    };
  };
};

// Helper function to get day of week
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(date: Date, amount: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

// Process real data based on period
function processTransactionData(
  transactions: TransactionData[], 
  period: 'week' | 'month' | 'max',
  initialBalance: number
) {
  if (!transactions || transactions.length === 0) return [];

  // Sort transactions by date
  const sorted = [...transactions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstTransactionDate = startOfDay(new Date(sorted[0].date));
  const lastTransactionDate = startOfDay(new Date(sorted[sorted.length - 1].date));
  const today = startOfDay(new Date());

  const transactionByDate = new Map<string, { credit: number; debit: number }>();
  sorted.forEach((item) => {
    const entry = transactionByDate.get(item.date) || { credit: 0, debit: 0 };
    entry.credit += item.credit;
    entry.debit += item.debit;
    transactionByDate.set(item.date, entry);
  });

  const endDate = lastTransactionDate < today ? lastTransactionDate : today;

  if (period === "week" || period === "month") {
    const span = period === "week" ? 6 : 29;
    const desiredStart = addDays(endDate, -span);
  const startDate = desiredStart;

    if (startDate > endDate) {
      return [];
    }

    let baseBalance = initialBalance;
    sorted.forEach((item) => {
      const itemDate = startOfDay(new Date(item.date));
      if (itemDate < startDate) {
        baseBalance += item.credit - item.debit;
      }
    });

    const results: Array<{ label: string; balance: number; credit: number; debit: number; date: string }> = [];
    let runningBalance = baseBalance;
    let cursor = new Date(startDate);

    while (cursor <= endDate) {
      const dateKey = toISODate(cursor);
      const totals = transactionByDate.get(dateKey) || { credit: 0, debit: 0 };
      runningBalance += totals.credit - totals.debit;
      const label = period === "week"
        ? DAY_NAMES[cursor.getDay()]
        : `${MONTH_NAMES[cursor.getMonth()]} ${cursor.getDate()}`;
      results.push({
        label,
        balance: runningBalance,
        credit: totals.credit,
        debit: totals.debit,
        date: dateKey,
      });
      cursor = addDays(cursor, 1);
    }

    return results;
  }

  // All-time (monthly aggregation)
  const monthlyTotals = new Map<string, { credit: number; debit: number }>();
  sorted.forEach((item) => {
    const itemDate = new Date(item.date);
    const key = `${itemDate.getFullYear()}-${itemDate.getMonth()}`;
    const entry = monthlyTotals.get(key) || { credit: 0, debit: 0 };
    entry.credit += item.credit;
    entry.debit += item.debit;
    monthlyTotals.set(key, entry);
  });

  const monthsInRange: Array<{ key: string; date: Date }> = [];
  let monthCursor = new Date(firstTransactionDate.getFullYear(), firstTransactionDate.getMonth(), 1);
  const monthEnd = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (monthCursor <= monthEnd) {
    const key = `${monthCursor.getFullYear()}-${monthCursor.getMonth()}`;
    monthsInRange.push({ key, date: new Date(monthCursor) });
    monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1);
  }

  let runningBalance = initialBalance;
  sorted.forEach((item) => {
    const itemDate = startOfDay(new Date(item.date));
    if (itemDate < firstTransactionDate) {
      runningBalance += item.credit - item.debit;
    }
  });

  return monthsInRange.map(({ key, date }) => {
    const totals = monthlyTotals.get(key) || { credit: 0, debit: 0 };
    runningBalance += totals.credit - totals.debit;
    return {
      label: `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`,
      balance: runningBalance,
      credit: totals.credit,
      debit: totals.debit,
      date: toISODate(date),
    };
  });
}

const chartConfig = {
  balance: {
    label: "Balance",
    color: "hsl(var(--chart-1))",
  },
  credit: {
    label: "Credit",
    color: "hsl(var(--chart-2))",
  },
  debit: {
    label: "Debit",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

interface CreditDebitChartProps {
  period: 'week' | 'month' | 'max';
  onPeriodChange?: (direction: 'prev' | 'next') => void;
}

export function CreditDebitChart({ period, onPeriodChange }: CreditDebitChartProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const currencyCode = dashboardData?.currencyCode ?? "INR";

  const currencyFormatter = useMemo(() => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 0,
      });
    } catch (error) {
      console.warn("Falling back to INR currency formatting", error);
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      });
    }
  }, [currencyCode]);

  const compactCurrencyFormatter = useMemo(() => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode,
        notation: "compact",
        maximumFractionDigits: 1,
      });
    } catch {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        notation: "compact",
        maximumFractionDigits: 1,
      });
    }
  }, [currencyCode]);

  const formatCurrency = (value: number) => currencyFormatter.format(Math.round(value));

  const formatCurrencyCompact = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 100000) {
      return compactCurrencyFormatter.format(value);
    }
    return formatCurrency(value);
  };

  useEffect(() => {
    let isCancelled = false;

    const loadDashboard = async () => {
      try {
        const response = await fetch('/dashboard-data.json');
        const json: DashboardResponse = await response.json();
        if (isCancelled) return;

        const activity = (json.transactions?.trend?.daily ?? []).filter(
          (entry): entry is RawActivityEntry & { date: string } =>
            typeof entry?.date === 'string'
        );

        const sanitizedActivity: TransactionData[] = activity.map((item) => ({
          date: item.date,
          count: item.count ?? 0,
          credit: item.credit ?? 0,
          debit: item.debit ?? 0,
          net: item.net,
        }));

        setDashboardData({
          currentStreak: json.account?.currentStreak ?? 0,
          initialBalance: json.account?.balance?.initial ?? 0,
          maxBalanceEverReached: json.account?.balance?.maxEverReached ?? 0,
          currencyCode: json.metadata?.currency ?? 'INR',
          transactionActivity: sanitizedActivity,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboard();

    return () => {
      isCancelled = true;
    };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onPeriodChange) {
      onPeriodChange('next');
    } else if (isRightSwipe && onPeriodChange) {
      onPeriodChange('prev');
    }
  };

  const chartData = useMemo(() => {
    if (!dashboardData) return [];
    return processTransactionData(
      dashboardData.transactionActivity,
      period,
      dashboardData.initialBalance
    );
  }, [dashboardData, period]);
  
  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, item) => ({
        credit: acc.credit + item.credit,
        debit: acc.debit + item.debit,
      }),
      { credit: 0, debit: 0 }
    );
  }, [chartData]);

  const maxAmount = useMemo(() => {
    if (chartData.length === 0) return 10000;
    return Math.max(...chartData.map(d => d.balance));
  }, [chartData]);
  
  const minAmount = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.min(...chartData.map(d => d.balance));
  }, [chartData]);

  const periodLabel = {
    week: 'This Week',
    month: 'This Month',
    max: 'All Time'
  }[period];

  return (
    <div 
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 sm:gap-3 md:gap-4 w-full touch-pan-y"
    >
      {/* Line Chart */}
      <Card className="overflow-hidden h-[148px] sm:h-[163px] md:h-[188px] lg:h-[212px]">
        <CardContent className="px-2 py-0 h-full flex items-center justify-center">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 2,
                right: 2,
                top: 2,
                bottom: 2,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={2}
                tick={{ fontSize: 9 }}
                height={20}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={2}
                tick={{ fontSize: 9 }}
                width={35}
                domain={[minAmount * 0.9, maxAmount * 1.1]}
                tickFormatter={(value) => formatCurrencyCompact(value as number)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(typeof value === 'number' ? value : Number(value))}
                  />
                }
              />
              <Line
                dataKey="balance"
                type="monotone"
                stroke="var(--chart-1)"
                dot={{
                  fill: "var(--chart-1)",
                  r: 3,
                  strokeWidth: 2,
                  stroke: "var(--background)",
                }}
                strokeWidth={2}
                filter="url(#balance-glow)"
              />
              <defs>
                <filter
                  id="balance-glow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Total Cards - Stacked on Right */}
      <div className="flex flex-row md:flex-col gap-2 sm:gap-3 md:gap-4 w-full md:w-[130px] lg:w-[150px] mt-2 md:mt-0 items-stretch">
        {/* Total Income Card */}
        <motion.div
          className="flex-1 min-w-0 h-[73px] sm:h-20 md:h-[92px] lg:h-[104px] md:w-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full w-full md:w-auto border-chart-2/30 bg-chart-2/5">
            <CardContent className="p-2 sm:p-2.5 md:p-3 lg:p-3.5 flex flex-col justify-center h-full">
              <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">
                  Income
                </span>
                <span
                  className="inline-flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--chart-2) 18%, transparent)",
                    color: "var(--chart-2)",
                  }}
                >
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-[18px] md:w-[18px]" strokeWidth={2.2} />
                </span>
              </div>
              <div className="text-lg md:text-xl font-bold leading-tight" style={{ color: 'var(--chart-2)' }}>
                <AnimatedCounter value={totals.credit} duration={1.5} format={formatCurrency} />
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {periodLabel}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Expenditure Card */}
        <motion.div
          className="flex-1 min-w-0 h-[73px] sm:h-20 md:h-[92px] lg:h-[104px] md:w-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full w-full md:w-auto border-chart-5/30 bg-chart-5/5">
            <CardContent className="p-2 sm:p-2.5 md:p-3 lg:p-3.5 flex flex-col justify-center h-full">
              <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">
                  Expenditure
                </span>
                <span
                  className="inline-flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--chart-5) 18%, transparent)",
                    color: "var(--chart-5)",
                  }}
                >
                  <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-[18px] md:w-[18px]" strokeWidth={2.2} />
                </span>
              </div>
              <div className="text-lg md:text-xl font-bold leading-tight" style={{ color: 'var(--chart-5)' }}>
                <AnimatedCounter value={totals.debit} duration={1.5} format={formatCurrency} />
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {periodLabel}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
