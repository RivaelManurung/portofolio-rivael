"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { duration, ease, maskChar, viewport } from "@/lib/motion";

type SplitTextProps = {
  children: string;
  /** Characters for short display words, words for sentences. */
  by?: "char" | "word";
  /** Seconds between siblings. PRD §4.2 uses 45ms for the hero. */
  stagger?: number;
  /** Seconds before the first sibling moves. */
  delay?: number;
  /** Play on mount (hero) vs. when scrolled into view (everything else). */
  trigger?: "mount" | "inView";
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

/**
 * Per-character / per-word mask reveal — PRD §4.2, §4.9.
 *
 * Each unit slides up out of an `overflow-hidden` box. The mask is
 * padded at the top and pulled back with a negative margin so tight
 * display line-heights (0.82 on the hero) don't guillotine ascenders,
 * while the *bottom* edge stays flush — that's the edge the reveal
 * slides out of, and any slack there would show the glyph early.
 *
 * Reduced motion collapses the travel to zero duration rather than
 * rendering a different tree. Same markup for everyone, so nothing can
 * be left stranded mid-animation when the preference resolves after the
 * first paint (PRD §12.7).
 *
 * Accessibility: the visible spans are `aria-hidden` and the real text
 * is exposed once via `aria-label`, so screen readers hear a word, not
 * five disconnected letters.
 */
export function SplitText({
  children,
  by = "char",
  stagger = 0.045,
  delay = 0,
  trigger = "inView",
  className,
  as: Tag = "span",
}: SplitTextProps) {
  const shouldReduce = usePrefersReducedMotion();

  // Split into words first so native line-wrapping still works, then
  // optionally into characters. A flat running index keeps the stagger
  // continuous across word boundaries.
  const words = useMemo(() => {
    let cursor = 0;
    return children.split(" ").map((word) => {
      const units = by === "char" ? [...word] : [word];
      return units.map((text) => ({ text, index: cursor++ }));
    });
  }, [children, by]);

  const MotionTag = motion[Tag];
  const animateProps =
    trigger === "mount"
      ? { animate: "visible" as const }
      : { whileInView: "visible" as const, viewport };

  return (
    <MotionTag
      aria-label={children}
      className={className}
      initial="hidden"
      {...animateProps}
    >
      {words.map((word, wordIndex) => (
        <span
          aria-hidden
          className="inline-block whitespace-nowrap"
          // biome-ignore lint/suspicious/noArrayIndexKey: static text, stable order
          key={wordIndex}
        >
          {word.map(({ text, index }) => (
            <span
              className="-mt-[0.2em] inline-block overflow-hidden pt-[0.2em]"
              key={`${text}-${index}`}
            >
              <motion.span
                className="inline-block"
                transition={
                  shouldReduce
                    ? { duration: 0 }
                    : {
                        duration: duration.hero,
                        ease: ease.out,
                        delay: delay + index * stagger,
                      }
                }
                variants={maskChar}
              >
                {text}
              </motion.span>
            </span>
          ))}
          {/* Real space between words, outside the mask. */}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </MotionTag>
  );
}
