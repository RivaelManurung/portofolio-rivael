"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * SSR-safe reduced-motion check.
 *
 * Motion's own `useReducedMotion()` reads a module-level singleton that
 * is never initialised during SSR, so it can report a different answer
 * on the server than on the client — and any markup branched on it
 * hydrates mismatched. This one is built on `useMediaQuery`, which
 * deliberately returns `false` on the server *and* on the first client
 * render, then flips in an effect. Both passes agree, so hydration is
 * clean.
 *
 * The cost is one frame of motion before the preference is known.
 * Structural decisions (mount the cursor, enable parallax) absorb that
 * fine. For animations, `MotionConfig reducedMotion="user"` in the root
 * handles the first frame properly — this hook is for everything that
 * config can't reach, like whether Lenis should hijack the scroll.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
