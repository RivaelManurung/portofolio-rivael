import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import { workSlugs } from "@/lib/work";

/**
 * Every route in both locales, cross-referenced with `alternates` so
 * search engines treat the two languages as translations of one page
 * rather than as duplicates competing with each other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/work", ...workSlugs.map((slug) => `/work/${slug}`)];

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${site.url}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((other) => [other, `${site.url}/${other}${path}`]),
        ),
      },
    })),
  );
}
