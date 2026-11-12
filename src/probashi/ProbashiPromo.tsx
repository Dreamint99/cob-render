// প্রবাসী বন্ধু — Android app promo (2026-10-23). One engine, 16:9 (PBApp-H) and 9:16 (PBApp-V).
// Real app screenshots (probashi-bondu-app/play-release/raw → public/probashi/shots), brand night-sky motif
// (red sun, green hills, dotted gold flight path + plane, from lib/features/auth/auth_art.dart).
// VO: work/probashi/make_vo.py (Tanvir, ElevenLabs eleven_v4 with context) → public/probashi/vo/<p>.mp3 + durs.json.
// Render with the slim public dir work/pubpb (real copy of public/probashi): node render.mjs PBApp-H out.mp4 --public=work/pubpb
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, continueRender, delayRender } from "remotion";
import { getPointAtLength, getLength, getTangentAtLength } from "@remotion/paths";
import DURS from "./durs.json";

const S = (p: string) => staticFile("probashi/" + p);
const NIGHT = "#062A1F", NIGHT2 = "#0B4A37", GREEN = "#0B5D45", RED = "#E03A3E", GOLD = "#F3C969", CREAM = "#F6F3EC";
const HEAD = "PBAnek, 'Anek Bangla', sans-serif", BODY = "PBHind, 'Hind Siliguri', sans-serif", LAT = "PBMont, Montserrat, sans-serif";

// Fonts: block the render until the Bangla faces are really loaded, so conjuncts shape with the right font.
if (typeof document !== "undefined") {
  for (const [name, file, weight] of [["PBAnek", "AnekBangla.ttf", "100 800"], ["PBHind", "HindSiliguri-SemiBold.ttf", "600"], ["PBHind", "HindSiliguri-Bold.ttf", "700"], ["PBMont", "Montserrat.ttf", "100 900"]]) {
    const h = delayRender("font " + file);
    const ff = new FontFace(name, `url(${S("fonts/" + file)})`, { weight });
    ff.load().then(() => { document.fonts.add(ff); continueRender(h); }).catch(() => continueRender(h));
  }
}

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
const bn = (s: string | number) => String(s).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
const useIn = (delay = 0, damping = 15, mass = 0.9) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass } }); };
const useV = () => { const { width, height } = useVideoConfig(); return height > width; };

/* ---------- timeline ---------- */
const SCENES = ["hook", "home", "prayer", "rates", "embassy", "card", "news", "cta"] as const;
type P = (typeof SCENES)[number];
const LEAD: Record<P, number> = { hook: 24, home: 10, prayer: 10, rates: 10, embassy: 10, card: 10, news: 10, cta: 14 };
const BEAT = 15, TAIL = 12;
export const pbTimeline = () => {
  let at = 0;
  return SCENES.map((p) => {
    const raw = (DURS as Record<string, number>)[p] * 30 + LEAD[p] + TAIL + (p === "cta" ? 45 : 0);
    const len = Math.ceil(raw / BEAT) * BEAT;
    const it = { p, from: at, len }; at += len; return it;
  });
};
const TL = pbTimeline();
export const PBAPP_TOTAL = TL[TL.length - 1].from + TL[TL.length - 1].len;

/* ---------- night sky backdrop (persistent, parallax) ---------- */
// sun target per scene: x/y as fraction of frame, r in px (H) — eased between scenes so it drifts behind the phones
const SUN_H: Record<P, [number, number, number]> = { hook: [0.83, 0.6, 150], home: [0.72, 0.42, 190], prayer: [0.27, 0.42, 190], rates: [0.7, 0.45, 200], embassy: [0.3, 0.45, 200],
  card: [0.68, 0.44, 210], news: [0.72, 0.42, 190], cta: [0.5, 0.245, 150] };
const SUN_V: Record<P, [number, number, number]> = { hook: [0.78, 0.66, 150], home: [0.62, 0.55, 230], prayer: [0.38, 0.55, 230], rates: [0.6, 0.56, 240], embassy: [0.4, 0.56, 240],
  card: [0.55, 0.56, 250], news: [0.62, 0.55, 230], cta: [0.5, 0.37, 185] };

