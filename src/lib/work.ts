import data from "@/data/portfolio.json";
import { type Locale, type Localized, pick } from "./i18n";

/**
 * Typed view over the `work` array in `src/data/portfolio.json`.
 *
 * Only projects with a real screenshot are listed there; entries that
 * were commented out in the v1 source (Uangku, DelApp, Blog, Library)
 * stay out rather than being shown without evidence.
 *
 * Titles, stacks, repo URLs and screenshots are the same in either
 * language; only `client` and `summary` are translated.
 */

export type WorkItem = {
  slug: string;
  title: string;
  /** Who or what it was built for — renders as "For …" on the card. */
  client: string;
  summary: string;
  stack: string[];
  repo: string;
  image: string;
  width: number;
  height: number;
};

/** Locale-independent, so `generateStaticParams` needs no locale. */
export const workSlugs: string[] = data.work.map((item) => item.slug);

export function getWork(locale: Locale): WorkItem[] {
  return data.work.map((item) => ({
    slug: item.slug,
    title: item.title,
    client: pick(item.client as Localized, locale),
    summary: pick(item.summary as Localized, locale),
    stack: item.stack,
    repo: item.repo,
    image: item.image,
    width: item.width,
    height: item.height,
  }));
}

export function findWork(slug: string, locale: Locale): WorkItem | undefined {
  return getWork(locale).find((item) => item.slug === slug);
}

/**
 * The following project, wrapping around at the end so a case study
 * never dead-ends.
 */
export function getNextWork(slug: string, locale: Locale): WorkItem {
  const all = getWork(locale);
  const index = all.findIndex((item) => item.slug === slug);
  return all[(index + 1) % all.length];
}
