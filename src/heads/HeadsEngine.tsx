// Heads International motion-graphics engine: one scene list drives both the 16:9 film and the 9:16 reel.
// Videos: "heads" (company promo) and "serbia" (Serbia work-visa promo). VO = Tanvir on eleven_v4.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import LANDPTS from "../land.json";
import { Flag as QEFlag } from "../QatarEurope";
import DUR from "./heads-durations.json";

const FPS = 30, LEAD = 10, PAD = 0.55;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });

export const INK = "#0A0B1F", NAVY = "#14163A", MAG = "#FF1FA8", MAG2 = "#FF6BCB", VIO = "#7B5CFF", GOLD = "#FFC94A", WHITE = "#F7F5FF", DIM = "rgba(247,245,255,0.66)";
const DISPLAY = "'Anek Bangla', 'Hind Siliguri', sans-serif";
const BODY = "'Hind Siliguri', sans-serif";
const LATIN = "Montserrat, 'Hind Siliguri', sans-serif";

/* ---------------- flags (extends the QatarEurope set) ---------------- */
const Flag: React.FC<{ cc: string; w: number }> = ({ cc, w }) => {
  const h = (w * 2) / 3;
  const box = (c: React.ReactNode) => <svg width={w} height={h} viewBox="0 0 30 20" preserveAspectRatio="none" style={{ borderRadius: w * 0.06, boxShadow: "0 8px 24px rgba(0,0,0,0.45)", display: "block" }}>{c}</svg>;
  if (cc === "bd") return box(<><rect width="30" height="20" fill="#006A4E" /><circle cx="13.5" cy="10" r="6" fill="#F42A41" /></>);
  if (cc === "hr") return box(<><rect width="30" height="7" fill="#FF0000" /><rect y="6.6" width="30" height="7" fill="#fff" /><rect y="13.3" width="30" height="6.7" fill="#171796" /><rect x="12" y="5" width="6" height="7" fill="#fff" stroke="#FF0000" strokeWidth="0.6" /></>);
  if (cc === "ae") return box(<><rect width="30" height="7" fill="#00732F" /><rect y="6.6" width="30" height="7" fill="#fff" /><rect y="13.3" width="30" height="6.7" fill="#000" /><rect width="8" height="20" fill="#FF0000" /></>);
  if (cc === "kw") return box(<><rect width="30" height="7" fill="#007A3D" /><rect y="6.6" width="30" height="7" fill="#fff" /><rect y="13.3" width="30" height="6.7" fill="#CE1126" /><polygon points="0,0 8,6.6 8,13.3 0,20" fill="#000" /></>);
  if (cc === "om") return box(<><rect width="30" height="20" fill="#DB161B" /><rect x="8" width="22" height="7" fill="#fff" /><rect x="8" y="13.3" width="22" height="6.7" fill="#008000" /></>);
  if (cc === "bh") return box(<><rect width="30" height="20" fill="#CE1126" /><polygon points={"0,0 8,0 " + Array.from({ length: 5 }, (_, i) => `11,${i * 4 + 2} 8,${i * 4 + 4}`).join(" ") + " 0,20"} fill="#fff" /></>);
  return <QEFlag cc={cc} w={w} />;
};

/* ---------------- background ---------------- */
const Bg: React.FC = () => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const a = f * 0.006;
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: W * 0.9, height: W * 0.9, borderRadius: "50%", left: W * 0.45 + Math.sin(a) * 120, top: -W * 0.35 + Math.cos(a) * 80, background: `radial-gradient(circle, ${MAG}38, ${MAG}00 62%)`, filter: "blur(30px)" }} />
      <div style={{ position: "absolute", width: W * 0.8, height: W * 0.8, borderRadius: "50%", left: -W * 0.3 + Math.cos(a) * 100, top: H * 0.45 + Math.sin(a * 1.3) * 90, background: `radial-gradient(circle, ${VIO}30, ${VIO}00 62%)`, filter: "blur(30px)" }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "72px 72px", backgroundPosition: `0 ${f * 0.5}px`, maskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)" }} />
    </AbsoluteFill>
  );
};

