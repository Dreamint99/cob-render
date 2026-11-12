// AI University — "GDS মাস্টারিং" (air-ticketing) course promo v5. LIGHT MODE, real টিকেটিং ল্যাব v3 footage (local build recordings).
// One engine, two comps: GDS5-Main (1920x1080, ~78 s, 12 scenes) and GDS5-Reel (1080x1920, ~40 s, subset). Plan: work/gdspromo2/script.md,
// progress/commands: work/gdspromo2/PROGRESS.md. VO: work/gdspromo2/make_vo.py (Tanvir). Lab recordings: work/pbcap/gp5rec2.mjs + work/gdspromo2/assemble.py.
// Bangla text: never letterSpacing. Fonts: AnekBangla (public/fonts), Montserrat for Latin.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Armchair, Award, BadgeCheck, BookOpen, Bot, Briefcase, Calculator, CheckCircle2, ClipboardCheck, EyeOff, Flame, Gift, Infinity as InfinityIcon, Lightbulb,
  ListOrdered, LogIn, MapPinOff, MousePointer2, Plane, PlayCircle, RefreshCw, Search, ShoppingCart, Smartphone, Star, Terminal, Ticket, Trophy, UserRound, Wallet, X } from "lucide-react";
import DURS from "./durs.json";
import EVENTS from "./events.json";

export const FPS = 30;
const OV = 10; // frames two scenes overlap (cross-dissolve)
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
const S = (p: string) => staticFile("gdspromo5/" + p);

const NAVY = "#011835", BLUE = "#0050ED", BLUE2 = "#3D7BFF", SKY = "#EAF1FF", INK2 = "#42506E", MUTE = "#7A86A3", LINE = "#E1E8F5", GOLD = "#E8A400", RED = "#E5484D", GREEN = "#12A150";
const BN = "AnekB, 'Hind Siliguri', sans-serif", LAT = "MontS, Montserrat, sans-serif", MONO = "Consolas, 'Cascadia Mono', 'Courier New', monospace";
const SHADOW = "0 30px 80px rgba(1,24,53,0.13), 0 3px 10px rgba(1,24,53,0.06)";
const bnd = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

if (typeof document !== "undefined") {
  for (const [fam, file] of [["AnekB", "AnekBangla.ttf"], ["MontS", "Montserrat.ttf"]]) {
    const ff = new FontFace(fam, `url(${staticFile("fonts/" + file)})`, { weight: "100 900" });
    ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  }
}

const D = DURS as Record<string, number>;
const EV = EVENTS as Record<string, { keys: number[]; enters: [string, number][] }>;

/* ---------------- timeline ---------------- */
type SceneId = "hook" | "demand" | "pain" | "reveal" | "lab" | "extras" | "curr" | "inside" | "benefit" | "reviews" | "offer" | "cta";
const MAIN: SceneId[] = ["hook", "demand", "pain", "reveal", "lab", "extras", "curr", "inside", "benefit", "reviews", "offer", "cta"];
const REEL: SceneId[] = ["hook", "demand", "reveal", "lab", "extras", "inside", "offer", "cta"];
const voId = (id: SceneId, reel: boolean) => (reel ? ({ reveal: "r_reveal", lab: "r_lab", inside: "r_inside", offer: "r_offer" } as Record<string, string>)[id] || id : id);
const LEAD = 6; // VO starts this many frames into the scene

/* lab footage cuts: [from s, to s, rate, camera {z, x, y}] — x/y = focus point (0..1) of the 2560x1600 (or 1080x2340) recording */
type Cut = { a: number; b: number; r: number; z: number; x: number; y: number };
const CUTS: Record<string, Cut[]> = {
  main: [
    { a: 1.4, b: 6.6, r: 3.0, z: 1.3, x: 0, y: 0.7 },     // sign-in JI…/AUBLAB
    { a: 6.6, b: 10.2, r: 2.0, z: 1.35, x: 0, y: 0.72 },    // AN availability
    { a: 10.2, b: 24.4, r: 5.5, z: 1.25, x: 0, y: 0.75 },   // SS NM AP TK RF ER
    { a: 24.4, b: 27.4, r: 1.8, z: 1.35, x: 0, y: 0.78 },   // FXP fare
    { a: 27.4, b: 33.2, r: 4.0, z: 1.25, x: 0, y: 0.78 },  // FP ER TTP
    { a: 33.2, b: 38.0, r: 1.2, z: 1.08, x: 0.55, y: 0.45 },  // ITR → e-ticket receipt
  ],
  reel: [
    { a: 7.6, b: 10.6, r: 2.0, z: 1.2, x: 0, y: 0.5 },
    { a: 10.6, b: 34.6, r: 10, z: 1.2, x: 0, y: 0.55 },
    { a: 34.6, b: 36.4, r: 1.8, z: 1.2, x: 0, y: 0.6 },
    { a: 36.6, b: 39.6, r: 1.1, z: 1.0, x: 0.5, y: 0.4 },
  ],
};
const cutsLen = (c: Cut[]) => c.reduce((s, k) => s + (k.b - k.a) / k.r, 0);

const MINLEN: Record<string, number> = { lab: cutsLen(CUTS.main) + 0.4, extras: 7.2, reviews: 3.6, cta: 4.6, hook: 4.8 };
const MINLEN_R: Record<string, number> = { lab: cutsLen(CUTS.reel) + 0.3, extras: 5.2, cta: 4.2, hook: 4.6 };

export const timeline = (reel: boolean) => {
  let at = 0;
  return (reel ? REEL : MAIN).map((id) => {
    const vo = D[voId(id, reel)] || 0;
    const min = (reel ? MINLEN_R : MINLEN)[id] || 0;
    const len = Math.round(Math.max(vo + 0.55, min) * FPS) + OV;
    const it = { id, from: at, len }; at += len - OV; return it;
  });
};
export const totalOf = (reel: boolean) => { const t = timeline(reel); const l = t[t.length - 1]; return l.from + l.len; };

/* ---------------- shared ---------------- */
const useV = () => { const { width, height } = useVideoConfig(); return height > width; };
const useIn = (d = 0, damping = 14, mass = 0.7) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - d, fps, config: { damping, mass } }); };

const Backdrop: React.FC<{ tint?: string }> = ({ tint = BLUE }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const m = Math.max(W, H);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, #FFFFFF 0%, #F3F7FF 45%, ${SKY} 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: m * 0.8, height: m * 0.8, left: -m * 0.25 + 40 * Math.sin(f / 70), top: -m * 0.35, borderRadius: "50%", background: `radial-gradient(circle, ${tint}22, transparent 65%)` }} />
      <div style={{ position: "absolute", width: m * 0.7, height: m * 0.7, right: -m * 0.25, bottom: -m * 0.3 + 30 * Math.cos(f / 80), borderRadius: "50%", background: "radial-gradient(circle, #7FB2FF33, transparent 65%)" }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(1,24,53,0.09) 1.6px, transparent 1.7px)", backgroundSize: "34px 34px", backgroundPosition: `${f * 0.25}px ${f * 0.4}px`,
        maskImage: "radial-gradient(ellipse at 50% 40%, black 10%, transparent 72%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 10%, transparent 72%)" }} />
    </AbsoluteFill>
  );
};

