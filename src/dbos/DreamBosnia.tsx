// Dream International — "কাতার থেকে বসনিয়া" visa-success promo (9:16 reel). VO Tanvir eleven-v4 (OpenRouter), work/dreambosnia/.
// Client visa photos are pre-blurred (work/dreambosnia/blur.py). Review clips + captions come from clips.json.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import DURS from "./durs.json";
import CLIPS from "./clips.json";
import LANDPTS from "../land.json";
import { Flag } from "../QatarEurope";

const FPS = 30, PAD = 0.45, LEAD = 8;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
const S = (p: string) => staticFile("dbos/" + p);
const Q = (p: string) => staticFile("qe/stock/" + p + ".mp4");

const RED = "#E8202A", RED2 = "#FF4D55", INK = "#0B0B12", GOLD = "#FFC83D", WHITE = "#FFFFFF", GREEN = "#25D366";
const DISP = "AnekB, 'Hind Siliguri', sans-serif", BODY = "Hind, 'Hind Siliguri', sans-serif", LAT = "Montserrat, sans-serif";

if (typeof document !== "undefined") {
  for (const [name, file] of [["AnekB", "AnekBangla.ttf"], ["Hind", "HindSiliguri-Bold.ttf"], ["Montserrat", "Montserrat.ttf"]]) {
    const ff = new FontFace(name, `url(${staticFile("fonts/" + file)})`);
    ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  }
}

type Seg = { p: string; text: string; dur: number; clips?: boolean };
type Clip = { file: string; from: number; to: number; cap: string; who?: string };
const CL = CLIPS as Clip[];
const SEGS = (DURS as Seg[]).filter((s) => !s.clips || CL.length > 0);
const useLand = () => { const { width, height } = useVideoConfig(); return width > height; };
const clipLen = (c: Clip) => Math.round((c.to - c.from) * FPS);

type Item = { kind: "vo"; s: Seg; from: number; len: number } | { kind: "clips"; from: number; len: number };
export const timelineDB = (): Item[] => {
  let at = 0; const out: Item[] = [];
  for (const s of SEGS) {
    const len = Math.round((s.dur + PAD) * FPS) + LEAD + (s.p === "outro" ? 60 : 0);
    out.push({ kind: "vo", s, from: at, len }); at += len;
    if (s.clips) { const l = CL.reduce((a, c) => a + clipLen(c), 0); out.push({ kind: "clips", from: at, len: l }); at += l; }
  }
  return out;
};
export const DB_TOTAL = (() => { const t = timelineDB(); return t[t.length - 1].from + t[t.length - 1].len; })();

/* ---------- shared bits ---------- */
const Stock: React.FC<{ src: string; dim?: number; zoom?: number; rate?: number }> = ({ src, dim = 0.55, zoom = 0.08, rate = 1 }) => {
  const f = useCurrentFrame(); const { durationInFrames: d } = useVideoConfig();
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: INK }}>
      <OffthreadVideo src={src} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + zoom * f / Math.max(d, 1)})` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(11,11,18,${dim * 0.7}) 0%, rgba(11,11,18,${dim * 0.35}) 40%, rgba(11,11,18,${dim + 0.2}) 100%)` }} />
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.07, mixBlendMode: "overlay", backgroundImage: `repeating-radial-gradient(circle at ${random(f) * 100}% ${random(f + 1) * 100}%, #fff 0 1px, transparent 1px 3px)` }} />;
};