/* ---------------- dot map with routes ---------------- */
type Pt = { lat: number; lng: number; label?: string; cc?: string };
const MapRoutes: React.FC<{ from: Pt[]; to: Pt[]; view: [number, number, number, number]; delay?: number; hub?: boolean }> = ({ from, to, view, delay = 0, hub }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const [L0, L1, B0, B1] = view;
  const sc = Math.min(W / (L1 - L0), H / (B1 - B0)) * 0.92;
  const ox = (W - (L1 - L0) * sc) / 2, oy = (H - (B1 - B0) * sc) / 2;
  const X = (lng: number) => ox + (lng - L0) * sc, Y = (lat: number) => oy + (B1 - lat) * sc;
  const dots = (LANDPTS as [number, number][]).filter(([la, lo]) => lo >= L0 - 2 && lo <= L1 + 2 && la >= B0 - 2 && la <= B1 + 2);
  const ds = Math.max(2.2, sc * 0.42);
  const pairs: [Pt, Pt][] = [];
  from.forEach((a) => to.forEach((b) => pairs.push([a, b])));
  return (
    <AbsoluteFill style={{ opacity: lerp(f, delay, delay + 15) }}>
      <svg width={W} height={H}>
        {dots.map(([la, lo], i) => <circle key={i} cx={X(lo)} cy={Y(la)} r={ds} fill="rgba(247,245,255,0.17)" />)}
        {pairs.map(([a, b], i) => {
          const p = lerp(f, delay + 10 + i * 6, delay + 40 + i * 6);
          const x1 = X(a.lng), y1 = Y(a.lat), x2 = X(b.lng), y2 = Y(b.lat);
          const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - Math.hypot(x2 - x1, y2 - y1) * 0.28;
          const t = ((f - delay) * 0.012 + i * 0.17) % 1;
          const bx = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * mx + t * t * x2, by = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * my + t * t * y2;
          return (
            <g key={i}>
              <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke={MAG} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={0.9} style={{ filter: `drop-shadow(0 0 6px ${MAG})` }} />
              {p >= 1 && <circle cx={bx} cy={by} r={5} fill={WHITE} style={{ filter: `drop-shadow(0 0 8px ${MAG2})` }} />}
            </g>
          );
        })}
        {[...from, ...to].map((c, i) => {
          const isTo = i >= from.length;
          const s = spring({ frame: f - delay - (isTo ? 30 : 4) - (i % 8) * 3, fps: FPS, config: { damping: 12 } });
          return <g key={`c${i}`} transform={`translate(${X(c.lng)},${Y(c.lat)}) scale(${s})`}>
            <circle r={isTo && hub ? 18 + Math.sin(f / 6) * 4 : 9} fill={isTo ? MAG : GOLD} opacity={0.95} />
            <circle r={(f % 45) * (isTo ? 1.2 : 0.7)} fill="none" stroke={isTo ? MAG : GOLD} strokeWidth={2} opacity={1 - (f % 45) / 45} />
          </g>;
        })}
      </svg>
      {[...from, ...to].map((c, i) => c.label && (
        <div key={`l${i}`} style={{ position: "absolute", ...(X(c.lng) > W * 0.78 ? { right: W - X(c.lng) + 14 } : { left: X(c.lng) + 14 }), top: Y(c.lat) - 46, display: "flex", alignItems: "center", gap: 10, opacity: lerp(f, delay + 20 + i * 3, delay + 34 + i * 3), fontFamily: DISPLAY, fontWeight: 700, fontSize: W > H ? 30 : 34, color: WHITE, textShadow: "0 3px 14px rgba(0,0,0,0.9)", whiteSpace: "nowrap" }}>
          {c.cc && <Flag cc={c.cc} w={W > H ? 40 : 46} />}{c.label}
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ---------------- text + cards ---------------- */
const Rise: React.FC<{ d?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ d = 0, children, style }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - d, fps: FPS, config: { damping: 16 } });
  return <div style={{ opacity: s, transform: `translateY(${(1 - s) * 40}px)`, ...style }}>{children}</div>;
};

const Title: React.FC<{ kicker?: string; lines: string[]; hl?: number; size?: number; d?: number; align?: "left" | "center" }> = ({ kicker, lines, hl = -1, size, d = 0, align = "left" }) => {
  const { width: W, height: H } = useVideoConfig();
  const V = H > W;
  const fs = size ?? (V ? 96 : 104);
  return (
    <div style={{ textAlign: align }}>
      {kicker && <Rise d={d}><div style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: DISPLAY, fontWeight: 600, fontSize: V ? 34 : 30, color: MAG2 }}><span style={{ width: 46, height: 4, borderRadius: 2, background: MAG, display: "inline-block" }} />{kicker}</div></Rise>}
      {lines.map((l, i) => (
        <Rise key={i} d={d + 6 + i * 7}><div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: fs, lineHeight: 1.12, color: i === hl ? MAG : WHITE, marginTop: i === 0 ? 14 : 0, textShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>{l}</div></Rise>
      ))}
    </div>
  );
};

