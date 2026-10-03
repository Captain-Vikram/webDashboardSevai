"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionHeatmap } from "./transaction-heatmap";
import { AnimatedCounter } from "./animated-counter";

interface TransactionDay {
  date: string;
  count: number;
}

interface FlameConfig {
  minDays: number;
  maxDays: number;
  stage: 0 | 1 | 2 | 3 | 4;
  flameColor: string;
  glowColor: string;
  emberColor: string;
}

interface StreakFireElementProps {
  streakDays?: number;
  transactionActivity?: TransactionDay[];
}

const flameConfigs: FlameConfig[] = [
  // Red (1-100)
  { minDays: 1, maxDays: 25, stage: 1, flameColor: "#DC143C", glowColor: "#8B0000", emberColor: "#ff4500" },
  { minDays: 26, maxDays: 50, stage: 2, flameColor: "#DC143C", glowColor: "#8B0000", emberColor: "#ff4500" },
  { minDays: 51, maxDays: 75, stage: 3, flameColor: "#DC143C", glowColor: "#8B0000", emberColor: "#ff4500" },
  { minDays: 76, maxDays: 100, stage: 4, flameColor: "#DC143C", glowColor: "#8B0000", emberColor: "#ff4500" },
  // Orange (101-200)
  { minDays: 101, maxDays: 125, stage: 1, flameColor: "#FF6347", glowColor: "#DC143C", emberColor: "#ff7700" },
  { minDays: 126, maxDays: 150, stage: 2, flameColor: "#FF6347", glowColor: "#DC143C", emberColor: "#ff7700" },
  { minDays: 151, maxDays: 175, stage: 3, flameColor: "#FF6347", glowColor: "#DC143C", emberColor: "#ff7700" },
  { minDays: 176, maxDays: 200, stage: 4, flameColor: "#FF6347", glowColor: "#DC143C", emberColor: "#ff7700" },
  // Yellow (201-300)
  { minDays: 201, maxDays: 225, stage: 1, flameColor: "#FFA500", glowColor: "#FF6347", emberColor: "#ffaa00" },
  { minDays: 226, maxDays: 250, stage: 2, flameColor: "#FFA500", glowColor: "#FF6347", emberColor: "#ffaa00" },
  { minDays: 251, maxDays: 275, stage: 3, flameColor: "#FFA500", glowColor: "#FF6347", emberColor: "#ffaa00" },
  { minDays: 276, maxDays: 300, stage: 4, flameColor: "#FFA500", glowColor: "#FF6347", emberColor: "#ffaa00" },
  // Green (301-400)
  { minDays: 301, maxDays: 325, stage: 1, flameColor: "#9ACD32", glowColor: "#7CFC00", emberColor: "#ADFF2F" },
  { minDays: 326, maxDays: 350, stage: 2, flameColor: "#9ACD32", glowColor: "#7CFC00", emberColor: "#ADFF2F" },
  { minDays: 351, maxDays: 375, stage: 3, flameColor: "#9ACD32", glowColor: "#7CFC00", emberColor: "#ADFF2F" },
  { minDays: 376, maxDays: 400, stage: 4, flameColor: "#9ACD32", glowColor: "#7CFC00", emberColor: "#ADFF2F" },
  // White (401-500)
  { minDays: 401, maxDays: 425, stage: 1, flameColor: "#F0F8FF", glowColor: "#E6E6FA", emberColor: "#FFFFFF" },
  { minDays: 426, maxDays: 450, stage: 2, flameColor: "#F0F8FF", glowColor: "#E6E6FA", emberColor: "#FFFFFF" },
  { minDays: 451, maxDays: 475, stage: 3, flameColor: "#F0F8FF", glowColor: "#E6E6FA", emberColor: "#FFFFFF" },
  { minDays: 476, maxDays: 500, stage: 4, flameColor: "#F0F8FF", glowColor: "#E6E6FA", emberColor: "#FFFFFF" },
  // Blue (501-600)
  { minDays: 501, maxDays: 525, stage: 1, flameColor: "#1E90FF", glowColor: "#4169E1", emberColor: "#00BFFF" },
  { minDays: 526, maxDays: 550, stage: 2, flameColor: "#1E90FF", glowColor: "#4169E1", emberColor: "#00BFFF" },
  { minDays: 551, maxDays: 575, stage: 3, flameColor: "#1E90FF", glowColor: "#4169E1", emberColor: "#00BFFF" },
  { minDays: 576, maxDays: 600, stage: 4, flameColor: "#1E90FF", glowColor: "#4169E1", emberColor: "#00BFFF" },
  // Violet (601-700)
  { minDays: 601, maxDays: 625, stage: 1, flameColor: "#8B00FF", glowColor: "#9400D3", emberColor: "#DA70D6" },
  { minDays: 626, maxDays: 650, stage: 2, flameColor: "#8B00FF", glowColor: "#9400D3", emberColor: "#DA70D6" },
  { minDays: 651, maxDays: 675, stage: 3, flameColor: "#8B00FF", glowColor: "#9400D3", emberColor: "#DA70D6" },
  { minDays: 676, maxDays: 700, stage: 4, flameColor: "#8B00FF", glowColor: "#9400D3", emberColor: "#DA70D6" },
  // Black (701+)
  { minDays: 701, maxDays: 750, stage: 1, flameColor: "#1C1C1C", glowColor: "#000000", emberColor: "#2F4F4F" },
  { minDays: 751, maxDays: 800, stage: 2, flameColor: "#1C1C1C", glowColor: "#000000", emberColor: "#2F4F4F" },
  { minDays: 801, maxDays: 900, stage: 3, flameColor: "#1C1C1C", glowColor: "#000000", emberColor: "#2F4F4F" },
  { minDays: 901, maxDays: Infinity, stage: 4, flameColor: "#1C1C1C", glowColor: "#000000", emberColor: "#2F4F4F" },
];

