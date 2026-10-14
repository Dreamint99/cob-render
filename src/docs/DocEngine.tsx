// Long-form documentary engine (Colours of Bangladesh). One JSON per film in src/docs/films/<id>.json:
//   { id, theme, title, music?, paras: [{ v: Shot[] }] }  — paras[i] pairs with VO public/docs/<id>/vo/NN.mp3 (script in work/docs/<id>/script.json).
// Shots inside a paragraph split its VO time by `w` (weight, default 1). Explainer scene kinds (big/bars/list/flow/map/quote/compare/title/close)
// are reused as-is; new kinds: photo, ai, chapter, text, timeline, doc, clip.
// Honesty (cob-motion-style): photo/clip carry `credit`; ai shots always show the AI label; facts carry `src`.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { BN, bn } from "../news/NewsKit";
import { INK, MUTE, AMBER, HEAD, T } from "../investigation/HoneyTrap";
import { Body, Bg, Bug, Head, Src, Note, THEMES, ThemeCtx, useTh, type Scene } from "../overnight/Explainer";
import DUR from "./doc-durations.json";
import FILMS from "./films";
import { FxLayer, Fx } from "./fx";
import { Cine } from "./CineEngine";

type Shot =
  | (Scene & { w?: number })
  | { k: "photo"; img: string; credit: string; cap?: string; kb?: "in" | "out" | "left" | "right"; w?: number; pos?: string; fx?: Fx }
  | { k: "ai"; img: string; cap?: string; kb?: "in" | "out" | "left" | "right"; w?: number; pos?: string; fx?: Fx }
  | { k: "chapter"; n: number; title: string; sub?: string; w?: number }
  | { k: "text"; text: string; sub?: string; hl?: string; src?: string; w?: number }
  | { k: "timeline"; title: string; items: [string, string][]; src?: string; w?: number }
  | { k: "doc"; title: string; lines: string[]; stamp?: string; note?: string; src?: string; mono?: boolean; w?: number }
  | { k: "clip"; video: string; credit: string; cap?: string; start?: number; w?: number; rate?: number; fx?: Fx; zoom?: number }
  | { k: "person"; img: string; credit: string; name: string; en?: string; role: string[]; logos?: string[]; pos?: string; w?: number }
  | { k: "logos"; title?: string; items: { img: string; name?: string }[]; w?: number }
  | { k: "network"; center: string; nodes: { img: string; name: string; co: string[] }[]; title?: string; credit?: string; w?: number }
  | { k: "deal"; buyer: string; target: string; buyerName: string; targetName: string; num: { v: number; dec?: number; pre?: string; suf?: string }; year: string; src?: string; bg?: string; w?: number }
  | { k: "mafia"; title: string; sub?: string; people: { img: string; name: string; pos?: string }[]; credit?: string; w?: number };
// Any graphic shot may also carry `bg` (an image path): it is shown blurred and darkened behind the graphic.
export type Film = { id: string; theme: "cob" | "dream"; title: string; sub?: string; style?: "cine"; music?: string; musicVol?: number; cues?: { at: number; music: string; vol?: number }[]; paras: { v: Shot[] }[] };

if (typeof document !== "undefined") {
  for (const [n, file] of [["Bebas Neue", "BebasNeue-Regular.ttf"], ["Anton", "Anton-Regular.ttf"]]) {
    const ff = new FontFace(n, `url(${staticFile("fonts/" + file)})`);
    ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  }
}
// Pre-rendered noise tiles instead of a per-frame SVG feTurbulence (that filter was a large share of render time).
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.65))" }} />
      <Img src={staticFile(`cob/grain${Math.floor(f / 2) % 4}.png`)} style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.035 }} />
    </AbsoluteFill>
  );
};
const GAP = 12; // frames of air after each paragraph
const D = DUR as Record<string, number>;
export const paraLens = (f: Film) => f.paras.map((_, i) => Math.round((D[`${f.id}/${String(i + 1).padStart(2, "0")}`] ?? 8) * 30) + GAP);
export const filmLen = (f: Film) => paraLens(f).reduce((a, b) => a + b, 0) + 60;
export const FILM_LIST = FILMS as unknown as Film[];


