"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ease } from "@/lib/motion";

/**
 * The footer's email address — PRD §4.9.
 *
 * Clicking copies rather than opening a mail client, because on desktop
 * `mailto:` usually launches something nobody wants. The address stays
 * selectable text either way, and the confirmation is announced politely
 * so it isn't only a visual signal.
 */
export function CopyEmail({
  email,
  copiedLabel,
  announceLabel,
}: {
  email: string;
  copiedLabel: string;
  announceLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure origin, denied permission). Fall
      // back to the mail client rather than failing silently.
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <div className="relative inline-flex items-center gap-3">
      <button
        className="group relative inline-block font-display text-[clamp(1.5rem,2.8vw,2.5rem)] font-light tracking-tight"
        onClick={handleCopy}
        type="button"
      >
        {email}
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 bg-current transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-0"
        />
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100 group-hover:delay-200"
        />
      </button>

      <span aria-live="polite" className="sr-only">
        {copied ? announceLabel : ""}
      </span>

      <AnimatePresence>
        {copied && (
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className="rounded-full bg-on-contrast px-3 py-1 text-contrast text-meta"
            exit={{ opacity: 0, y: -6 }}
            initial={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25, ease: ease.out }}
          >
            {copiedLabel}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
