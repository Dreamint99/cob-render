// GDS course reel (AI University): viral hook → why GDS → in-app GDS ticketing lab (real screen recording) → features + certificate
// → who it's for → ৳999 offer. One engine, 9:16 reel + 16:9 feed. VO: work/gdsreel/make_vo.py (Tanvir). Recordings: work/pbcap/gdsrec.mjs.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import DURS from "./durs.json";

const FPS = 30, LEAD = 6, TAIL = 10;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
const S = (p: string) => staticFile("gdsreel/" + p);
const BG = "#060B18", CARD = "#0F172A", LINE = "rgba(148,163,184,0.16)", BLUE = "#3B82F6", BLUE2 = "#60A5FA", GOLD = "#FBBF24", MINT = "#34D399", TXT = "#F8FAFC", MUTE = "#94A3B8", TERM = "#7CFFB2";
const BN = "AnekB, 'Hind Siliguri', sans-serif", MONO = "'Courier New', monospace";
const GRAD = `linear-gradient(90deg, ${GOLD}, #F97316)`;

if (typeof document !== "undefined") {
  const ff = new FontFace("AnekB", `url(${staticFile("fonts/AnekBangla.ttf")})`);
  ff.load().then(() => document.fonts.add(ff)).catch(() => {});
}

const SCENES = ["hook", "why", "lab", "feats", "who", "cta"] as const;
const D = DURS as Record<string, number>;
export const gdsTimeline = () => {
  let at = 0;
  return SCENES.map((p, i) => {
    const len = Math.round(D[p] * FPS) + (i === 0 ? 2 : LEAD) + TAIL + (p === "cta" ? 45 : 0);
    const it = { p, from: at, len, lead: i === 0 ? 2 : LEAD }; at += len; return it;
  });
};
export const GDS_TOTAL = (() => { const t = gdsTimeline(); return t[t.length - 1].from + t[t.length - 1].len; })();

const useIn = (d = 0, damping = 13) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - d, fps, config: { damping, mass: 0.8 } }); };
const useV = () => { const { width, height } = useVideoConfig(); return height > width; };

const Backdrop: React.FC<{ hue?: string }> = ({ hue = BLUE }) => {
  const f = useCurrentFrame();
  const { width: W } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: W * 1.1, height: W * 1.1, left: -W * 0.35 + 60 * Math.sin(f / 50), top: -W * 0.5, borderRadius: "50%", background: `radial-gradient(circle, ${hue}45, transparent 62%)` }} />
      <div style={{ position: "absolute", width: W, height: W, right: -W * 0.4, bottom: -W * 0.3, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}1F, transparent 62%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${LINE} 1px, transparent 1px), linear-gradient(90deg, ${LINE} 1px, transparent 1px)`, backgroundSize: "72px 72px", backgroundPosition: `0 ${(f * 0.8) % 72}px`, opacity: 0.3,
        maskImage: "radial-gradient(ellipse at 50% 45%, black 25%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, black 25%, transparent 75%)" }} />
    </AbsoluteFill>
  );
};

const Head: React.FC<{ text: string; hot?: string[]; top?: number; size?: number; delay?: number }> = ({ text, hot = [], top, size, delay = 2 }) => {
  const f = useCurrentFrame();
  const V = useV();
  return (
    <div style={{ position: "absolute", top: top ?? (V ? 210 : 90), left: V ? 0 : 900, right: 0, textAlign: V ? "center" : "left", padding: V ? "0 60px" : "0 90px 0 0", fontFamily: BN, fontWeight: 800, fontSize: size ?? (V ? 84 : 76), lineHeight: 1.15, color: TXT }}>
      {text.split(" ").map((w, i) => {
        const k = lerp(f, delay + i * 3, delay + i * 3 + 14);
        return <span key={i} style={{ display: "inline-block", marginRight: "0.25em", opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${0.9 + 0.1 * k})`, filter: `blur(${(1 - k) * 8}px)`,
          ...(hot.some((h) => w.includes(h)) ? { background: GRAD, WebkitBackgroundClip: "text", color: "transparent" } : {}) }}>{w}</span>;
      })}
    </div>
  );
};

