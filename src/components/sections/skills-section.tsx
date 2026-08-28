import { Reveal } from "@/components/motion/reveal";
import { Pill } from "@/components/ui/pill";
import { SectionLabel } from "@/components/ui/section-label";
import type { Dictionary, Locale } from "@/lib/i18n";
import { getSkillGroups } from "@/lib/skills";

/**
 * Technology stack, grouped — the section that replaces the reference
 * design's blog strip (PRD §4.8). There is no written archive to put
 * there, and for a developer's portfolio the stack is what a reader is
 * actually scanning for at this point on the page.
 *
 * Grouped rather than one flat cloud: forty loose pills say "I have
 * touched a lot of things", five labelled rows say where the depth is.
 */
export function SkillsSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="shell py-section" id="skills">
      <Reveal>
        <SectionLabel>{dict.skills.label}</SectionLabel>
      </Reveal>

      <Reveal index={1}>
        <h2 className="mt-6 max-w-[16ch] font-display font-light text-h2">
          {dict.skills.title}
        </h2>
      </Reveal>

      <dl className="mt-16 space-y-10">
        {getSkillGroups(locale).map((group, index) => (
          <Reveal index={index + 1} key={group.label}>
            <div className="grid gap-4 border-line border-t pt-6 md:grid-cols-12 md:gap-8">
              <dt className="text-label md:col-span-3">{group.label}</dt>
              <dd className="md:col-span-9">
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Pill>{item}</Pill>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
