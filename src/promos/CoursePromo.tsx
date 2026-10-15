// AI University course promo engine — one JSON spec per course (src/promos/<id>.json, timed by scripts/promo_make.py).
// Same dark brand system as CFEPromo (music/SFX public/aiu2, VO public/promos/<id>/vo). Scene types:
// hook · intro · modules · points · steps · warn · cert · cta      (icons = lucide names in kebab-case)
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random, delayRender, continueRender } from "remotion";
import { icons, GraduationCap, Sparkles, ShieldCheck, BookOpen, TriangleAlert, Check } from "lucide-react";

const C = { ink: "#060913", line: "rgba(255,255,255,.09)", card: "rgba(255,255,255,.04)", text: "#F2F4FA", mute: "#8D95B5", dim: "#5A6285", a1: "#7C83FF", a2: "#38D3F5", gold: "#E7B95A", green: "#3DDC97", amber: "#F59E0B", red: "#FF6B6B" };
const ACC = ["#7C83FF", "#38D3F5", "#3DDC97", "#E7B95A", "#F178B6", "#FF9F5A", "#A78BFA", "#5EEAD4"];
const BN = "Anek", EN = "Montserrat";
if (typeof document !== "undefined") {
  for (const [n, u] of [["Anek", "fonts/AnekBangla.ttf"], ["Montserrat", "fonts/Montserrat.ttf"]]) {
    // hold the render until the font is in: cloud runners don't have Anek Bangla installed, so frames rendered before it loads fall back to another font
    const h = delayRender(`font ${n}`);
    const f = new FontFace(n, `url(${staticFile(u)})`, { weight: "100 900" });
    f.load().then(() => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
  }
}
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const bn = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
const ent = (f: number, fps: number, d: number, dur = 26) => spring({ frame: f - d, fps, config: { damping: 200 }, durationInFrames: dur });
const pop = (f: number, fps: number, d: number) => spring({ frame: f - d, fps, config: { damping: 13, mass: 0.6 } });
const pascal = (k: string) => k.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("");
const Ico: React.FC<{ name: string; size: number; color: string; sw?: number }> = ({ name, size, color, sw = 1.7 }) => {
  const I = (icons as Record<string, React.FC<any>>)[pascal(name)] || Sparkles;
  return <I size={size} color={color} strokeWidth={sw} />;
};

export type PScene = { type: string; vo: string; frames: number; [k: string]: any };
export type PSpec = { id: string; title: [string, string]; label?: string; accent?: [string, string]; cover?: boolean; scenes: PScene[] };
const LEAD = 14, TAIL = 16, FIRST = 30, LAST = 110;
const lens = (s: PSpec) => s.scenes.map((x, i) => (i === 0 ? FIRST : LEAD) + x.frames + (i === s.scenes.length - 1 ? LAST : TAIL));
export const promoLen = (s: PSpec) => lens(s).reduce((a, b) => a + b, 0);
type P = { s: PScene; spec: PSpec; lead: number; vo: number; len: number; g: string };
const at = (p: P, x: number) => p.lead + p.vo * x;

/* ---------- primitives ---------- */
const Line: React.FC<{ d: number; size: number; children: React.ReactNode; color?: string; weight?: number; g?: string }> = ({ d, size, children, color = C.text, weight = 700, g }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = ent(f, fps, d, 30);
  // gradient text sits on the inner element only (clip + gradient on one node renders as a white box)
  return (
    <div style={{ overflow: "hidden", paddingTop: size * 0.18, paddingBottom: size * 0.22, marginTop: -size * 0.18, marginBottom: -size * 0.22 }}>
      <div style={{ transform: `translateY(${(1 - s) * 115}%)`, opacity: interpolate(s, [0, 0.3], [0, 1], clamp) }}>
        <span style={{ fontFamily: BN, fontSize: size, fontWeight: weight, lineHeight: 1.25, ...(g ? { background: g, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : { color }) }}>{children}</span>
      </div>
    </div>
  );
};
const Label: React.FC<{ d: number; text: string; color?: string }> = ({ d, text, color = C.a2 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = ent(f, fps, d);
  return <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: s }}><div style={{ width: 56 * s, height: 2, background: color }} /><span style={{ fontFamily: EN, fontSize: 22, fontWeight: 700, letterSpacing: "0.32em", color }}>{text}</span></div>;
};
const Mark: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.26, background: `linear-gradient(140deg, ${C.a1}, ${C.a2})`, display: "grid", placeItems: "center", boxShadow: `0 ${size * 0.12}px ${size * 0.4}px ${C.a1}55` }}><GraduationCap size={size * 0.56} color="#fff" strokeWidth={1.7} /></div>
);
const Brand: React.FC<{ size?: number }> = ({ size = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 * size }}><Mark size={46 * size} /><div style={{ fontFamily: EN, color: C.text, lineHeight: 1.1 }}><div style={{ fontSize: 20 * size, fontWeight: 800, letterSpacing: "0.12em" }}>AI UNIVERSITY</div><div style={{ fontSize: 11 * size, fontWeight: 600, letterSpacing: "0.42em", color: C.mute }}>OF BANGLADESH</div></div></div>
);
const Head: React.FC<{ p: P; label?: string; head?: [string, string]; color?: string }> = ({ p, label, head, color }) => (
  <div style={{ position: "absolute", left: 150, top: 110 }}>
    {label && <Label d={4} text={label} />}
    {head && <div style={{ marginTop: 24 }}><Line d={8} size={74} weight={800}>{head[0]}<span style={{ color: color || p.spec.accent?.[1] || C.a2 }}>{head[1]}</span></Line></div>}
  </div>
);