// big kinetic headline: words pop in one by one
const Pop: React.FC<{ words: string[]; at?: number; size?: number; color?: string; hi?: number[]; step?: number; y?: number }> = ({ words, at = 0, size = 120, color = WHITE, hi = [], step = 4, y }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: y === undefined ? "relative" : "absolute", top: y, left: 0, right: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", wordSpacing: "0.1em", padding: "0 60px", lineHeight: 1.25 }}>
      {words.map((w, i) => {
        const s = spring({ frame: f - at - i * step, fps: FPS, config: { damping: 11, stiffness: 160 } });
        const isHi = hi.includes(i);
        return <span key={i} style={{ fontFamily: DISP, fontWeight: 800, fontSize: size, color: isHi ? GOLD : color, margin: "0 14px", display: "inline-block", opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 60}px) scale(${0.6 + 0.4 * s})`, textShadow: isHi ? `0 0 40px ${GOLD}88, 0 6px 20px rgba(0,0,0,.6)` : "0 6px 24px rgba(0,0,0,.65)" }}>{w}</span>;
      })}
    </div>
  );
};

const Chip: React.FC<{ children: React.ReactNode; bg?: string; color?: string; at?: number; size?: number }> = ({ children, bg = RED, color = WHITE, at = 0, size = 46 }) => {
  const f = useCurrentFrame(); const s = spring({ frame: f - at, fps: FPS, config: { damping: 12 } });
  return <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: bg, color, fontFamily: DISP, fontWeight: 700, fontSize: size, padding: `${size * 0.22}px ${size * 0.6}px`, borderRadius: 999, transform: `scale(${s})`, boxShadow: `0 10px 40px ${bg}66` }}>{children}</div>;
};

const LogoBar: React.FC = () => {
  const land = useLand();
  return (
    <div style={{ position: "absolute", top: land ? 36 : 70, left: land ? 44 : 0, right: land ? undefined : 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 26, padding: land ? "10px 24px" : "14px 30px", boxShadow: "0 10px 30px rgba(0,0,0,.35)" }}>
        <Img src={S("logo.png")} style={{ height: land ? 52 : 66, display: "block" }} />
      </div>
    </div>
  );
};

const Check: React.FC<{ size: number; color?: string }> = ({ size, color = GREEN }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill={color} /><path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/* ---------- scenes ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f < 10 ? (random(f) - 0.5) * 24 : 0;
  const flash = interpolate(f, [0, 6], [0.9, 0], clamp);
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
      <Stock src={Q("doha_skyline")} dim={0.5} zoom={0.25} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 34 }}>
        <div style={{ display: "flex", gap: 40, alignItems: "center", transform: `scale(${spring({ frame: f, fps: FPS, config: { damping: 10 } })})` }}>
          <Flag cc="qa" w={150} />
          <svg width="120" height="40" viewBox="0 0 120 40"><path d="M0 20 H100" stroke={WHITE} strokeWidth="6" strokeDasharray="12 10" strokeDashoffset={-f * 3} /><path d="M98 6 L118 20 L98 34" fill="none" stroke={GOLD} strokeWidth="7" strokeLinecap="round" /></svg>
          <svg width="150" height="100" viewBox="0 0 30 20" style={{ borderRadius: 9, boxShadow: "0 8px 24px rgba(0,0,0,.45)" }}><rect width="30" height="20" fill="#003399" />{Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2 + f * 0.03; return <circle key={i} cx={15 + Math.cos(a) * 6} cy={10 + Math.sin(a) * 6} r="0.9" fill="#FFCC00" />; })}</svg>
        </div>
        <Pop words={["কাতার", "থেকে"]} at={4} size={110} />
        <Pop words={["ইউরোপের", "স্বপ্ন?"]} at={12} size={170} hi={[1]} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

const DOHA = { lat: 25.29, lng: 51.53 }, SARA = { lat: 43.86, lng: 18.41 };
const MapRoute: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig(); const land = W > H;
  const L0 = 10, L1 = 57, B0 = 18, B1 = 52;
  const sc = (land ? 1150 : W) / (L1 - L0), oy = land ? 170 : 560, ox = land ? 40 : 0;
  const X = (lng: number) => ox + (lng - L0) * sc, Y = (lat: number) => oy + (B1 - lat) * sc;
  const dots = (LANDPTS as [number, number][]).filter(([la, lo]) => lo >= L0 && lo <= L1 && la >= B0 && la <= B1);
  const x1 = X(DOHA.lng), y1 = Y(DOHA.lat), x2 = X(SARA.lng), y2 = Y(SARA.lat);
  const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 260;
  const p = lerp(f, 18, 80);
  const bez = (t: number) => [(1 - t) ** 2 * x1 + 2 * (1 - t) * t * mx + t * t * x2, (1 - t) ** 2 * y1 + 2 * (1 - t) * t * my + t * t * y2];
  const [px, py] = bez(p), [qx, qy] = bez(Math.min(1, p + 0.01));
  const ang = (Math.atan2(qy - py, qx - px) * 180) / Math.PI + 90;
  const pin = spring({ frame: f - 80, fps: FPS, config: { damping: 9 } });
  const zoom = interpolate(f, [80, len], [1, 1.35], clamp);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #2a0d12, ${INK} 70%)` }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: `${x2}px ${y2}px` }}>
        <svg width={W} height={H}>
          {dots.map(([la, lo], i) => {
            const near = Math.hypot(la - SARA.lat, lo - SARA.lng) < 2.4 && pin > 0.1;
            return <circle key={i} cx={X(lo)} cy={Y(la)} r={near ? 7.5 : 5.2} fill={near ? RED2 : "rgba(255,255,255,0.34)"} />;
          })}
          <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke={GOLD} strokeWidth={6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} style={{ filter: `drop-shadow(0 0 10px ${GOLD})` }} />
          <circle cx={x1} cy={y1} r={14 + Math.sin(f / 5) * 3} fill={GOLD} />
          {p > 0 && p < 1 && <g transform={`translate(${px},${py}) rotate(${ang}) scale(2.6)`}><path d="M0,-14 L3,-4 L14,2 L14,5 L3,2 L2,10 L6,13 L6,15 L0,13 L-6,15 L-6,13 L-2,10 L-3,2 L-14,5 L-14,2 L-3,-4 Z" fill={WHITE} style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,.6))" }} /></g>}
          <g transform={`translate(${x2},${y2}) scale(${pin})`}>
            <circle r={60 + (f % 30) * 2} fill="none" stroke={RED2} strokeWidth={4} opacity={1 - (f % 30) / 30} />
            <path d="M0,0 C-22,-30 -30,-44 -30,-58 A30,30 0 1 1 30,-58 C30,-44 22,-30 0,0 Z" fill={RED} stroke="#fff" strokeWidth={4} />
            <circle cy={-58} r={11} fill="#fff" />
          </g>
        </svg>
      </div>
      <div style={{ position: "absolute", left: x1 - 120, top: y1 + 30, width: 240, textAlign: "center", fontFamily: DISP, fontWeight: 700, fontSize: 52, color: GOLD, opacity: lerp(f, 6, 16) }}>দোহা</div>
      <div style={{ position: "absolute", top: land ? 380 : 300, left: land ? 1180 : 0, right: land ? 30 : 0, opacity: interpolate(f, [70, 82], [1, 0], clamp) }}><Pop words={["এই", "মুহূর্তে", "বেস্ট", "দেশ?"]} at={6} size={100} hi={[2]} /></div>
      <div style={{ position: "absolute", top: land ? 400 : 1380, left: land ? 1180 : 0, right: land ? 30 : 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ opacity: lerp(f, 84, 94), display: "flex", alignItems: "center", gap: 30, transform: `scale(${pin})` }}>
          <Flag cc="ba" w={land ? 120 : 150} />
          <span style={{ fontFamily: DISP, fontWeight: 800, fontSize: land ? 130 : 150, color: WHITE, textShadow: `0 0 50px ${RED}aa` }}>বসনিয়া</span>
        </div>
        <div style={{ fontFamily: DISP, fontSize: 58, color: "rgba(255,255,255,.8)", opacity: lerp(f, 96, 108) }}>এই মুহূর্তে সেরা সুযোগ</div>
      </div>
    </AbsoluteFill>
  );
};

