// YouTube channel banner 2560x1440 (safe area for all devices: centre 1546x423).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const FONT = "Hind, 'Hind Siliguri', sans-serif";
if (typeof document !== "undefined") {
  for (const [name, file] of [["Hind", "HindSiliguri-Bold.ttf"], ["HindSemi", "HindSiliguri-SemiBold.ttf"]]) {
    const f = new FontFace(name, `url(${staticFile("fonts/" + file)})`);
    f.load().then(() => document.fonts.add(f)).catch(() => {});
  }
}

export const ChannelBanner: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 20% 30%, #C6363C55 0%, transparent 45%), radial-gradient(circle at 85% 70%, #0E7C5A66 0%, transparent 45%), #0B0F0D" }}>
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 2.5px, transparent 2.5px)", backgroundSize: "44px 44px" }} />
    {/* dashed flight arc across the banner */}
    <svg width={2560} height={1440} style={{ position: "absolute" }}>
      <path d="M 300 980 Q 1280 380 2260 900" stroke="#F5B841" strokeWidth={5} strokeDasharray="18 16" fill="none" opacity={0.55} />
      <text x={2140} y={830} fontSize={90} transform="rotate(30 2140 830)">✈️</text>
    </svg>
    {/* safe area: x 507–2053, y 508–931 */}
    <div style={{ position: "absolute", left: 507, top: 508, width: 1546, height: 423, display: "flex", alignItems: "center", gap: 60 }}>
      <div style={{ background: "#fff", borderRadius: 28, padding: "26px 34px", flexShrink: 0, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <Img src={staticFile("serbia/dream-logo.png")} style={{ height: 100, display: "block" }} />
      </div>
      <div style={{ fontFamily: FONT, color: "#fff" }}>
        <div style={{ fontSize: 70, lineHeight: 1.1, whiteSpace: "nowrap" }}>প্রবাসে যাওয়ার আগে <span style={{ color: "#F5B841" }}>সঠিক গাইড</span></div>
        <div style={{ fontFamily: "HindSemi, Hind, sans-serif", fontSize: 36, color: "#cfd8d3", marginTop: 12, whiteSpace: "nowrap" }}>বাংলায় দেশভিত্তিক গাইড · ওয়ার্ক পারমিট · কাগজপত্র · নিয়মকানুন</div>
        <div style={{ display: "flex", gap: 14, marginTop: 26, flexWrap: "nowrap" }}>
          {["সৌদি আরব", "কাতার", "সার্বিয়া", "পর্তুগাল", "মলদোভা", "উ. মেসিডোনিয়া"].map((t) => (
            <span key={t} style={{ fontFamily: "HindSemi, Hind, sans-serif", fontSize: 28, color: "#fff", padding: "4px 18px", borderRadius: 999, background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.25)" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
