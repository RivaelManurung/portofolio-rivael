import data from "@/data/portfolio.json";
import { type Locale, type Localized, localeHref, pick } from "./i18n";
import { allSkills } from "./skills";
import { workSlugs } from "./work";

/**
 * Typed view over `src/data/portfolio.json`.
 *
 * This file holds no content of its own — edit the JSON. Fields that
 * read the same in either language (name, email, URLs) are plain
 * strings; anything a reader parses as prose is `Localized`.
 */

/** Locale-independent facts. */
export const site = {
  name: data.site.name,
  shortName: data.site.shortName,
  email: data.site.email,
  url: data.site.url,
  year: data.site.year,
  ctaHref: data.site.ctaHref,
} as const;

export function getSite(locale: Locale) {
  return {
    ...site,
    role: pick(data.site.role as Localized, locale),
    tagline: pick(data.site.tagline as Localized, locale),
    description: pick(data.site.description as Localized, locale),
    bio: pick(data.site.bio as Localized, locale),
    contactCopy: pick(data.site.contactCopy as Localized, locale),
    availability: pick(data.site.availability as Localized, locale),
    ctaLabel: pick(data.site.ctaLabel as Localized, locale),
    ctaHref: localeHref(data.site.ctaHref, locale),
  };
}

export type NavLink = { label: string; href: string };

/**
 * Navigation reflects what actually exists. The reference design's
 * "Services" and "Blog" were dropped: there is no service catalogue and
 * no written archive behind them, and a nav item that opens an empty
 * room costs more trust than the extra entry buys.
 *
 * Hrefs are locale-relative — `/#about` becomes `/en/#about`.
 */
export function getNav(locale: Locale): NavLink[] {
  return data.nav.map((link) => ({
    label: pick(link.label as Localized, locale),
    href: localeHref(link.href, locale),
  }));
}

export const socialLinks: NavLink[] = data.socials;

export const coreStack: string[] = data.coreStack;

/**
 * Hero credibility stats (PRD §4.2).
 *
 * The reference design shows "+200 projects / +50 startups raised" —
 * template numbers. These are derived from the actual arrays, so adding
 * a project or a technology moves the counter and neither figure can
 * drift away from the truth.
 */
export function getHeroStats(locale: Locale) {
  const ui = data.ui[locale] ?? data.ui.en;
  return [
    {
      value: workSlugs.length,
      prefix: "",
      suffix: "",
      label: ui.hero.projects,
    },
    {
      value: allSkills.length,
      prefix: "",
      suffix: "",
      label: ui.hero.technologies,
    },
  ] as const;
}
