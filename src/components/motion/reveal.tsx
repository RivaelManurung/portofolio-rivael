"use client";

import { motion } from "motion/react";
import type { ElementType, ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { maskReveal, revealTransition, revealUp, viewport } from "@/lib/motion";

type RevealVariant = "up" | "mask";

type RevealProps = {
  children: ReactNode;
  /** Stagger position — multiplied by the variant's per-item delay. */
  index?: number;
  variant?: RevealVariant;
  className?: string;
  as?: ElementType;
};

/**
 * Thin client boundary around otherwise-static content.
 *
 * The point is granularity (PRD §7.1): this component is the only thing
 * that ships as `'use client'`. Whatever it wraps stays a Server
 * Component, because `children` is already-rendered React passed
 * through the boundary, not re-executed on the client.
 *
 * Note what does *not* happen here: the variants object never changes.
 * Reduced motion only alters the transition (PRD §12.7). Swapping
 * variants after `initial` has painted strands properties at their
 * hidden values, which is how reveals once froze off-screen for exactly
 * the users who had asked for less motion.
 */
export function Reveal({
  children,
  index = 0,
  variant = "up",
  className,
  as = "div",
}: RevealProps) {
  const shouldReduce = usePrefersReducedMotion();
  const MotionTag = motion[as as "div"];
  const isMask = variant === "mask";

  return (
    <MotionTag
      className={className}
      initial="hidden"
      transition={revealTransition({
        reduced: shouldReduce,
        index,
        slow: isMask,
      })}
      variants={isMask ? maskReveal : revealUp}
      viewport={viewport}
      whileInView="visible"
    >
      {children}
    </MotionTag>
  );
}
