"use client";

import { motion } from "motion/react";
import { duration, ease, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Hand-drawn connector that draws itself on scroll — PRD §4.3.
 *
 * `pathLength` is the whole trick: Motion normalises any path to 0–1, so
 * animating it from 0 draws the stroke end-to-end regardless of the
 * path's real length. The head is a second path held back until the
 * shaft has nearly arrived, so it reads as one gesture rather than two
 * lines appearing.
 *
 * Of everything in the About block this is the detail that reads as
 * crafted, so it gets the section's one focal animation (PRD §5.3).
 */
export function DrawnArrow({ className }: { className?: string }) {
  const stroke = {
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <motion.svg
      aria-hidden
      className={cn("h-auto w-full", className)}
      fill="none"
      initial="hidden"
      viewBox="0 0 200 110"
      whileInView="visible"
      viewport={viewport}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Arrow pointing to the highlight</title>
      <motion.path
        d="M6 10C22 52 52 82 96 94c34 9 66 4 96-14"
        transition={{ duration: duration.hero, ease: ease.out }}
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1 },
        }}
        {...stroke}
      />
      <motion.path
        d="M176 88c8-4 14-6 18-8-4-3-8-8-12-15"
        transition={{ duration: 0.35, ease: ease.out, delay: 0.85 }}
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1 },
        }}
        {...stroke}
      />
    </motion.svg>
  );
}
