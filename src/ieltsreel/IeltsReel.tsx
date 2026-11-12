// IELTS + Spoken English bundle ad (AI University): hook "১০০০ টাকারও কমে" → bundle (IELTS কিনলে স্পোকেন ইংলিশ ফ্রি) → 4 skills / 80 lessons
// → mock test + AI estimated band → study at home → ৳8,000 → ৳999 CTA. One engine, 9:16 reel + 16:9 feed (same pattern as gdsreel).
// VO: work/ielts/reel_vo.py (Tanvir). App recordings: public/ieltsreel/rec (course page = work/pbcap/ieltsrec.mjs; guru/learn from promo3).
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import DURS from "./durs.json";

const FPS = 30, LEAD = 6, TAIL = 10;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
const S = (p: string) => staticFile("ieltsreel/" + p);
const BG = "#050B1F", CARD = "#0E1A3A", LINE = "rgba(148,163,184,0.16)", BLUE = "#2563EB", SKY = "#38BDF8", RED = "#EF4444", GOLD = "#FBBF24", MINT = "#34D399", TXT = "#F8FAFC", MUTE = "#94A3B8";
const BN = "AnekB, 'Hind Siliguri', sans-serif", LAT = "Montserrat, sans-serif";
const GRAD = `linear-gradient(90deg, ${SKY}, ${GOLD})`;

if (typeof document !== "undefined") {
  const ff = new FontFace("AnekB", `url(${staticFile("fonts/AnekBangla.ttf")})`);
  ff.load().then(() => document.fonts.add(ff)).catch(() => {});
}

const SCENES = ["hook", "bundle", "steps", "mock", "home", "cta"] as const;
const D = DURS as Record<string, number>;
export const ieltsTimeline = () => {
  let at = 0;
  return SCENES.map((p, i) => {
    const lead = i === 0 ? 2 : LEAD;
    const len = Math.round(D[p] * FPS) + lead + TAIL + (p === "cta" ? 45 : 0);
    const it = { p, from: at, len, lead }; at += len; return it;
  });
};
export const IELTS_TOTAL = (() => { const t = ieltsTimeline(); return t[t.length - 1].from + t[t.length - 1].len; })();

const useIn = (d = 0, damping = 13) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - d, fps, config: { damping, mass: 0.8 } }); };
const useV = () => { const { width, height } = useVideoConfig(); return height > width; };

const Backdrop: React.FC<{ hue?: string }> = ({ hue = BLUE }) => {
  const f = useCurrentFrame();
  const { width: W } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: W * 1.1, height: W * 1.1, left: -W * 0.35 + 60 * Math.sin(f / 50), top: -W * 0.5, borderRadius: "50%", background: `radial-gradient(circle, ${hue}50, transparent 62%)` }} />
      <div style={{ position: "absolute", width: W, height: W, right: -W * 0.4, bottom: -W * 0.3, borderRadius: "50%", background: `radial-gradient(circle, ${RED}1C, transparent 62%)` }} />
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${LINE} 1.5px, transparent 1.5px)`, backgroundSize: "40px 40px", opacity: 0.5,
        maskImage: "radial-gradient(ellipse at 50% 45%, black 25%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, black 25%, transparent 75%)" }} />
    </AbsoluteFill>
  );
};

const Head: React.FC<{ text: string; hot?: string[]; top?: number; size?: number; delay?: number }> = ({ text, hot = [], top, size, delay = 2 }) => {
  const f = useCurrentFrame();
  const V = useV();
  return (
    <div style={{ position: "absolute", top: top ?? (V ? 200 : 90), left: V ? 0 : 880, right: 0, textAlign: V ? "center" : "left", padding: V ? "0 60px" : "0 90px 0 0", fontFamily: BN, fontWeight: 800, fontSize: size ?? (V ? 80 : 72), lineHeight: 1.15, color: TXT }}>
      {text.split(" ").map((w, i) => {
        const k = lerp(f, delay + i * 3, delay + i * 3 + 14);
        return <span key={i} style={{ display: "inline-block", marginRight: "0.25em", opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${0.9 + 0.1 * k})`, filter: `blur(${(1 - k) * 8}px)`,
          ...(hot.some((h) => w.includes(h)) ? { background: GRAD, WebkitBackgroundClip: "text", color: "transparent" } : {}) }}>{w}</span>;
      })}
    </div>
  );
};

