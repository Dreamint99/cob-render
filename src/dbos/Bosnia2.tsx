// Dream International — Bosnia visa promo v2 (owner said v1 looked cheap): cold open on a real client clip, full-bleed graded
// footage, word-by-word viral captions, beat-synced hits (music2 = 120 bpm), Shahriar VO via OpenRouter (work/dreambosnia/make_vo2.py).
// One engine for 9:16 (DreamBosnia2) and 16:9 (DreamBosnia2Wide).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import DURS from "./durs2.json";
import CLIPS from "./clips2.json";
import LANDPTS from "../land.json";
import { Flag } from "../QatarEurope";

const FPS = 30, BEAT = 15;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
const S = (p: string) => staticFile("dbos/" + p);
const Q = (p: string) => staticFile("qe/stock/" + p + ".mp4");
const RED = "#E8202A", INK = "#07070B", GOLD = "#FFC83D", WHITE = "#FFFFFF", GREEN = "#25D366";
const DISP = "AnekB, 'Hind Siliguri', sans-serif", CAP = "Hind, 'Hind Siliguri', sans-serif", ANTON = "AntonF, Impact, sans-serif", LAT = "Montserrat, sans-serif";

if (typeof document !== "undefined") {
  for (const [name, file] of [["AnekB", "AnekBangla.ttf"], ["Hind", "HindSiliguri-Bold.ttf"], ["Montserrat", "Montserrat.ttf"], ["AntonF", "Anton-Regular.ttf"]]) {
    const ff = new FontFace(name, `url(${staticFile("fonts/" + file)})`);
    ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  }
}

type Seg = { p: string; text: string; dur: number };
type Clip = { from: number; to: number; words: [string, number][]; tag: string };
const SEG = Object.fromEntries((DURS as Seg[]).map((s) => [s.p, s])) as Record<string, Seg>;
const CL = CLIPS as unknown as { open: Clip; montage: Clip[] };
const useLand = () => { const { width, height } = useVideoConfig(); return width > height; };
const sec = (s: number) => Math.round(s * FPS);
const clipLen = (c: Clip) => sec(c.to - c.from);

// scene list: [id, frames]; VO scenes snap up to whole beats so every cut lands on the grid
const snap = (fr: number) => Math.ceil(fr / BEAT) * BEAT;
const voLen = (p: string, tail = 0.35) => snap(sec(SEG[p].dur + tail) + 6);
export const PLAN = (): [string, number][] => [
  ["open", clipLen(CL.open)],
  ["hook", voLen("hook")],
  ["bosnia", voLen("bosnia", 0.6)],
  ["proof", voLen("proof", 0.9)],
  ...CL.montage.map((c, i): [string, number] => [`clip${i}`, clipLen(c)]),
  ["next", voLen("next")],
  ["vacancy", voLen("vacancy", 0.5)],
  ["cta", voLen("cta") + 90],
  ["outro", 75],
];
export const B2_TOTAL = PLAN().reduce((a, [, l]) => a + l, 0);

/* ---------------- shared look ---------------- */
const Footage: React.FC<{ src: string; dim?: number; push?: number; from?: number; rate?: number }> = ({ src, dim = 0.35, push = 0.12, from = 0, rate = 1 }) => {
  const f = useCurrentFrame(); const { durationInFrames: d } = useVideoConfig();
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: INK }}>
      <OffthreadVideo src={src} muted startFrom={from} playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 + push * (f / d)})`, filter: "contrast(1.12) saturate(1.15) brightness(0.95)" }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(7,7,11,${dim}) 0%, rgba(7,7,11,${dim * 0.4}) 35%, rgba(7,7,11,${dim * 0.6}) 60%, rgba(7,7,11,${Math.min(0.92, dim + 0.45)}) 100%)` }} />
    </AbsoluteFill>
  );
};

