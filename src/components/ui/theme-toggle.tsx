"use client";

import { cn } from "@/lib/utils";

/**
 * Theme switch — PRD §12.16.
 *
 * Holds no React state on purpose. The class on `<html>` is the single
 * source of truth (set before first paint by the inline script in the
 * root layout), and both icons are always rendered with CSS deciding
 * which is visible. That means nothing to hydrate and therefore nothing
 * to mismatch — the trap that cost this project two real bugs already
 * (PRD §12.1, §12.7).
 */
export function ThemeToggle({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Private mode or blocked storage: the theme still flips for this
      // page view, it just won't be remembered. Not worth failing over.
    }
  }

  return (
    <button
      aria-label={label}
      className={cn(
        "grid size-9 place-items-center rounded-full border border-line text-ink transition-colors duration-300 hover:bg-canvas-alt",
        className,
      )}
      onClick={toggle}
      title={label}
      type="button"
    >
      {/* Sun shows in dark mode — it's what the button switches *to*. */}
      <svg
        aria-hidden
        className="hidden size-4 dark:block"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
        viewBox="0 0 24 24"
      >
        <title>Light</title>
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" />
      </svg>

      <svg
        aria-hidden
        className="size-4 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
        viewBox="0 0 24 24"
      >
        <title>Dark</title>
        <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />
      </svg>
    </button>
  );
}
