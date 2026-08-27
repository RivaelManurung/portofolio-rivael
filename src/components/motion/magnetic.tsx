"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { useHasFinePointer } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { spring } from "@/lib/motion";

type MagneticProps = {
  children: ReactNode;
  /** How far the element leans toward the cursor, 0–1. */
  strength?: number;
  className?: string;
};

/**
 * Magnetic hover — PRD §3.4.
 *
 * The element leans toward the pointer while it's over the trigger area
 * and springs back on leave. Pointer-only: on touch there is no hover
 * state to express, so the listeners are never attached.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasFinePointer = useHasFinePointer();
  const shouldReduce = usePrefersReducedMotion();
  const active = hasFinePointer && !shouldReduce;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, spring.magnetic);
  const y = useSpring(rawY, spring.magnetic);

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Offset from the element's centre, scaled down so the element
    // trails the cursor rather than snapping under it.
    rawX.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    rawY.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function handleLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      className={className}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      ref={ref}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  );
}