const pathFor = (W: number, H: number, V: boolean) => V
  ? `M ${W * 0.1} ${H * 0.8} Q ${W * 0.35} ${H * 0.42} ${W * 0.78} ${H * 0.64}`
  : `M ${W * 0.09} ${H * 0.83} Q ${W * 0.45} ${H * 0.42} ${W * 0.81} ${H * 0.62}`;

const Plane: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", filter: "drop-shadow(0 4px 10px rgba(0,0,0,.45))" }}>
    <path fill="#fff" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const Sky: React.FC = () => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const V = W < H;
  const SUN = V ? SUN_V : SUN_H;
  // eased sun position across scene boundaries
  let sx = 0, sy = 0, sr = 0;
  TL.forEach((s, i) => {
    const t = SUN[s.p];
    const k = i === 0 ? 1 : lerp(f, s.from - 6, s.from + 24);
    if (i === 0) { sx = t[0]; sy = t[1]; sr = t[2]; } else { sx += (t[0] - sx) * k; sy += (t[1] - sy) * k; sr += (t[2] - sr) * k; }
  });
  const sunX = sx * W + 14 * Math.sin(f / 70), sunY = sy * H + 8 * Math.cos(f / 80);
  const hookEnd = TL[1].from, ctaFrom = TL[TL.length - 1].from;
  const pathOp = f < hookEnd ? 1 : f >= ctaFrom ? lerp(f, ctaFrom, ctaFrom + 20, 0.25, 1) : lerp(f, hookEnd - 10, hookEnd + 10, 1, 0.25);
  const d = pathFor(W, H, V);
  const len = getLength(d);
  const reveal = lerp(f, 6, 120);
  // plane: hook flight 10→200, then a slow cruise loop in features, final flight in the CTA
  const u = f < hookEnd ? interpolate(f, [10, 200], [0.04, 0.9], { ...clamp, easing: Easing.inOut(Easing.cubic) })
    : f >= ctaFrom ? interpolate(f, [ctaFrom, ctaFrom + 150], [0.05, 0.92], { ...clamp, easing: Easing.inOut(Easing.cubic) })
      : 0.9 + 0.06 * Math.sin((f - hookEnd) / 40);
  const pt = getPointAtLength(d, len * u), tg = getTangentAtLength(d, len * u);
  const ang = (Math.atan2(tg.y, tg.x) * 180) / Math.PI + 90;
  const hillShift = (f / PBAPP_TOTAL) * 120;
  const planeSize = V ? 70 : 64;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 110%, ${NIGHT2} 0%, ${NIGHT} 55%, #031710 100%)`, overflow: "hidden" }}>
      {Array.from({ length: 70 }).map((_, i) => {
        const x = ((i * 397.3) % W + W - ((f * (0.15 + (i % 3) * 0.12)) % W)) % W;
        const y = (i * 211.7) % (H * 0.78);
        const s = 1.5 + (i % 3) * 1.1;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: 4, background: "#fff", opacity: 0.15 + 0.5 * Math.abs(Math.sin(f / 22 + i)) }} />;
      })}
      {/* sun + rings */}
      {[3, 2, 1].map((k) => (
        <div key={k} style={{ position: "absolute", left: sunX - (sr + k * sr * 0.32), top: sunY - (sr + k * sr * 0.32), width: 2 * (sr + k * sr * 0.32), height: 2 * (sr + k * sr * 0.32),
          borderRadius: "50%", border: `2px solid rgba(255,255,255,${0.05 * k})` }} />
      ))}
      <div style={{ position: "absolute", left: sunX - sr * 2.2, top: sunY - sr * 2.2, width: sr * 4.4, height: sr * 4.4, borderRadius: "50%", background: `radial-gradient(circle, ${RED}38, transparent 62%)` }} />
      <div style={{ position: "absolute", left: sunX - sr, top: sunY - sr, width: sr * 2, height: sr * 2, borderRadius: "50%", background: `radial-gradient(circle at 40% 38%, #F0545A, ${RED} 60%, #C92E33)` }} />
      {/* hills */}
      <svg width={W + 200} height={H * 0.3} viewBox={`0 0 ${W + 200} ${H * 0.3}`} style={{ position: "absolute", left: -100 - hillShift * 0.4, bottom: 0 }}>
        <path d={`M0 ${H * 0.16} Q ${W * 0.3} ${H * 0.06} ${W * 0.55} ${H * 0.14} T ${W + 200} ${H * 0.1} L ${W + 200} ${H * 0.3} L 0 ${H * 0.3} Z`} fill={NIGHT2} />
      </svg>
      <svg width={W + 200} height={H * 0.2} viewBox={`0 0 ${W + 200} ${H * 0.2}`} style={{ position: "absolute", left: -100 + hillShift * 0.8 - 100, bottom: 0 }}>
        <path d={`M0 ${H * 0.13} Q ${W * 0.4} ${H * 0.06} ${W * 0.7} ${H * 0.13} T ${W + 200} ${H * 0.11} L ${W + 200} ${H * 0.2} L 0 ${H * 0.2} Z`} fill={GREEN} />
      </svg>
      {/* dotted gold flight path */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: pathOp }}>
        <defs><mask id="pbrev"><path d={d} stroke="#fff" strokeWidth={30} fill="none" strokeDasharray={`${len * reveal} ${len}`} /></mask></defs>
        <path d={d} stroke={GOLD} strokeOpacity={0.85} strokeWidth={V ? 6 : 5} strokeLinecap="round" fill="none" strokeDasharray="3 18" mask="url(#pbrev)" />
        {(() => { const a = getPointAtLength(d, 0); return <><circle cx={a.x} cy={a.y} r={22} fill={GOLD} opacity={0.2} /><circle cx={a.x} cy={a.y} r={10} fill={GOLD} /></>; })()}
      </svg>
      <div style={{ position: "absolute", left: pt.x - planeSize / 2, top: pt.y - planeSize / 2, transform: `rotate(${ang}deg)`, opacity: pathOp }}><Plane size={planeSize} /></div>
    </AbsoluteFill>
  );
};