// ---------- new shot kinds ----------
const pre = (img: string, tag: string) => img.replace(/\.\w+$/, `.${tag}.jpg`);
const kbT = (kb: string | undefined, p: number) => {
  const z = kb === "out" ? 1.18 - 0.12 * p : 1.06 + 0.12 * p;
  const x = kb === "left" ? 3 - 6 * p : kb === "right" ? -3 + 6 * p : 0;
  return `scale(${z}) translateX(${x}%)`;
};
const Plate: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: "rgba(8,14,17,.86)", borderRadius: 10, padding: "14px 26px", ...style }}>{children}</div>
);
const Photo: React.FC<{ s: Extract<Shot, { k: "photo" | "ai" }>; len: number }> = ({ s, len }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const p = interpolate(f, [0, len], [0, 1], { extrapolateRight: "clamp" });
  const capS = spring({ frame: f - 14, fps: 30, config: { damping: 15 } });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: kbT(s.kb, p) }}>
        <Img src={staticFile(s.img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos ?? "center" }} />
      </AbsoluteFill>
      <FxLayer fx={s.fx} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.35) 0%, transparent 22%, transparent 55%, rgba(0,0,0,.75) 100%)" }} />
      {s.cap && (
        <div style={{ position: "absolute", left: 90, bottom: 120, maxWidth: 1300, opacity: capS, transform: `translateY(${(1 - capS) * 30}px)` }}>
          <Plate style={{ borderLeft: `6px solid ${th.accent}` }}><span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 60, color: "white", lineHeight: 1.25 }}>{s.cap}</span></Plate>
        </div>
      )}
      {s.k === "photo" && <div style={{ position: "absolute", right: 48, bottom: 40, fontFamily: BN, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,.85)", background: "rgba(0,0,0,.55)", padding: "4px 14px", borderRadius: 5 }}>{s.credit}</div>}
      {s.k === "ai" && <div style={{ position: "absolute", right: 48, top: 40, fontFamily: BN, fontWeight: 700, fontSize: 26, color: AMBER, border: `2px solid ${AMBER}`, padding: "4px 16px", borderRadius: 6, background: "rgba(0,0,0,.55)" }}>প্রতীকী ছবি · এআই দিয়ে তৈরি</div>}
    </AbsoluteFill>
  );
};
const Clip: React.FC<{ s: Extract<Shot, { k: "clip" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const capS = spring({ frame: f - 14, fps: 30, config: { damping: 15 } });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo src={staticFile(s.video)} muted startFrom={Math.round((s.start ?? 0) * 30)} playbackRate={s.rate ?? 1} style={{ width: "100%", height: "100%", objectFit: "cover", transform: s.zoom ? `scale(${s.zoom})` : undefined }} />
      <FxLayer fx={s.fx} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,.7) 100%)" }} />
      {s.cap && <div style={{ position: "absolute", left: 90, bottom: 120, maxWidth: 1300, opacity: capS }}><Plate style={{ borderLeft: `6px solid ${th.accent}` }}><span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 60, color: "white" }}>{s.cap}</span></Plate></div>}
      <div style={{ position: "absolute", right: 48, bottom: 40, fontFamily: BN, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,.85)", background: "rgba(0,0,0,.55)", padding: "4px 14px", borderRadius: 5 }}>{s.credit}</div>
    </AbsoluteFill>
  );
};
const Chapter: React.FC<{ s: Extract<Shot, { k: "chapter" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const sp = spring({ frame: f - 4, fps: 30, config: { damping: 14 } });
  const line = T(f, 10, 40);
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 180px" }}>
      <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 30, letterSpacing: 10, color: th.accent2, opacity: sp }}>CHAPTER {String(s.n).padStart(2, "0")}</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: AMBER, marginTop: 8, opacity: sp }}>অধ্যায় {bn(s.n)}</div>
      <div style={{ height: 6, width: 900 * line, background: th.accent, margin: "26px 0 30px", borderRadius: 3 }} />
      <Head text={s.title} delay={14} size={120} />
      {s.sub && <div style={{ marginTop: 18 }}><Head text={s.sub} delay={34} size={48} color={MUTE} /></div>}
    </AbsoluteFill>
  );
};
const TextS: React.FC<{ s: Extract<Shot, { k: "text" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const words = s.text.split(" ");
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 170px" }}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 92, lineHeight: 1.2, color: "white", display: "flex", flexWrap: "wrap", gap: "0 24px" }}>
        {words.map((w, i) => {
          const sp = spring({ frame: f - 6 - i * 3, fps: 30, config: { damping: 16 } });
          const hl = s.hl && s.hl.split(" ").includes(w);
          return <span key={i} style={{ opacity: sp, transform: `translateY(${(1 - sp) * 34}px)`, color: hl ? AMBER : "white" }}>{w}</span>;
        })}
      </div>
      {s.sub && <div style={{ marginTop: 34, borderLeft: `6px solid ${th.accent}`, paddingLeft: 24 }}><Head text={s.sub} delay={words.length * 3 + 14} size={46} color={MUTE} /></div>}
      <Src text={s.src} />
    </AbsoluteFill>
  );
};
const Timeline: React.FC<{ s: Extract<Shot, { k: "timeline" }>; len: number }> = ({ s, len }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const n = s.items.length, step = (len * 0.72) / n;
  const p = T(f, 10, 10 + step * n);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 150 }}><Head text={s.title} size={60} /></div>
      <div style={{ position: "absolute", left: 160, top: 290, bottom: 150, width: 6, background: "rgba(255,255,255,.12)", borderRadius: 3 }}>
        <div style={{ width: 6, height: `${p * 100}%`, background: th.accent, borderRadius: 3 }} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 110, top: 280, bottom: 150, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
        {s.items.map(([d, t], i) => {
          const sp = spring({ frame: f - (12 + step * i), fps: 30, config: { damping: 15 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 36, opacity: sp, transform: `translateX(${(1 - sp) * 50}px)` }}>
              <div style={{ width: 86, display: "flex", justifyContent: "center" }}><div style={{ width: 30, height: 30, borderRadius: 99, background: AMBER, border: `5px solid ${INK}`, boxShadow: `0 0 0 3px ${AMBER}` }} /></div>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 44, color: AMBER, minWidth: 300 }}>{d}</div>
              <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: "white", lineHeight: 1.3 }}>{t}</div>
            </div>
          );
        })}
      </div>
      <Src text={s.src} />
    </AbsoluteFill>
  );
};
const DocS: React.FC<{ s: Extract<Shot, { k: "doc" }>; len: number }> = ({ s, len }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const sp = spring({ frame: f - 2, fps: 30, config: { damping: 16 } });
  const step = (len * 0.6) / Math.max(1, s.lines.length);
  const stampS = spring({ frame: f - (10 + step * s.lines.length), fps: 30, config: { damping: 9, mass: 0.6 } });
  const mono = s.mono;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: 1280, minHeight: 640, padding: "54px 70px", borderRadius: 12, background: mono ? "#06110c" : "#f3efe6", color: mono ? "#5dff9b" : "#1a1a1a", boxShadow: "0 40px 120px rgba(0,0,0,.6)", transform: `rotate(${mono ? 0 : -1.2}deg) translateY(${(1 - sp) * 80}px) scale(${0.96 + 0.04 * sp})`, opacity: sp, position: "relative", border: mono ? "2px solid #1d5a3a" : "none" }}>
        <div style={{ fontFamily: mono ? "Consolas, monospace" : HEAD, fontWeight: 800, fontSize: mono ? 34 : 50, marginBottom: 26, borderBottom: `3px solid ${mono ? "#1d5a3a" : "#1a1a1a"}`, paddingBottom: 14 }}>{s.title}</div>
        {s.lines.map((l, i) => {
          const o = T(f, 10 + step * i, 18 + step * i);
          const chars = Math.floor(l.length * T(f, 10 + step * i, 10 + step * i + Math.min(step, 24)));
          return <div key={i} style={{ fontFamily: mono ? "Consolas, monospace" : BN, fontWeight: 600, fontSize: mono ? 32 : 38, lineHeight: 1.55, opacity: o }}>{mono ? l.slice(0, chars) : l}</div>;
        })}
        {s.stamp && <div style={{ position: "absolute", right: 60, bottom: 50, fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: th.accent, border: `6px solid ${th.accent}`, padding: "4px 26px", borderRadius: 10, transform: `rotate(-12deg) scale(${2 - stampS})`, opacity: stampS }}>{s.stamp}</div>}
      </div>
      <Note text={s.note} />
      <Src text={s.src} />
    </AbsoluteFill>
  );
};

