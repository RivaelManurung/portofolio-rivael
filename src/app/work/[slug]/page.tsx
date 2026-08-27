import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { ArrowCircle } from "@/components/ui/arrow-circle";
import { LinkUnderline } from "@/components/ui/link-underline";
import { Pill } from "@/components/ui/pill";
import { SectionLabel } from "@/components/ui/section-label";
import { getNextWork, getWork, work } from "@/lib/work";

export function generateStaticParams() {
  return work.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getWork(slug);
  if (!item) return {};

  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      images: [{ url: item.image }],
    },
  };
}

/**
 * Case study — PRD §6.
 *
 * Renders only what's actually recorded about each project: summary,
 * stack, client, screenshot, repository. The problem/process/solution
 * narrative the PRD calls for needs to be *written* per project — it
 * isn't derivable from the data, and inventing it would put fiction on
 * a page about real work. Phase 5 moves this content to MDX (PRD §2.3),
 * at which point the narrative slots below become real prose.
 */
export default async function WorkDetailPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const item = getWork(slug);

  if (!item) notFound();

  const next = getNextWork(slug);

  return (
    <article>
      {/* Header */}
      <header className="shell pt-40 pb-14">
        <Reveal>
          <SectionLabel>Case study</SectionLabel>
        </Reveal>

        <SplitText
          as="h1"
          by="word"
          className="mt-6 max-w-[18ch] font-display text-h1 font-light"
          stagger={0.05}
          trigger="mount"
        >
          {item.title}
        </SplitText>

        <Reveal className="mt-6 flex items-center gap-5" index={2}>
          <span className="text-label">For {item.client}</span>
          <span aria-hidden className="h-px w-8 bg-line" />
          <LinkUnderline arrow={false} href="/work">
            All projects
          </LinkUnderline>
        </Reveal>
      </header>

      {/* Cover */}
      <Reveal className="shell" index={1} variant="mask">
        <div className="relative aspect-16/10 overflow-hidden rounded-lg bg-canvas-alt">
          <Image
            alt={item.title}
            className="size-full object-cover"
            height={item.height}
            priority
            sizes="(max-width: 1440px) 100vw, 1440px"
            src={item.image}
            width={item.width}
          />
        </div>
      </Reveal>

      {/* Meta + narrative */}
      <div className="shell grid gap-x-10 gap-y-12 py-section lg:grid-cols-12">
        {/* Facts — a definition list, because that's what this is. */}
        <Reveal className="lg:col-span-4" index={0}>
          <dl className="space-y-8 border-line border-t pt-8">
            <div>
              <dt className="text-label">Built for</dt>
              <dd className="mt-2">{item.client}</dd>
            </div>

            <div>
              <dt className="text-label">Stack</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {item.stack.map((tech) => (
                  <Pill key={tech}>{tech}</Pill>
                ))}
              </dd>
            </div>

            <div>
              <dt className="text-label">Source</dt>
              <dd className="mt-2">
                <LinkUnderline href={item.repo}>View on GitHub</LinkUnderline>
              </dd>
            </div>
          </dl>
        </Reveal>

        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal index={1}>
            <h2 className="font-display text-h3">About this project</h2>
          </Reveal>

          <Reveal index={2}>
            <p className="mt-4 max-w-[58ch] text-ink-muted">{item.summary}</p>
          </Reveal>

          <Reveal index={3}>
            {/*
              Deliberately empty of invented narrative. Each project needs
              its own write-up; until then this states plainly that the
              detail is missing rather than filling it with plausible
              fiction about work that really happened.
            */}
            <div className="mt-10 rounded-md border border-line border-dashed p-6">
              <p className="text-label">Write-up in progress</p>
              <p className="mt-3 max-w-[52ch] text-meta text-ink-muted">
                The full breakdown — the problem, the decisions, and what
                shipped — is being written. The repository above has the code in
                the meantime.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Next project */}
      <Reveal className="shell pb-section" index={0}>
        <Link
          className="group flex items-center justify-between gap-6 border-line border-t py-10"
          href={`/work/${next.slug}`}
        >
          <div>
            <span className="text-label">Next project</span>
            <p className="mt-3 font-display text-h2 font-light transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3">
              {next.title}
            </p>
          </div>
          <ArrowCircle
            className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110"
            size="lg"
          />
        </Link>
      </Reveal>
    </article>
  );
}
