"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "@/components/ui/arrow";
import { ArrowCircle } from "@/components/ui/arrow-circle";
import { Pill } from "@/components/ui/pill";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { type Experience, experience } from "@/lib/experience";
import { ease, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Experience timeline — PRD §4.5.
 *
 * Accordion rather than a static list: four roles with three bullets
 * each would be a wall of text, and none of it is what someone scanning
 * the page needs first. Collapsed, the row answers "where and when";
 * expanded, it answers "doing what".
 *
 * Only one row opens at a time — two open panels turn the rhythm of the
 * dividers into noise, which is the one thing holding this section
 * together visually.
 */
export function ExperienceTimeline({
  items = experience,
  className,
}: {
  items?: Experience[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduce = usePrefersReducedMotion();

  return (
    <ul className={cn("mt-14", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `experience-panel-${index}`;

        return (
          <motion.li
            className="border-line border-t"
            initial={shouldReduce ? undefined : { opacity: 0 }}
            key={`${item.company}-${item.position}`}
            transition={{ duration: 0.5, ease: ease.out, delay: index * 0.08 }}
            viewport={viewport}
            whileInView={{ opacity: 1 }}
          >
            <button
              aria-controls={panelId}
              aria-expanded={isOpen}
              className="group grid w-full grid-cols-1 items-start gap-3 py-7 text-left transition-colors duration-500 hover:bg-canvas-alt md:grid-cols-12 md:items-center md:gap-6 md:px-4"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              type="button"
            >
              <span className="md:col-span-4">
                <span className="block font-display text-h3 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3">
                  {item.company}
                </span>
                <span className="mt-1 block text-meta text-ink-faint">
                  ↳ {item.period}
                </span>
              </span>

              <span className="text-ink-muted md:col-span-4">
                {item.position}
              </span>

              <span className="flex flex-wrap items-center gap-2 md:col-span-4 md:justify-end">
                {item.tags.map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
                <ArrowUpRight
                  className={cn(
                    "ml-1 size-4 shrink-0 text-ink transition-all duration-500 ease-[var(--ease-out-expo)]",
                    "-translate-x-2.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                    isOpen && "translate-x-0 rotate-135 opacity-100",
                  )}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  animate={{ height: "auto", opacity: 1 }}
                  className="overflow-hidden"
                  exit={{ height: 0, opacity: 0 }}
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: shouldReduce ? 0 : 0.45,
                    ease: ease.inOut,
                  }}
                >
                  <div className="flex flex-col gap-6 pb-9 md:flex-row md:items-start md:gap-10 md:px-4">
                    <div className="grid size-16 shrink-0 place-items-center rounded-md bg-surface p-2.5">
                      <Image
                        alt={item.company}
                        className="size-full object-contain grayscale"
                        height={item.logoHeight}
                        src={item.logo}
                        width={item.logoWidth}
                      />
                    </div>

                    <ul className="max-w-[56ch] space-y-2.5">
                      {item.points.map((point) => (
                        <li
                          className="flex gap-3 text-ink-muted text-meta"
                          key={point}
                        >
                          <span
                            aria-hidden
                            className="mt-2 size-1 shrink-0 rounded-full bg-ink-faint"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <ArrowCircle
                      className="hidden md:ml-auto md:grid"
                      size="lg"
                      variant="outline"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ul>
  );
}