/* rebuilt terminal (crisp text) */
const FLIGHTS = [
  " 1  FZ 6408  J1 Y7 B1 M6   DAC DXB  0130  0505",
  " 2  BG 8147  J5 C4 Y7 B0   DAC DXB  0845  1225",
  " 3  EK 6582  J3 C1 Y9 B2   DAC DXB  1015  1340",
  " 4  BS 8341  C1 Y9 B3 M4   DAC DXB  1930  2315",
  " 5  EK 6586  J3 C1 Y9 B4   DAC DXB  2150  0115",
];
const Terminal: React.FC<{ x: number; y: number; w: number; fs: number; start?: number }> = ({ x, y, w, fs, start = 6 }) => {
  const f = useCurrentFrame();
  const cmd = "AN12DECDACDXB";
  const n = Math.max(0, Math.min(cmd.length, Math.floor((f - start) / 2.2)));
  const shown = f - start - cmd.length * 2.2 - 8;
  const k = useIn(0, 14);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: fs * 1.1, borderRadius: 26, background: "#020617", border: `2px solid ${TERM}55`, boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 80px ${TERM}22`,
      fontFamily: MONO, fontWeight: 700, fontSize: fs, lineHeight: 1.55, color: TERM, opacity: k, transform: `scale(${0.9 + 0.1 * k})` }}>
      <div style={{ display: "flex", gap: 10, marginBottom: fs * 0.7 }}>{["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: fs * 0.6, height: fs * 0.6, borderRadius: 20, background: c }} />)}<span style={{ marginLeft: 12, color: MUTE, fontSize: fs * 0.75 }}>GDS · Ticketing Lab</span></div>
      <div>&gt; {cmd.slice(0, n)}<span style={{ opacity: f % 14 < 7 ? 1 : 0 }}>▌</span></div>
      {shown > 0 ? <div style={{ color: "#E2E8F0" }}>** AN ** DXB DUBAI   12DEC</div> : null}
      {FLIGHTS.map((l, i) => (shown > 4 + i * 4 ? <div key={i} style={{ whiteSpace: "pre", color: i === 2 ? GOLD : TERM }}>{l}</div> : null))}
    </div>
  );
};

const Phone: React.FC<{ x: number; y: number; w: number; src: string; from?: number; rate?: number; zoom?: number }> = ({ x, y, w, src, from = 0, rate = 1, zoom = 1 }) => {
  const f = useCurrentFrame();
  const k = useIn(0, 14);
  const h = w * 2.17;
  const z = interpolate(f, [20, 140], [1, zoom], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: w * 0.03, borderRadius: w * 0.13, background: "#000", border: "3px solid #334155",
      boxShadow: `0 50px 120px rgba(0,0,0,0.75), 0 0 90px ${BLUE}40`, opacity: k, transform: `translateY(${(1 - k) * 120}px) rotate(${(1 - k) * -4}deg)` }}>
      <div style={{ borderRadius: w * 0.1, overflow: "hidden", height: h }}>
        <div style={{ transform: `scale(${z})`, transformOrigin: "50% 80%" }}>
          <OffthreadVideo src={S("rec/" + src)} startFrom={Math.round(from * FPS)} playbackRate={rate} muted style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  );
};

const Chip: React.FC<{ t: string; i: number; fs: number; color?: string }> = ({ t, i, fs, color = BLUE }) => {
  const k = useIn(8 + i * 6, 12);
  return <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: `${fs * 0.45}px ${fs * 0.8}px`, borderRadius: 60, background: `${color}22`, border: `2px solid ${color}88`, fontFamily: BN, fontWeight: 700, fontSize: fs, color: TXT,
    opacity: k, transform: `translateY(${(1 - k) * 30}px) scale(${0.85 + 0.15 * k})` }}>{t}</div>;
};

/* scenes */
const Hook: React.FC = () => {
  const V = useV();
  return (
    <AbsoluteFill>
      <Backdrop hue="#047857" />
      <Head text="প্লেনের টিকেট কাটা হয় এই কালো স্ক্রিনে! 👀" hot={["কালো", "স্ক্রিনে!"]} />
      <Terminal x={V ? 60 : 90} y={V ? 560 : 260} w={V ? 960 : 780} fs={V ? 31 : 26} start={8} />
    </AbsoluteFill>
  );
};

const Why: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const g = useIn(2, 10);
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", top: V ? 380 : 220, left: V ? 0 : 120, right: V ? 0 : undefined, width: V ? undefined : 700, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: V ? 330 : 300, letterSpacing: -10, lineHeight: 1,
        background: `linear-gradient(180deg, ${TXT}, ${BLUE2})`, WebkitBackgroundClip: "text", color: "transparent", transform: `scale(${0.6 + 0.4 * g})`, opacity: g, filter: `drop-shadow(0 0 60px ${BLUE}88)` }}>GDS</div>
      <div style={{ position: "absolute", top: V ? 760 : 580, left: V ? 0 : 120, right: V ? 0 : undefined, width: V ? undefined : 700, display: "flex", justifyContent: "center", gap: 16 }}>
        {["Amadeus", "Sabre", "Galileo"].map((t, i) => <Chip key={t} t={t} i={i} fs={V ? 40 : 36} />)}
      </div>
      <div style={{ position: "absolute", top: V ? 920 : 300, left: V ? 60 : 900, right: V ? 60 : 90, textAlign: V ? "center" : "left", fontFamily: BN, fontWeight: 800, fontSize: V ? 70 : 72, lineHeight: 1.2, color: TXT, opacity: lerp(f, 24, 40) }}>
        ট্রাভেল এজেন্সির <span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>১ নম্বর স্কিল</span>
      </div>
    </AbsoluteFill>
  );
};

const Lab: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const b = useIn(30, 12);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Head text="অ্যাপের ভেতরেই GDS টিকেটিং ল্যাব" hot={["GDS", "টিকেটিং", "ল্যাব"]} size={V ? 74 : 70} />
      <Phone x={V ? 310 : 230} y={V ? 360 : 60} w={V ? 460 : 440} src="pnr.mp4" from={8} rate={1.7} zoom={1.12} />
      <div style={{ position: "absolute", left: V ? 560 : 1180, top: V ? 420 : 520, padding: "16px 28px", borderRadius: 50, background: "#DC2626", fontFamily: BN, fontWeight: 800, fontSize: V ? 38 : 40, color: "#fff",
        opacity: b, transform: `scale(${0.7 + 0.3 * b})`, boxShadow: `0 0 ${30 + 20 * Math.sin(f / 5)}px #DC262699` }}>● লাইভ প্র্যাকটিস</div>
      {!V ? <div style={{ position: "absolute", left: 900, top: 640, right: 90, fontFamily: BN, fontSize: 42, color: MUTE, lineHeight: 1.5, opacity: lerp(f, 40, 60) }}>কমান্ড লিখুন → ফ্লাইট দেখুন → PNR বানান, ঘরে বসেই</div> : null}
    </AbsoluteFill>
  );
};

