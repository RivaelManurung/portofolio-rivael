import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { LinkUnderline } from "@/components/ui/link-underline";
import { SectionLabel } from "@/components/ui/section-label";
import type { Dictionary, Locale } from "@/lib/i18n";
import { getWork } from "@/lib/work";
import { WorkMarquee } from "./work-marquee";

/**
 * Work section — PRD §4.4, framed.
 *
 * The strip itself is full-bleed and lives outside the shell; this
 * wrapper gives it a heading, an anchor target for the nav, and the way
 * out to the full list. The marquee is for a glance — `/work` is where
 * each project gets its summary and stack.
 */
export function WorkSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="py-section" id="work">
      <div className="shell">
        <Reveal>
          <SectionLabel>{dict.work.label}</SectionLabel>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <SplitText
            as="h2"
            by="word"
            className="block max-w-[14ch] font-display font-light text-h2 lg:col-span-6"
            stagger={0.05}
          >
            {dict.work.title}
          </SplitText>

          <Reveal
            className="lg:col-span-5 lg:col-start-8 lg:self-end"
            index={1}
          >
            <p className="max-w-[46ch] text-ink-muted">{dict.work.intro}</p>
          </Reveal>
        </div>
      </div>

      <WorkMarquee
        forLabel={dict.work.for}
        items={getWork(locale)}
        locale={locale}
      />

      <Reveal className="shell mt-8 flex justify-center" index={0}>
        <span className="inline-flex items-center gap-3 text-ink-muted">
          {dict.work.checkMore}
          <LinkUnderline className="text-ink" href={`/${locale}/work`}>
            {dict.work.viewAll}
          </LinkUnderline>
        </span>
      </Reveal>
    </section>
  );
}
