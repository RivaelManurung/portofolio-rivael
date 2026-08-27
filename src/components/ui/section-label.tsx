import { cn } from "@/lib/utils";

/** Section eyebrow — the `• Portfolio` marker (PRD §3.2). */
export function SectionLabel({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 text-label", className)}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-ink" />
      {children}
    </span>
  );
}