const Phone: React.FC<{ x: number; y: number; w: number; src: string; from?: number; rate?: number; rot?: number }> = ({ x, y, w, src, from = 0, rate = 1, rot = 0 }) => {
  const f = useCurrentFrame();
  const k = useIn(0, 14);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: w * 0.03, borderRadius: w * 0.13, background: "#000", border: "3px solid #334155",
      boxShadow: `0 50px 120px rgba(0,0,0,0.75), 0 0 90px ${SKY}40`, opacity: k, transform: `translateY(${(1 - k) * 120 + Math.sin(f / 24) * 5}px) rotate(${rot + (1 - k) * -4}deg)` }}>
      <div style={{ borderRadius: w * 0.1, overflow: "hidden", height: w * 2.1 }}>
        <OffthreadVideo src={S("rec/" + src)} startFrom={Math.round(from * FPS)} playbackRate={rate} muted style={{ width: "100%" }} />
      </div>
    </div>
  );
};

const Chip: React.FC<{ t: string; i: number; fs: number; color?: string; d?: number }> = ({ t, i, fs, color = SKY, d = 8 }) => {
  const k = useIn(d + i * 6, 12);
  return <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: `${fs * 0.45}px ${fs * 0.8}px`, borderRadius: 60, background: `${color}22`, border: `2px solid ${color}88`, fontFamily: BN, fontWeight: 700, fontSize: fs, color: TXT,
    opacity: k, transform: `translateY(${(1 - k) * 30}px) scale(${0.85 + 0.15 * k})` }}>{t}</div>;
};

const CourseCard: React.FC<{ x: number; y: number; w: number; title: string; sub: string; c1: string; c2: string; d: number; free?: boolean }> = ({ x, y, w, title, sub, c1, c2, d, free }) => {
  const k = useIn(d, 12), st = useIn(d + 30, 9);
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: w * 0.07, borderRadius: 30, background: `linear-gradient(135deg, ${c1}, ${c2})`, boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
      opacity: k, transform: `translateY(${(1 - k) * 100}px) rotate(${(1 - k) * 10}deg)` }}>
      <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: w * 0.05, letterSpacing: 3, color: "#ffffffcc" }}>AI UNIVERSITY</div>
      <div style={{ fontFamily: BN, fontWeight: 800, fontSize: w * 0.11, color: "#fff", marginTop: 10, lineHeight: 1.1 }}>{title}</div>
      <div style={{ fontFamily: BN, fontSize: w * 0.055, color: "#ffffffdd", marginTop: 8 }}>{sub}</div>
      {free ? <div style={{ position: "absolute", right: -w * 0.06, top: -w * 0.08, padding: `${w * 0.03}px ${w * 0.06}px`, borderRadius: 16, border: `5px solid ${MINT}`, background: "#052e1f", fontFamily: LAT, fontWeight: 900, fontSize: w * 0.09, color: MINT,
        opacity: st, transform: `scale(${2.2 - 1.2 * st}) rotate(-12deg)`, boxShadow: `0 0 ${30 + 20 * Math.sin(f / 5)}px ${MINT}88` }}>FREE</div> : null}
    </div>
  );
};

/* scenes */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const p = useIn(2, 9);
  const skills = ["🎧 Listening", "📖 Reading", "✍️ Writing", "🗣️ Speaking"];
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", top: V ? 230 : 160, left: V ? 0 : 100, right: V ? 0 : undefined, width: V ? undefined : 820, textAlign: "center" }}>
        <div style={{ fontFamily: BN, fontWeight: 800, fontSize: V ? 210 : 190, lineHeight: 1, background: GRAD, WebkitBackgroundClip: "text", color: "transparent", transform: `scale(${0.5 + 0.5 * p})`, filter: `drop-shadow(0 0 40px ${SKY}66)` }}>৳১,০০০</div>
        <div style={{ fontFamily: BN, fontWeight: 800, fontSize: V ? 64 : 58, color: TXT, marginTop: 6, opacity: lerp(f, 10, 24) }}>টাকারও কমে!</div>
      </div>
      <div style={{ position: "absolute", top: V ? 700 : 300, left: V ? 60 : 960, right: V ? 60 : 90, textAlign: V ? "center" : "left", fontFamily: BN, fontWeight: 800, fontSize: V ? 70 : 64, lineHeight: 1.2, color: TXT, opacity: lerp(f, 30, 46) }}>
        <span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>IELTS</span> পূর্ণাঙ্গ প্রস্তুতি<br />+ ইংরেজি শেখা
      </div>
      <div style={{ position: "absolute", top: V ? 1000 : 560, left: V ? 60 : 960, right: V ? 60 : 90, display: "flex", flexWrap: "wrap", justifyContent: V ? "center" : "flex-start", gap: 16 }}>
        {skills.map((t, i) => <Chip key={t} t={t} i={i} fs={V ? 40 : 34} d={52} />)}
      </div>
    </AbsoluteFill>
  );
};

