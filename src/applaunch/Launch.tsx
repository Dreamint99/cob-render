// AI University app launch ad (Google Play, Nov 2026). One engine, two cuts (short ~34 s, long ~112 s) × three frames
// (9:16 reel, 4:5 feed, 16:9). VO lines: src/applaunch/lines.json → work/applaunch/make_vo.py (Tanvir) → durs.json.
// Screens = real app test shots (aiu-app build/shots) + real GDS-lab recording + 3D driving sim clip. No fake numbers.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import DURS from "./durs.json";

const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
const S = (p: string) => staticFile("applaunch/" + p);

// brand
const BG = "#040B1F", NAVY = "#0B1B46", BLUE = "#2563EB", BLUE2 = "#60A5FA", SKY = "#38BDF8", GOLD = "#FBBF24", ORANGE = "#F97316", MINT = "#34D399", RED = "#F43F5E", TXT = "#F8FAFC", MUTE = "#A5B4CF";
const HEAD = "AnekB, 'Hind Siliguri', sans-serif", BODY = "HindB, 'Hind Siliguri', sans-serif", LAT = "Montserrat, Poppins, sans-serif", MONO = "'Courier New', monospace";
const GOLDG = `linear-gradient(95deg, ${GOLD}, ${ORANGE})`;

if (typeof document !== "undefined") {
  for (const [n, f] of [["AnekB", "AnekBangla.ttf"], ["HindB", "HindSiliguri-Bold.ttf"]]) {
    const ff = new FontFace(n, `url(${staticFile("fonts/" + f)})`);
    ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  }
}

type Mode = "v" | "f" | "h";
const useMode = (): Mode => { const { width, height } = useVideoConfig(); return height > width * 1.5 ? "v" : height > width ? "f" : "h"; };
const pick = <T,>(m: Mode, v: T, f: T, h: T) => (m === "v" ? v : m === "f" ? f : h);
const useIn = (d = 0, damping = 14, mass = 0.8) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - d, fps, config: { damping, mass } }); };

/* ───────── scene data ───────── */
type Screen = { img?: string; vid?: string; from?: number; rate?: number; zoom?: number };
type Scene =
  | { k: "hook" }
  | { k: "terminal"; title: string; hot?: string[]; chips?: string[] }
  | { k: "feature"; title: string; hot?: string[]; sub?: string; chips?: string[]; screens: Screen[]; back?: string; isNew?: boolean; note?: string; tag?: string }
  | { k: "montage"; title?: string; items: { label: string; img: string; isNew?: boolean; notif?: boolean }[] }
  | { k: "why"; items: string[] }
  | { k: "subs" }
  | { k: "offer"; subsLine?: boolean }
  | { k: "cta" };

const WHY = ["পুরোটা বাংলায়", "এআই শিক্ষক ২৪/৭", "হাতে-কলমে ল্যাব: GDS কমান্ড ল্যাব, ৩ডি ড্রাইভিং সিমুলেটর, IELTS এআই ফিডব্যাক", "QR কোডে যাচাইযোগ্য সার্টিফিকেট", "এক অ্যাকাউন্টে ওয়েব + অ্যাপ", "কিডস মোড", "প্রতিটা পেইড কোর্সের প্রথম ২০% পাঠ ফ্রি"];

const LONG: [string, Scene][] = [
  ["hook", { k: "hook" }],
  ["gdswhy", { k: "terminal", title: "প্লেনের টিকেট কাটা হয় GDS-এ, কোড লিখে", hot: ["GDS-এ,"], chips: ["এজেন্সিতে চাকরি", "নিজের এজেন্সি", "প্রবাসে টিকেটিং"] }],
  ["gdslab", { k: "feature", tag: "এয়ার টিকেটিং", title: "অ্যাপের ভেতরেই GDS ল্যাব", hot: ["GDS", "ল্যাব"], chips: ["ফ্লাইট খোঁজা", "PNR বানানো", "টিকেট ইস্যু"], screens: [{ vid: "gds-pnr.mp4", from: 6, rate: 1.4 }], back: "50-gds-dash", note: "শিক্ষামূলক GDS সিমুলেটর" }],
  ["gdscall", { k: "feature", tag: "এয়ার টিকেটিং", title: "গ্রাহকের ফোন", hot: ["গ্রাহকের"], isNew: true, sub: "এআই গ্রাহক কল করে টিকেট চায়, আপনি এজেন্ট", screens: [{ img: "61-gds-call" }, { img: "62-gds-call-live" }, { img: "63-gds-review" }], back: "62-gds-call-live" }],
  ["gdscode", { k: "feature", tag: "এয়ার টিকেটিং", title: "রুট ম্যাপ আর কোড মাস্টার", hot: ["রুট", "ম্যাপ"], sub: "শহর আর এয়ারপোর্ট কোড, খেলতে খেলতে", screens: [{ img: "64-route-map" }, { img: "66-code-master" }], back: "64-route-map" }],
  ["partner", { k: "feature", tag: "ইংরেজি", title: "ইংরেজিতে কথা বলুন", hot: ["কথা", "বলুন"], sub: "এআই পার্টনারের সাথে, ফোনের মতো", chips: ["দোকান", "অফিস", "এয়ারপোর্ট"], screens: [{ img: "59-partner" }, { img: "60-partner-call" }], back: "59-partner" }],
  ["cards", { k: "feature", tag: "ইংরেজি", title: "কার্ড রিভিশন", hot: ["রিভিশন"], chips: ["দেখুন", "শুনুন", "বলুন"], sub: "শব্দে ট্যাপ = বাংলা অর্থ, অফলাইনেও", screens: [{ img: "55-card-front" }, { img: "56-card-back" }, { img: "61-word-sheet" }], back: "56-card-back" }],
  ["ielts", { k: "feature", tag: "IELTS", title: "IELTS মক টেস্ট", hot: ["IELTS"], sub: "রাইটিং আর স্পিকিংয়ে এআই ফিডব্যাক", screens: [{ img: "70-mock-report" }, { img: "72-mock-report-writing" }], back: "70-mock-report" }],
  ["teacher", { k: "feature", title: "এআই শিক্ষক", hot: ["এআই"], sub: "যেকোনো প্রশ্ন, যেকোনো সময়", chips: ["লিখে", "বলে", "ছবি তুলে"], screens: [{ img: "52-teacher" }, { img: "18-guru" }, { img: "61-scan-translate" }], back: "18-guru" }],
  ["community", { k: "feature", title: "কমিউনিটি", hot: ["কমিউনিটি"], isNew: true, sub: "প্রশ্ন, উত্তর আর প্রতিদিনের কুইজ", screens: [{ img: "90-community" }, { img: "93-community-post" }], back: "93-community-post" }],
  ["more", { k: "montage", items: [{ label: "বই লাইব্রেরি", img: "70-books-library" }, { label: "লিডারবোর্ড", img: "70-board" }, { label: "অফলাইন সার্চ", img: "68-search-results" }, { label: "স্মার্ট নোটিফিকেশন", img: "10-home", notif: true }] }],
  ["kids", { k: "feature", title: "কিডস মোড", hot: ["কিডস"], sub: "বাচ্চাদের জন্য আলাদা জগৎ", screens: [{ img: "15-kids" }], back: "15-kids" }],
  ["why", { k: "why", items: WHY }],
  ["subs", { k: "subs" }],
  ["offer", { k: "offer" }],
  ["cta", { k: "cta" }],
];

