"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IncreaseSizePieChart, fallbackSegments, type DashboardData } from "./increase-size-pie-chart";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";
import { CreditDebitChart } from "./credit-debit-chart";
import { OverviewCarousel, type InsightTip } from "./dashboard-overview-slider";

type DataPeriod = "weekly" | "monthly" | "allTime";

type CardType = {
  id: string;
  title: string;
  value: number;
  color: string;
  percentage?: number;
  isActive?: boolean;
};

type CategoryEntry = {
  category?: string;
  type?: string;
  total?: number;
  percentage?: number;
  color?: string;
};

type TrendDailyEntry = {
  date?: string;
  count?: number;
  credit?: number;
  debit?: number;
  net?: number;
  balanceAfter?: number;
  averageAccountBalance?: number;
};

type TransactionSummary = {
  totalCount?: number;
  totalCredit?: number;
  totalDebit?: number;
  netFlow?: number;
  dateRange?: {
    start?: string | null;
    end?: string | null;
  };
};

type CategoryPeriod = {
  currency?: string;
  totalDebit?: number;
  label?: string;
  data?: CategoryEntry[];
};

type HabitSnapshotTip = {
  id?: string;
  habitId?: string;
  habitLabel?: string;
  counsel?: string;
  recordedAt?: string;
  accent?: string;
};

type CoachAdviceEntry = {
  id?: string;
  summary?: string;
  issuedAt?: string;
  coach?: string;
  priority?: string;
};

type LoginEvent = {
  occurredAt?: string;
  status?: "success" | "failed";
  device?: string;
  ipAddress?: string;
};

type DashboardResponse = {
  metadata?: {
    generatedAt?: string;
    currency?: string;
  };
  authorization?: {
    lastLogin?: string;
    loginHistory?: LoginEvent[];
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
    summary?: TransactionSummary;
    categoryBreakdown?: {
      periods?: Partial<Record<DataPeriod, CategoryPeriod>>;
    };
    trend?: {
      daily?: TrendDailyEntry[];
    };
  };
  insights?: {
    habitTips?: HabitSnapshotTip[];
    coachAdvice?: CoachAdviceEntry[];
  };
  // Support direct API response format
  habitInsights?: Array<{
    id?: number;
    habitLabel?: string;
    counsel?: string;
    evidence?: string;
    recordedAt?: string;
  }>;
  coachAdvice?: Array<{
    id?: string;
    headline?: string;
    counsel?: string;
    dateCreated?: string;
  }>;
};

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const periodOrder: DataPeriod[] = ["weekly", "monthly", "allTime"];
const periodLabels = {
  weekly: "Weekly",
  monthly: "Monthly",
  allTime: "All Time"
};

