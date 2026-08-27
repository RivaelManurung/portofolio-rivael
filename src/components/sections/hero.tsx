"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Counter } from "@/components/motion/counter";
import { SplitText } from "@/components/motion/split-text";
import { ArrowDown } from "@/components/ui/arrow";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { duration, ease } from "@/lib/motion";
import { heroStats, site } from "@/lib/site";
import { HeroPortrait } from "./hero-portrait";

/**
 * Hero — PRD §4.2.
 *
 * Entrance choreography (total ≈1.4s):
 *   0.00s  portrait wipes up out of a clip-path mask
 *   0.15s  "Hello" reveals per character, 45ms apart
 *   0.60s  stat counters run
 *   0.70s  supporting copy fades up
 *   1.00s  scroll cue appears and starts its idle loop
 *
 * The portrait leads here — the one place in the page where an image
 * moves before the type does (PRD §5.3, rule 2). It earns the exception
 * because the composition, not the word, is the first impression.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const shouldReduce = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Headline outruns the portrait on the way out, so the two layers
  // separate as you scroll instead of sliding as one flat picture.
  //
  // Reduced motion collapses each range to zero rather than dropping the
  // `style` prop. Both branches then render `transform: none`, so the
  // server and the client agree and hydration stays clean — dropping the
  // prop instead would swap the markup out from under React.
  const drift = shouldReduce ? 0 : 1;
  const helloY = useTransform(scrollYProgress, [0, 1], [0, 120 * drift]);
  const helloOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    [1, shouldReduce ? 1 : 0.15],
  );
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -60 * drift]);

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-canvas"
      ref={ref}
    >
      {/* Rotated rail, desktop only. Reads bottom-to-top. */}
      <div className="pointer-events-none absolute inset-y-0 left-2 hidden w-8 flex-col items-center justify-between py-32 lg:flex">
        <motion.span
          animate={{ opacity: 1 }}
          className="text-label [writing-mode:vertical-rl] rotate-180"
          initial={{ opacity: 0 }}
          transition={{ duration: duration.base, delay: 0.9 }}
        >
          {site.role}
        </motion.span>
        <motion.span
          animate={{ opacity: 1 }}
          className="text-label [writing-mode:vertical-rl] rotate-180"
          initial={{ opacity: 0 }}
          transition={{ duration: duration.base, delay: 1 }}
        >
          {site.year}
        </motion.span>
      </div>

      {/* Portrait. Sits above the headline so the shoulder crops it. */}
      <motion.div
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        className="pointer-events-none absolute right-0 bottom-0 z-10 h-[44svh] w-[76%] sm:h-[58svh] sm:w-[58%] lg:h-[78svh] lg:w-[44%] lg:max-w-[700px]"
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        transition={{
          // clip-path isn't a transform, so MotionConfig's reduced-motion
          // handling doesn't catch it. Collapse the duration instead.
          duration: shouldReduce ? 0 : 1.1,
          ease: ease.out,
        }}
      >
        <motion.div className="size-full" style={{ y: portraitY }}>
          <HeroPortrait />
        </motion.div>
      </motion.div>

      {/* Content column */}
      <div className="shell relative z-0 grid min-h-[100svh] grid-rows-[auto_1fr_auto] gap-8 pt-32 pb-10 lg:pl-14">
        {/* Stats */}
        <motion.dl
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-10 sm:gap-14"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: duration.base, ease: ease.out, delay: 0.6 }}
        >
          {heroStats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <Counter
                  className="block font-display text-h3 font-normal"
                  delay={0.6}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  value={stat.value}
                />
                <span className="mt-1 block text-meta text-ink-faint">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>

        {/* Headline */}
        <motion.div
          className="flex flex-col justify-center"
          style={{ y: helloY, opacity: helloOpacity }}
        >
          <h1 className="font-display text-display font-extralight text-ink">
            <SplitText
              as="span"
              by="char"
              className="block"
              delay={0.15}
              stagger={0.045}
              trigger="mount"
            >
              Hello
            </SplitText>
          </h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-3 text-body text-ink-muted"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: duration.base, ease: ease.out, delay: 0.7 }}
          >
            <span aria-hidden className="h-px w-8 bg-ink-faint" />
            {site.tagline}
          </motion.p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-label"
          initial={{ opacity: 0 }}
          transition={{ duration: duration.base, delay: 1 }}
        >
          Scroll down
          {/* Idle bob. MotionConfig stops this for reduced-motion users:
              it's a transform, which is exactly what that setting drops. */}
          <motion.span
            animate={{ y: [0, 6, 0] }}
            className="inline-block"
            transition={{
              duration: 1.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <ArrowDown className="size-3.5" />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
