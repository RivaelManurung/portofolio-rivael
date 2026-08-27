import Image from "next/image";
import { CircularBadge } from "@/components/motion/circular-badge";
import { DrawnArrow } from "@/components/motion/drawn-arrow";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { ArrowCircle } from "@/components/ui/arrow-circle";
import { Pill } from "@/components/ui/pill";
import { education } from "@/lib/experience";
import { coreStack, site } from "@/lib/site";

const points = [
  "I work across the whole stack — Laravel and Go on the back end, React and Flutter on the front — rather than handing off at the API boundary.",
  "Most of what I've shipped runs for someone: campus operations, a government office, a warehouse floor. That constraint shapes how I build.",
];

/**
 * About — PRD §4.3.
 *
 * Three asymmetric columns. The middle one is a raised white card on the
 * off-white canvas; that contrast is what creates elevation, since the
 * design system has no shadows to lean on (PRD §3.3).
 *
 * The outer columns arrive first and the card follows 150ms behind. That
 * lag is the whole depth cue — everything landing together would read as
 * flat, however carefully the card is styled.
 *
 * Deviation from the PRD: the reference card is a "120% client
 * engagement" statistic, which is template copy with no real equivalent
 * here. The card keeps its shape but carries the education record
 * instead — the strongest true proof point available.
 */
export function About() {
  return (
    <section className="shell py-section" id="about">
      <div className="grid gap-x-10 gap-y-14 lg:grid-cols-12">
        {/* Left — introduction */}
        <div className="lg:col-span-4">
          <Reveal>
            <h2 className="font-display text-h2 font-light">About Me</h2>
          </Reveal>

          <Reveal index={1}>
            <p className="mt-6 max-w-[46ch] text-ink-muted">{site.bio}</p>
          </Reveal>

          {/* Points at the card. Hidden on stacked layouts, where it
              would aim at empty space. */}
          <DrawnArrow className="mt-12 hidden max-w-[220px] text-ink-faint lg:block" />
        </div>

        {/* Middle — the raised education card */}
        <Reveal className="lg:col-span-4" index={2}>
          <div className="rounded-md bg-surface p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <CircularBadge
                className="size-24 text-ink-faint"
                text={education.school}
              />
              {/* Grayscale keeps §3.1 intact: the only colour on the
                  page belongs to the work thumbnails, and a blue crest
                  here would be the single thing breaking that. */}
              <Image
                alt={education.school}
                className="size-12 object-contain grayscale"
                height={education.logoHeight}
                src={education.logo}
                width={education.logoWidth}
              />
            </div>

            <p className="mt-6 font-display text-h1 font-light leading-none">
              2025
            </p>

            <p className="mt-3 max-w-[34ch] text-meta text-ink-muted">
              {education.degree}, {education.school} · {education.period}
            </p>

            <ParallaxImage className="mt-8 aspect-4/5 rounded-sm bg-canvas-alt">
              <Image
                alt={site.name}
                className="size-full object-cover object-top grayscale"
                height={407}
                sizes="(max-width: 1024px) 90vw, 30vw"
                src="/images/rivael.png"
                width={303}
              />
            </ParallaxImage>
          </div>
        </Reveal>

        {/* Right — the two claims, then the core stack */}
        <div className="lg:col-span-4">
          <ul className="space-y-8">
            {points.map((point, index) => (
              <Reveal as="li" index={index + 1} key={point}>
                <div className="flex gap-4">
                  <ArrowCircle className="mt-0.5" size="sm" />
                  <p className="max-w-[42ch] text-ink-muted">{point}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal index={3}>
            <div className="mt-12 border-line border-t pt-6">
              <span className="text-label">Most days</span>
              <ul className="mt-4 flex flex-wrap gap-2">
                {coreStack.map((skill) => (
                  <li key={skill}>
                    <Pill>{skill}</Pill>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