const formatCategoryLabel = (value: string) =>
  value
    .split(/[_-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

export function PieChartWithLegend() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [rawData, setRawData] = useState<DashboardResponse | null>(null);
  const [insightTips, setInsightTips] = useState<InsightTip[]>([]);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [transactionActivity, setTransactionActivity] = useState<Array<{ date: string; count: number }>>([]);
  const [dataPeriod, setDataPeriod] = useState<DataPeriod>("monthly");
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Load dashboard data from JSON file or API
  useEffect(() => {
    let isCancelled = false;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        
        // Try to get userId from URL query params or localStorage
        const params = new URLSearchParams(window.location.search);
        const userIdFromUrl = params.get("userId");
        const userIdFromStorage = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        const userId = userIdFromUrl || userIdFromStorage;

        let json: DashboardResponse;

        // If userId is provided, fetch from API
        if (userId) {
          const response = await fetch(`/api/dashboard?userId=${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch from API, falling back to JSON");
          }
          json = await response.json();
        } else {
          // Fallback to JSON file
          const fileResponse = await fetch("/dashboard-data.json");
          json = await fileResponse.json();
        }

        if (isCancelled) return;

        setRawData(json);

        // Handle both API response (habitInsights/coachAdvice) and synced JSON (insights.habitTips/insights.coachAdvice)
        const habitTipsSource = json.insights?.habitTips ?? json.habitInsights ?? [];
        const coachAdviceSource = json.insights?.coachAdvice ?? json.coachAdvice ?? [];

        const habitTips = habitTipsSource.map((tip: any) => ({
          id: tip.id ?? tip.habitId,
          title: tip.habitLabel,
          description: tip.counsel,
          accent: tip.accent ?? "primary",
          recordedAt: tip.recordedAt,
        }));

        const coachAdvice = coachAdviceSource.map((advice: any) => ({
          id: advice.id,
          title: advice.coach ? `${advice.coach}'s Advice` : "Coach Advice",
          description: advice.summary ?? advice.counsel ?? advice.headline,
          accent: "secondary",
          recordedAt: advice.issuedAt ?? advice.dateCreated,
        }));

        const combinedTips = [...habitTips, ...coachAdvice]
          .filter((tip) => Boolean(tip && (tip.title || tip.description)))
          .sort((a, b) => {
            const aTime = a.recordedAt ? new Date(a.recordedAt).getTime() : 0;
            const bTime = b.recordedAt ? new Date(b.recordedAt).getTime() : 0;
            return bTime - aTime;
          })
          .slice(0, 2)
          .map(({ recordedAt, ...rest }) => rest);

        setInsightTips(combinedTips);

        const rawActivity = (json.transactions?.trend?.daily ?? []).filter(
          (entry): entry is TrendDailyEntry & { date: string } =>
            typeof entry?.date === "string"
        );

        const transactionActivityData = rawActivity.map((entry) => ({
          date: entry.date,
          count: entry.count ?? 0,
        }));

        setTransactionActivity(transactionActivityData);

        // Use streak from API response (calculated in dashboard-service)
        setCurrentStreak(json.account?.currentStreak ?? 0);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        if (!isCancelled) {
          setRawData(null);
          setDashboardData(null);
          setInsightTips([]);
          setCurrentStreak(0);
          setTransactionActivity([]);
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Derive the active period dataset whenever the selection changes
  useEffect(() => {
    if (!rawData) {
      return;
    }

    const breakdownPeriods = rawData.transactions?.categoryBreakdown?.periods;
    const preferredBreakdown = breakdownPeriods?.[dataPeriod] ?? breakdownPeriods?.monthly ?? breakdownPeriods?.allTime;

    if (!preferredBreakdown || !preferredBreakdown.data || preferredBreakdown.data.length === 0) {
      setDashboardData(null);
      setActiveIndex(null);
      setClickedIndex(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const normalised = preferredBreakdown.data
      .filter((item): item is CategoryEntry & { category: string } => Boolean(item && item.category))
      .map((item, index) => ({
        id: item.category!,
        name: formatCategoryLabel(item.category!),
        amount: item.total ?? 0,
        type: item.type,
        color: item.color || `var(--chart-${((index % 5) + 1)})`,
      }))
      .sort((a, b) => b.amount - a.amount);

    const totalAmountRaw = normalised.reduce((sum, item) => sum + item.amount, 0);

    const topSegments = normalised.slice(0, 4);
    const remainderSegments = normalised.slice(4);
    const remainderAmount = remainderSegments.reduce((sum, item) => sum + item.amount, 0);

    let aggregatedSegments = [...topSegments];

    if (remainderAmount > 0) {
      const miscIndex = aggregatedSegments.findIndex((segment) =>
        segment.id.toLowerCase().includes("misc") || segment.name.toLowerCase().includes("misc")
      );

      if (miscIndex >= 0) {
        aggregatedSegments[miscIndex] = {
          ...aggregatedSegments[miscIndex],
          amount: aggregatedSegments[miscIndex].amount + remainderAmount,
        };
      } else {
        const remainderColor = remainderSegments.find((segment) => segment.color)?.color;
        aggregatedSegments.push({
          id: "miscellaneous",
          name: "Miscellaneous",
          amount: remainderAmount,
          type: "debit",
          color:
            remainderColor || `var(--chart-${((aggregatedSegments.length % 5) + 1)})`,
        });
      }
    }

    const adjustedTotalAmount = aggregatedSegments.reduce((sum, item) => sum + item.amount, 0) || 1;

    const segments = aggregatedSegments.map((segment, index) => ({
      ...segment,
      color: segment.color || `var(--chart-${((index % 5) + 1)})`,
      percentage: adjustedTotalAmount > 0 ? (segment.amount / adjustedTotalAmount) * 100 : 0,
    }));

    setDashboardData({
      chartTitle: "Spending by Category",
      chartPeriod: preferredBreakdown.label || periodLabels[dataPeriod],
      categoryTitle: "Top Spending Categories",
      totalAmount: totalAmountRaw,
      currency: preferredBreakdown.currency || rawData.metadata?.currency || "INR",
      segments,
    });

    setActiveIndex(null);
    setClickedIndex(null);

    const timeout = window.setTimeout(() => setIsLoading(false), 300);
    return () => window.clearTimeout(timeout);
  }, [rawData, dataPeriod]);

  // Auto-clear clicked state after 500ms (0.5 seconds)
  useEffect(() => {
    if (clickedIndex !== null) {
      const timer = setTimeout(() => {
        setClickedIndex(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [clickedIndex]);

  const handlePeriodChange = (direction: 'prev' | 'next') => {
    const currentIndex = periodOrder.indexOf(dataPeriod);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : periodOrder.length - 1;
    } else {
      newIndex = currentIndex < periodOrder.length - 1 ? currentIndex + 1 : 0;
    }
    
    setDataPeriod(periodOrder[newIndex]);
  };

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

    if (isLeftSwipe) {
      handlePeriodChange('next');
    } else if (isRightSwipe) {
      handlePeriodChange('prev');
    }
  };

  const handleHover = (index: number | null) => {
    setActiveIndex(index);
  };

  const handleClick = (index: number) => {
    setClickedIndex(clickedIndex === index ? null : index);
    
    // Auto-clear after 500ms (0.5 seconds) - consistent for both mobile and desktop
    if (clickedIndex !== index) {
      setTimeout(() => {
        setClickedIndex(null);
      }, 500);
    }
  };

  const handleSynchronize = (cardId: string) => {
    const sortedIndex = categoryCards.findIndex((card) => card.id === cardId);

    if (sortedIndex === -1) {
      return;
    }

    setClickedIndex(clickedIndex === sortedIndex ? null : sortedIndex);

    if (clickedIndex !== sortedIndex) {
      setTimeout(() => {
        setClickedIndex(null);
      }, 500);
    }
  };

  const handleCardHover = (cardId: string | null) => {
    if (cardId === null) {
      handleHover(null);
    } else {
      const sortedIndex = categoryCards.findIndex((card) => card.id === cardId);
      if (sortedIndex !== -1) {
        handleHover(sortedIndex);
      }
    }
  };

  const currencyCode = dashboardData?.currency ?? rawData?.metadata?.currency ?? "INR";

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

  const formatCurrencyValue = (value: number) => currencyFormatter.format(Math.round(value));

  const categoryCards: CardType[] = (() => {
    const sourceSegments = dashboardData?.segments?.length
      ? dashboardData.segments
      : fallbackSegments;

    const sortedSegments = [...sourceSegments].sort((a, b) => b.amount - a.amount);

    return sortedSegments.map((item, index) => {
      const baseColor = item.color || `var(--chart-${(index % 5) + 1})`;

      return {
        id: item.id,
  title: item.name || formatCategoryLabel(item.id),
        value: item.amount,
        color: baseColor,
        percentage: item.percentage,
        isActive: activeIndex === index || clickedIndex === index,
      };
    });
  })();

  const anyCardActive = categoryCards.some((card) => card.isActive);

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Overview carousel swaps between streak view and placeholder insight cards */}
      <OverviewCarousel
        streakDays={currentStreak}
        transactionActivity={transactionActivity}
        tips={insightTips}
      />
      
      {/* Period Indicator with Swipe Navigation */}
      <motion.div 
        className="flex items-center justify-center gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          onClick={() => handlePeriodChange('prev')}
          className="p-2 rounded-full hover:bg-accent transition-colors"
          aria-label="Previous period"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        
        <div className="relative flex items-center gap-2">
          <div className="text-center min-w-[120px]">
            <p className="text-sm font-semibold transition-all duration-300">
              {periodLabels[dataPeriod]}
            </p>
          </div>
          
          {/* Period Dots Indicator */}
          <div className="flex gap-1.5">
            {periodOrder.map((period) => (
              <motion.button
                key={period}
                onClick={() => setDataPeriod(period)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  period === dataPeriod 
                    ? 'bg-primary w-6' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Switch to ${periodLabels[period]}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        <motion.button
          onClick={() => handlePeriodChange('next')}
          className="p-2 rounded-full hover:bg-accent transition-colors"
          aria-label="Next period"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Credit/Debit Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <CreditDebitChart 
          period={dataPeriod === 'weekly' ? 'week' : dataPeriod === 'monthly' ? 'month' : 'max'} 
          onPeriodChange={handlePeriodChange}
        />
      </motion.div>

      {/* Main Card with Swipe Support */}
      <motion.div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="touch-pan-y"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="w-full overflow-hidden">
          <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={dataPeriod}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`flex flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-8 items-center transition-all duration-500 ease-out ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
              >
            {/* Pie Chart Section - Main Attraction */}
            <div className="shrink-0 w-[52%] sm:w-[60%] md:w-[420px] lg:w-[480px]">
              <IncreaseSizePieChart 
                activeIndex={activeIndex}
                clickedIndex={clickedIndex}
                onHover={handleHover}
                onClick={handleClick}
                dashboardData={dashboardData}
                isLoading={isLoading}
              />
            </div>

            {/* Category List Section - Compact */}
            <div className="flex-1 min-w-0">
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                  {dashboardData?.categoryTitle || "Browser Categories"}
                </h3>
                <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
                  {categoryCards.map((card, index) => {
                    const isActive = card.isActive;
                    
                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: isLoading ? 0.5 : (anyCardActive && !isActive ? 0.3 : 1), x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`group px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 border border-border rounded-md sm:rounded-lg cursor-pointer hover:bg-accent/50 active:scale-95 ${
                          isLoading ? 'animate-pulse bg-muted' : ''
                        }`}
                        onClick={(e) => {
                          if (!isLoading) {
                            handleSynchronize(card.id);
                            // Remove focus after click
                            if (e.currentTarget instanceof HTMLElement) {
                              e.currentTarget.blur();
                            }
                          }
                        }}
                        onTouchEnd={(e) => {
                          if (!isLoading) {
                            e.preventDefault();
                            handleSynchronize(card.id);
                            // Remove focus after touch
                            if (e.currentTarget instanceof HTMLElement) {
                              e.currentTarget.blur();
                            }
                          }
                        }}
                        onMouseEnter={() => !isLoading && handleCardHover(card.id)}
                        onMouseLeave={() => !isLoading && handleCardHover(null)}
                        tabIndex={-1}
                      >
                        {!isLoading && (
                          <>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: card.color }}
                              />
                              <span className="font-medium text-[10px] sm:text-xs md:text-sm lg:text-base flex-1 truncate">
                                {card.title}
                              </span>
                            </div>
                            {card.value !== undefined && (
                              <div className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5 sm:mt-1 ml-3 sm:ml-4 md:ml-5 flex items-center gap-1.5">
                                <AnimatedCounter value={card.value} duration={1} format={formatCurrencyValue} />
                                <span>spent</span>
                                {typeof card.percentage === "number" && (
                                  <span className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground/80">
                                    ({card.percentage.toFixed(1)}%)
                                  </span>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  );
}
