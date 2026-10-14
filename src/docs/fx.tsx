import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
// ---------- atmosphere FX (cheap overlays: gradients + small divs, no CSS filters) ----------
export type Fx = "fog" | "flicker" | "embers" | "rain" | "moon";
const rnd = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
export const FxLayer: React.FC<{ fx?: Fx }> = ({ fx }) => {
  const f = useCurrentFrame();
  if (!fx) return null;
  if (fx === "fog" || fx === "moon") {
    const tint = fx === "moon" ? "200,215,255" : "235,225,210";
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", width: "140%", height: "60%", left: `${-20 + ((f * (0.06 + i * 0.03) + i * 30) % 40) - 20}%`, top: `${45 + i * 12}%`,
            background: `radial-gradient(ellipse at center, rgba(${tint},${0.16 - i * 0.03}) 0%, transparent 65%)` }} />
        ))}
      </AbsoluteFill>
    );
  }
  if (fx === "flicker") {
    const a = 0.16 + 0.07 * Math.sin(f * 0.9) + 0.05 * Math.sin(f * 2.3 + 1) + 0.04 * rnd(Math.floor(f / 3));
    return <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at 70% 60%, rgba(255,160,60,${a}) 0%, rgba(0,0,0,${0.25 - a / 2}) 70%)` }} />;
  }
  if (fx === "embers") {
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {Array.from({ length: 28 }, (_, i) => {
          const sp = 0.6 + rnd(i) * 1.4, y = (110 - ((f * sp * 0.25 + rnd(i + 50) * 120) % 120)), x = rnd(i + 9) * 100 + Math.sin(f / 25 + i) * 2;
          const sz = 3 + rnd(i + 3) * 5;
          return <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: sz, height: sz, borderRadius: "50%", background: "rgba(255,190,110,.75)", boxShadow: "0 0 8px rgba(255,150,60,.8)", opacity: 0.4 + 0.6 * rnd(i + Math.floor(f / 6)) }} />;
        })}
      </AbsoluteFill>
    );
  }
  // rain
  return <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.35, background: "repeating-linear-gradient(105deg, rgba(220,230,255,.0) 0px, rgba(220,230,255,.0) 22px, rgba(220,230,255,.5) 23px, rgba(220,230,255,0) 24px)", backgroundPosition: `${f * 6}px ${f * 40}px` }} />;
};

