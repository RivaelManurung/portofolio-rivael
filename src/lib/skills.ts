import data from "@/data/portfolio.json";
import { type Locale, type Localized, pick } from "./i18n";

/**
 * Typed view over `skillGroups` in `src/data/portfolio.json`.
 *
 * Every entry there is evidenced by the v1/v2 portfolio data — either in
 * the declared skill list or in a shipped project's stack. Nothing is
 * added for padding: `allSkills.length` feeds the hero counter, so an
 * invented entry would quietly turn a real number into a false one.
 *
 * Only the group labels are translated; technology names are not.
 */

export type SkillGroup = { label: string; items: string[] };

export function getSkillGroups(locale: Locale): SkillGroup[] {
  return data.skillGroups.map((group) => ({
    label: pick(group.label as Localized, locale),
    items: group.items,
  }));
}

/** Locale-independent — it only ever feeds a count. */
export const allSkills: string[] = data.skillGroups.flatMap(
  (group) => group.items,
);