const SHORT: [string, Scene][] = [
  ["hook", { k: "hook" }],
  ["gds", { k: "feature", tag: "এয়ার টিকেটিং", title: "এয়ার টিকেটিং শিখুন হাতে-কলমে", hot: ["হাতে-কলমে"], chips: ["GDS ল্যাব", "গ্রাহকের ফোন"], screens: [{ vid: "gds-pnr.mp4", from: 6, rate: 1.5 }, { img: "62-gds-call-live" }, { img: "63-gds-review" }], back: "50-gds-dash", note: "শিক্ষামূলক GDS সিমুলেটর" }],
  ["english", { k: "feature", tag: "ইংরেজি", title: "ইংরেজিতে কথা বলুন", hot: ["কথা", "বলুন"], chips: ["পার্টনার কল", "কার্ড রিভিশন"], screens: [{ img: "60-partner-call" }, { img: "56-card-back" }], back: "59-partner" }],
  ["more", { k: "montage", items: [{ label: "কমিউনিটি", img: "90-community", isNew: true }, { label: "বই লাইব্রেরি", img: "70-books-library" }, { label: "লিডারবোর্ড", img: "70-board" }, { label: "অফলাইন সার্চ", img: "68-search-results" }, { label: "স্মার্ট নোটিফিকেশন", img: "10-home", notif: true }] }],
  ["why", { k: "why", items: WHY }],
  ["offer", { k: "offer", subsLine: true }],
  ["cta", { k: "cta" }],
];

const D = DURS as Record<string, number>;
const LEAD = 5, TAIL = 7;
const timeline = (cut: "long" | "short") => {
  const list = cut === "long" ? LONG : SHORT;
  let at = 0;
  return list.map(([id, sc], i) => {
    const lead = i === 0 ? 3 : LEAD;
    const len = Math.round(D[`${cut}-${id}`] * FPS) + lead + TAIL + (sc.k === "cta" ? 40 : 0);
    const it = { id, sc, from: at, len, lead, vo: `vo/${cut}-${id}.mp3` }; at += len; return it;
  });
};
export const launchTotal = (cut: "long" | "short") => { const t = timeline(cut); const l = t[t.length - 1]; return l.from + l.len; };

