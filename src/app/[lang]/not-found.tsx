import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { LinkUnderline } from "@/components/ui/link-underline";
import { SectionLabel } from "@/components/ui/section-label";
import { defaultLocale, getDictionary } from "@/lib/i18n";

/**
 * `not-found.tsx` renders outside the route's params, so there's no
 * locale to read here — it falls back to the default. Localising it
 * would mean a catch-all route purely to know what language a missing
 * page was requested in, which is not worth the routing complexity.
 */
export default function NotFound() {
  const dict = getDictionary(defaultLocale);

  return (
    <section className="shell flex min-h-[70svh] flex-col justify-center py-section">
      <Reveal>
        <SectionLabel>{dict.notFound.label}</SectionLabel>
      </Reveal>

      <SplitText
        as="h1"
        by="word"
        className="mt-6 block max-w-[16ch] font-display font-light text-h1"
        stagger={0.05}
        trigger="mount"
      >
        {dict.notFound.title}
      </SplitText>

      <Reveal index={2}>
        <p className="mt-8 max-w-[52ch] text-ink-muted">{dict.notFound.body}</p>
      </Reveal>

      <Reveal className="mt-10" index={3}>
        <LinkUnderline arrow={false} href={`/${defaultLocale}`}>
          {dict.notFound.back}
        </LinkUnderline>
      </Reveal>
    </section>
  );
}
