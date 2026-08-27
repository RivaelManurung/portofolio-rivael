import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PillProps = {
  children: ReactNode;
  variant?: "outline" | "solid";
  className?: string;
};

/** Tag chip: UIUX / Branding / MARKETING — PRD §3.4. */
export function Pill({ children, variant = "outline", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1.5 text-meta whitespace-nowrap",
        variant === "outline"
          ? "border border-line text-ink-muted"
          : "bg-ink text-canvas",
        className,
      )}
    >
      {children}
    </span>
  );
}
