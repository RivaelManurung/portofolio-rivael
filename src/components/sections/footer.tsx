import Link from "next/link";
import { CopyEmail } from "@/components/ui/copy-email";
import { Logo } from "@/components/ui/logo";
import { footerLinks, site, socialLinks } from "@/lib/site";

/**
 * Footer — PRD §4.9.
 *
 * Fixed to the bottom of the viewport and painted *behind* the page
 * (z-0 against the content's z-10). The content column carries a
 * matching bottom margin, so the last section slides up and uncovers
 * this like a curtain instead of pushing it into view.
 *
 * The trade-off: this height must stay in sync with the content's
 * bottom margin. Both read `--spacing-curtain`, so there's one number.
 */
export function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-0 flex h-curtain flex-col justify-between bg-ink px-[var(--spacing-gutter)] pt-14 pb-8 text-canvas">
      <div className="mx-auto flex w-full max-w-shell flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-7 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="text-[0.9375rem] text-canvas/65 transition-colors duration-300 hover:text-canvas"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <CopyEmail email={site.email} />
      </div>

      <div className="mx-auto flex w-full max-w-shell flex-col-reverse gap-6 border-t border-canvas/15 pt-6 text-meta text-canvas/50 md:flex-row md:items-center md:justify-between">
        <span className="inline-flex items-center gap-2">
          <Logo className="size-4" />© {new Date().getFullYear()} {site.name}
        </span>

        <ul className="flex gap-6">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a
                className="transition-colors duration-300 hover:text-canvas"
                href={link.href}
                rel="noreferrer noopener"
                target="_blank"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <span>Built with Next.js</span>
      </div>
    </footer>
  );
}
