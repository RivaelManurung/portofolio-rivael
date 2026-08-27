import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { SkillsSection } from "@/components/sections/skills-section";
import { LinkUnderline } from "@/components/ui/link-underline";
import { SectionLabel } from "@/components/ui/section-label";
import { education } from "@/lib/experience";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

/**
 * About — the long-form version of the homepage introduction (PRD §6).
 *
 * Reuses `SkillsSection` rather than restating the stack: one list, one
 * place to update it, and the homepage and this page can never drift.
 */
export default function AboutPage() {
  return (
    <>
      <header className="shell pt-40 pb-16">
        <Reveal>
          <SectionLabel>About</SectionLabel>
        </Reveal>

        <SplitText
          as="h1"
          by="word"
          className="mt-6 block max-w-[16ch] font-display text-h1 font-light"
          stagger={0.05}
          trigger="mount"
        >
          Back-end first, but rarely only back-end
        </SplitText>
      </header>

      <div className="shell grid gap-x-10 gap-y-14 pb-section lg:grid-cols-12">
        <Reveal className="lg:col-span-5" index={0} variant="mask">
          <div className="aspect-4/5 overflow-hidden rounded-md bg-canvas-alt">
            <Image
              alt={site.name}
              className="size-full object-cover object-top grayscale"
              height={407}
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              src="/images/rivael.png"
              width={303}
            />
          </div>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal index={1}>
            <p className="max-w-[58ch] text-ink-muted">{site.bio}</p>
          </Reveal>

          <Reveal index={2}>
            <div className="mt-12 border-line border-t pt-8">
              <span className="text-label">Education</span>

              <div className="mt-6 flex items-start gap-5">
                <div className="grid size-16 shrink-0 place-items-center rounded-md bg-surface p-2.5">
                  <Image
                    alt={education.school}
                    className="size-full object-contain grayscale"
                    height={education.logoHeight}
                    src={education.logo}
                    width={education.logoWidth}
                  />
                </div>

                <div>
                  <p className="font-display text-h3">{education.school}</p>
                  <p className="mt-1 text-ink-muted">{education.degree}</p>
                  <p className="mt-1 text-meta text-ink-faint">
                    {education.period}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-10" index={3}>
            <LinkUnderline href="/experience">
              See experience & certificates
            </LinkUnderline>
          </Reveal>
        </div>
      </div>

      <SkillsSection />
    </>
  );
}