/* ───────── building blocks ───────── */
const Backdrop: React.FC<{ hue?: string }> = ({ hue = BLUE }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const M = Math.max(W, H);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${NAVY} 0%, ${BG} 55%, #020617 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: M * 0.9, height: M * 0.9, left: -M * 0.25 + 50 * Math.sin(f / 45), top: -M * 0.35 + 30 * Math.cos(f / 60), borderRadius: "50%", background: `radial-gradient(circle, ${hue}55, transparent 62%)` }} />
      <div style={{ position: "absolute", width: M * 0.8, height: M * 0.8, right: -M * 0.3 + 40 * Math.cos(f / 50), bottom: -M * 0.3, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}22, transparent 62%)` }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.10) 1px, transparent 1px)", backgroundSize: "80px 80px", backgroundPosition: `0 ${(f * 0.6) % 80}px`,
        maskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 72%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 72%)" }} />
      {Array.from({ length: 14 }).map((_, i) => {
        const x = (i * 137) % 100, sp = 0.25 + (i % 5) * 0.08, y = 100 - ((f * sp + i * 23) % 120);
        return <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2, borderRadius: 10, background: i % 4 === 0 ? GOLD : BLUE2, opacity: 0.35, filter: "blur(1px)" }} />;
      })}
    </AbsoluteFill>
  );
};

const Title: React.FC<{ text: string; hot?: string[]; size: number; delay?: number; align?: "center" | "left"; color?: string }> = ({ text, hot = [], size, delay = 2, align = "center", color = TXT }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: size, lineHeight: 1.22, color, textAlign: align, textWrap: "balance" as never }}>
      {text.split(" ").map((w, i) => {
        const k = lerp(f, delay + i * 3, delay + i * 3 + 13);
        const isHot = hot.includes(w);
        return <span key={i} style={{ display: "inline-block", marginRight: "0.24em", opacity: k, transform: `translateY(${(1 - k) * 0.5 * size}px) scale(${0.92 + 0.08 * k})`, filter: `blur(${(1 - k) * 8}px)`,
          ...(isHot ? { background: GOLDG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", paddingBottom: "0.08em" } : {}) }}>{w}</span>;
      })}
    </div>
  );
};

const Chip: React.FC<{ t: string; i: number; fs: number; color?: string; delay?: number }> = ({ t, i, fs, color = BLUE, delay = 10 }) => {
  const k = useIn(delay + i * 5, 12);
  return <div style={{ display: "inline-flex", alignItems: "center", gap: fs * 0.35, padding: `${fs * 0.36}px ${fs * 0.75}px`, borderRadius: 80, background: `linear-gradient(135deg, ${color}38, ${color}14)`, border: `2px solid ${color}AA`, fontFamily: BODY, fontWeight: 700, fontSize: fs, color: TXT,
    opacity: k, transform: `translateY(${(1 - k) * 26}px) scale(${0.85 + 0.15 * k})`, boxShadow: `0 10px 30px ${color}22` }}>
    <span style={{ width: fs * 0.34, height: fs * 0.34, borderRadius: 20, background: GOLD, boxShadow: `0 0 12px ${GOLD}` }} />{t}</div>;
};

const NewBadge: React.FC<{ fs: number; delay?: number }> = ({ fs, delay = 14 }) => {
  const f = useCurrentFrame();
  const k = useIn(delay, 9);
  return <span style={{ display: "inline-block", padding: `${fs * 0.12}px ${fs * 0.5}px`, borderRadius: 60, background: `linear-gradient(90deg, ${RED}, ${ORANGE})`, fontFamily: HEAD, fontWeight: 800, fontSize: fs, color: "#fff",
    transform: `scale(${(0.5 + 0.5 * k) * (1 + 0.04 * Math.sin(f / 4))}) rotate(${(1 - k) * -20}deg)`, opacity: k, boxShadow: `0 0 30px ${RED}88`, verticalAlign: "middle" }}>নতুন</span>;
};

const Tag: React.FC<{ t: string; fs: number }> = ({ t, fs }) => {
  const k = useIn(0, 14);
  return <div style={{ display: "inline-block", alignSelf: "inherit", width: "fit-content", padding: `${fs * 0.22}px ${fs * 0.7}px`, borderRadius: 60, border: `2px solid ${SKY}88`, background: `${SKY}18`, fontFamily: BODY, fontWeight: 700, fontSize: fs, color: SKY, opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>{t}</div>;
};

// phone mockup; screens switch with a slide; slow push-in; gentle float + 3D tilt
const ScreenView: React.FC<{ s: Screen; len: number }> = ({ s, len }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, len], [1, 1.05], clamp);
  // the GDS-lab recording: zoom to the terminal (lower part) and cover the web buy bar at the very bottom (not in the Play app)
  if (s.vid) return <AbsoluteFill style={{ background: "#0B1220" }}>
    <div style={{ position: "absolute", inset: 0, transform: `scale(${(s.zoom ?? 1.75) * (0.97 + 0.03 * z / 1.05)})`, transformOrigin: "50% 90%" }}>
      <OffthreadVideo src={S(s.vid)} startFrom={Math.round((s.from ?? 0) * FPS)} playbackRate={s.rate ?? 1} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "15%", background: "linear-gradient(180deg, rgba(11,18,32,0), #0B1220 35%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "16%", background: "linear-gradient(180deg, #0B1220 60%, rgba(11,18,32,0))", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: LAT, fontWeight: 700, fontSize: 20, color: "#7CFFB2" }}>
      <span style={{ width: 10, height: 10, borderRadius: 10, background: "#22C55E", boxShadow: "0 0 10px #22C55E" }} />GDS LAB</div>
  </AbsoluteFill>;
  return <Img src={S(`shots/${s.img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transform: `scale(${z})`, transformOrigin: "50% 20%" }} />;
};

