// JSON-driven 16:9 explainer (~2 min) for the overnight batch: Colours of Bangladesh (theme "cob") and Dream Group (theme "dream").
// Each topic file in src/overnight/topics.json = { id, theme, scenes: Scene[] }; VO per scene in public/ov/<id>/NN.mp3, lengths in ov-durations.json.
// Honesty rules (cob-motion-style): every fact scene carries `src`; symbolic visuals carry `note`; never name private people.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { LAND } from "../dots";
import { BN, bn } from "../news/NewsKit";
import { INK, MUTE, AMBER, HEAD, T, Grain } from "../investigation/HoneyTrap";
import TOPICS from "./topics.json";
import DUR from "./ov-durations.json";

export type Num = { v: number; dec?: number; pre?: string; suf?: string; raw?: boolean };
export type Scene =
  | { k: "big"; vo: string; num: Num; label: string; sub?: string; src?: string }
  | { k: "title"; vo: string; kicker: string; title: string; sub?: string }
  | { k: "bars"; vo: string; title: string; rows: [string, number][]; unit?: string; pre?: string; dec?: number; src?: string }
  | { k: "compare"; vo: string; title: string; a: [string, Num]; b: [string, Num]; note?: string; src?: string }
  | { k: "flow"; vo: string; title: string; steps: [string, string][]; src?: string }
  | { k: "list"; vo: string; title: string; items: string[]; src?: string; note?: string }
  | { k: "map"; vo: string; title: string; from: [string, number, number]; to: [string, number, number][]; src?: string }
  | { k: "quote"; vo: string; text: string; by: string; src?: string }
  | { k: "close"; vo: string; text: string; cta: string; src?: string };
export type Topic = { id: string; theme: "cob" | "dream"; title: string; scenes: Scene[] };

export const THEMES = {
  cob: { accent: "#e0142b", accent2: "#ff4d5e", tint: "rgba(224,20,43,.22)", logo: "cob/logo-round.png", bug: "cob/logo-light.png", tag: "অনুসন্ধান", handle: "কালারস অব বাংলাদেশ · @coloursofbangladesh" },
  dream: { accent: "#e3262f", accent2: "#ffb020", tint: "rgba(30,90,200,.25)", logo: "pb/dream-logo.png", bug: "pb/dream-logo.png", tag: "প্রবাসী গাইড", handle: "ড্রিম ইন্টারন্যাশনাল · dreamintcs.com" },
};
type Th = (typeof THEMES)["cob"];
export const ThemeCtx = React.createContext<Th>(THEMES.cob);
export const useTh = () => React.useContext(ThemeCtx);
export const fmt = (n: Num, p = 1) => n.raw ? `${n.pre ?? ""}${bn(Math.round(n.v * p))}${n.suf ?? ""}` : `${n.pre ?? ""}${bn((n.dec ? (n.v * p).toFixed(n.dec) : Math.round(n.v * p).toLocaleString("en-IN")))}${n.suf ?? ""}`;
const GAP = 18;
export const sceneLens = (t: Topic) => t.scenes.map((_, i) => Math.round(((DUR as Record<string, number>)[`${t.id}/${String(i + 1).padStart(2, "0")}`] ?? 6) * 30) + GAP);
export const topicLen = (t: Topic) => sceneLens(t).reduce((a, b) => a + b, 0) + 30;
export const TOPIC_LIST = TOPICS as unknown as Topic[];

export const Bg: React.FC = () => {
  const f = useCurrentFrame();
  const th = useTh();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1100px 700px at ${70 + Math.sin(f / 90) * 6}% 30%, ${th.tint}, transparent 62%), linear-gradient(160deg, #142229, ${INK} 70%)` }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "64px 64px", transform: `translateY(${(f * 0.4) % 64}px)` }} />
    </AbsoluteFill>
  );
};
export const Head: React.FC<{ text: string; delay?: number; size?: number; color?: string }> = ({ text, delay = 0, size = 64, color = "white" }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - delay, fps: 30, config: { damping: 15 } });
  return <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: size, color, lineHeight: 1.15, opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>{text}</div>;
};
export const Src: React.FC<{ text?: string }> = ({ text }) => {
  const th = useTh();
  return text ? <div style={{ position: "absolute", right: 48, bottom: 44, maxWidth: 1300, fontFamily: BN, fontWeight: 600, fontSize: 24, color: "rgba(255,255,255,.78)", background: "rgba(0,0,0,.45)", padding: "6px 16px", borderRadius: 6, borderLeft: `4px solid ${th.accent}` }}>সূত্র: {text}</div> : null;
};
export const Note: React.FC<{ text?: string }> = ({ text }) => (text ? <div style={{ position: "absolute", right: 48, top: 44, fontFamily: BN, fontWeight: 700, fontSize: 24, color: AMBER, border: `2px solid ${AMBER}`, padding: "4px 14px", borderRadius: 6, background: "rgba(0,0,0,.4)" }}>{text}</div> : null);
export const Bug: React.FC = () => {
  const th = useTh();
  return (
    <div style={{ position: "absolute", left: 48, top: 36, display: "flex", alignItems: "center", gap: 16, zIndex: 5 }}>
      <div style={{ background: "rgba(0,0,0,.35)", padding: "6px 10px", borderRadius: 8 }}><Img src={staticFile(th.bug)} style={{ height: 52 }} /></div>
      <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 24, color: "white", background: th.accent, padding: "4px 14px", borderRadius: 4 }}>{th.tag}</span>
    </div>
  );
};

