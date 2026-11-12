// Offer11 — AI University ১১.১১ মেগা অফার promo (2026-11-12). One engine, two shapes:
//   Offer11H 1920x1080 (11 VO lines, ~68 s)  ·  Offer11V 1080x1920 reel (6 VO lines, <30 s).
// Look = the /offer page: deep navy, gold #ffcc4d, pink #ff3d7f, purple #7c4dff, confetti.
// Assets work/puboffer/offer11/{covers,vo-h,vo-v,sfx,music.mp3,logo.png}; lengths src/offer11/durs.json.
// Text rule: never scale text non-uniformly, no letter-spacing on Bangla, line-height >= 1.25.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, delayRender, continueRender, random } from "remotion";
import { Award, BookOpen, Bot, Briefcase, Check, Coffee, FlaskConical, MessageCircle, Plane, PlayCircle, Share2, Smartphone, Store, Users, Zap } from "lucide-react";
import DURS from "./durs.json";

const BN = "AnekO", BODY = "HindO", EN = "MontO";
if (typeof document !== "undefined") {
  const fonts: [string, string, any][] = [
    [BN, "fonts/AnekBangla.ttf", { weight: "100 800", stretch: "75% 125%" }],
    [BODY, "fonts/HindSiliguri-SemiBold.ttf", { weight: "400 600" }],
    [BODY, "fonts/HindSiliguri-Bold.ttf", { weight: "700 900" }],
    [EN, "fonts/Montserrat.ttf", { weight: "100 900" }],
  ];
  for (const [n, u, d] of fonts) {
    const h = delayRender(`font ${n}`);
    const f = new FontFace(n, `url(${staticFile(u)})`, d);
    f.load().then(() => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
  }
}

const C = { bg: "#07060f", bg2: "#120f2a", gold: "#ffcc4d", pink: "#ff3d7f", purple: "#7c4dff", teal: "#5ee0d0", ink: "#ffffff", mute: "#b9b6d3", card: "rgba(255,255,255,.06)", line: "rgba(255,255,255,.14)" };
const GOLD = "linear-gradient(180deg,#fff6cf 0%,#ffcc4d 48%,#f59e0b 100%)";
const HOT = `linear-gradient(100deg,${C.pink},${C.purple})`;
const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const ent = (f: number, d = 0, dur = 18) => interpolate(f, [d, d + dur], [0, 1], { ...clamp, easing: ease });
const pop = (f: number, d = 0, damping = 10) => spring({ frame: f - d, fps: FPS, config: { damping, mass: 0.6, stiffness: 140 } });
const BD = "০১২৩৪৫৬৭৮৯";
const bn = (n: number | string) => String(n).replace(/\d/g, (d) => BD[+d]);
const taka = (n: number) => "৳" + bn(n.toLocaleString("en-US"));
const A = (p: string) => staticFile(`offer11/${p}`);

type Kind = "hook" | "dream" | "pass" | "courses" | "feats" | "price" | "compare" | "reviews" | "free" | "deadline" | "trust" | "cta";
const PLAN: Record<"h" | "v", Kind[]> = {
  h: ["hook", "dream", "pass", "courses", "feats", "price", "compare", "reviews", "free", "deadline", "cta"],
  v: ["hook", "courses", "price", "compare", "trust", "cta"],
};
const PAD = { h: { lead: 8, tail: 12, outro: 54 }, v: { lead: 3, tail: 5, outro: 20 } };
export const timeline = (k: "h" | "v") => {
  let at = 0; const p = PAD[k]; const d = (DURS as any)[k] as number[];
  return d.map((s, i) => { const len = Math.round(s * FPS) + p.lead + p.tail + (i === d.length - 1 ? p.outro : 0); const o = { from: at, len, kind: PLAN[k][i], vo: s }; at += len; return o; });
};
export const offerLen = (k: "h" | "v") => timeline(k).reduce((n, s) => n + s.len, 0);

const COURSES: [string, string][] = [
  ["ielts-prep", "IELTS প্রস্তুতি"], ["spoken-english", "স্পোকেন ইংলিশ"], ["air-ticketing", "এয়ার টিকেটিং (GDS)"], ["computer-basics", "কম্পিউটার"],
  ["japanese-work", "জাপানি ভাষা"], ["korean-eps", "কোরিয়ান ভাষা"], ["arabic-gulf", "আরবি ভাষা"], ["kids", "কিডস কোর্স"],
  ["driving", "ড্রাইভিং"], ["vibe-coding", "ভাইব কোডিং"], ["family-health", "পরিবারের স্বাস্থ্য"], ["snake-rescue", "সাপ উদ্ধার"], ["biggan-velki", "বিজ্ঞান"], ["fish-feed", "মাছের খাবার"],
];
const cov = (id: string) => A(`covers/${id}.jpg`);

/* ------------------------------------------------ shared parts ------------------------------------------------ */
type SP = { f: number; len: number; V: boolean; vo: number };
const useV = () => { const { width, height } = useVideoConfig(); return height > width; };

const Txt: React.FC<{ s: number; w?: number; c?: string; grad?: string; style?: React.CSSProperties; children: React.ReactNode; body?: boolean }> = ({ s, w = 800, c = C.ink, grad, style, children, body }) => (
  <div style={{ fontFamily: body ? BODY : BN, fontSize: s, fontWeight: w, lineHeight: 1.28, color: grad ? "transparent" : c, fontStretch: "100%", ...(grad ? { backgroundImage: grad, WebkitBackgroundClip: "text", backgroundClip: "text", paddingBottom: s * 0.06 } : {}), ...style }}>{children}</div>
);
const Rise: React.FC<{ f: number; d?: number; y?: number; x?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ f, d = 0, y = 46, x = 0, style, children }) => {
  const s = ent(f, d); return <div style={{ opacity: s, transform: `translate(${(1 - s) * x}px,${(1 - s) * y}px)`, ...style }}>{children}</div>;
};
const Pop: React.FC<{ f: number; d?: number; style?: React.CSSProperties; children: React.ReactNode; rot?: number }> = ({ f, d = 0, style, children, rot = 0 }) => {
  const s = pop(f, d); return <div style={{ opacity: interpolate(f, [d, d + 5], [0, 1], clamp), transform: `scale(${0.4 + 0.6 * s}) rotate(${rot * (1 - s) + 0}deg)`, ...style }}>{children}</div>;
};
const Words: React.FC<{ f: number; d?: number; gap?: number; text: string; s: number; w?: number; c?: string; grad?: string; center?: boolean; style?: React.CSSProperties }> = ({ f, d = 0, gap = 4, text, s, w = 800, c = C.ink, grad, center = true, style }) => (
  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: center ? "center" : "flex-start", columnGap: s * 0.26, ...style }}>
    {text.split(" ").map((wd, i) => { const e = ent(f, d + i * gap, 16); return (
      <div key={i} style={{ opacity: e, transform: `translateY(${(1 - e) * s * 0.55}px)` }}><Txt s={s} w={w} c={c} grad={grad}>{wd}</Txt></div>); })}
  </div>
);
const Chip: React.FC<{ s?: number; bg?: string; c?: string; border?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ s = 34, bg = C.card, c = C.ink, border = C.line, children, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: s * 0.36, padding: `${s * 0.34}px ${s * 0.85}px`, borderRadius: 999, background: bg, border: `2px solid ${border}`, color: c, fontFamily: BN, fontWeight: 700, fontSize: s, lineHeight: 1.3, whiteSpace: "nowrap", ...style }}>{children}</div>
);
const Dot: React.FC<{ f: number; s?: number }> = ({ f, s = 16 }) => (
  <div style={{ width: s, height: s, borderRadius: s, background: C.pink, boxShadow: `0 0 0 ${4 + 6 * (0.5 + 0.5 * Math.sin(f / 5))}px rgba(255,61,127,.28)` }} />
);
const Glass: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; hot?: boolean }> = ({ style, children, hot }) => (
  <div style={{ borderRadius: 36, background: hot ? "linear-gradient(160deg,rgba(255,204,77,.16),rgba(124,77,255,.14))" : C.card, border: `2px solid ${hot ? C.gold : C.line}`, boxShadow: hot ? "0 0 90px rgba(255,204,77,.28), 0 30px 80px rgba(0,0,0,.5)" : "0 24px 60px rgba(0,0,0,.35)", ...style }}>{children}</div>
);
const Cover: React.FC<{ id: string; w: number; r?: number; style?: React.CSSProperties }> = ({ id, w, r = 22, style }) => (
  <div style={{ width: w, height: w * 0.5625, borderRadius: r, overflow: "hidden", boxShadow: "0 18px 50px rgba(0,0,0,.55)", border: "2px solid rgba(255,255,255,.18)", flexShrink: 0, ...style }}>
    <Img src={cov(id)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

/* confetti burst from a point (deterministic) */
const Burst: React.FC<{ f: number; at: number; x: number; y: number; n?: number; power?: number; seed?: string }> = ({ f, at, x, y, n = 90, power = 1, seed = "b" }) => {
  const t = f - at; if (t < 0 || t > 70) return null;
  const cols = [C.gold, C.pink, C.purple, C.teal, "#fff"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const a = random(seed + i) * Math.PI * 2, v = (9 + random(seed + "v" + i) * 26) * power, drag = 1 - Math.exp(-t / 14);
        const px = x + Math.cos(a) * v * 14 * drag, py = y + Math.sin(a) * v * 14 * drag - 60 * drag + 0.16 * t * t;
        const sz = 10 + random(seed + "s" + i) * 16, o = interpolate(t, [0, 4, 46, 70], [0, 1, 1, 0], clamp);
        return <div key={i} style={{ position: "absolute", left: px, top: py, width: sz, height: sz * (i % 3 ? 0.45 : 1), borderRadius: i % 3 ? 3 : sz, background: cols[i % 5], opacity: o, transform: `rotate(${t * (6 + (i % 7) * 3) + i * 40}deg)` }} />;
      })}
    </AbsoluteFill>
  );
};
const Ring: React.FC<{ f: number; at: number; x: number; y: number; col?: string; max?: number }> = ({ f, at, x, y, col = C.gold, max = 1500 }) => {
  const t = f - at; if (t < 0 || t > 30) return null; const p = ent(t, 0, 30), sz = max * p;
  return <div style={{ position: "absolute", left: x - sz / 2, top: y - sz / 2, width: sz, height: sz, borderRadius: sz, border: `${10 * (1 - p) + 1}px solid ${col}`, opacity: 1 - p }} />;
};

