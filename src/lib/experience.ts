import data from "@/data/portfolio.json";

/**
 * Typed view over the experience, education and certificate records in
 * `src/data/portfolio.json`.
 *
 * Migrated from the v1 portfolio's `user_info.js`. Only obvious spelling
 * slips in the source were corrected ("Devlopment" → "Development",
 * "Enginger" → "Engineer", "Infite Learning" → "Infinite Learning",
 * matching its own logo filename). Dates, employers, descriptions and
 * certificate links are untouched.
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
export const experience: Experience[] = data.experience;

export const education: Education = data.education;

export const certificates: Certificate[] = data.certificates;