const ICONS: Record<string, string> = {
  visa: "M4 3h11l5 5v13H4z M15 3v5h5 M8 13h8 M8 17h6",
  team: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M2 21v-1a6 6 0 0 1 12 0v1 M17 11a3 3 0 1 0 0-6 M22 21v-1a5 5 0 0 0-4-4.9",
  plane: "M2 16l20-7-3-3-9 3-5-3-2 1 4 4-4 1-1 2 4 0 3 3 1-1z",
  train: "M22 10L12 5 2 10l10 5 10-5z M6 12v5c3 2 9 2 12 0v-5",
  build: "M3 21h18 M6 21V9l6-4 6 4v12 M10 21v-5h4v5",
  factory: "M2 21V10l6 3V9l6 3V7l8 4v10z",
  hotel: "M3 21V5h18v16 M8 9h2 M14 9h2 M8 13h2 M14 13h2 M10 21v-4h4v4",
  leaf: "M5 19c0-8 6-14 15-14 0 9-6 15-14 15 M5 19l7-7",
  code: "M8 8l-5 4 5 4 M16 8l5 4-5 4 M14 4l-4 16",
  passport: "M5 2h14v20H5z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M9 17h6",
  photo: "M3 7h4l2-3h6l2 3h4v13H3z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  cv: "M6 2h9l5 5v15H6z M9 12h8 M9 16h8 M9 8h3",
  check: "M4 12l5 5L20 6",
};
const Icon: React.FC<{ k: string; s: number; c?: string }> = ({ k, s, c = WHITE }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[k]} /></svg>
);

const Cards: React.FC<{ items: { k: string; t: string; s?: string }[]; d?: number; cols?: number }> = ({ items, d = 0, cols }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const V = H > W;
  const n = cols ?? (V ? 2 : items.length > 4 ? 3 : items.length);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`, gap: V ? 26 : 30 }}>
      {items.map((it, i) => {
        const s = spring({ frame: f - d - i * 8, fps: FPS, config: { damping: 14 } });
        const glow = interpolate(f - d - i * 8, [10, 22, 40], [0, 1, 0.35], clamp);
        return (
          <div key={i} style={{ background: `linear-gradient(160deg, ${NAVY}, #0E0F2A)`, border: `2px solid rgba(255,31,168,${0.25 + 0.6 * glow})`, borderRadius: 26, padding: V ? "34px 30px" : "36px 34px", transform: `translateY(${(1 - s) * 80}px) scale(${0.9 + 0.1 * s})`, opacity: s, boxShadow: `0 20px 60px rgba(0,0,0,0.45), 0 0 ${40 * glow}px rgba(255,31,168,0.35)` }}>
            <div style={{ width: V ? 92 : 88, height: V ? 92 : 88, borderRadius: 22, background: `linear-gradient(135deg, ${MAG}, ${VIO})`, display: "grid", placeItems: "center" }}><Icon k={it.k} s={V ? 50 : 48} /></div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: V ? 44 : 40, color: WHITE, marginTop: 22, lineHeight: 1.2 }}>{it.t}</div>
            {it.s && <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: V ? 28 : 25, color: DIM, marginTop: 8 }}>{it.s}</div>}
          </div>
        );
      })}
    </div>
  );
};

const Stats: React.FC<{ items: { n: number; suf: string; t: string }[]; d?: number }> = ({ items, d = 0 }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const V = H > W;
  return (
    <div style={{ display: "flex", flexDirection: V ? "column" : "row", gap: V ? 30 : 60 }}>
      {items.map((it, i) => {
        const v = Math.round(interpolate(f, [d + i * 8, d + i * 8 + 45], [0, it.n], { ...clamp, easing: Easing.out(Easing.cubic) }));
        return (
          <Rise key={i} d={d + i * 8} style={{ flex: 1 }}>
            <div style={{ fontFamily: LATIN, fontWeight: 800, fontSize: V ? 150 : 140, lineHeight: 1, color: WHITE }}>{v.toLocaleString("en-US")}<span style={{ color: MAG }}>{it.suf}</span></div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: V ? 40 : 36, color: DIM, marginTop: 8 }}>{it.t}</div>
          </Rise>
        );
      })}
    </div>
  );
};