/* background: navy + drifting aurora + slow confetti rain (like the page hero) */
const Bg: React.FC = () => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const blob = (cx: number, cy: number, r: number, col: string, ph: number) => {
    const x = cx + Math.sin(f / 70 + ph) * 0.08, y = cy + Math.cos(f / 90 + ph) * 0.07;
    return `radial-gradient(${r}px ${r}px at ${x * 100}% ${y * 100}%, ${col}, transparent 70%)`;
  };
  const R = Math.max(W, H);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(170deg, ${C.bg2}, ${C.bg} 60%)` }}>
      <AbsoluteFill style={{ backgroundImage: [blob(0.18, 0.2, R * 0.55, "rgba(124,77,255,.42)", 0), blob(0.85, 0.3, R * 0.5, "rgba(255,61,127,.30)", 2), blob(0.55, 0.95, R * 0.6, "rgba(255,204,77,.16)", 4)].join(",") }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.09) 1.5px, transparent 1.5px)", backgroundSize: "46px 46px", opacity: 0.5, maskImage: "radial-gradient(circle at 50% 50%, #000 20%, transparent 78%)", WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 20%, transparent 78%)" }} />
      {Array.from({ length: 26 }, (_, i) => {
        const sp = 1.6 + random("c" + i) * 2.4, x = random("x" + i) * W + Math.sin(f / 40 + i) * 26, y = ((random("y" + i) * H + f * sp) % (H + 80)) - 40, s = 9 + random("s" + i) * 11;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s * 0.42, borderRadius: 3, background: [C.gold, C.pink, C.purple, C.teal, "#fff"][i % 5], opacity: 0.5, transform: `rotate(${f * (2 + (i % 5)) + i * 30}deg)` }} />;
      })}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, transparent 45%, rgba(0,0,0,.55))" }} />
    </AbsoluteFill>
  );
};

/* scene shell: soft zoom in/out + a light sweep on entry; V keeps the platform safe area */
const Shell: React.FC<{ f: number; len: number; V: boolean; last?: boolean; children: React.ReactNode }> = ({ f, len, V, last, children }) => {
  const { width: W } = useVideoConfig();
  const i = ent(f, 0, 12), o = last ? 0 : interpolate(f, [len - 8, len], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const sw = interpolate(f, [0, 16], [-0.4, 1.4], clamp);
  return (
    <AbsoluteFill style={{ opacity: i * (1 - o), transform: `scale(${1.07 - 0.07 * i - 0.05 * o})` }}>
      <AbsoluteFill style={{ padding: V ? "250px 64px 340px" : "80px 110px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>{children}</AbsoluteFill>
      {f < 17 && <div style={{ position: "absolute", top: "-20%", left: sw * W - 170, width: 340, height: "140%", transform: "rotate(14deg)", background: "linear-gradient(90deg,transparent,rgba(255,236,170,.22),transparent)" }} />}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ scenes ------------------------------------------------ */
const Hook: React.FC<SP> = ({ f, V, vo }) => {
  const { width: W, height: H } = useVideoConfig();
  const big = V ? 310 : 430, l = pop(f, 2, 12), r = pop(f, 6, 12), cy = V ? H * 0.42 : H * 0.36;
  const sub = Math.round(vo * FPS * 0.44);
  return (
    <>
      <Ring f={f} at={10} x={W / 2} y={cy} /><Ring f={f} at={16} x={W / 2} y={cy} col={C.pink} max={2100} />
      <Rise f={f} d={0} y={-30}><Chip s={V ? 44 : 40}><Dot f={f} />সীমিত সময় · শুধু ওয়েবসাইটে</Chip></Rise>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", marginTop: V ? 30 : 6, height: big * 1.22 }}>
        <div style={{ transform: `translateX(${(1 - l) * -700}px) scale(${0.6 + 0.4 * l})`, opacity: Math.min(1, l * 2) }}><Txt s={big} grad={GOLD} style={{ lineHeight: 1.2, filter: "drop-shadow(0 14px 40px rgba(255,204,77,.35))" }}>১১</Txt></div>
        <div style={{ transform: `scale(${pop(f, 11, 7)})`, width: big * 0.2, height: big * 0.2, borderRadius: big, background: C.pink, margin: `0 ${big * 0.05}px`, boxShadow: "0 0 50px rgba(255,61,127,.8)" }} />
        <div style={{ transform: `translateX(${(1 - r) * 700}px) scale(${0.6 + 0.4 * r})`, opacity: Math.min(1, r * 2) }}><Txt s={big} grad={GOLD} style={{ lineHeight: 1.2, filter: "drop-shadow(0 14px 40px rgba(255,204,77,.35))" }}>১১</Txt></div>
      </div>
      <Pop f={f} d={15} rot={-8}><div style={{ padding: V ? "16px 70px" : "12px 70px", borderRadius: 28, background: HOT, boxShadow: "0 20px 60px rgba(255,61,127,.45)" }}><Txt s={V ? 120 : 96}>মেগা অফার</Txt></div></Pop>
      {!V && (
        <div style={{ display: "flex", gap: 22, marginTop: 40, alignItems: "center" }}>
          <Pop f={f} d={sub}><Chip s={60}>১ বছর</Chip></Pop>
          <Pop f={f} d={sub + 16}><Chip s={60}>সব কোর্স</Chip></Pop>
          <Pop f={f} d={sub + 44}><Chip s={66} bg={C.gold} c="#1a1200" border={C.gold}>মাত্র {taka(1100)}</Chip></Pop>
        </div>
      )}
      {V && <Rise f={f} d={28} style={{ marginTop: 50 }}><Txt s={72} w={700} c={C.mute}>১ বছর · সব কোর্স</Txt></Rise>}
      <Burst f={f} at={11} x={W / 2} y={cy} n={V ? 110 : 130} power={V ? 1 : 1.35} />
    </>
  );
};

const Dream: React.FC<SP> = ({ f, vo }) => {
  const items: [any, string, string][] = [[Plane, "বিদেশে কাজ", C.pink], [Briefcase, "ভালো চাকরি", C.purple], [Store, "নিজের ব্যবসা", C.teal]];
  const t = [6, Math.round(vo * FPS * 0.2) + 6, Math.round(vo * FPS * 0.38) + 6], end = Math.round(vo * FPS * 0.58);
  return (
    <>
      <div style={{ display: "flex", gap: 40 }}>
        {items.map(([I, tx, col], i) => { const s = pop(f, t[i], 11); return (
          <div key={i} style={{ transform: `translateY(${(1 - s) * 220}px) rotate(${(1 - s) * (i - 1) * 10}deg)`, opacity: Math.min(1, s * 1.6) }}>
            <Glass style={{ width: 540, height: 430, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
              <div style={{ width: 150, height: 150, borderRadius: 44, background: col, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 20px 60px ${col}77`, transform: `translateY(${Math.sin((f + i * 20) / 14) * 8}px)` }}><I size={84} color="#fff" strokeWidth={2.2} /></div>
              <Txt s={80}>{tx}</Txt>
            </Glass>
          </div>); })}
      </div>
      <div style={{ marginTop: 70, textAlign: "center" }}>
        <Words f={f} d={end} text="সবকিছুর শুরু একটা দক্ষতা দিয়ে" s={84} />
        <div style={{ height: 10, borderRadius: 10, background: GOLD, width: `${ent(f, end + 22, 26) * 100}%`, margin: "10px auto 0" }} />
      </div>
    </>
  );
};

