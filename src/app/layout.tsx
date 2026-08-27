import type { Metadata, Viewport } from "next";
import { Cursor } from "@/components/motion/cursor";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Footer } from "@/components/sections/footer";
import { Nav } from "@/components/sections/nav";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f2f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className={`${fontVariables} antialiased`} lang="en">
      <body>
        <SmoothScroll>
          <Cursor />

          <a
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
            href="#main"
          >
            Skip to content
          </a>

          <Nav />

          {/*
            Sits above the fixed footer and carries an opaque background,
            so the footer only appears once this column has scrolled past
            it (PRD §4.9). The bottom margin reserves exactly the footer's
            height — both read `--spacing-curtain`.
          */}
          <div className="relative z-10 mb-curtain min-h-screen bg-canvas">
            <main id="main">{children}</main>
          </div>

          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