const Steps: React.FC<{ items: string[]; d?: number; gap?: number }> = ({ items, d = 0, gap = 40 }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const V = H > W;
  const prog = interpolate(f, [d, d + gap * (items.length - 1) + 10], [0, 1], clamp);
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: V ? "column" : "row", gap: V ? 44 : 0, justifyContent: "space-between" }}>
      <div style={{ position: "absolute", background: "rgba(247,245,255,0.12)", ...(V ? { left: 54, top: 54, bottom: 54, width: 6 } : { top: 54, left: 60, right: 60, height: 6 }) }}>
        <div style={{ background: `linear-gradient(${V ? 180 : 90}deg, ${MAG}, ${VIO})`, ...(V ? { width: "100%", height: `${prog * 100}%` } : { height: "100%", width: `${prog * 100}%` }), boxShadow: `0 0 20px ${MAG}` }} />
      </div>
      {items.map((t, i) => {
        const s = spring({ frame: f - d - i * gap, fps: FPS, config: { damping: 12 } });
        return (
          <div key={i} style={{ display: "flex", flexDirection: V ? "row" : "column", alignItems: "center", gap: 22, width: V ? "auto" : `${100 / items.length}%`, position: "relative" }}>
            <div style={{ width: 114, height: 114, flex: "none", borderRadius: "50%", background: s > 0.5 ? `linear-gradient(135deg, ${MAG}, ${VIO})` : NAVY, border: `3px solid ${MAG}`, display: "grid", placeItems: "center", transform: `scale(${0.6 + 0.4 * s})`, fontFamily: LATIN, fontWeight: 800, fontSize: 48, color: WHITE, boxShadow: s > 0.5 ? `0 0 40px ${MAG}88` : "none" }}>{i + 1}</div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: V ? 46 : 36, color: WHITE, textAlign: V ? "left" : "center", opacity: s, lineHeight: 1.25, maxWidth: V ? 760 : 330 }}>{t}</div>
          </div>
        );
      })}
    </div>
  );
};

const Chips: React.FC<{ items: string[]; d?: number; every?: number }> = ({ items, d = 0, every = 9 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 22 }}>
      {items.map((t, i) => {
        const s = spring({ frame: f - d - i * every, fps: FPS, config: { damping: 12 } });
        return <div key={t} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, color: WHITE, padding: "16px 34px", borderRadius: 999, background: i % 2 ? `${VIO}33` : `${MAG}33`, border: `2px solid ${i % 2 ? VIO : MAG}`, transform: `scale(${s})`, opacity: s }}>{t}</div>;
      })}
    </div>
  );
};

