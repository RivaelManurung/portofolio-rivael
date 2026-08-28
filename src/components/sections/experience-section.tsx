import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { SectionLabel } from "@/components/ui/section-label";
import { getEducation, getExperience } from "@/lib/experience";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Certificates } from "./certificates";
import { ExperienceTimeline } from "./experience";

/**
 * Experience section — PRD §4.5.
 *
 * Carries the timeline, the education record and the certificates, since
 * the single-page layout means this is the only place any of them
 * appear.
 */
export function ExperienceSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const education = getEducation(locale);

  return (
    <section className="shell py-section" id="experience">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <SectionLabel>{dict.experience.label}</SectionLabel>
          </Reveal>

          <SplitText
            as="h2"
            by="word"
            className="mt-6 block max-w-[14ch] font-display font-light text-h1"
            stagger={0.05}
          >
            {dict.experience.title}
          </SplitText>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
          <Reveal index={1}>
            <p className="max-w-[46ch] text-ink-muted">
              {dict.experience.intro}
            </p>
          </Reveal>

          {/* Education sits with experience rather than in About: it's the
              same question — where did this come from — and splitting it
              across two sections makes the reader hold both. */}
          <Reveal className="mt-8" index={2}>
            <div className="flex items-start gap-4 border-line border-t pt-6">
              <div className="grid size-14 shrink-0 place-items-center rounded-md bg-surface p-2">
                <Image
                  alt={education.school}
                  className="size-full object-contain grayscale"
                  height={education.logoHeight}
                  src={education.logo}
                  width={education.logoWidth}
                />
              </div>
              <div>
                <p className="text-[0.9375rem]">{education.school}</p>
                <p className="mt-0.5 text-ink-muted text-meta">
                  {education.degree}
                </p>
                <p className="mt-0.5 text-ink-faint text-meta">
                  {education.period}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <ExperienceTimeline items={getExperience(locale)} />
      <Certificates label={dict.experience.certifications} />
    </section>
  );
}
