import { getSnippetByIdAdmin } from "@/lib/firebase/admin-snippets";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snippet = await getSnippetByIdAdmin(id);
  const title = snippet?.title ?? "DevTools Cloud";
  const language = snippet?.language ?? "";
  const description = snippet?.description || "A code snippet shared on DevTools Cloud";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#09090b",
          backgroundImage: "radial-gradient(circle at 80% 0%, #1b1b2e 0%, #09090b 55%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#6366f1",
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {">"}_
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: "#f4f4f5" }}>DevTools Cloud Snippets</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {language ? (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                fontSize: 22,
                color: "#818cf8",
                border: "2px solid #232327",
                borderRadius: 999,
                padding: "6px 18px",
              }}
            >
              {language}
            </div>
          ) : null}
          <div style={{ display: "flex", fontSize: 56, fontWeight: 700, color: "#ffffff", lineHeight: 1.15 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 28, color: "#a1a1aa", maxWidth: 900 }}>{description}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
