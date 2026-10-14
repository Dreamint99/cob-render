// "মহাজন" — product promo built from REAL dashboard captures (local dev build, demo pharmacy).
// Captures: public/mohajon/cap (3840x2160 = 1920x1080 CSS @2x), VO: public/mohajon/vo, sfx: public/mohajon/sfx
import React from "react";
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random,
} from "remotion";

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);
const M = (p: string) => staticFile("mohajon/" + p);

if (typeof document !== "undefined") {
  for (const [name, file] of [["Hind", "HindSiliguri-Bold.ttf"], ["HindSemi", "HindSiliguri-SemiBold.ttf"], ["Anek", "AnekBangla.ttf"], ["Galada", "Galada-Regular.ttf"], ["Montserrat", "Montserrat.ttf"]]) {
    const f = new FontFace(name, `url(${staticFile("fonts/" + file)})`);
    f.load().then(() => document.fonts.add(f)).catch(() => {});
  }
}

// ---------- palette ----------
export const C = {
  bg: "#0A0718", bg2: "#140D33", violet: "#6D4AFF", violet2: "#8B6CFF", lilac: "#C4B5FD", cyan: "#22D3EE",
  green: "#22C55E", amber: "#F59E0B", red: "#F43F5E", white: "#FFFFFF", ink: "#1B1446",
};
export const FONT = "Hind, 'Hind Siliguri', 'Noto Sans Bengali', sans-serif";
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (f: number, a: number, b: number, from: number, to: number, e = ease) => interpolate(f, [a, b], [from, to], { ...clamp, easing: e });

// ---------- timeline ----------
type Sc = { id: string; len: number; vo: number; voAt: number };
const SCENES: Sc[] = [
  { id: "hook", len: 8.6, vo: 1, voAt: 0.4 },
  { id: "logo", len: 6.6, vo: 2, voAt: 0.25 },
  { id: "dash", len: 9.0, vo: 3, voAt: 0.3 },
  { id: "pos", len: 7.6, vo: 4, voAt: 0.3 },
  { id: "khata", len: 8.0, vo: 5, voAt: 0.3 },
  { id: "order", len: 8.8, vo: 6, voAt: 0.3 },
  { id: "alert", len: 7.0, vo: 7, voAt: 0.3 },
  { id: "report", len: 8.0, vo: 8, voAt: 0.3 },
  { id: "trades", len: 9.6, vo: 9, voAt: 0.3 },
  { id: "cta", len: 9.0, vo: 10, voAt: 0.6 },
];
let acc = 0;
const L: Record<string, { from: number; len: number; vo: number; voAt: number }> = {};
for (const sc of SCENES) { L[sc.id] = { from: acc, len: s(sc.len), vo: sc.vo, voAt: s(sc.voAt) }; acc += s(sc.len); }
export const MOHAJON_TOTAL = acc;

// ---------- background ----------
export const Backdrop: React.FC<{ hue?: number; intensity?: number }> = ({ hue = 0, intensity = 1 }) => {
  const f = useCurrentFrame();
  const b = (i: number) => ({ x: 50 + 35 * Math.sin(f / 90 + i * 2.1), y: 50 + 30 * Math.cos(f / 110 + i * 1.7) });
  const blobs = [C.violet, "#3B1FA8", C.cyan];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 120%, ${C.bg2} 0%, ${C.bg} 60%)`, filter: `hue-rotate(${hue}deg)` }}>
      {blobs.map((c, i) => {
        const p = b(i);
        return <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: 900, height: 900, marginLeft: -450, marginTop: -450, borderRadius: "50%", background: c, opacity: (i === 2 ? 0.12 : 0.28) * intensity, filter: "blur(160px)" }} />;
      })}
      {/* perspective grid floor */}
      <div style={{ position: "absolute", left: -400, right: -400, bottom: -200, height: 700, transform: "perspective(600px) rotateX(62deg)", transformOrigin: "50% 100%",
        backgroundImage: `linear-gradient(rgba(139,108,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(139,108,255,0.22) 1px, transparent 1px)`,
        backgroundSize: "80px 80px", backgroundPosition: `0 ${(f * 1.2) % 80}px`, maskImage: "linear-gradient(to top, black 10%, transparent 90%)", WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 90%)", opacity: 0.55 * intensity }} />
      <Particles n={40} />
    </AbsoluteFill>
  );
};

export const Particles: React.FC<{ n: number; color?: string }> = ({ n, color = C.lilac }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(n).fill(0).map((_, i) => {
        const x = random(`px${i}`) * 1920, sp = 0.3 + random(`ps${i}`) * 0.9, sz = 2 + random(`pz${i}`) * 4;
        const y = 1080 - ((random(`py${i}`) * 1200 + f * sp * 2) % 1200);
        return <div key={i} style={{ position: "absolute", left: x + Math.sin(f / 30 + i) * 10, top: y, width: sz, height: sz, borderRadius: "50%", background: color, opacity: 0.25 + 0.4 * random(`po${i}`), boxShadow: `0 0 ${sz * 3}px ${color}` }} />;
      })}
    </AbsoluteFill>
  );
};

// ---------- text ----------
export const Words: React.FC<{ text: string; at?: number; size?: number; color?: string; stagger?: number; weight?: number; style?: React.CSSProperties; hl?: string[] }> = ({ text, at = 0, size = 72, color = C.white, stagger = 4, style, hl = [] }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: FONT, fontSize: size, color, lineHeight: 1.25, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `0 ${size * 0.28}px`, ...style }}>
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: f - at - i * stagger, fps, config: { damping: 14, stiffness: 160 } });
        const isHl = hl.includes(w);
        return (
          <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.85 + 0.15 * p})`, filter: `blur(${(1 - p) * 8}px)`,
            ...(isHl ? { background: `linear-gradient(90deg, ${C.lilac}, ${C.violet2}, ${C.cyan})`, WebkitBackgroundClip: "text", color: "transparent" } : {}) }}>{w}</span>
        );
      })}
    </div>
  );
};