const Phone: React.FC<{ w: number; screens: Screen[]; len: number; delay?: number; tilt?: number; notif?: boolean }> = ({ w, screens, len, delay = 0, tilt = 0, notif }) => {
  const f = useCurrentFrame();
  const k = useIn(delay, 15, 0.9);
  const h = w * 2.167;
  const per = Math.max(1, Math.floor((len - 10) / screens.length));
  const fl = Math.sin(f / 28) * 8;
  return (
    <div style={{ width: w, height: h + w * 0.06, perspective: 2200 }}>
      <div style={{ width: w, padding: w * 0.03, borderRadius: w * 0.14, background: "linear-gradient(145deg,#1E293B,#020617)", border: "2px solid #475569",
        boxShadow: `0 ${w * 0.12}px ${w * 0.3}px rgba(0,0,0,0.65), 0 0 ${w * 0.25}px ${BLUE}40, inset 0 0 0 2px #0F172A`,
        opacity: k, transform: `translateY(${(1 - k) * 160 + fl}px) rotateY(${tilt + (1 - k) * 18}deg) rotateZ(${(1 - k) * -5}deg)` }}>
        <div style={{ position: "relative", borderRadius: w * 0.11, overflow: "hidden", height: h, background: "#fff" }}>
          {screens.map((s, i) => {
            const st = i * per;
            if (f < st - 1) return null;
            const e = i === 0 ? 1 : lerp(f, st, st + 12);
            return <div key={i} style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - e) * 100}%)`, boxShadow: i ? "0 -20px 40px rgba(0,0,0,0.25)" : undefined }}>
              <Sequence from={st} layout="none"><ScreenView s={s} len={len - st} /></Sequence>
            </div>;
          })}
          <div style={{ position: "absolute", top: w * 0.025, left: "50%", width: w * 0.22, height: w * 0.055, marginLeft: -w * 0.11, borderRadius: 40, background: "#020617" }} />
          {notif ? <Notif w={w} /> : null}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 28%, transparent 70%, rgba(255,255,255,0.06) 100%)", pointerEvents: "none" }} />
        </div>
      </div>
    </div>
  );
};

// rich notification card drawn over the home screen (feature shown: smart notifications open the exact lesson)
const Notif: React.FC<{ w: number }> = ({ w }) => {
  const k = useIn(4, 13);
  const fs = w * 0.036;
  return (
    <div style={{ position: "absolute", left: w * 0.04, right: w * 0.04, top: w * 0.1, padding: fs * 0.9, borderRadius: fs * 1.2, background: "rgba(255,255,255,0.97)", boxShadow: "0 18px 40px rgba(2,6,23,0.35)",
      transform: `translateY(${(1 - k) * -140}%)`, fontFamily: BODY, color: "#0F172A" }}>
      <div style={{ display: "flex", alignItems: "center", gap: fs * 0.5, fontSize: fs * 0.8, color: "#64748B" }}>
        <Img src={S("icon.png")} style={{ width: fs * 1.3, height: fs * 1.3, borderRadius: 6 }} /> AI University · এখন</div>
      <div style={{ fontWeight: 700, fontSize: fs * 1.05, marginTop: fs * 0.3 }}>আজকের পাঠ বাকি আছে 🔥</div>
      <div style={{ fontSize: fs * 0.9, color: "#334155" }}>ট্যাপ করলেই ঠিক যেখানে থেমেছিলেন</div>
      <div style={{ display: "flex", gap: fs * 0.6, marginTop: fs * 0.5, fontWeight: 700, fontSize: fs * 0.85, color: BLUE }}><span>এখনই শুরু</span><span style={{ color: "#64748B" }}>পরে মনে করাও</span></div>
    </div>
  );
};

const BackPhone: React.FC<{ w: number; img: string; side: 1 | -1 }> = ({ w, img, side }) => {
  const k = useIn(8, 16);
  const f = useCurrentFrame();
  return <div style={{ width: w, padding: w * 0.03, borderRadius: w * 0.14, background: "#0F172A", border: "2px solid #334155", opacity: 0.55 * k, filter: "blur(1.5px) saturate(0.8)",
    transform: `translateX(${side * (1 - k) * -80}px) translateY(${Math.cos(f / 30) * 6}px) rotate(${side * 9}deg)` }}>
    <div style={{ borderRadius: w * 0.11, overflow: "hidden", height: w * 2.167 }}><Img src={S(`shots/${img}.jpg`)} style={{ width: "100%" }} /></div></div>;
};

const PlayLogo: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s * 1.1} viewBox="0 0 30 33">
    <path d="M1.2 0.9 L17 16.5 L1.2 32.1 C0.6 31.8 0.3 31.2 0.3 30.4 V2.6 C0.3 1.8 0.6 1.2 1.2 0.9Z" fill="#00D7FE" />
    <path d="M22.3 11.2 L17 16.5 L1.2 0.9 C1.6 0.7 2.2 0.7 2.8 1 Z" fill="#00F076" />
    <path d="M22.3 21.8 L2.8 32 C2.2 32.3 1.6 32.3 1.2 32.1 L17 16.5 Z" fill="#FF3A44" />
    <path d="M22.3 11.2 L28.2 14.5 C29.6 15.3 29.6 17.7 28.2 18.5 L22.3 21.8 L17 16.5 Z" fill="#FFD400" />
  </svg>
);

const PlayBadge: React.FC<{ h: number }> = ({ h }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: h * 0.2, height: h, padding: `0 ${h * 0.34}px 0 ${h * 0.26}px`, borderRadius: h * 0.16, background: "#000", border: "2px solid #A6A6A6" }}>
    <PlayLogo s={h * 0.52} />
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05, color: "#fff" }}>
      <span style={{ fontFamily: LAT, fontWeight: 500, fontSize: h * 0.2, letterSpacing: 0.5 }}>GET IT ON</span>
      <span style={{ fontFamily: LAT, fontWeight: 600, fontSize: h * 0.4 }}>Google Play</span>
    </div>
  </div>
);

const Note: React.FC<{ t: string; fs: number; style?: React.CSSProperties }> = ({ t, fs, style }) => {
  const f = useCurrentFrame();
  return <div style={{ fontFamily: BODY, fontSize: fs, color: MUTE, opacity: lerp(f, 30, 45) * 0.9, ...style }}>{t}</div>;
};

/* ───────── scenes ───────── */
const Hook: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const m = useMode();
  const st = useIn(30, 9, 0.7);
  const flash = lerp(f, 0, 6, 1, 0);
  const words: [string, boolean][] = [["AI", false], ["University-র", false], ["অ্যাপ", false], ["এখন", false], ["Google", true], ["Play-তে!", true]];
  const fs = pick(m, 112, 92, 104);
  const text = (
    <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: fs, lineHeight: 1.15, color: TXT, textAlign: m === "h" ? "left" : "center" }}>
      {words.map(([w, hot], i) => {
        const k = spring({ frame: f - 1 - i * 3, fps: FPS, config: { damping: 11, mass: 0.6 } });
        return <span key={i} style={{ display: "inline-block", marginRight: "0.22em", transform: `scale(${1.8 - 0.8 * k}) translateY(${(1 - k) * -30}px)`, opacity: Math.min(1, k * 1.4),
          ...(hot ? { background: `linear-gradient(95deg, ${MINT}, ${SKY} 45%, ${GOLD})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", paddingBottom: "0.06em" } : {}) }}>{w}</span>;
      })}
    </div>
  );
  const stamp = (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", padding: `${fs * 0.18}px ${fs * 0.5}px`, borderRadius: fs * 0.3, background: GOLDG, color: "#1E1B4B",
      transform: `scale(${st * (1 + 0.03 * Math.sin(f / 4))}) rotate(${-6 + (1 - st) * -30}deg)`, opacity: st, boxShadow: `0 20px 60px ${ORANGE}66` }}>
      <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: fs * 0.34 }}>লঞ্চিং স্পেশাল</span>
      <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: fs * 0.62, lineHeight: 1.05 }}>৩ মাস ৳৯৯৯</span>
    </div>
  );
  const phone = <Phone w={pick(m, 430, 330, 380)} screens={[{ vid: "gds-pnr.mp4", from: 12, rate: 1.5, zoom: 2.2 }]} len={len} delay={6} tilt={m === "h" ? -12 : 0} />;
  const icon = <Img src={S("icon.png")} style={{ width: fs * 1.1, height: fs * 1.1, borderRadius: fs * 0.26, boxShadow: `0 0 40px ${BLUE}88`, transform: `scale(${useIn(0, 10)})` }} />;
  return (
    <AbsoluteFill>
      <Backdrop hue={BLUE} />
      {m === "h" ? (
        <>
          <div style={{ position: "absolute", left: 120, top: 150, width: 980 }}>{icon}<div style={{ height: 30 }} />{text}<div style={{ height: 40 }} />{stamp}</div>
          <div style={{ position: "absolute", left: 1280, top: 60 }}>{phone}</div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", top: pick(m, 250, 60, 0), left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>{m === "v" ? icon : null}{text}</div>
          <div style={{ position: "absolute", top: pick(m, 840, 470, 0), left: 0, right: 0, display: "flex", justifyContent: "center" }}>{phone}</div>
          <div style={{ position: "absolute", top: pick(m, 760, 420, 0), right: pick(m, 70, 60, 0) }}>{stamp}</div>
        </>
      )}
      <PlayLogoBurst />
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.7 }} />
    </AbsoluteFill>
  );
};
const PlayLogoBurst: React.FC = () => {
  const f = useCurrentFrame();
  const m = useMode();
  const k = lerp(f, 16, 34);
  if (k <= 0 || k >= 1) return null;
  return <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: Math.sin(k * Math.PI) * 0.5 }}><div style={{ transform: `scale(${2 + k * 6})` }}><PlayLogo s={pick(m, 90, 80, 90)} /></div></AbsoluteFill>;
};

