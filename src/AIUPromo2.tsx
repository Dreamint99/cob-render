// AI University of Bangladesh — premium launch film (v2: clean corporate motion design).
// Script work/aiu2/script.json · VO public/aiu2vo (OpenRouter → ElevenLabs Tanvir v4) · music/SFX public/aiu2.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import {
  Bot, Briefcase, HeartHandshake, Telescope, Cpu, ChefHat, Trees, Stethoscope, Wrench, Sprout, Clapperboard, Languages, House, Plane, Atom, Store,
  Search, Tornado, ShieldCheck, Check, FileText, ChartColumn, Award, Lightbulb, Layers, Mic, Video, ListChecks, Rocket, FlaskConical, BookOpen,
  Megaphone, Laptop, MessageCircle, Sparkles, HeartPulse, GraduationCap, Worm, Wallet, UtensilsCrossed, Play, UserRound, Leaf,
} from "lucide-react";

// ---------- design tokens ----------
const C = {
  ink: "#060913", ink2: "#0C1222", line: "rgba(255,255,255,.09)", card: "rgba(255,255,255,.035)",
  text: "#F2F4FA", mute: "#8D95B5", dim: "#5A6285",
  a1: "#7C83FF", a2: "#38D3F5", gold: "#E7B95A", green: "#3DDC97",
  paper: "#F4F6FB", pText: "#0B1020", pMute: "#5B6382", pLine: "rgba(11,16,32,.09)",
};
const ACC = ["#7C83FF", "#38D3F5", "#3DDC97", "#E7B95A", "#F178B6", "#FF9F5A"];
const GRAD = `linear-gradient(95deg, ${C.a1}, ${C.a2})`;
const BN = "Anek", EN = "Montserrat";
if (typeof document !== "undefined") {
  for (const [n, u] of [["Anek", "fonts/AnekBangla.ttf"], ["Montserrat", "fonts/Montserrat.ttf"]]) {
    const f = new FontFace(n, `url(${staticFile(u)})`, { weight: "100 900" });
    f.load().then(() => document.fonts.add(f)).catch(() => {});
  }
}
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const bn = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
const gtext = (g = GRAD): React.CSSProperties => ({ background: g, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" });
const hex = (a: number) => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0");

// smooth, no-bounce entrance (0→1)
const ent = (f: number, fps: number, d: number, dur = 26) => spring({ frame: f - d, fps, config: { damping: 200 }, durationInFrames: dur });
const pop = (f: number, fps: number, d: number) => spring({ frame: f - d, fps, config: { damping: 14, mass: 0.6 } });

// ---------- timeline ----------
const PARAS: string[] = [
  "প্রতিটি মানুষের ভেতরে লুকিয়ে আছে এক অসাধারণ প্রতিভা। দরকার শুধু, সঠিক সুযোগ।",
  "কিন্তু প্রচলিত শিক্ষা শেখায় সীমিত কিছু বিষয়। রান্না, কৃষি, ফার্স্ট এইড, ফ্রিল্যান্সিং, এআই — জীবনের আসল দক্ষতাগুলো, আমরা শিখবো কোথায়?",
  "সেই প্রশ্নের উত্তর — এআই ইউনিভার্সিটি অব বাংলাদেশ। দেশের প্রথম এআই-চালিত স্কিল ইউনিভার্সিটি। লার্ন এনিথিং। বিল্ড এভরি স্কিল।",
  "পুরো ইউনিভার্সিটি সাজানো চারটি স্কুলে — এআই একাডেমি, ক্যারিয়ার স্কুল, লাইফ স্কিলস, আর ডিসকভারি ল্যাব।",
  "তার ভেতরে বারোটি ফ্যাকাল্টি। প্রযুক্তি, রন্ধনশিল্প, কৃষি, স্বাস্থ্য, ব্যবসা, কারিগরি দক্ষতা, মিডিয়া, ভাষা আর পর্যটন — একশোরও বেশি কোর্স।",
  "আর আছে কিউরিওসিটি কোর্স। সাপ চেনা ও উদ্ধার, ফরেনসিক সায়েন্স, শুধু এআই দিয়ে সিনেমা বানানো, দুর্যোগে বেঁচে থাকার কৌশল — যা আর কোথাও শেখানো হয় না।",
  "এর পেছনে আছে আমাদের এআই কোর্স ক্রিয়েশন ইঞ্জিন। একটি আইডিয়া থেকে কারিকুলাম, ভিডিও, ভয়েস আর কুইজ — মাত্র পাঁচ ধাপে তৈরি হয় পূর্ণাঙ্গ কোর্স।",
  "তবে শুধু এআই নয়। প্রতিটি লেসন প্রকাশের আগে বিশেষজ্ঞরা যাচাই করেন তথ্য, নিরাপত্তা আর কপিরাইট।",
  "শিখুন বাংলা বা ইংরেজিতে। ইন্টারনেট ধীর হলে টেক্সট মোড। আর প্রতিটি অধ্যায়ে দেখুন নিজের অগ্রগতি আর কুইজ স্কোর।",
  "কোর্স শেষে তিন স্তরের সার্টিফিকেট — কোর্স কমপ্লিশন, প্রফেশনাল স্কিলস আর অ্যাডভান্সড প্রফেশনাল। প্রতিটিতে ইউনিক আইডি আর কিউআর কোড, অনলাইনে যাচাইযোগ্য।",
  "আমাদের যাত্রা নব্বই দিনের পরিকল্পনায় — ফাউন্ডেশন, প্রথম দশটি কোর্স, বেটা লঞ্চ, তারপর সারা দেশের জন্য পাবলিক লঞ্চ।",
  "প্রথম ধাপেই আসছে এআই স্কিলস, এআই ভিডিও, ডিজিটাল মার্কেটিং, ফ্রিল্যান্সিং, স্পোকেন ইংলিশ, রান্না আর ফার্স্ট এইড।",
  "গ্রামের কৃষক থেকে শহরের শিক্ষার্থী — সবার জন্য, সবার হাতের মুঠোয়। এআই ইউনিভার্সিটি অব বাংলাদেশ। শিখুন যা খুশি, গড়ুন প্রতিটি দক্ষতা।",
];
const VO = [192, 307, 295, 216, 338, 322, 312, 218, 238, 317, 262, 254, 322];
const LEAD = VO.map((_, i) => (i === 0 ? 50 : 16));
const TAIL = VO.map((_, i) => (i === VO.length - 1 ? 160 : 18));
const LENS = VO.map((v, i) => LEAD[i] + v + TAIL[i]);
const STARTS = LENS.reduce<number[]>((a, _, i) => [...a, i ? a[i - 1] + LENS[i - 1] : 0], []);
export const AIU2_TOTAL = STARTS[STARTS.length - 1] + LENS[LENS.length - 1];
const LIGHT = new Set([3, 10]);

type SP = { lead: number; vo: number; len: number };
const atf = (p: SP, x: number) => p.lead + p.vo * x;

// ---------- primitives ----------
const Line: React.FC<{ d: number; size: number; children: React.ReactNode; color?: string; weight?: number; font?: string; style?: React.CSSProperties; g?: string }> = ({ d, size, children, color = C.text, weight = 700, font = BN, style, g }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = ent(f, fps, d, 30);
  return (
    <div style={{ overflow: "hidden", paddingTop: size * 0.18, paddingBottom: size * 0.22, marginTop: -size * 0.18, marginBottom: -size * 0.22, ...style }}>
      <div style={{ fontFamily: font, fontSize: size, fontWeight: weight, color, lineHeight: 1.25, transform: `translateY(${(1 - s) * 115}%)`, opacity: interpolate(s, [0, 0.3], [0, 1], clamp), ...(g ? gtext(g) : {}) }}>{children}</div>
    </div>
  );
};

const Label: React.FC<{ d: number; text: string; dark?: boolean; style?: React.CSSProperties }> = ({ d, text, dark, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = ent(f, fps, d);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: s, ...style }}>
      <div style={{ width: 56 * s, height: 2, background: dark ? C.a1 : C.a2 }} />
      <span style={{ fontFamily: EN, fontSize: 22, fontWeight: 700, letterSpacing: "0.32em", color: dark ? C.a1 : C.a2 }}>{text}</span>
    </div>
  );
};

