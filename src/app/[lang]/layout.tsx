import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cursor } from "@/components/motion/cursor";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Footer } from "@/components/sections/footer";
import { Nav } from "@/components/sections/nav";
import { fontVariables } from "@/lib/fonts";
import { getDictionary, isLocale, type Locale, locales } from "@/lib/i18n";
import { getNav, getSite, site, socialLinks } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const copy = getSite(lang);
  const title = `${site.name} — ${copy.role}`;

  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s — ${site.shortName}` },
    description: copy.description,
    // hreflang: tells search engines these are translations of one page,
    // not duplicates competing with each other.
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: "website",
      locale: lang === "id" ? "id_ID" : "en_US",
      url: `/${lang}`,
      siteName: site.name,
      title,
      description: copy.description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: copy.description,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e0d" },
  ],
};

/**
 * Applies the stored theme before the first paint.
 *
 * Has to be inline and synchronous: any deferred script runs after the
 * browser has already painted the default palette, which is the white
 * flash every dark-mode site is judged by. Wrapped in try/catch because
 * `localStorage` throws outright in some privacy modes.
 */
const themeScript = `
try {
  var stored = localStorage.getItem('theme');
  var dark = stored ? stored === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  if (dark) document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const copy = getSite(locale);

  return (
    // suppressHydrationWarning: the script above mutates the class list
    // before React attaches, which React would otherwise flag.
    <html
      className={`${fontVariables} antialiased`}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: must run before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {/*
          JSON-LD: lets search engines resolve this as a person rather
          than a page of text, which is what surfaces the name, role and
          profile links as an entity instead of a blue link.
        */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no other injection point
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: site.name,
              jobTitle: copy.role,
              email: `mailto:${site.email}`,
              url: `${site.url}/${locale}`,
              description: copy.description,
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Institute of Technology Del",
              },
              sameAs: socialLinks.map((link) => link.href),
            }),
          }}
          type="application/ld+json"
        />

        <SmoothScroll>
          <Cursor viewLabel={dict.cursor.view} />

          <a
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
            href="#main"
          >
            {dict.nav.skip}
          </a>

          <Nav
            cta={{ label: copy.ctaLabel, href: copy.ctaHref }}
            labels={dict.nav}
            links={getNav(locale)}
            locale={locale}
            siteName={site.name}
          />

          {/*
            Sits above the fixed footer and carries an opaque background,
            so the footer only appears once this column has scrolled past
            it (PRD §4.9). The bottom margin reserves exactly the footer's
            height — both read `--spacing-curtain`.
          */}
          <div className="relative z-10 mb-curtain min-h-screen bg-canvas">
            <main id="main">{children}</main>
          </div>

          <Footer
            builtWith={dict.footer.builtWith}
            homeLabel={dict.footer.home}
            links={getNav(locale)}
            locale={locale}
          />
        </SmoothScroll>
      </body>
    </html>
  );
}
