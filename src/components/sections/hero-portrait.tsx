import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Hero portrait — PRD §4.2, §10.
 *
 * The reference composition wants a transparent cutout whose shoulder
 * crops the headline. This photograph isn't one: it's shot against a
 * near-black field with the subject looking down. Rather than fake a
 * cutout, the black is used deliberately — the image sits in a dark
 * full-bleed panel that anchors the right side of the hero and echoes
 * the dark CTA band further down the page (PRD §4.6).
 *
 * `grayscale` is not a stylistic afterthought: PRD §3.1 keeps every
 * photograph of a person monochrome so that colour on the page belongs
 * exclusively to the work thumbnails.
 *
 * If a transparent cutout is shot later, drop the wrapper's background
 * and rounding and switch `object-cover` to `object-contain` — the
 * surrounding layout already assumes this footprint.
 */
export function HeroPortrait({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "size-full overflow-hidden rounded-tl-lg bg-contrast",
        className,
      )}
    >
      {/* The source is underexposed to the point where the subject
          disappears into the field. Lifting brightness and easing
          contrast keeps the panel dark while making him readable. */}
      <Image
        alt="Rivael Hasiholan Manurung"
        className="size-full object-cover object-[50%_28%] grayscale brightness-[1.45] contrast-[0.95]"
        fetchPriority="high"
        height={1706}
        priority
        sizes="(max-width: 640px) 72vw, (max-width: 1024px) 60vw, 46vw"
        src="/images/rivaell.jpg"
        width={1446}
      />
    </div>
  );
}