export const Pill: React.FC<{ at: number; children: React.ReactNode; x: number; y: number; color?: string; icon?: string; size?: number; float?: boolean }> = ({ at, children, x, y, color = C.violet, icon, size = 30, float = true }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 12, stiffness: 170 } });
  const bob = float ? Math.sin((f - at) / 18) * 6 : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y + bob, transform: `translate(-50%,-50%) scale(${p})`, opacity: Math.min(1, p * 1.5),
      display: "flex", alignItems: "center", gap: 14, padding: `${size * 0.45}px ${size * 0.8}px`, borderRadius: 999, whiteSpace: "nowrap",
      background: "rgba(255,255,255,0.94)", boxShadow: `0 20px 50px rgba(0,0,0,0.35), 0 0 0 3px ${color}33`, fontFamily: FONT, fontSize: size, color: C.ink }}>
      {icon && <Img src={M(`marks/${icon}.png`)} style={{ width: size * 1.6, height: size * 1.6, borderRadius: 10 }} />}
      <span>{children}</span>
    </div>
  );
};

const Tag: React.FC<{ n: string; label: string }> = ({ n, label }) => {
  const f = useCurrentFrame();
  const p = lerp(f, 2, 18, 0, 1);
  return (
    <div style={{ position: "absolute", left: 70, top: 56, display: "flex", alignItems: "center", gap: 14, opacity: p, transform: `translateX(${(1 - p) * -40}px)`, fontFamily: FONT }}>
      <div style={{ background: C.violet, color: "white", fontSize: 24, padding: "6px 14px", borderRadius: 10, fontFamily: "Montserrat", fontWeight: 800 }}>{n}</div>
      <div style={{ color: C.lilac, fontSize: 28, letterSpacing: 1 }}>{label}</div>
    </div>
  );
};