const IconTile: React.FC<{ I: React.FC<any>; size?: number; color?: string; light?: boolean }> = ({ I, size = 64, color = C.a1, light }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.28, display: "grid", placeItems: "center", background: `${color}${light ? "1a" : "1f"}`, border: `1.5px solid ${color}${light ? "33" : "40"}`, flex: "none" }}>
    <I size={size * 0.48} color={color} strokeWidth={1.8} />
  </div>
);

const Mark: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.26, background: `linear-gradient(140deg, ${C.a1}, ${C.a2})`, display: "grid", placeItems: "center", boxShadow: `0 ${size * 0.12}px ${size * 0.4}px ${C.a1}55` }}>
    <GraduationCap size={size * 0.56} color="#fff" strokeWidth={1.7} />
  </div>
);

// ---------- stage ----------
const DUST = Array.from({ length: 36 }, (_, i) => ({ x: random("dx" + i) * 1920, y: random("dy" + i) * 1080, s: random("ds" + i) * 2.2 + 0.8, v: random("dv" + i) * 0.35 + 0.1, o: random("do" + i) * 0.35 + 0.1 }));
const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const a = f / 140;
  let L = 0;
  LIGHT.forEach((i) => { const s = STARTS[i], e = s + LENS[i]; L = Math.max(L, interpolate(f, [s - 4, s + 12, e - 10, e + 4], [0, 1, 1, 0], clamp)); });
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill style={{ background: `radial-gradient(1100px 760px at ${30 + Math.sin(a) * 12}% ${28 + Math.cos(a) * 10}%, ${C.a1}26, transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(900px 700px at ${78 + Math.cos(a * 0.8) * 10}% ${80 + Math.sin(a * 0.7) * 8}%, ${C.a2}1c, transparent 70%)` }} />
      <AbsoluteFill style={{ opacity: 0.5, backgroundImage: "radial-gradient(rgba(255,255,255,.16) 1px, transparent 1.2px)", backgroundSize: "36px 36px", maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 85%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 85%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {DUST.map((d, i) => <circle key={i} cx={d.x + Math.sin((f + i * 40) / 90) * 20} cy={((d.y - f * d.v) % 1080 + 1080) % 1080} r={d.s} fill="#C9D2FF" opacity={d.o} />)}
      </svg>
      <AbsoluteFill style={{ opacity: L, background: `radial-gradient(1200px 800px at 70% 0%, #E3E8FF, ${C.paper} 60%)` }}>
        <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.pLine} 1px, transparent 1px), linear-gradient(90deg, ${C.pLine} 1px, transparent 1px)`, backgroundSize: "96px 96px", opacity: 0.5, maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,${0.55 * (1 - L)}) 100%)` }} />
    </AbsoluteFill>
  );
};

const SceneWrap: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const i = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: ease });
  const o = interpolate(f, [len - 12, len], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const push = interpolate(f, [0, len], [1, 1.035]);
  return <AbsoluteFill style={{ opacity: Math.min(i, o), transform: `scale(${push * (1.04 - 0.04 * i) * (0.985 + 0.015 * o)})`, filter: `blur(${(1 - Math.min(i, o)) * 8}px)` }}>{children}</AbsoluteFill>;
};

// ---------- scenes ----------
const S01: React.FC<SP> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ln = interpolate(f, [6, 46], [0, 1], { ...clamp, easing: ease });
  const dimFirst = interpolate(f, [atf(p, 0.6), atf(p, 0.68)], [1, 0.35], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 560, width: 1100 * ln, height: 1.5, background: `linear-gradient(90deg, transparent, ${C.a2}, transparent)`, boxShadow: `0 0 30px ${C.a2}` }} />
      <div style={{ position: "absolute", top: 560, width: 18, height: 18, borderRadius: 9, marginTop: -8, background: "#fff", boxShadow: `0 0 50px 20px ${C.a2}88`, opacity: interpolate(f, [0, 10, 46, 70], [0, 1, 1, 0], clamp) }} />
      <div style={{ position: "absolute", top: 300, textAlign: "center", opacity: dimFirst }}>
        <Line d={atf(p, 0)} size={74} weight={500} color={C.mute}>প্রতিটি মানুষের ভেতরে লুকিয়ে আছে</Line>
        <Line d={atf(p, 0.18)} size={112} weight={800} g={GRAD}>এক অসাধারণ প্রতিভা</Line>
      </div>
      <div style={{ position: "absolute", top: 610, textAlign: "center" }}>
        <Line d={atf(p, 0.62)} size={80} weight={700}>দরকার শুধু, <span style={{ color: C.gold }}>সঠিক সুযোগ।</span></Line>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: ent(f, fps, atf(p, 0.6)) * 0.4, background: `radial-gradient(500px 220px at 50% 680px, ${C.gold}22, transparent 70%)` }} />
    </AbsoluteFill>
  );
};

