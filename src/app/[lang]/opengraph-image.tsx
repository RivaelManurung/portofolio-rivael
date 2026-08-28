import { ImageResponse } from "next/og";
import { isLocale } from "@/lib/i18n";
import { getSite, site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name;

/**
 * Deliberately NOT prerendered. Adding `generateStaticParams` here
 * crashed the build worker outright on Windows
 * (STATUS_STACK_BUFFER_OVERRUN inside the ImageResponse renderer), and
 * an OG card is cheap to generate once and then cache at the edge —
 * nobody waits on it, the scraper does.
 */

/**
 * Social preview card — PRD §7.2.
 *
 * Generated rather than shipped as a static PNG so it stays in step
 * with the content file: change the role or the name and the card
 * follows. Rendered per locale, because the subtitle is translated.
 *
 * Uses the runtime's default sans rather than loading General Sans —
 * fetching a font here costs build time on every page that has an OG
 * image, and at this size the difference is not what anyone is looking
 * at in a link preview.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
  const copy = getSite(locale);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f2f2f0",
        color: "#0a0a0a",
        padding: "72px 80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 2,
          color: "#6e6e6e",
        }}
      >
        {copy.role.toUpperCase()}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 92, lineHeight: 1, letterSpacing: -3 }}>
          {site.name}
        </div>
        <div style={{ fontSize: 30, color: "#6e6e6e" }}>{site.email}</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          color: "#a3a3a3",
        }}
      >
        <span>{copy.availability}</span>
        <span>{site.url.replace("https://", "")}</span>
      </div>
    </div>,
    size,
  );
}
