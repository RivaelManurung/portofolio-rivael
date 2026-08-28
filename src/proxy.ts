import { type NextRequest, NextResponse } from "next/server";

/**
 * Locale redirect — PRD §12.15.
 *
 * The locale list is duplicated here rather than imported from
 * `lib/i18n`: that module pulls in the whole content JSON, and the docs
 * warn that proxy is deployed separately (potentially to a CDN edge) and
 * shouldn't lean on shared modules. Two strings are cheaper than
 * shipping the site's content to the redirect handler.
 */
const locales = ["en", "id"] as const;
const defaultLocale = "en";

/**
 * Picks the best supported locale from `Accept-Language`.
 *
 * Deliberately hand-rolled: full BCP-47 negotiation is a dependency
 * (`negotiator` + `intl-localematcher`) that would earn its place with
 * a dozen locales and regional variants. With two, matching the primary
 * subtag by quality order is the whole algorithm.
 */
function preferredLocale(request: NextRequest): string {
  // An explicit choice from the switcher outranks the browser's guess.
  const chosen = request.cookies.get("NEXT_LOCALE")?.value;
  if (chosen && (locales as readonly string[]).includes(chosen)) return chosen;

  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, quality] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: quality ? Number(quality) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    // "id-ID" and "id" both mean Indonesian to us.
    const base = tag.split("-")[0];
    if ((locales as readonly string[]).includes(base)) return base;
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const alreadyLocalised = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (alreadyLocalised) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, metadata routes and anything with a file
  // extension — those must never be rewritten under a locale.
  matcher: [
    "/((?!_next|images|sitemap\\.xml|robots\\.txt|icon|opengraph-image|.*\\.[\\w]+$).*)",
  ],
};