const Feats: React.FC = () => {
  const V = useV();
  const c = useIn(60, 13);
  const items = ["✈️ অ্যাভেইলেবিলিটি", "🧾 PNR তৈরি", "💵 ভাড়ার নিয়ম", "🎫 টিকেট ইস্যু", "↩️ রিইস্যু-রিফান্ড", "🎬 বাংলায় ভিডিও"];
  return (
    <AbsoluteFill>
      <Backdrop hue="#1D4ED8" />
      <Head text="শুরু থেকে টিকেট ইস্যু পর্যন্ত, বাংলায়" hot={["টিকেট", "ইস্যু"]} size={V ? 72 : 66} />
      <div style={{ position: "absolute", left: V ? 60 : 900, right: V ? 60 : 90, top: V ? 470 : 330, display: "flex", flexWrap: "wrap", justifyContent: V ? "center" : "flex-start", gap: 18 }}>
        {items.map((t, i) => <Chip key={t} t={t} i={i} fs={V ? 42 : 38} />)}
      </div>
      <div style={{ position: "absolute", left: V ? 150 : 140, top: V ? 900 : 250, width: V ? 780 : 680, padding: 34, borderRadius: 22, background: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", border: `6px double ${GOLD}`, color: "#1E293B",
        opacity: c, transform: `translateY(${(1 - c) * 80}px) rotate(${(1 - c) * 6 - 2}deg)`, boxShadow: "0 40px 100px rgba(0,0,0,0.6)", textAlign: "center" }}>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, letterSpacing: 4, fontSize: 24, color: "#B45309" }}>AI UNIVERSITY OF BANGLADESH</div>
        <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 52, marginTop: 10 }}>সার্টিফিকেট</div>
        <div style={{ fontFamily: BN, fontSize: 30, marginTop: 6, color: "#475569" }}>এয়ার টিকেটিং (GDS) কোর্স সম্পন্ন</div>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 20, marginTop: 14, color: "#64748B" }}>Verifiable · aiuniversitybd.com/verify</div>
      </div>
    </AbsoluteFill>
  );
};