/* ---------- shared pieces ---------- */
// Headline: whole words rise in (never split a word — keeps Bangla conjuncts intact); `gold` words in gold.
const Headline: React.FC<{ lines: string[]; gold?: string[]; x: number; y: number; w: number; size: number; align?: "left" | "center" | "right"; delay?: number }> =
  ({ lines, gold = [], x, y, w, size, align = "left", delay = 4 }) => {
    const f = useCurrentFrame();
    let n = 0;
    return (
      <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, fontFamily: HEAD, fontWeight: 800, fontSize: size, lineHeight: 1.22, color: CREAM, textShadow: "0 6px 30px rgba(0,0,0,.45)" }}>
        {lines.map((ln, li) => (
          <div key={li}>
            {ln.split(" ").map((wd, i) => {
              const k = lerp(f, delay + n * 4, delay + n * 4 + 18); n++;
              return <span key={i} style={{ display: "inline-block", marginRight: "0.24em", opacity: k, transform: `translateY(${(1 - k) * 50}px)`, filter: `blur(${(1 - k) * 8}px)`,
                color: gold.some((g) => wd.includes(g)) ? GOLD : CREAM }}>{wd}</span>;
            })}
          </div>
        ))}
      </div>
    );
  };

const Accent: React.FC<{ x: number; y: number; w: number; delay?: number; align?: "left" | "center" }> = ({ x, y, w, delay = 14, align = "left" }) => {
  const k = useIn(delay, 18);
  return <div style={{ position: "absolute", left: align === "center" ? x - (w * k) / 2 : x, top: y, width: w * k, height: 8, borderRadius: 8, background: `linear-gradient(90deg, ${GOLD}, ${RED})` }} />;
};

