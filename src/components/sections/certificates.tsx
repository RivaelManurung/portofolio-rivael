import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { ArrowUpRight } from "@/components/ui/arrow";
import { certificates } from "@/lib/experience";

/**
 * Certificates — the credential half of the experience section.
 *
 * A two-column list rather than cards: ten items in cards would take
 * three screens and none of them is a thing you look at, only something
 * you check exists and click to verify.
 */
export function Certificates() {
  return (
    <div className="mt-20">
      <Reveal>
        <span className="text-label">{certificates.length} certifications</span>
      </Reveal>

      <ul className="mt-8 grid gap-x-8 sm:grid-cols-2">
        {certificates.map((certificate, index) => (
          <Reveal as="li" index={index % 2} key={certificate.link}>
            <a
              className="group flex items-center gap-5 border-line border-t py-5 transition-colors duration-500 hover:bg-canvas-alt"
              href={certificate.link}
              rel="noreferrer noopener"
              target="_blank"
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-sm bg-surface p-2">
                <Image
                  alt={certificate.issuer}
                  className="size-full object-contain grayscale"
                  height={certificate.logoHeight}
                  src={certificate.logo}
                  width={certificate.logoWidth}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.9375rem] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">
                  {certificate.title}
                </p>
                <p className="mt-0.5 text-meta text-ink-faint">
                  {certificate.issuer}
                </p>
              </div>

              <ArrowUpRight className="-translate-x-2 size-4 shrink-0 text-ink opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-hover:opacity-100" />
            </a>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
