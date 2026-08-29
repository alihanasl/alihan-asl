import { ImageResponse } from "next/og";
import { getPublicCms } from "@/lib/cms/public";
import { site } from "@/data/site";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default async function AppleIcon() {
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
          background: "#101010",
          color: "#f2f2f2",
          fontSize: 92,
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
