import { ImageResponse } from "next/og";
import { getPublicCms } from "@/lib/cms/public";
import { site } from "@/data/site";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default async function Icon() {
  const cms = await getPublicCms();
  const letter =
    (cms.profile.name || site.name).trim().charAt(0).toUpperCase() || "A";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4F3F0",
          color: "#111111",
          fontSize: 18,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          letterSpacing: "-0.06em",
        }}
      >
        {letter}
      </div>
    ),
    size,
  );
}
