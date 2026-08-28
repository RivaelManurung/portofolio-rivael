"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { useRef, useState } from "react";
import { WorkCard } from "@/components/ui/work-card";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { Locale } from "@/lib/i18n";
import type { WorkItem } from "@/lib/work";

/** Percent of the track per second at rest. Negative drifts leftward. */
const BASE_VELOCITY = -1.6;
/** Pointer travel before a press counts as a drag rather than a click. */
const DRAG_THRESHOLD = 4;

/**
 * Velocity-coupled marquee — PRD §4.4.
 *
 * Three inputs drive one motion value:
 *   1. a constant idle drift,
 *   2. the reader's scroll velocity, which speeds it up *and flips its
 *      direction* when they scroll back up — the signature effect,
 *   3. direct pointer dragging.
 *
 * `wrap(-50, 0, …)` is what makes it infinite: the card list is rendered
 * twice, so translating the track by half its own width lands copy two
 * exactly where copy one started. Nothing resets, nothing jumps.
 */
export function WorkMarquee({
  items,
  locale,
  forLabel,
}: {
  items: WorkItem[];
  locale: Locale;
  forLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduce = usePrefersReducedMotion();

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  // Raw velocity is spiky; the spring is what keeps the coupling from
  // reading as a twitch on every wheel tick.
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });

  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);

  const direction = useRef(1);
  const paused = useRef(false);
  const pressed = useRef(false);
  const dragging = useRef(false);
  const lastPointerX = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  useAnimationFrame((_, delta) => {
    if (shouldReduce || paused.current || dragging.current) return;

    let moveBy = direction.current * BASE_VELOCITY * (delta / 1000);

    // Scrolling up inverts the factor, which flips the travel direction.
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    // Deliberately *not* capturing yet. Capturing on press would retarget
    // the click and swallow navigation on the card underneath; we only
    // take over once the pointer has actually travelled.
    pressed.current = true;
    lastPointerX.current = event.clientX;
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!pressed.current || !trackRef.current) return;

    const deltaX = event.clientX - lastPointerX.current;

    if (!dragging.current) {
      if (Math.abs(deltaX) < DRAG_THRESHOLD) return;
      dragging.current = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    lastPointerX.current = event.clientX;
    // baseX is a percentage of the track's own width, so convert the
    // pixel delta against that same width to keep drag 1:1 with the
    // pointer at any viewport size.
    baseX.set(baseX.get() + (deltaX / trackRef.current.offsetWidth) * 100);
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    pressed.current = false;
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <section
      aria-label="Selected work"
      className="overflow-hidden py-10"
      data-cursor="drag"
    >
      <motion.div
        className={`flex w-max gap-5 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerCancel={endDrag}
        onPointerDown={handlePointerDown}
        onPointerEnter={() => {
          paused.current = true;
        }}
        onPointerLeave={() => {
          paused.current = false;
          pressed.current = false;
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        ref={trackRef}
        style={{ x }}
      >
        {/* Copy two is decorative duplication — hiding it from assistive
            tech means the list is announced once, not twice. */}
        {[0, 1].map((copy) => (
          <div
            aria-hidden={copy === 1 || undefined}
            className="flex gap-5"
            key={copy}
          >
            {items.map((item, index) => (
              <WorkCard
                className="w-[68vw] shrink-0 sm:w-[42vw] lg:w-[26vw] lg:max-w-[420px]"
                forLabel={forLabel}
                item={item}
                key={`${copy}-${item.slug}`}
                locale={locale}
                // Only the cards actually on screen at rest are eager;
                // the duplicate copy never is.
                priority={copy === 0 && index < 3}
              />
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
