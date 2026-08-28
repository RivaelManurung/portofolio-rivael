import data from "@/data/portfolio.json";
import { type Locale, type Localized, pick } from "./i18n";

/**
 * Typed view over the experience, education and certificate records in
 * `src/data/portfolio.json`.
 *
 * Migrated from the v1 portfolio's `user_info.js`. Only obvious spelling
 * slips in the source were corrected ("Devlopment" → "Development",
 * "Enginger" → "Engineer", "Infite Learning" → "Infinite Learning",
 * matching its own logo filename). Dates, employers, descriptions and
 * certificate links are untouched.
 *
 * Company names, dates and certificate titles are proper nouns — they
 * are not translated. Job titles and bullet points are.
 */

export type Experience = {
  position: string;
  company: string;
  period: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  points: string[];
  tags: string[];
};

export type Certificate = {
  title: string;
  issuer: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  link: string;
};

export type Education = {
  school: string;
  degree: string;
  period: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
};

/** Most recent first. */
export function getExperience(locale: Locale): Experience[] {
  return data.experience.map((item) => ({
    position: pick(item.position as Localized, locale),
    company: item.company,
    period: item.period,
    logo: item.logo,
    logoWidth: item.logoWidth,
    logoHeight: item.logoHeight,
    points: item.points.map((point) => pick(point as Localized, locale)),
    tags: item.tags,
  }));
}

export function getEducation(locale: Locale): Education {
  return {
    school: data.education.school,
    degree: pick(data.education.degree as Localized, locale),
    period: data.education.period,
    logo: data.education.logo,
    logoWidth: data.education.logoWidth,
    logoHeight: data.education.logoHeight,
  };
}

/** Certificate titles are the names printed on them; never translated. */
export const certificates: Certificate[] = data.certificates;