const Who: React.FC = () => {
  const V = useV();
  const tiles: [string, string][] = [["🎓", "চাকরি খুঁজছেন"], ["🧳", "এজেন্সির স্টাফ"], ["🏢", "নিজের এজেন্সি"]];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Head text="কার জন্য এই কোর্স?" hot={["কার"]} />
      <div style={{ position: "absolute", left: V ? 80 : 900, right: V ? 80 : 90, top: V ? 470 : 280, display: "flex", flexDirection: "column", gap: 26 }}>
        {tiles.map(([e, t], i) => {
          const k = useIn(6 + i * 9, 12);
          return <div key={t} style={{ display: "flex", alignItems: "center", gap: 28, padding: "30px 40px", borderRadius: 28, background: CARD, border: `2px solid ${BLUE}55`, opacity: k, transform: `translateX(${(1 - k) * 120}px)` }}>
            <span style={{ fontSize: V ? 80 : 70 }}>{e}</span><span style={{ fontFamily: BN, fontWeight: 800, fontSize: V ? 62 : 56, color: TXT }}>{t}</span></div>;
        })}
      </div>
      {!V ? <div style={{ position: "absolute", left: 140, top: 200, width: 640 }}><Terminal x={0} y={0} w={640} fs={21} start={0} /></div> : null}
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const p = useIn(4, 10), u = useIn(30, 12);
  const glow = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <AbsoluteFill>
      <Backdrop hue="#B45309" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: V ? 34 : 24, paddingBottom: V ? 380 : 0 }}>
        <div style={{ fontFamily: BN, fontWeight: 800, fontSize: V ? 60 : 56, color: TXT }}>এয়ার টিকেটিং (GDS) কোর্স</div>
        <div style={{ fontFamily: BN, fontSize: V ? 48 : 44, color: MUTE }}><s>৳১০,০০০</s></div>
        <div style={{ fontFamily: BN, fontWeight: 800, fontSize: V ? 230 : 200, lineHeight: 1, background: GRAD, WebkitBackgroundClip: "text", color: "transparent", transform: `scale(${0.6 + 0.4 * p})`, filter: `drop-shadow(0 0 ${30 + 30 * glow}px ${GOLD}66)` }}>৳৯৯৯</div>
        <div style={{ padding: "16px 34px", borderRadius: 50, background: "#7F1D1D", border: "2px solid #F87171", fontFamily: BN, fontWeight: 700, fontSize: V ? 40 : 36, color: "#FECACA", opacity: lerp(f, 20, 34) }}>⏰ ৪ নভেম্বরের পর ৳১,৯৯৯</div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: V ? 44 : 40, color: MINT, opacity: lerp(f, 30, 44) }}>✅ প্রথম ২০% পাঠ একদম ফ্রি</div>
        <div style={{ padding: V ? "24px 48px" : "20px 44px", borderRadius: 70, background: `linear-gradient(90deg, ${BLUE}, #1D4ED8)`, fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: V ? 46 : 42, color: "#fff",
          opacity: u, transform: `scale(${0.85 + 0.15 * u})`, boxShadow: `0 0 ${40 + 30 * glow}px ${BLUE}99` }}>aiuniversitybd.com</div>
        <div style={{ fontFamily: BN, fontSize: V ? 24 : 22, color: "#64748B", opacity: lerp(f, 50, 64) }}>শিক্ষামূলক GDS সিমুলেটর, আসল GDS নয় · চাকরির নিশ্চয়তা নয়</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC> = { hook: Hook, why: Why, lab: Lab, feats: Feats, who: Who, cta: Cta };