// ---------- portrait / logo / network shots ----------
const LogoChip: React.FC<{ img: string; size?: number; delay?: number }> = ({ img, size = 110, delay = 0 }) => {
  const f = useCurrentFrame();
  const sp = spring({ frame: f - delay, fps: 30, config: { damping: 12, mass: 0.7 } });
  return (
    <div style={{ width: size * 1.9, height: size, background: "white", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: size * 0.16, boxSizing: "border-box", boxShadow: "0 14px 40px rgba(0,0,0,.45)", transform: `scale(${sp})`, opacity: sp }}>
      <Img src={staticFile(img)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
    </div>
  );
};
const Person: React.FC<{ s: Extract<Shot, { k: "person" }>; len: number }> = ({ s, len }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const p = interpolate(f, [0, len], [0, 1], { extrapolateRight: "clamp" });
  const card = spring({ frame: f - 6, fps: 30, config: { damping: 16 } });
  const wipe = T(f, 0, 18);
  return (
    <AbsoluteFill style={{ background: "#05080a" }}>
      <AbsoluteFill><Img src={staticFile(pre(s.img, "blur"))} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 860, overflow: "hidden", clipPath: `inset(0 ${100 - wipe * 100}% 0 0)` }}>
        <Img src={staticFile(s.img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos ?? "center 25%", transform: `scale(${1.08 + 0.08 * p})` }} />
        <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 60%, #05080a 100%)" }} />
      </div>
      <div style={{ position: "absolute", left: 860, top: 0, bottom: 0, width: 10, background: th.accent, transform: `scaleY(${wipe})` }} />
      <div style={{ position: "absolute", left: 950, right: 100, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", opacity: card, transform: `translateX(${(1 - card) * 60}px)` }}>
        {s.en && <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 30, letterSpacing: 8, color: th.accent2, textTransform: "uppercase" }}>{s.en}</div>}
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 104, color: "white", lineHeight: 1.1, marginTop: 6 }}>{s.name}</div>
        <div style={{ height: 5, width: 260 * T(f, 14, 34), background: AMBER, margin: "22px 0 26px", borderRadius: 3 }} />
        {s.role.map((r, i) => {
          const o = spring({ frame: f - 20 - i * 8, fps: 30, config: { damping: 16 } });
          return <div key={i} style={{ fontFamily: BN, fontWeight: 700, fontSize: 42, color: i ? MUTE : "white", lineHeight: 1.45, opacity: o, transform: `translateY(${(1 - o) * 20}px)` }}>{r}</div>;
        })}
        {s.logos && <div style={{ display: "flex", gap: 22, marginTop: 40, flexWrap: "wrap" }}>{s.logos.map((l, i) => <LogoChip key={i} img={l} size={86} delay={34 + i * 7} />)}</div>}
      </div>
      <div style={{ position: "absolute", left: 40, bottom: 34, fontFamily: BN, fontWeight: 600, fontSize: 20, color: "rgba(255,255,255,.85)", background: "rgba(0,0,0,.55)", padding: "4px 12px", borderRadius: 5 }}>{s.credit}</div>
    </AbsoluteFill>
  );
};
const Logos: React.FC<{ s: Extract<Shot, { k: "logos" }> }> = ({ s }) => {
  const n = s.items.length, cols = n <= 4 ? n : n <= 6 ? 3 : 4;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 60 }}>
      {s.title && <Head text={s.title} size={64} />}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, auto)`, gap: "44px 50px" }}>
        {s.items.map((it, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <LogoChip img={it.img} size={n <= 2 ? 200 : 160} delay={10 + i * 8} />
            {it.name && <Head text={it.name} size={36} delay={16 + i * 8} />}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
const Network: React.FC<{ s: Extract<Shot, { k: "network" }>; len: number }> = ({ s, len }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const cx = 960, cy = 548, R = 285, n = s.nodes.length;
  const step = Math.min(24, (len * 0.6) / n);
  const csp = spring({ frame: f - 2, fps: 30, config: { damping: 12 } });
  // nodes evenly spaced along a rectangle around the centre logo
  const HW = 720, HH = 305, per = 4 * (HW + HH);
  const pos = (i: number) => { let d = ((i + 0.5) / n) * per; const drift = interpolate(f, [0, len], [0, 6]);
    if (d < 2 * HW) return [cx - HW + d + drift, cy - HH]; d -= 2 * HW;
    if (d < 2 * HH) return [cx + HW, cy - HH + d]; d -= 2 * HH;
    if (d < 2 * HW) return [cx + HW - d - drift, cy + HH]; d -= 2 * HW;
    return [cx - HW, cy + HH - d]; };
  return (
    <AbsoluteFill>
      {s.title && <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center" }}><Head text={s.title} size={58} /></div>}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {s.nodes.map((nd, i) => {
          const [x, y] = pos(i);
          const p = T(f, 8 + step * i, 20 + step * i);
          return <line key={i} x1={cx} y1={cy} x2={cx + (x - cx) * p} y2={cy + (y - cy) * p} stroke={th.accent} strokeWidth={4} strokeDasharray="10 8" opacity={0.8} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: cx - 190, top: cy - 100, transform: `scale(${csp})` }}><LogoChip img={s.center} size={200} /></div>
      {s.nodes.map((nd, i) => {
        const [x, y] = pos(i);
        const sp = spring({ frame: f - (14 + step * i), fps: 30, config: { damping: 13 } });
        return (
          <div key={i} style={{ position: "absolute", left: x - 100, top: y - 120, width: 200, display: "flex", flexDirection: "column", alignItems: "center", opacity: sp, transform: `scale(${0.6 + 0.4 * sp})` }}>
            <div style={{ width: 175, height: 175, borderRadius: 99, overflow: "hidden", border: `5px solid ${AMBER}`, boxShadow: "0 10px 30px rgba(0,0,0,.6)" }}><Img src={staticFile(nd.img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%" }} /></div>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 38, color: "white", marginTop: 8, whiteSpace: "nowrap", textShadow: "0 3px 10px #000" }}>{nd.name}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>{nd.co.map((c, j) => <LogoChip key={j} img={c} size={50} delay={24 + step * i + j * 5} />)}</div>
          </div>
        );
      })}
      {s.credit && <div style={{ position: "absolute", right: 40, bottom: 30, fontFamily: BN, fontWeight: 600, fontSize: 18, color: "rgba(255,255,255,.75)" }}>{s.credit}</div>}
    </AbsoluteFill>
  );
};
const Deal: React.FC<{ s: Extract<Shot, { k: "deal" }>; len: number }> = ({ s, len }) => {
  const f = useCurrentFrame();
  const a = spring({ frame: f - 4, fps: 30, config: { damping: 14 } });
  const b = spring({ frame: f - 16, fps: 30, config: { damping: 14 } });
  const arrow = T(f, 22, 40);
  const cnt = T(f, 30, Math.min(len - 20, 80));
  const v = s.num.v * cnt;
  const val = `${s.num.pre ?? ""}${bn(s.num.dec ? v.toFixed(s.num.dec) : Math.round(v).toLocaleString("en-IN"))}${s.num.suf ?? ""}`;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 44, color: AMBER, marginBottom: 40, opacity: a }}>{s.year}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: a, transform: `translateX(${(1 - a) * -80}px)` }}><LogoChip img={s.buyer} size={150} /><Head text={s.buyerName} size={40} /></div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 260 }}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 34, color: "white", opacity: arrow }}>কিনে নিল</div>
          <svg width={260} height={60}><line x1={10} y1={30} x2={10 + 220 * arrow} y2={30} stroke={AMBER} strokeWidth={8} /><polygon points="230,12 256,30 230,48" fill={AMBER} opacity={arrow} /></svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: b, transform: `translateX(${(1 - b) * 80}px)` }}><LogoChip img={s.target} size={150} /><Head text={s.targetName} size={40} /></div>
      </div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 130, color: "white", marginTop: 50, opacity: T(f, 26, 36), textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>{val}</div>
      <Src text={s.src} />
    </AbsoluteFill>
  );
};
const Mafia: React.FC<{ s: Extract<Shot, { k: "mafia" }>; len: number }> = ({ s, len }) => {
  const f = useCurrentFrame();
  const th = useTh();
  const n = s.people.length;
  const zoom = interpolate(f, [0, len], [1.0, 1.08]);
  const title = spring({ frame: f - (10 + n * 5), fps: 30, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ background: "#0a0806" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, display: "flex", flexDirection: "row" }}>
        {s.people.map((p, i) => {
          const o = T(f, 4 + i * 5, 16 + i * 5);
          return (
            <div key={i} style={{ flex: 1, height: "100%", overflow: "hidden", position: "relative", borderRight: "3px solid #000", opacity: o }}>
              <Img src={staticFile(pre(p.img, "bw"))} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos ?? "center 20%" }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: "white", textShadow: "0 3px 10px #000", opacity: T(f, 20 + i * 4, 34 + i * 4) }}>{p.name}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,.85) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.75) 0%, transparent 30%, transparent 70%, rgba(0,0,0,.8) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", opacity: title, transform: `scale(${1.3 - 0.3 * title})` }}>
        <div style={{ fontFamily: "Bebas Neue", fontSize: 150, letterSpacing: 18, color: "white", lineHeight: 1 }}>{s.title}</div>
        {s.sub && <div style={{ display: "inline-block", fontFamily: HEAD, fontWeight: 800, fontSize: 46, color: "white", background: th.accent, padding: "4px 22px", borderRadius: 6, marginTop: 10 }}>{s.sub}</div>}
      </div>
      {s.credit && <div style={{ position: "absolute", right: 40, bottom: 30, fontFamily: BN, fontWeight: 600, fontSize: 18, color: "rgba(255,255,255,.7)" }}>{s.credit}</div>}
    </AbsoluteFill>
  );
};
const BgImg: React.FC<{ img: string; len: number }> = ({ img, len }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(pre(img, "blur"))} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.12 + 0.06 * (f / Math.max(1, len))})` }} />
      {/* readability scrim: bright backgrounds (yellow maps, sky) washed out white text */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 35% 50%, rgba(4,16,11,.62) 0%, rgba(4,16,11,.78) 70%, rgba(0,0,0,.88) 100%)" }} />
    </AbsoluteFill>
  );
};