const VisaOk: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stock src={Q("sarajevo_bridge")} dim={0.45} zoom={0.2} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40 }}>
        <Pop words={["কাতার", "থেকে", "বসনিয়ার"]} size={104} />
        <div style={{ transform: `scale(${spring({ frame: f - 14, fps: FPS, config: { damping: 8 } })}) rotate(-4deg)`, background: GREEN, borderRadius: 30, padding: "18px 56px", display: "flex", alignItems: "center", gap: 26, boxShadow: `0 20px 60px ${GREEN}66` }}>
          <Check size={100} color="#0e8f43" />
          <span style={{ fontFamily: DISP, fontWeight: 800, fontSize: 130, color: WHITE }}>ভিসা হচ্ছে!</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const POS = ["50% 64%", "50% 72%", "50% 70%"];
const VisaCard: React.FC<{ i: number; at: number; x: number; y: number; rot: number; w?: number }> = ({ i, at, x, y, rot, w = 560 }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 14, stiffness: 120 } });
  const st = spring({ frame: f - at - 12, fps: FPS, config: { damping: 9, stiffness: 220 } });
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: w * 1.25, transform: `translateY(${(1 - s) * 1400}px) rotate(${rot * s + (1 - s) * 30}deg) perspective(1200px) rotateY(${(1 - s) * 40}deg)`, borderRadius: 26, overflow: "hidden", border: "8px solid #fff", boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
      <Img src={S(`visa/visa${i + 1}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: POS[i] }} />
      <div style={{ position: "absolute", left: "50%", top: "30%", transform: `translate(-50%,-50%) rotate(-14deg) scale(${2.4 - 1.4 * st})`, opacity: st, border: `8px solid ${GREEN}`, color: GREEN, background: "rgba(255,255,255,.85)", borderRadius: 16, padding: "6px 26px", fontFamily: LAT, fontWeight: 900, fontSize: 64, letterSpacing: 4 }}>APPROVED</div>
    </div>
  );
};

const Proof: React.FC = () => {
  const f = useCurrentFrame(); const land = useLand();
  const n = Math.round(interpolate(f, [20, 110], [0, 3], clamp));
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, #3a0c12, ${INK} 75%)` }}>
      <div style={{ position: "absolute", top: land ? 40 : 230, left: 0, right: 0 }}><Pop words={["আলহামদুলিল্লাহ"]} size={110} hi={[0]} /></div>
      <div style={{ position: "absolute", top: land ? 190 : 390, left: 0, right: 0, textAlign: "center", opacity: lerp(f, 30, 40) }}><Chip at={30} size={56}>শুধু এই সপ্তাহেই</Chip></div>
      {land ? <>
        <VisaCard i={0} at={36} x={520} y={310} rot={-7} w={420} />
        <VisaCard i={1} at={52} x={1400} y={310} rot={7} w={420} />
        <VisaCard i={2} at={68} x={960} y={290} rot={-1} w={440} />
      </> : <>
        <VisaCard i={0} at={36} x={330} y={620} rot={-9} />
        <VisaCard i={1} at={52} x={760} y={680} rot={7} />
        <VisaCard i={2} at={68} x={540} y={900} rot={-2} w={600} />
      </>}
      <div style={{ position: "absolute", bottom: land ? 30 : 120, left: 0, right: 0, textAlign: "center", fontFamily: DISP, fontWeight: 800, fontSize: land ? 72 : 84, color: WHITE, opacity: lerp(f, 90, 100), textShadow: "0 6px 20px rgba(0,0,0,.8)" }}>বসনিয়ার <span style={{ color: GOLD }}>অনেকগুলো</span> ভিসা ✓</div>
      {n < 0 && <span />}
    </AbsoluteFill>
  );
};