// ---------- browser frame with camera ----------
type Cam = { f: number; z: number; x: number; y: number };
const camAt = (keys: Cam[], f: number) => {
  const fs = keys.map((k) => k.f);
  const g = (k: "z" | "x" | "y") => interpolate(f, fs, keys.map((c) => c[k]), { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  return { z: g("z"), x: g("x"), y: g("y") };
};

const Browser: React.FC<{ src: string | ((f: number) => string); width: number; cam?: Cam[]; url?: string; style?: React.CSSProperties; children?: React.ReactNode; fade?: { at: number; from: string } }> = ({ src, width, cam = [{ f: 0, z: 1, x: 960, y: 540 }], url = "mohajon.app/app", style, children, fade }) => {
  const f = useCurrentFrame();
  const FW = width, FH = (width * 9) / 16, bar = Math.round(width * 0.03);
  const c = camAt(cam, f);
  const k = (FW / 1920) * c.z;
  const tx = Math.min(0, Math.max(FW - 1920 * k, FW / 2 - c.x * k));
  const ty = Math.min(0, Math.max(FH - 1080 * k, FH / 2 - c.y * k));
  const cur = typeof src === "function" ? src(f) : src;
  const layer = (file: string, op = 1) => <Img src={M(`cap/${file}.png`)} style={{ position: "absolute", width: 1920, height: 1080, opacity: op }} />;
  return (
    <div style={{ width: FW, borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: "0 50px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.12), 0 0 80px rgba(109,74,255,0.35)", ...style }}>
      <div style={{ height: bar, background: "#F1EEFB", display: "flex", alignItems: "center", gap: bar * 0.28, padding: `0 ${bar * 0.5}px` }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c2) => <div key={c2} style={{ width: bar * 0.32, height: bar * 0.32, borderRadius: "50%", background: c2 }} />)}
        <div style={{ marginLeft: bar * 0.4, flex: 1, maxWidth: FW * 0.45, height: bar * 0.62, borderRadius: 8, background: "#fff", color: "#6B6496", fontSize: bar * 0.38, display: "flex", alignItems: "center", padding: `0 ${bar * 0.4}px`, fontFamily: "Montserrat" }}>🔒 {url}</div>
      </div>
      <div style={{ position: "relative", width: FW, height: FH, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${k})` }}>
          {fade && f < fade.at + 8 && layer(fade.from)}
          {layer(cur, fade ? lerp(f, fade.at, fade.at + 8, 0, 1) : 1)}
          {children}
        </div>
      </div>
    </div>
  );
};

// cursor inside the 1920x1080 page space (place as child of Browser)
const Cursor: React.FC<{ path: { f: number; x: number; y: number; click?: boolean }[] }> = ({ path }) => {
  const f = useCurrentFrame();
  if (f < path[0].f - 6) return null;
  const fs = path.map((p) => p.f);
  const x = interpolate(f, fs, path.map((p) => p.x), { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) });
  const y = interpolate(f, fs, path.map((p) => p.y), { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) });
  const click = path.filter((p) => p.click).map((p) => f - p.f).find((d) => d >= 0 && d < 14);
  const press = click !== undefined ? 1 - 0.15 * Math.sin((click / 14) * Math.PI) : 1;
  return (
    <>
      {click !== undefined && <div style={{ position: "absolute", left: x - 40, top: y - 40, width: 80, height: 80, borderRadius: "50%", border: `5px solid ${C.violet}`, opacity: 1 - click / 14, transform: `scale(${0.3 + click / 10})` }} />}
      <svg width="44" height="44" viewBox="0 0 24 24" style={{ position: "absolute", left: x - 6, top: y - 4, transform: `scale(${press})`, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))", opacity: lerp(f, path[0].f - 6, path[0].f, 0, 1) }}>
        <path d="M4 2 L4 19 L8.5 15 L11.5 22 L14.5 20.8 L11.6 14 L18 14 Z" fill="#111" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </>
  );
};

// enter/exit wrapper for each scene
const SceneShell: React.FC<{ len: number; children: React.ReactNode; hue?: number; bg?: boolean }> = ({ len, children, hue = 0, bg = true }) => {
  const f = useCurrentFrame();
  const out = lerp(f, len - 8, len, 0, 1, Easing.in(Easing.cubic));
  const inn = lerp(f, 0, 10, 0, 1);
  return (
    <AbsoluteFill>
      {bg && <Backdrop hue={hue} />}
      <AbsoluteFill style={{ opacity: inn * (1 - out), transform: `scale(${1 + out * 0.08})`, filter: `blur(${out * 10}px)` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// glass flash between scenes
export const SwipeFlash: React.FC = () => {
  const f = useCurrentFrame();
  const x = lerp(f, 0, 12, -40, 140, Easing.inOut(Easing.cubic));
  return <AbsoluteFill style={{ pointerEvents: "none", background: `linear-gradient(100deg, transparent ${x - 30}%, rgba(196,181,253,0.55) ${x - 6}%, rgba(255,255,255,0.85) ${x}%, rgba(109,74,255,0.4) ${x + 6}%, transparent ${x + 30}%)`, mixBlendMode: "screen" }} />;
};

// ================= SCENES =================

// 1. Hook — paper ledger chaos
const Ledger: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - 4 - i * 7, fps, config: { damping: 16 } });
  const rx = random(`lx${i}`), ry = random(`ly${i}`);
  const x = 200 + rx * 1500, y = 160 + ry * 760;
  const rot = (random(`lr${i}`) - 0.5) * 40 + Math.sin(f / 25 + i) * 3;
  const shake = f > 200 ? Math.sin(f * 2.3 + i) * (f - 200) * 0.6 : 0;
  const rows = ["করিম — ৪৩০ বাকি", "সালমা — ২২০?", "নাপা ১০ পাতা", "জাহিদ — ???", "ভাড়া ৮০০০", "মোট = ?"];
  return (
    <div style={{ position: "absolute", left: x + shake, top: y, width: 300, height: 380, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${p * 0.9})`, opacity: 0.55 * p,
      background: "#F4ECD8", borderRadius: 6, boxShadow: "0 20px 40px rgba(0,0,0,0.5)", padding: "26px 22px", fontFamily: "Galada", color: "#3B2A1A", fontSize: 26,
      backgroundImage: "repeating-linear-gradient(transparent 0 46px, rgba(59,130,246,0.25) 46px 48px)", borderLeft: "6px solid #E11D48" }}>
      {rows.slice(0, 5).map((r, j) => <div key={j} style={{ height: 48, textDecoration: (i + j) % 3 === 0 ? "line-through" : "none" }}>{rows[(i + j) % rows.length]}</div>)}
    </div>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const len = L.hook.len;
  const qs = [["কে কত বাকি নিল?", 70, 560, 640], ["আজ কত বিক্রি হলো?", 115, 1360, 640], ["সব মুখস্থ?", 175, 960, 790]] as const;
  return (
    <SceneShell len={len} hue={-20}>
      {new Array(9).fill(0).map((_, i) => <Ledger key={i} i={i} />)}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(10,7,24,0.55) 0%, rgba(10,7,24,0.92) 70%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 260 }}>
        <Words text="দোকানের হিসাব" at={6} size={120} />
        <Words text="এখনো খাতায়?" at={18} size={140} hl={["খাতায়?"]} />
      </AbsoluteFill>
      {qs.map(([t, at, x, y]) => <Pill key={t} at={at} x={x} y={y} color={C.red} size={44}>{t}</Pill>)}
      {/* glitch at the end */}
      {f > len - 20 && <AbsoluteFill style={{ background: `rgba(109,74,255,${random(`g${f}`) * 0.35})`, transform: `translateX(${(random(`gx${f}`) - 0.5) * 30}px)` }} />}
    </SceneShell>
  );
};