const Pass: React.FC<SP> = ({ f }) => {
  const { width: W, height: H } = useVideoConfig();
  const k = ent(f, 22, 30), card = pop(f, 40, 12), sh = interpolate(f, [52, 82], [-0.3, 1.3], clamp);
  return (
    <>
      <AbsoluteFill>
        {COURSES.slice(0, 10).map(([id], i) => {
          const a = (i / 10) * Math.PI * 2 + f / 45, rx = 720 * (1 - k), ry = 330 * (1 - k), inn = ent(f, i * 2, 16);
          return <div key={id} style={{ position: "absolute", left: W / 2 + Math.cos(a) * rx - 150, top: H / 2 + Math.sin(a) * ry - 84, opacity: inn * (1 - ent(f, 40, 10)), transform: `scale(${(1 - 0.6 * k) * inn}) rotate(${Math.sin(a) * 8}deg)` }}><Cover id={id} w={300} /></div>;
        })}
      </AbsoluteFill>
      <Ring f={f} at={42} x={W / 2} y={H / 2} max={1900} />
      <div style={{ transform: `scale(${0.5 + 0.5 * card}) rotate(${(1 - card) * -6}deg)`, opacity: interpolate(f, [40, 46], [0, 1], clamp) }}>
        <div style={{ position: "relative", width: 1180, height: 560, borderRadius: 48, overflow: "hidden", background: "linear-gradient(135deg,#221a4d,#0d0a1f 60%)", border: `4px solid ${C.gold}`, boxShadow: "0 0 140px rgba(255,204,77,.4), 0 40px 100px rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(600px 300px at 85% 0%, rgba(255,61,127,.35), transparent 70%), radial-gradient(600px 300px at 10% 100%, rgba(124,77,255,.4), transparent 70%)" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16 }}><Zap size={40} color={C.gold} fill={C.gold} /><Txt s={46} w={700} c={C.gold}>এক সাবস্ক্রিপশন</Txt></div>
          <Txt s={190} grad={GOLD} style={{ position: "relative", lineHeight: 1.2 }}>সব কোর্স</Txt>
          <Txt s={58} w={700} style={{ position: "relative" }}>পুরো ১ বছর · AI University</Txt>
          <div style={{ position: "absolute", top: -100, left: `${sh * 100}%`, width: 200, height: 800, transform: "rotate(20deg)", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent)" }} />
        </div>
      </div>
      <Burst f={f} at={42} x={W / 2} y={H / 2} n={90} power={1.4} seed="p" />
    </>
  );
};

const Courses: React.FC<SP> = ({ f, V, vo }) => {
  const { width: W } = useVideoConfig();
  // the VO names 7 (H: +kids) courses; one cover takes the stage per name, then the rest fly by
  const start = V ? Math.round(vo * FPS * 0.24) : 14, named = V ? 7 : 8, step = (vo * FPS * (V ? 0.7 : 0.86)) / named;
  const times: number[] = []; for (let i = 1; i < COURSES.length; i++) times.push(i < named ? start + i * step : start + (named - 1) * step + (i - named + 1) * 7 + 10);
  const p = times.reduce((n, t) => n + ent(f, t - 5, 12), 0), cw = V ? 820 : 800, sp = V ? 600 : 610, ci = Math.round(p);
  return (
    <>
      <Rise f={f} d={2} y={-40}><Txt s={V ? 84 : 76} style={{ textAlign: "center" }}>{V ? <>১ বছর · <span style={{ color: C.gold }}>সব কোর্স</span></> : <>যত কোর্স, <span style={{ color: C.gold }}>সব আপনার</span></>}</Txt></Rise>
      <div style={{ position: "relative", width: W, height: cw * 0.5625 + 60, marginTop: V ? 70 : 36, perspective: 1800 }}>
        {COURSES.map(([id], i) => {
          const d = i - p, ad = Math.abs(d); if (ad > 3) return null;
          return (
            <div key={id} style={{ position: "absolute", left: W / 2 - cw / 2, top: 30, zIndex: 100 - Math.round(ad * 10), opacity: interpolate(ad, [2, 3], [1, 0], clamp) * ent(f, 4 + i * 3, 16),
              transform: `translateX(${d * sp}px) translateZ(${-Math.min(ad, 2) * 300}px) rotateY(${-Math.max(-1, Math.min(1, d)) * 38}deg)` }}>
              <Cover id={id} w={cw} r={30} style={{ border: ad < 0.5 ? `4px solid ${C.gold}` : "2px solid rgba(255,255,255,.18)", boxShadow: ad < 0.5 ? "0 0 90px rgba(255,204,77,.35), 0 30px 70px rgba(0,0,0,.6)" : "0 18px 50px rgba(0,0,0,.55)" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "#07060f", opacity: Math.min(0.62, ad * 0.5) }} />
            </div>);
        })}
      </div>
      <div style={{ height: V ? 150 : 130, display: "flex", alignItems: "center", marginTop: V ? 30 : 14 }}>
        <div style={{ opacity: 1 - Math.min(1, Math.abs(p - ci) * 2.6), transform: `scale(${1 - Math.abs(p - ci) * 0.25})` }}>
          <div style={{ padding: "10px 54px", borderRadius: 26, background: HOT }}><Txt s={V ? 76 : 70}>{COURSES[ci][1]}</Txt></div>
        </div>
      </div>
      <Rise f={f} d={20} style={{ marginTop: V ? 26 : 8 }}><Chip s={V ? 46 : 42}><b style={{ color: C.gold, fontWeight: 800 }}>১৩টি কোর্স</b> + নতুন কোর্সও যোগ হবে</Chip></Rise>
    </>
  );
};

const Feats: React.FC<SP> = ({ f, vo }) => {
  const it: [any, string, string, string][] = [[Bot, "২৪/৭", "এআই শিক্ষক", C.purple], [FlaskConical, "হাতে-কলমে", "ল্যাব", C.pink], [Award, "যাচাইযোগ্য", "সার্টিফিকেট", C.gold]];
  const t = [Math.round(vo * FPS * 0.1), Math.round(vo * FPS * 0.42), Math.round(vo * FPS * 0.66)];
  return (
    <>
      <Rise f={f} d={0} y={-40}><Txt s={70} c={C.mute} w={700}>শুধু ভিডিও না — <span style={{ color: C.ink }}>সাথে আরও</span></Txt></Rise>
      <div style={{ display: "flex", gap: 44, marginTop: 56 }}>
        {it.map(([I, a, b, col], i) => { const s = pop(f, t[i], 10); return (
          <div key={i} style={{ transform: `scale(${0.5 + 0.5 * s}) translateY(${(1 - s) * 120}px)`, opacity: Math.min(1, s * 1.5) }}>
            <Glass style={{ width: 520, height: 500, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <div style={{ width: 170, height: 170, borderRadius: 170, border: `5px solid ${col}`, background: `${col}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: `0 0 70px ${col}55` }}><I size={92} color={col} strokeWidth={2} /></div>
              <Txt s={84} c={col}>{a}</Txt><Txt s={66}>{b}</Txt>
            </Glass>
          </div>); })}
      </div>
      <Rise f={f} d={t[2] + 14} style={{ marginTop: 50 }}><Chip s={46}><Smartphone size={48} color={C.teal} />ওয়েব + অ্যাপ — একই অ্যাকাউন্টে</Chip></Rise>
    </>
  );
};

const Price: React.FC<SP> = ({ f, V, vo }) => {
  const { width: W, height: H } = useVideoConfig();
  const tS = Math.round(vo * FPS * (V ? 0.42 : 0.36)), tD = Math.round(vo * FPS * (V ? 0.58 : 0.54)), tB = Math.round(vo * FPS * (V ? 0.86 : 0.8));
  const strike = ent(f, tS, 10), mv = ent(f, tD - 4, 14);
  const val = Math.round(interpolate(f, [tD, tD + 20], [3999, 1100], { ...clamp, easing: Easing.out(Easing.cubic) })), land = pop(f, tD + 20, 8);
  const big = V ? 262 : 360, cy = V ? H * 0.47 : H * 0.52;
  return (
    <>
      <Rise f={f} d={0} y={-30}><Chip s={V ? 44 : 40}>১ বছর · সব কোর্স</Chip></Rise>
      <div style={{ position: "relative", marginTop: 30, transform: `scale(${1 - 0.42 * mv})`, opacity: 1 - 0.35 * mv, transformOrigin: "50% 100%" }}>
        <Pop f={f} d={5}><Txt s={V ? 210 : 220} c="#e9e6ff" style={{ lineHeight: 1.2 }}>{taka(3999)}</Txt></Pop>
        <div style={{ position: "absolute", left: "-4%", top: "52%", height: 16, width: `${strike * 108}%`, borderRadius: 16, background: C.pink, transform: "rotate(-7deg)", transformOrigin: "0 50%", boxShadow: "0 0 30px rgba(255,61,127,.9)" }} />
      </div>
      <div style={{ opacity: ent(f, tD - 2, 8), transform: `scale(${f < tD + 20 ? 0.86 : 0.86 + 0.14 * land})`, display: "flex", flexDirection: "column", alignItems: "center", marginTop: V ? 10 : -10 }}>
        <Txt s={V ? 60 : 54} w={700} c={C.gold} style={{ marginBottom: -big * 0.08 }}>এখন মাত্র</Txt>
        <Txt s={big} grad={GOLD} style={{ lineHeight: 1.2, filter: "drop-shadow(0 16px 50px rgba(255,204,77,.4))", fontVariantNumeric: "tabular-nums" }}>{taka(val)}</Txt>
      </div>
      <div style={{ display: "flex", flexDirection: V ? "column" : "row", gap: V ? 24 : 30, alignItems: "center", marginTop: V ? 16 : 0 }}>
        <Pop f={f} d={tB} rot={-14}><div style={{ padding: "14px 56px", borderRadius: 26, background: HOT, boxShadow: "0 18px 50px rgba(255,61,127,.5)", transform: "rotate(-3deg)" }}><Txt s={V ? 96 : 84}>৭২% ছাড়</Txt></div></Pop>
        <Pop f={f} d={tB + 8}><Chip s={V ? 46 : 44} border={C.gold}>বাঁচছে <b style={{ color: C.gold, fontWeight: 800 }}>{taka(2899)}</b></Chip></Pop>
      </div>
      <Ring f={f} at={tD + 20} x={W / 2} y={cy} max={V ? 1700 : 2000} />
      <Burst f={f} at={tD + 20} x={W / 2} y={cy} n={V ? 120 : 150} power={V ? 1.1 : 1.5} seed="pr" />
    </>
  );
};

const Compare: React.FC<SP> = ({ f, V, vo }) => {
  const tR = Math.round(vo * FPS * (V ? 0.36 : 0.42)), tL = Math.round(vo * FPS * (V ? 0.62 : 0.5));
  const cw = V ? 900 : 800, ch = V ? 420 : 600, a = pop(f, 4, 12), b = pop(f, tR, 9);
  const stack = ["ielts-prep", "air-ticketing", "spoken-english", "japanese-work", "computer-basics"];
  return (
    <>
      <div style={{ display: "flex", flexDirection: V ? "column" : "row", alignItems: "center", gap: V ? 26 : 40 }}>
        <div style={{ transform: `translate(${V ? 0 : (1 - a) * -300}px,${V ? (1 - a) * -200 : 0}px)`, opacity: Math.min(1, a * 1.5) * (1 - 0.3 * ent(f, tR + 6, 14)) }}>
          <Glass style={{ width: cw, height: ch, display: "flex", flexDirection: V ? "row" : "column", alignItems: "center", justifyContent: "center", gap: V ? 50 : 20 }}>
            <Cover id="air-ticketing" w={V ? 330 : 380} style={{ filter: "saturate(.7)" }} />
            <div style={{ textAlign: "center" }}><Txt s={V ? 50 : 52} w={700} c={C.mute}>শুধু ১টা কোর্স</Txt><Txt s={V ? 130 : 140} c="#e9e6ff" style={{ lineHeight: 1.2 }}>{taka(999)}</Txt></div>
          </Glass>
        </div>
        <Pop f={f} d={tR - 6}><div style={{ width: 110, height: 110, borderRadius: 110, background: "#fff", color: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: EN, fontWeight: 900, fontSize: 44 }}>VS</div></Pop>
        <div style={{ transform: `scale(${0.6 + 0.4 * b}) translate(${V ? 0 : (1 - b) * 300}px,${V ? (1 - b) * 200 : 0}px)`, opacity: Math.min(1, b * 1.5) }}>
          <Glass hot style={{ width: cw, height: ch, display: "flex", flexDirection: V ? "row" : "column", alignItems: "center", justifyContent: "center", gap: V ? 40 : 34 }}>
            <div style={{ position: "relative", width: V ? 360 : 460, height: V ? 220 : 220 }}>
              {stack.map((id, i) => { const o = ent(f, tR + 6 + i * 3, 16), m = i - 2; return <div key={id} style={{ position: "absolute", left: "50%", top: 14, marginLeft: -(V ? 130 : 150), transform: `translateX(${m * (V ? 48 : 70) * o}px) rotate(${m * 7 * o}deg) translateY(${Math.abs(m) * 12}px)`, zIndex: 5 - Math.abs(m) }}><Cover id={id} w={V ? 260 : 300} r={16} /></div>; })}
            </div>
            <div style={{ textAlign: "center" }}><Txt s={V ? 50 : 52} w={700} c={C.gold}>১ বছর — সব কোর্স</Txt><Txt s={V ? 150 : 160} grad={GOLD} style={{ lineHeight: 1.2 }}>{taka(1100)}</Txt></div>
          </Glass>
        </div>
      </div>
      <Rise f={f} d={tL} style={{ marginTop: V ? 44 : 50 }}><Txt s={V ? 62 : 66} style={{ textAlign: "center" }}>মাত্র <span style={{ color: C.gold }}>{taka(101)}</span> বেশি দিলেই <span style={{ color: C.gold }}>সব কোর্স</span></Txt></Rise>
    </>
  );
};

/* real, approved reviews from /api/reviews (2026-11-12): 24 reviews, average 4.8 */
const REVIEWS: [string, string, string, number][] = [
  ["সবকিছু সহজ ভাবে বুঝা যাচ্ছে", "Md Rofiqul Islam", "এয়ার টিকেটিং", 5],
  ["খুবই ভালো লেগেছে। ইফেক্টিভ আলোচনা ছিল", "Mohammad Aminul Islam", "কম্পিউটার", 5],
  ["কথা গুলো স্পষ্ট এবং সুন্দর ভাষায় বলা", "Tapu Kumar", "ড্রাইভিং", 4],
  ["খুব ভালো। শিখতে অনেক সহজ।", "MD AMINUL ISLAM", "এয়ার টিকেটিং", 4],
];
const Star: React.FC<{ s: number; fill: number }> = ({ s, fill }) => (
  <div style={{ position: "relative", width: s, height: s }}>
    <svg viewBox="0 0 24 24" width={s} height={s} style={{ position: "absolute" }}><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" fill="rgba(255,255,255,.16)" /></svg>
    <div style={{ position: "absolute", width: s * fill, height: s, overflow: "hidden" }}><svg viewBox="0 0 24 24" width={s} height={s}><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" fill={C.gold} /></svg></div>
  </div>
);
const Rating: React.FC<{ f: number; d?: number; s: number; row?: boolean }> = ({ f, d = 0, s, row }) => {
  const p = ent(f, d + 4, 26) * 4.8;
  return (
    <div style={{ display: "flex", flexDirection: row ? "row" : "column", alignItems: "center", gap: row ? 36 : 6 }}>
      <Pop f={f} d={d}><Txt s={s} grad={GOLD} style={{ lineHeight: 1.15 }}>{bn(p.toFixed(1))}</Txt></Pop>
      <div style={{ display: "flex", flexDirection: "column", alignItems: row ? "flex-start" : "center", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>{[0, 1, 2, 3, 4].map((i) => <Star key={i} s={s * 0.26} fill={Math.max(0, Math.min(1, p - i))} />)}</div>
        <Txt s={s * 0.17} w={700} c={C.mute} style={{ whiteSpace: "nowrap" }}>২৪টি যাচাইকৃত রিভিউ</Txt>
      </div>
    </div>
  );
};
const RevCard: React.FC<{ r: [string, string, string, number]; w: number; s?: number }> = ({ r, w, s = 1 }) => (
  <Glass style={{ width: w, padding: `${26 * s}px ${34 * s}px`, borderRadius: 30 }}>
    <div style={{ display: "flex", gap: 4, marginBottom: 8 * s }}>{[0, 1, 2, 3, 4].map((i) => <Star key={i} s={30 * s} fill={i < r[3] ? 1 : 0} />)}</div>
    <Txt s={40 * s} w={600} body style={{ lineHeight: 1.45 }}>“{r[0]}”</Txt>
    <div style={{ display: "flex", alignItems: "center", gap: 16 * s, marginTop: 14 * s }}>
      <div style={{ width: 54 * s, height: 54 * s, borderRadius: 54, background: HOT, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: EN, fontWeight: 800, fontSize: 28 * s, color: "#fff" }}>{r[1][0]}</div>
      <div style={{ fontFamily: EN, fontWeight: 700, fontSize: 26 * s, color: C.ink }}>{r[1]}<span style={{ fontFamily: BN, fontWeight: 600, color: C.mute }}> · {r[2]}</span></div>
    </div>
  </Glass>
);
const Reviews: React.FC<SP> = ({ f }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
    <div style={{ width: 660, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Rise f={f} d={0} y={-30}><Txt s={56} w={700} c={C.mute}>শিক্ষার্থীদের রেটিং (৫-এ)</Txt></Rise>
      <Rating f={f} d={4} s={300} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {REVIEWS.map((r, i) => <Rise key={i} f={f} d={8 + i * 9} x={160} y={0} style={{ marginLeft: i % 2 ? 60 : 0 }}><RevCard r={r} w={800} /></Rise>)}
    </div>
  </div>
);

const FREE: [any, string, string][] = [[Coffee, "সব পকেট কোর্স", "#16a34a"], [Share2, "৫টি কোর্স — শেয়ার করলেই পুরো ফ্রি", "#1877f2"], [BookOpen, "বইয়ের প্রথম অধ্যায়", "#f59e0b"], [Users, "কমিউনিটি", C.pink], [Smartphone, "অ্যাপ আর অ্যাকাউন্ট", "#2563eb"]];
const Pct: React.FC<{ f: number; d: number; s: number }> = ({ f, d, s }) => {
  const p = ent(f, d, 30), r = s / 2 - 22, cir = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: s, height: s, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={s} height={s} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle cx={s / 2} cy={s / 2} r={r} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={30} />
        <circle cx={s / 2} cy={s / 2} r={r} fill="none" stroke={C.teal} strokeWidth={30} strokeLinecap="round" strokeDasharray={`${cir * 0.2 * p} ${cir}`} />
      </svg>
      <div style={{ textAlign: "center" }}><Txt s={s * 0.3} c={C.teal} style={{ lineHeight: 1.1 }}>{bn(Math.round(20 * p))}%</Txt><Txt s={s * 0.15} w={800}>ফ্রি</Txt></div>
    </div>
  );
};
const Free: React.FC<SP> = ({ f, vo }) => {
  const t = Math.round(vo * FPS * 0.28);
  return (
    <>
      <Words f={f} d={0} text="বিশ্বাস হচ্ছে না? আগে ফ্রিতে দেখুন" s={96} />
      <div style={{ display: "flex", alignItems: "center", gap: 90, marginTop: 56 }}>
        <Pop f={f} d={t}><Glass hot style={{ padding: "44px 60px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}><Pct f={f} d={t + 4} s={400} /><Txt s={56} w={700} style={{ textAlign: "center" }}>প্রতিটা কোর্সের<br />প্রথম ২০%</Txt></Glass></Pop>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {FREE.map(([I, tx, col], i) => (
            <Rise key={i} f={f} d={t + 16 + i * 7} x={120} y={0}>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ width: 96, height: 96, borderRadius: 28, background: col, display: "flex", alignItems: "center", justifyContent: "center" }}><I size={54} color="#fff" /></div>
                <Txt s={60} w={700}>{tx}</Txt><Check size={50} color={C.teal} strokeWidth={3.5} />
              </div>
            </Rise>))}
        </div>
      </div>
    </>
  );
};

const Cal: React.FC<{ f: number; d: number; s: number }> = ({ f, d, s }) => {
  const day = Math.round(interpolate(f, [d + 4, d + 30], [12, 30], { ...clamp, easing: Easing.out(Easing.quad) })), l = pop(f, d + 30, 7);
  return (
    <Pop f={f} d={d} rot={-10}>
      <div style={{ width: s, borderRadius: s * 0.12, overflow: "hidden", background: "#fff", boxShadow: "0 30px 90px rgba(255,61,127,.45)", transform: `rotate(-4deg) scale(${f > d + 30 ? 0.94 + 0.06 * l : 1})` }}>
        <div style={{ background: HOT, padding: `${s * 0.04}px 0`, textAlign: "center" }}><Txt s={s * 0.16} w={800}>নভেম্বর</Txt></div>
        <div style={{ textAlign: "center", padding: `0 0 ${s * 0.03}px` }}><Txt s={s * 0.52} c={C.bg} style={{ lineHeight: 1.2, fontVariantNumeric: "tabular-nums" }}>{bn(day)}</Txt></div>
      </div>
    </Pop>
  );
};
const Deadline: React.FC<SP> = ({ f, vo }) => {
  const t = Math.round(vo * FPS * 0.55), pulse = 1 + 0.04 * Math.sin(f / 4);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 110 }}>
      <Cal f={f} d={2} s={460} />
      <div>
        <Rise f={f} d={6} x={80} y={0}><Txt s={70} w={700} c={C.mute}>অফার শেষ</Txt></Rise>
        <Rise f={f} d={12} x={80} y={0}><Txt s={150} grad={GOLD} style={{ lineHeight: 1.25 }}>৩০ নভেম্বর</Txt></Rise>
        <Rise f={f} d={18} x={80} y={0}><Txt s={56} w={700}>রাত ১১:৫৯ পর্যন্ত (বাংলাদেশ সময়)</Txt></Rise>
        <Pop f={f} d={t} style={{ marginTop: 40, transformOrigin: "0 50%" }}><div style={{ display: "inline-flex", alignItems: "center", gap: 20, padding: "16px 54px", borderRadius: 999, background: HOT, transform: `scale(${pulse})`, boxShadow: "0 18px 60px rgba(255,61,127,.55)" }}><Dot f={f} s={20} /><Txt s={72}>দ্রুত কিনুন</Txt></div></Pop>
      </div>
    </div>
  );
};

const Trust: React.FC<SP> = ({ f, vo }) => {
  const t = Math.round(vo * FPS * 0.4);
  return (
    <>
      <Rating f={f} d={2} s={250} row />
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 44 }}>
        {REVIEWS.slice(0, 2).map((r, i) => <Rise key={i} f={f} d={10 + i * 8} x={i ? -140 : 140} y={0}><RevCard r={r} w={950} s={1.12} /></Rise>)}
      </div>
      <Pop f={f} d={t} style={{ marginTop: 50 }}>
        <Glass hot style={{ width: 940, padding: "30px 44px", display: "flex", alignItems: "center", gap: 40 }}>
          <Pct f={f} d={t + 3} s={260} />
          <div><Txt s={66}>প্রথম ২০% <span style={{ color: C.teal }}>ফ্রি</span></Txt><Txt s={46} w={700} c={C.mute}>আগে দেখে নিন, পরে কিনুন</Txt></div>
        </Glass>
      </Pop>
    </>
  );
};

const Cta: React.FC<SP> = ({ f, V, vo }) => {
  const { width: W, height: H } = useVideoConfig();
  const tU = V ? Math.round(vo * FPS * 0.36) : 14, pulse = 1 + 0.025 * Math.sin(f / 5), sh = ((f - tU) % 70) / 70;
  const uw = V ? 950 : 1240;
  return (
    <>
      {V ? (
        <>
          <Cal f={f} d={2} s={370} />
          <Rise f={f} d={8} style={{ marginTop: 26, textAlign: "center" }}><Txt s={58} w={700} c={C.mute}>অফার শেষ</Txt><Txt s={130} grad={GOLD} style={{ lineHeight: 1.25 }}>৩০ নভেম্বর</Txt></Rise>
        </>
      ) : (
        <>
          <Pop f={f} d={0}><div style={{ background: "#fff", borderRadius: 30, padding: "14px 34px" }}><Img src={A("logo.png")} style={{ height: 120, display: "block" }} /></div></Pop>
          <Rise f={f} d={6} style={{ marginTop: 26 }}><Txt s={84} style={{ textAlign: "center" }}>১ বছর সব কোর্স — <span style={{ color: C.gold }}>মাত্র {taka(1100)}</span></Txt></Rise>
        </>
      )}
      <Pop f={f} d={tU} style={{ marginTop: V ? 40 : 34 }}>
        <div style={{ position: "relative", overflow: "hidden", width: uw, padding: V ? "34px 0" : "30px 0", borderRadius: 999, background: GOLD, textAlign: "center", transform: `scale(${pulse})`, boxShadow: "0 0 110px rgba(255,204,77,.5), 0 24px 60px rgba(0,0,0,.5)" }}>
          <div style={{ fontFamily: EN, fontWeight: 800, fontSize: V ? 62 : 82, color: "#1a1200", lineHeight: 1.2 }}>aiuniversitybd.com<span style={{ color: "#c01655" }}>/offer</span></div>
          <div style={{ position: "absolute", top: -60, left: `${sh * 140 - 20}%`, width: 120, height: 400, transform: "rotate(20deg)", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent)" }} />
        </div>
      </Pop>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: V ? 18 : 22, marginTop: V ? 40 : 38, maxWidth: V ? 950 : 1700 }}>
        <Pop f={f} d={tU + 12}><Chip s={V ? 50 : 48} border={C.teal}><Check size={50} color={C.teal} strokeWidth={3.5} />কুপন লাগবে না</Chip></Pop>
        <Pop f={f} d={tU + 18}><Chip s={V ? 50 : 48}>bKash · নগদ</Chip></Pop>
        {!V && <Pop f={f} d={tU + 24}><Chip s={48} border={C.pink}><Dot f={f} />শেষ ৩০ নভেম্বর</Chip></Pop>}
        <Pop f={f} d={tU + (V ? 24 : 30)}><Chip s={V ? 50 : 48} bg="rgba(37,211,102,.16)" border="#25d366"><MessageCircle size={50} color="#25d366" />WhatsApp ০১৭২২-০০৯৩২৬</Chip></Pop>
      </div>
      <Rise f={f} d={tU + 34} style={{ marginTop: V ? 30 : 26 }}><Txt s={V ? 34 : 34} w={600} c={C.mute} body>অফারটি শুধু ওয়েবসাইটে · চাকরি বা ভিসার নিশ্চয়তা নয়</Txt></Rise>
      <Burst f={f} at={tU + 2} x={W / 2} y={V ? H * 0.5 : H * 0.55} n={V ? 100 : 130} power={V ? 1.1 : 1.5} seed="cta" />
    </>
  );
};

const SCENES: Record<Kind, React.FC<SP>> = { hook: Hook, dream: Dream, pass: Pass, courses: Courses, feats: Feats, price: Price, compare: Compare, reviews: Reviews, free: Free, deadline: Deadline, trust: Trust, cta: Cta };
const Scene: React.FC<{ kind: Kind; len: number; vo: number; last: boolean }> = ({ kind, len, vo, last }) => {
  const f = useCurrentFrame(), V = useV(), S = SCENES[kind];
  return <Shell f={f} len={len} V={V} last={last}><S f={f} len={len} V={V} vo={vo} /></Shell>;
};

/* ------------------------------------------------ root ------------------------------------------------ */
export const Offer11: React.FC<{ k: "h" | "v" }> = ({ k }) => {
  const f = useCurrentFrame(), tl = timeline(k), total = offerLen(k), p = PAD[k];
  const hit: Partial<Record<Kind, number>> = { hook: 10, pass: 42, cta: (k === "v" ? Math.round(tl[tl.length - 1].vo * FPS * 0.36) : 14) + 2 };
  const priceHit = (vo: number) => Math.round(vo * FPS * (k === "v" ? 0.58 : 0.54)) + 20;
  const mv = (fr: number) => 0.2 * interpolate(fr, [0, 20, total - 40, total], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Bg />
      {tl.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.len} name={s.kind}>
          <Scene kind={s.kind} len={s.len} vo={s.vo} last={i === tl.length - 1} />
          <Sequence from={p.lead}><Audio src={A(`vo-${k}/${String(i + 1).padStart(2, "0")}.mp3`)} volume={1} /></Sequence>
          {i > 0 && <Audio src={A("sfx/whoosh.mp3")} volume={0.3} />}
          {hit[s.kind] != null && <Sequence from={hit[s.kind]!}><Audio src={A(s.kind === "cta" ? "sfx/chime.mp3" : "sfx/hit.mp3")} volume={0.55} /></Sequence>}
          {s.kind === "price" && <Sequence from={priceHit(s.vo)}><Audio src={A("sfx/hit.mp3")} volume={0.6} /></Sequence>}
          {(s.kind === "compare" || s.kind === "deadline" || s.kind === "free" || s.kind === "trust") && <Sequence from={Math.round(s.vo * FPS * 0.42)}><Audio src={A("sfx/pop.mp3")} volume={0.45} /></Sequence>}
        </Sequence>
      ))}
      <Audio src={A("music.mp3")} volume={mv} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [total - 8, total], [0, k === "v" ? 0 : 1], clamp) }} />
    </AbsoluteFill>
  );
};