const ClipsIntro: React.FC = () => (
  <AbsoluteFill>
    <Stock src={Q("sarajevo_tram")} dim={0.6} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40 }}>
      <Chip size={60} bg={GOLD} color={INK}>REAL REVIEW</Chip>
      <Pop words={["শুনুন", "ক্লায়েন্টদের", "মুখ", "থেকেই"]} at={6} size={124} hi={[1]} />
    </AbsoluteFill>
  </AbsoluteFill>
);

const ClipPlayer: React.FC<{ c: Clip }> = ({ c }) => {
  const f = useCurrentFrame(); const len = clipLen(c); const land = useLand();
  const fade = Math.min(lerp(f, 0, 6), interpolate(f, [len - 5, len], [1, 0], clamp));
  return (
    <AbsoluteFill style={{ background: INK }}>
      <OffthreadVideo src={S("clips/" + c.file)} startFrom={Math.round(c.from * FPS)} muted style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(.45)", transform: "scale(1.2)" }} />
      <div style={{ position: "absolute", ...(land ? { left: 200, width: 520, top: 60, bottom: 60 } : { left: 50, right: 50, top: 230, bottom: 380 }), borderRadius: 40, overflow: "hidden", border: `6px solid ${RED}`, boxShadow: `0 0 60px ${RED}66`, opacity: fade }}>
        <OffthreadVideo src={S("clips/" + c.file)} startFrom={Math.round(c.from * FPS)} volume={1.6} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 26, left: 26, display: "flex", alignItems: "center", gap: 12, background: "rgba(0,0,0,.6)", borderRadius: 999, padding: "8px 24px" }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: RED2, opacity: f % 30 < 18 ? 1 : 0.3 }} />
          <span style={{ fontFamily: LAT, fontWeight: 800, fontSize: 34, color: WHITE }}>CLIENT REVIEW</span>
        </div>
      </div>
      <div style={{ position: "absolute", ...(land ? { left: 820, right: 100, top: 560 } : { left: 60, right: 60, bottom: 150 }), display: "flex", justifyContent: "center", opacity: lerp(f, 4, 12) }}>
        <div style={{ background: "rgba(255,255,255,.96)", borderRadius: 26, padding: "18px 34px", fontFamily: DISP, fontWeight: 700, fontSize: 58, color: INK, textAlign: "center", lineHeight: 1.3, boxShadow: "0 12px 40px rgba(0,0,0,.5)" }}>{c.cap} ✓</div>
      </div>
      {land && <div style={{ position: "absolute", left: 820, right: 100, top: 230, textAlign: "center", fontFamily: DISP, fontWeight: 800, fontSize: 96, color: WHITE, opacity: lerp(f, 2, 10), textShadow: "0 6px 24px rgba(0,0,0,.7)" }}>রিয়েল ক্লায়েন্ট <span style={{ color: GOLD }}>রিভিউ</span></div>}
      {c.who && <div style={{ position: "absolute", left: land ? 820 : 0, right: land ? 100 : 0, ...(land ? { top: 420 } : { bottom: 300 }), display: "flex", justifyContent: "center", opacity: lerp(f, 8, 16) }}><Chip at={8} size={42} bg={GREEN}><Check size={44} color="#0e8f43" />{c.who}</Chip></div>}
    </AbsoluteFill>
  );
};

