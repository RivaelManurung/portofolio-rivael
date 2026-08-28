import { notFound } from "next/navigation";
import { About } from "@/components/sections/about";
import { ConnectBanner } from "@/components/sections/connect-banner";
import { ExperienceSection } from "@/components/sections/experience-section";
import { Hero } from "@/components/sections/hero";
import { SkillsSection } from "@/components/sections/skills-section";
import { WorkSection } from "@/components/sections/work-section";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getHeroStats, getSite, socialLinks } from "@/lib/site";

/**
 * Single-page homepage. Every section the nav points at lives here and
 * is reached by anchor, not by navigation — `/work` and the case studies
 * are the only separate pages, because those are where a reader goes
 * once they've decided to dig in.
 *
 * Deviations from the reference design, all for the same reason — it is
 * a template for an agency selling design work, and this is a graduate
 * showing what he has built:
 *
 *   §4.7 "Latest Works" grid — the marquee plus `/work` already covers
 *        it; a third view of the same projects is padding.
 *   §4.8 blog strip — replaced by the stack. There is no written
 *        archive, and the stack is what a reader scans for here.
 *   §4.6 + §4.9 — merged into one closing band. Two contact sections
 *        plus a footer listing the same links is three closings.
 */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const copy = getSite(locale);

  return (
    <>
      <Hero
        role={copy.role}
        scrollLabel={dict.hero.scroll}
        stats={getHeroStats(locale)}
        tagline={copy.tagline}
        year={copy.year}
      />
      <About dict={dict} locale={locale} />
      <WorkSection dict={dict} locale={locale} />
      <ExperienceSection dict={dict} locale={locale} />
      <SkillsSection dict={dict} locale={locale} />
      <ConnectBanner
        announceLabel={dict.copy.announce}
        availability={copy.availability}
        copiedLabel={dict.copy.copied}
        elsewhereLabel={dict.connect.elsewhere}
        email={copy.email}
        emailLabel={dict.connect.email}
        intro={dict.connect.intro}
        socials={socialLinks}
        title={dict.connect.title}
      />
    </>
  );
}