// 2. Logo reveal
const Logo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = L.logo.len;
  const slam = spring({ frame: f, fps, config: { damping: 9, stiffness: 220 } });
  const noOut = lerp(f, 30, 40, 1, 0);
  const flash = interpolate(f, [38, 42, 56], [0, 1, 0], clamp);
  const lp = spring({ frame: f - 42, fps, config: { damping: 13, stiffness: 120 } });
  const sweep = lerp(f, 55, 95, -30, 130, Easing.inOut(Easing.quad));
  const shake = f < 14 ? (random(`sh${f}`) - 0.5) * 30 * (1 - f / 14) : 0;
  return (
    <SceneShell len={len}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: noOut, transform: `translate(${shake}px, ${shake / 2}px)` }}>
        <div style={{ fontFamily: FONT, fontSize: 260, color: "white", transform: `scale(${3 - 2 * slam})`, textShadow: `0 0 60px ${C.violet}` }}>আর না!</div>
      </AbsoluteFill>
      {/* burst rings */}
      {[0, 1, 2].map((i) => {
        const r = lerp(f, 42 + i * 5, 80 + i * 5, 0, 1, Easing.out(Easing.cubic));
        return <AbsoluteFill key={i} style={{ justifyContent: "center", alignItems: "center" }}><div style={{ width: 1600 * r, height: 1600 * r, borderRadius: "50%", border: `${6 - i * 2}px solid ${C.lilac}`, opacity: (1 - r) * 0.8 }} /></AbsoluteFill>;
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 120 }}>
        <div style={{ position: "relative", opacity: lp, transform: `scale(${0.6 + 0.4 * lp + f * 0.0006})`, filter: `drop-shadow(0 0 40px ${C.violet}) drop-shadow(0 0 90px rgba(139,108,255,0.6))` }}>
          <Img src={M("brand/wordmark-white.png")} style={{ width: 900 }} />
          <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sweep - 12}%, rgba(255,255,255,0.95) ${sweep}%, transparent ${sweep + 12}%)`, mixBlendMode: "overlay",
            WebkitMaskImage: `url(${M("brand/wordmark-white.png")})`, WebkitMaskSize: "100% 100%", maskImage: `url(${M("brand/wordmark-white.png")})`, maskSize: "100% 100%" }} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 190 }}>
        <Words text="প্রতিটি দোকান, হোক ডিজিটাল।" at={80} size={76} stagger={6} hl={["ডিজিটাল।"]} />
      </AbsoluteFill>
      <Particles n={30} color="#fff" />
      <AbsoluteFill style={{ background: "white", opacity: flash }} />
    </SceneShell>
  );
};

// 3. Dashboard overview
const Dash: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = L.dash.len;
  const p = spring({ frame: f, fps, config: { damping: 18, stiffness: 70 } });
  const rx = 28 * (1 - p) + 6 * Math.max(0, 1 - f / 90), ry = -22 * (1 - p) + lerp(f, 0, len, -6, 4);
  return (
    <SceneShell len={len}>
      <Tag n="01" label="Dashboard" />
      <div style={{ position: "absolute", top: 50, width: "100%" }}><Words text="এক নজরে পুরো দোকান" at={4} size={64} hl={["পুরো", "দোকান"]} /></div>
      <AbsoluteFill style={{ perspective: 2200, justifyContent: "center", alignItems: "center", paddingTop: 110 }}>
        <div style={{ transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateY(${(1 - p) * 300}px) scale(${0.8 + 0.2 * p})` }}>
          <Browser src="home" width={1480} cam={[
            { f: 0, z: 1, x: 960, y: 540 }, { f: 60, z: 1, x: 960, y: 540 }, { f: 95, z: 1.75, x: 820, y: 240 }, { f: 150, z: 1.75, x: 1250, y: 240 },
            { f: 185, z: 1.55, x: 760, y: 530 }, { f: 235, z: 1.55, x: 1500, y: 540 }, { f: 265, z: 1.05, x: 960, y: 540 },
          ]} />
        </div>
      </AbsoluteFill>
      <Pill at={40} x={260} y={330} icon="pos" color={C.green}>Live — সঙ্গে সঙ্গে</Pill>
      <Pill at={100} x={1680} y={400} icon="report">বিক্রি · বাকি · আদায়</Pill>
      <Pill at={190} x={250} y={820} icon="stock" color={C.amber}>Stock সতর্কতা</Pill>
    </SceneShell>
  );
};

// 4. POS — real two-tap sale with receipt
const R = { a: { x: 891, y: 418 }, b: { x: 1236, y: 418 }, c: { x: 1236, y: 301 }, sell: { x: 1547, y: 846 } };
const Pos: React.FC = () => {
  const f = useCurrentFrame();
  const len = L.pos.len;
  const T = { c1: 34, c2: 64, c3: 92, sell: 132 };
  const img = (fr: number) => (fr < T.c1 + 2 ? "pos0" : fr < T.c2 + 2 ? "pos1" : fr < T.c3 + 2 ? "pos2" : fr < T.sell + 4 ? "pos3" : "pos4");
  return (
    <SceneShell len={len}>
      <Tag n="02" label="POS — বিক্রি" />
      <div style={{ position: "absolute", top: 50, width: "100%" }}><Words text="দুই ট্যাপেই বিক্রি শেষ" at={4} size={64} hl={["দুই", "ট্যাপেই"]} /></div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 110, perspective: 2400 }}>
        <div style={{ transform: `rotateY(${lerp(f, 0, len, 5, -4)}deg) rotateX(3deg)` }}>
          <Browser src={img} width={1480} url="mohajon.app/app/pos" cam={[
            { f: 0, z: 1.0, x: 960, y: 540 }, { f: 22, z: 1.3, x: 1060, y: 420 }, { f: 100, z: 1.3, x: 1150, y: 420 },
            { f: 125, z: 1.35, x: 1450, y: 600 }, { f: 140, z: 1.35, x: 1450, y: 600 }, { f: 155, z: 1.45, x: 960, y: 520 }, { f: 228, z: 1.6, x: 960, y: 500 },
          ]}>
            <Cursor path={[{ f: 14, x: 700, y: 700 }, { f: T.c1, ...R.a, click: true }, { f: T.c2, ...R.b, click: true }, { f: T.c3, ...R.c, click: true }, { f: T.sell, ...R.sell, click: true }, { f: T.sell + 30, x: 1700, y: 950 }]} />
          </Browser>
        </div>
      </AbsoluteFill>
      <Pill at={20} x={250} y={360} icon="qr">Barcode Scan</Pill>
      <Pill at={T.sell + 8} x={1690} y={300} icon="pos" color={C.green}>✓ রসিদ তৈরি</Pill>
      <Pill at={T.sell + 22} x={240} y={800} icon="stock" color={C.amber}>Stock নিজেই কমে</Pill>
    </SceneShell>
  );
};

