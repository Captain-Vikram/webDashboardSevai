"use client";

import { useState, useMemo, useCallback } from "react";
import type { TouchEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StreakFireElement } from "./streak-fire-element";

export interface InsightTip {
  id?: string;
  title?: string;
  description?: string;
  accent?: string;
}

type ActivityDay = {
  date: string;
  count: number;
};

interface OverviewCarouselProps {
  streakDays: number;
  transactionActivity: ActivityDay[];
  tips?: InsightTip[];
}

type SlideId = "streak" | "insights";

const swipeThreshold = 50;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 36 : -36,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -36 : 36,
    opacity: 0,
  }),
};

const PANEL_HEIGHT = "h-[220px] sm:h-[240px] md:h-[260px] lg:h-[280px]";

export function OverviewCarousel({ streakDays, transactionActivity, tips }: OverviewCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const slides = useMemo(
    () => [
      {
        id: "streak" as SlideId,
        element: (
          <div className="flex h-full w-full items-stretch justify-center">
            <StreakFireElement
              streakDays={streakDays}
              transactionActivity={transactionActivity}
            />
          </div>
        ),
      },
      {
        id: "insights" as SlideId,
        element: (
          <div className="flex h-full w-full items-stretch justify-center">
            <TipsPanel tips={tips} />
          </div>
        ),
      },
    ],
    [streakDays, transactionActivity, tips]
  );

  const totalSlides = slides.length;

  const changeSlide = useCallback(
    (index: number) => {
      if (index === currentSlide) return;
      const normalizedIndex = (index + totalSlides) % totalSlides;
      const travelDirection = normalizedIndex > currentSlide ? 1 : -1;
      setDirection(travelDirection);
      setCurrentSlide(normalizedIndex);
    },
    [currentSlide, totalSlides]
  );

  const handleNext = useCallback(() => {
    changeSlide(currentSlide + 1);
  }, [changeSlide, currentSlide]);

  const handlePrev = useCallback(() => {
    changeSlide(currentSlide - 1);
  }, [changeSlide, currentSlide]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(event.targetTouches[0]?.clientX ?? null);
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(event.targetTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const travel = touchStart - touchEnd;
    if (Math.abs(travel) < swipeThreshold) return;

    if (travel > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={slides[currentSlide].id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`w-full ${PANEL_HEIGHT} overflow-hidden`}
        >
          {slides[currentSlide].element}
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={handlePrev}
        className="hidden md:block absolute inset-y-0 left-0 w-16 cursor-pointer border-none bg-transparent p-0"
        aria-label="Previous panel"
      />
      <button
        type="button"
        onClick={handleNext}
        className="hidden md:block absolute inset-y-0 right-0 w-16 cursor-pointer border-none bg-transparent p-0"
        aria-label="Next panel"
      />

      <div className="mt-2 flex justify-center gap-1.5">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => changeSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-6 bg-primary"
                : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/60"
            }`}
            aria-label={`Go to panel ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

const fallbackTips: InsightTip[] = [
  {
    id: "fallback-tip-1",
    title: "Track Your Progress",
    description:
      "We continuously monitor your financial activity to provide clear insights and practical guidance. Maintain your transaction streak to unlock more detailed analytics and personalized coaching recommendations.",
    accent: "primary",
  },
  {
    id: "fallback-tip-2",
    title: "Stay Consistent",
    description:
      "Record your transactions regularly to build a comprehensive financial history. The more consistently you log transactions, the more accurate and actionable the insights and recommendations you receive will be.",
    accent: "secondary",
  },
];

function TipsPanel({ tips }: { tips?: InsightTip[] }) {
  const prepared = useMemo(() => {
    const cleaned = (tips ?? [])
      .filter((tip) => Boolean(tip && (tip.title || tip.description)))
      .slice(0, 2);

    while (cleaned.length < 2) {
      cleaned.push(fallbackTips[cleaned.length]);
    }

    return cleaned;
  }, [tips]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className="mx-auto flex h-full w-full max-w-4xl overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-full flex-col gap-3 sm:grid sm:grid-cols-2 sm:items-stretch sm:gap-3 p-0.5 sm:h-full">
        {prepared.map((tip, index) => (
          <TipCard
            key={tip.id ?? `tip-${index}`}
            tip={tip}
            index={index}
            isActive={activeIndex === index}
            onToggle={() => handleToggle(index)}
            isLastCard={index === prepared.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

interface TipCardProps {
  tip: InsightTip;
  index: number;
  isActive: boolean;
  onToggle: () => void;
  isLastCard: boolean;
}

function TipCard({ tip, index, isActive, onToggle, isLastCard }: TipCardProps) {
  const theme = getTipTheme(tip.accent, index);
  const title = tip.title?.trim() || `Tip ${index + 1}`;
  const description = tip.description?.trim();

  return (
    <div className={`w-full transition-all duration-700 ease-out ${
      isActive 
        ? "flex-1 sm:h-full" 
        : "h-[calc(50%-0.375rem)] sm:h-full"
    }`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isActive}
        className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border ${theme.border} ${theme.background} px-5 py-4 text-left shadow-sm transition-all duration-700 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] sm:pointer-events-none sm:py-5 sm:active:scale-100 ${
          isActive ? "shadow-md" : "hover:shadow-md active:shadow-lg"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className={`text-base font-semibold leading-tight transition-colors duration-200 ${theme.title} ${
            isActive ? "sm:text-base" : "group-hover:opacity-90"
          }`}>{title}</h3>
          <span className={`text-[10px] uppercase tracking-wide text-muted-foreground transition-all duration-200 sm:hidden ${
            isActive ? "opacity-60 scale-95" : "opacity-80 group-active:scale-90"
          }`}>
            {isActive ? "Tap to hide" : "Tap to view"}
          </span>
        </div>

        {description && (
          <div
            className={`mt-3 text-sm leading-relaxed transition-all duration-700 ease-out ${theme.body} ${
              isActive 
                ? "max-h-[300px] opacity-100" 
                : "max-h-0 opacity-0"
            } overflow-y-auto sm:max-h-full sm:opacity-100 sm:overflow-hidden sm:transition-none sm:flex-1`}
          >
            <div className="pr-1 sm:pr-0 sm:[display:-webkit-box] sm:[-webkit-line-clamp:9] sm:[-webkit-box-orient:vertical] [scrollbar-width:thin] sm:[scrollbar-width:none] [-ms-overflow-style:auto] sm:[-ms-overflow-style:none] [&::-webkit-scrollbar]:w-1 sm:[&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full">
              {description}
            </div>
          </div>
        )}

        <div className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-700 ${theme.overlay} ${
          isActive ? "opacity-100" : "opacity-50 group-hover:opacity-70 group-active:opacity-90"
        }`} />
      </button>
    </div>
  );
}

function getTipTheme(accent: string | undefined, index: number) {
  const palette: Record<string, { background: string; border: string; title: string; body: string; overlay: string }> = {
    primary: {
      background: "bg-gradient-to-br from-primary/15 via-primary/10 to-primary/20",
      border: "border-primary/25",
      title: "text-primary-foreground",
      body: "text-primary-foreground/75",
      overlay: "bg-primary/8",
    },
    secondary: {
      background: "bg-gradient-to-br from-secondary/15 via-secondary/10 to-secondary/20",
      border: "border-secondary/25",
      title: "text-secondary-foreground",
      body: "text-secondary-foreground/75",
      overlay: "bg-secondary/8",
    },
    accent: {
      background: "bg-gradient-to-br from-accent/15 via-accent/10 to-accent/20",
      border: "border-accent/25",
      title: "text-accent-foreground",
      body: "text-accent-foreground/75",
      overlay: "bg-accent/8",
    },
    neutral: {
      background: "bg-muted/50",
      border: "border-border/40",
      title: "text-foreground",
      body: "text-muted-foreground",
      overlay: "bg-muted/20",
    },
  };

  const accentKey = accent?.toLowerCase();
  if (accentKey && palette[accentKey]) {
    return palette[accentKey];
  }

  return index % 2 === 0 ? palette.primary : palette.secondary;
}