const FLIGHTS = [
  " 1 BG 147  J4 C4 Y9 B9  DAC JED 0145 0610",
  " 2 SV 803  J2 C2 Y9 M7  DAC JED 0920 1340",
  " 3 EK 585  J9 C4 Y9 B4  DAC DXB 1015 1340",
  " 4 QR 639  J4 Y9 B7 M5  DAC DOH 1930 2215",
];
const TerminalScene: React.FC<{ sc: Extract<Scene, { k: "terminal" }> }> = ({ sc }) => {
  const f = useCurrentFrame();
  const m = useMode();
  const cmd = "AN15DECDACJED";
  const n = Math.max(0, Math.min(cmd.length, Math.floor((f - 10) / 2)));
  const sh = f - 10 - cmd.length * 2 - 6;
  const tk = useIn(4, 14);
  const fs = pick(m, 30, 26, 28);
  const term = (
    <div style={{ width: pick(m, 960, 940, 820), padding: fs * 1.1, borderRadius: 28, background: "#020617", border: "2px solid #22C55E66", boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 80px #22C55E22",
      fontFamily: MONO, fontWeight: 700, fontSize: fs, lineHeight: 1.6, color: "#7CFFB2", opacity: tk, transform: `perspective(1600px) rotateX(${(1 - tk) * 20}deg) scale(${0.9 + 0.1 * tk})` }}>
      <div style={{ display: "flex", gap: 10, marginBottom: fs * 0.6, alignItems: "center" }}>{["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: fs * 0.55, height: fs * 0.55, borderRadius: 20, background: c }} />)}<span style={{ marginLeft: 10, color: MUTE, fontSize: fs * 0.72, fontFamily: LAT }}>GDS · AI University Lab</span></div>
      <div>&gt; {cmd.slice(0, n)}<span style={{ opacity: f % 14 < 7 ? 1 : 0 }}>▌</span></div>
      {sh > 0 ? <div style={{ color: "#E2E8F0" }}>** AVAILABILITY ** DAC → JED  15DEC</div> : null}
      {FLIGHTS.map((l, i) => (sh > 3 + i * 4 ? <div key={i} style={{ whiteSpace: "pre", color: i === 0 ? GOLD : "#7CFFB2" }}>{l}</div> : null))}
    </div>
  );
  const chips = <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: m === "h" ? "flex-start" : "center" }}>{(sc.chips ?? []).map((c, i) => <Chip key={c} t={c} i={i} fs={pick(m, 40, 34, 36)} delay={40} />)}</div>;
  return (
    <AbsoluteFill>
      <Backdrop hue="#047857" />
      {m === "h" ? (
        <>
          <div style={{ position: "absolute", left: 110, top: 170, width: 820, display: "flex", flexDirection: "column", gap: 40 }}><Tag t="এয়ার টিকেটিং" fs={32} /><Title text={sc.title} hot={sc.hot} size={78} align="left" />{chips}</div>
          <div style={{ position: "absolute", left: 1000, top: 250 }}>{term}</div>
        </>
      ) : (
        <div style={{ position: "absolute", top: pick(m, 260, 60, 0), left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: pick(m, 44, 30, 0) }}>
          <Tag t="এয়ার টিকেটিং" fs={pick(m, 34, 30, 30)} /><Title text={sc.title} hot={sc.hot} size={pick(m, 82, 70, 70)} />{term}{chips}
        </div>
      )}
    </AbsoluteFill>
  );
};