// Phone mockup with a real screenshot. Springs in from `from` side, parallax float, optional tilt.
const PH_RATIO = 2400 / 1080;
const Phone: React.FC<{ src: string; cx: number; cy: number; w: number; delay?: number; from?: "right" | "left" | "bottom"; rot?: number; z?: number; float?: number }> =
  ({ src, cx, cy, w, delay = 0, from = "right", rot = 0, z = 1, float = 1 }) => {
    const f = useCurrentFrame();
    const k = useIn(delay, 16, 1);
    const bez = w * 0.035;
    const h = (w - 2 * bez) * PH_RATIO + 2 * bez;
    const dx = from === "right" ? 700 : from === "left" ? -700 : 0, dy = from === "bottom" ? 700 : 0;
    const fy = Math.sin((f + delay * 3) / 38) * 10 * float;
    return (
      <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: z, opacity: Math.min(1, k * 1.6),
        transform: `translate(${(1 - k) * dx}px, ${(1 - k) * dy + fy}px) rotate(${rot * k + (1 - k) * rot * 2}deg) scale(${0.9 + 0.1 * k})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: w * 0.14, background: "linear-gradient(145deg, #1d2a25, #050807)", boxShadow: `0 50px 120px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.08), 0 0 80px ${GOLD}1c` }} />
        <div style={{ position: "absolute", left: bez, top: bez, right: bez, bottom: bez, borderRadius: w * 0.115, overflow: "hidden", background: CREAM }}>
          <Img src={S("shots/" + src)} style={{ width: "100%", display: "block" }} />
        </div>
      </div>
    );
  };

// Magnified crop of a screenshot region (fractions of the full screenshot), lifted on a gold-edged card.
const Callout: React.FC<{ src: string; rx: number; ry: number; rw: number; rh: number; x: number; y: number; w: number; delay?: number; rot?: number }> =
  ({ src, rx, ry, rw, rh, x, y, w, delay = 30, rot = -2 }) => {
    const k = useIn(delay, 13, 0.8);
    const imgW = w / rw, imgH = imgW * PH_RATIO;
    const h = rh * imgH;
    return (
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: 5, borderRadius: 30, overflow: "hidden", opacity: Math.min(1, k * 1.5),
        transform: `scale(${0.6 + 0.4 * k}) rotate(${rot * k}deg)`, transformOrigin: "50% 50%", boxShadow: `0 40px 90px rgba(0,0,0,.55), 0 0 0 4px ${GOLD}` }}>
        <Img src={S("shots/" + src)} style={{ position: "absolute", width: imgW, left: -rx * imgW, top: -ry * imgH }} />
      </div>
    );
  };

// Fade the scene out over its last frames.
const SceneOut: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [len - 10, len], [1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${1 + (1 - o) * 0.03})` }}>{children}</AbsoluteFill>;
};

