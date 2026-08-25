import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#E4E2DC",
          color: "#161615",
          fontSize: 18,
          fontFamily: "Georgia, serif",
          letterSpacing: "-0.06em",
        }}
      >
        A
      </div>
    ),
    size,
  );
}
