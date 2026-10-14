// বাংলা টাইমলাইন — reusable TV-news kit: virtual studio, breaking banner, headline strip, ticker, live bug, intro/outro.
// A story file (src/news/stories/*.tsx) supplies segments (VO + visual + headline) and ticker lines; see Story template there.
// NOTE: never call hooks inside conditional JSX.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

export const N = { red: "#d71920", red2: "#ff2a32", navy: "#06122b", blue: "#0d2a63", gold: "#ffcc29", white: "#ffffff", ink: "#0a0a0a" };
export type Theme = typeof N & { wall: string; floor: string; breakingBn: string; breakingEn: string; tickerLabel: string; logo?: string };
export const NEWS_THEME: Theme = { ...N, wall: "#1a3f8f", floor: "#0b1d45", breakingBn: "ব্রেকিং নিউজ", breakingEn: "BREAKING NEWS", tickerLabel: "শিরোনাম" };
export const SPORTS_THEME: Theme = { ...N, red: "#0a8f3c", red2: "#b6ff00", navy: "#04170c", blue: "#0d3d22", gold: "#b6ff00", wall: "#11692f", floor: "#0a2e17", breakingBn: "খেলার খবর", breakingEn: "SPORTS NEWS", tickerLabel: "খেলা" };
// Colours of Bangladesh (rebrand of বাংলা টাইমলাইন, Oct 2026): red COB block + charcoal, as in the logo
export const COB_THEME: Theme = { ...N, red: "#c7081e", red2: "#ff2a3c", navy: "#0b1317", blue: "#17272f", gold: "#ffffff", ink: "#111a1f", wall: "#24343c", floor: "#0e171c", breakingBn: "ব্রেকিং নিউজ", breakingEn: "BREAKING NEWS", tickerLabel: "শিরোনাম", logo: "cob/logo-light.png" };
export const COB_SPORTS_THEME: Theme = { ...COB_THEME, breakingBn: "খেলার খবর", breakingEn: "SPORTS NEWS", tickerLabel: "খেলা" };
const ThemeCtx = React.createContext<Theme>(NEWS_THEME);
export const useTheme = () => React.useContext(ThemeCtx);
export const BN = "Hind";
if (typeof document !== "undefined") {
  for (const [f, w] of [["fonts/HindSiliguri-Bold.ttf", "700"], ["fonts/HindSiliguri-SemiBold.ttf", "600"]]) {
    const ff = new FontFace("Hind", `url(${staticFile(f)})`, { weight: w });
    ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  }
}
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const bn = (s: number | string) => String(s).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
export const useSp = (delay = 0, damping = 15, mass = 0.8) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, mass } });
};
export const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 0.5 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={150}><Audio src={staticFile(src)} volume={vol} /></Sequence>
);

