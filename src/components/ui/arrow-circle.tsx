import { cn } from "@/lib/utils";
import { ArrowUpRight } from "./arrow";

type ArrowCircleProps = {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "size-8 text-sm",
  md: "size-12 text-base",
  lg: "size-16 text-lg",
} as const;

const variants = {
  solid: "bg-ink text-canvas",
  outline: "border border-ink text-ink",
  ghost: "bg-surface text-ink",
} as const;

/**
 * The recurring circular ↗ affordance — PRD §3.4.
 *
 * Appears on card hover, timeline rows and CTAs. Presentational only:
 * it never carries the click target itself, so it can sit inside links,
 * buttons, or plain list rows without nesting interactive elements.
 */
export function ArrowCircle({
  variant = "solid",
  size = "md",
  className,
}: ArrowCircleProps) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full transition-transform duration-300 ease-[var(--ease-out-expo)]",
        sizes[size],
        variants[variant],
        className,
      )}
    >
      <ArrowUpRight className="size-[45%]" />
    </span>
  );
}