/* word-by-word headline; hl = words drawn in brand blue */
const Title: React.FC<{ text: string; hl?: string[]; x: number; y: number; w: number; size: number; align?: "left" | "center"; delay?: number; color?: string; weight?: number }> = ({ text, hl = [], x, y, w, size, align = "left", delay = 3, color = NAVY, weight = 700 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, fontFamily: BN, fontWeight: weight, fontSize: size, lineHeight: 1.22, color }}>
      {text.split(" ").map((wd, i) => {
        const k = lerp(f, delay + i * 2.5, delay + i * 2.5 + 16);
        const hot = hl.some((h) => wd.includes(h));
        return <span key={i} style={{ display: "inline-block", marginRight: "0.24em", opacity: k, transform: `translateY(${(1 - k) * 34}px)`, color: hot ? BLUE : color }}>{wd}</span>;
      })}
    </div>
  );
};

const Kicker: React.FC<{ text: string; x: number; y: number; icon?: React.ReactNode; delay?: number; size?: number; center?: boolean; w?: number }> = ({ text, x, y, icon, delay = 0, size = 30, center, w }) => {
  const k = useIn(delay, 16);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", justifyContent: center ? "center" : "flex-start" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: `${size * 0.32}px ${size * 0.7}px`, borderRadius: 999, background: "#fff", border: `1.5px solid ${BLUE}33`, boxShadow: "0 8px 24px rgba(0,80,237,0.10)",
        fontFamily: BN, fontWeight: 600, fontSize: size, color: BLUE, opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>{icon}{text}</div>
    </div>
  );
};

const IconBox: React.FC<{ children: React.ReactNode; size: number; bg?: string; color?: string }> = ({ children, size, bg = SKY, color = BLUE }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.28, background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{children}</div>
);

const Logo: React.FC<{ h: number; x: number; y: number; delay?: number }> = ({ h, x, y, delay = 0 }) => {
  const k = useIn(delay, 18);
  return <Img src={S("logo.png")} style={{ position: "absolute", left: x, top: y, height: h, opacity: k }} />;
};

/* browser window mockup (light chrome) */
const Browser: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; url?: string; delay?: number }> = ({ x, y, w, h, children, url = "aiuniversitybd.com/gds-lab", delay = 0 }) => {
  const k = useIn(delay, 16);
  const bar = Math.round(Math.max(38, w * 0.034));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h + bar, borderRadius: 20, overflow: "hidden", background: "#fff", boxShadow: "0 40px 100px rgba(1,24,53,0.22), 0 4px 14px rgba(1,24,53,0.08)",
      border: `1px solid ${LINE}`, opacity: k, transform: `translateY(${(1 - k) * 60}px) scale(${0.96 + 0.04 * k})` }}>
      <div style={{ height: bar, display: "flex", alignItems: "center", gap: bar * 0.22, padding: `0 ${bar * 0.45}px`, background: "#F4F7FC", borderBottom: `1px solid ${LINE}` }}>
        {["#FF6058", "#FFBD2E", "#29C940"].map((c) => <span key={c} style={{ width: bar * 0.3, height: bar * 0.3, borderRadius: 99, background: c }} />)}
        <div style={{ marginLeft: bar * 0.4, flex: 1, maxWidth: w * 0.5, height: bar * 0.62, borderRadius: 99, background: "#fff", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: `0 ${bar * 0.4}px`,
          fontFamily: LAT, fontWeight: 500, fontSize: bar * 0.36, color: INK2 }}>🔒&nbsp;{url}</div>
      </div>
      <div style={{ position: "relative", width: w, height: h, overflow: "hidden", background: NAVY }}>{children}</div>
    </div>
  );
};

/* plays a list of cuts of one recording with a smooth camera; sfx for keys/enters (from the recorder's event log) */
const Footage: React.FC<{ src: string; cuts: Cut[]; w: number; h: number; ev?: { keys: number[]; enters: [string, number][] }; keyVol?: number; startAt?: number }> = ({ src, cuts, w, h, ev, keyVol = 0.28, startAt = 0 }) => {
  const f = useCurrentFrame() - startAt;
  const starts: number[] = []; let acc = 0;
  for (const c of cuts) { starts.push(acc); acc += Math.round(((c.b - c.a) / c.r) * FPS); }
  // camera: blend from previous cut's camera over 14 frames
  let i = 0; for (let k = 0; k < cuts.length; k++) if (f >= starts[k]) i = k;
  const cur = cuts[i], prev = cuts[Math.max(0, i - 1)];
  const t = i === 0 ? 1 : interpolate(f - starts[i], [0, 16], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const drift = interpolate(f, [0, acc], [0, 0.04], clamp);
  const z = prev.z + (cur.z - prev.z) * t + drift, cx = prev.x + (cur.x - prev.x) * t, cy = prev.y + (cur.y - prev.y) * t;
  const sfx: React.ReactNode[] = [];
  if (ev) {
    cuts.forEach((c, k) => {
      const toOut = (s: number) => starts[k] + Math.round(((s - c.a) / c.r) * FPS);
      if (c.r <= 2.3) ev.keys.filter((s) => s >= c.a && s < c.b).forEach((s, j) => sfx.push(<Sequence key={`k${k}-${j}`} from={toOut(s) + startAt} durationInFrames={8}><Audio src={S("key.mp3")} volume={keyVol} /></Sequence>));
      ev.enters.filter(([, s]) => s >= c.a && s < c.b).forEach(([cmd, s], j) => sfx.push(<Sequence key={`e${k}-${j}`} from={toOut(s) + startAt} durationInFrames={20}><Audio src={S(cmd === "ITR" ? "chime.mp3" : "enter.mp3")} volume={cmd === "ITR" ? 0.5 : 0.35} /></Sequence>));
    });
  }
  return (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: `${cx * 100}% ${cy * 100}%` }}>
        {cuts.map((c, k) => (
          <Sequence key={k} from={starts[k] + startAt} durationInFrames={Math.round(((c.b - c.a) / c.r) * FPS) + (k === cuts.length - 1 ? 60 : 1)} layout="none">
            <OffthreadVideo src={S("rec/" + src)} startFrom={Math.round(c.a * FPS)} playbackRate={c.r} muted style={{ position: "absolute", left: 0, top: 0, width: w, height: h }} />
          </Sequence>
        ))}
      </div>
      {sfx}
    </>
  );
};

const SfxAt: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 0.4 }) => <Sequence from={Math.max(0, Math.round(at))} durationInFrames={90}><Audio src={S(src)} volume={vol} /></Sequence>;