const Logo: React.FC<{ w: number; d?: number }> = ({ w, d = 0 }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - d, fps: FPS, config: { damping: 14 } });
  const sweep = interpolate(f - d, [8, 30], [-30, 130], clamp);
  return (
    <div style={{ position: "relative", display: "inline-block", padding: "26px 40px", borderRadius: 28, background: "#FFFFFF", transform: `scale(${0.7 + 0.3 * s})`, opacity: s, boxShadow: `0 30px 90px rgba(255,31,168,0.35)`, overflow: "hidden" }}>
      <Img src={staticFile("heads/logo.png")} style={{ width: w, display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${sweep - 20}%, rgba(255,255,255,0.85) ${sweep}%, transparent ${sweep + 20}%)` }} />
    </div>
  );
};

const Contact: React.FC<{ d?: number; wa?: boolean }> = ({ d = 0, wa }) => {
  const { width: W, height: H } = useVideoConfig();
  const V = H > W;
  const row = (k: string, a: string, b: string, i: number) => (
    <Rise d={d + 10 + i * 9}><div style={{ display: "flex", alignItems: "center", gap: 24, padding: "22px 0", borderTop: i ? "1px solid rgba(247,245,255,0.12)" : "none" }}>
      <div style={{ width: 70, height: 70, borderRadius: 18, background: `${MAG}33`, border: `2px solid ${MAG}`, display: "grid", placeItems: "center", flex: "none" }}><Icon k={k} s={38} c={MAG2} /></div>
      <div><div style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: V ? 30 : 26, color: DIM }}>{a}</div><div style={{ fontFamily: k === "photo" ? LATIN : DISPLAY, fontWeight: 700, fontSize: V ? 48 : 42, color: WHITE }}>{b}</div></div>
    </div></Rise>
  );
  return (
    <div style={{ background: `linear-gradient(160deg, ${NAVY}EE, #0E0F2AEE)`, border: `2px solid ${MAG}66`, borderRadius: 30, padding: V ? "30px 40px" : "26px 44px", boxShadow: "0 30px 90px rgba(0,0,0,0.5)" }}>
      {row("build", "অফিস", "কানিজ প্লাজা, রুম ৩১০, কাজী ইলিয়াস রোড, সিলেট", 0)}
      {row("photo", wa ? "ফোন / হোয়াটসঅ্যাপ" : "ফোন", "01713-787963", 1)}
      {row("code", "ওয়েবসাইট", "headsint.website", 2)}
    </div>
  );
};

const FlagRow: React.FC<{ ccs: string[]; d?: number }> = ({ ccs, d = 0 }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const V = H > W;
  return <div style={{ display: "flex", gap: V ? 18 : 22, flexWrap: "wrap", marginTop: 26 }}>
    {ccs.map((c, i) => { const s = spring({ frame: f - d - i * 5, fps: FPS, config: { damping: 12 } }); return <div key={c} style={{ transform: `scale(${s})`, opacity: s }}><Flag cc={c} w={V ? 110 : 92} /></div>; })}
  </div>;
};

/* ---------------- scene definitions ---------------- */
const SYL: Pt = { lat: 24.9, lng: 91.87, label: "সিলেট", cc: "bd" };
const DEST: Pt[] = [
  { lat: 44.8, lng: 20.46, label: "সার্বিয়া", cc: "rs" }, { lat: 43.86, lng: 18.41, label: "বসনিয়া", cc: "ba" },
  { lat: 41.6, lng: 21.7, label: "উ. মেসিডোনিয়া", cc: "mk" }, { lat: 37.98, lng: 23.73, label: "গ্রিস", cc: "gr" },
  { lat: 42.7, lng: 25.3, label: "বুলগেরিয়া", cc: "bg" }, { lat: 45.8, lng: 16.0, label: "ক্রোয়েশিয়া", cc: "hr" },
];
const ORIGINS: Pt[] = [
  { lat: 23.8, lng: 90.4, label: "বাংলাদেশ", cc: "bd" }, { lat: 24.7, lng: 46.7, label: "সৌদি আরব", cc: "sa" },
  { lat: 25.3, lng: 51.5, cc: "qa" }, { lat: 25.2, lng: 55.3, cc: "ae" },
  { lat: 29.4, lng: 47.9, cc: "kw" }, { lat: 23.6, lng: 58.4, cc: "om" }, { lat: 26.2, lng: 50.6, cc: "bh" },
];
const BELGRADE: Pt = { lat: 44.8, lng: 20.46, label: "সার্বিয়া", cc: "rs" };

type SceneFn = (len: number, V: boolean) => React.ReactNode;
const Pad: React.FC<{ V: boolean; children: React.ReactNode; center?: boolean; top?: boolean }> = ({ V, children, center, top }) => (
  <AbsoluteFill style={{ padding: V ? "230px 80px 340px" : "110px 150px 150px", justifyContent: top ? "flex-start" : "center", alignItems: center ? "center" : "stretch" }}>{children}</AbsoluteFill>
);
const DimMap: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ opacity: 0.35 }}>{children}</AbsoluteFill>;

