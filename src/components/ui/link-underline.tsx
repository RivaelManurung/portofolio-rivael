import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "./arrow";

type LinkUnderlineProps = {
  href: string;
  children: ReactNode;
  /** Show the trailing ↗ that marks an action link. */
  arrow?: boolean;
  /** Lets the nav intercept same-page anchors and hand them to Lenis. */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
};

/**
 * Action link with a wiping underline — PRD §3.4.
 *
 * The rule is "sweep, not fade". Two hairlines are stacked: the resting
 * one retracts to the right, and a fresh one enters from the left just
 * behind it. The stagger is a hover-only delay, so leaving the link
 * reverses cleanly instead of stuttering on the way out.
 */
export function LinkUnderline({
  href,
  children,
  arrow = true,
  onClick,
  className,
}: LinkUnderlineProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");

  const content = (
    <>
      <span className="relative inline-block">
        {children}
        {/* Resting hairline — retracts rightward on hover. */}
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-100 bg-current transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-0"
        />
        {/* Incoming hairline — enters from the left, slightly behind. */}
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100 group-hover:delay-200"
        />
      </span>
      {arrow && (
        <ArrowUpRight className="size-[0.9em] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  const classes = cn(
    "group inline-flex items-center gap-1.5 text-body leading-none",
    className,
  );

  if (isExternal) {
    return (
      <a
        className={classes}
        href={href}
        onClick={onClick}
        rel="noreferrer noopener"
        target="_blank"
      >
        {content}
      </a>
    );
  }

  return (
    <Link className={classes} href={href} onClick={onClick}>
      {content}
    </Link>
  );
}