const ShotBody: React.FC<{ s: Shot; len: number }> = ({ s, len }) => {
  const bg = (s as { bg?: string }).bg;
  return bg && s.k !== "photo" && s.k !== "ai" && s.k !== "clip" && s.k !== "person" && s.k !== "mafia" ? (
    <AbsoluteFill><BgImg img={bg} len={len} /><ShotInner s={s} len={len} /></AbsoluteFill>
  ) : <ShotInner s={s} len={len} />;
};
const ShotInner: React.FC<{ s: Shot; len: number }> = ({ s, len }) => {
  switch (s.k) {
    case "photo": case "ai": return <Photo s={s} len={len} />;
    case "clip": return <Clip s={s} />;
    case "person": return <Person s={s} len={len} />;
    case "logos": return <Logos s={s} />;
    case "network": return <Network s={s} len={len} />;
    case "deal": return <Deal s={s} len={len} />;
    case "mafia": return <Mafia s={s} len={len} />;
    case "chapter": return <Chapter s={s} />;
    case "text": return <TextS s={s} />;
    case "timeline": return <Timeline s={s} len={len} />;
    case "doc": return <DocS s={s} len={len} />;
    default: return <Body s={s as Scene} len={len} />;
  }
};
const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, 8, len - 8, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
};

export const Doc: React.FC<{ id: string }> = ({ id }) => {
  const film = FILM_LIST.find((x) => x.id === id)!;
  const th = THEMES[film.theme];
  const lens = paraLens(film);
  const starts = lens.reduce<number[]>((a, _d, i) => (a.push(i ? a[i - 1] + lens[i - 1] : 0), a), []);
  const total = filmLen(film);
  // flatten shots with absolute timing
  const shots: { s: Shot; from: number; len: number }[] = [];
  film.paras.forEach((p, i) => {
    const W = p.v.reduce((a, s) => a + (s.w ?? 1), 0);
    let at = starts[i];
    p.v.forEach((s, j) => {
      const l = j === p.v.length - 1 ? starts[i] + lens[i] - at : Math.round((lens[i] * (s.w ?? 1)) / W);
      shots.push({ s, from: at, len: l });
      at += l;
    });
  });
  const f = useCurrentFrame();
  if (film.style === "cine") return <ThemeCtx.Provider value={th}><Cine film={film} shots={shots} starts={starts} total={total} other={(s, len) => <ShotBody s={s as Shot} len={len} />} /></ThemeCtx.Provider>;
  const cur = shots.find((x) => f >= x.from && f < x.from + x.len);
  const full = cur && ["photo", "ai", "clip", "chapter", "title", "close", "person", "mafia"].includes(cur.s.k);
  return (
    <ThemeCtx.Provider value={th}>
      <AbsoluteFill style={{ background: INK }}>
        <Bg />
        {shots.map((x, i) => (
          <Sequence key={i} from={x.from} durationInFrames={x.len + 8}>
            <Fade len={x.len + 8}><ShotBody s={x.s} len={x.len} /></Fade>
          </Sequence>
        ))}
        {film.paras.map((_, i) => (
          <Sequence key={"a" + i} from={starts[i] + 4}><Audio src={staticFile(`docs/${film.id}/vo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
        ))}
        {!full && f > 90 && f < total - 200 && <Bug />}
        <Grain />
        <Audio src={staticFile(film.music ?? (film.theme === "cob" ? "gambmusic.mp3" : "dgmusic.mp3"))} loop volume={(fr) => (film.musicVol ?? 0.12) * interpolate(fr, [0, 20, total - 90, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};
