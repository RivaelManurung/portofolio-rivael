import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { LinkUnderline } from "@/components/ui/link-underline";
import { SectionLabel } from "@/components/ui/section-label";
import { ExperienceTimeline } from "./experience";

/**
 * Homepage framing for the experience timeline — PRD §4.5.
 *
 * Split from the timeline itself so `/experience` can render the rows
 * under its own page header without duplicating this copy.
 */
export function ExperienceSection() {
  return (
    <section className="shell py-section" id="experience">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <SectionLabel>Experience</SectionLabel>
          </Reveal>

          <SplitText
            as="h2"
            by="word"
            className="mt-6 block max-w-[14ch] font-display text-h1 font-light"
            stagger={0.05}
          >
            Explore my development journey
          </SplitText>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
          <Reveal index={1}>
            <p className="max-w-[46ch] text-ink-muted">
              Four placements across government, bootcamps and industry
              programmes — each one adding a language, a framework or a way of
              working that shows up in the projects.
            </p>
          </Reveal>

          <Reveal className="mt-6" index={2}>
            <LinkUnderline href="/experience">
              See experience & certificates
            </LinkUnderline>
          </Reveal>
        </div>
      </div>

      <ExperienceTimeline />
    </section>
  );
}
