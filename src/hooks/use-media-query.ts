"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query hook. Always returns `false` on the server and
 * on the first client render, so markup matches and nothing hydrates
 * mismatched — callers must treat `false` as "not yet known" and
 * degrade gracefully rather than flashing.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Desktop-and-up. Gates parallax and the custom cursor (PRD §11). */
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");

/** True only for real pointers — touch devices never get the cursor. */
export const useHasFinePointer = () => useMediaQuery("(pointer: fine)");