// ---------- virtual studio: LED back wall, floor, a big video wall that can zoom to full screen ----------
export const Studio: React.FC<{ zoom?: number; children?: React.ReactNode }> = ({ zoom = 0, children }) => {
  const T = useTheme();
  const f = useCurrentFrame();
  const drift = Math.sin(f / 120) * 18;
  const W = interpolate(zoom, [0, 1], [1180, 1920]), H = (W * 9) / 16;
  const top = interpolate(zoom, [0, 1], [150, 0]);
  return (
    <AbsoluteFill style={{ background: T.navy, overflow: "hidden" }}>
      {/* back wall */}
      <AbsoluteFill style={{ transform: `translateX(${drift}px) scale(1.06)`, background: `radial-gradient(1200px 600px at 50% 35%, ${T.wall}, ${T.navy} 70%)` }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", top: 60, bottom: 330, left: 40 + i * 136, width: 120, borderRadius: 6, background: "linear-gradient(180deg, rgba(80,140,255,.16), rgba(80,140,255,.04))", border: "1px solid rgba(120,170,255,.18)", opacity: 0.6 + 0.4 * Math.abs(Math.sin(f / 40 + i)) }} />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: 735, height: 6, background: `linear-gradient(90deg, transparent, ${T.red2}, transparent)`, boxShadow: `0 0 30px ${T.red}` }} />
        {/* floor */}
        <div style={{ position: "absolute", left: -200, right: -200, top: 740, bottom: -200, background: `linear-gradient(180deg, ${T.floor}, #020713)`, transform: "perspective(900px) rotateX(55deg)", transformOrigin: "top", backgroundImage: "linear-gradient(rgba(120,170,255,.12) 2px, transparent 2px), linear-gradient(90deg, rgba(120,170,255,.12) 2px, transparent 2px)", backgroundSize: "120px 120px" }} />
      </AbsoluteFill>
      {/* video wall */}
      <div style={{ position: "absolute", left: (1920 - W) / 2, top, width: W, height: H, borderRadius: interpolate(zoom, [0, 1], [14, 0]), overflow: "hidden", background: "#000", boxShadow: zoom < 1 ? "0 0 0 6px #111a2e, 0 0 0 8px rgba(255,255,255,.12), 0 40px 120px rgba(0,0,0,.7), 0 0 80px rgba(60,120,255,.25)" : "none" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${W / 1920})`, transformOrigin: "top left" }}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};

// photo with slow push-in, optional credit
export const Photo: React.FC<{ src: string; credit?: string; from?: number; to?: number; origin?: string }> = ({ src, credit, from = 1.05, to = 1.18, origin = "50% 40%" }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(30px) brightness(.5)", transform: "scale(1.2)" }} />
      <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", transform: `scale(${interpolate(f, [0, durationInFrames], [from, to])})`, transformOrigin: origin }} />
      {credit && <div style={{ position: "absolute", right: 24, bottom: 196, padding: "4px 12px", borderRadius: 6, background: "rgba(0,0,0,.55)", fontFamily: BN, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,.85)" }}>{credit}</div>}
    </AbsoluteFill>
  );
};

// ---------- overlays ----------
export const LiveBug: React.FC<{ date: string }> = ({ date }) => {
  const T = useTheme();
  const f = useCurrentFrame();
  const secs = 21 * 3600 + 30 * 60 + Math.floor(f / 30);
  const t = [Math.floor(secs / 3600) % 24, Math.floor(secs / 60) % 60].map((n) => bn(String(n).padStart(2, "0"))).join(":");
  return (
    <div style={{ position: "absolute", right: 40, top: 34, display: "flex", alignItems: "stretch", fontFamily: BN, fontWeight: 700, boxShadow: "0 8px 24px rgba(0,0,0,.4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 18px", background: T.red, color: "white", fontSize: 30 }}>
        <span style={{ width: 14, height: 14, borderRadius: 99, background: "white", opacity: f % 30 < 15 ? 1 : 0.25 }} />লাইভ
      </div>
      <div style={{ padding: "6px 18px", background: "rgba(0,0,0,.75)", color: "white", fontSize: 30 }}>{t}</div>
      <div style={{ padding: "6px 18px", background: "rgba(255,255,255,.92)", color: T.ink, fontSize: 26, display: "flex", alignItems: "center" }}>{date}</div>
    </div>
  );
};

export const LogoBug: React.FC = () => {
  const T = useTheme();
  return (
    <div style={{ position: "absolute", left: 36, top: 26, padding: "8px 14px", borderRadius: 10, background: "rgba(0,0,0,.45)" }}>
      <Img src={staticFile(T.logo ?? "btl/logo.png")} style={{ height: T.logo ? 64 : 84 }} />
    </div>
  );
};

// red BREAKING NEWS wipe
export const Breaking: React.FC<{ len?: number }> = ({ len = 70 }) => {
  const T = useTheme();
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: ease });
  const out = interpolate(f, [len - 12, len], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: out }}>
      <div style={{ transform: `skewX(-12deg) scaleX(${inn})`, background: `linear-gradient(90deg, ${T.red}, ${T.red2})`, padding: "18px 90px", boxShadow: `0 0 80px ${T.red}` }}>
        <div style={{ transform: "skewX(12deg)", fontFamily: BN, fontWeight: 700, fontSize: 110, color: "white", lineHeight: 1.15, textShadow: "0 4px 0 rgba(0,0,0,.25)" }}>{T.breakingBn}</div>
      </div>
      <div style={{ marginTop: 14, transform: `skewX(-12deg) scaleX(${inn})`, background: "white", padding: "6px 40px" }}>
        <div style={{ transform: "skewX(12deg)", fontFamily: "Montserrat", fontWeight: 800, fontSize: 40, color: T.red, letterSpacing: "0.2em" }}>{T.breakingEn}</div>
      </div>
    </AbsoluteFill>
  );
};

// headline strip + ticker (bottom). `headline` changes per segment; it re-animates on change via `key` from the caller.
export const Headline: React.FC<{ label: string; text: string }> = ({ label, text }) => {
  const T = useTheme();
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 14], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 74, height: 108, display: "flex", fontFamily: BN, fontWeight: 700 }}>
      <div style={{ width: 250, background: T.red, color: "white", fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", clipPath: "polygon(0 0, 100% 0, 88% 100%, 0 100%)" }}>{label}</div>
      <div style={{ flex: 1, marginLeft: -30, background: "linear-gradient(180deg, #ffffff, #e9edf5)", display: "flex", alignItems: "center", padding: "0 40px 0 60px", clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
        <span style={{ fontSize: 54, color: T.ink, whiteSpace: "nowrap", transform: `translateY(${(1 - p) * 40}px)` }}>{text}</span>
      </div>
    </div>
  );
};

export const Ticker: React.FC<{ items: string[]; speed?: number }> = ({ items, speed = 4 }) => {
  const T = useTheme();
  const f = useCurrentFrame();
  const line = items.map((t) => `${t}   ●   `).join("");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 74, display: "flex", background: T.ink, fontFamily: BN, fontWeight: 600 }}>
      <div style={{ width: 250, zIndex: 2, background: T.gold, color: T.ink, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{T.tickerLabel}</div>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 12, left: 0, whiteSpace: "nowrap", fontSize: 38, color: "white", transform: `translateX(${-((f * speed) % (line.length * 16))}px)` }}>{line}{line}{line}</div>
      </div>
    </div>
  );
};

// opening sting / closing card
export const Sting: React.FC<{ tagline: string }> = ({ tagline }) => {
  const T = useTheme();
  const f = useCurrentFrame();
  const s = useSp(6, 11, 0.9);
  const sweep = interpolate(f, [20, 55], [-30, 130], clamp);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${T.wall}, ${T.navy} 65%)`, justifyContent: "center", alignItems: "center" }}>
      {[0, 1, 2].map((i) => {
        const r = interpolate((f + i * 20) % 60, [0, 60], [200, 1400]);
        return <div key={i} style={{ position: "absolute", width: r, height: r, borderRadius: 9999, border: `3px solid ${T.red2}`, opacity: interpolate(r, [200, 1400], [0.6, 0]) }} />;
      })}
      <div style={{ position: "relative", transform: `scale(${interpolate(s, [0, 1], [2.2, 1])})`, opacity: s }}>
        <Img src={staticFile(T.logo ?? "btl/logo.png")} style={{ width: 900 }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, transparent ${sweep - 15}%, rgba(255,255,255,.6) ${sweep}%, transparent ${sweep + 15}%)`, mixBlendMode: "overlay" }} />
      </div>
      <div style={{ marginTop: 20, fontFamily: BN, fontWeight: 700, fontSize: 52, color: "white", opacity: interpolate(f, [40, 55], [0, 1], clamp) }}>{tagline}</div>
    </AbsoluteFill>
  );
};

// ---------- story runner ----------
export type Segment = { vo: string; voLen: number; label: string; headline: string; zoom: number; visual: React.FC; breaking?: boolean };
export type StoryProps = { segments: Segment[]; ticker: string[]; date: string; music: string; tagline: string; outro: React.FC; theme?: Theme };
export const INTRO = 120, GAP = 22, OUTRO = 150;
export const storyLen = (segs: Segment[]) => INTRO + segs.reduce((a, s) => a + s.voLen + GAP, 0) + OUTRO;

export const NewsStory: React.FC<StoryProps> = ({ theme = NEWS_THEME, ...rest }) => <ThemeCtx.Provider value={theme}><StoryBody {...rest} /></ThemeCtx.Provider>;

const StoryBody: React.FC<Omit<StoryProps, "theme">> = ({ segments, ticker, date, music, tagline, outro: Outro }) => {
  const f = useCurrentFrame();
  let t = INTRO;
  const starts = segments.map((s) => { const a = t; t += s.voLen + GAP; return a; });
  const end = t;
  const total = end + OUTRO;
  const cur = Math.max(0, starts.filter((s) => f >= s).length - 1);
  const vol = (fr: number) => {
    const inVo = segments.some((s, i) => fr >= starts[i] + 6 && fr < starts[i] + 6 + s.voLen);
    return (fr < INTRO || fr > end ? 0.55 : inVo ? 0.12 : 0.3) * interpolate(fr, [0, 10, total - 40, total], [0, 1, 1, 0], clamp);
  };
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={INTRO + 10}><Sting tagline={tagline} /></Sequence>
      <Sfx at={0} src="btlsfx/sting.mp3" vol={0.7} />
      {segments.map((s, i) => {
        const V = s.visual;
        const len = s.voLen + GAP;
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={len + 8}>
            <SegmentShot zoom={s.zoom} len={len}><V /></SegmentShot>
            {s.breaking && <Sequence durationInFrames={75}><Breaking len={75} /></Sequence>}
            {s.breaking && <Sfx at={0} src="btlsfx/alert.mp3" vol={0.6} />}
            <Sequence from={6} durationInFrames={s.voLen + 4}><Audio src={staticFile(s.vo)} /></Sequence>
          </Sequence>
        );
      })}
      {f >= INTRO && f < end && (
        <>
          <LogoBug />
          <LiveBug date={date} />
          <Sequence key={cur} from={starts[cur]} durationInFrames={segments[cur].voLen + GAP}><Headline label={segments[cur].label} text={segments[cur].headline} /></Sequence>
          <Ticker items={ticker} />
        </>
      )}
      <Sequence from={end} durationInFrames={OUTRO}><Outro /></Sequence>
      <Sfx at={end} src="btlsfx/sting.mp3" vol={0.6} />
      <Audio src={staticFile(music)} volume={vol} />
    </AbsoluteFill>
  );
};

// each segment: studio with the visual on the wall; the wall eases into `zoom`
const SegmentShot: React.FC<{ zoom: number; len: number; children: React.ReactNode }> = ({ zoom, len, children }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 24], [Math.max(0, zoom - 0.25), zoom], { ...clamp, easing: ease });
  const o = interpolate(f, [0, 8, len, len + 8], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}><Studio zoom={z}>{children}</Studio></AbsoluteFill>;
};