// 5. Khata
const Khata: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = L.khata.len;
  const card = spring({ frame: f - 70, fps, config: { damping: 14 } });
  return (
    <SceneShell len={len} hue={10}>
      <Tag n="03" label="খাতা — বাকি" />
      <div style={{ position: "absolute", top: 50, width: "100%" }}><Words text="বাকির খাতা, নিজে থেকেই" at={4} size={64} hl={["নিজে", "থেকেই"]} /></div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", paddingTop: 200, paddingLeft: 110, perspective: 2400 }}>
        <div style={{ transform: `rotateY(${lerp(f, 0, len, 10, 4)}deg)` }}>
          <Browser src="khata" width={1240} url="mohajon.app/app/khata" cam={[{ f: 0, z: 1, x: 960, y: 540 }, { f: 40, z: 1, x: 960, y: 540 }, { f: 90, z: 1.6, x: 760, y: 330 }, { f: 230, z: 1.75, x: 760, y: 360 }]} />
        </div>
      </AbsoluteFill>
      {/* customer card */}
      <div style={{ position: "absolute", right: 90, top: 330, width: 470, transform: `translateX(${(1 - card) * 500}px) rotate(${(1 - card) * 8}deg)`, opacity: card,
        background: "white", borderRadius: 28, padding: 34, fontFamily: FONT, boxShadow: "0 40px 90px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 74, height: 74, borderRadius: "50%", background: `linear-gradient(135deg, ${C.violet}, ${C.violet2})`, color: "white", fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>ক</div>
          <div><div style={{ fontSize: 38, color: C.ink }}>করিম মিয়া</div><div style={{ fontSize: 24, color: "#7A7399", fontFamily: "Montserrat" }}>01712-345678</div></div>
        </div>
        <div style={{ marginTop: 26, padding: "18px 22px", background: "#FFF4E5", borderRadius: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 30, color: "#9A5B00" }}>বাকি</span>
          <span style={{ fontSize: 52, color: "#C2410C" }}>৳{["০", "১২০", "২৫০", "৩৪০", "৪১০", "৪৩০"][Math.min(5, Math.max(0, Math.floor((f - 80) / 5)))]}</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 26, color: "#6B6496" }}>কে কত নিল, কবে দিল — সব লেখা থাকে</div>
      </div>
      <Pill at={140} x={1500} y={820} icon="khata" color={C.amber}>আর মুখস্থ নয়</Pill>
    </SceneShell>
  );
};

