import { ImageResponse } from "next/og";

export const alt = "DevTools Cloud — One toolbox for every developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          backgroundImage: "radial-gradient(circle at 25% 15%, #1b1b2e 0%, #09090b 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#6366f1",
              color: "#ffffff",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            {">"}_
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 600, color: "#f4f4f5" }}>DevTools Cloud</div>
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700, color: "#ffffff", textAlign: "center" }}>
          One toolbox for every developer
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 26, color: "#a1a1aa" }}>
          Free · Client-side · No sign-up required
        </div>
      </div>
    ),
    { ...size }
  );
}
