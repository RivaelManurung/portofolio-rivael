import { cn } from "@/lib/utils";

/**
 * Up-right arrow, drawn rather than typed.
 *
 * The ↗ character renders at wildly different weights and baselines
 * across fonts; an SVG keeps the stroke matched to the UI at every size.
 */
export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("size-[1em]", className)}
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Arrow up-right</title>
      <path
        d="M4.5 11.5 11.5 4.5M11.5 4.5H5.75M11.5 4.5v5.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export function ArrowDown({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("size-[1em]", className)}
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Arrow down</title>
      <path
        d="M8 3.5v9M8 12.5 4.75 9.25M8 12.5l3.25-3.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}