const NextWeek: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stock src={Q("airport")} dim={0.6} zoom={0.15} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 36 }}>
        <div style={{ transform: `scale(${spring({ frame: f, fps: FPS, config: { damping: 11 } })})`, width: 300, borderRadius: 30, overflow: "hidden", background: WHITE, boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}>
          <div style={{ background: RED, color: WHITE, fontFamily: DISP, fontWeight: 700, fontSize: 48, textAlign: "center", padding: "10px 0" }}>আগামী সপ্তাহ</div>
          <div style={{ fontFamily: LAT, fontWeight: 900, fontSize: 150, color: INK, textAlign: "center", lineHeight: 1.2 }}>+</div>
        </div>
        <Pop words={["ইনশাআল্লাহ"]} at={8} size={96} hi={[0]} />
        <Pop words={["আরও", "অনেক", "ভিসা", "ও", "পারমিট", "আসছে"]} at={16} size={104} hi={[2, 4]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Vacancy: React.FC = () => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const flash = f % 16 < 8;
  return (
    <AbsoluteFill>
      <Stock src={Q("plane_takeoff")} dim={0.55} zoom={0.3} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 48%, ${RED}${flash ? "55" : "22"}, transparent 60%)` }} />
      <svg width={W} height={H} style={{ position: "absolute", opacity: 0.18 }}>{Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2 + f * 0.01, cx = W / 2, cy = H * 0.47; return <path key={i} d={`M${cx},${cy} L${cx + Math.cos(a) * 2200},${cy + Math.sin(a) * 2200} L${cx + Math.cos(a + 0.12) * 2200},${cy + Math.sin(a + 0.12) * 2200} Z`} fill="#fff" />; })}</svg>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40 }}>
        <Pop words={["স্বপ্ন", "যদি", "হয়", "ইউরোপ"]} size={96} hi={[3]} />
        <div style={{ transform: `scale(${spring({ frame: f - 30, fps: FPS, config: { damping: 7 } }) * (1 + Math.sin(f / 4) * 0.02)}) rotate(-3deg)`, background: `linear-gradient(135deg, ${RED}, #a50f17)`, borderRadius: 34, padding: "26px 50px", border: "6px solid #fff", boxShadow: `0 20px 80px ${RED}aa` }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 64, color: GOLD, textAlign: "center" }}>এসেছে</div>
          <div style={{ fontFamily: DISP, fontWeight: 800, fontSize: 140, color: WHITE, lineHeight: 1.15 }}>নতুন ভ্যাকেন্সি</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const WaIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#fff" /><path d="M16 5.5A10.5 10.5 0 0 0 7 21.3L5.6 26.4l5.3-1.4A10.5 10.5 0 1 0 16 5.5z" fill={GREEN} /><path d="M12.2 10.6c-.3-.6-.6-.6-.9-.6h-.8c-.3 0-.7.1-1 .5s-1.4 1.3-1.4 3.2 1.4 3.7 1.6 4c.2.3 2.7 4.3 6.6 5.8 3.3 1.3 3.9 1 4.6.9.7-.1 2.3-.9 2.6-1.9.3-.9.3-1.7.2-1.9-.1-.2-.4-.3-.8-.5s-2.3-1.1-2.6-1.3c-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.3-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.3-2.1-2.7-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.3 0-.5 0-.7l-1.1-2.5z" fill="#fff" /></svg>
);

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  if (useLand()) return <CtaLand />;
  const pulse = 1 + Math.sin(f / 5) * 0.035;
  const tap = f > 70 && f % 40 < 10;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 35%, #34101a, ${INK} 75%)` }}>
      <LogoBar />
      <div style={{ position: "absolute", top: 270, left: 0, right: 0 }}><Pop words={["অফিসে", "আসুন", "অথবা"]} size={90} /></div>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0 }}><Pop words={["হোয়াটসঅ্যাপে", "মেসেজ", "দিন"]} at={20} size={100} hi={[0]} /></div>
      <div style={{ position: "absolute", top: 640, left: 70, right: 70, transform: `scale(${spring({ frame: f - 30, fps: FPS, config: { damping: 10 } }) * pulse * (tap ? 0.96 : 1)})`, background: GREEN, borderRadius: 46, padding: "34px 30px", display: "flex", alignItems: "center", justifyContent: "center", gap: 30, boxShadow: `0 0 ${60 + Math.sin(f / 5) * 30}px ${GREEN}aa` }}>
        <WaIcon size={130} />
        <div>
          <div style={{ fontFamily: LAT, fontWeight: 900, fontSize: 74, color: WHITE, lineHeight: 1, whiteSpace: "nowrap" }}>+974 7138 2220</div>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 46, color: "#eaffef", marginTop: 8 }}>শুধু একটা মেসেজ দিন</div>
        </div>
      </div>
      {tap && <div style={{ position: "absolute", left: 760, top: 830, width: 90, height: 90, borderRadius: 45, background: "rgba(255,255,255,.6)" }} />}
      <div style={{ position: "absolute", top: 1010, left: 70, right: 70, background: "rgba(255,255,255,0.97)", borderRadius: 36, padding: "36px 40px", display: "flex", gap: 30, alignItems: "center", opacity: lerp(f, 50, 62), transform: `translateY(${(1 - lerp(f, 50, 62)) * 80}px)` }}>
        <svg width="110" height="140" viewBox="0 0 60 76" style={{ flexShrink: 0, transform: `translateY(${Math.abs(Math.sin(f / 8)) * -10}px)` }}><path d="M30 76 C14 52 2 40 2 28 A28 28 0 1 1 58 28 C58 40 46 52 30 76 Z" fill={RED} /><circle cx="30" cy="28" r="11" fill="#fff" /></svg>
        <div style={{ fontFamily: LAT, color: INK, lineHeight: 1.35 }}>
          <div style={{ fontWeight: 900, fontSize: 44 }}>Building 13, 2nd Floor, Office 17</div>
          <div style={{ fontWeight: 600, fontSize: 38, color: "#333" }}>860 Al Mahar St, Old Al Ghanim</div>
          <div style={{ fontWeight: 600, fontSize: 38, color: "#333" }}>Zone 06, Doha, Qatar</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1420, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 24, opacity: lerp(f, 80, 92) }}>
        <Chip at={80} size={44} bg="rgba(255,255,255,.12)"><Flag cc="qa" w={60} /> দোহা অফিস</Chip>
        <Chip at={86} size={44} bg="rgba(255,255,255,.12)"><Flag cc="ba" w={60} /> বসনিয়া</Chip>
      </div>
    </AbsoluteFill>
  );
};