const Feature: React.FC<{ sc: Extract<Scene, { k: "feature" }>; len: number }> = ({ sc, len }) => {
  const m = useMode();
  const f = useCurrentFrame();
  const head = (
    <>
      {sc.tag ? <Tag t={sc.tag} fs={pick(m, 32, 28, 30)} /> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifyContent: m === "h" ? "flex-start" : "center" }}>
        <Title text={sc.title} hot={sc.hot} size={pick(m, 86, 70, 84)} align={m === "h" ? "left" : "center"} />{sc.isNew ? <NewBadge fs={pick(m, 40, 34, 38)} /> : null}
      </div>
      {sc.sub ? <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: pick(m, 44, 36, 42), color: "#CBD5E1", textAlign: m === "h" ? "left" : "center", opacity: lerp(f, 12, 26), transform: `translateY(${(1 - lerp(f, 12, 26)) * 20}px)` }}>{sc.sub}</div> : null}
      {sc.chips ? <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: m === "h" ? "flex-start" : "center" }}>{sc.chips.map((c, i) => <Chip key={c} t={c} i={i} fs={pick(m, 38, 32, 36)} delay={18} />)}</div> : null}
      {sc.note ? <Note t={sc.note} fs={pick(m, 28, 24, 28)} /> : null}
    </>
  );
  const pw = pick(m, 450, 330, 390);
  const phones = (
    <div style={{ position: "relative", width: pw * 1.7, display: "flex", justifyContent: "center" }}>
      {sc.back ? <div style={{ position: "absolute", left: m === "h" ? pw * -0.1 : pw * -0.05, top: pw * 0.25 }}><BackPhone w={pw * 0.82} img={sc.back} side={-1} /></div> : null}
      <Phone w={pw} screens={sc.screens} len={len} delay={4} tilt={m === "h" ? -10 : 0} />
    </div>
  );
  return (
    <AbsoluteFill>
      <Backdrop hue={sc.tag === "এয়ার টিকেটিং" ? "#0E7490" : sc.tag === "ইংরেজি" || sc.tag === "IELTS" ? "#7C3AED" : BLUE} />
      {m === "h" ? (
        <>
          <div style={{ position: "absolute", left: 110, top: 0, bottom: 0, width: 900, display: "flex", flexDirection: "column", justifyContent: "center", gap: 30 }}>{head}</div>
          <div style={{ position: "absolute", left: 1080, top: 70 }}>{phones}</div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", top: pick(m, 250, 50, 0), left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: pick(m, 22, 16, 0) }}>{head}</div>
          <div style={{ position: "absolute", top: pick(m, (sc.chips && sc.sub) || sc.note ? 800 : 720, (sc.chips && sc.sub) || sc.note ? 450 : 390, 0), left: 0, right: 0, display: "flex", justifyContent: "center" }}>{phones}</div>
        </>
      )}
    </AbsoluteFill>
  );
};

const Montage: React.FC<{ sc: Extract<Scene, { k: "montage" }>; len: number }> = ({ sc, len }) => {
  const f = useCurrentFrame();
  const m = useMode();
  const n = sc.items.length, per = len / n;
  const i = Math.min(n - 1, Math.floor(f / per));
  const it = sc.items[i];
  const lf = f - i * per;
  const k = spring({ frame: lf, fps: FPS, config: { damping: 13, mass: 0.6 } });
  const pw = pick(m, 450, 330, 390);
  const label = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: m === "h" ? "flex-start" : "center", gap: 18 }}>
      <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: pick(m, 34, 30, 32), color: SKY, letterSpacing: 2 }}>{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: pick(m, 92, 76, 92), color: TXT, transform: `translateY(${(1 - k) * 60}px)`, opacity: k }}>{it.label}</div>
        {it.isNew ? <NewBadge fs={pick(m, 38, 32, 36)} delay={i * per + 6} /> : null}
      </div>
      <div style={{ display: "flex", gap: 10 }}>{sc.items.map((_, j) => <div key={j} style={{ width: j === i ? 60 : 18, height: 10, borderRadius: 10, background: j <= i ? GOLD : "#334155" }} />)}</div>
    </div>
  );
  const phone = (
    <div style={{ transform: `perspective(1800px) rotateY(${(1 - k) * 70}deg) scale(${0.9 + 0.1 * k})`, opacity: Math.min(1, k * 1.5) }}>
      <Sequence from={Math.round(i * per)} layout="none" key={i}><Phone w={pw} screens={[{ img: it.img }]} len={Math.round(per) + 10} notif={it.notif} /></Sequence>
    </div>
  );
  return (
    <AbsoluteFill>
      <Backdrop hue={i % 2 ? "#7C3AED" : BLUE} />
      {m === "h" ? (
        <>
          <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 900, display: "flex", flexDirection: "column", justifyContent: "center", gap: 30 }}>
            <Title text="আরও যা আছে" size={46} align="left" color={MUTE} />{label}</div>
          <div style={{ position: "absolute", left: 1250, top: 70 }}>{phone}</div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", top: pick(m, 250, 50, 0), left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}><Title text="আরও যা আছে" size={pick(m, 44, 36, 0)} color={MUTE} />{label}</div>
          <div style={{ position: "absolute", top: pick(m, 700, 400, 0), left: 0, right: 0, display: "flex", justifyContent: "center" }}>{phone}</div>
        </>
      )}
    </AbsoluteFill>
  );
};

const WhyScene: React.FC<{ sc: Extract<Scene, { k: "why" }>; len: number }> = ({ sc, len }) => {
  const f = useCurrentFrame();
  const m = useMode();
  const start = 22, gap = Math.min(40, (len - start - 30) / sc.items.length);
  const fs = pick(m, 46, 38, 46);
  return (
    <AbsoluteFill>
      <Backdrop hue="#1D4ED8" />
      <div style={{ position: "absolute", top: pick(m, 250, 50, 150), left: pick(m, 60, 50, 140), right: pick(m, 60, 50, 140), display: "flex", flexDirection: "column", alignItems: m === "h" ? "flex-start" : "center", gap: pick(m, 40, 26, 36) }}>
        <Title text="কেন AI University?" hot={["AI", "University?"]} size={pick(m, 92, 74, 84)} align={m === "h" ? "left" : "center"} />
        <div style={{ display: "flex", flexDirection: m === "h" ? "row" : "column", flexWrap: "wrap", gap: pick(m, 20, 14, 20), width: "100%" }}>
          {sc.items.map((t, i) => {
            const a = start + i * gap;
            const k = spring({ frame: f - a, fps: FPS, config: { damping: 14, mass: 0.7 } });
            const tick = lerp(f, a + 4, a + 14);
            const lit = f >= a && f < a + gap + 6;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: fs * 0.5, padding: `${fs * 0.36}px ${fs * 0.6}px`, borderRadius: 24, width: m === "h" ? "calc(50% - 10px)" : undefined, boxSizing: "border-box",
                background: lit ? `linear-gradient(90deg, ${BLUE}55, ${BLUE}18)` : "rgba(15,23,42,0.7)", border: `2px solid ${lit ? BLUE2 : "#1E293B"}`, opacity: k, transform: `translateX(${(1 - k) * 80}px)` }}>
                <svg width={fs * 1.1} height={fs * 1.1} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="11" fill={MINT} opacity={0.18 + 0.82 * tick} />
                  <path d="M6.5 12.5 L10.5 16 L17.5 8.5" stroke="#04281C" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="20" strokeDashoffset={20 * (1 - tick)} />
                </svg>
                <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs, color: TXT, lineHeight: 1.3 }}>{t}</span>
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: pick(m, 44, 36, 40), color: GOLD, opacity: lerp(f, start + sc.items.length * gap, start + sc.items.length * gap + 14) }}>১৩টি কোর্স · ৫৯০+ পাঠ</div>
      </div>
    </AbsoluteFill>
  );
};