/* ================= scenes ================= */
const AVAIL = [
  " 1  FZ 6408  J1 Y8 B2 M2 H4 Q6        /DAC DXB  0130  0505",
  " 2  BG 8147  J3 C3 Y7 B3 M1 H0 Q0 K4  /DAC DXB  0845  1225",
  " 3  EK 6582  J2 C3 Y9 B3 M0 H5 Q0 K1  /DAC DXB  1015  1340",
  " 4  BS 8341  C4 Y8 B4 M1 H0 Q1 K4     /DAC DXB  1930  2315",
  " 5  EK 6586  J2 C3 Y7 B2 M0 H4 Q0 K1  /DAC DXB  2150  0115+1",
];
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const cmd = "AN30NOVDACDXB", T0 = 6, PER = 2;
  const n = Math.max(0, Math.min(cmd.length, Math.floor((f - T0) / PER) + 1));
  const enter = T0 + cmd.length * PER + 5;
  const card = useIn(0, 15);
  const big = useIn(enter + 16, 11, 0.8);
  const fs = V ? 28 : 38;
  const w = V ? 1010 : 1500;
  const top = V ? 640 : 330;
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", left: 0, right: 0, top: V ? 300 : 96, textAlign: "center", fontFamily: BN, fontWeight: 800, fontSize: V ? 132 : 128, color: NAVY, lineHeight: 1.15,
        opacity: big, transform: `scale(${1.25 - 0.25 * big})` }}>
        এটা পড়তে <span style={{ color: BLUE }}>পারেন?</span>
      </div>
      <div style={{ position: "absolute", left: (V ? 1080 : 1920) / 2 - w / 2, top, width: w, padding: `${fs * 1.1}px ${fs * 1.2}px ${fs * 1.3}px`, borderRadius: 28, background: NAVY, boxShadow: "0 50px 120px rgba(1,24,53,0.35)",
        fontFamily: MONO, fontWeight: 700, fontSize: fs, lineHeight: 1.6, color: "#9DFCB4", opacity: card, transform: `translateY(${(1 - card) * 50}px) scale(${0.94 + 0.06 * card})` }}>
        <div style={{ display: "flex", gap: 10, marginBottom: fs * 0.7, alignItems: "center" }}>
          {["#FF6058", "#FFBD2E", "#29C940"].map((c) => <span key={c} style={{ width: fs * 0.55, height: fs * 0.55, borderRadius: 20, background: c }} />)}
          <span style={{ marginLeft: 14, fontFamily: BN, fontWeight: 500, color: "#8EA2CF", fontSize: fs * 0.78 }}>টিকেটিং ল্যাব · Amadeus</span>
        </div>
        <div style={{ color: "#FFE08A" }}>&gt;{cmd.slice(0, n)}<span style={{ opacity: f < enter && f % 14 < 8 ? 1 : 0 }}>▌</span></div>
        {f > enter + 2 ? <div style={{ color: "#E6ECFF", whiteSpace: "pre" }}>** TICKETING LAB - AN ** DXB DUBAI   MO 30NOV</div> : null}
        {AVAIL.map((l, i) => (f > enter + 5 + i * 3 ? <div key={i} style={{ whiteSpace: "pre" }}>{l}</div> : null))}
      </div>
      {cmd.split("").map((_, i) => <SfxAt key={i} at={T0 + i * PER} src="key.mp3" vol={0.32} />)}
      <SfxAt at={enter} src="enter.mp3" vol={0.45} />
      <SfxAt at={enter + 14} src="hit.mp3" vol={0.3} />
    </AbsoluteFill>
  );
};

const CITIES: [string, number, number][] = [["দুবাই", 0.88, 0.2], ["দোহা", 0.8, 0.52], ["রিয়াদ", 0.62, 0.84]];
const Routes: React.FC<{ x: number; y: number; w: number; h: number; delay?: number }> = ({ x, y, w, h, delay = 10 }) => {
  const f = useCurrentFrame();
  const ox = 0.1 * w, oy = 0.62 * h;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {CITIES.map(([, cx, cy], i) => {
          const tx = cx * w, ty = cy * h, mx = (ox + tx) / 2, my = Math.min(oy, ty) - h * 0.28;
          const k = lerp(f, delay + i * 7, delay + i * 7 + 30);
          const len = 1400;
          return <path key={i} d={`M ${ox} ${oy} Q ${mx} ${my} ${tx} ${ty}`} fill="none" stroke={BLUE} strokeWidth={4} strokeDasharray={`${len}`} strokeDashoffset={len * (1 - k)} strokeLinecap="round" opacity={0.75} />;
        })}
      </svg>
      {CITIES.map(([name, cx, cy], i) => {
        const tx = cx * w, ty = cy * h, mx = (ox + tx) / 2, my = Math.min(oy, ty) - h * 0.28;
        const k = lerp(f, delay + i * 7, delay + i * 7 + 30);
        const px = (1 - k) * (1 - k) * ox + 2 * (1 - k) * k * mx + k * k * tx, py = (1 - k) * (1 - k) * oy + 2 * (1 - k) * k * my + k * k * ty;
        const dx = 2 * (1 - k) * (mx - ox) + 2 * k * (tx - mx), dy = 2 * (1 - k) * (my - oy) + 2 * k * (ty - my);
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI + 45;
        const pin = lerp(f, delay + i * 7 + 26, delay + i * 7 + 38);
        return (
          <React.Fragment key={name}>
            {k > 0.01 && k < 0.99 ? <div style={{ position: "absolute", left: px - 22, top: py - 22, color: BLUE, transform: `rotate(${ang}deg)` }}><Plane size={44} fill={BLUE} strokeWidth={1.5} /></div> : null}
            <div style={{ position: "absolute", left: tx - 14, top: ty - 14, width: 28, height: 28, borderRadius: 99, background: "#fff", border: `6px solid ${BLUE}`, opacity: pin, transform: `scale(${pin})` }} />
            <div style={{ position: "absolute", left: tx + 24, top: ty - 30, padding: "6px 18px", borderRadius: 14, background: "#fff", boxShadow: SHADOW, fontFamily: BN, fontWeight: 700, fontSize: 34, color: NAVY, opacity: pin }}>{name}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: ox - 20, top: oy - 20, width: 40, height: 40, borderRadius: 99, background: BLUE, boxShadow: `0 0 0 ${10 + 6 * Math.sin(f / 6)}px ${BLUE}22` }} />
      <div style={{ position: "absolute", left: ox - 60, top: oy + 34, padding: "6px 18px", borderRadius: 14, background: NAVY, fontFamily: BN, fontWeight: 700, fontSize: 34, color: "#fff" }}>ঢাকা</div>
    </div>
  );
};

const Demand: React.FC = () => {
  const V = useV();
  const card = useIn(6, 15);
  const stamp = useIn(30, 9, 0.9);
  const cw = V ? 900 : 820;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Title text="দেশে-বিদেশে GDS জানা লোকের চাহিদা" hl={["GDS", "চাহিদা"]} x={V ? 60 : 120} y={V ? 270 : 100} w={V ? 960 : 1700} size={V ? 78 : 76} align={V ? "center" : "left"} />
      <div style={{ position: "absolute", left: V ? 90 : 120, top: V ? 520 : 270, width: cw, padding: 52, borderRadius: 32, background: "#fff", boxShadow: SHADOW, border: `1px solid ${LINE}`,
        opacity: card, transform: `translateY(${(1 - card) * 60}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <IconBox size={120}><Briefcase size={64} strokeWidth={2} /></IconBox>
          <div>
            <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 52, color: NAVY, lineHeight: 1.2 }}>রিজার্ভেশন / টিকেটিং অফিসার</div>
            <div style={{ fontFamily: BN, fontWeight: 500, fontSize: 34, color: MUTE, marginTop: 8 }}>ট্রাভেল এজেন্সি · ঢাকা · দুবাই · রিয়াদ</div>
          </div>
        </div>
        {[0.92, 0.7, 0.8].map((wd, i) => <div key={i} style={{ height: 22, width: `${wd * 100}%`, borderRadius: 11, background: "#EEF2F9", marginTop: i ? 22 : 48 }} />)}
        <div style={{ marginTop: 52, display: "inline-flex", alignItems: "center", gap: 16, padding: "20px 36px", borderRadius: 20, background: BLUE, color: "#fff", fontFamily: BN, fontWeight: 700, fontSize: 50,
          transform: `scale(${1.6 - 0.6 * stamp}) rotate(${(1 - stamp) * -8}deg)`, opacity: stamp, boxShadow: `0 16px 40px ${BLUE}55` }}>
          <BadgeCheck size={52} strokeWidth={2.4} /> GDS জানা আবশ্যক
        </div>
      </div>
      <Routes x={V ? 110 : 1020} y={V ? 1130 : 280} w={V ? 860 : 800} h={V ? 400 : 680} delay={14} />
      <SfxAt at={30} src="hit.mp3" vol={0.35} />
      <SfxAt at={16} src="whoosh.mp3" vol={0.18} />
    </AbsoluteFill>
  );
};

const Pain: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const items: [React.ReactNode, string][] = [[<MapPinOff key="a" size={60} />, "সব জায়গায় নেই"], [<Wallet key="b" size={60} />, "দাম আকাশছোঁয়া"], [<EyeOff key="c" size={60} />, "শুধু দেখানো, হাতে-কলমে না"]];
  return (
    <AbsoluteFill>
      <Backdrop tint="#E5484D" />
      <Title text="কিন্তু শিখবেন কোথায়?" hl={["কোথায়?"]} x={60} y={V ? 300 : 150} w={V ? 960 : 1800} size={V ? 104 : 100} align="center" />
      <div style={{ position: "absolute", left: V ? 90 : 120, right: V ? 90 : 120, top: V ? 560 : 420, display: "flex", flexDirection: V ? "column" : "row", gap: V ? 34 : 40, perspective: 1600 }}>
        {items.map(([ic, t], i) => {
          const d = 22 + i * 16;
          const k = lerp(f, d, d + 20);
          return (
            <div key={t} style={{ flex: 1, minHeight: V ? 250 : 400, padding: V ? "34px 40px" : "50px 40px", borderRadius: 32, background: "#fff", boxShadow: SHADOW, border: `1px solid ${LINE}`, display: "flex",
              flexDirection: V ? "row" : "column", alignItems: "center", justifyContent: V ? "flex-start" : "center", gap: V ? 36 : 30, textAlign: V ? "left" : "center",
              transform: `rotateY(${(1 - k) * 88}deg)`, opacity: k > 0.02 ? 1 : 0, position: "relative" }}>
              <IconBox size={120} bg="#FDECEC" color={RED}>{ic}</IconBox>
              <div style={{ fontFamily: BN, fontWeight: 700, fontSize: V ? 56 : 50, color: NAVY, lineHeight: 1.25 }}>{t}</div>
              <div style={{ position: "absolute", right: 24, top: 24, width: 50, height: 50, borderRadius: 99, background: RED, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${lerp(f, d + 14, d + 24)})` }}><X size={32} strokeWidth={3} /></div>
            </div>
          );
        })}
      </div>
      {[0, 1, 2].map((i) => <SfxAt key={i} at={22 + i * 16} src="whoosh.mp3" vol={0.16} />)}
      {[0, 1, 2].map((i) => <SfxAt key={"t" + i} at={36 + i * 16} src="tap.mp3" vol={0.5} />)}
    </AbsoluteFill>
  );
};