function getFlameConfig(days: number): FlameConfig {
  if (days === 0) {
    return {
      minDays: 0,
      maxDays: 0,
      stage: 0,
      flameColor: "#4a0000",
      glowColor: "#2a0000",
      emberColor: "#8B4513",
    };
  }
  return flameConfigs.find(config => days >= config.minDays && days <= config.maxDays) || flameConfigs[0];
}

export function StreakFireElement({ streakDays = 0, transactionActivity = [] }: StreakFireElementProps) {
  const [displayDays, setDisplayDays] = useState(0);
  // Re-evaluate config dynamically based on current streakDays value
  const config = getFlameConfig(displayDays > 0 ? displayDays : streakDays);

  // Animate the counter
  useEffect(() => {
    if (displayDays === streakDays) return;

    const duration = 1000;
    const steps = 30;
    const increment = (streakDays - displayDays) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayDays(streakDays);
        clearInterval(timer);
      } else {
        setDisplayDays(prev => Math.round(prev + increment));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [streakDays, displayDays]);

  // Generate custom styles for colors
  const colorStyles = {
    "--flame-color": config.flameColor,
    "--flame-glow": config.glowColor,
    "--ember-color": config.emberColor,
  } as React.CSSProperties;

  return (
    <Card className="mx-auto flex h-full w-full max-w-4xl overflow-hidden">
      <CardContent className="flex h-full w-full flex-row items-stretch gap-2 p-2 sm:gap-3 sm:p-3 md:gap-4 md:p-4 lg:gap-5 lg:p-5">
        
        {/* Left Column - Fire Animation and Streak Number */}
        <div className="flex h-full shrink-0 flex-col justify-between gap-2 sm:gap-3">
          {/* Flame Container - Square */}
          <motion.div 
                className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] md:w-[140px] md:h-[140px] lg:w-[160px] lg:h-[160px] flex items-center justify-center rounded-lg border border-border/30 bg-muted/20 overflow-visible"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              >
                <div 
                  className={`streak-campfire ${config.stage === 0 ? "pre-ignition" : ""}`}
                  style={colorStyles}
                >
                  <div className="streak-fire">
                    {config.stage >= 4 && (
                      <div className="streak-fire-left">
                        <div className="streak-main-fire" />
                        <div className="streak-particle-fire" />
                      </div>
                    )}
                    {config.stage >= 1 && (
                      <div className="streak-fire-center">
                        <div className="streak-main-fire" />
                        <div className="streak-particle-fire" />
                      </div>
                    )}
                    {config.stage >= 3 && (
                      <div className="streak-fire-right">
                        <div className="streak-main-fire" />
                        <div className="streak-particle-fire" />
                      </div>
                    )}
                    {config.stage >= 2 && (
                      <div className="streak-fire-bottom">
                        <div className="streak-main-fire" />
                      </div>
                    )}
                  </div>
                  <div className="streak-wood">
                    <div className="streak-wood-piece streak-wood-1" />
                    <div className="streak-wood-piece streak-wood-2" />
                    <div className="streak-wood-piece streak-wood-3" />
                    <div className={`streak-ember streak-ember-1 ${config.stage === 0 ? "pre-ignition-ember" : ""}`} />
                    <div className={`streak-ember streak-ember-2 ${config.stage === 0 ? "pre-ignition-ember" : ""}`} />
                    <div className={`streak-ember streak-ember-3 ${config.stage === 0 ? "pre-ignition-ember" : ""}`} />
                    {config.stage === 0 && (
                      <>
                        <div className="streak-ember pre-ignition-ember streak-ember-4" />
                        <div className="streak-ember pre-ignition-ember streak-ember-5" />
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {/* Streak Number Container - Rectangular */}
              <motion.div 
                className="w-[90px] sm:w-[110px] md:w-[140px] lg:w-[160px] h-[60px] sm:h-[65px] md:h-[75px] lg:h-[80px] flex flex-col items-center justify-center rounded-lg border border-border/30 bg-muted/20 px-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Streak
                </div>
                <div className="mt-0.5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-none" style={{ color: config.flameColor }}>
                  <AnimatedCounter value={displayDays} duration={1.5} />
                </div>
                <div className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs text-muted-foreground mt-0.5">
                  {displayDays === 1 ? "Day" : "Days"}
                </div>
              </motion.div>
            </div>

          {/* Right Section - Transaction Activity Heatmap */}
          <motion.div 
            className="flex h-full min-w-0 flex-1 items-center justify-center overflow-hidden rounded-lg border border-border/30 bg-muted/20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <div className="h-full w-full p-2 sm:p-3 md:p-4">
              <TransactionHeatmap 
                data={transactionActivity} 
              />
            </div>
          </motion.div>
      </CardContent>
    </Card>
  );
}