const COURSES = ["এয়ার টিকেটিং (GDS)", "IELTS প্রস্তুতি", "স্পোকেন ইংলিশ", "জাপানি", "কোরিয়ান (EPS)", "গালফের আরবি", "কম্পিউটার শিক্ষা", "ড্রাইভিং", "ভাইব কোডিং", "পারিবারিক স্বাস্থ্য", "মাছের খাদ্য", "সাপ উদ্ধার", "বিজ্ঞানের ভেলকি"];
const Subs: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const m = useMode();
  const { width: W, height: H } = useVideoConfig();
  const merge = lerp(f, len * 0.62, len * 0.62 + 18);
  const card = spring({ frame: f - len * 0.62 - 8, fps: FPS, config: { damping: 12 } });
  const fs = pick(m, 40, 34, 38);
  return (
    <AbsoluteFill>
      <Backdrop hue="#0EA5E9" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, width: pick(m, 980, 980, 1500), opacity: 1 - merge, transform: `scale(${1 - 0.6 * merge})` }}>
          {COURSES.map((c, i) => {
            const k = spring({ frame: f - 4 - i * 3, fps: FPS, config: { damping: 13, mass: 0.6 } });
            const dx = ((i * 97) % 7 - 3) * 60, dy = -H * 0.6;
            return <div key={c} style={{ padding: `${fs * 0.4}px ${fs * 0.7}px`, borderRadius: 22, background: i < 3 ? `linear-gradient(135deg, ${BLUE}, #1E40AF)` : "rgba(30,41,59,0.92)", border: `2px solid ${i < 3 ? BLUE2 : "#334155"}`,
              fontFamily: BODY, fontWeight: 700, fontSize: fs, color: TXT, transform: `translate(${(1 - k) * dx}px, ${(1 - k) * dy}px) rotate(${(1 - k) * ((i % 2) * 2 - 1) * 20}deg)`, boxShadow: "0 14px 30px rgba(0,0,0,0.4)" }}>{c}</div>;
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: m === "v" ? 200 : 0 }}>
        <div style={{ width: pick(m, 900, 900, 1200), padding: pick(m, 60, 46, 60), borderRadius: 44, background: `linear-gradient(140deg, ${BLUE}, #1E3A8A 60%, #0B1B46)`, border: `3px solid ${BLUE2}`, textAlign: "center",
          boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 120px ${BLUE}66`, transform: `scale(${0.6 + 0.4 * card})`, opacity: card }}>
          <Img src={S("icon.png")} style={{ width: 120, height: 120, borderRadius: 28 }} />
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: pick(m, 84, 70, 84), color: TXT, lineHeight: 1.2, marginTop: 20 }}>একটি সাবস্ক্রিপশনেই <span style={{ background: GOLDG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>সব কোর্স</span></div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: pick(m, 42, 36, 40), color: "#BFDBFE", marginTop: 14 }}>১৩টি কোর্স · ৫৯০+ পাঠ</div>
        </div>
      </AbsoluteFill>
      {m === "h" ? null : <div style={{ display: "none" }}>{W}</div>}
    </AbsoluteFill>
  );
};

const Offer: React.FC<{ sc: Extract<Scene, { k: "offer" }>; len: number }> = ({ sc }) => {
  const f = useCurrentFrame();
  const m = useMode();
  const a = useIn(2, 12), p = useIn(sc.subsLine ? 46 : 18, 8, 0.7), d = useIn(sc.subsLine ? 80 : 50, 12), g = 0.5 + 0.5 * Math.sin(f / 6);
  const big = pick(m, 300, 250, 260);
  return (
    <AbsoluteFill>
      <Backdrop hue="#B45309" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: pick(m, 26, 16, 18), paddingBottom: pick(m, 160, 0, 0) }}>
        {sc.subsLine ? <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: pick(m, 66, 56, 60), color: TXT, opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>একটি সাবস্ক্রিপশনেই <span style={{ color: GOLD }}>সব কোর্স</span></div> : null}
        <div style={{ padding: "12px 36px", borderRadius: 60, background: `linear-gradient(90deg, ${RED}, ${ORANGE})`, fontFamily: HEAD, fontWeight: 800, fontSize: pick(m, 46, 40, 42), color: "#fff", boxShadow: `0 0 ${30 + 30 * g}px ${RED}77`,
          transform: `scale(${useIn(sc.subsLine ? 30 : 0, 10)})` }}>🚀 অ্যাপ লঞ্চিং স্পেশাল অফার</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: pick(m, 72, 60, 64), color: TXT, opacity: lerp(f, sc.subsLine ? 38 : 10, sc.subsLine ? 50 : 22) }}>৩ মাসের মেম্বারশিপ</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
          <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: big * 0.36, color: MUTE, opacity: p }}>মাত্র</span>
          <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: big, lineHeight: 1, background: GOLDG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", transform: `scale(${0.4 + 0.6 * p})`, display: "inline-block", filter: `drop-shadow(0 0 ${30 + 40 * g}px ${GOLD}66)` }}>৳৯৯৯</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 34px", borderRadius: 26, background: "rgba(15,23,42,0.85)", border: `2px solid ${GOLD}88`, opacity: d, transform: `translateY(${(1 - d) * 40}px)` }}>
          <svg width="46" height="46" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke={GOLD} strokeWidth="2" /><path d="M3 10h18M8 3v4M16 3v4" stroke={GOLD} strokeWidth="2" strokeLinecap="round" /></svg>
          <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: pick(m, 48, 40, 44), color: TXT }}>৩০ নভেম্বর ২০২৬ পর্যন্ত</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: BODY, fontWeight: 700, fontSize: pick(m, 32, 28, 30), color: "#CBD5E1", opacity: lerp(f, sc.subsLine ? 96 : 66, sc.subsLine ? 110 : 80), textAlign: "center", padding: "0 50px" }}>
          <PlayLogo s={30} /> শুধু Google Play থেকে ডাউনলোড করে অ্যাপের ভেতরে পেমেন্টে</div>
        <div style={{ fontFamily: BODY, fontSize: pick(m, 26, 23, 24), color: "#94A3B8", opacity: lerp(f, sc.subsLine ? 100 : 70, sc.subsLine ? 114 : 84), textAlign: "center", padding: "0 60px" }}>নতুন সাবস্ক্রাইবারদের জন্য, প্রথম ৩ মাস · এরপর নিয়মিত দামে নবায়ন, যেকোনো সময় বাতিল করা যায়</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const m = useMode();
  const i = useIn(0, 11), b = useIn(14, 10), t = useIn(26, 12);
  const tap = (f - 50) % 45;
  const ring = tap >= 0 && f > 50 ? lerp(tap, 0, 30) : 0;
  const g = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <AbsoluteFill>
      <Backdrop hue={BLUE} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: pick(m, 34, 22, 24), paddingBottom: pick(m, 200, 0, 0) }}>
        <Img src={S("icon.png")} style={{ width: pick(m, 220, 170, 180), height: pick(m, 220, 170, 180), borderRadius: pick(m, 50, 40, 42), transform: `scale(${i}) rotate(${(1 - i) * -20}deg)`, boxShadow: `0 0 ${60 + 40 * g}px ${BLUE}AA` }} />
        <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: pick(m, 54, 46, 50), color: TXT, opacity: i }}>AI University: Online Courses</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: pick(m, 92, 76, 84), background: GOLDG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", opacity: t, transform: `translateY(${(1 - t) * 30}px)` }}>এখনই ডাউনলোড করুন</div>
        <div style={{ position: "relative", transform: `scale(${(0.7 + 0.3 * b) * (1 + 0.025 * Math.sin(f / 5))})`, opacity: b }}>
          <PlayBadge h={pick(m, 130, 110, 116)} />
          {ring > 0 ? <div style={{ position: "absolute", left: "62%", top: "55%", width: 60, height: 60, marginLeft: -30, marginTop: -30, borderRadius: 60, border: "5px solid #fff", opacity: 1 - ring, transform: `scale(${0.4 + ring * 1.8})` }} /> : null}
        </div>
        <div style={{ fontFamily: LAT, fontWeight: 600, fontSize: pick(m, 27, 24, 26), color: "#BFDBFE", opacity: lerp(f, 40, 55), padding: "10px 22px", borderRadius: 14, background: "rgba(15,23,42,0.7)" }}>play.google.com/store/apps/details?id=bd.aiuniversity.app</div>
        <div style={{ fontFamily: BODY, fontSize: pick(m, 26, 22, 22), color: "#64748B", opacity: lerp(f, 55, 70), textAlign: "center", padding: "0 60px" }}>অনলাইন দক্ষতা-প্রশিক্ষণ প্ল্যাটফর্ম · সার্টিফিকেট একাডেমিক ডিগ্রি নয়</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Render: React.FC<{ sc: Scene; len: number }> = ({ sc, len }) => {
  switch (sc.k) {
    case "hook": return <Hook len={len} />;
    case "terminal": return <TerminalScene sc={sc} />;
    case "feature": return <Feature sc={sc} len={len} />;
    case "montage": return <Montage sc={sc} len={len} />;
    case "why": return <WhyScene sc={sc} len={len} />;
    case "subs": return <Subs len={len} />;
    case "offer": return <Offer sc={sc} len={len} />;
    case "cta": return <Cta />;
  }
};
const SFX: Partial<Record<Scene["k"], string>> = { terminal: "whoosh", feature: "whoosh", montage: "whoosh", why: "shimmer", subs: "whoosh", offer: "boom", cta: "riser" };

const Wrap: React.FC<{ len: number; first: boolean; children: React.ReactNode }> = ({ len, first, children }) => {
  const f = useCurrentFrame();
  const i = first ? 1 : lerp(f, 0, 8), o = lerp(f, len - 6, len);
  return <AbsoluteFill style={{ opacity: Math.min(i, 1 - o), transform: `scale(${1.04 - 0.04 * i + 0.03 * o})`, filter: `blur(${(1 - i) * 10 + o * 12}px)` }}>{children}</AbsoluteFill>;
};

export const Launch: React.FC<{ cut: "long" | "short" }> = ({ cut }) => {
  const { durationInFrames } = useVideoConfig();
  const f = useCurrentFrame();
  const vol = 0.2;
  const music = Math.min(lerp(f, 0, 6, 0.05, vol), lerp(f, durationInFrames - 45, durationInFrames, vol, 0));
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={S("music.mp3")} volume={() => music} />
      {timeline(cut).map(({ id, sc, from, len, lead, vo }, i) => (
        <Sequence key={id} from={from} durationInFrames={len}>
          <Wrap len={len} first={i === 0}><Render sc={sc} len={len} /></Wrap>
          <Sequence from={lead}><Audio src={S(vo)} volume={1} /></Sequence>
          {SFX[sc.k] ? <Audio src={S(`sfx/${SFX[sc.k]}.mp3`)} volume={0.22} /> : null}
          {sc.k === "why" ? sc.items.map((_, j) => <Sequence key={j} from={22 + j * Math.min(40, (len - 52) / sc.items.length)} durationInFrames={20}><Audio src={S("sfx/tick.mp3")} volume={0.25} /></Sequence>) : null}
        </Sequence>
      ))}
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.45))" }} />
    </AbsoluteFill>
  );
};
