"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useEffect, useState } from "react";
import { useHasFinePointer } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { ease, spring } from "@/lib/motion";

/** Set `data-cursor="view"` on any element to change the ring. */
type CursorState = "default" | "link" | "drag" | "view";

const RING_SIZE: Record<CursorState, number> = {
  default: 36,
  link: 60,
  drag: 72,
  view: 76,
};

/**
 * Custom cursor — PRD §5.5.
 *
 * Two layers: an 8px dot pinned to the raw pointer position (no lag, so
 * clicking still feels precise) and a ring that follows on a spring.
 * The lag between them is the entire effect.
 *
 * Never rendered on coarse pointers or under reduced motion — on touch
 * it would be an invisible element chasing taps.
 */
export function Cursor({ viewLabel }: { viewLabel: string }) {
  const hasFinePointer = useHasFinePointer();
  const shouldReduce = usePrefersReducedMotion();
  const enabled = hasFinePointer && !shouldReduce;

  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, spring.magnetic);
  const ringY = useSpring(dotY, spring.magnetic);

  useEffect(() => {
    if (!enabled) return;

    function onMove(event: PointerEvent) {
      dotX.set(event.clientX);
      dotY.set(event.clientY);
      setVisible(true);

      // Walk up from the hovered node to find the nearest declared
      // cursor intent. Falls back to `link` for anything clickable.
      const target = event.target as Element | null;
      const declared = target?.closest?.("[data-cursor]");
      if (declared) {
        setState(
          (declared.getAttribute("data-cursor") as CursorState) ?? "default",
        );
        return;
      }
      setState(target?.closest?.("a, button") ? "link" : "default");
    }

    function onLeave() {
      setVisible(false);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, dotX, dotY]);

  if (!enabled) return null;

  const size = RING_SIZE[state];
  const label =
    state === "drag" ? "↔" : state === "view" ? viewLabel : undefined;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        animate={{ opacity: visible ? 1 : 0 }}
        className="absolute top-0 left-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
        style={{ x: dotX, y: dotY }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor:
            state === "view" || state === "drag"
              ? "rgba(10,10,10,1)"
              : "rgba(10,10,10,0)",
        }}
        className="absolute top-0 left-0 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ink/25"
        style={{ x: ringX, y: ringY }}
        transition={{ duration: 0.28, ease: ease.out }}
      >
        <AnimatePresence mode="wait">
          {label && (
            <motion.span
              animate={{ opacity: 1, scale: 1 }}
              className="font-sans text-[11px] tracking-wide text-canvas"
              exit={{ opacity: 0, scale: 0.8 }}
              initial={{ opacity: 0, scale: 0.8 }}
              key={label}
              transition={{ duration: 0.15 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
