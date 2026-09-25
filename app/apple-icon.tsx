import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#059669" }}>
        <svg width="132" height="132" viewBox="0 0 64 64">
          <path d="M16 18h32a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H30l-9 8v-8h-5a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6Z" fill="#fff" />
          <path d="M27 26l-5 5 5 5M37 26l5 5-5 5" fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