const DUST = Array.from({ length: 34 }, (_, i) => ({ x: random("x" + i) * 1920, y: random("y" + i) * 1080, s: random("s" + i) * 2 + 0.8, v: random("v" + i) * 0.35 + 0.1, o: random("o" + i) * 0.3 + 0.1 }));
const Stage: React.FC<{ a1: string; a2: string }> = ({ a1, a2 }) => {
  const f = useCurrentFrame(); const a = f / 140;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill style={{ background: `radial-gradient(1100px 760px at ${30 + Math.sin(a) * 12}% ${28 + Math.cos(a) * 10}%, ${a1}26, transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(900px 700px at ${78 + Math.cos(a * 0.8) * 10}% ${80 + Math.sin(a * 0.7) * 8}%, ${a2}1c, transparent 70%)` }} />
      <AbsoluteFill style={{ opacity: 0.5, backgroundImage: "radial-gradient(rgba(255,255,255,.16) 1px, transparent 1.2px)", backgroundSize: "36px 36px", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 85%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>{DUST.map((d, i) => <circle key={i} cx={d.x + Math.sin((f + i * 40) / 90) * 20} cy={((d.y - f * d.v) % 1080 + 1080) % 1080} r={d.s} fill="#C9D2FF" opacity={d.o} />)}</svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
const Wrap: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const i = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: ease });
  const o = interpolate(f, [len - 12, len], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  return <AbsoluteFill style={{ opacity: Math.min(i, o), transform: `scale(${interpolate(f, [0, len], [1, 1.035]) * (1.04 - 0.04 * i)})`, filter: `blur(${(1 - Math.min(i, o)) * 8}px)` }}>{children}</AbsoluteFill>;
};

/* ---------- scenes ---------- */
// hook: {big:[a, hi, b], sub, icons:[...]} — question that names the viewer's problem, floating icons around
const SHook: React.FC<P> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const { s } = p;
  const spots = [[260, 230], [1560, 210], [380, 770], [1500, 760], [960, 150], [150, 500], [1760, 480]];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {(s.icons || []).map((n: string, k: number) => { const [x, y] = spots[k % spots.length]; const q = pop(f, fps, k * 10); return <div key={k} style={{ position: "absolute", left: x, top: y + Math.sin((f + k * 20) / 20) * 14, opacity: q * 0.55, transform: `translate(-50%,-50%) scale(${q}) rotate(${(k % 2 ? 1 : -1) * 10}deg)` }}><Ico name={n} size={92} color={ACC[k % ACC.length]} sw={1.4} /></div>; })}
      <div style={{ textAlign: "center", maxWidth: 1600 }}>
        <Line d={at(p, 0)} size={s.size || 108} weight={800}>{s.big[0]}<span style={{ color: C.gold }}>{s.big[1]}</span>{s.big[2] || ""}</Line>
        {s.sub && <div style={{ marginTop: 36 }}><Line d={at(p, 0.45)} size={54} weight={500} color={C.mute}>{s.sub}</Line></div>}
      </div>
    </AbsoluteFill>
  );
};
// intro: course name card with a big animated icon cluster on the right
const SIntro: React.FC<P> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const { s, spec } = p;
  const badge = pop(f, fps, at(p, 0.75));
  const orbit = s.icons || [];
  const img = ent(f, fps, 0, 50);
  return (
    <AbsoluteFill>
      {spec.cover && <AbsoluteFill style={{ opacity: img }}>
        <Img src={staticFile(`promos/${spec.id}/cover.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [0, p.len], [1.12, 1.02])})` }} />
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(6,9,19,.96) 0%, rgba(6,9,19,.82) 42%, rgba(6,9,19,.2) 75%, rgba(6,9,19,.1))" }} />
      </AbsoluteFill>}
      <div style={{ position: "absolute", left: 140, top: 170, width: 1000 }}>
        <div style={{ opacity: ent(f, fps, at(p, 0.05)) }}><Brand size={1.2} /></div>
        <div style={{ marginTop: 70 }}><Label d={at(p, 0.25)} text={spec.label || "FREE COURSE"} /></div>
        <div style={{ marginTop: 26 }}>
          <Line d={at(p, 0.3)} size={98} weight={800}>{spec.title[0]}</Line>
          <Line d={at(p, 0.4)} size={70} weight={700} g={p.g}>{spec.title[1]}</Line>
        </div>
        {s.badge && <div style={{ marginTop: 50, display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 34px", borderRadius: 60, background: C.green, color: "#05261A", fontFamily: BN, fontSize: 42, fontWeight: 800, transform: `scale(${badge})`, opacity: badge, boxShadow: `0 20px 60px ${C.green}55` }}><Sparkles size={38} /> {s.badge}</div>}
      </div>
      {!spec.cover && <div style={{ position: "absolute", left: 1480, top: 540 }}>
        <div style={{ position: "absolute", transform: `translate(-50%,-50%) scale(${pop(f, fps, 6)})`, width: 260, height: 260, borderRadius: 70, background: p.g, display: "grid", placeItems: "center", boxShadow: `0 40px 120px ${spec.accent?.[0] || C.a1}66` }}><Ico name={s.icon || "sparkles"} size={140} color="#fff" sw={1.5} /></div>
        {orbit.map((n: string, k: number) => {
          const ang = (k / orbit.length) * Math.PI * 2 + f / 90; const r = 300; const q = pop(f, fps, 12 + k * 6);
          return <div key={k} style={{ position: "absolute", left: Math.cos(ang) * r, top: Math.sin(ang) * r * 0.85, transform: `translate(-50%,-50%) scale(${q})`, width: 104, height: 104, borderRadius: 30, background: "rgba(255,255,255,.06)", border: `1px solid ${C.line}`, display: "grid", placeItems: "center" }}><Ico name={n} size={52} color={ACC[k % ACC.length]} /></div>;
        })}
      </div>}
    </AbsoluteFill>
  );
};
// modules: {label, head, mods:[[icon, text]], total:"৩০+ পাঠ…"}
const SModules: React.FC<P> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const { s } = p;
  const n = s.mods.length; const cols = n > 6 ? 4 : 3;
  return (
    <AbsoluteFill>
      <Head p={p} label={s.label || "WHAT YOU WILL LEARN"} head={s.head} />
      <div style={{ position: "absolute", left: 150, right: 150, top: 330, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 24 }}>
        {s.mods.map(([icon, t]: string[], i: number) => {
          const d = at(p, 0.04 + (i / n) * 0.82); const q = ent(f, fps, d, 30);
          const lit = interpolate(f, [d, d + 8, d + 70, d + 100], [0, 1, 1, 0.3], clamp); const c = ACC[i % ACC.length];
          return (
            <div key={i} style={{ height: n > 6 ? 220 : 240, borderRadius: 26, padding: "28px 28px", background: `linear-gradient(160deg, ${c}${Math.round((0.08 + lit * 0.14) * 255).toString(16).padStart(2, "0")}, ${C.card})`, border: `1px solid ${c}${Math.round((0.2 + lit * 0.5) * 255).toString(16).padStart(2, "0")}`, opacity: q, transform: `translateY(${(1 - q) * 70}px)`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: 74, height: 74, borderRadius: 22, display: "grid", placeItems: "center", background: `${c}22` }}><Ico name={icon} size={40} color={c} /></div>
                <span style={{ fontFamily: EN, fontSize: 22, fontWeight: 800, color: C.dim }}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div style={{ fontFamily: BN, fontSize: 34, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
// points: {label, head, items:[[icon, title, desc]]} — feature/topic cards in a row (3–4)
const SPoints: React.FC<P> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const { s } = p;
  const n = s.items.length;
  return (
    <AbsoluteFill>
      <Head p={p} label={s.label} head={s.head} />
      <div style={{ position: "absolute", left: 150, right: 150, top: 360, display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 26 }}>
        {s.items.map(([icon, t, d]: string[], i: number) => {
          const st = at(p, 0.08 + (i / n) * 0.75); const q = ent(f, fps, st, 30); const c = ACC[(i + 1) % ACC.length];
          const on = interpolate(f, [st, st + 10, st + p.vo / n + 10, st + p.vo / n + 30], [0, 1, 1, 0.4], clamp);
          return (
            <div key={i} style={{ padding: "40px 34px", borderRadius: 28, background: C.card, border: `1px solid ${c}${Math.round((0.18 + on * 0.55) * 255).toString(16).padStart(2, "0")}`, opacity: q, transform: `translateY(${(1 - q) * 70}px) scale(${1 + on * 0.03})`, boxShadow: on > 0.5 ? `0 30px 80px ${c}22` : "none" }}>
              <div style={{ width: 96, height: 96, borderRadius: 28, background: `${c}22`, display: "grid", placeItems: "center" }}><Ico name={icon} size={52} color={c} /></div>
              <div style={{ fontFamily: BN, fontSize: 40, fontWeight: 800, color: C.text, marginTop: 30, lineHeight: 1.25 }}>{t}</div>
              {d && <div style={{ fontFamily: BN, fontSize: 28, color: C.mute, marginTop: 14, lineHeight: 1.45 }}>{d}</div>}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
// steps: {label, head, steps:[[icon, text]]} — a horizontal flow with an animated connector
const SSteps: React.FC<P> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const { s } = p;
  const n = s.steps.length; const W = 1620; const gap = W / n;
  const prog = interpolate(f, [at(p, 0.05), at(p, 0.9)], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill>
      <Head p={p} label={s.label} head={s.head} />
      <div style={{ position: "absolute", left: 150 + gap / 2, top: 540, width: W - gap, height: 6, borderRadius: 3, background: "rgba(255,255,255,.08)" }}>
        <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 3, background: p.g }} />
      </div>
      {s.steps.map(([icon, t]: string[], i: number) => {
        const th = n > 1 ? i / (n - 1) : 0; const on = prog >= th - 0.001; const q = pop(f, fps, at(p, 0.05 + th * 0.85)); const c = ACC[i % ACC.length];
        return (
          <div key={i} style={{ position: "absolute", left: 150 + gap * i, width: gap, top: 470, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 140, height: 140, borderRadius: 70, background: on ? `${c}26` : C.card, border: `3px solid ${on ? c : C.line}`, display: "grid", placeItems: "center", transform: `scale(${0.6 + q * 0.4})`, opacity: q, boxShadow: on ? `0 0 0 ${10 + Math.sin(f / 6) * 4}px ${c}18` : "none" }}><Ico name={icon} size={64} color={on ? c : C.dim} /></div>
            <div style={{ fontFamily: EN, fontSize: 20, fontWeight: 800, color: C.dim, marginTop: 22 }}>STEP {i + 1}</div>
            <div style={{ fontFamily: BN, fontSize: 32, fontWeight: 700, color: on ? C.text : C.mute, marginTop: 8, lineHeight: 1.3, padding: "0 10px", opacity: q }}>{t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
// warn: {head, do:[...], dont:[...]} — safety card (✔ / ✖ columns)
const SWarn: React.FC<P> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const { s } = p;
  const k = pop(f, fps, 4);
  const col = (items: string[], good: boolean, d0: number) => (
    <div style={{ flex: 1, padding: "34px 38px", borderRadius: 28, background: good ? `${C.green}12` : `${C.red}12`, border: `1px solid ${good ? C.green : C.red}55` }}>
      <div style={{ fontFamily: BN, fontSize: 40, fontWeight: 800, color: good ? C.green : C.red }}>{good ? "যা করবেন" : "যা করবেন না"}</div>
      {items.map((t, i) => { const q = ent(f, fps, at(p, d0 + i * 0.1)); return <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 22, opacity: q, transform: `translateX(${(1 - q) * 30}px)`, fontFamily: BN, fontSize: 34, color: C.text }}><div style={{ width: 40, height: 40, borderRadius: 20, flex: "none", display: "grid", placeItems: "center", background: good ? C.green : C.red, color: C.ink, fontFamily: EN, fontWeight: 900, fontSize: 24 }}>{good ? <Check size={24} strokeWidth={4} /> : "✕"}</div>{t}</div>; })}
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 110, display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ width: 96, height: 96, borderRadius: 26, background: C.amber, display: "grid", placeItems: "center", transform: `scale(${k}) rotate(${(1 - k) * -20}deg)` }}><TriangleAlert size={56} color="#fff" /></div>
        <Line d={8} size={70} weight={800} color={C.amber}>{s.head}</Line>
      </div>
      <div style={{ position: "absolute", left: 150, right: 150, top: 300, display: "flex", gap: 30 }}>
        {col(s.do || [], true, 0.05)}{col(s.dont || [], false, 0.45)}
      </div>
    </AbsoluteFill>
  );
};
const QR = Array.from({ length: 17 * 17 }, (_, i) => random("q" + i) > 0.5);
const SCert: React.FC<P> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const { spec, s } = p;
  const c = ent(f, fps, 4, 40); const ok = pop(f, fps, at(p, 0.6));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1100, transform: `perspective(2200px) rotateX(${(1 - c) * 25 + 4}deg) translateY(${(1 - c) * 80}px)`, opacity: c, background: "#FBF8F1", borderRadius: 14, padding: 20, boxShadow: "0 60px 140px rgba(0,0,0,.6)" }}>
        <div style={{ border: "2px solid #C9A24F", outline: "1px solid #C9A24F88", outlineOffset: -10, borderRadius: 6, padding: "44px 56px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}><Mark size={66} /><div><div style={{ fontFamily: EN, fontSize: 24, fontWeight: 800, letterSpacing: "0.14em", color: "#0B1020" }}>AI UNIVERSITY OF BANGLADESH</div><div style={{ fontFamily: EN, fontSize: 15, fontWeight: 600, letterSpacing: "0.32em", color: "#8A7440" }}>CERTIFICATE OF COMPLETION</div></div></div>
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <div style={{ fontFamily: EN, fontSize: 16, letterSpacing: "0.34em", color: "#6B7090" }}>THIS IS TO CERTIFY THAT</div>
            <div style={{ fontFamily: BN, fontSize: 70, fontWeight: 700, color: "#0B1020" }}>আপনার নাম</div>
            <div style={{ width: 460, height: 1.5, background: "#C9A24F", margin: "2px auto 14px" }} />
            <div style={{ fontFamily: BN, fontSize: 40, fontWeight: 700, color: "#0B1020" }}>{s.course || spec.title[0]}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 30, fontFamily: EN, fontSize: 18, color: "#6B7090" }}>
            <span>Certificate ID<br /><b style={{ color: "#0B1020", fontSize: 22 }}>{s.code || "AUB-2026-0001"}</b></span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(17, 6px)", padding: 6, background: "#fff", border: "1px solid #e5e0d0" }}>{QR.map((b, i) => <div key={i} style={{ width: 6, height: 6, background: b ? "#0B1020" : "#fff" }} />)}</div>
            <span style={{ textAlign: "right" }}>Level<br /><b style={{ color: "#0B1020", fontSize: 22 }}>Course Completion</b></span>
          </div>
          <div style={{ position: "absolute", right: -34, top: -34, transform: `scale(${ok}) rotate(-8deg)`, opacity: ok, display: "flex", alignItems: "center", gap: 10, padding: "16px 28px", borderRadius: 40, background: C.green, color: "#05261A", fontFamily: EN, fontSize: 26, fontWeight: 800, boxShadow: `0 16px 40px ${C.green}66` }}><ShieldCheck size={30} strokeWidth={2.4} /> VERIFIED</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
// cta: {chips:[[icon, text]], line2, button}
const SCta: React.FC<P> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const { s, spec } = p;
  const btn = pop(f, fps, at(p, 0.5));
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 120, opacity: ent(f, fps, 4), transform: `scale(${0.9 + ent(f, fps, 4) * 0.1})` }}><Brand size={1.5} /></div>
      <div style={{ position: "absolute", top: 290, display: "flex", gap: 22 }}>
        {(s.chips || []).map(([icon, t]: string[], k: number) => { const q = ent(f, fps, at(p, k * 0.08)); return <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 26px", borderRadius: 40, background: C.card, border: `1px solid ${C.line}`, opacity: q, transform: `translateY(${(1 - q) * 30}px)`, fontFamily: BN, fontSize: 34, color: C.text }}><Ico name={icon} size={32} color={C.a2} />{t}</div>; })}
      </div>
      <div style={{ position: "absolute", top: 450, textAlign: "center" }}>
        <Line d={at(p, 0.3)} size={88} weight={800}>{spec.title[0]}</Line>
        <Line d={at(p, 0.38)} size={64} weight={700} g={p.g}>{s.line2 || spec.title[1]}</Line>
      </div>
      <div style={{ position: "absolute", top: 735, transform: `scale(${btn * (1 + Math.sin(f / 7) * 0.025)})`, opacity: btn, display: "flex", alignItems: "center", gap: 16, padding: "28px 60px", borderRadius: 26, background: p.g, fontFamily: BN, fontSize: 52, fontWeight: 800, color: "#fff", boxShadow: `0 20px 80px ${spec.accent?.[0] || C.a1}aa` }}><BookOpen size={48} /> {s.button || "আজই ফ্রি শুরু করুন"}</div>
    </AbsoluteFill>
  );
};
const MAP: Record<string, React.FC<P>> = { hook: SHook, intro: SIntro, modules: SModules, points: SPoints, steps: SSteps, warn: SWarn, cert: SCert, cta: SCta };
const SFX: Record<string, [string, number, number][]> = { hook: [["swell", 0, 0.5]], intro: [["hit", 0, 0.7], ["chime", -0.75, 0.4]], modules: [["whoosh", 0, 0.45]], points: [["whoosh", 0, 0.45], ["pop", -0.1, 0.4]], steps: [["whoosh", 0, 0.45]], warn: [["hit", 0, 0.5]], cert: [["whoosh", 0, 0.45], ["chime", -0.6, 0.5]], cta: [["hit", 0, 0.6], ["pop", -0.5, 0.5]] };

/* ---------- subtitles ---------- */
const chunks = (spec: PSpec, starts: number[]) => spec.scenes.flatMap((sc, i) => {
  const lead = i === 0 ? FIRST : LEAD;
  const parts = sc.vo.split(/(?<=[।?!,—])\s+/).reduce<string[]>((a, s) => { if (a.length && (a[a.length - 1].length < 22 || s.length < 10)) a[a.length - 1] += " " + s; else a.push(s); return a; }, []);
  const total = parts.reduce((n, s) => n + s.length, 0); let acc = 0;
  return parts.map((s) => { const from = starts[i] + lead + (sc.frames * acc) / total; acc += s.length; return { s, from, to: starts[i] + lead + (sc.frames * acc) / total }; });
});
const Subs: React.FC<{ cs: { s: string; from: number; to: number }[] }> = ({ cs }) => {
  const f = useCurrentFrame(); const c = cs.find((x) => f >= x.from && f < x.to + 4);
  if (!c) return null;
  const o = interpolate(f, [c.from, c.from + 5, c.to, c.to + 4], [0, 1, 1, 0], clamp);
  return <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, display: "flex", justifyContent: "center", opacity: o }}><div style={{ maxWidth: 1500, padding: "10px 28px 14px", borderRadius: 14, background: "rgba(6,9,19,.66)", fontFamily: BN, fontSize: 38, fontWeight: 500, color: "#fff", textAlign: "center", lineHeight: 1.35 }}>{c.s.replace(/[।,]$/, "")}</div></div>;
};

export const CoursePromo: React.FC<{ spec: PSpec }> = ({ spec }) => {
  const L = lens(spec); const starts = L.reduce<number[]>((a, _, i) => [...a, i ? a[i - 1] + L[i - 1] : 0], []);
  const total = promoLen(spec); const [a1, a2] = spec.accent || [C.a1, C.a2]; const g = `linear-gradient(95deg, ${a1}, ${a2})`;
  const cs = chunks(spec, starts);
  const musicVol = (fr: number) => {
    let speaking = false;
    spec.scenes.forEach((sc, i) => { const s0 = starts[i] + (i === 0 ? FIRST : LEAD); if (fr >= s0 - 8 && fr <= s0 + sc.frames + 4) speaking = true; });
    return (speaking ? 0.16 : 0.42) * interpolate(fr, [0, 30], [0, 1], clamp) * interpolate(fr, [total - 80, total], [1, 0], clamp);
  };
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Stage a1={a1} a2={a2} />
      {spec.scenes.map((sc, i) => {
        const S = MAP[sc.type]; const lead = i === 0 ? FIRST : LEAD;
        const p: P = { s: sc, spec, lead, vo: sc.frames, len: L[i], g };
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={L[i]}>
            <Wrap len={L[i]}>{S ? <S {...p} /> : null}</Wrap>
            <Sequence from={lead}><Audio src={staticFile(`promos/${spec.id}/vo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
            {(SFX[sc.type] || []).map(([n, o, v], k) => <Sequence key={k} from={Math.max(0, Math.round(o < 0 ? lead + sc.frames * -o : o))}><Audio src={staticFile(`aiu2/${n}.mp3`)} volume={v} /></Sequence>)}
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", right: 70, top: 50, opacity: 0.85 * interpolate(useCurrentFrame(), [starts[2] || 0, (starts[2] || 0) + 20, total - L[L.length - 1] - 10, total - L[L.length - 1]], [0, 1, 1, 0], clamp) }}><Brand size={0.8} /></div>
      <Subs cs={cs} />
      <Audio src={staticFile("aiu2/music.mp3")} volume={musicVol} />
    </AbsoluteFill>
  );
};
