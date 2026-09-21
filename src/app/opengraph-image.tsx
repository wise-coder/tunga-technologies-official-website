import { ImageResponse } from "next/og";
export const alt =
  "Tunga Technologies — Technology built for Rwanda’s progress.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#0B315E",
        color: "white",
        padding: "66px 80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 25, letterSpacing: 4 }}>
        TUNGA TECHNOLOGIES
      </div>
      <div
        style={{
          display: "flex",
          width: 54,
          height: 6,
          marginTop: 34,
          background: "#F2B040",
        }}
      />
      <div
        style={{
          display: "flex",
          fontSize: 78,
          letterSpacing: -4,
          lineHeight: 1.1,
          maxWidth: 970,
          marginTop: 40,
          fontWeight: 700,
        }}
      >
        Technology built for Rwanda’s progress.
      </div>
      <div
        style={{
          display: "flex",
          color: "#BFD4EB",
          fontSize: 23,
          marginTop: "auto",
        }}
      >
        Practical solutions. Measurable impact.
      </div>
    </div>,
    size,
  );
}
