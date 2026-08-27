"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Seconds. Hero stats run 1.2s (PRD §4.2). */
  duration?: number;
  delay?: number;
  className?: string;
};

/**
 * Count-up for the credibility numbers: +200, +50, 120% (PRD §4.2, §4.3).
 *
 * Always renders 0 first — both on the server and on the client's first
 * pass — so hydration matches, then the effect either animates up or
 * jumps straight to the value under reduced motion. Screen readers get
 * the final number immediately via `aria-label`; a ticking counter is
 * decoration, not information.
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.2,
  delay = 0,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const shouldReduce = usePrefersReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (shouldReduce) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration,
      delay,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, shouldReduce, value, duration, delay]);

  return (
    // tabular-nums: digits keep a fixed advance width, so the layout
    // doesn't jitter as the number ticks up through 1→2→3 digits.
    //
    // The final figure is real text for assistive tech; only the ticking
    // copy is hidden from it. (`aria-label` on a bare span would be
    // ignored — it needs a role to attach to.)
    <span className={cn("tabular-nums", className)} ref={ref}>
      <span className="sr-only">{`${prefix}${value}${suffix}`}</span>
      <span aria-hidden>
        {prefix}
        {display}
        {suffix}
      </span>
    </span>
  );
}