// ---------- scenes ----------
const Big: React.FC<{ s: Extract<Scene, { k: "big" }>; len: number }> = ({ s }) => {
  const f = useCurrentFrame();
  const th = useTh();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 120px" }}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 210, color: AMBER, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{fmt(s.num, T(f, 8, 80))}</div>
      <div style={{ marginTop: 30 }}><Head text={s.label} delay={40} size={66} /></div>
      {s.sub && <div style={{ marginTop: 18 }}><Head text={s.sub} delay={90} size={40} color={th.accent2} /></div>}
      <Src text={s.src} />
    </AbsoluteFill>
  );
};
const Title: React.FC<{ s: Extract<Scene, { k: "title" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const sp = spring({ frame: f - 4, fps: 30, config: { damping: 13 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 140px" }}>
      <div style={{ transform: `scale(${sp})`, opacity: sp }}><Img src={staticFile(th.logo)} style={{ height: 200 }} /></div>
      <div style={{ marginTop: 24, fontFamily: BN, fontWeight: 700, fontSize: 34, color: "white", background: th.accent, padding: "6px 26px", borderRadius: 6, opacity: T(f, 14, 26) }}>{s.kicker}</div>
      <div style={{ marginTop: 24 }}><Head text={s.title} delay={24} size={110} /></div>
      {s.sub && <div style={{ marginTop: 12 }}><Head text={s.sub} delay={56} size={46} color={MUTE} /></div>}
    </AbsoluteFill>
  );
};
const Bars: React.FC<{ s: Extract<Scene, { k: "bars" }>; len: number }> = ({ s, len }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const max = Math.max(...s.rows.map((r) => r[1]));
  const step = Math.max(12, Math.min(50, (len * 0.6) / s.rows.length));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 160 }}><Head text={s.title} size={60} /></div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 290 }}>
        {s.rows.map(([l, v], i) => {
          const at = 20 + i * step, p = T(f, at, at + 40);
          return (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 22, opacity: T(f, at - 6, at + 6) }}>
              <div style={{ width: 430, fontFamily: BN, fontWeight: 700, fontSize: 36, color: "white", textAlign: "right" }}>{l}</div>
              <div style={{ height: 54, width: Math.max(6, 900 * (v / max) * p), background: i === 0 ? th.accent : AMBER, borderRadius: 6 }} />
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 48, color: "white", fontVariantNumeric: "tabular-nums" }}>{fmt({ v, dec: s.dec, pre: s.pre }, p)}{s.unit ? <span style={{ fontSize: 30, color: MUTE }}> {s.unit}</span> : null}</div>
            </div>
          );
        })}
      </div>
      <Src text={s.src} />
    </AbsoluteFill>
  );
};
const Compare: React.FC<{ s: Extract<Scene, { k: "compare" }>; len: number }> = ({ s, len }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const b = Math.round(len * 0.4);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 160 }}><Head text={s.title} size={60} /></div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 330, display: "flex", gap: 40 }}>
        {[[s.a, 20, MUTE], [s.b, b, th.accent2]].map(([[l, n], at, col], i) => {
          const sp = spring({ frame: f - (at as number), fps: 30, config: { damping: 14 } });
          return (
            <div key={i} style={{ flex: 1, padding: "40px 44px", borderRadius: 20, background: "rgba(14,23,28,.92)", border: `2px solid ${i ? th.accent : "rgba(255,255,255,.12)"}`, opacity: sp, transform: `translateY(${(1 - sp) * 60}px)` }}>
              <div style={{ fontFamily: BN, fontSize: 36, color: MUTE }}>{l as string}</div>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 120, color: col as string, lineHeight: 1.1 }}>{fmt(n as Num, T(f, at as number, (at as number) + 50))}</div>
            </div>
          );
        })}
      </div>
      {s.note && <div style={{ position: "absolute", left: 110, top: 720 }}><Head text={s.note} delay={b + 50} size={52} color={AMBER} /></div>}
      <Src text={s.src} />
    </AbsoluteFill>
  );
};
const Flow: React.FC<{ s: Extract<Scene, { k: "flow" }>; len: number }> = ({ s, len }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const n = s.steps.length, W = 1700 / n, Y = 560;
  const step = (len * 0.7) / n;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 160 }}><Head text={s.title} size={60} /></div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {s.steps.slice(1).map((_, i) => {
          const x1 = 110 + W * i + W / 2 + 90, x2 = 110 + W * (i + 1) + W / 2 - 90;
          const p = T(f, 20 + step * (i + 1) - 20, 20 + step * (i + 1));
          return <line key={i} x1={x1} y1={Y} x2={x1 + (x2 - x1) * p} y2={Y} stroke={AMBER} strokeWidth={6} strokeDasharray="14 10" strokeDashoffset={-f * 2} />;
        })}
      </svg>
      {s.steps.map(([t, sub], i) => {
        const sp = spring({ frame: f - (20 + step * i), fps: 30, config: { damping: 13 } });
        return (
          <div key={t} style={{ position: "absolute", left: 110 + W * i, top: Y - 90, width: W, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", opacity: sp, transform: `scale(${0.7 + 0.3 * sp})` }}>
            <div style={{ width: 180, height: 180, borderRadius: 999, background: "rgba(14,23,28,.95)", border: `5px solid ${i === n - 1 ? th.accent2 : AMBER}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 90, color: "white" }}>{bn(i + 1)}</div>
            <div style={{ marginTop: 18, fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: "white", padding: "0 10px" }}>{t}</div>
            <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 28, color: MUTE, padding: "0 16px" }}>{sub}</div>
          </div>
        );
      })}
      <Src text={s.src} />
    </AbsoluteFill>
  );
};
const List: React.FC<{ s: Extract<Scene, { k: "list" }>; len: number }> = ({ s, len }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const step = (len * 0.75) / s.items.length;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 160 }}><Head text={s.title} size={60} /></div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 290, display: "flex", flexDirection: "column", gap: 20 }}>
        {s.items.map((t, i) => {
          const sp = spring({ frame: f - (16 + step * i), fps: 30, config: { damping: 15 } });
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 24, padding: "20px 30px", borderRadius: 16, background: "rgba(14,23,28,.92)", border: "1px solid rgba(255,255,255,.12)", opacity: sp, transform: `translateX(${(1 - sp) * -60}px)` }}>
              <span style={{ width: 52, height: 52, flex: "none", borderRadius: 12, background: th.accent, color: "white", fontFamily: HEAD, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{bn(i + 1)}</span>
              <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: "white", lineHeight: 1.3 }}>{t}</span>
            </div>
          );
        })}
      </div>
      <Note text={s.note} />
      <Src text={s.src} />
    </AbsoluteFill>
  );
};
const MapS: React.FC<{ s: Extract<Scene, { k: "map" }>; len: number }> = ({ s, len }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const pts = [s.from, ...s.to];
  const lats = pts.map((p) => p[1]), lngs = pts.map((p) => p[2]);
  const pad = 10, x0 = Math.min(...lngs) - pad * 1.6, x1 = Math.max(...lngs) + pad * 1.6, cy = (Math.max(...lats) + Math.min(...lats)) / 2;
  const sx = 1920 / (x1 - x0), y0 = cy + (1080 / sx) / 2;
  const proj = (la: number, lo: number): [number, number] => [(lo - x0) * sx, (y0 - la) * sx];
  const A = proj(s.from[1], s.from[2]);
  const step = (len * 0.6) / s.to.length;
  const r = Math.max(4, Math.min(14, sx * 0.45));
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {LAND.map(([la, lo], i) => { const [x, y] = proj(la, lo); return x > -20 && x < 1940 && y > -20 && y < 1100 ? <circle key={i} cx={x} cy={y} r={r} fill="rgba(255,255,255,.1)" /> : null; })}
        {s.to.map(([n, la, lo], i) => {
          const B = proj(la, lo);
          const d = `M ${A[0]} ${A[1]} Q ${(A[0] + B[0]) / 2} ${Math.min(A[1], B[1]) - 160} ${B[0]} ${B[1]}`;
          const at = 20 + i * step, p = T(f, at, at + 40), ev = evolvePath(p, d);
          const pt = getPointAtLength(d, Math.max(0.1, p * getLength(d)));
          return (
            <g key={n}>
              <path d={d} stroke={th.accent2} strokeWidth={4} fill="none" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
              {p > 0 && p < 1 && <circle cx={pt.x} cy={pt.y} r={8} fill={AMBER} />}
              {p >= 1 && <><circle cx={B[0]} cy={B[1]} r={12} fill={th.accent} stroke="white" strokeWidth={3} /><text x={B[0] + 18} y={B[1] - 14} fontFamily={HEAD} fontWeight={800} fontSize={40} fill="white">{n}</text></>}
            </g>
          );
        })}
        <circle cx={A[0]} cy={A[1]} r={14} fill="#006a4e" stroke="white" strokeWidth={4} />
        <text x={A[0] - 60} y={A[1] + 52} fontFamily={HEAD} fontWeight={800} fontSize={36} fill="white">{s.from[0]}</text>
      </svg>
      <div style={{ position: "absolute", left: 110, top: 160 }}><Head text={s.title} size={60} /></div>
      <Src text={s.src} />
    </AbsoluteFill>
  );
};
const Quote: React.FC<{ s: Extract<Scene, { k: "quote" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const th = useTh();
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 160px" }}>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 200, color: th.accent, lineHeight: 0.6, opacity: T(f, 4, 14) }}>“</div>
      <Head text={s.text} delay={10} size={68} />
      <div style={{ marginTop: 26, fontFamily: BN, fontWeight: 700, fontSize: 36, color: AMBER, opacity: T(f, 50, 64) }}>— {s.by}</div>
      <Src text={s.src} />
    </AbsoluteFill>
  );
};
const Close: React.FC<{ s: Extract<Scene, { k: "close" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const sp = spring({ frame: f - 4, fps: 30, config: { damping: 13 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 140px" }}>
      <div style={{ transform: `scale(${sp})` }}><Img src={staticFile(th.logo)} style={{ height: 180 }} /></div>
      <div style={{ marginTop: 36 }}><Head text={s.text} delay={20} size={60} /></div>
      <div style={{ marginTop: 26, fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: AMBER, opacity: T(f, 60, 75) }}>{s.cta}</div>
      <div style={{ marginTop: 30, fontFamily: BN, fontWeight: 600, fontSize: 30, color: MUTE, opacity: T(f, 80, 95) }}>{th.handle}</div>
      {s.src && <div style={{ position: "absolute", bottom: 40, left: 120, right: 120, fontFamily: BN, fontSize: 22, color: MUTE }}>সূত্র: {s.src}</div>}
    </AbsoluteFill>
  );
};

export const Body: React.FC<{ s: Scene; len: number }> = ({ s, len }) => {
  switch (s.k) {
    case "big": return <Big s={s} len={len} />;
    case "title": return <Title s={s} />;
    case "bars": return <Bars s={s} len={len} />;
    case "compare": return <Compare s={s} len={len} />;
    case "flow": return <Flow s={s} len={len} />;
    case "list": return <List s={s} len={len} />;
    case "map": return <MapS s={s} len={len} />;
    case "quote": return <Quote s={s} />;
    case "close": return <Close s={s} />;
  }
};
const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, 10, len - 8, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
};

export const Explainer: React.FC<{ id: string }> = ({ id }) => {
  const t = TOPIC_LIST.find((x) => x.id === id)!;
  const th = THEMES[t.theme];
  const lens = sceneLens(t);
  const starts = lens.reduce<number[]>((a, d, i) => (a.push(i ? a[i - 1] + lens[i - 1] : 0), a), []);
  const total = topicLen(t);
  const f = useCurrentFrame();
  const showBug = t.scenes[0] && f > lens[0] + lens[1] && f < starts[starts.length - 1];
  return (
    <ThemeCtx.Provider value={th}>
      <AbsoluteFill style={{ background: INK }}>
        <Bg />
        {t.scenes.map((s, i) => (
          <Sequence key={i} from={starts[i]} durationInFrames={lens[i] + 8}>
            <Fade len={lens[i] + 8}><Body s={s} len={lens[i]} /></Fade>
            <Sequence from={6}><Audio src={staticFile(`ov/${t.id}/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
          </Sequence>
        ))}
        {showBug && <Bug />}
        <Grain />
        <Audio src={staticFile(t.theme === "cob" ? "gambmusic.mp3" : "dgmusic.mp3")} loop volume={(fr) => 0.18 * interpolate(fr, [0, 15, total - 40, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};