const HEADS: Record<string, SceneFn> = {
  hook: (_, V) => <><DimMap><MapRoutes from={[SYL]} to={DEST.slice(0, 1)} view={V ? [10, 95, -5, 60] : [-5, 100, 10, 58]} /></DimMap><Pad V={V} center><Title align="center" lines={["ইউরোপে কাজের স্বপ্ন?", "এখন আর দূরে নয়।"]} hl={1} size={V ? 104 : 120} /></Pad></>,
  intro: (_, V) => <Pad V={V} center><Logo w={V ? 640 : 560} d={4} /><div style={{ height: 50 }} /><Title align="center" lines={["ওয়ার্ক ভিসা ও", "ম্যানপাওয়ার সল্যুশন"]} hl={1} d={18} size={V ? 82 : 78} /></Pad>,
  dest: (_, V) => <><MapRoutes from={[SYL]} to={DEST} view={V ? [12, 32, 34, 50] : [2, 44, 33, 52]} hub /><AbsoluteFill style={{ padding: V ? "150px 70px" : "80px 120px" }}><Title kicker="গন্তব্য" lines={["ইউরোপের ৬টি দেশ"]} size={V ? 84 : 76} /></AbsoluteFill></>,
  services: (_, V) => <Pad V={V}><Title kicker="আমাদের সেবা" lines={["সব এক ছাদের নিচে"]} size={V ? 84 : 76} /><div style={{ height: 50 }} /><Cards d={18} cols={V ? 2 : 4} items={[{ k: "visa", t: "ওয়ার্ক ভিসা প্রসেসিং" }, { k: "team", t: "দক্ষ কর্মী নিয়োগ" }, { k: "plane", t: "এয়ার টিকেট" }, { k: "train", t: "প্রি-ডিপারচার ট্রেনিং" }]} /></Pad>,
  jobs: (_, V) => <Pad V={V}><Title kicker="কাজের খাত" lines={["আপনার দক্ষতা অনুযায়ী", "সঠিক কাজ"]} hl={1} size={V ? 84 : 80} /><div style={{ height: 50 }} /><Chips d={16} every={11} items={["কনস্ট্রাকশন", "ম্যানুফ্যাকচারিং", "হসপিটালিটি", "কৃষি", "আইটি"]} /></Pad>,
  trust: (_, V) => <Pad V={V}><Title kicker="কেন হেডস ইন্টারন্যাশনাল" lines={["আপনার সাফল্যই আমাদের লক্ষ্য"]} size={V ? 72 : 70} /><div style={{ height: 56 }} /><Stats d={90} items={[{ n: 5000, suf: "+", t: "সন্তুষ্ট ক্লায়েন্ট" }, { n: 10, suf: "+", t: "দেশ" }, { n: 100, suf: "%", t: "সাফল্যের হার" }]} /><div style={{ height: 40 }} /><Chips d={14} every={20} items={["সরাসরি নিয়োগকর্তা", "স্বচ্ছ খরচ", "২৪/৭ সাপোর্ট"]} /></Pad>,
  process: (_, V) => <Pad V={V}><Title kicker="কিভাবে কাজ করি" lines={["প্রতিটি ধাপে পাশে আছি"]} size={V ? 80 : 76} /><div style={{ height: V ? 70 : 90 }} /><Steps d={14} gap={36} items={["ফ্রি পরামর্শ", "কাগজপত্র", "ভিসা প্রসেসিং", "ফ্লাইট"]} /></Pad>,
  cta: (_, V) => <Pad V={V}><Title kicker="আজই যোগাযোগ করুন" lines={["ফ্রি পরামর্শ নিন"]} size={V ? 88 : 80} /><div style={{ height: 44 }} /><Contact d={10} /></Pad>,
  outro: (_, V) => <Pad V={V} center><Logo w={V ? 640 : 560} d={2} /><div style={{ height: 46 }} /><Title align="center" lines={["বিশ্বজুড়ে সুযোগের দরজা"]} d={16} size={V ? 70 : 64} /><Rise d={34}><div style={{ fontFamily: LATIN, fontWeight: 700, fontSize: V ? 46 : 40, color: MAG2, marginTop: 30, textAlign: "center" }}>headsint.website · 01713-787963</div></Rise></Pad>,
};