/* ---------- scenes ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const V = W < H;
  const n = Math.round(interpolate(f, [30, 120], [0, 2417], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const num = bn(n.toLocaleString("en-US"));
  const pop = useIn(118, 9, 0.7);
  const k = useIn(4, 16);
  const brand = useIn(150, 16);
  const top = V ? 380 : 120;
  return (
    <AbsoluteFill>
      <Headline lines={["আপনি কতদিন প্রবাসে?"]} x={0} y={top} w={W} size={V ? 96 : 92} align="center" delay={6} />
      <div style={{ position: "absolute", left: 0, right: 0, top: top + (V ? 150 : 130), textAlign: "center", opacity: k, fontFamily: HEAD, fontWeight: 800, color: CREAM,
        transform: `scale(${1 + 0.06 * Math.sin(Math.min(1, pop) * Math.PI)})` }}>
        <span style={{ fontSize: V ? 250 : 280, lineHeight: 1.05, letterSpacing: 2, fontVariantNumeric: "tabular-nums", textShadow: `0 10px 60px rgba(0,0,0,.5), 0 0 80px ${GOLD}33` }}>{num}</span>
        <span style={{ fontSize: V ? 120 : 130, color: GOLD, marginLeft: 26 }}>দিন</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: top + (V ? 480 : 480), textAlign: "center", opacity: brand, transform: `translateY(${(1 - brand) * 30}px)`,
        fontFamily: HEAD, fontWeight: 800, fontSize: V ? 86 : 80, color: CREAM }}>
        প্রবাসী <span style={{ color: GOLD }}>বন্ধু</span>
      </div>
    </AbsoluteFill>
  );
};

// Generic feature layout: headline on one side, phones on the other (vertical: headline on top, phones below).
type Shot = { src: string; delay?: number; rot?: number; dx?: number; dy?: number; w?: number; z?: number };
const Feature: React.FC<{ lines: string[]; gold?: string[]; side: "left" | "right"; shots: Shot[]; size?: number; callout?: Omit<React.ComponentProps<typeof Callout>, "x" | "y" | "w"> & { at?: [number, number, number]; atV?: [number, number, number] } }> =
  ({ lines, gold, side, shots, callout, size: sz }) => {
    const { width: W, height: H } = useVideoConfig();
    const V = W < H;
    const textLeft = side === "right"; // phones right → text left
    const phX = V ? W / 2 : textLeft ? W * 0.7 : W * 0.3;
    const phY = V ? H * 0.64 : H * 0.53;
    const pw = V ? 500 : 410;
    const tx = V ? 60 : textLeft ? 130 : W * 0.5 + 30;
    const tw = V ? W - 120 : W * 0.5 - 110;
    const ty = V ? 170 : H * 0.3;
    return (
      <AbsoluteFill>
        <Headline lines={lines} gold={gold} x={tx} y={ty} w={tw} size={V ? Math.min(104, sz ?? 104) : sz ?? 104} align={V ? "center" : "left"} />
        <Accent x={V ? W / 2 : tx} y={ty + lines.length * ((V ? Math.min(104, sz ?? 104) : sz ?? 104) * 1.22) + 30} w={V ? 240 : 200} align={V ? "center" : "left"} />
        {shots.map((s, i) => (
          <Phone key={i} src={s.src} cx={phX + (s.dx ?? 0) * (V ? 0.9 : 1)} cy={phY + (s.dy ?? 0)} w={s.w ?? pw} delay={s.delay ?? 0} rot={s.rot ?? 0} z={s.z ?? i + 1}
            from={V ? "bottom" : textLeft ? "right" : "left"} />
        ))}
        {callout ? (() => {
          const [cx, cy, cw] = V ? callout.atV ?? [W / 2 - 300, H * 0.78, 600] : callout.at ?? [textLeft ? 130 : W * 0.5 + 30, H * 0.62, 560];
          return <Callout {...callout} x={cx} y={cy} w={cw} />;
        })() : null}
      </AbsoluteFill>
    );
  };

const SCENE_EL: Record<P, React.FC> = {
  hook: Hook,
  home: () => <Feature lines={["এক অ্যাপে", "প্রবাসের সব"]} gold={["সব"]} side="right" shots={[{ src: "01_home.jpg", rot: 3 }]}
    callout={{ src: "01_home.jpg", rx: 0.03, ry: 0.262, rw: 0.94, rh: 0.165, delay: 38, at: [130, 660, 600], atV: [80, 1330, 600], rot: -2 }} />,
  prayer: () => <Feature lines={["নামাজের সময়", "ও কিবলা"]} gold={["কিবলা"]} side="left" shots={[{ src: "03_prayer.jpg", rot: -3 }]}
    callout={{ src: "03_prayer.jpg", rx: 0.03, ry: 0.115, rw: 0.94, rh: 0.12, delay: 34, at: [1000, 640, 600], atV: [400, 1350, 600], rot: 2 }} />,
  rates: () => <Feature lines={["আজকের টাকার রেট", "আর সোনার দাম"]} gold={["রেট", "সোনার"]} side="right" size={82}
    shots={[{ src: "04_rates.jpg", rot: -5, dx: -130, delay: 0 }, { src: "02_today.jpg", rot: 5, dx: 150, dy: 30, delay: 40, z: 3 }]} />,
  embassy: () => <Feature lines={["দূতাবাসে কল,", "খরচের হিসাব"]} gold={["কল,", "হিসাব"]} side="left"
    shots={[{ src: "10_embassy.jpg", rot: -5, dx: -140 }, { src: "08_money.jpg", rot: 5, dx: 150, dy: 30, delay: 60, z: 3 }]} />,
  card: () => <Feature lines={["আপনার প্রবাস কার্ড,", "এক চাপে শেয়ার"]} gold={["কার্ড,", "শেয়ার"]} side="right" size={88}
    shots={[{ src: "05_card.jpg", rot: -9, dx: -120, dy: 10 }, { src: "06_card_story.jpg", rot: 8, dx: 140, dy: 20, delay: 22, z: 3 }]} />,
  news: () => <Feature lines={["প্রবাসের", "নতুন খবর"]} gold={["খবর"]} side="right" shots={[{ src: "07_news.jpg", rot: 3 }]} />,
  cta: () => <Cta />,
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const V = W < H;
  const ic = useIn(4, 12, 0.9), wm = useIn(14, 15), pill = useIn(30, 14), url = useIn(46, 16);
  const icon = V ? 300 : 230;
  const top = V ? 560 : 150;
  const pulse = 1 + 0.025 * Math.sin(f / 9);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top, left: W / 2 - icon / 2, width: icon, height: icon, borderRadius: icon * 0.22, overflow: "hidden", opacity: ic,
        transform: `scale(${0.5 + 0.5 * ic}) translateY(${(1 - ic) * 60}px)`, boxShadow: `0 30px 90px rgba(0,0,0,.55), 0 0 0 3px ${GOLD}66` }}>
        <Img src={S("icon.png")} style={{ width: "100%", display: "block" }} />
      </div>
      <div style={{ position: "absolute", top: top + icon + 60, left: 0, right: 0, textAlign: "center", fontFamily: HEAD, fontWeight: 800, fontSize: V ? 150 : 140, lineHeight: 1.2, color: CREAM,
        opacity: wm, transform: `translateY(${(1 - wm) * 40}px)`, textShadow: "0 8px 40px rgba(0,0,0,.5)" }}>
        প্রবাসী <span style={{ color: GOLD }}>বন্ধু</span>
      </div>
      <div style={{ position: "absolute", top: top + icon + (V ? 290 : 265), left: 0, right: 0, display: "flex", justifyContent: "center", opacity: pill, transform: `scale(${(0.8 + 0.2 * pill) * pulse})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, padding: V ? "22px 44px" : "20px 46px", borderRadius: 999, background: CREAM, color: NIGHT, fontFamily: HEAD, fontWeight: 800, fontSize: V ? 58 : 58,
          boxShadow: `0 20px 60px rgba(0,0,0,.45), 0 0 50px ${GOLD}55` }}>
          <svg width={V ? 54 : 50} height={V ? 54 : 50} viewBox="0 0 24 24"><path d="M5 3.5v17c0 .8.9 1.3 1.6.8l13.2-8.5c.6-.4.6-1.3 0-1.7L6.6 2.7C5.9 2.2 5 2.7 5 3.5z" fill={GREEN} /></svg>
          <span><span style={{ fontFamily: LAT, fontWeight: 700 }}>Google Play</span> থেকে <span style={{ color: RED }}>ফ্রি</span> ডাউনলোড</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: top + icon + (V ? 460 : 410), left: 0, right: 0, textAlign: "center", fontFamily: LAT, fontWeight: 700, fontSize: V ? 52 : 50, color: GOLD, letterSpacing: 1,
        opacity: url, transform: `translateY(${(1 - url) * 24}px)` }}>
        probashi.dreamithq.com
      </div>
    </AbsoluteFill>
  );
};

/* ---------- audio ---------- */
const musicVol = (f: number) => {
  const total = PBAPP_TOTAL;
  let duck = 0;
  for (const s of TL) {
    const a = s.from + LEAD[s.p], b = a + (DURS as Record<string, number>)[s.p] * 30;
    duck = Math.max(duck, interpolate(f, [a - 8, a, b, b + 12], [0, 1, 1, 0], clamp));
  }
  const fade = interpolate(f, [0, 20, total - 50, total], [0, 1, 1, 0], clamp);
  return fade * (0.34 - 0.23 * duck);
};