const MODES = [["Amadeus", 0], ["Galileo", 1.4], ["Sabre", 3.7]] as const;
const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const t = useIn(4, 13, 0.9);
  const clipStart = 26; // frames into the scene; modes.mp4 from 0.6 s
  const clipT = (f - clipStart) / FPS + 0.6;
  const active = clipT >= 6.0 ? 0 : clipT >= 3.7 ? 2 : clipT >= 1.4 ? 1 : 0;
  const bw = V ? 980 : 940, bh = Math.round(bw * 0.625);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Logo h={V ? 92 : 84} x={V ? 540 - 89 : 120} y={V ? 270 : 130} />
      <div style={{ position: "absolute", left: V ? 0 : 120, width: V ? 1080 : 820, top: V ? 390 : 270, textAlign: V ? "center" : "left", opacity: t, transform: `translateY(${(1 - t) * 40}px)` }}>
        <div style={{ fontFamily: BN, fontWeight: 800, fontSize: V ? 104 : 110, lineHeight: 1.08, color: NAVY }}>
          GDS <span style={{ color: BLUE }}>মাস্টারিং</span>
          <br />কোর্স
        </div>
        <div style={{ fontFamily: BN, fontWeight: 500, fontSize: V ? 36 : 36, color: INK2, marginTop: 14 }}>ট্রাভেল এজেন্সি এয়ার টিকেটিং · বাংলায়</div>
      </div>
      <div style={{ position: "absolute", left: V ? 0 : 120, width: V ? 1080 : 820, top: V ? 700 : 640, display: "flex", gap: 18, justifyContent: V ? "center" : "flex-start" }}>
        {MODES.map(([name], i) => {
          const k = useIn(18 + i * 6, 12);
          const on = f > clipStart && active === i;
          return (
            <div key={name} style={{ padding: "14px 30px", borderRadius: 18, fontFamily: LAT, fontWeight: 700, fontSize: V ? 38 : 38, background: on ? BLUE : "#fff", color: on ? "#fff" : NAVY, border: `2px solid ${on ? BLUE : LINE}`,
              boxShadow: on ? `0 14px 34px ${BLUE}55` : SHADOW, opacity: k, transform: `translateY(${(1 - k) * 24}px) scale(${on ? 1.07 : 1})` }}>{name}</div>
          );
        })}
      </div>
      <Browser x={V ? 50 : 900} y={V ? 830 : 230} w={bw} h={bh} delay={12}>
        <Sequence from={clipStart} layout="none">
          <OffthreadVideo src={S("rec/modes.mp4")} startFrom={18} muted style={{ position: "absolute", left: 0, top: 0, width: bw, height: bh }} />
        </Sequence>
      </Browser>
      {!V ? <div style={{ position: "absolute", left: 120, top: 760, width: 760, fontFamily: BN, fontWeight: 500, fontSize: 32, color: INK2, opacity: lerp(f, 40, 56) }}>এক ক্লিকে তিন ধাঁচের টার্মিনাল</div> : null}
      <SfxAt at={2} src="swell.mp3" vol={0.35} />
      {MODES.slice(1).map(([n, s]) => <SfxAt key={n} at={clipStart + (s - 0.6) * FPS} src="tap.mp3" vol={0.6} />)}
      <SfxAt at={clipStart + 5.4 * FPS} src="tap.mp3" vol={0.6} />
    </AbsoluteFill>
  );
};

const STEPS: [React.ComponentType<{ size?: number; strokeWidth?: number }>, string, string][] = [
  [LogIn, "সাইন-ইন", "JI0001AA/SU"], [Search, "ফ্লাইট খোঁজা", "AN"], [Armchair, "সিট বুকিং", "SS1Y1"], [UserRound, "যাত্রীর তথ্য", "NM1KHATUN"], [Calculator, "ভাড়া", "FXP"], [Ticket, "টিকিট ইস্যু", "TTP"], [CheckCircle2, "ই-টিকিট", "ITR"],
];
/* which step is active at a given source time (seconds) */
const stepAt = (enters: [string, number][], s: number) => {
  let i = 0;
  for (const [c, t] of enters) {
    if (s < t) break;
    i = c.startsWith("JI") || c === "AUBLAB" ? 0 : c.startsWith("AN") ? 1 : c.startsWith("SS") ? 2 : /^(NM|AP|TK|RF|ER)/.test(c) && !/^ER/.test(c) ? 3 : c === "FXP" ? 4 : c === "TTP" ? 5 : c === "ITR" ? 6 : i;
  }
  return i;
};
const srcTimeAt = (cuts: Cut[], frame: number) => {
  let acc = 0;
  for (const c of cuts) { const n = ((c.b - c.a) / c.r) * FPS; if (frame < acc + n) return c.a + ((frame - acc) / FPS) * c.r; acc += n; }
  return cuts[cuts.length - 1].b;
};