const SERBIA: Record<string, SceneFn> = {
  hook: (_, V) => <><MapRoutes from={ORIGINS} to={[BELGRADE]} view={V ? [14, 95, 8, 52] : [8, 98, 14, 52]} hub /><AbsoluteFill style={{ padding: V ? "150px 70px" : "80px 120px 150px", justifyContent: V ? "flex-start" : "flex-end" }}><Title kicker="বাংলাদেশ ও মধ্যপ্রাচ্য থেকে" lines={["এবার গন্তব্য সার্বিয়া"]} hl={0} size={V ? 86 : 80} /><FlagRow d={14} ccs={["bd", "sa", "qa", "ae", "kw", "om", "bh"]} /></AbsoluteFill></>,
  why: (_, V) => <Pad V={V}><Rise><Flag cc="rs" w={V ? 220 : 200} /></Rise><div style={{ height: 36 }} /><Title kicker="কেন সার্বিয়া" lines={["ইউরোপে কাজের", "নতুন সুযোগ"]} hl={1} d={6} /><div style={{ height: 40 }} /><Chips d={40} every={14} items={["কনস্ট্রাকশন", "ম্যানুফ্যাকচারিং", "কৃষি"]} /></Pad>,
  routes: (_, V) => <><DimMap><MapRoutes from={ORIGINS.slice(0, 4)} to={[BELGRADE]} view={V ? [14, 95, 8, 52] : [8, 98, 14, 52]} /></DimMap><Pad V={V} center><Logo w={V ? 560 : 480} d={4} /><div style={{ height: 40 }} /><Title align="center" lines={["শুরু থেকে শেষ পর্যন্ত", "পুরো প্রসেস আমাদের"]} hl={1} d={20} size={V ? 78 : 76} /></Pad></>,
  jobs: (_, V) => <Pad V={V}><Title kicker="যে কাজগুলো পাবেন" lines={["বৈধ ওয়ার্ক পারমিট"]} hl={0} size={V ? 84 : 78} /><div style={{ height: 50 }} /><Cards d={14} cols={V ? 1 : 3} items={[{ k: "build", t: "নির্মাণ শ্রমিক", s: "Construction" }, { k: "factory", t: "ফ্যাক্টরি ওয়ার্কার", s: "Manufacturing" }, { k: "leaf", t: "কৃষি কাজ", s: "Agriculture" }]} /></Pad>,
  docs: (_, V) => <Pad V={V}><Title kicker="শুরু করতে লাগবে" lines={["মাত্র তিনটি জিনিস"]} size={V ? 84 : 78} /><div style={{ height: 50 }} /><Cards d={12} cols={V ? 1 : 3} items={[{ k: "passport", t: "বৈধ পাসপোর্ট" }, { k: "photo", t: "ছবি" }, { k: "cv", t: "সিভি" }]} /><Rise d={110}><div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: V ? 42 : 38, color: MAG2, marginTop: 40 }}>বাকি কাগজপত্র আমরা গুছিয়ে দেব</div></Rise></Pad>,
  process: (_, V) => <Pad V={V}><Title kicker="প্রসেস" lines={["৪টি সহজ ধাপ"]} size={V ? 84 : 80} /><div style={{ height: V ? 70 : 90 }} /><Steps d={16} gap={70} items={["ফ্রি পরামর্শ", "জব অফার", "ওয়ার্ক পারমিট ও ভিসা", "ফ্লাইট ও ট্রেনিং"]} /></Pad>,
  trust: (_, V) => <Pad V={V}><Title kicker="হেডস ইন্টারন্যাশনাল" lines={["ভরসার নাম"]} size={V ? 84 : 80} /><div style={{ height: 56 }} /><Stats d={10} items={[{ n: 5000, suf: "+", t: "ক্লায়েন্ট" }, { n: 100, suf: "%", t: "সাফল্যের হার" }]} /><div style={{ height: 40 }} /><Chips d={60} every={18} items={["সরাসরি নিয়োগকর্তা", "স্বচ্ছ খরচ", "ভিসা গ্যারান্টি প্রোগ্রাম"]} /></Pad>,
  cta: (_, V) => <Pad V={V}><Title kicker="আজই" lines={["ফ্রি পরামর্শ নিন"]} hl={0} size={V ? 88 : 80} /><div style={{ height: 44 }} /><Contact d={10} wa /></Pad>,
  outro: (_, V) => <Pad V={V} center><Rise><Flag cc="rs" w={V ? 180 : 150} /></Rise><div style={{ height: 30 }} /><Logo w={V ? 600 : 520} d={8} /><div style={{ height: 40 }} /><Title align="center" lines={["সার্বিয়ায় আপনার নতুন শুরু"]} d={20} size={V ? 70 : 64} /></Pad>,
};

export const VIDEOS = { heads: { scenes: HEADS, order: ["hook", "intro", "dest", "services", "jobs", "trust", "process", "cta", "outro"] }, serbia: { scenes: SERBIA, order: ["hook", "why", "routes", "jobs", "docs", "process", "trust", "cta", "outro"] } };
type VidId = keyof typeof VIDEOS;

const timeline = (id: VidId) => {
  const durs = (DUR as Record<string, number[]>)[id];
  let at = 0;
  return VIDEOS[id].order.map((p, i) => { const len = Math.round((durs[i] + PAD) * FPS) + LEAD + (p === "outro" ? 50 : 0); const r = { p, i, from: at, len }; at += len; return r; });
};
export const headsLen = (id: VidId) => { const t = timeline(id); return t[t.length - 1].from + t[t.length - 1].len; };