const CtaLand: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f / 5) * 0.035;
  const tap = f > 70 && f % 40 < 10;
  const ad = lerp(f, 50, 62);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 40%, #34101a, ${INK} 75%)` }}>
      <LogoBar />
      <div style={{ position: "absolute", top: 170, left: 60, width: 960 }}><Pop words={["অফিসে", "আসুন", "অথবা"]} size={76} /></div>
      <div style={{ position: "absolute", top: 280, left: 40, width: 1000 }}><Pop words={["হোয়াটসঅ্যাপে", "মেসেজ", "দিন"]} at={20} size={80} hi={[0]} /></div>
      <div style={{ position: "absolute", top: 500, left: 110, width: 860, transform: `scale(${spring({ frame: f - 30, fps: FPS, config: { damping: 10 } }) * pulse * (tap ? 0.96 : 1)})`, background: GREEN, borderRadius: 46, padding: "34px 30px", display: "flex", alignItems: "center", justifyContent: "center", gap: 30, boxShadow: `0 0 ${60 + Math.sin(f / 5) * 30}px ${GREEN}aa` }}>
        <WaIcon size={130} />
        <div>
          <div style={{ fontFamily: LAT, fontWeight: 900, fontSize: 80, color: WHITE, lineHeight: 1, whiteSpace: "nowrap" }}>+974 7138 2220</div>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 46, color: "#eaffef", marginTop: 8 }}>শুধু একটা মেসেজ দিন</div>
        </div>
      </div>
      {tap && <div style={{ position: "absolute", left: 820, top: 640, width: 90, height: 90, borderRadius: 45, background: "rgba(255,255,255,.6)" }} />}
      <div style={{ position: "absolute", top: 230, left: 1100, right: 70, background: "rgba(255,255,255,0.97)", borderRadius: 36, padding: "40px 40px", display: "flex", flexDirection: "column", gap: 26, alignItems: "center", opacity: ad, transform: `translateX(${(1 - ad) * 120}px)` }}>
        <svg width="100" height="128" viewBox="0 0 60 76" style={{ transform: `translateY(${Math.abs(Math.sin(f / 8)) * -10}px)` }}><path d="M30 76 C14 52 2 40 2 28 A28 28 0 1 1 58 28 C58 40 46 52 30 76 Z" fill={RED} /><circle cx="30" cy="28" r="11" fill="#fff" /></svg>
        <div style={{ fontFamily: DISP, fontWeight: 800, fontSize: 56, color: RED }}>দোহা অফিস</div>
        <div style={{ fontFamily: LAT, color: INK, lineHeight: 1.4, textAlign: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 34 }}>Building 13, 2nd Floor, Office 17</div>
          <div style={{ fontWeight: 600, fontSize: 36, color: "#333" }}>860 Al Mahar St, Old Al Ghanim</div>
          <div style={{ fontWeight: 600, fontSize: 36, color: "#333" }}>Zone 06, Doha, Qatar</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 830, left: 1100, right: 70, display: "flex", justifyContent: "center", gap: 24, opacity: lerp(f, 80, 92) }}>
        <Chip at={80} size={44} bg="rgba(255,255,255,.12)"><Flag cc="qa" w={60} /> কাতার</Chip>
        <Chip at={86} size={44} bg="rgba(255,255,255,.12)"><Flag cc="ba" w={60} /> বসনিয়া</Chip>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps: FPS, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ background: "#fff", justifyContent: "center", alignItems: "center", gap: 50 }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, ${RED}18, transparent 60%)` }} />
      <Img src={S("logo.png")} style={{ width: 860, transform: `scale(${0.7 + 0.3 * s})`, opacity: s }} />
      <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 64, color: INK, opacity: lerp(f, 18, 30), textAlign: "center", lineHeight: 1.35 }}>আপনার ইউরোপের স্বপ্ন,<br /><span style={{ color: RED }}>আমাদের দায়িত্ব</span></div>
      <div style={{ opacity: lerp(f, 34, 44), background: GREEN, borderRadius: 999, padding: "16px 44px", display: "flex", alignItems: "center", gap: 20 }}>
        <WaIcon size={70} /><span style={{ fontFamily: LAT, fontWeight: 900, fontSize: 62, color: WHITE }}>+974 7138 2220</span>
      </div>
    </AbsoluteFill>
  );
};

const SFX: Record<string, [string, number][]> = {
  hook: [["dgsfx/boom.mp3", 0], ["pbsfx/whoosh.mp3", 10]],
  bosnia: [["pbsfx/plane.mp3", 14], ["pbsfx/pop.mp3", 80], ["pbsfx/whoosh.mp3", 140]],
  proof: [["dgsfx/shimmer.mp3", 0], ["pbsfx/hit.mp3", 48], ["pbsfx/hit.mp3", 64], ["pbsfx/hit.mp3", 80]],
  clips: [["dgsfx/riser.mp3", 0]],
  next: [["pbsfx/whoosh.mp3", 0], ["pbsfx/pop.mp3", 16]],
  vacancy: [["btlsfx/alert.mp3", 28], ["dgsfx/boom.mp3", 30]],
  cta: [["pbsfx/whoosh.mp3", 0], ["btlsfx/msg.mp3", 34], ["pbsfx/click.mp3", 70]],
  outro: [["dgsfx/shimmer.mp3", 0]],
};

const Scene: React.FC<{ s: Seg; len: number }> = ({ s, len }) => {
  const split = Math.round(4.1 * FPS);
  return (
    <AbsoluteFill>
      {s.p === "hook" && <Hook />}
      {s.p === "bosnia" && <><Sequence durationInFrames={split}><MapRoute len={split} /></Sequence><Sequence from={split}><VisaOk /></Sequence></>}
      {s.p === "proof" && <Proof />}
      {s.p === "clips" && <ClipsIntro />}
      {s.p === "next" && <NextWeek />}
      {s.p === "vacancy" && <Vacancy />}
      {s.p === "cta" && <Cta />}
      {s.p === "outro" && <Outro />}
      {!["cta", "outro"].includes(s.p) && <LogoBar />}
      <Sequence from={LEAD - 4}><Audio src={S(`vo/${s.p}.mp3`)} volume={1} /></Sequence>
      {(SFX[s.p] || []).map(([file, at], i) => <Sequence key={i} from={at}><Audio src={staticFile(file)} volume={0.45} /></Sequence>)}
      {len < 0 && <span />}
    </AbsoluteFill>
  );
};

export const DreamBosnia: React.FC = () => {
  const tl = timelineDB();
  const clipStart = tl.find((t) => t.kind === "clips");
  const musicVol = (fr: number) => {
    if (clipStart && fr >= clipStart.from && fr < clipStart.from + clipStart.len) return 0.05;
    return interpolate(fr, [0, 15, DB_TOTAL - 45, DB_TOTAL], [0.0, 0.2, 0.2, 0], clamp);
  };
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Audio src={S("music.mp3")} volume={musicVol} loop />
      {tl.map((t, i) => (
        <Sequence key={i} from={t.from} durationInFrames={t.len}>
          {t.kind === "vo" ? <Scene s={t.s} len={t.len} /> : (() => {
            let at = 0;
            return CL.map((c, k) => { const el = <Sequence key={k} from={at} durationInFrames={clipLen(c)}><ClipPlayer c={c} /></Sequence>; at += clipLen(c); return el; });
          })()}
        </Sequence>
      ))}
      <Grain />
    </AbsoluteFill>
  );
};
