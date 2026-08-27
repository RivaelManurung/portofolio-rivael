import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { LinkUnderline } from "@/components/ui/link-underline";
import { SectionLabel } from "@/components/ui/section-label";
import { WorkMarquee } from "./work-marquee";

/**
 * Work section — PRD §4.4, framed.
 *
 * The strip itself is full-bleed and lives outside the shell; this
 * wrapper gives it a heading, an anchor target for the nav, and the way
 * out to the full list. The marquee is for a glance — `/work` is where
 * each project gets its summary and stack.
 */
export function WorkSection() {
  return (
    <section className="py-section" id="work">
      <div className="shell">
        <Reveal>
          <SectionLabel>Portfolio</SectionLabel>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <SplitText
            as="h2"
            by="word"
            className="block max-w-[14ch] font-display text-h2 font-light lg:col-span-6"
            stagger={0.05}
          >
            Things I've built
          </SplitText>

          <Reveal
            className="lg:col-span-5 lg:col-start-8 lg:self-end"
            index={1}
          >
            <p className="max-w-[46ch] text-ink-muted">
              Web and mobile work, built for campuses, a government office and a
              warehouse floor. Drag the strip, or open any one for the stack and
              the source.
            </p>
          </Reveal>
        </div>
      </div>

      <WorkMarquee />

      <Reveal className="shell mt-8 flex justify-center" index={0}>
        <span className="inline-flex items-center gap-3 text-ink-muted">
          Check out more
          <LinkUnderline className="text-ink" href="/work">
            View all projects
          </LinkUnderline>
        </span>
      </Reveal>
    </section>
  );
}
