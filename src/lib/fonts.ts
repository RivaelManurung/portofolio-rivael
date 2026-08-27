import { Inter } from "next/font/google";
import localFont from "next/font/local";

/**
 * Display face — General Sans (Fontshare, free for commercial use).
 * Single 38 KB variable file covering weight 200–700, so the hero's
 * ultralight "Hello" and the 500-weight UI share one download.
 *
 * PRD §3.2 names PP Neue Montreal as the paid upgrade. Swapping is a
 * one-line change here — nothing else in the codebase names a font.
 */
export const generalSans = localFont({
  src: [
    {
      path: "../assets/fonts/GeneralSans-Variable.woff2",
      weight: "200 700",
      style: "normal",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/** Body & UI face. */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  axes: ["opsz"],
});

export const fontVariables = `${generalSans.variable} ${inter.variable}`;
