"use client";

import { useLenis } from "lenis/react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { ease, spring } from "@/lib/motion";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "../ui/arrow";
import { LinkUnderline } from "../ui/link-underline";
import { Logo } from "../ui/logo";

/** Scroll depth at which the bar condenses into a floating pill. */
const CONDENSE_AT = 80;
/** Below this depth we never hide — avoids flicker at the top of the page. */
const HIDE_AFTER = 240;

export function Nav() {
  const pathname = usePathname();
  const shouldReduce = usePrefersReducedMotion();
  const lenis = useLenis();

  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setCondensed(y > CONDENSE_AT);
    // Hide going down, reveal going up — but never while the menu is open.
    setHidden(!menuOpen && y > previous && y > HIDE_AFTER);
  });

  // Close the overlay on navigation. `pathname` is the trigger, not a
  // value the effect reads — which is exactly what the lint rule flags.
  // biome-ignore lint/correctness/useExhaustiveDependencies: navigation is the signal
  useEffect(() => setMenuOpen(false), [pathname]);

  // Lock scroll behind the mobile overlay. Lenis owns the scroll
  // position, so stopping it is the real lock; the body `overflow` is a
  // belt-and-braces fallback for the frame before Lenis has attached.
  useEffect(() => {
    if (!menuOpen) {
      lenis?.start();
      document.body.style.overflow = "";
      return;
    }
    lenis?.stop();
    if (!lenis) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, lenis]);

  // Escape closes the overlay.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !shouldReduce ? "-130%" : "0%" }}
        className="fixed inset-x-0 top-0 z-50 pt-4 sm:pt-6"
        initial={false}
        transition={shouldReduce ? { duration: 0 } : spring.base}
      >
        <div className="shell">
          <motion.nav
            animate={{
              maxWidth: condensed ? 980 : 1440,
              paddingLeft: condensed ? 20 : 4,
              paddingRight: condensed ? 20 : 4,
              paddingTop: condensed ? 10 : 4,
              paddingBottom: condensed ? 10 : 4,
            }}
            className={cn(
              "mx-auto flex items-center justify-between gap-6 rounded-full transition-colors duration-500",
              condensed
                ? "border border-line/80 bg-canvas/75 backdrop-blur-xl"
                : "border border-transparent bg-transparent",
              // The bar stays above the overlay, so on a dark backdrop it
              // has to flip to light or the mark and the toggle vanish.
              menuOpen && "text-canvas",
            )}
            initial={false}
            transition={{ duration: 0.5, ease: ease.out }}
          >
            {/* Mark and links read as one left-hand cluster; the CTA is
                the only thing pushed to the far right. */}
            <div className="flex items-center gap-8">
              <Link
                aria-label={`${site.name} — home`}
                className="flex items-center gap-2 pl-1"
                href="/"
              >
                <Logo className="size-6" />
              </Link>

              {/* Desktop links */}
              <ul className="hidden items-center gap-7 md:flex">
                {navLinks.map((link) => {
                  const active = pathname.startsWith(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        className={cn(
                          "relative py-1 text-[0.9375rem] transition-colors duration-300",
                          active ? "text-ink" : "text-ink-muted hover:text-ink",
                        )}
                        href={link.href}
                      >
                        {link.label}
                        {/* Shared layout underline slides between items. */}
                        {active && (
                          <motion.span
                            className="absolute -bottom-0.5 left-0 h-px w-full bg-ink"
                            layoutId="nav-active"
                            transition={spring.base}
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <LinkUnderline
                className="hidden text-[0.9375rem] sm:inline-flex"
                href={site.bookingUrl}
              >
                Book A Call
              </LinkUnderline>

              <button
                aria-controls="mobile-menu"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className={cn(
                  "grid size-10 place-items-center rounded-full border transition-colors duration-500 md:hidden",
                  menuOpen ? "border-canvas/30" : "border-line",
                )}
                onClick={() => setMenuOpen((open) => !open)}
                type="button"
              >
                <span className="relative block h-3 w-4">
                  <motion.span
                    animate={{
                      rotate: menuOpen ? 45 : 0,
                      y: menuOpen ? 5 : 0,
                    }}
                    className="absolute inset-x-0 top-0 h-px bg-current"
                    transition={{ duration: 0.3, ease: ease.inOut }}
                  />
                  <motion.span
                    animate={{
                      rotate: menuOpen ? -45 : 0,
                      y: menuOpen ? -5 : 0,
                    }}
                    className="absolute inset-x-0 bottom-0 h-px bg-current"
                    transition={{ duration: 0.3, ease: ease.inOut }}
                  />
                </span>
              </button>
            </div>
          </motion.nav>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-[var(--spacing-gutter)] pt-28 pb-10 text-canvas md:hidden"
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            id="mobile-menu"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.6, ease: ease.inOut }}
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <li className="overflow-hidden" key={link.href}>
                  <motion.div
                    animate={{ y: "0%", opacity: 1 }}
                    initial={{ y: "100%", opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: ease.out,
                      delay: 0.25 + index * 0.06,
                    }}
                  >
                    <Link
                      className="block py-2 font-display text-h2 font-light"
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>

            <motion.a
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-h3"
              href={site.bookingUrl}
              initial={{ opacity: 0, y: 20 }}
              rel="noreferrer noopener"
              target="_blank"
              transition={{ duration: 0.5, ease: ease.out, delay: 0.5 }}
            >
              Book A Call
              <ArrowUpRight className="size-[0.8em]" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
