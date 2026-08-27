"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { ease } from "@/lib/motion";

/**
 * Scroll + motion root — PRD §5.4, §5.6.
 *
 * Lenis drives `window.scrollTo`, so native scroll events still fire and
 * Motion's `useScroll` stays in sync off a single RAF loop. That shared
 * loop is the whole ballgame: desyncing it is the #1 cause of the
 * stuttering this design cannot afford.
 *
 * `syncTouch: false` on purpose — mobile keeps native scroll. It's more
 * responsive, cheaper on battery, and matches what thumbs expect.
 *
 * Reduced motion doesn't unmount Lenis; it neuters it (`smoothWheel:
 * false`, `lerp: 1`), which is pass-through native scrolling. Swapping
 * the tree instead would remount every child the moment the preference
 * resolved. `MotionConfig reducedMotion="user"` covers the animations
 * themselves, from the very first frame.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const shouldReduce = usePrefersReducedMotion();

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.6, ease: ease.out }}
    >
      <ReactLenis
        options={{
          lerp: shouldReduce ? 1 : 0.1,
          smoothWheel: !shouldReduce,
          syncTouch: false,
          wheelMultiplier: 1,
        }}
        root
      >
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
