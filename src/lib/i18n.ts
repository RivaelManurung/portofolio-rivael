import data from "@/data/portfolio.json";

/**
 * Locale plumbing — PRD §12.15.
 *
 * Content lives in one file (`src/data/portfolio.json`) with translated
 * strings colocated on the record they belong to, rather than in
 * parallel dictionary files. Structural fields — slugs, image paths,
 * repository URLs, dates, stacks — are deliberately *not* localized:
 * they're the same fact in either language, and duplicating them is how
 * two copies drift apart.
 */

export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** A string that exists once per locale. */
export type Localized<T = string> = Record<Locale, T>;

/**
 * Falls back to the default locale rather than rendering `undefined`,
 * so a missing translation degrades to English instead of a blank.
 */
export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value[defaultLocale];
}

export type Dictionary = (typeof data)["ui"]["en"];

export function getDictionary(locale: Locale): Dictionary {
  return (data.ui[locale] ?? data.ui[defaultLocale]) as Dictionary;
}

/** Shown in the switcher; the code doubles as the visible label. */
export const localeLabels: Record<Locale, string> = { en: "EN", id: "ID" };

/**
 * Prefixes an app-relative href with the active locale.
 * `"/#about"` → `"/en#about"`, `"/work"` → `"/en/work"`.
 */
export function localeHref(href: string, locale: Locale): string {
  if (href.startsWith("/#")) return `/${locale}${href.slice(1)}`;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

/** `/en/work` → `/id/work`. Used by the language switcher. */
export function swapLocaleInPath(pathname: string, next: Locale): string {
  const segments = pathname.split("/");
  // segments[0] is the empty string before the leading slash.
  if (segments.length > 1 && isLocale(segments[1])) {
    segments[1] = next;
    return segments.join("/");
  }
  return `/${next}${pathname}`;
}