const Bundle: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const plus = useIn(24, 9);
  const cw = V ? 560 : 520;
  return (
    <AbsoluteFill>
      <Backdrop hue="#1D4ED8" />
      <Head text="একটা কিনলে আরেকটা ফ্রি!" hot={["ফ্রি!"]} />
      <CourseCard x={V ? 80 : 180} y={V ? 470 : 300} w={cw} title="IELTS সম্পূর্ণ প্রস্তুতি" sub="১০ মডিউল · ৮০ পাঠ" c1="#1D4ED8" c2="#38BDF8" d={4} />
      <div style={{ position: "absolute", left: V ? 470 : 760, top: V ? 830 : 400, width: 140, height: 140, borderRadius: 140, background: GOLD, color: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: LAT, fontWeight: 900, fontSize: 100, transform: `scale(${plus}) rotate(${(1 - plus) * 180}deg)`, boxShadow: `0 0 60px ${GOLD}aa`, zIndex: 3 }}>+</div>
      <CourseCard x={V ? 440 : 1240} y={V ? 1010 : 300} w={cw} title="স্পোকেন ইংলিশ" sub="প্রতিদিনের ইংরেজি, কথা বলা" c1="#047857" c2="#22D3EE" d={34} free />
      {!V ? <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", fontFamily: BN, fontWeight: 700, fontSize: 44, color: GOLD, opacity: lerp(f, 80, 96) }}>IELTS কোর্স কিনলেই স্পোকেন ইংলিশ একদম ফ্রি</div> : null}
    </AbsoluteFill>
  );
};

const Steps: React.FC = () => {
  const V = useV();
  const stats: [string, string][] = [["১০", "মডিউল"], ["৮০", "পাঠ"], ["~১৩", "ঘণ্টা ভিডিও"]];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Head text="ধাপে ধাপে, বাংলায় বুঝিয়ে" hot={["বাংলায়"]} />
      <Phone x={V ? 90 : 220} y={V ? 400 : 80} w={V ? 420 : 400} src="learn.mp4" from={2} rate={1.2} rot={-3} />
      <div style={{ position: "absolute", left: V ? 560 : 900, right: V ? 50 : 120, top: V ? 460 : 330, display: "flex", flexDirection: V ? "column" : "row", gap: 20 }}>
        {stats.map(([n, l], i) => {
          const k = useIn(14 + i * 9, 12);
          return <div key={l} style={{ flex: 1, padding: "26px 22px", borderRadius: 26, background: CARD, border: `2px solid ${SKY}55`, textAlign: "center", opacity: k, transform: `translateX(${(1 - k) * 80}px)` }}>
            <div style={{ fontFamily: BN, fontWeight: 800, fontSize: V ? 84 : 90, color: SKY, lineHeight: 1 }}>{n}</div>
            <div style={{ fontFamily: BN, fontWeight: 700, fontSize: V ? 34 : 34, color: TXT, marginTop: 6 }}>{l}</div></div>;
        })}
      </div>
      {!V ? <div style={{ position: "absolute", left: 900, right: 120, top: 640, display: "flex", flexWrap: "wrap", gap: 14 }}>
        {["🎧 Listening", "📖 Reading", "✍️ Writing", "🗣️ Speaking"].map((t, i) => <Chip key={t} t={t} i={i} fs={34} d={40} />)}</div> : null}
    </AbsoluteFill>
  );
};