// 6. Website + live order
export const Phone: React.FC<{ src: string; scroll?: number; width?: number }> = ({ src, scroll = 0, width = 380 }) => {
  const h = width * 2.1;
  return (
    <div style={{ width, height: h, borderRadius: width * 0.14, background: "#0E0B1F", padding: width * 0.035, boxShadow: "0 50px 100px rgba(0,0,0,0.6), 0 0 0 2px #3A3360, 0 0 70px rgba(109,74,255,0.4)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: width * 0.11, overflow: "hidden", background: "#F7F6FB" }}>
        <Img src={M(`cap/${src}.png`)} style={{ position: "absolute", width: "100%", top: -scroll }} />
        <div style={{ position: "absolute", top: width * 0.03, left: "50%", width: width * 0.3, height: width * 0.075, marginLeft: -width * 0.15, borderRadius: 99, background: "#0E0B1F" }} />
      </div>
    </div>
  );
};

const Order: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = L.order.len;
  const ph = spring({ frame: f, fps, config: { damping: 16 } });
  const ARR = 150; // order lands
  const toast = spring({ frame: f - ARR, fps, config: { damping: 12, stiffness: 160 } });
  const packet = lerp(f, ARR - 32, ARR, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <SceneShell len={len} hue={-10}>
      <Tag n="04" label="Website + Order" />
      <div style={{ position: "absolute", top: 50, width: "100%" }}><Words text="নিজের Website, লাইভ Order" at={4} size={64} hl={["Website,", "Order"]} /></div>
      <div style={{ position: "absolute", left: 120, top: 190, transform: `translateY(${(1 - ph) * 600}px) rotate(${-6 + 3 * ph}deg)` }}>
        <Phone src="m_shop_full" scroll={lerp(f, 40, 200, 0, 260, Easing.inOut(Easing.quad))} width={360} />
      </div>
      <Pill at={30} x={300} y={150} icon="website">দোকান খোলার দিনেই তৈরি</Pill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-end", paddingTop: 120, paddingRight: 90, perspective: 2400 }}>
        <div style={{ transform: `rotateY(${lerp(f, 0, len, -9, -4)}deg)` }}>
          <Browser src={(fr) => (fr < ARR ? "orders0" : "orders3")} fade={{ at: ARR, from: "orders0" }} width={1250} url="mohajon.app/app/orders"
            cam={[{ f: 0, z: 1, x: 960, y: 540 }, { f: 120, z: 1, x: 960, y: 540 }, { f: 160, z: 1.7, x: 560, y: 380 }, { f: 260, z: 1.8, x: 560, y: 360 }]} />
        </div>
      </AbsoluteFill>
      {/* order packet flying phone → desktop */}
      {packet > 0 && packet < 1 && (
        <div style={{ position: "absolute", left: interpolate(packet, [0, 1], [430, 900]), top: interpolate(packet, [0, 0.5, 1], [600, 330, 420]), width: 70, height: 70, borderRadius: 20,
          background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`, boxShadow: `0 0 40px ${C.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38 }}>🛒</div>
      )}
      {/* toast */}
      <div style={{ position: "absolute", right: 110, top: 175, transform: `translateY(${(1 - toast) * -160}px)`, opacity: toast, display: "flex", gap: 18, alignItems: "center",
        background: "white", borderRadius: 22, padding: "18px 28px", boxShadow: "0 30px 70px rgba(0,0,0,0.45)", fontFamily: FONT, borderLeft: `8px solid ${C.green}` }}>
        <Img src={M("marks/online-order.png")} style={{ width: 64, height: 64, borderRadius: 12 }} />
        <div><div style={{ fontSize: 32, color: C.ink }}>🔔 নতুন Order এসেছে!</div><div style={{ fontSize: 24, color: "#6B6496" }}>নুসরাত জাহান · কোর্ট রোড, মৌলভীবাজার</div></div>
      </div>
    </SceneShell>
  );
};

// 7. Alerts — expiry, stock, purchase list
const Alert: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = L.alert.len;
  const cards = [
    { src: "expiry", url: "mohajon.app/app/expiry", at: 0, cam: [{ f: 0, z: 1.45, x: 900, y: 430 }] },
    { src: "home_scroll", url: "mohajon.app/app", at: 10, cam: [{ f: 0, z: 1.6, x: 1500, y: 600 }] },
    { src: "purchase", url: "mohajon.app/app/purchase", at: 20, cam: [{ f: 0, z: 1.45, x: 900, y: 400 }] },
  ];
  return (
    <SceneShell len={len} hue={15}>
      <Tag n="05" label="মেয়াদ · Stock · কেনার তালিকা" />
      <div style={{ position: "absolute", top: 50, width: "100%" }}><Words text="সব আগেভাগেই জানিয়ে দেয়" at={4} size={64} hl={["আগেভাগেই"]} /></div>
      <AbsoluteFill style={{ perspective: 2000, justifyContent: "center", alignItems: "center", paddingTop: 140 }}>
        {cards.map((c, i) => {
          const p = spring({ frame: f - c.at, fps, config: { damping: 16 } });
          const off = i - 1;
          const focus = lerp(f, 60 + i * 40, 80 + i * 40, 0, 1) * (1 - lerp(f, 100 + i * 40, 120 + i * 40, 0, 1));
          return (
            <div key={i} style={{ position: "absolute", transform: `translateX(${off * 600 * (1 - focus * 0.85)}px) translateZ(${-150 + focus * 520 - Math.abs(off) * 60}px) rotateY(${-off * 24 * (1 - focus)}deg) translateY(${(1 - p) * 500}px)`, opacity: p, zIndex: focus > 0.5 ? 5 : 3 - Math.abs(off) }}>
              <Browser src={c.src} width={860} url={c.url} cam={c.cam} />
            </div>
          );
        })}
      </AbsoluteFill>
      <Pill at={40} x={380} y={900} icon="pharmacy" color={C.red}>⚠ মেয়াদ ঘনিয়ে আসছে</Pill>
      <Pill at={80} x={960} y={960} icon="stock" color={C.amber}>Stock ফুরিয়ে আসছে</Pill>
      <Pill at={120} x={1540} y={900} icon="online-order" color={C.green}>কী কিনতে হবে — তালিকা তৈরি</Pill>
    </SceneShell>
  );
};

// 8. Report + AI
const Bubble: React.FC<{ at: number; me?: boolean; children: string; w?: number }> = ({ at, me, children, w = 560 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 14 } });
  const chars = me ? children.length : Math.floor(lerp(f, at + 8, at + 8 + children.length * 0.9, 0, children.length, Easing.linear));
  return (
    <div style={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: w, opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.9 + 0.1 * p})`, transformOrigin: me ? "100% 100%" : "0 100%",
      background: me ? C.violet : "white", color: me ? "white" : C.ink, padding: "18px 24px", borderRadius: 24, fontSize: 30, lineHeight: 1.45, fontFamily: FONT,
      borderBottomRightRadius: me ? 6 : 24, borderBottomLeftRadius: me ? 24 : 6, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
      {me ? children : [...children].slice(0, chars).join("")}
    </div>
  );
};

const Report: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = L.report.len;
  const SW = 105;
  const p = spring({ frame: f, fps, config: { damping: 18 } });
  const chat = spring({ frame: f - SW, fps, config: { damping: 16 } });
  return (
    <SceneShell len={len} hue={-15}>
      <Tag n="06" label="Report + AI সহকারী" />
      <div style={{ position: "absolute", top: 50, width: "100%" }}><Words text={f < SW ? "দিন, সপ্তাহ, মাসের রিপোর্ট" : "AI সহকারী — আপনার হিসাব দেখেই"} at={f < SW ? 4 : SW} size={64} hl={["রিপোর্ট", "AI", "সহকারী"]} /></div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", paddingTop: 150, paddingLeft: 100, perspective: 2400 }}>
        <div style={{ transform: `rotateY(${lerp(f, 0, len, 8, 3)}deg) translateY(${(1 - p) * 400}px)` }}>
          <Browser src={(fr) => (fr < SW ? "reports" : "ai")} fade={{ at: SW, from: "reports" }} width={f < SW ? 1500 : 1150} url={f < SW ? "mohajon.app/app/reports" : "mohajon.app/app/ai"}
            cam={[{ f: 0, z: 1, x: 960, y: 540 }, { f: 30, z: 1.5, x: 1100, y: 300 }, { f: 80, z: 1.6, x: 700, y: 520 }, { f: SW, z: 1.0, x: 960, y: 540 }, { f: SW + 60, z: 1.25, x: 900, y: 400 }]} />
        </div>
      </AbsoluteFill>
      {f >= SW && (
        <div style={{ position: "absolute", right: 80, top: 220, width: 640, padding: 28, borderRadius: 32, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.25)",
          display: "flex", flexDirection: "column", gap: 18, opacity: chat, transform: `translateX(${(1 - chat) * 300}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, color: "white", fontSize: 30 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center" }}>✦</div>
            Mohajon সহকারী <span style={{ marginLeft: "auto", fontSize: 20, color: C.lilac }}>শুধু আপনার তথ্য</span>
          </div>
          <Bubble at={SW + 12} me>করিম মিয়া টাকাটা কবে দেবে?</Bubble>
          <Bubble at={SW + 34}>ওঁর কাছে ৪৩০ টাকা বাকি, এটুকু জানি। কবে দেবেন — খাতায় লেখা নেই, তাই বানিয়ে বলছি না।</Bubble>
        </div>
      )}
      {f < SW && <Pill at={20} x={1700} y={300} icon="report" color={C.cyan}>লাভ · আদায় · ছাড়</Pill>}
    </SceneShell>
  );
};