const GAP = [[ChefHat, "রান্না", "Cooking"], [Sprout, "কৃষি", "Agriculture"], [HeartPulse, "ফার্স্ট এইড", "First Aid"], [Laptop, "ফ্রিল্যান্সিং", "Freelancing"], [Cpu, "এআই", "Artificial Intelligence"]] as const;
const S02: React.FC<SP> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strike = interpolate(f, [atf(p, 0.16), atf(p, 0.26)], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 190, width: 820 }}>
        <Label d={4} text="THE GAP" />
        <div style={{ marginTop: 40, position: "relative" }}>
          <Line d={atf(p, 0)} size={70} weight={600} color={C.mute}>প্রচলিত শিক্ষা শেখায়</Line>
          <div style={{ display: "inline-block", position: "relative" }}>
            <Line d={atf(p, 0.06)} size={70} weight={600} color={C.mute}>সীমিত কিছু বিষয়</Line>
            <div style={{ position: "absolute", left: 0, top: "56%", height: 4, width: `${strike * 100}%`, background: "#FF6B6B", borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ marginTop: 90 }}>
          <Line d={atf(p, 0.72)} size={84} weight={800}>জীবনের আসল দক্ষতা</Line>
          <Line d={atf(p, 0.8)} size={84} weight={800} g={`linear-gradient(95deg, ${C.gold}, #FFDDA0)`}>শিখবো কোথায়?</Line>
        </div>
      </div>
      <div style={{ position: "absolute", right: 150, top: 180, width: 620, display: "flex", flexDirection: "column", gap: 22 }}>
        {GAP.map(([I, t, e], i) => {
          const s = ent(f, fps, atf(p, 0.3 + i * 0.075));
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, padding: "22px 30px", borderRadius: 22, background: C.card, border: `1px solid ${C.line}`, opacity: s, transform: `translateX(${(1 - s) * 80}px)` }}>
              <IconTile I={I} size={72} color={ACC[i]} />
              <div><div style={{ fontFamily: BN, fontSize: 44, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{t}</div><div style={{ fontFamily: EN, fontSize: 20, fontWeight: 500, color: C.dim, letterSpacing: "0.08em" }}>{e}</div></div>
              <div style={{ marginLeft: "auto", fontFamily: EN, fontSize: 40, fontWeight: 300, color: C.dim }}>?</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const S03: React.FC<SP> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = pop(f, fps, 6);
  const wipe = interpolate(f, [16, 52], [0, 100], { ...clamp, easing: ease });
  const sheen = interpolate(f, [50, 110], [-40, 140], clamp);
  const hair = interpolate(f, [atf(p, 0.3), atf(p, 0.42)], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      {[0, 1, 2].map((k) => { const r = interpolate(f, [k * 8, 80 + k * 8], [0, 1], { ...clamp, easing: ease }); return <div key={k} style={{ position: "absolute", left: 960 - 700, top: 330 - 700, width: 1400, height: 1400, borderRadius: "50%", border: `1px solid ${C.a2}`, opacity: (1 - r) * 0.5, transform: `scale(${0.1 + r * 0.9})` }} />; })}
      <AbsoluteFill style={{ opacity: interpolate(f, [0, 4, 30], [0, 0.55, 0], clamp), background: `radial-gradient(700px 500px at 50% 330px, #fff, transparent 70%)` }} />
      <div style={{ position: "absolute", top: 190, transform: `scale(${m})`, opacity: Math.min(1, m * 1.5) }}><Mark size={190} /></div>
      <div style={{ position: "absolute", top: 430, clipPath: `inset(0 ${100 - wipe}% 0 0)` }}>
        <div style={{ position: "relative", fontFamily: EN, fontSize: 150, fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1.1, color: "#fff" }}>
          AI UNIVERSITY
          <div style={{ position: "absolute", inset: 0, color: C.a2, WebkitMaskImage: `linear-gradient(100deg, transparent ${sheen - 22}%, #000 ${sheen}%, transparent ${sheen + 22}%)`, maskImage: `linear-gradient(100deg, transparent ${sheen - 22}%, #000 ${sheen}%, transparent ${sheen + 22}%)` }}>AI UNIVERSITY</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 600, opacity: ent(f, fps, 40), fontFamily: EN, fontSize: 38, fontWeight: 500, letterSpacing: "0.62em", color: C.mute, marginRight: "-0.62em" }}>OF BANGLADESH</div>
      <div style={{ position: "absolute", top: 690, width: 760 * hair, height: 1.5, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
      <div style={{ position: "absolute", top: 720 }}><Line d={atf(p, 0.34)} size={54} weight={600} color={C.gold}>দেশের প্রথম এআই-চালিত স্কিল ইউনিভার্সিটি</Line></div>
      <div style={{ position: "absolute", top: 830, display: "flex", gap: 26, fontFamily: EN, fontSize: 46, fontWeight: 700 }}>
        <span style={{ opacity: ent(f, fps, atf(p, 0.72)), color: C.text }}>Learn Anything.</span>
        <span style={{ opacity: ent(f, fps, atf(p, 0.84)), ...gtext() }}>Build Every Skill.</span>
      </div>
    </AbsoluteFill>
  );
};

const SCHOOLS = [[Bot, "AI Academy", "এআই, কোডিং ও অটোমেশন", "#5B63F5"], [Briefcase, "Career School", "চাকরি, ইন্টারভিউ ও প্রফেশনাল স্কিল", "#0EA5C6"], [HeartHandshake, "Life Skills", "রান্না, সঞ্চয় ও দৈনন্দিন জীবন", "#16A36D"], [Telescope, "Discovery Lab", "বন্যপ্রাণী, ফরেনসিক ও অদ্ভুত স্কিল", "#D18B12"]] as const;
const S04: React.FC<SP> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 120 }}>
        <Label d={6} text="FOUR SCHOOLS" dark />
        <div style={{ marginTop: 26 }}><Line d={8} size={86} weight={800} color={C.pText}>চারটি স্কুল, <span style={{ color: "#5B63F5" }}>একটি লক্ষ্য</span></Line></div>
      </div>
      <div style={{ position: "absolute", left: 150, right: 150, top: 380, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 30 }}>
        {SCHOOLS.map(([I, t, d, a], i) => {
          const s = ent(f, fps, atf(p, 0.16 + i * 0.17), 30);
          return (
            <div key={i} style={{ height: 470, borderRadius: 30, background: "#fff", boxShadow: "0 30px 70px rgba(30,40,90,.12), 0 2px 6px rgba(30,40,90,.06)", padding: "48px 40px", position: "relative", overflow: "hidden", opacity: s, transform: `translateY(${(1 - s) * 90}px)` }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: a }} />
              <div style={{ fontFamily: EN, fontSize: 20, fontWeight: 700, color: C.pMute, letterSpacing: "0.2em" }}>0{i + 1}</div>
              <div style={{ marginTop: 40 }}><IconTile I={I} size={104} color={a} light /></div>
              <div style={{ fontFamily: EN, fontSize: 40, fontWeight: 800, color: C.pText, marginTop: 44 }}>{t}</div>
              <div style={{ fontFamily: BN, fontSize: 32, fontWeight: 500, color: C.pMute, marginTop: 14, lineHeight: 1.35 }}>{d}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const FAC = [[Cpu, "এআই ও প্রযুক্তি"], [ChefHat, "রন্ধনশিল্প"], [Trees, "বন্যপ্রাণী ও পরিবেশ"], [Store, "ব্যবসা ও উদ্যোক্তা"], [Wrench, "কারিগরি দক্ষতা"], [Sprout, "কৃষি ও পশুপালন"], [Stethoscope, "স্বাস্থ্য ও ফার্স্ট এইড"], [Clapperboard, "সৃজনশীল মিডিয়া"], [Languages, "ভাষা ও ক্যারিয়ার"], [House, "গৃহ ও দৈনন্দিন জীবন"], [Plane, "পর্যটন ও আতিথেয়তা"], [Atom, "বিজ্ঞান ও অদ্ভুত দক্ষতা"]] as const;
const S05: React.FC<SP> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fill = ent(f, fps, 30, 40);
  const n = Math.round(interpolate(f, [atf(p, 0.82), atf(p, 0.95)], [0, 100], { ...clamp, easing: ease }));
  const hl = interpolate(f, [atf(p, 0.12), atf(p, 0.8)], [0, 12], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 150 }}>
        <Label d={4} text="TWELVE FACULTIES" />
        <div style={{ position: "relative", marginTop: 10, fontFamily: BN, fontSize: 380, fontWeight: 800, lineHeight: 1.05, WebkitTextStroke: `2px ${C.a1}`, color: "transparent", opacity: ent(f, fps, 6) }}>
          {bn(12)}
          <div style={{ position: "absolute", inset: 0, ...gtext(), WebkitTextStroke: "0px", clipPath: `inset(${(1 - fill) * 100}% 0 0 0)` }}>{bn(12)}</div>
        </div>
        <Line d={20} size={78} weight={700}>ফ্যাকাল্টি</Line>
        <div style={{ marginTop: 50, opacity: ent(f, fps, atf(p, 0.8)), display: "flex", alignItems: "baseline", gap: 16 }}>
          <span style={{ fontFamily: BN, fontSize: 92, fontWeight: 800, ...gtext(`linear-gradient(95deg, ${C.gold}, #FFDDA0)`) }}>{bn(n)}+</span>
          <span style={{ fontFamily: BN, fontSize: 48, fontWeight: 600, color: C.mute }}>কোর্স</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 760, right: 140, top: 170, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {FAC.map(([I, t], i) => {
          const s = ent(f, fps, atf(p, 0.04) + i * 5);
          const on = interpolate(hl - i, [-0.2, 0.3, 1.8, 3], [0, 1, 1, 0.25], clamp);
          const a = ACC[i % ACC.length];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "26px 24px", borderRadius: 22, background: `linear-gradient(135deg, ${a}${hex(0.04 + on * 0.1)}, ${C.card})`, border: `1px solid ${on > 0.5 ? a + "66" : C.line}`, opacity: s, transform: `translateY(${(1 - s) * 50}px)` }}>
              <IconTile I={I} size={66} color={a} />
              <span style={{ fontFamily: BN, fontSize: 32, fontWeight: 600, color: C.text, lineHeight: 1.25 }}>{t}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CUR = [[Worm, "সাপ চেনা ও উদ্ধার", "Snake Rescue", "#3DDC97"], [Search, "ফরেনসিক সায়েন্স", "Forensic Science", "#38D3F5"], [Clapperboard, "শুধু এআই দিয়ে সিনেমা", "AI Filmmaking", "#F178B6"], [Tornado, "দুর্যোগে বেঁচে থাকা", "Disaster Survival", "#FF9F5A"]] as const;
const S06: React.FC<SP> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 120 }}>
        <Label d={4} text="CURIOSITY COURSES" />
        <div style={{ marginTop: 26 }}><Line d={8} size={82} weight={800}>অদ্ভুত শোনায় — <span style={{ color: C.a2 }}>কিন্তু দারুণ কাজের</span></Line></div>
      </div>
      <div style={{ position: "absolute", left: 150, right: 150, top: 360, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 30 }}>
        {CUR.map(([I, t, e, a], i) => {
          const d = atf(p, 0.14 + i * 0.16);
          const s = ent(f, fps, d, 32);
          const focus = interpolate(f, [d, d + 10, d + p.vo * 0.16, d + p.vo * 0.16 + 10], [0, 1, 1, 0], clamp) * (i === 3 ? 1 : 1);
          return (
            <div key={i} style={{ height: 440, borderRadius: 30, padding: "44px 38px", background: `linear-gradient(170deg, ${a}${hex(0.1 + focus * 0.12)}, ${C.card} 60%)`, border: `1px solid ${a}${hex(0.2 + focus * 0.5)}`, boxShadow: focus > 0.5 ? `0 30px 80px ${a}22` : "none", opacity: s, transform: `translateY(${(1 - s) * 100 - focus * 12}px)`, display: "flex", flexDirection: "column" }}>
              <div style={{ width: 120, height: 120, borderRadius: 34, display: "grid", placeItems: "center", background: `${a}22` }}><I size={64} color={a} strokeWidth={1.6} /></div>
              <div style={{ fontFamily: BN, fontSize: 44, fontWeight: 700, color: C.text, marginTop: "auto", lineHeight: 1.25 }}>{t}</div>
              <div style={{ fontFamily: EN, fontSize: 22, fontWeight: 600, color: a, marginTop: 12, letterSpacing: "0.06em" }}>{e}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center" }}>
        <Line d={atf(p, 0.82)} size={50} weight={600} color={C.gold}>{" "}</Line>
      </div>
    </AbsoluteFill>
  );
};

const NODES = [[Lightbulb, "Idea", "কোর্সের নাম"], [Layers, "Curriculum", "৭ অধ্যায়"], [Video, "Video", "লেসন ভিডিও"], [Mic, "Voice", "বাংলা ভয়েস"], [ListChecks, "Quiz", "মূল্যায়ন"]] as const;
const S07: React.FC<SP> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = "AI Video Production";
  const typed = q.slice(0, Math.floor(interpolate(f, [atf(p, 0.14), atf(p, 0.28)], [0, q.length], clamp)));
  const prog = interpolate(f, [atf(p, 0.32), atf(p, 0.86)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const X0 = 270, X1 = 1650, Y = 640;
  const done = pop(f, fps, atf(p, 0.9));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 110 }}>
        <Label d={4} text="AI COURSE CREATION ENGINE" />
        <div style={{ marginTop: 26 }}><Line d={8} size={78} weight={800}>একটি আইডিয়া থেকে <span style={{ color: C.a2 }}>পূর্ণাঙ্গ কোর্স</span></Line></div>
      </div>
      <div style={{ position: "absolute", left: 460, right: 460, top: 340, height: 104, borderRadius: 52, background: "rgba(255,255,255,.05)", border: `1px solid ${typed ? C.a1 + "88" : C.line}`, display: "flex", alignItems: "center", padding: "0 14px 0 40px", gap: 22, opacity: ent(f, fps, atf(p, 0.08)), boxShadow: typed ? `0 0 0 6px ${C.a1}18` : "none" }}>
        <Sparkles size={34} color={C.a2} strokeWidth={1.8} />
        <span style={{ fontFamily: EN, fontSize: 38, fontWeight: 500, color: C.text, flex: 1 }}>{typed}<span style={{ opacity: Math.floor(f / 9) % 2, color: C.a2 }}>|</span></span>
        <span style={{ padding: "22px 36px", borderRadius: 40, background: GRAD, fontFamily: BN, fontSize: 30, fontWeight: 700, color: "#fff" }}>তৈরি করুন</span>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={X0} y1={Y} x2={X1} y2={Y} stroke="rgba(255,255,255,.1)" strokeWidth={2} />
        <line x1={X0} y1={Y} x2={X0 + (X1 - X0) * prog} y2={Y} stroke="url(#eg)" strokeWidth={3} />
        <defs><linearGradient id="eg"><stop offset="0" stopColor={C.a1} /><stop offset="1" stopColor={C.a2} /></linearGradient></defs>
        <circle cx={X0 + (X1 - X0) * prog} cy={Y} r={7} fill="#fff" opacity={prog > 0 && prog < 1 ? 1 : 0} style={{ filter: `drop-shadow(0 0 10px ${C.a2})` }} />
      </svg>
      {NODES.map(([I, t, o], i) => {
        const x = X0 + ((X1 - X0) / 4) * i;
        const on = prog >= i / 4 - 0.001 ? 1 : 0;
        const s = on ? pop(f, fps, atf(p, 0.32) + (p.vo * 0.54 * i) / 4) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: x - 110, top: Y - 70, width: 220, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 140, height: 140, borderRadius: 40, display: "grid", placeItems: "center", background: on ? GRAD : C.ink2, border: `1px solid ${on ? "transparent" : C.line}`, transform: `scale(${0.92 + s * 0.08})`, boxShadow: on ? `0 20px 60px ${C.a1}55` : "none" }}>
              <I size={58} color={on ? "#fff" : C.dim} strokeWidth={1.7} />
            </div>
            <div style={{ fontFamily: EN, fontSize: 28, fontWeight: 700, color: on ? C.text : C.dim, marginTop: 26 }}>{t}</div>
            <div style={{ marginTop: 12, padding: "8px 20px", borderRadius: 20, background: on ? `${C.a2}1c` : "transparent", fontFamily: BN, fontSize: 26, fontWeight: 600, color: C.a2, opacity: s }}>{o}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, display: "flex", justifyContent: "center", opacity: done, transform: `scale(${0.8 + done * 0.2})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 34px", borderRadius: 40, background: `${C.green}1c`, border: `1px solid ${C.green}66`, fontFamily: BN, fontSize: 34, fontWeight: 700, color: C.green }}><Check size={30} strokeWidth={2.6} /> কোর্স প্রস্তুত — মাত্র ৫ ধাপে</div>
      </div>
    </AbsoluteFill>
  );
};

const S08: React.FC<SP> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ring = interpolate(f, [atf(p, 0.05), atf(p, 0.7)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const R = 220, CIRC = 2 * Math.PI * R;
  const items = ["তথ্য যাচাই", "নিরাপত্তা", "কপিরাইট"];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 230, top: 250, width: 520, height: 520 }}>
        <svg width={520} height={520} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
          <circle cx={260} cy={260} r={R} stroke="rgba(255,255,255,.08)" strokeWidth={10} fill="none" />
          <circle cx={260} cy={260} r={R} stroke={C.green} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - ring)} style={{ filter: `drop-shadow(0 0 12px ${C.green})` }} />
        </svg>
        <div style={{ position: "absolute", inset: 90, borderRadius: "50%", display: "grid", placeItems: "center", background: `radial-gradient(circle, ${C.green}${hex(0.08 + ring * 0.14)}, transparent 70%)` }}>
          <ShieldCheck size={190} color={ring > 0.98 ? C.green : C.text} strokeWidth={1.3} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 900, top: 230 }}>
        <Label d={4} text="EXPERT REVIEWED" />
        <div style={{ marginTop: 26 }}>
          <Line d={atf(p, 0)} size={78} weight={700} color={C.mute}>শুধু এআই নয় —</Line>
          <Line d={atf(p, 0.12)} size={92} weight={800}>বিশেষজ্ঞের <span style={{ color: C.green }}>যাচাই</span></Line>
        </div>
        <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 22 }}>
          {items.map((t, i) => {
            const d = atf(p, 0.55 + i * 0.12);
            const s = ent(f, fps, d);
            const c = pop(f, fps, d + 6);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, opacity: s, transform: `translateX(${(1 - s) * 50}px)` }}>
                <div style={{ width: 58, height: 58, borderRadius: 29, background: C.green, display: "grid", placeItems: "center", transform: `scale(${c})` }}><Check size={34} color={C.ink} strokeWidth={3} /></div>
                <span style={{ fontFamily: BN, fontSize: 52, fontWeight: 600, color: C.text }}>{t}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const S09: React.FC<SP> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lang = interpolate(f, [atf(p, 0.12), atf(p, 0.18)], [0, 1], clamp);
  const tmode = interpolate(f, [atf(p, 0.36), atf(p, 0.42)], [0, 1], clamp);
  const prog = interpolate(f, [atf(p, 0.6), atf(p, 0.85)], [0.18, 0.68], { ...clamp, easing: ease });
  const score = pop(f, fps, atf(p, 0.84));
  const dev = ent(f, fps, 6, 36);
  const FEAT = [[Languages, "বাংলা ও English", "দুই ভাষায় প্রতিটি লেসন"], [FileText, "Text Mode", "ধীর ইন্টারনেটেও পুরো লেসন"], [ChartColumn, "অগ্রগতি ও কুইজ", "প্রতিটি অধ্যায়ের হিসাব"]] as const;
  const chapters = ["AI Video-এর পরিচিতি", "Scriptwriting ও Storyboard", "AI Image ও Scene", "AI Voice ও Narration", "Editing ও Sound"];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 140, top: 170, width: 600 }}>
        <Label d={4} text="LEARNING EXPERIENCE" />
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 34 }}>
          {FEAT.map(([I, t, d], i) => {
            const s = ent(f, fps, atf(p, i * 0.3));
            return (
              <div key={i} style={{ display: "flex", gap: 26, alignItems: "center", opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>
                <IconTile I={I} size={92} color={ACC[i]} />
                <div><div style={{ fontFamily: BN, fontSize: 46, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{t}</div><div style={{ fontFamily: BN, fontSize: 30, color: C.mute }}>{d}</div></div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 800, top: 150, width: 1000, height: 680, borderRadius: 26, background: "#0E1428", border: `1px solid ${C.line}`, boxShadow: "0 50px 120px rgba(0,0,0,.55)", overflow: "hidden", opacity: dev, transform: `perspective(2000px) rotateY(${(1 - dev) * -18 - 6}deg) translateX(${(1 - dev) * 120}px)` }}>
        <div style={{ height: 70, display: "flex", alignItems: "center", padding: "0 26px", gap: 12, borderBottom: `1px solid ${C.line}` }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
          <div style={{ marginLeft: 20, display: "flex", alignItems: "center", gap: 10 }}><Mark size={34} /><span style={{ fontFamily: EN, fontSize: 18, fontWeight: 700, color: C.text, letterSpacing: "0.1em" }}>AI UNIVERSITY</span></div>
          <div style={{ marginLeft: "auto", display: "flex", borderRadius: 20, background: "rgba(255,255,255,.06)", padding: 4, fontFamily: EN, fontSize: 18, fontWeight: 700 }}>
            <span style={{ padding: "6px 16px", borderRadius: 16, background: lang < 0.5 ? C.a1 : "transparent", color: "#fff", fontFamily: BN }}>বাংলা</span>
            <span style={{ padding: "6px 16px", borderRadius: 16, background: lang >= 0.5 ? C.a1 : "transparent", color: "#fff" }}>EN</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 14, fontFamily: EN, fontSize: 16, color: C.mute }}>
            Text Mode
            <div style={{ width: 52, height: 28, borderRadius: 14, background: tmode > 0.5 ? C.green : "rgba(255,255,255,.15)", position: "relative" }}><div style={{ position: "absolute", top: 3, left: 3 + tmode * 24, width: 22, height: 22, borderRadius: 11, background: "#fff" }} /></div>
          </div>
        </div>
        <div style={{ display: "flex", height: 610 }}>
          <div style={{ flex: 1, padding: 30 }}>
            <div style={{ fontFamily: EN, fontSize: 16, fontWeight: 700, color: C.a2, letterSpacing: "0.15em" }}>{lang < 0.5 ? "অধ্যায় ৩" : "CHAPTER 3"}</div>
            <div style={{ fontFamily: lang < 0.5 ? BN : EN, fontSize: 34, fontWeight: 700, color: C.text, marginTop: 6 }}>{lang < 0.5 ? "AI Image ও Scene তৈরি" : "AI Image & Scene Creation"}</div>
            <div style={{ position: "relative", marginTop: 20, height: 330, borderRadius: 18, overflow: "hidden", background: `linear-gradient(135deg, #2B2F8F, #0E7490)` }}>
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", opacity: 1 - tmode }}><div style={{ width: 90, height: 90, borderRadius: 45, background: "rgba(255,255,255,.9)", display: "grid", placeItems: "center" }}><Play size={40} color="#2B2F8F" fill="#2B2F8F" /></div></div>
              <div style={{ position: "absolute", inset: 0, background: "#131A33", padding: 28, opacity: tmode, display: "flex", flexDirection: "column", gap: 16 }}>
                {[0.92, 0.85, 0.97, 0.7, 0.88, 0.6].map((w, k) => <div key={k} style={{ height: 14, width: `${w * 100}%`, borderRadius: 7, background: k === 0 ? C.a2 + "88" : "rgba(255,255,255,.14)" }} />)}
              </div>
            </div>
            <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", fontFamily: BN, fontSize: 22, color: C.mute }}><span>কোর্সের অগ্রগতি</span><span style={{ color: C.text, fontWeight: 700 }}>{bn(Math.round(prog * 100))}%</span></div>
            <div style={{ marginTop: 10, height: 10, borderRadius: 5, background: "rgba(255,255,255,.08)" }}><div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 5, background: GRAD }} /></div>
          </div>
          <div style={{ width: 330, borderLeft: `1px solid ${C.line}`, padding: "30px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            {chapters.map((c, k) => {
              const doneK = k < 2 || (k === 2 && prog > 0.6);
              return (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: k === 2 ? "rgba(124,131,255,.14)" : "transparent" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 14, display: "grid", placeItems: "center", background: doneK ? C.green : "rgba(255,255,255,.08)", flex: "none" }}>{doneK ? <Check size={18} color={C.ink} strokeWidth={3} /> : <span style={{ fontFamily: EN, fontSize: 14, color: C.mute }}>{k + 1}</span>}</div>
                  <span style={{ fontFamily: BN, fontSize: 20, color: k <= 2 ? C.text : C.mute, lineHeight: 1.3 }}>{c}</span>
                </div>
              );
            })}
            <div style={{ marginTop: "auto", padding: 20, borderRadius: 16, background: `${C.gold}14`, border: `1px solid ${C.gold}55`, transform: `scale(${score})`, opacity: score }}>
              <div style={{ fontFamily: BN, fontSize: 20, color: C.mute }}>কুইজ স্কোর</div>
              <div style={{ fontFamily: BN, fontSize: 46, fontWeight: 800, color: C.gold }}>{bn(9)}/{bn(10)}</div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const QR = Array.from({ length: 21 * 21 }, (_, i) => random("q" + i) > 0.52);
