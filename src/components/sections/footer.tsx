import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { footerLinks, site } from "@/lib/site";

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
 *
 * Deliberately a utility strip, not a second contact section. The
 * closing band immediately above it already carries the email and every
 * social link; repeating them here put the same four links on screen
 * twice in a row. Everything off the homepage still reaches contact
 * through the nav.
 */
export function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-0 flex h-curtain flex-col justify-end bg-ink px-[var(--spacing-gutter)] pb-8 text-canvas">
      <div className="mx-auto w-full max-w-shell">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="font-display font-light text-canvas/60 text-h3 transition-colors duration-300 hover:text-canvas"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 flex flex-col gap-3 border-canvas/15 border-t pt-6 text-canvas/45 text-meta sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <Logo className="size-4" />© {new Date().getFullYear()} {site.name}
          </span>
          <span>Built with Next.js</span>
        </div>
      </div>
    </footer>
  );
}
