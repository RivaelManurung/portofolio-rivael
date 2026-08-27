import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { ExperienceTimeline } from "@/components/sections/experience";
import { ArrowUpRight } from "@/components/ui/arrow";
import { SectionLabel } from "@/components/ui/section-label";
import { certificates, education, experience } from "@/lib/experience";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Placements across government, bootcamps and industry programmes, plus certificates from Dicoding, HackerRank, SanberCode, Rakamin and Coding Studio.",
};

export default function ExperiencePage() {
  return (
    <>
      <header className="shell pt-40 pb-10">
        <Reveal>
          <SectionLabel>Experience</SectionLabel>
        </Reveal>

        <SplitText
          as="h1"
          by="word"
          className="mt-6 block max-w-[16ch] font-display text-h1 font-light"
          stagger={0.05}
          trigger="mount"
        >
          Where the practice came from
        </SplitText>

        <Reveal index={2}>
          <p className="mt-8 max-w-[58ch] text-ink-muted">
            {experience.length} placements alongside the {education.degree} at{" "}
            {education.school}. Each row opens for what it actually involved.
          </p>
        </Reveal>
      </header>

      <div className="shell pb-section">
        <ExperienceTimeline className="mt-4" />
      </div>

      {/* Certificates */}
      <section className="shell pb-section">
        <Reveal>
          <SectionLabel>Certificates</SectionLabel>
        </Reveal>

        <Reveal index={1}>
          <h2 className="mt-6 max-w-[18ch] font-display text-h2 font-light">
            {certificates.length} certifications
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {certificates.map((certificate, index) => (
            <Reveal as="li" index={index % 2} key={certificate.link}>
              <a
                className="group flex items-center gap-5 border-line border-t py-5 transition-colors duration-500 hover:bg-canvas-alt"
                href={certificate.link}
                rel="noreferrer noopener"
                target="_blank"
              >
                <div className="grid size-12 shrink-0 place-items-center rounded-sm bg-surface p-2">
                  <Image
                    alt={certificate.issuer}
                    className="size-full object-contain grayscale"
                    height={certificate.logoHeight}
                    src={certificate.logo}
                    width={certificate.logoWidth}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.9375rem] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">
                    {certificate.title}
                  </p>
                  <p className="mt-0.5 text-meta text-ink-faint">
                    {certificate.issuer}
                  </p>
                </div>

                <ArrowUpRight className="size-4 shrink-0 -translate-x-2 text-ink opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-hover:opacity-100" />
              </a>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
