import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { LinkUnderline } from "@/components/ui/link-underline";
import { site } from "@/lib/site";

/**
 * Closing CTA — PRD §4.9.
 *
 * Word-level split rather than per-character: at nine words a
 * character stagger would run past two seconds and the reader would
 * finish the sentence long before the animation did.
 */
export function FinalCta() {
  return (
    <section className="shell flex flex-col items-center py-section text-center">
      <SplitText
        as="h2"
        by="word"
        className="max-w-[18ch] font-display text-h1 font-light"
        stagger={0.05}
      >
        Got a project? Let's bring it to life.
      </SplitText>

      <Reveal index={2}>
        <p className="mt-8 max-w-[48ch] text-ink-muted">
          I'm always up for new problems and collaborations — whether you're
          starting from scratch or picking up something half-built.
        </p>
      </Reveal>

      <Reveal className="mt-10" index={3}>
        <LinkUnderline href={site.bookingUrl}>Get in touch</LinkUnderline>
      </Reveal>
    </section>
  );
}
