"use client";

import { motion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { useIsDesktop } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type ParallaxProps = {
  children: ReactNode;
  /** Total travel in px across the element's scroll range. */
  distance?: number;
  className?: string;
};

/**
 * Scroll-linked vertical drift — PRD §4.3, §4.6.
 *
 * Disabled below `lg` and under reduced motion (PRD §5.6, §11): on
 * mid-range phones the extra compositing is the difference between a
 * smooth page and a janky one, and the effect adds nothing at that size.
 */
export function Parallax({
  children,
  distance = 60,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const shouldReduce = usePrefersReducedMotion();
  const active = isDesktop && !shouldReduce;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Hooks must run unconditionally; gate the *output*, not the hook.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    active ? [distance, -distance] : [0, 0],
  );

  return (
    <div className={className} ref={ref}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