const Lab: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const START = 8;
  if (V) {
    const cuts = CUTS.reel, ev = EV.mob;
    const st = stepAt(ev.enters, srcTimeAt(cuts, f - START));
    const pw = 600, ph = Math.round(pw * (2340 / 1080));
    const k = useIn(0, 15);
    const [Ic, label] = STEPS[st];
    return (
      <AbsoluteFill>
        <Backdrop />
        <div style={{ position: "absolute", left: 540 - pw / 2 - 16, top: 262, width: pw + 32, height: ph + 32, borderRadius: 70, background: "#0B1220", padding: 16, boxShadow: "0 50px 120px rgba(1,24,53,0.35)",
          opacity: k, transform: `translateY(${(1 - k) * 80}px)` }}>
          <div style={{ position: "relative", width: pw, height: ph, borderRadius: 56, overflow: "hidden", background: NAVY }}>
            <Footage src="mob.mp4" cuts={cuts} w={pw} h={ph} ev={ev} startAt={START} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 262 - 4, display: "flex", justifyContent: "center" }}>
          <div style={{ marginTop: 0, padding: "14px 30px", borderRadius: 999, background: BLUE, color: "#fff", fontFamily: BN, fontWeight: 700, fontSize: 38, display: "flex", gap: 12, alignItems: "center", boxShadow: `0 14px 34px ${BLUE}55`, opacity: k }}>
            <Terminal size={38} /> নিজস্ব টিকেটিং ল্যাব
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1440, display: "flex", justifyContent: "center" }}>
          <div key={st} style={{ padding: "18px 34px", borderRadius: 26, background: "#fff", boxShadow: SHADOW, border: `2px solid ${BLUE}`, display: "flex", gap: 16, alignItems: "center", fontFamily: BN, fontWeight: 700, fontSize: 44, color: NAVY }}>
            <IconBox size={64} bg={BLUE} color="#fff"><Ic size={36} strokeWidth={2.2} /></IconBox>{label}
            <span style={{ fontFamily: BN, fontWeight: 600, fontSize: 30, color: MUTE }}>{bnd(st + 1)}/৭</span>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  const cuts = CUTS.main, ev = EV.hero;
  const st = stepAt(ev.enters, srcTimeAt(cuts, f - START));
  const bw = 1360, bh = 850;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Browser x={64} y={84} w={bw} h={bh}>
        <Footage src="hero.mp4" cuts={cuts} w={bw} h={bh} ev={ev} startAt={START} />
      </Browser>
      <div style={{ position: "absolute", left: 1470, top: 96, width: 400 }}>
        <Kicker text="কোর্সের ভেতরেই" x={0} y={0} icon={<Terminal size={30} />} size={28} />
        <Title text="নিজস্ব টিকেটিং ল্যাব" hl={["টিকেটিং", "ল্যাব"]} x={0} y={70} w={400} size={58} delay={4} />
        {STEPS.map(([Ic, label], i) => {
          const on = i === st, done = i < st;
          const k = useIn(10 + i * 4, 16);
          return (
            <div key={label} style={{ position: "absolute", left: 0, top: 250 + i * 96, width: 400, height: 80, borderRadius: 22, display: "flex", alignItems: "center", gap: 18, padding: "0 18px",
              background: on ? BLUE : "#fff", border: `1.5px solid ${on ? BLUE : LINE}`, boxShadow: on ? `0 14px 34px ${BLUE}55` : "0 6px 18px rgba(1,24,53,0.06)", opacity: k,
              transform: `translateX(${(1 - k) * 60}px) scale(${on ? 1.04 : 1})` }}>
              <IconBox size={52} bg={on ? "rgba(255,255,255,0.18)" : done ? "#E6F6EC" : SKY} color={on ? "#fff" : done ? GREEN : BLUE}>{done ? <CheckCircle2 size={30} strokeWidth={2.4} /> : <Ic size={30} strokeWidth={2.2} />}</IconBox>
              <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 34, color: on ? "#fff" : NAVY }}>{label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 64, top: 1000, width: bw, textAlign: "center", fontFamily: BN, fontWeight: 500, fontSize: 26, color: MUTE, opacity: lerp(f, 20, 40) }}>আসল স্ক্রিন রেকর্ডিং · গাইড প্যানেল ধাপে ধাপে দেখায়</div>
    </AbsoluteFill>
  );
};