const SUBS: Record<VidId, string[]> = {
  heads: ["ইউরোপে কাজের স্বপ্ন? সেই স্বপ্ন এখন আর দূরে নয়।", "হেডস ইন্টারন্যাশনাল। ইউরোপের ওয়ার্ক ভিসা আর ম্যানপাওয়ার সল্যুশনে, আপনার বিশ্বস্ত সঙ্গী।", "সার্বিয়া, বসনিয়া, উত্তর মেসিডোনিয়া, গ্রিস, বুলগেরিয়া আর ক্রোয়েশিয়া।", "ওয়ার্ক ভিসা প্রসেসিং, দক্ষ কর্মী নিয়োগ, এয়ার টিকেট, আর যাওয়ার আগে প্রশিক্ষণ।", "কনস্ট্রাকশন, ম্যানুফ্যাকচারিং, হসপিটালিটি, কৃষি আর আইটি।", "৫০০০+ সন্তুষ্ট ক্লায়েন্ট, শতভাগ সাফল্যের হার।", "ফ্রি পরামর্শ, কাগজপত্র, ভিসা প্রসেসিং, তারপর ফ্লাইট।", "কানিজ প্লাজা, কাজী ইলিয়াস রোড, সিলেট। ফোন: 01713-787963", "হেডস ইন্টারন্যাশনাল। বিশ্বজুড়ে সুযোগের দরজা।"],
  serbia: ["যেখানেই থাকুন, এবার গন্তব্য সার্বিয়া।", "কনস্ট্রাকশন, ম্যানুফ্যাকচারিং আর কৃষিতে এখন প্রচুর কর্মীর চাহিদা।", "বাংলাদেশ থেকে হোক, বা মধ্যপ্রাচ্য থেকে। পুরো প্রসেস আমরা সামলাব।", "নির্মাণ শ্রমিক, ফ্যাক্টরি ওয়ার্কার, কৃষি কাজ।", "লাগবে বৈধ পাসপোর্ট, ছবি আর সিভি।", "ফ্রি পরামর্শ → জব অফার → ওয়ার্ক পারমিট ও ভিসা → ফ্লাইট।", "৫০০০+ ক্লায়েন্ট, শতভাগ সাফল্যের হার, ভিসা গ্যারান্টি প্রোগ্রাম।", "ফোন / হোয়াটসঅ্যাপ: 01713-787963", "হেডস ইন্টারন্যাশনাল। সার্বিয়ায় আপনার নতুন শুরু।"],
};

const Sub: React.FC<{ t: string; len: number; V: boolean }> = ({ t, len, V }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [LEAD, LEAD + 8, len - 8, len], [0, 1, 1, 0], clamp);
  return <div style={{ position: "absolute", left: V ? 60 : 200, right: V ? 60 : 200, bottom: V ? 150 : 46, textAlign: "center", opacity: o }}>
    <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: V ? 40 : 32, lineHeight: 1.45, color: WHITE, background: "rgba(10,11,31,0.72)", padding: "6px 18px", borderRadius: 10, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{t}</span>
  </div>;
};

const Wipe: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 9], [0, 110], clamp);
  return <AbsoluteFill style={{ background: `linear-gradient(100deg, transparent ${x - 30}%, ${MAG} ${x - 10}%, ${VIO} ${x}%, transparent ${x + 1}%)`, opacity: f < 10 ? 0.9 : 0, pointerEvents: "none" }} />;
};

const Corner: React.FC<{ V: boolean }> = ({ V }) => (
  <div style={{ position: "absolute", right: V ? 50 : 60, top: V ? 70 : 44, background: "#fff", borderRadius: 14, padding: "10px 16px" }}>
    <Img src={staticFile("heads/logo.png")} style={{ width: V ? 180 : 160, display: "block" }} />
  </div>
);

export const HeadsVideo: React.FC<{ id: VidId }> = ({ id }) => {
  const { width: W, height: H } = useVideoConfig();
  const V = H > W;
  const T = timeline(id);
  const total = headsLen(id);
  const vo = T.map((s) => [s.from + LEAD, s.from + LEAD + Math.round((DUR as Record<string, number[]>)[id][s.i] * FPS)]);
  const musicVol = (f: number) => (vo.some(([a, b]) => f >= a - 6 && f <= b + 6) ? 0.17 : 0.4) * interpolate(f, [0, 15, total - 45, total], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Bg />
      <Audio src={staticFile(`${id}/music.mp3`)} volume={musicVol} />
      {T.map((s) => (
        <Sequence key={s.p} from={s.from} durationInFrames={s.len}>
          <SceneFade len={s.len}>{VIDEOS[id].scenes[s.p](s.len, V)}</SceneFade>
          <Sequence from={LEAD}><Audio src={staticFile(`${id}/vo/${String(s.i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
          <Audio src={staticFile(s.i === 0 ? "dgsfx/boom.mp3" : "dgsfx/whoosh.mp3")} volume={s.i === 0 ? 0.5 : 0.35} />
          {s.i > 0 && <Wipe />}
          {s.p !== "outro" && s.p !== "intro" && <Sub t={SUBS[id][s.i]} len={s.len} V={V} />}
        </Sequence>
      ))}
      {T.filter((s) => s.p !== "intro" && s.p !== "outro" && s.p !== "routes").map((s) => (
        <Sequence key={`c${s.p}`} from={s.from} durationInFrames={s.len}><Corner V={V} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};

const SceneFade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, 6, len - 6, len], [0, 1, 1, 0], clamp) }}>{children}</AbsoluteFill>;
};
