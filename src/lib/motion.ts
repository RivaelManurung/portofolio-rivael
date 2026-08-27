import type { Transition, Variants } from "motion/react";

/**
 * Central motion tokens — PRD §5.1.
 *
 * Rule: no component hardcodes an easing curve or a duration. If a
 * value isn't here, it doesn't belong in the page. This is what keeps
 * twenty separate animations reading as one system.
 */

export const ease = {
  /** Default. Reveals, viewport entrances. Fast start, long settle. */
  out: [0.16, 1, 0.3, 1] as const,
  /** State transitions, expand/collapse. Symmetric. */
  inOut: [0.83, 0, 0.17, 1] as const,
} satisfies Record<string, readonly [number, number, number, number]>;

export const spring = {
  /** General purpose — nav pill, layout shifts. */
  base: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 },
  /** Cursor ring & magnetic buttons: light, quick to catch up. */
  magnetic: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 },
} satisfies Record<string, Transition>;

/**
 * Duration scales with element size (PRD §5.3, rule 3).
 * Nothing exceeds `hero` except decorative loops.
 */
export const duration = {
  fast: 0.3,
  base: 0.6,
  slow: 1.0,
  hero: 1.2,
} as const;

/**
 * Shared viewport config. `once: true` means reveals never replay when
 * the user scrolls back up — replaying reads as a glitch, not delight.
 *
 * The margin shrinks the BOTTOM edge only, so an element reveals once
 * it has travelled a little way into view rather than the instant its
 * first pixel appears.
 *
 * Shrinking the top edge as well (a symmetric "-15% 0px") is the
 * tempting shorthand and it is wrong: it carves a dead band across the
 * top of the viewport where `whileInView` never fires at all. Page
 * headers sit exactly there, so on tall screens they simply never
 * appeared — and the taller the display, the worse it got.
 */
export const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;

/* ------------------------------------------------------------------ *
 * Variants (PRD §5.2)
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 * Variants carry STATE ONLY — never a transition.
 *
 * This is a hard rule, learned the hard way. Reduced motion used to be
 * handled by swapping the whole variants object once the media query
 * resolved. But `initial` has already painted by then: any property in
 * the outgoing variant that the incoming one doesn't mention keeps its
 * initial inline value forever. Reveals froze at `y: 40` and masked
 * images stayed clipped at 100% — permanently invisible, and only for
 * users who asked for less motion. Exactly the wrong people to break it
 * for.
 *
 * So the variants below are constant for every user, and reduced motion
 * is expressed purely as timing via `revealTransition()`. Nothing is
 * ever swapped out from under a painted element.
 * ------------------------------------------------------------------ */

/** Workhorse entrance. */
export const revealUp: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

/** Wipe-up for images and cards. Feels heavier than a fade. */
export const maskReveal: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 },
  visible: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 },
};

/** Per-character / per-word slide out of an overflow-hidden mask. */
export const maskChar: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%" },
};

/**
 * Timing for the variants above — PRD §5.1, §5.6.
 *
 * Reduced motion is applied per property rather than by choosing a
 * different animation: opacity still fades, while movement and the clip
 * wipe are given zero duration so they resolve instantly. Every property
 * the variant declares still gets animated to its `visible` value, which
 * is what stops anything freezing at its initial state.
 */
export function revealTransition({
  reduced,
  index = 0,
  slow = false,
}: {
  reduced: boolean;
  index?: number;
  slow?: boolean;
}): Transition {
  if (reduced) {
    return {
      opacity: { duration: 0.2, ease: "linear" },
      y: { duration: 0 },
      clipPath: { duration: 0 },
    };
  }

  return {
    duration: slow ? duration.slow : duration.base,
    ease: ease.out,
    delay: index * (slow ? 0.12 : 0.08),
  };
}
