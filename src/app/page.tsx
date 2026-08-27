import { Reveal } from "@/components/motion/reveal";
import { About } from "@/components/sections/about";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ExperienceSection } from "@/components/sections/experience-section";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { SkillsSection } from "@/components/sections/skills-section";
import { WorkMarquee } from "@/components/sections/work-marquee";
import { LinkUnderline } from "@/components/ui/link-underline";

/**
 * Homepage — PRD §4.
 *
 * One deviation from the reference: it carries both a scrolling work
 * strip (§4.4) and a "Latest Works" grid (§4.7). With nine real projects
 * that means showing the same set twice on one page, which reads as
 * padding. The marquee stays, the grid gives way to `/work`, and the
 * blog strip (§4.8) gives way to the stack — there is no written
 * archive to put there.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />

      <WorkMarquee />

      <Reveal className="shell mt-6 flex justify-center" index={0}>
        <span className="inline-flex items-center gap-3 text-ink-muted">
          Check out more
          <LinkUnderline arrow={false} className="text-ink" href="/work">
            View all projects
          </LinkUnderline>
        </span>
      </Reveal>

      <ExperienceSection />
      <CtaBanner />
      <SkillsSection />
      <FinalCta />
    </>
  );
}
