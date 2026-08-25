import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { getRequestLocale } from "@/lib/i18n/get-locale";
import { translate } from "@/lib/i18n/translate";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage() {
  const locale = await getRequestLocale();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#E4E2DC",
          color: "#161615",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "ui-monospace, monospace",
            fontSize: 18,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#8A867E",
          }}
        >
          <span>{translate(locale, "hero.lab")}</span>
          <span>{site.year}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: "ui-monospace, monospace",
              fontSize: 22,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#3C3B38",
            }}
          >
            {translate(locale, "meta.ogRoles")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
