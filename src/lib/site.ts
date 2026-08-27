import data from "@/data/portfolio.json";
import { allSkills } from "./skills";
import { work } from "./work";

/**
 * Typed view over `src/data/portfolio.json`.
 *
 * This file holds no content of its own — edit the JSON. Keeping the
 * data in one place and the types here means a component never imports
 * raw JSON, and there is never a second copy to drift.
 */

export const site = data.site;

export type NavLink = { label: string; href: string };

/**
 * Navigation reflects what actually exists. The reference design's
 * "Services" and "Blog" were dropped: there is no service catalogue and
 * no written archive behind them, and a nav item that opens an empty
 * room costs more trust than the extra entry buys.
 */
export const navLinks: NavLink[] = data.nav;

export const footerLinks: NavLink[] = [
  { label: "Home", href: "/" },
  ...navLinks,
];

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
export const heroStats = [
  { value: work.length, prefix: "", suffix: "", label: "Projects shipped" },
  {
    value: allSkills.length,
    prefix: "",
    suffix: "",
    label: "Technologies used",
  },
] as const;
