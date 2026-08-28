"use client";

import { usePathname } from "next/navigation";
import {
  type Locale,
  localeLabels,
  locales,
  swapLocaleInPath,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Language switch — PRD §12.15.
 *
 * A real link to the same page under the other locale, not a client-side
 * state flip. That keeps every language shareable, crawlable and
 * back-button-correct, which is the entire reason the locale lives in
 * the URL.
 *
 * The cookie is a convenience for the *next* visit: `proxy.ts` reads it
 * so someone who chose Indonesian doesn't land on English again when
 * they type the bare domain.
 *
 * Uses a plain `<a>`, not `<Link>`, on purpose. Switching locale crosses
 * the `[lang]` boundary, so React re-renders the root layout — and with
 * it `<html className>`, wiping the `dark` class that the pre-paint
 * script had set imperatively. A full document load lets that script run
 * again and restore the theme. A language change is a whole-document
 * change anyway (`lang` attribute, every string on the page); soft
 * navigation buys nothing here and costs the theme.
 */
export function LanguageSwitcher({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const next: Locale = locale === "en" ? "id" : "en";

  function remember() {
    // A year, path-wide. No consent banner needed: this stores a UI
    // preference the user just expressed, nothing identifying.
    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API lacks Safari/Firefox support
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
  }

  return (
    <nav
      aria-label={label}
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-line p-0.5 text-meta",
        className,
      )}
    >
      {locales.map((value) => {
        const active = value === locale;
        return (
          <a
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-2 py-1 leading-none transition-colors duration-300",
              active ? "bg-ink text-canvas" : "text-ink-muted hover:text-ink",
            )}
            href={active ? pathname : swapLocaleInPath(pathname, value)}
            key={value}
            onClick={active ? undefined : remember}
          >
            {localeLabels[value]}
          </a>
        );
      })}
    </nav>
  );
}