const Mock: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const card = useIn(4, 13), band = useIn(70, 11);
  const secs: [string, string, number][] = [["Listening", "7.0", 0.86], ["Reading", "6.5", 0.78], ["Writing", "6.0", 0.7], ["Speaking", "6.5", 0.78]];
  const t = Math.max(0, 60 - Math.floor(f / 3));
  const cx = V ? 70 : 140, cw = V ? 940 : 700, cy = V ? 420 : 210;
  return (
    <AbsoluteFill>
      <Backdrop hue="#7C3AED" />
      <Head text="আসল পরীক্ষার মতো মক টেস্ট" hot={["মক", "টেস্ট"]} />
      <div style={{ position: "absolute", left: cx, top: cy, width: cw, padding: 36, borderRadius: 30, background: "#F8FAFC", color: "#0F172A", boxShadow: "0 50px 120px rgba(0,0,0,0.6)", opacity: card, transform: `translateY(${(1 - card) * 80}px)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: V ? 34 : 30 }}>IELTS Mock Test</div>
          <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: V ? 32 : 28, color: RED }}>⏱ 00:{String(t).padStart(2, "0")}</div>
        </div>
        {secs.map(([s, b, pct], i) => {
          const k = lerp(f, 14 + i * 12, 40 + i * 12);
          return <div key={s} style={{ marginTop: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: LAT, fontWeight: 700, fontSize: V ? 30 : 26 }}><span>{s}</span><span style={{ color: BLUE, opacity: lerp(f, 60 + i * 4, 70 + i * 4) }}>{b}</span></div>
            <div style={{ height: 14, borderRadius: 10, background: "#E2E8F0", marginTop: 8, overflow: "hidden" }}><div style={{ width: `${k * pct * 100}%`, height: "100%", background: `linear-gradient(90deg, ${BLUE}, ${SKY})` }} /></div>
          </div>;
        })}
        <div style={{ marginTop: 28, padding: "22px 26px", borderRadius: 22, background: "linear-gradient(135deg,#1D4ED8,#0EA5E9)", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center",
          opacity: band, transform: `scale(${0.8 + 0.2 * band})` }}>
          <div><div style={{ fontFamily: BN, fontWeight: 700, fontSize: V ? 32 : 28 }}>✦ AI-এর আনুমানিক ব্যান্ড</div><div style={{ fontFamily: BN, fontSize: V ? 24 : 20, opacity: 0.85 }}>উদাহরণ · অফিসিয়াল স্কোর নয়</div></div>
          <div style={{ fontFamily: LAT, fontWeight: 900, fontSize: V ? 92 : 80 }}>6.5</div>
        </div>
      </div>
      {!V ? <Phone x={1480} y={230} w={350} src="guru.mp4" from={3} rate={1.3} rot={3} /> : null}
    </AbsoluteFill>
  );
};

const Home: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const no = [["🚌", "কোচিংয়ে যাতায়াত"], ["💸", "হাজার হাজার টাকা ফি"], ["⏰", "নির্দিষ্ট সময়ের ক্লাস"]];
  return (
    <AbsoluteFill>
      <Backdrop hue="#0EA5E9" />
      <Head text="ঘরে বসেই পুরো প্রস্তুতি 🏠" hot={["ঘরে", "বসেই"]} />
      <div style={{ position: "absolute", left: V ? 70 : 900, right: V ? 70 : 100, top: V ? 440 : 300, display: "flex", flexDirection: "column", gap: 18 }}>
        {no.map(([e, t], i) => {
          const k = useIn(8 + i * 8, 12), x = lerp(f, 40 + i * 8, 52 + i * 8);
          return <div key={t} style={{ display: "flex", alignItems: "center", gap: 22, padding: "22px 30px", borderRadius: 24, background: CARD, border: `2px solid ${RED}44`, opacity: k, transform: `translateX(${(1 - k) * 100}px)` }}>
            <span style={{ fontSize: V ? 56 : 50 }}>{e}</span><span style={{ fontFamily: BN, fontWeight: 700, fontSize: V ? 48 : 44, color: TXT, flex: 1, textDecoration: x > 0.5 ? "line-through" : "none", textDecorationColor: RED, opacity: 1 - 0.4 * x }}>{t}</span>
            <span style={{ fontSize: V ? 52 : 46, color: RED, opacity: x, transform: `scale(${x})` }}>✕</span></div>;
        })}
        <div style={{ marginTop: 10, padding: "24px 30px", borderRadius: 24, background: "#052e1f", border: `2px solid ${MINT}`, fontFamily: BN, fontWeight: 800, fontSize: V ? 50 : 46, color: MINT, textAlign: "center", opacity: lerp(f, 76, 90) }}>✓ মোবাইলেই, নিজের সময়ে</div>
      </div>
      {!V ? <Phone x={240} y={70} w={390} src="course.mp4" from={1} rate={1.2} /> : null}
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const V = useV();
  const p = useIn(4, 10), u = useIn(40, 12);
  const glow = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <AbsoluteFill>
      <Backdrop hue="#1D4ED8" />
      {!V ? <Phone x={150} y={60} w={400} src="course.mp4" from={6} rate={1} /> : null}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: V ? 30 : 22, paddingBottom: V ? 380 : 0, paddingLeft: V ? 0 : 640 }}>
        <div style={{ fontFamily: BN, fontWeight: 800, fontSize: V ? 58 : 52, color: TXT }}>বাংলায় IELTS — সম্পূর্ণ প্রস্তুতি</div>
        <div style={{ fontFamily: BN, fontSize: V ? 52 : 46, color: MUTE }}><s>৳৮,০০০</s></div>
        <div style={{ fontFamily: BN, fontWeight: 800, fontSize: V ? 230 : 190, lineHeight: 1, background: GRAD, WebkitBackgroundClip: "text", color: "transparent", transform: `scale(${0.6 + 0.4 * p})`, filter: `drop-shadow(0 0 ${30 + 30 * glow}px ${SKY}66)` }}>৳৯৯৯</div>
        <div style={{ padding: "18px 34px", borderRadius: 50, background: "#052e1f", border: `2px solid ${MINT}`, fontFamily: BN, fontWeight: 800, fontSize: V ? 44 : 38, color: MINT, opacity: lerp(f, 22, 36), transform: `scale(${0.8 + 0.2 * lerp(f, 22, 36)})` }}>🎁 সাথে স্পোকেন ইংলিশ ফ্রি</div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: V ? 40 : 34, color: GOLD, opacity: lerp(f, 34, 48) }}>প্রথম ২০% পাঠ একদম ফ্রি</div>
        <div style={{ padding: V ? "24px 48px" : "20px 44px", borderRadius: 70, background: `linear-gradient(90deg, ${BLUE}, #1D4ED8)`, fontFamily: LAT, fontWeight: 800, fontSize: V ? 46 : 40, color: "#fff",
          opacity: u, transform: `scale(${0.85 + 0.15 * u})`, boxShadow: `0 0 ${40 + 30 * glow}px ${BLUE}99` }}>aiuniversitybd.com</div>
        <div style={{ fontFamily: BN, fontSize: V ? 24 : 20, color: "#64748B", opacity: lerp(f, 60, 74) }}>AI ব্যান্ড আনুমানিক, অফিসিয়াল IELTS স্কোর নয়</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC> = { hook: Hook, bundle: Bundle, steps: Steps, mock: Mock, home: Home, cta: Cta };
const SFX: Record<string, string> = { bundle: "boom", steps: "whoosh", mock: "shimmer", home: "whoosh", cta: "riser" };
const VO: Record<string, string> = {
  hook: "১,০০০ টাকারও কমে IELTS-এর পূর্ণাঙ্গ প্রস্তুতি, সাথে ইংরেজিও শিখুন!",
  bundle: "অবিশ্বাস্য লাগছে? IELTS কোর্স কিনলেই স্পোকেন ইংলিশ কোর্স একদম ফ্রি!",
  steps: "Listening, Reading, Writing, Speaking, ৮০টা পাঠে ধাপে ধাপে, বাংলায়।",
  mock: "নিজস্ব অ্যাপে আসল পরীক্ষার মতো মক টেস্ট। AI বলে দেবে আনুমানিক ব্যান্ড।",
  home: "কোচিংয়ে যেতে হবে না। ঘরে বসে, নিজের সময়ে, পুরো প্রস্তুতি।",
  cta: "৳৮,০০০-এর কোর্স এখন ৳৯৯৯, সাথে স্পোকেন ইংলিশ ফ্রি। আজই শুরু করুন!",
};

const Wrap: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const i = lerp(f, 0, 8), o = lerp(f, len - 7, len);
  return <AbsoluteFill style={{ opacity: Math.min(i, 1 - o), transform: `scale(${1.05 - 0.05 * i + 0.04 * o})`, filter: `blur(${(1 - i) * 10 + o * 10}px)` }}>{children}</AbsoluteFill>;
};

const Caption: React.FC<{ text: string; dur: number; lead: number }> = ({ text, dur, lead }) => {
  const f = useCurrentFrame() - lead;
  if (f < 0) return null;
  const words = text.split(" ");
  const n = Math.ceil(interpolate(f, [0, dur * FPS * 0.9], [0, words.length], clamp));
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1420, textAlign: "center", fontFamily: BN, fontWeight: 700, fontSize: 46, lineHeight: 1.35, color: "#fff" }}>
      <span style={{ background: "rgba(2,6,23,0.72)", padding: "10px 18px", borderRadius: 18, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
        {words.map((w, i) => <span key={i} style={{ opacity: i < n ? 1 : 0.3, color: i === n - 1 ? GOLD : "#fff" }}>{w} </span>)}
      </span>
    </div>
  );
};

export const IeltsReel: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const f = useCurrentFrame();
  const V = useV();
  const music = Math.min(lerp(f, 0, 15, 0, 0.17), lerp(f, durationInFrames - 40, durationInFrames, 0.17, 0));
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={S("music.mp3")} volume={() => music} />
      {ieltsTimeline().map(({ p, from, len, lead }) => {
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