const Extras: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  // clips: [file, from s, seconds shown, zoom, fx, fy]
  const clips: [string, number, number, number, number, number][] = V
    ? [["chal.mp4", 44.2, 2.6, 1.7, 0.98, 0.62], ["board.mp4", 5.8, 1.7, 2.2, 0.98, 0.58], ["mis.mp4", 9.6, 2.4, 1.6, 0.05, 0.62]]
    : [["chal.mp4", 43.8, 3.2, 1.45, 0.92, 0.66], ["board.mp4", 5.6, 2.3, 1.9, 0.98, 0.6], ["mis.mp4", 9.4, 3.3, 1.45, 0.08, 0.64]];
  const starts: number[] = []; let acc = 10;
  for (const c of clips) { starts.push(acc); acc += Math.round(c[2] * FPS); }
  let ci = 0; for (let i = 0; i < clips.length; i++) if (f >= starts[i]) ci = i;
  const feats: [React.ReactNode, string, number[]][] = [[<Trophy key="a" size={40} />, "দৈনিক চ্যালেঞ্জ", [0]], [<Flame key="b" size={40} />, "পয়েন্ট + স্ট্রিক", [0, 1]], [<ListOrdered key="c" size={40} />, "লিডারবোর্ড", [1]], [<Lightbulb key="d" size={40} />, "ভুল থেকে শেখা", [2]]];
  const bw = V ? 980 : 1080, bh = Math.round(bw * 0.625);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Title text="রোজ নতুন চ্যালেঞ্জ" hl={["চ্যালেঞ্জ"]} x={V ? 60 : 110} y={V ? 270 : 150} w={V ? 960 : 640} size={V ? 88 : 84} align={V ? "center" : "left"} />
      <Browser x={V ? 50 : 770} y={V ? 420 : 200} w={bw} h={bh} delay={4}>
        {clips.map(([src, from, secs, z, fx, fy], i) => (
          <Sequence key={i} from={starts[i]} durationInFrames={Math.round(secs * FPS) + (i === clips.length - 1 ? 90 : 0)} layout="none">
            <div style={{ position: "absolute", inset: 0, transform: `scale(${z + 0.05 * Math.min(1, (f - starts[i]) / (secs * FPS))})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}>
              <OffthreadVideo src={S("rec/" + src)} startFrom={Math.round(from * FPS)} muted style={{ position: "absolute", left: 0, top: 0, width: bw, height: bh }} />
            </div>
          </Sequence>
        ))}
        {clips.map((_, i) => (i ? <Sequence key={"fl" + i} from={starts[i]} durationInFrames={8} layout="none"><AbsoluteFill style={{ background: "#fff", opacity: 0.5 }} /></Sequence> : null))}
      </Browser>
      <div style={{ position: "absolute", left: V ? 60 : 110, top: V ? 1080 : 420, width: V ? 960 : 600, display: "flex", flexWrap: "wrap", gap: V ? 22 : 24, flexDirection: V ? "row" : "column", justifyContent: "center" }}>
        {feats.map(([ic, t, on], i) => {
          const k = useIn(8 + i * 5, 15);
          const act = f >= 10 && on.includes(ci);
          return (
            <div key={t} style={{ width: V ? 468 : 560, height: V ? 108 : 104, borderRadius: 26, display: "flex", alignItems: "center", gap: 20, padding: "0 24px", background: act ? BLUE : "#fff", border: `1.5px solid ${act ? BLUE : LINE}`,
              boxShadow: act ? `0 14px 34px ${BLUE}55` : SHADOW, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
              <IconBox size={68} bg={act ? "rgba(255,255,255,0.18)" : i === 1 ? "#FFF1E6" : SKY} color={act ? "#fff" : i === 1 ? "#F06A00" : BLUE}>{ic}</IconBox>
              <span style={{ fontFamily: BN, fontWeight: 700, fontSize: V ? 42 : 42, color: act ? "#fff" : NAVY }}>{t}</span>
            </div>
          );
        })}
      </div>
      {starts.map((s, i) => <SfxAt key={i} at={s} src={i ? "tap.mp3" : "chime.mp3"} vol={i ? 0.5 : 0.35} />)}
    </AbsoluteFill>
  );
};

const MODS = ["ফান্ডামেন্টাল: এয়ার ট্রাভেল ও GDS-এর ভিত", "রিজার্ভেশন ১: অ্যাভেইলেবিলিটি ও সিট বিক্রি", "রিজার্ভেশন ২: PNR তৈরি ও ব্যবস্থাপনা", "ভাড়া ও ফেয়ার রুল", "টিকেটিং ও টিকিট-পরবর্তী কাজ",
  "ট্রাভেল ডকুমেন্ট, ভিসা ও যাত্রী-সেবা", "OTA: অনলাইন ট্রাভেল এজেন্সি", "এজেন্সি পরিচালনা ও আইন", "মক টেস্ট ও ক্যারিয়ার", "চূড়ান্ত মূল্যায়ন"];
const Curr: React.FC = () => {
  const V = useV();
  return (
    <AbsoluteFill>
      <Backdrop />
      <Title text="১০টা মডিউল, শুরু থেকে শেষ" hl={["১০টা"]} x={V ? 60 : 110} y={V ? 270 : 70} w={V ? 960 : 1700} size={V ? 78 : 76} align={V ? "center" : "left"} />
      <div style={{ position: "absolute", left: V ? 60 : 110, top: V ? 400 : 210, width: V ? 960 : 1700, display: "grid", gridTemplateColumns: V ? "1fr" : "1fr 1fr", gridAutoFlow: V ? "row" : "column", gridTemplateRows: V ? undefined : "repeat(5, 1fr)", gap: V ? 12 : 22 }}>
        {MODS.map((m, i) => {
          const k = useIn(8 + i * 3, 16);
          return (
            <div key={m} style={{ height: V ? 98 : 136, borderRadius: 24, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 10px 30px rgba(1,24,53,0.08)", display: "flex", alignItems: "center", gap: 22, padding: "0 26px",
              opacity: k, transform: `translateX(${(1 - k) * (i % 2 && !V ? 60 : -60)}px)` }}>
              <div style={{ width: V ? 62 : 76, height: V ? 62 : 76, borderRadius: 99, background: i === 9 ? GREEN : BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BN, fontWeight: 700, fontSize: V ? 32 : 38, flexShrink: 0 }}>{bnd(String(i + 1).padStart(2, "0"))}</div>
              <span style={{ fontFamily: BN, fontWeight: 600, fontSize: V ? 34 : 38, color: NAVY, lineHeight: 1.2 }}>{m}</span>
            </div>
          );
        })}
      </div>
      {MODS.map((_, i) => (i % 2 ? null : <SfxAt key={i} at={8 + i * 3} src="tick.mp3" vol={0.25} />))}
    </AbsoluteFill>
  );
};

const Count: React.FC<{ to: number; d: number }> = ({ to, d }) => {
  const f = useCurrentFrame();
  return <>{bnd(Math.round(interpolate(f, [d, d + 24], [0, to], { ...clamp, easing: Easing.out(Easing.cubic) })))}</>;
};
const Inside: React.FC<{ reel?: boolean }> = ({ reel }) => {
  const V = useV();
  const dur = D[reel ? "r_inside" : "inside"] * FPS;
  // reveal times follow the VO (fractions of the line)
  const tiles: [React.ReactNode, React.ReactNode, string, number][] = [
    [<PlayCircle key="1" size={46} />, <Count key="c1" to={51} d={8} />, "ভিডিও লেসন", 0.02],
    [<Terminal key="2" size={46} />, <Count key="c2" to={43} d={8 + dur * 0.14} />, "ল্যাব অনুশীলন", 0.14],
    [<ClipboardCheck key="3" size={46} />, <span key="c3">{bnd(9)}</span>, "কুইজ + চূড়ান্ত পরীক্ষা", reel ? 0.3 : 0.27],
    [<Bot key="4" size={46} />, null, "টিকিট গুরু · এআই সহায়ক", reel ? 0.48 : 0.45],
    [<BookOpen key="5" size={46} />, null, "কোর্সের বই", reel ? 0.6 : 0.6],
    [<Award key="6" size={46} />, null, "যাচাইযোগ্য সার্টিফিকেট", reel ? 0.72 : 0.68],
    [<Smartphone key="7" size={46} />, null, "অ্যাপ + ওয়েবসাইট", reel ? 0.84 : 0.8],
  ];
  const tw = V ? 470 : 400, th = V ? 238 : 270;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Title text="কোর্সের ভেতরে যা আছে" hl={["ভেতরে"]} x={60} y={V ? 270 : 80} w={V ? 960 : 1800} size={V ? 80 : 78} align="center" />
      <div style={{ position: "absolute", left: V ? 50 : 110, top: V ? 410 : 230, width: V ? 980 : 1700, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: V ? 22 : 30 }}>
        {tiles.map(([ic, num, label, at], i) => {
          const d = 6 + at * dur;
          const k = useIn(d, 13);
          return (
            <div key={label} style={{ width: tw, height: th, borderRadius: 30, background: "#fff", border: `1px solid ${LINE}`, boxShadow: SHADOW, padding: "26px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between",
              opacity: k, transform: `translateY(${(1 - k) * 50}px) scale(${0.9 + 0.1 * k})` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <IconBox size={V ? 80 : 84}>{ic}</IconBox>
                {num ? <span style={{ fontFamily: BN, fontWeight: 800, fontSize: V ? 76 : 82, color: BLUE, lineHeight: 1 }}>{num}</span> : null}
              </div>
              <div style={{ fontFamily: BN, fontWeight: 700, fontSize: V ? 38 : 38, color: NAVY, lineHeight: 1.22 }}>{label}</div>
            </div>
          );
        })}
      </div>
      {tiles.map(([, , l, at]) => <SfxAt key={l} at={6 + at * dur} src="pop.mp3" vol={0.32} />)}
    </AbsoluteFill>
  );
};

const Benefit: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const dur = D.benefit * FPS;
  const items = ["নিজেই PNR থেকে টিকিট", "ভাড়া আর ট্যাক্স বোঝা", "রিফান্ড ও রিইস্যু", "এজেন্সিতে আবেদন বা নিজের ব্যবসার প্রস্তুতি"];
  const tk = useIn(10, 16);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Title text="শিখলে যা পারবেন" hl={["পারবেন"]} x={V ? 60 : 110} y={V ? 270 : 130} w={V ? 960 : 900} size={V ? 84 : 84} align={V ? "center" : "left"} />
      <div style={{ position: "absolute", left: V ? 70 : 110, top: V ? 420 : 300, width: V ? 940 : 900, display: "flex", flexDirection: "column", gap: 26 }}>
        {items.map((t, i) => {
          const d = 8 + (i / items.length) * dur * 0.9;
          const k = useIn(d, 15);
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 24, padding: "22px 30px", borderRadius: 26, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 10px 30px rgba(1,24,53,0.08)", opacity: k, transform: `translateX(${(1 - k) * -60}px)` }}>
              <div style={{ color: GREEN, transform: `scale(${lerp(f, d + 4, d + 14, 0.3, 1)})` }}><CheckCircle2 size={58} strokeWidth={2.4} /></div>
              <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 44, color: NAVY, lineHeight: 1.22 }}>{t}</span>
            </div>
          );
        })}
      </div>
      {!V ? (
        <div style={{ position: "absolute", left: 1110, top: 170, width: 700, borderRadius: 18, overflow: "hidden", boxShadow: "0 50px 120px rgba(1,24,53,0.28)", border: `1px solid ${LINE}`,
          opacity: tk, transform: `translateY(${(1 - tk) * 80}px) rotate(${3 - 1.5 * tk}deg)` }}>
          <Img src={S("ticket.jpg")} style={{ width: 700, display: "block" }} />
        </div>
      ) : null}
      {!V ? <div style={{ position: "absolute", left: 1110, top: 840, width: 700, textAlign: "center", fontFamily: BN, fontSize: 26, color: MUTE, opacity: tk }}>ল্যাবে তৈরি অনুশীলনের ই-টিকিট (আসল টিকিট নয়)</div> : null}
      {items.map((t, i) => <SfxAt key={t} at={12 + (i / items.length) * dur * 0.9} src="tap.mp3" vol={0.45} />)}
    </AbsoluteFill>
  );
};

/* real reviews from https://aiuniversitybd.com/api/reviews?cid=air-ticketing (fetched 30 Oct 2026: 6 reviews with text, ratings 4,5,5,5,3,5 → 4.5) */
const REVIEWS: [string, string, number][] = [["খুব ভালো। শিখতে অনেক সহজ।", "MD AMINUL ISLAM", 4], ["সবকিছু সহজ ভাবে বুঝা যাচ্ছে", "Md Rofiqul Islam", 5], ["অনেক কিছুই শিখতে পারছি", "AL-AQSA TRAVELS", 5]];
const Stars: React.FC<{ n: number; size: number }> = ({ n, size }) => (
  <div style={{ display: "flex", gap: size * 0.12 }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} style={{ position: "relative", width: size, height: size }}>
        <Star size={size} color="#D9DEE8" fill="#D9DEE8" strokeWidth={1} style={{ position: "absolute" }} />
        <div style={{ position: "absolute", inset: 0, width: `${Math.max(0, Math.min(1, n - i)) * 100}%`, overflow: "hidden" }}><Star size={size} color="#F5A623" fill="#F5A623" strokeWidth={1} /></div>
      </div>
    ))}
  </div>
);
const Reviews: React.FC = () => {
  const V = useV();
  const r = useIn(4, 14);
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", left: 0, right: 0, top: V ? 280 : 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: r, transform: `scale(${0.9 + 0.1 * r})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <span style={{ fontFamily: BN, fontWeight: 800, fontSize: 120, color: NAVY, lineHeight: 1 }}>৪.৫</span>
          <Stars n={4.5} size={64} />
        </div>
        <div style={{ fontFamily: BN, fontWeight: 500, fontSize: 32, color: INK2 }}>এয়ার টিকেটিং কোর্সের ৬টি লিখিত রিভিউ · aiuniversitybd.com</div>
      </div>
      <div style={{ position: "absolute", left: V ? 60 : 110, right: V ? 60 : 110, top: V ? 560 : 400, display: "flex", flexDirection: V ? "column" : "row", gap: 30 }}>
        {REVIEWS.map(([t, n, s], i) => {
          const k = useIn(14 + i * 7, 14);
          return (
            <div key={n} style={{ flex: 1, padding: "38px 40px", borderRadius: 30, background: "#fff", border: `1px solid ${LINE}`, boxShadow: SHADOW, opacity: k, transform: `translateY(${(1 - k) * 50}px)` }}>
              <Stars n={s} size={38} />
              <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 44, color: NAVY, lineHeight: 1.3, marginTop: 22, minHeight: V ? 0 : 172 }}>“{t}”</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: 99, background: SKY, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LAT, fontWeight: 700, fontSize: 24 }}>{n.replace(/^MD |^Md /, "").slice(0, 1)}</div>
                <span style={{ fontFamily: LAT, fontWeight: 600, fontSize: 26, color: INK2 }}>{n}</span>
              </div>
            </div>
          );
        })}
      </div>
      {REVIEWS.map((_, i) => <SfxAt key={i} at={14 + i * 7} src="pop.mp3" vol={0.3} />)}
    </AbsoluteFill>
  );
};