// 9. Trades + stats
const TRADES: [string, string][] = [
  ["grocery", "মুদি দোকান"], ["pharmacy", "ফার্মেসি"], ["restaurant", "রেস্টুরেন্ট"], ["hotel", "হোটেল"], ["resort", "রিসোর্ট"], ["houseboat", "হাউসবোট"],
  ["fashion", "কাপড়ের দোকান"], ["salon", "সেলুন ও পার্লার"], ["furniture", "ফার্নিচার"], ["electronics", "ইলেকট্রনিক্স"], ["garage", "গ্যারেজ"], ["bakery", "বেকারি"],
  ["sweets", "মিষ্টির দোকান"], ["jewellery", "জুয়েলার্স"], ["laundry", "লন্ড্রি"], ["nursery", "নার্সারি"], ["tea", "চায়ের দোকান"], ["fish-meat", "মাছ ও মাংস"],
  ["agriculture", "কৃষি সামগ্রী"], ["online", "অনলাইন ব্যবসা"], ["mobile-app", "ফ্লেক্সিলোড"],
];
const bn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
const Trades: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = L.trades.len;
  const ST = 150;
  const gridOut = lerp(f, ST - 10, ST + 5, 0, 1);
  const stats = [[39, "ব্যবসার ধরন"], [64, "জেলায় ঠিকানা"], [0, "টাকায় শুরু"]] as const;
  return (
    <SceneShell len={len}>
      <Tag n="07" label="সব ধরনের ব্যবসা" />
      <AbsoluteFill style={{ opacity: 1 - gridOut, transform: `scale(${1 + gridOut * 0.2}) rotate(${-4 + f * 0.02}deg)`, justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 240px)", gap: 22, transform: `translateX(${Math.sin(f / 60) * 30}px)` }}>
          {TRADES.map(([icon, label], i) => {
            const p = spring({ frame: f - 4 - ((i % 7) + Math.floor(i / 7)) * 3, fps, config: { damping: 13 } });
            return (
              <div key={icon} style={{ height: 220, borderRadius: 26, background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
                transform: `scale(${p}) rotateZ(${(1 - p) * 20}deg)`, opacity: p, boxShadow: "0 25px 50px rgba(0,0,0,0.35)" }}>
                <Img src={M(`marks/${icon}.png`)} style={{ width: 130, height: 130 }} />
                <div style={{ fontFamily: FONT, fontSize: 28, color: C.ink }}>{label}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {f > ST - 10 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 70 }}>
          <div style={{ display: "flex", gap: 60 }}>
            {stats.map(([n, label], i) => {
              const p = spring({ frame: f - ST - i * 8, fps, config: { damping: 12 } });
              const v = Math.round(lerp(f, ST + i * 8, ST + i * 8 + 35, 0, n, Easing.out(Easing.cubic)));
              return (
                <div key={label} style={{ width: 440, padding: "40px 0", borderRadius: 36, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center", transform: `translateY(${(1 - p) * 200}px)`, opacity: p, fontFamily: FONT }}>
                  <div style={{ fontSize: 170, lineHeight: 1, background: `linear-gradient(180deg, #fff, ${C.lilac})`, WebkitBackgroundClip: "text", color: "transparent" }}>{bn(v)}</div>
                  <div style={{ fontSize: 44, color: "white", marginTop: 10 }}>{label}</div>
                </div>
              );
            })}
          </div>
          <Pill at={ST + 50} x={960} y={850} icon="offline" color={C.cyan} size={42} float={false}>Internet ছাড়াও বিক্রি চলে — পরে নিজেই মিলে যায়</Pill>
        </AbsoluteFill>
      )}
    </SceneShell>
  );
};

// 10. CTA
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = L.cta.len;
  const logo = spring({ frame: f - 8, fps, config: { damping: 12 } });
  const btn = spring({ frame: f - 40, fps, config: { damping: 10 } });
  const final = s(5.6);
  const hit = spring({ frame: f - final, fps, config: { damping: 8, stiffness: 200 } });
  const pulse = 1 + 0.04 * Math.sin(f / 6);
  return (
    <SceneShell len={len + 30} bg={false}>
      <AbsoluteFill>
        <Img src={M("brand/pharmacy-front.png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + f * 0.0012})`, filter: "blur(3px) brightness(0.55)" }} />
        <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(10,7,24,0.55), rgba(42,20,120,0.75) 60%, rgba(10,7,24,0.95))` }} />
        <Particles n={35} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 34 }}>
        <Img src={M("brand/wordmark-white.png")} style={{ width: 520 + hit * 60, opacity: logo, transform: `scale(${0.7 + 0.3 * logo})`, filter: `drop-shadow(0 0 ${30 + hit * 40}px ${C.violet})` }} />
        <Words text="আপনার দোকানটাও আজই ডিজিটাল হোক" at={14} size={72} hl={["ডিজিটাল"]} />
        <div style={{ transform: `scale(${btn * pulse})`, opacity: btn, display: "flex", alignItems: "center", gap: 18, padding: "26px 60px", borderRadius: 999, fontFamily: FONT, fontSize: 52, color: "white",
          background: `linear-gradient(135deg, ${C.violet}, ${C.violet2})`, boxShadow: `0 20px 60px rgba(109,74,255,0.7), 0 0 0 ${6 + 6 * Math.sin(f / 6)}px rgba(139,108,255,0.25)` }}>
          বিনামূল্যে শুরু করুন →
        </div>
        <div style={{ display: "flex", gap: 40, fontFamily: FONT, fontSize: 30, color: C.lilac, opacity: lerp(f, 60, 75, 0, 1) }}>
          <span>✓ কার্ড লাগে না</span><span>✓ ৫ মিনিটেই চালু</span><span>✓ ৩৯ ধরনের ব্যবসা</span>
        </div>
        <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 46, color: "white", letterSpacing: 2, opacity: lerp(f, 75, 90, 0, 1), transform: `translateY(${lerp(f, 75, 90, 20, 0)}px)` }}>mohajon.pages.dev</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "white", opacity: interpolate(f, [final, final + 3, final + 14], [0, 0.7, 0], clamp) }} />
    </SceneShell>
  );
};

const VIEWS: Record<string, React.FC> = { hook: Hook, logo: Logo, dash: Dash, pos: Pos, khata: Khata, order: Order, alert: Alert, report: Report, trades: Trades, cta: Cta };

// ---------- sound design ----------
type Fx = { at: number; sfx: string; vol?: number };
const FX: Fx[] = [
  { at: L.hook.from + 4, sfx: "paper", vol: 0.5 }, { at: L.hook.from + 70, sfx: "pop", vol: 0.5 }, { at: L.hook.from + 115, sfx: "pop", vol: 0.5 }, { at: L.hook.from + 175, sfx: "pop", vol: 0.5 },
  { at: L.logo.from - 70, sfx: "riser", vol: 0.45 }, { at: L.logo.from, sfx: "impact", vol: 0.8 }, { at: L.logo.from + 42, sfx: "shimmer", vol: 0.55 },
  { at: L.dash.from + 95, sfx: "tick", vol: 0.3 },
  { at: L.pos.from + 34, sfx: "pop", vol: 0.6 }, { at: L.pos.from + 64, sfx: "pop", vol: 0.6 }, { at: L.pos.from + 92, sfx: "pop", vol: 0.6 }, { at: L.pos.from + 134, sfx: "cash", vol: 0.6 },
  { at: L.khata.from + 70, sfx: "whoosh", vol: 0.4 }, { at: L.khata.from + 80, sfx: "tick", vol: 0.3 },
  { at: L.order.from + 118, sfx: "whoosh", vol: 0.4 }, { at: L.order.from + 150, sfx: "notify", vol: 0.7 },
  { at: L.alert.from + 40, sfx: "pop", vol: 0.45 }, { at: L.alert.from + 80, sfx: "pop", vol: 0.45 }, { at: L.alert.from + 120, sfx: "pop", vol: 0.45 },
  { at: L.report.from + 105, sfx: "whoosh", vol: 0.4 }, { at: L.report.from + 117, sfx: "pop", vol: 0.5 }, { at: L.report.from + 139, sfx: "tick", vol: 0.25 },
  { at: L.trades.from + 140, sfx: "whoosh", vol: 0.45 }, { at: L.trades.from + 150, sfx: "tick", vol: 0.3 },
  { at: L.cta.from + 40, sfx: "shimmer", vol: 0.4 }, { at: L.cta.from + s(5.6), sfx: "impact", vol: 0.7 },
];
// whoosh on every cut
for (const sc of SCENES.slice(2)) FX.push({ at: L[sc.id].from - 6, sfx: "whoosh", vol: 0.35 });

export const Mohajon: React.FC = () => {
  const f = useCurrentFrame();
  const total = MOHAJON_TOTAL;
  // duck the bed while the narrator speaks
  const speaking = SCENES.some((sc) => { const l = L[sc.id]; return f >= l.from + l.voAt - 6 && f < l.from + l.len - 12; });
  const music = (fr: number) => {
    const base = interpolate(fr, [0, 20, total - 90, total], [0, 1, 1, 0], clamp);
    const sp = SCENES.reduce((m, sc) => { const l = L[sc.id]; const a = l.from + l.voAt; return Math.max(m, interpolate(fr, [a - 10, a, l.from + l.len - 14, l.from + l.len], [0, 1, 1, 0], clamp)); }, 0);
    return base * (0.5 - 0.3 * sp);
  };
  void speaking;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {SCENES.map((sc) => {
        const l = L[sc.id];
        const V = VIEWS[sc.id];
        return (
          <Sequence key={sc.id} from={l.from} durationInFrames={sc.id === "cta" ? l.len : l.len}>
            <V />
          </Sequence>
        );
      })}
      {SCENES.slice(2).map((sc) => <Sequence key={"sw" + sc.id} from={L[sc.id].from - 4} durationInFrames={14}><SwipeFlash /></Sequence>)}
      {/* corner logo bug after the reveal */}
      <Sequence from={L.dash.from} durationInFrames={L.cta.from - L.dash.from}>
        <Img src={M("brand/wordmark-white.png")} style={{ position: "absolute", right: 60, top: 44, width: 170, opacity: 0.85 }} />
      </Sequence>
      {/* audio */}
      <Audio src={M("music.mp3")} volume={music} />
      {SCENES.map((sc) => <Sequence key={"vo" + sc.id} from={L[sc.id].from + L[sc.id].voAt}><Audio src={M(`vo/${String(sc.vo).padStart(2, "0")}.mp3`)} volume={1} /></Sequence>)}
      {FX.map((x, i) => <Sequence key={"fx" + i} from={Math.max(0, x.at)} durationInFrames={s(3)}><Audio src={M(`sfx/${x.sfx}.mp3`)} volume={x.vol ?? 0.5} /></Sequence>)}
    </AbsoluteFill>
  );
};