export const ProbashiApp: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: NIGHT }}>
      <Sky />
      {TL.map((s) => {
        const El = SCENE_EL[s.p];
        return (
          <Sequence key={s.p} from={s.from} durationInFrames={s.len} name={s.p}>
            <SceneOut len={s.len}><El /></SceneOut>
          </Sequence>
        );
      })}
      <Audio src={S("music.mp3")} volume={musicVol} />
      {TL.map((s) => (
        <Sequence key={"vo" + s.p} from={s.from + LEAD[s.p]} durationInFrames={Math.ceil((DURS as Record<string, number>)[s.p] * 30) + 6}>
          <Audio src={S(`vo/${s.p}.mp3`)} volume={1} />
        </Sequence>
      ))}
      {TL.slice(1).map((s) => (
        <Sequence key={"wh" + s.p} from={Math.max(0, s.from - 6)} durationInFrames={40}><Audio src={S("whoosh.mp3")} volume={0.22} /></Sequence>
      ))}
      <Sequence from={8} durationInFrames={150}><Audio src={S("plane.mp3")} volume={0.18} /></Sequence>
      <Sequence from={118} durationInFrames={30}><Audio src={S("pop.mp3")} volume={0.3} /></Sequence>
      <Sequence from={TL[TL.length - 1].from + 30} durationInFrames={30}><Audio src={S("pop.mp3")} volume={0.25} /></Sequence>
    </AbsoluteFill>
  );
};
