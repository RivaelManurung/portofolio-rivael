"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Slowly rotating seal with text set around its circumference — PRD §4.3.
 *
 * One of only two decorative loops on the page (the other is the
 * marquee). 20s per revolution is deliberately below the threshold where
 * motion pulls the eye: it should register as alive, not as animated.
 *
 * The rotation is a transform, so `MotionConfig reducedMotion="user"`
 * stops it for free — no branch needed here.
 */
export function CircularBadge({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  // Path ids are global to the document, so scope them per instance.
  const pathId = useId();
  // Trailing separator so the string tiles cleanly end-to-end.
  const ring = `${text} • `.repeat(3);

  return (
    <motion.div
      animate={{ rotate: 360 }}
      aria-hidden
      className={cn("relative", className)}
      transition={{
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    >
      <svg
        className="size-full"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{text}</title>
        <defs>
          {/* Two arcs form a full circle; text flows along the outside. */}
          <path
            d="M50 12a38 38 0 1 1 0 76 38 38 0 1 1 0-76"
            fill="none"
            id={pathId}
          />
        </defs>
        <text
          fill="currentColor"
          fontSize="8.5"
          letterSpacing="1.2"
          textLength="238"
        >
          <textPath href={`#${pathId}`}>{ring}</textPath>
        </text>
      </svg>
    </motion.div>
  );
}
