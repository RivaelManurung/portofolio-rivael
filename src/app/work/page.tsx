import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { ArrowCircle } from "@/components/ui/arrow-circle";
import { LinkUnderline } from "@/components/ui/link-underline";
import { Pill } from "@/components/ui/pill";
import { SectionLabel } from "@/components/ui/section-label";
import { coreStack } from "@/lib/site";
import { work } from "@/lib/work";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected web and mobile projects — Laravel, Go, Flutter, React and Node.js — with the stack and source behind each one.",
};

/**
 * Portfolio index — the one page that stays separate from the
 * single-page homepage.
 *
 * The homepage work section is a scrolling strip: good for a glance,
 * poor for evaluating. This page is where each entry gets its summary
 * and stack, because someone who clicked "view all" has decided to
 * actually read.
 *
 * Rows alternate image side on desktop. That zig-zag is what stops nine
 * near-identical entries reading as a spreadsheet.
 */
export default function WorkPage() {
  return (
    <>
      <header className="shell pt-40 pb-16">
        <Reveal>
          <SectionLabel>Portfolio</SectionLabel>
        </Reveal>

        <SplitText
          as="h1"
          by="word"
          className="mt-6 block max-w-[20ch] font-display text-h1 font-light"
          stagger={0.05}
          trigger="mount"
        >
          Selected work
        </SplitText>

        <Reveal index={2}>
          <p className="mt-8 max-w-[58ch] text-ink-muted">
            Web and mobile projects — campus systems, a government tool,
            e-commerce, warehouse inventory and a handful of APIs. Laravel and
            Go on the back end, Flutter and React on the front. Every one has
            its source public.
          </p>
        </Reveal>

        <Reveal className="mt-10" index={3}>
          <ul className="flex flex-wrap gap-2">
            {coreStack.map((skill) => (
              <li key={skill}>
                <Pill>{skill}</Pill>
              </li>
            ))}
          </ul>
        </Reveal>
      </header>

      <div className="shell space-y-20 pb-section lg:space-y-28">
        {work.map((item, index) => (
          <Reveal key={item.slug}>
            <article className="group">
              <Link
                aria-label={`${item.title} — read the case study`}
                className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
                href={`/work/${item.slug}`}
              >
                <div
                  className={
                    index % 2 === 0
                      ? "lg:col-span-7"
                      : "lg:order-2 lg:col-span-7 lg:col-start-6"
                  }
                >
                  <div className="relative aspect-16/10 overflow-hidden rounded-md bg-canvas-alt">
                    <Image
                      alt={item.title}
                      className="size-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                      height={item.height}
                      priority={index < 2}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      src={item.image}
                      width={item.width}
                    />
                    <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
                  </div>
                </div>

                <div
                  className={
                    index % 2 === 0
                      ? "lg:col-span-4 lg:col-start-9"
                      : "lg:order-1 lg:col-span-4 lg:col-start-1 lg:row-start-1"
                  }
                >
                  <span className="text-label">For {item.client}</span>

                  <h2 className="mt-3 font-display text-h3">{item.title}</h2>

                  <p className="mt-4 text-ink-muted">{item.summary}</p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {item.stack.map((tech) => (
                      <li key={tech}>
                        <Pill>{tech}</Pill>
                      </li>
                    ))}
                  </ul>

                  <span className="mt-8 inline-flex items-center gap-3 text-[0.9375rem]">
                    Read case study
                    <ArrowCircle
                      className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110"
                      size="sm"
                    />
                  </span>
                </div>
              </Link>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="shell pb-section">
        <Reveal>
          <LinkUnderline arrow={false} href="/">
            ← Back to home
          </LinkUnderline>
        </Reveal>
      </div>
    </>
  );
}
