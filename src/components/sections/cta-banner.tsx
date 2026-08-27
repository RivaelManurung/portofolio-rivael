"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SplitText } from "@/components/motion/split-text";
import { LinkUnderline } from "@/components/ui/link-underline";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { duration, ease, viewport } from "@/lib/motion";
import { site } from "@/lib/site";

/**
 * Dark CTA band — PRD §4.6.
 *
 * Deviation: the reference sits this on a dark workspace photograph.
 * There is no such photograph here, and a stock one would be the only
 * image on the page not showing real work. A solid ink panel does the
 * same structural job — breaking the light rhythm and anchoring the
 * lower half of the page — without pretending.
 *
 * The corner radius contracts as the band scrolls up, so it reads as
 * settling into place rather than simply arriving.
 */
export function CtaBanner() {
  const ref = useRef<HTMLElement>(null);
  const shouldReduce = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const radius = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduce ? [20, 20] : [44, 20],
  );

  return (
    <section className="shell py-section" ref={ref}>
      <motion.div
        className="relative overflow-hidden bg-ink px-6 py-20 text-center text-canvas sm:px-12 md:py-28"
        style={{ borderRadius: radius }}
      >
        <motion.p
          className="text-canvas/55 text-meta"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: duration.base, ease: ease.out }}
          viewport={viewport}
          whileInView={{ opacity: 1, y: 0 }}
        >
          (Available for new projects)
        </motion.p>

        <SplitText
          as="h2"
          by="word"
          className="mx-auto mt-6 max-w-[18ch] font-display text-h2 font-light"
          stagger={0.045}
        >
          Ready to start your next project?
        </SplitText>

        <motion.p
          className="mx-auto mt-6 max-w-[52ch] text-canvas/60"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: duration.base, ease: ease.out, delay: 0.2 }}
          viewport={viewport}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Send a message and let's talk through what you're building — the
          stack, the constraints, and where I can help.
        </motion.p>

        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: duration.base, ease: ease.out, delay: 0.3 }}
          viewport={viewport}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <LinkUnderline className="text-canvas" href={site.bookingUrl}>
            Let's talk
          </LinkUnderline>
        </motion.div>
      </motion.div>
    </section>
  );
}
