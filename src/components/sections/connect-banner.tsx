"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SplitText } from "@/components/motion/split-text";
import { ArrowUpRight } from "@/components/ui/arrow";
import { CopyEmail } from "@/components/ui/copy-email";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { duration, ease, viewport } from "@/lib/motion";
import type { NavLink } from "@/lib/site";

/**
 * Closing dark band — PRD §4.6 and §4.9, merged.
 *
 * The reference design sells project work here ("Exclusive Winter Deal
 * Days"), and an earlier pass carried that framing over. It was wrong
 * for this site: a graduate looking for a role is not an agency taking
 * briefs, and copy that pitches like one reads as borrowed. The band now
 * does the thing that is actually true — states availability and hands
 * over every way to make contact.
 *
 * §4.6 and §4.9 collapse into this single moment on purpose. Two contact
 * sections plus a footer that already lists the same email and links
 * would be three closings in a row.
 *
 * Deviation: the reference sits this on a dark workspace photograph.
 * There is no such photograph here, and a stock one would be the only
 * image on the page not showing real work. A solid panel does the same
 * structural job without pretending.
 */
export function ConnectBanner({
  availability,
  title,
  intro,
  emailLabel,
  elsewhereLabel,
  email,
  copiedLabel,
  announceLabel,
  socials,
}: {
  availability: string;
  title: string;
  intro: string;
  emailLabel: string;
  elsewhereLabel: string;
  email: string;
  copiedLabel: string;
  announceLabel: string;
  socials: NavLink[];
}) {
  const ref = useRef<HTMLElement>(null);
  const shouldReduce = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  // Contracts as the band settles into place rather than simply arriving.
  const radius = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduce ? [20, 20] : [44, 20],
  );

  return (
    <section className="shell py-section" id="contact" ref={ref}>
      <motion.div
        className="overflow-hidden bg-contrast px-6 py-20 text-on-contrast sm:px-12 md:py-24"
        style={{ borderRadius: radius }}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.p
            className="inline-flex items-center gap-2.5 text-meta text-on-contrast/55"
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: duration.base, ease: ease.out }}
            viewport={viewport}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-on-contrast/60"
            />
            {availability}
          </motion.p>

          <SplitText
            as="h2"
            by="word"
            className="mt-6 block font-display font-light text-h1"
            stagger={0.05}
          >
            {title}
          </SplitText>

          <motion.p
            className="mt-6 max-w-[46ch] text-on-contrast/60"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: duration.base, ease: ease.out, delay: 0.2 }}
            viewport={viewport}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {intro}
          </motion.p>

          <motion.div
            className="mt-12 w-full border-on-contrast/15 border-t pt-10"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: duration.base, ease: ease.out, delay: 0.3 }}
            viewport={viewport}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <span className="text-meta text-on-contrast/45 uppercase tracking-[0.08em]">
              {emailLabel}
            </span>
            <div className="mt-3 flex justify-center">
              <CopyEmail
                announceLabel={announceLabel}
                copiedLabel={copiedLabel}
                email={email}
              />
            </div>
          </motion.div>

          <motion.div
            className="mt-10 w-full border-on-contrast/15 border-t pt-10"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: duration.base, ease: ease.out, delay: 0.4 }}
            viewport={viewport}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <span className="text-meta text-on-contrast/45 uppercase tracking-[0.08em]">
              {elsewhereLabel}
            </span>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-3">
              {socials.map((link) => (
                <li key={link.label}>
                  <a
                    className="group inline-flex items-center gap-1.5 font-display font-light text-h3 text-on-contrast/75 transition-colors duration-300 hover:text-on-contrast"
                    href={link.href}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {link.label}
                    <ArrowUpRight className="size-[0.7em] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
