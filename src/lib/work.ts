import data from "@/data/portfolio.json";

/**
 * Typed view over the `work` array in `src/data/portfolio.json`.
 *
 * Only projects with a real screenshot are listed there; entries that
 * were commented out in the v1 source (Uangku, DelApp, Blog, Library)
 * stay out rather than being shown without evidence.
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

export const work: WorkItem[] = data.work;

export function getWork(slug: string): WorkItem | undefined {
  return work.find((item) => item.slug === slug);
}

/**
 * The following project, wrapping around at the end so a case study
 * never dead-ends.
 */
export function getNextWork(slug: string): WorkItem {
  const index = work.findIndex((item) => item.slug === slug);
  return work[(index + 1) % work.length];
}
