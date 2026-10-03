"use client";

import { useState, useEffect, useMemo } from "react";
import { Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface DashboardData {
  chartTitle?: string;
  chartPeriod?: string;
  categoryTitle?: string;
  totalAmount?: number;
  currency?: string;
  segments: Array<{
    id: string;
    name: string;
    amount: number;
    percentage?: number;
    type?: string;
    color?: string;
  }>;
}
export const fallbackSegments: DashboardData["segments"] = [
  { id: "groceries", name: "Groceries", amount: 13200, percentage: 27.92, color: "hsl(var(--chart-1))" },
  { id: "utilities", name: "Utilities", amount: 8400, percentage: 17.77, color: "hsl(var(--chart-2))" },
  { id: "transport", name: "Transport", amount: 6200, percentage: 13.11, color: "hsl(var(--chart-3))" },
  { id: "family_care", name: "Family Care", amount: 5600, percentage: 11.84, color: "hsl(var(--chart-4))" },
  { id: "miscellaneous", name: "Miscellaneous", amount: 13900, percentage: 29.36, color: "hsl(var(--chart-5))" },
];

// Configure the size increase between each donut ring - largest gets biggest ring
// Mobile sizes (for screens < 640px)
const BASE_RADIUS_MOBILE = 70;
const SIZE_DECREMENT_MOBILE = 10;
const INNER_RADIUS_MOBILE = 25;

// Desktop sizes (for screens >= 640px)
const BASE_RADIUS_DESKTOP = 115;
const SIZE_DECREMENT_DESKTOP = 17;
const INNER_RADIUS_DESKTOP = 40;

const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig;

interface IncreaseSizePieChartProps {
  activeIndex?: number | null;
  clickedIndex?: number | null;
  onHover?: (index: number | null) => void;
  onClick?: (index: number) => void;
  dashboardData?: DashboardData | null;
  isLoading?: boolean;
}

export function IncreaseSizePieChart({ 
  activeIndex: externalActiveIndex, 
  clickedIndex: externalClickedIndex,
  onHover: externalOnHover,
  onClick: externalOnClick,
  dashboardData,
  isLoading = false
}: IncreaseSizePieChartProps = {}) {
  const [internalActiveIndex, setInternalActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [resolvedColors, setResolvedColors] = useState<string[]>([]);

  // Resolve CSS variables to actual colors for SVG
  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const colors = [1, 2, 3, 4, 5].map(i => {
        const cssVar = getComputedStyle(root).getPropertyValue(`--chart-${i}`).trim();
        return cssVar || `oklch(0.5 0.2 ${i * 60})`;
      });
      setResolvedColors(colors);
    };
    
    updateColors();
    
    // Listen for theme changes
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });
    
    return () => observer.disconnect();
  }, []);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use appropriate sizes based on screen size
  const BASE_RADIUS = isMobile ? BASE_RADIUS_MOBILE : BASE_RADIUS_DESKTOP;
  const SIZE_DECREMENT = isMobile ? SIZE_DECREMENT_MOBILE : SIZE_DECREMENT_DESKTOP;
  const INNER_RADIUS = isMobile ? INNER_RADIUS_MOBILE : INNER_RADIUS_DESKTOP;

  const currencyCode = dashboardData?.currency ?? "INR";

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

  const segmentsFromJson = useMemo(() => {
    const segments = dashboardData?.segments?.length
      ? dashboardData.segments
      : fallbackSegments;

    return segments.map((segment, index) => {
      const paletteSize = resolvedColors.length || 5;
      const paletteIndex = paletteSize > 0 ? index % paletteSize : index;
      const fallbackColor = resolvedColors[paletteIndex] || `var(--chart-${(paletteIndex % 5) + 1})`;
      const appliedColor = segment.color || fallbackColor;

      return {
        id: segment.id,
        label: segment.name,
        amount: segment.amount,
        percentage: segment.percentage,
        type: segment.type,
        color: appliedColor,
      };
    });
  }, [dashboardData?.segments, resolvedColors]);

  const sortedSegments = useMemo(
    () => [...segmentsFromJson].sort((a, b) => b.amount - a.amount),
    [segmentsFromJson]
  );

  const totalAmount = useMemo(
    () => sortedSegments.reduce((sum, segment) => sum + segment.amount, 0),
    [sortedSegments]
  );

  const formatCurrency = (value: number) => currencyFormatter.format(value);

  // Use external state if provided, otherwise use internal state
  const activeIndex = externalActiveIndex !== undefined ? externalActiveIndex : internalActiveIndex;
  const clickedIndex = externalClickedIndex !== undefined ? externalClickedIndex : null;

  const handleMouseEnter = (index: number) => {
    // Disable hover on mobile
    if (isMobile) return;
    
    if (externalOnHover) {
      externalOnHover(index);
    } else {
      setInternalActiveIndex(index);
    }
  };

  const handleMouseLeave = () => {
    // Disable hover on mobile
    if (isMobile) return;
    
    if (externalOnHover) {
      externalOnHover(null);
    } else {
      setInternalActiveIndex(null);
    }
  };

  return (
    <div className={`flex flex-col gap-1 sm:gap-2 w-full transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
      <div className="text-center">
        <h3 className={`font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base ${isLoading ? 'animate-pulse bg-muted rounded h-4 w-24 mx-auto' : ''}`}>
          {!isLoading && (dashboardData?.chartTitle || "Spending by Category")}
        </h3>
        <p className={`text-muted-foreground text-[9px] sm:text-[10px] md:text-xs mt-0.5 sm:mt-1 ${isLoading ? 'animate-pulse bg-muted rounded h-3 w-32 mx-auto mt-1' : ''}`}>
          {!isLoading && (dashboardData?.chartPeriod || "Last 30 Days")}
        </p>
      </div>
      <div className={`w-full aspect-square max-w-full overflow-visible ${isLoading ? 'animate-pulse' : ''}`}>
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background w-full h-full"
        >
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            {!isMobile && (
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) => (
                      <span className="font-mono">
                        {formatCurrency(typeof value === 'number' ? value : Number(value))}
                      </span>
                    )}
                  />
                }
                animationDuration={200}
                cursor={false}
              />
            )}
            {(() => {
              let runningTotal = 0;
              const total = totalAmount || 1;

              return sortedSegments.map((entry, index) => {
                const isActive = activeIndex === index || clickedIndex === index;
                const isAnyActive = activeIndex !== null || clickedIndex !== null;
                const startAngle = (runningTotal / total) * 360;
                runningTotal += entry.amount;
                const endAngle = (runningTotal / total) * 360;

                return (
                  <Pie
                    key={`pie-${index}`}
                    data={[entry]}
                    innerRadius={INNER_RADIUS}
                    outerRadius={BASE_RADIUS - index * SIZE_DECREMENT}
                    dataKey="amount"
                    cornerRadius={6}
                    paddingAngle={6}
                    animationBegin={0}
                    animationDuration={800}
                    animationEasing="ease-out"
                    isAnimationActive={true}
                    activeIndex={-1}
                    activeShape={undefined}
                    startAngle={startAngle}
                    endAngle={endAngle || startAngle}
                  >
                    <Cell
                      fill={entry.color}
                      opacity={isAnyActive && !isActive ? 0.3 : 1}
                      stroke="hsl(var(--border))"
                      strokeWidth={2}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Pie>
                );
              });
            })()}

          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}