const Offer: React.FC<{ reel?: boolean }> = ({ reel }) => {
  const f = useCurrentFrame();
  const V = useV();
  const card = useIn(2, 15);
  const roll = interpolate(f, [16, 44], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const price = Math.round(10000 - (10000 - 999) * roll);
  const landed = f >= 44;
  const pop = useIn(44, 8, 0.7);
  const strike = lerp(f, 48, 60);
  const chips: [React.ReactNode, string][] = [[<InfinityIcon key="a" size={38} />, "আজীবন অ্যাক্সেস"], [<RefreshCw key="b" size={34} />, "আপডেট ফ্রি"], [<Gift key="c" size={36} />, "প্রথম ২০% ফ্রি"]];
  const btnK = useIn(70, 14);
  const click = 98;
  const cur = lerp(f, 72, click - 4);
  const pressed = f >= click && f < click + 6;
  const done = f >= click + 4;
  const cw = V ? 940 : 1100;
  return (
    <AbsoluteFill>
      <Backdrop tint="#E8A400" />
      <div style={{ position: "absolute", left: (V ? 1080 : 1920) / 2 - cw / 2, top: V ? 300 : 90, width: cw, padding: V ? "50px 40px 56px" : "48px 60px 56px", borderRadius: 40, background: "#fff", boxShadow: SHADOW,
        border: `1px solid ${LINE}`, textAlign: "center", opacity: card, transform: `translateY(${(1 - card) * 60}px)` }}>
        <div style={{ fontFamily: BN, fontWeight: 600, fontSize: V ? 40 : 38, color: INK2 }}>GDS মাস্টারিং কোর্স · এয়ার টিকেটিং</div>
        <div style={{ position: "relative", display: "inline-block", marginTop: 18, fontFamily: BN, fontWeight: 600, fontSize: V ? 64 : 60, color: MUTE, opacity: landed ? 1 : 0 }}>
          ৳১০,০০০
          <div style={{ position: "absolute", left: -8, top: "52%", height: 6, width: `calc(${strike * 100}% + 16px)`, background: RED, borderRadius: 4, transform: "rotate(-6deg)" }} />
        </div>
        <div style={{ fontFamily: BN, fontWeight: 800, fontSize: V ? 230 : 220, lineHeight: 1.0, marginTop: landed ? 0 : -60,
          background: landed ? `linear-gradient(180deg, #FFC530, ${GOLD} 60%, #B97F00)` : "none", WebkitBackgroundClip: landed ? "text" : undefined, color: landed ? "transparent" : NAVY,
          transform: `scale(${landed ? 1 + 0.12 * (1 - pop) : 1})`, filter: landed ? "drop-shadow(0 18px 30px rgba(232,164,0,0.35))" : undefined }}>৳{bnd(price.toLocaleString("en-US"))}</div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginTop: 26 }}>
          {chips.map(([ic, t], i) => {
            const k = lerp(f, 56 + i * 6, 70 + i * 6);
            return <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 18, background: SKY, color: BLUE, fontFamily: BN, fontWeight: 700, fontSize: V ? 36 : 34, opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>{ic}<span style={{ color: NAVY }}>{t}</span></div>;
          })}
        </div>
        {!reel || V ? (
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 16, marginTop: 34, padding: "22px 48px", borderRadius: 22, background: done ? GREEN : BLUE, color: "#fff",
            fontFamily: BN, fontWeight: 700, fontSize: V ? 44 : 42, opacity: btnK, transform: `scale(${pressed ? 0.94 : 0.9 + 0.1 * btnK})`, boxShadow: `0 18px 40px ${done ? GREEN : BLUE}55` }}>
            {done ? <CheckCircle2 size={44} /> : <ShoppingCart size={44} />}{done ? "কার্টে যোগ হয়েছে" : "কোর্সটি নিন"}
            <div style={{ position: "absolute", right: 30 - 120 * (1 - cur), top: 60 + 90 * (1 - cur), color: NAVY, opacity: btnK && f < click + 24 ? 1 : 0, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))" }}><MousePointer2 size={56} fill="#fff" strokeWidth={2} /></div>
          </div>
        ) : null}
      </div>
      {Array.from({ length: 9 }).map((_, i) => <SfxAt key={i} at={16 + i * 3} src="tick.mp3" vol={0.18} />)}
      <SfxAt at={44} src="cash.mp3" vol={0.6} />
      <SfxAt at={click} src="tap.mp3" vol={0.7} />
      <SfxAt at={click + 3} src="pop.mp3" vol={0.35} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const u = useIn(16, 13);
  const click = 46;
  const cur = lerp(f, 24, click - 3);
  const ripple = interpolate(f, [click, click + 22], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: V ? 40 : 34, paddingBottom: V ? 260 : 60 }}>
        <Img src={S("logo.png")} style={{ height: V ? 170 : 150, opacity: lerp(f, 0, 14) }} />
        <div style={{ fontFamily: BN, fontWeight: 800, fontSize: V ? 96 : 92, color: NAVY, opacity: lerp(f, 6, 20), transform: `translateY(${(1 - lerp(f, 6, 20)) * 30}px)` }}>আজই শুরু করুন</div>
        <div style={{ position: "relative", padding: V ? "28px 56px" : "26px 60px", borderRadius: 999, background: BLUE, color: "#fff", fontFamily: LAT, fontWeight: 700, fontSize: V ? 54 : 56,
          boxShadow: `0 24px 60px ${BLUE}55`, opacity: u, transform: `scale(${(0.88 + 0.12 * u) * (f >= click && f < click + 5 ? 0.95 : 1)})` }}>
          aiuniversitybd.com
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 600 * ripple, height: 600 * ripple, marginLeft: -300 * ripple, marginTop: -300 * ripple, borderRadius: "50%", border: `4px solid ${BLUE}`, opacity: 1 - ripple, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 60 - 200 * (1 - cur), top: 70 + 120 * (1 - cur), color: NAVY, opacity: u, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))" }}><MousePointer2 size={60} fill="#fff" strokeWidth={2} /></div>
        </div>
        <div style={{ display: "flex", gap: 18, opacity: lerp(f, 30, 44), fontFamily: BN, fontWeight: 600, fontSize: V ? 34 : 32, color: INK2 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Smartphone size={34} color={BLUE} /> অ্যাপ</span>·<span style={{ display: "flex", alignItems: "center", gap: 10 }}><Plane size={32} color={BLUE} /> এয়ার টিকেটিং কোর্স</span>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: V ? 1470 : 1000, textAlign: "center", fontFamily: BN, fontWeight: 500, fontSize: V ? 28 : 26, color: MUTE, opacity: lerp(f, 20, 36) }}>
        শিক্ষামূলক GDS সিমুলেটর, আসল GDS নয় · চাকরির নিশ্চয়তা নয়
      </div>
      <SfxAt at={click} src="tap.mp3" vol={0.7} />
      <SfxAt at={2} src="shimmer.mp3" vol={0.3} />
    </AbsoluteFill>
  );
};

