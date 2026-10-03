"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  format?: (value: number) => string;
}

export function AnimatedCounter({ value, className, style, duration = 2, format }: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const formatted = useTransform(rounded, (latest) =>
    format ? format(latest) : latest.toLocaleString()
  );

  useEffect(() => {
    const controls = animate(count, value, { duration });
    return () => controls.stop();
  }, [value, duration, count]);

  return (
    <motion.span className={className} style={style}>
      {formatted}
    </motion.span>
  );
}