const S10: React.FC<SP> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = ent(f, fps, 8, 40);
  const scan = interpolate(f, [atf(p, 0.62), atf(p, 0.82)], [0, 1], clamp);
  const ok = pop(f, fps, atf(p, 0.84));
  const LV = [["Level 1", "Course Completion", "#C98A55"], ["Level 2", "Professional Skills", "#AAB4C8"], ["Level 3", "Advanced Professional", C.gold]];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 140, top: 160, width: 600 }}>
        <Label d={4} text="CERTIFICATION" />
        <div style={{ marginTop: 26 }}><Line d={8} size={82} weight={800}>৩ স্তরের <span style={{ color: C.gold }}>সার্টিফিকেট</span></Line></div>
        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 20 }}>
          {LV.map(([l, t, a], i) => {
            const s = ent(f, fps, atf(p, 0.12 + i * 0.1));
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, padding: "20px 26px", borderRadius: 20, background: C.card, border: `1px solid ${C.line}`, opacity: s, transform: `translateX(${(1 - s) * -60}px)` }}>
                <Award size={46} color={a} strokeWidth={1.6} />
                <div><div style={{ fontFamily: EN, fontSize: 18, fontWeight: 700, color: a, letterSpacing: "0.2em" }}>{l.toUpperCase()}</div><div style={{ fontFamily: EN, fontSize: 32, fontWeight: 700, color: C.text }}>{t}</div></div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 830, top: 150, width: 960, perspective: 2200 }}>
        <div style={{ transform: `rotateY(${(1 - c) * 35 - 4 + Math.sin(f / 50) * 2}deg) rotateX(${2 + Math.cos(f / 60) * 1.5}deg) translateY(${(1 - c) * 80}px)`, opacity: c, background: "#FBF8F1", borderRadius: 14, padding: 22, boxShadow: "0 60px 140px rgba(0,0,0,.6)" }}>
          <div style={{ border: `2px solid ${C.gold}`, outline: `1px solid ${C.gold}88`, outlineOffset: -10, borderRadius: 6, padding: "46px 56px", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Mark size={70} />
              <div><div style={{ fontFamily: EN, fontSize: 24, fontWeight: 800, letterSpacing: "0.14em", color: "#0B1020" }}>AI UNIVERSITY OF BANGLADESH</div><div style={{ fontFamily: EN, fontSize: 15, fontWeight: 600, letterSpacing: "0.32em", color: "#8A7440" }}>PROFESSIONAL SKILLS CERTIFICATE</div></div>
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <div style={{ fontFamily: EN, fontSize: 16, letterSpacing: "0.34em", color: "#6B7090" }}>THIS IS TO CERTIFY THAT</div>
              <div style={{ fontFamily: BN, fontSize: 70, fontWeight: 700, color: "#0B1020", marginTop: 6 }}>আপনার নাম</div>
              <div style={{ width: 420, height: 1.5, background: C.gold, margin: "4px auto 16px" }} />
              <div style={{ fontFamily: EN, fontSize: 24, color: "#3B4060" }}>has successfully completed <b>AI Video Production — Professional</b></div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 40 }}>
              <div style={{ fontFamily: EN, fontSize: 17, color: "#6B7090", lineHeight: 1.7 }}>Certificate ID<br /><b style={{ color: "#0B1020", fontSize: 21 }}>AUB-AIV-2026-0847</b></div>
              <div style={{ position: "relative" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(21, 6px)", padding: 8, background: "#fff", border: "1px solid #e5e0d0" }}>
                  {QR.map((b, i) => { const x = i % 21, y = Math.floor(i / 21); const fin = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13); const ring = fin && !(((x % 14) > 0 && (x % 14) < 6 && (y % 14) > 0 && (y % 14) < 6) && !((x % 14) > 1 && (x % 14) < 5 && (y % 14) > 1 && (y % 14) < 5)); return <div key={i} style={{ width: 6, height: 6, background: (fin ? ring : b) ? "#0B1020" : "#fff" }} />; })}
                </div>
                <div style={{ position: "absolute", left: 0, right: 0, top: 8 + scan * 126, height: 3, background: C.green, boxShadow: `0 0 14px ${C.green}`, opacity: scan > 0 && scan < 1 ? 1 : 0 }} />
              </div>
              <div style={{ fontFamily: EN, fontSize: 17, color: "#6B7090", textAlign: "right", lineHeight: 1.7 }}>Issued<br /><b style={{ color: "#0B1020", fontSize: 21 }}>2026</b></div>
            </div>
            <div style={{ position: "absolute", right: -30, top: -30, transform: `scale(${ok}) rotate(-8deg)`, opacity: ok, display: "flex", alignItems: "center", gap: 10, padding: "14px 26px", borderRadius: 40, background: C.green, color: "#05261A", fontFamily: EN, fontSize: 24, fontWeight: 800, boxShadow: `0 16px 40px ${C.green}66` }}><ShieldCheck size={28} strokeWidth={2.4} /> VERIFIED</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ROAD = [[Layers, "দিন ১–১৫", "ফাউন্ডেশন", "ব্র্যান্ড, প্ল্যাটফর্ম ও এআই ইঞ্জিন"], [BookOpen, "দিন ১৬–৩০", "প্রথম ১০টি কোর্স", "সবচেয়ে চাহিদার স্কিল"], [FlaskConical, "দিন ৩১–৬০", "বেটা লঞ্চ", "শিক্ষার্থীদের ফিডব্যাক"], [Rocket, "দিন ৬১–৯০", "পাবলিক লঞ্চ", "সারা দেশের জন্য উন্মুক্ত"]] as const;
const S11: React.FC<SP> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(f, [atf(p, 0.12), atf(p, 0.9)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const X0 = 300, X1 = 1620, Y = 470;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 110 }}>
        <Label d={6} text="THE FIRST 90 DAYS" dark />
        <div style={{ marginTop: 26 }}><Line d={8} size={86} weight={800} color={C.pText}>৯০ দিনের <span style={{ color: "#5B63F5" }}>পরিকল্পনা</span></Line></div>
      </div>
      <div style={{ position: "absolute", left: X0, top: Y, width: X1 - X0, height: 4, borderRadius: 2, background: "rgba(11,16,32,.08)" }}>
        <div style={{ width: `${draw * 100}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg, #5B63F5, #0EA5C6)` }} />
      </div>
      {ROAD.map(([I, d, t, s2], i) => {
        const x = X0 + ((X1 - X0) / 3) * i;
        const on = draw >= i / 3 - 0.001;
        const s = on ? pop(f, fps, atf(p, 0.12) + (p.vo * 0.78 * i) / 3) : 0;
        const c = on ? ent(f, fps, atf(p, 0.12) + (p.vo * 0.78 * i) / 3 + 4) : 0;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - 44, top: Y - 42, width: 88, height: 88, borderRadius: 44, background: on ? "#5B63F5" : "#fff", border: `3px solid ${on ? "#5B63F5" : "rgba(11,16,32,.12)"}`, display: "grid", placeItems: "center", transform: `scale(${0.85 + s * 0.15})`, boxShadow: on ? "0 16px 40px rgba(91,99,245,.35)" : "none" }}><I size={40} color={on ? "#fff" : "#9AA0B8"} strokeWidth={1.8} /></div>
            <div style={{ position: "absolute", left: x - 180, top: Y + 90, width: 360, textAlign: "center", opacity: c, transform: `translateY(${(1 - c) * 30}px)` }}>
              <div style={{ fontFamily: BN, fontSize: 28, fontWeight: 700, color: "#0EA5C6" }}>{d}</div>
              <div style={{ fontFamily: BN, fontSize: 46, fontWeight: 800, color: C.pText, marginTop: 4, lineHeight: 1.25 }}>{t}</div>
              <div style={{ fontFamily: BN, fontSize: 28, color: C.pMute, marginTop: 8 }}>{s2}</div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

const FIRST = [[Cpu, "AI Skills", "এআই দক্ষতা"], [Video, "AI Video", "এআই ভিডিও"], [Megaphone, "Digital Marketing", "ডিজিটাল মার্কেটিং"], [Laptop, "Freelancing", "ফ্রিল্যান্সিং"], [MessageCircle, "Spoken English", "স্পোকেন ইংলিশ"], [UserRound, "Personal Branding", "পার্সোনাল ব্র্যান্ডিং"], [UtensilsCrossed, "Cooking", "রান্না"], [Store, "Food Business", "ফুড বিজনেস"], [HeartPulse, "First Aid", "ফার্স্ট এইড"], [Wallet, "Personal Finance", "পার্সোনাল ফাইন্যান্স"]] as const;
const THUMB = [["#4F46E5", "#06B6D4"], ["#7C3AED", "#EC4899"], ["#EA580C", "#F59E0B"], ["#0EA5E9", "#6366F1"], ["#059669", "#22D3EE"], ["#DB2777", "#F97316"], ["#B45309", "#F59E0B"], ["#16A34A", "#84CC16"], ["#DC2626", "#F472B6"], ["#0D9488", "#3B82F6"]];
const S12: React.FC<SP> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 100 }}>
        <Label d={4} text="LAUNCHING FIRST" />
        <div style={{ marginTop: 26 }}><Line d={8} size={78} weight={800}>প্রথম ধাপেই আসছে <span style={{ color: C.a2 }}>১০টি কোর্স</span></Line></div>
      </div>
      <div style={{ position: "absolute", left: 150, right: 150, top: 330, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 26 }}>
        {FIRST.map(([I, t, b], i) => {
          const s = ent(f, fps, atf(p, 0.06 + i * 0.075), 28);
          const [g1, g2] = THUMB[i];
          return (
            <div key={i} style={{ borderRadius: 22, overflow: "hidden", background: "#0E1428", border: `1px solid ${C.line}`, opacity: s, transform: `translateY(${(1 - s) * 60}px) scale(${0.94 + s * 0.06})` }}>
              <div style={{ height: 150, background: `linear-gradient(135deg, ${g1}, ${g2})`, position: "relative", display: "grid", placeItems: "center" }}>
                <I size={64} color="rgba(255,255,255,.95)" strokeWidth={1.5} />
                <div style={{ position: "absolute", left: 14, top: 12, fontFamily: EN, fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,.85)", letterSpacing: "0.15em" }}>COURSE {String(i + 1).padStart(2, "0")}</div>
              </div>
              <div style={{ padding: "18px 20px 22px" }}>
                <div style={{ fontFamily: EN, fontSize: 25, fontWeight: 700, color: C.text }}>{t}</div>
                <div style={{ fontFamily: BN, fontSize: 22, color: C.mute, marginTop: 4 }}>{b}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const S13: React.FC<SP> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sw = atf(p, 0.42);
  const a = interpolate(f, [sw - 10, sw + 4], [1, 0], clamp);
  const b = interpolate(f, [sw, sw + 16], [0, 1], { ...clamp, easing: ease });
  const m = pop(f, fps, sw + 4);
  const wipe = interpolate(f, [sw + 10, sw + 44], [0, 100], { ...clamp, easing: ease });
  const conn = interpolate(f, [atf(p, 0.1), atf(p, 0.2)], [0, 1], { ...clamp, easing: ease });
  const soon = ent(f, fps, atf(p, 1) + 10);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: a }}>
        <div style={{ position: "absolute", left: 220, top: 260, display: "flex", alignItems: "center", gap: 26, opacity: ent(f, fps, atf(p, 0)) }}>
          <IconTile I={Leaf} size={110} color={C.green} />
          <Line d={atf(p, 0)} size={68} weight={700}>গ্রামের কৃষক</Line>
        </div>
        <div style={{ position: "absolute", right: 220, top: 260, display: "flex", alignItems: "center", gap: 26, opacity: ent(f, fps, atf(p, 0.12)) }}>
          <Line d={atf(p, 0.12)} size={68} weight={700}>শহরের শিক্ষার্থী</Line>
          <IconTile I={GraduationCap} size={110} color={C.a2} />
        </div>
        <div style={{ position: "absolute", left: 760, top: 314, width: 400 * conn, height: 2, background: `linear-gradient(90deg, ${C.green}, ${C.a2})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center" }}>
          <Line d={atf(p, 0.24)} size={96} weight={800} g={GRAD}>সবার জন্য, সবার হাতের মুঠোয়</Line>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: b, alignItems: "center" }}>
        <div style={{ position: "absolute", top: 170, transform: `scale(${m})` }}><Mark size={170} /></div>
        <div style={{ position: "absolute", top: 390, clipPath: `inset(0 ${100 - wipe}% 0 0)`, fontFamily: EN, fontSize: 140, fontWeight: 800, color: "#fff", lineHeight: 1 }}>AI UNIVERSITY</div>
        <div style={{ position: "absolute", top: 550, opacity: ent(f, fps, sw + 30), fontFamily: EN, fontSize: 36, fontWeight: 500, letterSpacing: "0.62em", marginRight: "-0.62em", color: C.mute }}>OF BANGLADESH</div>
        <div style={{ position: "absolute", top: 660 }}><Line d={atf(p, 0.74)} size={66} weight={700} g={`linear-gradient(95deg, ${C.gold}, #FFDDA0)`}>শিখুন যা খুশি, গড়ুন প্রতিটি দক্ষতা</Line></div>
        <div style={{ position: "absolute", top: 820, opacity: soon, transform: `translateY(${(1 - soon) * 20}px)`, display: "flex", alignItems: "center", gap: 18, padding: "18px 40px", borderRadius: 50, border: `1px solid ${C.a1}88`, background: `${C.a1}1a`, fontFamily: BN, fontSize: 36, fontWeight: 600, color: C.text }}>
          <Sparkles size={30} color={C.a2} /> শীঘ্রই আসছে <span style={{ color: C.dim }}>·</span> <span style={{ fontFamily: EN, fontWeight: 600, fontSize: 30 }}>Coming Soon</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- overlays ----------
const Bug: React.FC = () => {
  const f = useCurrentFrame();
  const s = STARTS[3], e = STARTS[12];
  const o = interpolate(f, [s, s + 20, e - 10, e], [0, 1, 1, 0], clamp);
  let L = 0;
  LIGHT.forEach((i) => { const a = STARTS[i], b = a + LENS[i]; L = Math.max(L, interpolate(f, [a - 4, a + 12, b - 10, b + 4], [0, 1, 1, 0], clamp)); });
  return (
    <div style={{ position: "absolute", right: 70, top: 56, display: "flex", alignItems: "center", gap: 14, opacity: o * 0.85 }}>
      <Mark size={40} />
      <div style={{ fontFamily: EN, lineHeight: 1.15, color: L > 0.5 ? C.pText : C.text }}><div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.14em" }}>AI UNIVERSITY</div><div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.42em", opacity: 0.6 }}>OF BANGLADESH</div></div>
    </div>
  );
};

// subtitle chunks timed by character share of each VO clip
const CHUNKS = PARAS.flatMap((t, i) => {
  const parts = t.split(/(?<=[।?,—])\s+/).reduce<string[]>((a, s) => { if (a.length && (a[a.length - 1].length < 22 || s.length < 10)) a[a.length - 1] += " " + s; else a.push(s); return a; }, []);
  const total = parts.reduce((n, s) => n + s.length, 0);
  let acc = 0;
  return parts.map((s) => { const from = STARTS[i] + LEAD[i] + (VO[i] * acc) / total; acc += s.length; return { s, from, to: STARTS[i] + LEAD[i] + (VO[i] * acc) / total }; });
});
const Subs: React.FC = () => {
  const f = useCurrentFrame();
  const c = CHUNKS.find((x) => f >= x.from && f < x.to + 4);
  if (!c || f > STARTS[12] + LEAD[12] + VO[12] * 0.42) return null;
  const o = interpolate(f, [c.from, c.from + 5, c.to, c.to + 4], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ maxWidth: 1500, padding: "10px 28px 14px", borderRadius: 14, background: "rgba(6,9,19,.62)", fontFamily: BN, fontSize: 38, fontWeight: 500, color: "#fff", textAlign: "center", lineHeight: 1.35 }}>{c.s.replace(/[।,]$/, "")}</div>
    </div>
  );
};

const SCENES = [S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13];
// [file, frame offset in scene, volume]; offsets < 0 mean "fraction of VO"
const SFX: [string, number, number][][] = [
  [["swell", 0, 0.5]], [["whoosh", 0, 0.45]], [["hit", 0, 0.8], ["chime", 40, 0.35]], [["whoosh", 0, 0.45]], [["whoosh", 0, 0.45]],
  [["whoosh", 0, 0.45]], [["whoosh", 0, 0.45], ["chime", -0.9, 0.4]], [["whoosh", 0, 0.45], ["pop", -0.57, 0.5], ["pop", -0.69, 0.5], ["pop", -0.81, 0.5]],
  [["whoosh", 0, 0.45], ["pop", -0.84, 0.5]], [["whoosh", 0, 0.45], ["chime", -0.84, 0.5]], [["whoosh", 0, 0.45]], [["whoosh", 0, 0.45]], [["whoosh", 0, 0.45], ["hit", -0.42, 0.7]],
];

export const AIUPromo2: React.FC = () => {
  const musicVol = (fr: number) => {
    let speaking = false;
    for (let i = 0; i < VO.length; i++) { const s = STARTS[i] + LEAD[i]; if (fr >= s - 8 && fr <= s + VO[i] + 4) speaking = true; }
    const fi = interpolate(fr, [0, 40], [0, 1], clamp);
    const fo = interpolate(fr, [AIU2_TOTAL - 90, AIU2_TOTAL], [1, 0], clamp);
    return (speaking ? 0.16 : 0.42) * fi * fo;
  };
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Stage />
      {SCENES.map((S, i) => {
        const p: SP = { lead: LEAD[i], vo: VO[i], len: LENS[i] };
        return (
          <Sequence key={i} from={STARTS[i]} durationInFrames={LENS[i]}>
            <SceneWrap len={LENS[i]}><S {...p} /></SceneWrap>
            <Sequence from={LEAD[i]}><Audio src={staticFile(`aiu2vo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
            {SFX[i].map(([n, o, v], k) => <Sequence key={k} from={Math.max(0, Math.round(o < 0 ? LEAD[i] + VO[i] * -o : o))}><Audio src={staticFile(`aiu2/${n}.mp3`)} volume={v} /></Sequence>)}
          </Sequence>
        );
      })}
      <Bug />
      <Subs />
      <Audio src={staticFile("aiu2/music.mp3")} volume={musicVol} />
    </AbsoluteFill>
  );
};