const MAP: Record<SceneId, React.FC<{ reel?: boolean }>> = { hook: Hook, demand: Demand, pain: Pain, reveal: Reveal, lab: Lab, extras: Extras, curr: Curr, inside: Inside, benefit: Benefit, reviews: Reviews, offer: Offer, cta: Cta };

const Wrap: React.FC<{ len: number; first: boolean; children: React.ReactNode }> = ({ len, first, children }) => {
  const f = useCurrentFrame();
  const i = first ? 1 : lerp(f, 0, OV + 2);
  const o = interpolate(f, [len - OV, len], [0, 1], clamp);
  return <AbsoluteFill style={{ opacity: i * (1 - o * 0.0), transform: `translateX(${(1 - i) * 80}px) scale(${1 + 0.02 * o})` }}>{children}</AbsoluteFill>;
};

export const GdsPromo5: React.FC<{ reel: boolean }> = ({ reel }) => {
  const { durationInFrames } = useVideoConfig();
  const f = useCurrentFrame();
  const V = useV();
  const tl = timeline(reel);
  const music = (fr: number) => Math.min(lerp(fr, 0, 20, 0, 0.13), lerp(fr, durationInFrames - 45, durationInFrames, 0.13, 0));
  return (
    <AbsoluteFill style={{ background: "#F3F7FF" }}>
      <Audio src={S("music.mp3")} volume={music} />
      {tl.map(({ id, from, len }, idx) => {
        const Sc = MAP[id];
        return (
          <Sequence key={id} from={from} durationInFrames={len}>
            <Wrap len={len} first={idx === 0}><Sc reel={reel} /></Wrap>
            <Sequence from={LEAD}><Audio src={S(`vo/${voId(id, reel)}.mp3`)} /></Sequence>
            {idx ? <Audio src={S("whoosh.mp3")} volume={0.16} /> : null}
          </Sequence>
        );
      })}
      {!V ? (() => { const cur = tl.find((s) => f >= s.from && f < s.from + s.len); const show = cur && !["hook", "reveal", "cta", "lab"].includes(cur.id); return <Img src={S("logo.png")} style={{ position: "absolute", right: 56, top: 34, height: 46, opacity: show ? 0.9 : 0 }} />; })() : null}
    </AbsoluteFill>
  );
};
