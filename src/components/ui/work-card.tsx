import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { WorkItem } from "@/lib/work";
import { ArrowCircle } from "./arrow-circle";

/**
 * Work thumbnail — PRD §3.4. Shared by the marquee (§4.4) and the
 * Latest Works grid (§4.7).
 *
 * Hover does three things at once, all on the same curve so they read as
 * one gesture: the image pushes in, it dims very slightly, and the
 * circular ↗ scales up from the centre.
 *
 * Goes to the case study, not the repository. The card is an invitation
 * to read about the work; handing someone raw source is a different,
 * later decision, so the repo link lives on the detail page.
 */
export function WorkCard({
  item,
  priority = false,
  className,
}: {
  item: WorkItem;
  /** Set on the first card or two so the marquee isn't blank on load. */
  priority?: boolean;
  className?: string;
}) {
  return (
    <article className={cn("group", className)}>
      <Link
        aria-label={`${item.title} — read the case study`}
        className="block"
        href={`/work/${item.slug}`}
      >
        <div className="relative aspect-4/3 overflow-hidden rounded-md bg-canvas-alt">
          <Image
            alt={item.title}
            className="size-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
            height={item.height}
            priority={priority}
            sizes="(max-width: 640px) 68vw, (max-width: 1024px) 42vw, 26vw"
            src={item.image}
            width={item.width}
          />

          {/* Slight dim so the arrow keeps contrast on pale thumbnails. */}
          <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/15" />

          <ArrowCircle
            className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 scale-75 opacity-0 transition duration-400 ease-[var(--ease-out-expo)] group-hover:scale-100 group-hover:opacity-100"
            size="md"
          />
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-4">
          <h3 className="text-[0.9375rem] leading-snug">{item.title}</h3>
          <span className="shrink-0 text-meta text-ink-faint">
            For {item.client}
          </span>
        </div>
      </Link>
    </article>
  );
}
