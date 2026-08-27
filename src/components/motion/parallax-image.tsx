"use client";

import { motion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { useIsDesktop } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type ParallaxImageProps = {
  children: ReactNode;
  /** Travel in px. Must stay well under the 10% scale overhang. */
  distance?: number;
  className?: string;
};

/**
 * Image that drifts inside its own frame — PRD §4.3.
 *
 * Differs from `<Parallax>`, which moves a whole block: here the frame
 * stays put and only the picture slides behind it. The child is scaled
 * to 110% so the travel never exposes an edge, which caps how far
 * `distance` can usefully go.
 */
export function ParallaxImage({
  children,
  distance = 24,
  className,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const shouldReduce = usePrefersReducedMotion();
  const active = isDesktop && !shouldReduce;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    active ? [-distance, distance] : [0, 0],
  );

  return (
    <div className={cn("overflow-hidden", className)} ref={ref}>
      <motion.div className="size-full scale-110" style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