const Look: React.FC = () => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const lx = 50 + Math.sin(f / 70) * 40, ly = 20 + Math.cos(f / 90) * 15;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,140,60,0.16), transparent 45%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${Math.max(W, H) * 0.18}px rgba(0,0,0,0.75)` }} />
      <AbsoluteFill style={{ opacity: 0.06, mixBlendMode: "overlay", backgroundImage: `repeating-radial-gradient(circle at ${random(f) * 100}% ${random(f + 7) * 100}%, #fff 0 1px, transparent 1px 3px)` }} />
    </AbsoluteFill>
  );
};

// scene wrapper: whip-zoom in, flash on the cut
const Whip: React.FC<{ children: React.ReactNode; len: number; flash?: boolean }> = ({ children, len, flash = true }) => {
  const f = useCurrentFrame();
  const inS = interpolate(f, [0, 7], [1.25, 1], { ...clamp, easing: ease }), inB = interpolate(f, [0, 6], [18, 0], clamp);
  const outS = interpolate(f, [len - 5, len], [1, 1.12], clamp), outB = interpolate(f, [len - 5, len], [0, 14], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${inS * outS})`, filter: inB + outB > 0.3 ? `blur(${inB + outB}px)` : undefined }}>{children}</AbsoluteFill>
      {flash && <AbsoluteFill style={{ background: WHITE, opacity: interpolate(f, [0, 4], [0.55, 0], clamp) }} />}
    </AbsoluteFill>
  );
};

const Mark: React.FC = () => {
  const land = useLand();
  return (
    <div style={{ position: "absolute", top: land ? 34 : 64, right: land ? 40 : 40, background: "rgba(255,255,255,0.93)", borderRadius: 18, padding: "8px 18px", boxShadow: "0 8px 24px rgba(0,0,0,.35)" }}>
      <Img src={S("logo.png")} style={{ height: land ? 46 : 54, display: "block" }} />
    </div>
  );
};

// TikTok-style captions: 3–4 words per page, active word on a gold pill
const Captions: React.FC<{ words: [string, number][]; y?: number; size?: number; x?: [number, number] }> = ({ words, y, size, x }) => {
  const f = useCurrentFrame(); const land = useLand(); const t = f / FPS;
  const per = land ? 5 : 3;
  const pages: [string, number][][] = [];
  words.forEach((w, i) => { if (i % per === 0) pages.push([]); pages[pages.length - 1].push(w); });
  const pi = pages.findIndex((pg, k) => t >= pg[0][1] && (k === pages.length - 1 || t < pages[k + 1][0][1]));
  if (pi < 0) return null;
  const pg = pages[pi], pStart = sec(pg[0][1]);
  const pop = spring({ frame: f - pStart, fps: FPS, config: { damping: 12, stiffness: 220 } });
  const fs = size ?? (land ? 78 : 86);
  return (
    <div style={{ position: "absolute", left: x ? x[0] : 40, right: x ? x[1] : 40, top: y ?? (land ? 820 : 1260), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 18px", transform: `scale(${0.85 + 0.15 * pop})` }}>
      {pg.map(([w, at], i) => {
        const on = t >= at && (i === pg.length - 1 || t < pg[i + 1][1]);
        return <span key={i} style={{ fontFamily: CAP, fontWeight: 700, fontSize: fs, lineHeight: 1.3, color: on ? INK : WHITE, background: on ? GOLD : "transparent", borderRadius: 14, padding: "0 14px", WebkitTextStroke: on ? undefined : "2px rgba(0,0,0,.85)", textShadow: on ? undefined : "0 5px 16px rgba(0,0,0,.9)", transform: on ? "scale(1.06) rotate(-1.5deg)" : undefined }}>{w}</span>;
      })}
    </div>
  );
};

// VO words spread over the voiced time by character weight (OpenRouter TTS has no timestamps)
const voWords = (p: string, lead: number): [string, number][] => {
  const s = SEG[p]; const ws = s.text.split(/\s+/); const tot = ws.reduce((a, w) => a + w.length + 2, 0);
  let acc = 0; const span = s.dur - 0.25;
  return ws.map((w) => { const at = lead / FPS + 0.08 + (acc / tot) * span; acc += w.length + 2; return [w, at]; });
};

const Big: React.FC<{ text: string; at?: number; size?: number; color?: string; stroke?: boolean; font?: string }> = ({ text, at = 0, size = 200, color = WHITE, stroke, font = ANTON }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 9, stiffness: 200 } });
  return <div style={{ fontFamily: font, fontSize: size, lineHeight: 0.95, color: stroke ? "transparent" : color, WebkitTextStroke: stroke ? `4px ${color}` : undefined, textAlign: "center", opacity: Math.min(1, s * 2), transform: `scale(${2.2 - 1.2 * s})`, textShadow: stroke ? undefined : "0 10px 40px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>;
};

const Stamp: React.FC<{ at: number; text?: string; size?: number; color?: string }> = ({ at, text = "VISA APPROVED", size = 92, color = GREEN }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 8, stiffness: 260 } });
  if (f < at) return null;
  return <div style={{ display: "inline-flex", alignItems: "center", gap: 18, border: `9px solid ${color}`, color, background: "rgba(255,255,255,.9)", borderRadius: 20, padding: "6px 30px", fontFamily: ANTON, fontSize: size, letterSpacing: 3, transform: `rotate(-8deg) scale(${3 - 2 * s})`, opacity: Math.min(1, s * 2), boxShadow: `0 0 50px ${color}88` }}>✓ {text}</div>;
};

const Shake: React.FC<{ at: number[]; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const k = at.reduce((m, a) => Math.max(m, f >= a && f < a + 8 ? 1 - (f - a) / 8 : 0), 0);
  return <AbsoluteFill style={{ transform: `translate(${(random(f) - 0.5) * 30 * k}px, ${(random(f + 3) - 0.5) * 30 * k}px)` }}>{children}</AbsoluteFill>;
};

/* ---------------- scenes ---------------- */
const ClipFull: React.FC<{ c: Clip; open?: boolean }> = ({ c, open }) => {
  const f = useCurrentFrame(); const land = useLand(); const len = clipLen(c);
  const words = c.words.map(([w, t]): [string, number] => [w, t - c.from]);
  const vid = <OffthreadVideo src={S("clips/review1.mp4")} startFrom={sec(c.from)} volume={1.7} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.1) saturate(1.15)" }} />;
  return (
    <AbsoluteFill style={{ background: INK }}>
      <OffthreadVideo src={S("clips/review1.mp4")} startFrom={sec(c.from)} muted style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(36px) brightness(.4)", transform: "scale(1.2)" }} />
      {land
        ? <div style={{ position: "absolute", left: 140, top: 50, bottom: 50, width: 548, borderRadius: 34, overflow: "hidden", border: `5px solid ${RED}`, boxShadow: `0 0 70px ${RED}55`, transform: `scale(${1.04 - 0.04 * lerp(f, 0, len)})` }}>{vid}</div>
        : <AbsoluteFill style={{ transform: `scale(${1.02 + 0.06 * (f / len)})` }}>{vid}</AbsoluteFill>}
      {!land && <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.45) 0%, transparent 22%, transparent 62%, rgba(0,0,0,.6) 100%)" }} />}
      <div style={{ position: "absolute", ...(land ? { left: 760, right: 80, top: 190 } : { left: 40, top: 70 }), display: "flex", alignItems: "center", gap: 14, opacity: lerp(f, 2, 8), justifyContent: land ? "center" : "flex-start" }}>
        <div style={{ background: RED, borderRadius: 999, padding: "8px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: WHITE, opacity: f % 30 < 18 ? 1 : 0.3 }} />
          <span style={{ fontFamily: LAT, fontWeight: 800, fontSize: 32, color: WHITE }}>{c.tag}</span>
        </div>
      </div>
      {land && <div style={{ position: "absolute", left: 760, right: 80, top: 300 }}><Big text={open ? "VISA APPROVED" : "REAL CLIENT"} size={130} color={open ? GOLD : WHITE} /></div>}
      <Captions words={words} y={land ? 520 : 1180} size={land ? 72 : 92} x={land ? [760, 80] : undefined} />
      {open && <div style={{ position: "absolute", left: 0, right: land ? undefined : 0, ...(land ? { left: 760, right: 80, top: 800 } : { top: 1560 }), display: "flex", justifyContent: "center" }}><Stamp at={len - 40} size={land ? 72 : 88} /></div>}
    </AbsoluteFill>
  );
};

const Hook: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame(); const land = useLand();
  const cut = sec(2.3) + 6; // "তাহলে" → Bosnia reveal
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={cut}><Footage src={Q("doha_skyline")} dim={0.3} push={0.25} /></Sequence>
      <Sequence from={cut}><Footage src={Q("sarajevo_bridge")} dim={0.3} push={0.2} /></Sequence>
      <Shake at={[cut + 12]}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 20, top: land ? -120 : -260 }}>
          {f < cut ? <>
            <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: lerp(f, 4, 12) }}><Flag cc="qa" w={110} /><Big text="QATAR" size={land ? 150 : 170} at={4} /></div>
            <div style={{ fontFamily: ANTON, fontSize: 60, color: GOLD, opacity: lerp(f, 14, 20) }}>▼</div>
            <Big text="EUROPE?" size={land ? 190 : 170} at={18} color={GOLD} />
          </> : <>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: land ? 64 : 72, color: WHITE, opacity: lerp(f, cut + 2, cut + 8), textShadow: "0 6px 20px rgba(0,0,0,.8)" }}>এখনই সেরা সুযোগ</div>
            <div style={{ display: "flex", alignItems: "center", gap: 30 }}><Big text="BOSNIA" size={land ? 230 : 250} at={cut + 10} /></div>
            <div style={{ opacity: lerp(f, cut + 18, cut + 24), transform: `scale(${spring({ frame: f - cut - 18, fps: FPS, config: { damping: 10 } })})` }}><Flag cc="ba" w={160} /></div>
          </>}
        </AbsoluteFill>
      </Shake>
      <Captions words={voWords("hook", 6)} />
      {len < 0 && <span />}
    </AbsoluteFill>
  );
};

const DOHA = { lat: 25.29, lng: 51.53 }, SARA = { lat: 43.86, lng: 18.41 };
const MapScene: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig(); const land = W > H;
  const L0 = 8, L1 = 58, B0 = 17, B1 = 53;
  const mw = land ? 1250 : 1300, sc = mw / (L1 - L0), ox = (W - mw) / 2, oy = land ? 20 : 380;
  const X = (lng: number) => ox + (lng - L0) * sc, Y = (lat: number) => oy + (B1 - lat) * sc;
  const dots = (LANDPTS as [number, number][]).filter(([la, lo]) => lo >= L0 && lo <= L1 && la >= B0 && la <= B1);
  const x1 = X(DOHA.lng), y1 = Y(DOHA.lat), x2 = X(SARA.lng), y2 = Y(SARA.lat);
  const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 300;
  const p = lerp(f, 4, 48);
  const bez = (t: number) => [(1 - t) ** 2 * x1 + 2 * (1 - t) * t * mx + t * t * x2, (1 - t) ** 2 * y1 + 2 * (1 - t) * t * my + t * t * y2];
  const [px, py] = bez(p), [qx, qy] = bez(Math.min(1, p + 0.01));
  const ang = (Math.atan2(qy - py, qx - px) * 180) / Math.PI + 90;
  const pin = spring({ frame: f - 48, fps: FPS, config: { damping: 9 } });
  const tilt = interpolate(f, [0, len], [32, 22], clamp), z = interpolate(f, [0, len], [1, 1.18], clamp);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #1d0a10, ${INK} 70%)` }}>
      <AbsoluteFill style={{ opacity: 0.25 }}><Footage src={Q("plane_wing")} dim={0.6} /></AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1400 }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotateX(${tilt}deg) scale(${z})`, transformOrigin: `${x2}px ${y2}px` }}>
          <svg width={W} height={H}>
            {dots.map(([la, lo], i) => {
              const near = Math.hypot(la - SARA.lat, lo - SARA.lng) < 2.6 && pin > 0.1;
              const qa = Math.hypot(la - DOHA.lat, lo - DOHA.lng) < 1.6;
              return <circle key={i} cx={X(lo)} cy={Y(la)} r={near || qa ? 9 : 6.5} fill={near ? RED : qa ? GOLD : "rgba(255,255,255,0.28)"} />;
            })}
            <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke={GOLD} strokeWidth={8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} style={{ filter: `drop-shadow(0 0 14px ${GOLD})` }} />
            {p > 0 && p < 1 && <g transform={`translate(${px},${py}) rotate(${ang}) scale(3.4)`}><path d="M0,-14 L3,-4 L14,2 L14,5 L3,2 L2,10 L6,13 L6,15 L0,13 L-6,15 L-6,13 L-2,10 L-3,2 L-14,5 L-14,2 L-3,-4 Z" fill={WHITE} style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,.7))" }} /></g>}
            <g transform={`translate(${x2},${y2}) scale(${pin * 1.4})`}>
              <circle r={50 + (f % 20) * 4} fill="none" stroke={RED} strokeWidth={5} opacity={1 - (f % 20) / 20} />
              <path d="M0,0 C-22,-30 -30,-44 -30,-58 A30,30 0 1 1 30,-58 C30,-44 22,-30 0,0 Z" fill={RED} stroke="#fff" strokeWidth={4} />
              <circle cy={-58} r={11} fill="#fff" />
            </g>
          </svg>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: land ? 640 : 1420, display: "flex", justifyContent: "center" }}><Stamp at={50} text="VISA ✓ ON" size={land ? 80 : 96} /></div>
      <Captions words={voWords("bosnia", 6)} y={land ? 860 : 1640} />
    </AbsoluteFill>
  );
};

const POS = ["50% 64%", "50% 72%", "50% 70%"];
const Proof: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame(); const land = useLand();
  const hits = [BEAT * 2, BEAT * 3, BEAT * 4];
  const w = land ? 400 : 600;
  const slots = land ? [[560, 230, -8], [1360, 230, 8], [960, 210, 0]] : [[320, 380, -9], [760, 430, 8], [540, 640, -1]];
  const n = hits.filter((h) => f >= h + 6).length;
  return (
    <Shake at={hits.map((h) => h + 6)}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={S("visa/visa2.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(30px) brightness(.35)", transform: "scale(1.2)" }} />
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${RED}33, transparent 60%)` }} />
        {slots.map(([x, y, r], i) => {
          const s = spring({ frame: f - hits[i], fps: FPS, config: { damping: 13, stiffness: 140 } });
          const st = spring({ frame: f - hits[i] - 6, fps: FPS, config: { damping: 8, stiffness: 260 } });
          const ww = i === 2 ? w + 40 : w;
          return (
            <div key={i} style={{ position: "absolute", left: x - ww / 2, top: y, width: ww, height: ww * 1.25, borderRadius: 24, overflow: "hidden", border: "7px solid #fff", boxShadow: "0 40px 90px rgba(0,0,0,.7)", transform: `translateY(${(1 - s) * -1500}px) rotate(${r * s - (1 - s) * 25}deg)`, transformOrigin: "50% 100%" }}>
              <Img src={S(`visa/visa${i + 1}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: POS[i] }} />
              {f >= hits[i] + 6 && <div style={{ position: "absolute", left: "50%", top: "28%", transform: `translate(-50%,-50%) rotate(-14deg) scale(${2.6 - 1.6 * st})`, opacity: st, border: `8px solid ${GREEN}`, color: GREEN, background: "rgba(255,255,255,.9)", borderRadius: 14, padding: "4px 24px", fontFamily: ANTON, fontSize: 64, letterSpacing: 3 }}>APPROVED</div>}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, top: land ? 30 : 120, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 24 }}>
          <span style={{ fontFamily: ANTON, fontSize: land ? 120 : 150, color: GOLD, textShadow: `0 0 40px ${GOLD}66` }}>{String(n).padStart(2, "0")}+</span>
          <span style={{ fontFamily: ANTON, fontSize: land ? 80 : 96, color: WHITE }}>VISAS</span>
          <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: land ? 50 : 56, color: WHITE, opacity: 0.9 }}>এই সপ্তাহে</span>
        </div>
        <Captions words={voWords("proof", 6)} y={land ? 860 : 1500} />
        {len < 0 && <span />}
      </AbsoluteFill>
    </Shake>
  );
};

const NextWeek: React.FC = () => {
  const f = useCurrentFrame(); const land = useLand();
  return (
    <AbsoluteFill>
      <Footage src={Q("airport")} dim={0.45} push={0.2} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", top: land ? -140 : -300, gap: 10 }}>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: land ? 64 : 72, color: GOLD, opacity: lerp(f, 2, 8) }}>ইনশাআল্লাহ</div>
        <Big text="NEXT WEEK" size={land ? 200 : 190} at={6} />
        <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
          {["MORE VISAS", "MORE PERMITS"].map((t, i) => <div key={i} style={{ fontFamily: ANTON, fontSize: land ? 64 : 58, color: WHITE, background: i ? RED : "rgba(255,255,255,.14)", border: "3px solid rgba(255,255,255,.5)", borderRadius: 14, padding: "4px 24px", transform: `scale(${spring({ frame: f - 18 - i * 8, fps: FPS, config: { damping: 10 } })})` }}>{t}</div>)}
        </div>
      </AbsoluteFill>
      <Captions words={voWords("next", 6)} />
    </AbsoluteFill>
  );
};

const Vacancy: React.FC = () => {
  const f = useCurrentFrame(); const land = useLand();
  const hit = BEAT * 2;
  const flash = f >= hit && (f - hit) % 15 < 4;
  return (
    <Shake at={[hit]}>
      <AbsoluteFill>
        <Footage src={Q("plane_takeoff")} dim={0.35} push={0.35} />
        <AbsoluteFill style={{ background: RED, opacity: flash ? 0.25 : 0, mixBlendMode: "screen" }} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", top: land ? -140 : -300, gap: 6 }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: land ? 62 : 70, color: WHITE, opacity: lerp(f, 2, 8), textShadow: "0 6px 20px rgba(0,0,0,.8)" }}>স্বপ্ন যদি হয় ইউরোপ</div>
          <Big text="NEW" size={land ? 150 : 160} at={hit - 6} stroke color={GOLD} />
          <Big text="VACANCY" size={land ? 240 : 230} at={hit} color={WHITE} />
          <div style={{ marginTop: 16, background: RED, color: WHITE, fontFamily: DISP, fontWeight: 800, fontSize: land ? 64 : 70, borderRadius: 16, padding: "4px 30px", transform: `scale(${spring({ frame: f - hit - 8, fps: FPS, config: { damping: 9 } })}) rotate(-2deg)` }}>নতুন ভ্যাকেন্সি এসেছে!</div>
        </AbsoluteFill>
        <Captions words={voWords("vacancy", 6)} />
      </AbsoluteFill>
    </Shake>
  );
};

const WaIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#fff" /><path d="M16 5.5A10.5 10.5 0 0 0 7 21.3L5.6 26.4l5.3-1.4A10.5 10.5 0 1 0 16 5.5z" fill={GREEN} /><path d="M12.2 10.6c-.3-.6-.6-.6-.9-.6h-.8c-.3 0-.7.1-1 .5s-1.4 1.3-1.4 3.2 1.4 3.7 1.6 4c.2.3 2.7 4.3 6.6 5.8 3.3 1.3 3.9 1 4.6.9.7-.1 2.3-.9 2.6-1.9.3-.9.3-1.7.2-1.9-.1-.2-.4-.3-.8-.5s-2.3-1.1-2.6-1.3c-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.3-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.3-2.1-2.7-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.3 0-.5 0-.7l-1.1-2.5z" fill="#fff" /></svg>
);

const Cta: React.FC = () => {
  const f = useCurrentFrame(); const land = useLand();
  const pulse = 1 + Math.sin((f / BEAT) * Math.PI) ** 2 * 0.04;
  const glass: React.CSSProperties = { background: "rgba(255,255,255,0.1)", backdropFilter: "blur(18px)", border: "2px solid rgba(255,255,255,0.25)", borderRadius: 36 };
  const btn = (
    <div style={{ transform: `scale(${spring({ frame: f - 8, fps: FPS, config: { damping: 10 } }) * pulse})`, background: `linear-gradient(135deg, #2BE07A, #12A150)`, borderRadius: 40, padding: land ? "28px 44px" : "30px 36px", display: "flex", alignItems: "center", gap: 26, boxShadow: `0 0 ${50 + Math.sin(f / 5) * 25}px ${GREEN}aa` }}>
      <WaIcon size={land ? 120 : 130} />
      <div>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: land ? 44 : 46, color: "#eaffef" }}>হোয়াটসঅ্যাপে মেসেজ দিন</div>
        <div style={{ fontFamily: ANTON, fontSize: land ? 96 : 92, color: WHITE, lineHeight: 1.05, letterSpacing: 2, whiteSpace: "nowrap" }}>+974 7138 2220</div>
      </div>
    </div>
  );
  const addr = (
    <div style={{ ...glass, padding: "30px 36px", display: "flex", gap: 26, alignItems: "center", opacity: lerp(f, 30, 40), transform: `translateY(${(1 - lerp(f, 30, 40)) * 60}px)` }}>
      <svg width="86" height="110" viewBox="0 0 60 76" style={{ flexShrink: 0 }}><path d="M30 76 C14 52 2 40 2 28 A28 28 0 1 1 58 28 C58 40 46 52 30 76 Z" fill={RED} /><circle cx="30" cy="28" r="11" fill="#fff" /></svg>
      <div style={{ fontFamily: LAT, color: WHITE, lineHeight: 1.4 }}>
        <div style={{ fontFamily: DISP, fontWeight: 800, fontSize: 46, color: GOLD }}>দোহা অফিস</div>
        <div style={{ fontWeight: 800, fontSize: 34 }}>Building 13, 2nd Floor, Office 17</div>
        <div style={{ fontWeight: 500, fontSize: 31, opacity: 0.9 }}>860 Al Mahar St, Old Al Ghanim, Zone 06</div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Footage src={Q("doha_skyline")} dim={0.6} push={0.15} />
      <AbsoluteFill style={{ background: "rgba(7,7,11,0.35)" }} />
      {land ? <>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120 }}><Big text="CONTACT NOW" size={150} /></div>
        <div style={{ position: "absolute", left: 90, top: 400, width: 900 }}>{btn}</div>
        <div style={{ position: "absolute", left: 1060, right: 80, top: 400 }}>{addr}</div>
      </> : <>
        <div style={{ position: "absolute", left: 0, right: 0, top: 260 }}><Big text="CONTACT NOW" size={150} /></div>
        <div style={{ position: "absolute", left: 50, right: 50, top: 520 }}>{btn}</div>
        <div style={{ position: "absolute", left: 50, right: 50, top: 860 }}>{addr}</div>
      </>}
      <Captions words={voWords("cta", 6)} y={land ? 820 : 1300} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame(); const land = useLand();
  const s = spring({ frame: f, fps: FPS, config: { damping: 12 } });
  const sweep = interpolate(f, [6, 30], [-40, 140], clamp);
  return (
    <AbsoluteFill style={{ background: "#fff", justifyContent: "center", alignItems: "center", gap: 36 }}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <Img src={S("logo.png")} style={{ width: land ? 900 : 860, display: "block", transform: `scale(${0.75 + 0.25 * s})`, opacity: s }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweep}%`, width: "18%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.85), transparent)", transform: "skewX(-20deg)" }} />
      </div>
      <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 60, color: INK, opacity: lerp(f, 16, 26) }}>আপনার ইউরোপের স্বপ্ন, <span style={{ color: RED }}>আমাদের দায়িত্ব</span></div>
      <div style={{ opacity: lerp(f, 24, 34), background: GREEN, borderRadius: 999, padding: "14px 40px", display: "flex", alignItems: "center", gap: 18 }}>
        <WaIcon size={64} /><span style={{ fontFamily: ANTON, fontSize: 64, color: WHITE, letterSpacing: 2 }}>+974 7138 2220</span>
      </div>
    </AbsoluteFill>
  );
};

const SFX: Record<string, [string, number, number?][]> = {
  open: [],
  hook: [["pbsfx/whoosh.mp3", 0], ["dgsfx/boom.mp3", sec(2.3) + 16]],
  bosnia: [["pbsfx/plane.mp3", 0], ["pbsfx/hit.mp3", 50]],
  proof: [["pbsfx/hit.mp3", BEAT * 2 + 6], ["pbsfx/hit.mp3", BEAT * 3 + 6], ["pbsfx/hit.mp3", BEAT * 4 + 6], ["dgsfx/shimmer.mp3", 0]],
  next: [["pbsfx/whoosh.mp3", 0]],
  vacancy: [["dgsfx/riser.mp3", 0, 0.3], ["dgsfx/boom.mp3", BEAT * 2]],
  cta: [["pbsfx/whoosh.mp3", 0], ["btlsfx/msg.mp3", 10]],
  outro: [["dgsfx/shimmer.mp3", 0]],
};
const VO: Record<string, number> = { hook: 6, bosnia: 6, proof: 6, next: 6, vacancy: 6, cta: 6, outro: 8 };

const render = (id: string, len: number) => {
  if (id === "open") return <ClipFull c={CL.open} open />;
  if (id.startsWith("clip")) return <ClipFull c={CL.montage[Number(id.slice(4))]} />;
  if (id === "hook") return <Hook len={len} />;
  if (id === "bosnia") return <MapScene len={len} />;
  if (id === "proof") return <Proof len={len} />;
  if (id === "next") return <NextWeek />;
  if (id === "vacancy") return <Vacancy />;
  if (id === "cta") return <Cta />;
  return <Outro />;
};

export const DreamBosnia2: React.FC = () => {
  const plan = PLAN(); let at = 0;
  const spans = plan.map(([id, len]) => { const r = { id, len, from: at }; at += len; return r; });
  const clipSpans = spans.filter((s) => s.id === "open" || s.id.startsWith("clip"));
  const musicVol = (fr: number) => {
    const inClip = clipSpans.some((s) => fr >= s.from && fr < s.from + s.len);
    const base = inClip ? 0.07 : 0.3;
    return base * interpolate(fr, [0, 10, B2_TOTAL - 40, B2_TOTAL], [0.3, 1, 1, 0], clamp);
  };
  const open = spans[0].len;
  return (
    <AbsoluteFill style={{ background: INK }}>
      {/* music starts on the hook's downbeat so the cuts sit on its grid */}
      <Sequence from={open}><Audio src={S("music2.mp3")} volume={(fr) => musicVol(fr + open)} /></Sequence>
      {spans.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.len}>
          <Whip len={s.len} flash={i > 0}>{render(s.id, s.len)}</Whip>
          {!["outro"].includes(s.id) && <Mark />}
          {VO[s.id] !== undefined && <Sequence from={VO[s.id]}><Audio src={S(`vo2/${s.id}.mp3`)} volume={1.15} /></Sequence>}
          {(SFX[s.id] || []).map(([file, t, v], k) => <Sequence key={k} from={t}><Audio src={staticFile(file)} volume={v ?? 0.5} /></Sequence>)}
        </Sequence>
      ))}
      <Look />
    </AbsoluteFill>
  );
};