const SFX: Record<string, string> = { why: "boom", lab: "whoosh", feats: "shimmer", who: "whoosh", cta: "riser" };
const VO: Record<string, string> = {
  hook: "প্লেনের টিকেট আসলে কাটা হয় এই কালো স্ক্রিনে, কোড লিখে!",
  why: "এই স্কিলের নাম GDS। ট্রাভেল এজেন্সিতে কাজ করতে চাইলে এটা জানতেই হয়।",
  lab: "শিখবেন কোথায়? AI University-র অ্যাপের ভেতরেই GDS টিকেটিং ল্যাব। ঘরে বসেই লাইভ প্র্যাকটিস।",
  feats: "অ্যাভেইলেবিলিটি, PNR, ভাড়া, টিকেট ইস্যু, রিফান্ড, সব বাংলায়। শেষে সার্টিফিকেট।",
  who: "চাকরি খুঁজছেন, এজেন্সিতে কাজ করেন, বা নিজের এজেন্সি খুলতে চান, সবার জন্য।",
  cta: "এখন মাত্র ৳৯৯৯, ৪ নভেম্বরের পর ৳১,৯৯৯। প্রথম ২০% ফ্রি, আজই শুরু করুন।",
};

const Wrap: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const i = lerp(f, 0, 8), o = lerp(f, len - 7, len);
  return <AbsoluteFill style={{ opacity: Math.min(i, 1 - o), transform: `scale(${1.05 - 0.05 * i + 0.04 * o})`, filter: `blur(${(1 - i) * 10 + o * 10}px)` }}>{children}</AbsoluteFill>;
};

// sound-off captions (reel only), inside the safe zone above the platform UI
const Caption: React.FC<{ text: string; dur: number; lead: number }> = ({ text, dur, lead }) => {
  const f = useCurrentFrame() - lead;
  if (f < 0) return null;
  const words = text.split(" ");
  const n = Math.ceil(interpolate(f, [0, dur * FPS * 0.9], [0, words.length], clamp));
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1400, textAlign: "center", fontFamily: BN, fontWeight: 700, fontSize: 46, lineHeight: 1.35, color: "#fff" }}>
      <span style={{ background: "rgba(2,6,23,0.72)", padding: "10px 18px", borderRadius: 18, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
        {words.map((w, i) => <span key={i} style={{ opacity: i < n ? 1 : 0.3, color: i === n - 1 ? GOLD : "#fff" }}>{w} </span>)}
      </span>
    </div>
  );
};

export const GdsReel: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const f = useCurrentFrame();
  const V = useV();
  const music = Math.min(lerp(f, 0, 15, 0, 0.17), lerp(f, durationInFrames - 40, durationInFrames, 0.17, 0));
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={S("music.mp3")} volume={() => music} />
      {gdsTimeline().map(({ p, from, len, lead }) => {
        const Sc = MAP[p];
        return (
          <Sequence key={p} from={from} durationInFrames={len}>
            <Wrap len={len}><Sc /></Wrap>
            {V ? <Caption text={VO[p]} dur={D[p]} lead={lead} /> : null}
            <Sequence from={lead}><Audio src={S(`vo/${p}.mp3`)} /></Sequence>
            {SFX[p] ? <Audio src={staticFile(`dgsfx/${SFX[p]}.mp3`)} volume={0.25} /> : null}
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5))" }} />
    </AbsoluteFill>
  );
};
