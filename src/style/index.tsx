// Reusable "documentary look" building blocks — see docs/style-guide.md
import React from "react";
import {
  AbsoluteFill, Img, OffthreadVideo, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";

// ---------- fonts ----------
const FONTS: [string, string][] = [
  ["Hind", "fonts/HindSiliguri-Bold.ttf"],
  ["HindSemi", "fonts/HindSiliguri-SemiBold.ttf"],
  ["TiroBangla", "fonts/TiroBangla-Regular.ttf"],
  ["Montserrat", "fonts/Montserrat.ttf"],
  ["Anton", "fonts/Anton-Regular.ttf"],
];
if (typeof document !== "undefined") {
  for (const [name, file] of FONTS) {
    const f = new FontFace(name, `url(${staticFile(file)})`);
    f.load().then(() => document.fonts.add(f)).catch(() => {});
  }
}

// ---------- grade + texture ----------
const PRESETS = {
  "vod-sepia": { filter: "sepia(0.55) saturate(0.7) contrast(1.25) brightness(0.92)", tint: "rgba(70,40,10,0.18)", grain: 0.16, vignette: 0.85 },
  "vod-teal": { filter: "saturate(0.6) contrast(1.2) brightness(0.9) hue-rotate(-8deg)", tint: "rgba(0,70,70,0.18)", grain: 0.13, vignette: 0.8 },
  bw: { filter: "grayscale(1) contrast(1.35) brightness(0.95)", tint: "transparent", grain: 0.2, vignette: 0.85 },
  punchy: { filter: "saturate(1.3) contrast(1.15)", tint: "rgba(255,80,0,0.05)", grain: 0.06, vignette: 0.55 },
} as const;
export type Preset = keyof typeof PRESETS;

export const FilmLook: React.FC<{ preset?: Preset; flicker?: boolean; children: React.ReactNode }> = ({ preset = "vod-sepia", flicker = true, children }) => {
  const f = useCurrentFrame();
  const p = PRESETS[preset];
  const flick = flicker ? 1 + (random(`fl${f}`) - 0.5) * 0.06 : 1;
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <AbsoluteFill style={{ filter: `${p.filter} brightness(${flick})` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: p.tint, mixBlendMode: "multiply" }} />
      <Grain opacity={p.grain} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,${p.vignette}) 100%)` }} />
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.15 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`g${f}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 50} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${f})`} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- shots ----------
// A video clip or still with a slow push-in (Ken Burns). `src` is relative to public/.
export const Shot: React.FC<{ src: string; still?: boolean; zoom?: [number, number]; pan?: [number, number]; startFrom?: number }> = ({
  src, still, zoom = [1.05, 1.15], pan = [0, 0], startFrom = 0,
}) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = f / Math.max(1, durationInFrames);
  const s = interpolate(t, [0, 1], zoom);
  const style: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
    transform: `scale(${s}) translate(${pan[0] * t}%, ${pan[1] * t}%)`,
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {still ? <Img src={staticFile(src)} style={style} /> : <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted style={style} />}
    </AbsoluteFill>
  );
};

// ---------- typography ----------
export const ChapterTitle: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const track = interpolate(f, [0, 60], [0.35, 0.5], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o }}>
      <div style={{ fontFamily: "Montserrat", fontWeight: 600, fontSize: 46, color: "white", letterSpacing: `${track}em`, textShadow: "0 2px 20px rgba(0,0,0,.8)" }}>{title}</div>
      {sub && <div style={{ fontFamily: "Montserrat", fontStyle: "italic", fontSize: 24, color: "#ddd", marginTop: 14, letterSpacing: "0.15em" }}>{sub}</div>}
    </AbsoluteFill>
  );
};

export const SpacedWord: React.FC<{ word: string; color?: string }> = ({ word, color = "#222" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 70 }}>
        {[...word].map((c, i) => (
          <span key={i} style={{ fontFamily: "Georgia, serif", fontSize: 64, color, opacity: interpolate(f, [i * 3, i * 3 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{c}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const PaperNote: React.FC<{ lines: string[]; rotate?: number }> = ({ lines, rotate = -12 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 18 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        width: 820, padding: "70px 80px", background: "linear-gradient(135deg,#f6f2ea,#e4ded2)", boxShadow: "0 40px 80px rgba(0,0,0,.6)",
        transform: `rotate(${rotate}deg) translateY(${(1 - s) * 200}px)`, opacity: s,
      }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: "TiroBangla", fontSize: 40, lineHeight: 1.7, color: "#1b1b1b" }}>{l}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// variant "bold" = PiFingers big centered caption; "subtle" = small VoD-style subtitle
export const Caption: React.FC<{ text: string; variant?: "bold" | "subtle"; accent?: string }> = ({ text, variant = "bold", accent = "#ffd34d" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (variant === "subtle") {
    return (
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90 }}>
        <div style={{ fontFamily: "HindSemi", fontSize: 34, color: "white", textShadow: "0 2px 8px #000", opacity: interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" }) }}>{text}</div>
      </AbsoluteFill>
    );
  }
  const s = spring({ frame: f, fps, config: { damping: 11, mass: 0.6 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        fontFamily: "Hind", fontSize: 92, color: "white", textAlign: "center", maxWidth: 1600, lineHeight: 1.25,
        WebkitTextStroke: "3px rgba(0,0,0,.85)", paintOrder: "stroke fill", textShadow: `0 0 30px rgba(0,0,0,.7), 0 0 2px ${accent}`,
        transform: `scale(${interpolate(s, [0, 1], [1.4, 1])})`, opacity: s,
      }}>{text}</div>
    </AbsoluteFill>
  );
};

// ---------- transitions (overlay these for ~8–15 frames across a cut) ----------
export const FlashCut: React.FC<{ len?: number }> = ({ len = 8 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "white", opacity: interpolate(f, [0, 2, len], [0, 1, 0], { extrapolateRight: "clamp" }) }} />;
};

export const LightLeak: React.FC<{ len?: number; color?: string }> = ({ len = 20, color = "255,90,20" }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, len], [-60, 120]);
  const o = interpolate(f, [0, len * 0.4, len], [0, 0.95, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: o, background: `radial-gradient(ellipse 40% 90% at ${x}% 50%, rgba(${color},1), rgba(${color},0.4) 40%, transparent 70%)` }} />
  );
};

export const GlitchCut: React.FC<{ len?: number; children: React.ReactNode }> = ({ len = 10, children }) => {
  const f = useCurrentFrame();
  const on = f < len;
  const amt = on ? interpolate(f, [0, len], [40, 0]) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill>{children}</AbsoluteFill>
      {on && [0, 1, 2, 3, 4, 5].map((i) => {
        const top = random(`t${f}${i}`) * 90;
        const h = 3 + random(`h${f}${i}`) * 12;
        const dx = (random(`x${f}${i}`) - 0.5) * amt * 4;
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(${top}% 0 ${100 - top - h}% 0)`, transform: `translateX(${dx}px)`, filter: "hue-rotate(90deg) saturate(3)", mixBlendMode: "screen" }}>
            {children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

export const LogoBug: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 34px 40px" }}>
    <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 20, color: "rgba(255,255,255,.85)", letterSpacing: "0.12em" }}>{text}</div>
  </AbsoluteFill>
);
