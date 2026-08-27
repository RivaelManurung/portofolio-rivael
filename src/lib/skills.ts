import data from "@/data/portfolio.json";

/**
 * Typed view over `skillGroups` in `src/data/portfolio.json`.
 *
 * Every entry there is evidenced by the v1/v2 portfolio data — either in
 * the declared skill list or in a shipped project's stack. Nothing is
 * added for padding: `allSkills.length` feeds the hero counter, so an
 * invented entry would quietly turn a real number into a false one.
 */

export type SkillGroup = { label: string; items: string[] };

export const skillGroups: SkillGroup[] = data.skillGroups;

export const allSkills = skillGroups.flatMap((group) => group.items);
