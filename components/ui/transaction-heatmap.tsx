"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TransactionDay {
  date: string;
  count: number;
}

interface TransactionHeatmapProps {
  data: TransactionDay[];
}

export function TransactionHeatmap({ data }: TransactionHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [weeksToShow, setWeeksToShow] = useState(12); // Default to ~3 months
  const [baseColor, setBaseColor] = useState('oklch(0.7 0.2 290)');
  const [selectedDay, setSelectedDay] = useState<{ date: string; count: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [cellSize, setCellSize] = useState({ width: 10, height: 10, gap: 2 });
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get the computed chart-1 color
  useEffect(() => {
    const updateColor = () => {
      const root = document.documentElement;
      const color = getComputedStyle(root).getPropertyValue('--chart-1').trim();
      if (color) {
        setBaseColor(color);
      }
    };
    
    updateColor();
    
    // Listen for theme changes
    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });
    
    return () => observer.disconnect();
  }, []);

  // Calculate how many weeks can fit in the available width and dynamic cell sizing
  useEffect(() => {
    const calculateWeeks = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight || 200;
      
      // Dynamic cell sizing based on container
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      // Calculate optimal cell size - FURTHER REDUCED heights to fit container
      let cellWidth, cellHeight, gap;
      
      if (isMobile) {
        // Mobile: smaller cells with reduced height
        cellWidth = Math.max(10, Math.floor(containerWidth / 18));
        cellHeight = Math.max(7, Math.floor(containerHeight / 13)); // Further reduced to fit better
        gap = 2;
      } else if (isTablet) {
        // Tablet: medium cells with reduced height
        cellWidth = Math.max(14, Math.floor(containerWidth / 16));
        cellHeight = Math.max(8, Math.floor(containerHeight / 12)); // Further reduced
        gap = 2;
      } else {
        // Desktop: larger cells with reduced height
        cellWidth = Math.max(16, Math.floor(containerWidth / 14));
        cellHeight = Math.max(10, Math.floor(containerHeight / 11)); // Further reduced from 12
        gap = 2;
      }
      
      setCellSize({ width: cellWidth, height: cellHeight, gap });
      
      // Account for day labels on the left (~30px) and some padding
      const availableWidth = containerWidth - 40;
      
      // Calculate how many weeks can fit
      const weeksCount = Math.floor(availableWidth / (cellWidth + gap));
      
      // Set reasonable limits: minimum 4 weeks, maximum 20 weeks
      const clampedWeeks = Math.max(4, Math.min(20, weeksCount));
      setWeeksToShow(clampedWeeks);
    };

    calculateWeeks();
    window.addEventListener('resize', calculateWeeks);
    return () => window.removeEventListener('resize', calculateWeeks);
  }, []);

  const heatmapData = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    // Calculate the start date: go back the specified number of weeks
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (weeksToShow * 7 - 1));
    startDate.setHours(0, 0, 0, 0);
    
    // Adjust startDate to the previous Sunday to align weeks properly
    const startDayOfWeek = startDate.getDay();
    if (startDayOfWeek !== 0) {
      startDate.setDate(startDate.getDate() - startDayOfWeek);
    }
    
    // Calculate end date - the Saturday of the current week
    const endDate = new Date(today);
    const todayDayOfWeek = today.getDay();
    const daysUntilSaturday = 6 - todayDayOfWeek;
    endDate.setDate(today.getDate() + daysUntilSaturday);
    endDate.setHours(23, 59, 59, 999);

    // Create a map for quick lookup
    const dataMap = new Map(data.map(d => [d.date, d.count]));

    // Generate all days in range
    const days: { date: Date; count: number; dateStr: string }[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = dataMap.get(dateStr) ?? 0;
      
      // Mark future dates as -1 (empty/padding)
      const isFuture = currentDate > today;
      
      days.push({
        date: new Date(currentDate),
        count: isFuture ? -1 : count,
        dateStr: isFuture ? '' : dateStr
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Group by weeks (Sunday to Saturday) - each week should have exactly 7 days
    const weeks: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) {
      const week = days.slice(i, i + 7);
      // Only add complete weeks or the last partial week
      if (week.length > 0) {
        // Pad incomplete weeks to 7 days
        while (week.length < 7) {
          week.push({ date: new Date(0), count: -1, dateStr: '' });
        }
        weeks.push(week);
      }
    }

    return { weeks, maxCount: Math.max(...data.map(d => d.count), 1) };
  }, [data, weeksToShow]);

  const getIntensity = (count: number) => {
    if (count === -1) return 'hsl(var(--muted) / 0.5)'; // Empty cell - darker for better visibility
    if (count === 0) return 'hsl(var(--muted) / 0.7)'; // No transactions - slightly darker
    
    const { maxCount } = heatmapData;
    const ratio = count / maxCount;
    
    // Use base color (chart-1) with varying opacity for intensity
    if (ratio <= 0.25) return `color-mix(in oklch, ${baseColor} 30%, transparent)`;
    if (ratio <= 0.5) return `color-mix(in oklch, ${baseColor} 55%, transparent)`;
    if (ratio <= 0.75) return `color-mix(in oklch, ${baseColor} 80%, transparent)`;
    return baseColor;
  };

  const handleDayClick = (day: { date: Date; count: number; dateStr: string }, event: React.MouseEvent) => {
    if (day.count === -1) return; // Don't show tooltip for padding cells
    
    event.stopPropagation(); // Prevent click from bubbling
    
    // Clear any existing timer
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Responsive tooltip sizing
    const isMobile = viewportWidth < 768;
    const tooltipWidth = isMobile ? Math.min(180, viewportWidth - 40) : 200;
    const tooltipHeight = 80;
    const padding = isMobile ? 10 : 20;
    
    let x = rect.left + rect.width / 2;
    let y = rect.top - 10;
    let placeBelow = false;
    
    // Boundary checks and adjustments
    // Check if tooltip goes off left edge
    if (x - tooltipWidth / 2 < padding) {
      x = tooltipWidth / 2 + padding;
    }
    // Check if tooltip goes off right edge
    if (x + tooltipWidth / 2 > viewportWidth - padding) {
      x = viewportWidth - tooltipWidth / 2 - padding;
    }
    // Check if tooltip goes off top edge (place below cell instead)
    if (y - tooltipHeight < padding) {
      y = rect.bottom + 10;
      placeBelow = true;
    }
    // Check if tooltip goes off bottom edge when placed below
    if (placeBelow && y + tooltipHeight > viewportHeight - padding) {
      y = viewportHeight - tooltipHeight - padding;
    }
    
    setTooltipPosition({ x, y });
    
    // Toggle tooltip on click (for mobile)
    if (selectedDay?.date === day.dateStr) {
      setSelectedDay(null);
    } else {
      setSelectedDay({ date: day.dateStr, count: day.count });
      
      // Auto-dismiss after 1 second
      dismissTimerRef.current = setTimeout(() => {
        setSelectedDay(null);
      }, 1000);
    }
  };

  const handleDayHover = (day: { date: Date; count: number; dateStr: string }, event: React.MouseEvent) => {
    if (day.count === -1) return; // Don't show tooltip for padding cells
    
    // Don't handle hover on mobile devices (let click handle it)
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth < 768;
    if (isMobile) return;
    
    // Clear any existing timer on hover (desktop behavior - no auto-dismiss)
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Responsive tooltip sizing
    const tooltipWidth = 200;
    const tooltipHeight = 80;
    const padding = 20;
    
    let x = rect.left + rect.width / 2;
    let y = rect.top - 10;
    let placeBelow = false;
    
    // Boundary checks
    if (x - tooltipWidth / 2 < padding) {
      x = tooltipWidth / 2 + padding;
    }
    if (x + tooltipWidth / 2 > viewportWidth - padding) {
      x = viewportWidth - tooltipWidth / 2 - padding;
    }
    if (y - tooltipHeight < padding) {
      y = rect.bottom + 10;
      placeBelow = true;
    }
    // Check if tooltip goes off bottom edge when placed below
    if (placeBelow && y + tooltipHeight > viewportHeight - padding) {
      y = viewportHeight - tooltipHeight - padding;
    }
    
    setTooltipPosition({ x, y });
    setSelectedDay({ date: day.dateStr, count: day.count });
  };

  const handleClickOutside = () => {
    // Clear timer when clicking outside
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setSelectedDay(null);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedDay) {
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // Check if click is outside heatmap cells
        if (!target.closest('[data-heatmap-cell]')) {
          setSelectedDay(null);
        }
      };
      
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [selectedDay]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Get month labels - align with the 1st day of each month
  const getMonthLabels = () => {
    const labels: { month: string; weekIndex: number; dayIndexInWeek: number }[] = [];
    let seenMonths = new Set<number>();
    
    heatmapData.weeks.forEach((week, weekIndex) => {
      week.forEach((day, dayIndex) => {
        if (day.count !== -1 && day.dateStr) {
          const month = day.date.getMonth();
          const dayOfMonth = day.date.getDate();
          
          // Check if this is the 1st day of a month we haven't seen yet
          if (dayOfMonth === 1 && !seenMonths.has(month)) {
            labels.push({
              month: monthNames[month],
              weekIndex,
              dayIndexInWeek: dayIndex
            });
            seenMonths.add(month);
          }
        }
      });
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <>
      <div ref={containerRef} className="w-full h-full flex items-center" onClick={handleClickOutside}>
        <div className="w-full h-full overflow-x-auto overflow-y-hidden">
          <div className="inline-flex flex-col min-w-full h-full py-2 relative justify-center">
          {/* Month labels */}
          <div className="flex mb-3 md:mb-4 lg:mb-5 ml-5 md:ml-6 relative h-6">
            {monthLabels.map((label, idx) => {
              // Calculate absolute position from the start
              // Each week column = (cellSize.width + cellSize.gap)
              // Position month label above the exact column where day 1 appears
              const absoluteLeft = label.weekIndex * (cellSize.width + cellSize.gap);
              
              return (
                <div
                  key={idx}
                  className="text-[9px] md:text-[10px] lg:text-xs text-muted-foreground font-medium absolute"
                  style={{
                    left: `${absoluteLeft}px`,
                  }}
                >
                  {label.month}
                </div>
              );
            })}
          </div>

            <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col pr-1" style={{ gap: `${cellSize.gap}px` }}>
              {dayNames.map((day, idx) => (
                <div
                  key={idx}
                  className="text-[9px] md:text-[10px] text-muted-foreground flex items-center justify-center"
                  style={{ width: '16px', height: `${cellSize.height}px` }}
                >
                  {idx % 2 === 1 ? day : ''}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex" style={{ gap: `${cellSize.gap}px` }}>
              {heatmapData.weeks.map((week, weekIdx) => (
                <motion.div 
                  key={weekIdx} 
                  className="flex flex-col"
                  style={{ gap: `${cellSize.gap}px` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: weekIdx * 0.02 }}
                >
                  {week.map((day, dayIdx) => {
                    const intensity = getIntensity(day.count);
                    const isActive = selectedDay?.date === day.dateStr;
                    
                    return (
                      <motion.div
                        key={dayIdx}
                        data-heatmap-cell
                        className={`rounded-sm border cursor-pointer relative ${
                          isActive ? 'border-primary/80' : 'border-border/20'
                        }`}
                        style={{
                          backgroundColor: intensity,
                          width: `${cellSize.width}px`,
                          height: `${cellSize.height}px`,
                        }}
                        whileHover={{ scale: 1.4, boxShadow: "0 0 8px rgba(255,255,255,0.3)" }}
                        whileTap={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        onClick={(e) => handleDayClick(day, e)}
                        onMouseEnter={(e) => handleDayHover(day, e)}
                        onMouseLeave={() => {
                          if (day.count === -1) return;
                          const isMobile = window.innerWidth < 768;
                          if (!isMobile) setSelectedDay(null);
                        }}
                        animate={isActive ? { scale: 1.3 } : {}}
                      />
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Tooltip - Rendered outside overflow container for better visibility */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="fixed pointer-events-none backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: tooltipPosition.y > window.innerHeight / 2 ? 'translate(-50%, -100%)' : 'translate(-50%, 20px)',
              zIndex: 99999,
              background: 'hsl(var(--popover) / 0.98)',
              border: '2px solid hsl(var(--primary) / 0.5)',
              color: 'hsl(var(--popover-foreground))',
              boxShadow: '0 20px 60px -10px rgba(0,0,0,0.7), 0 0 0 1px hsl(var(--primary) / 0.1)',
              borderRadius: '0.75rem',
              minWidth: '120px',
              maxWidth: 'calc(100vw - 40px)',
              width: 'max-content',
            }}
          >
            <div className="text-center">
              <div className="font-bold text-xs sm:text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                {selectedDay.date}
              </div>
              <div className="text-primary font-semibold mt-1 text-[10px] sm:text-xs md:text-sm whitespace-nowrap">
                {selectedDay.count} transaction{selectedDay.count !== 1 ? 's' : ''}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
