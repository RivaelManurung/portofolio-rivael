import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { ArrowUpRight } from "@/components/ui/arrow";
import { CopyEmail } from "@/components/ui/copy-email";
import { SectionLabel } from "@/components/ui/section-label";
import { site, socialLinks } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} — ${site.email}`,
};

/**
 * Contact — PRD §6.
 *
 * No form yet: a form that posts nowhere is worse than an address that
 * works. The Server Action + Resend pipeline is phase 7 (PRD §2.4);
 * until then this page does the one thing it can do honestly.
 */
export default function ContactPage() {
  return (
    <section className="shell flex min-h-[70svh] flex-col justify-center py-section">
      <Reveal>
        <SectionLabel>Contact</SectionLabel>
      </Reveal>

      <SplitText
        as="h1"
        by="word"
        className="mt-6 block max-w-[16ch] font-display text-h1 font-light"
        stagger={0.05}
        trigger="mount"
      >
        Let's get in touch
      </SplitText>

      <Reveal index={2}>
        <p className="mt-8 max-w-[58ch] text-ink-muted">{site.contactCopy}</p>
      </Reveal>

      <Reveal className="mt-14" index={3}>
        <div className="border-line border-t pt-8">
          <span className="text-label">Email</span>
          <div className="mt-4 text-ink">
            <CopyEmail email={site.email} />
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-12" index={4}>
        <div className="border-line border-t pt-8">
          <span className="text-label">Elsewhere</span>
          <ul className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  className="group inline-flex items-center gap-2 text-h3 transition-colors duration-300 hover:text-ink"
                  href={link.href}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <span className="font-display font-light">{link.label}</span>
                  <ArrowUpRight className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
