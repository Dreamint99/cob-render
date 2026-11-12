// Qount — doctor promo (2026-11-12). One engine, three cuts: QD-H 1920x1080 (~70 s), QD-F 1080x1350 (~60 s), QD-R 1080x1920 (≤30 s).
// Light mode, real app screenshots in phone/browser mockups + rebuilt animated UI (SMS, push, live queue, income board).
// Public dir work/qpub (shots/, vo/, vor/, fonts/, sfx/, music.mp3). VO: scripts/vo_batch.py work/qount/doctor/{script,reel}.json (Tanvir).
// Render: npx remotion render src/qount/entry.ts QD-H output/Qount/QD-H-raw.mp4 --public-dir=work/qpub
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, continueRender, delayRender } from "remotion";
import { Stethoscope, PhoneCall, Users, NotebookPen, Smartphone, Radio, BarChart3, Check, CheckCircle2, Clock, MessageSquareText, Mail, BellRing, Home, Wallet, Globe, QrCode, CalendarCheck, Search, Building2, MonitorSmartphone, Sparkles, Hand, ShieldCheck } from "lucide-react";
import DUR from "./durs.json";

/* ---------- brand ---------- */
export const INDIGO = "#4F46E5", INK = "#0F172A", MUTED = "#64748B", BG = "#F6F7FB", WHITE = "#FFFFFF", DOC = "#0369A1", GREEN = "#16A34A", RED = "#E11D48", BKASH = "#E2136E", AMBER = "#D97706";
export const GRAD = "linear-gradient(100deg,#A5A1FF 0%,#67E8F9 52%,#86EFAC 100%)";
export const F = "QAnek, 'Noto Sans Bengali', sans-serif", LAT = "QMan, Manrope, sans-serif";

if (typeof document !== "undefined") {
  const load = (fam: string, file: string, w: string) => {
    const h = delayRender("font " + file);
    const ff = new FontFace(fam, `url(${staticFile("fonts/" + file)})`, { weight: w });
    ff.load().then(() => { document.fonts.add(ff); continueRender(h); }).catch(() => continueRender(h));
  };
  for (const w of ["500", "600", "700", "800"]) load("QAnek", `AnekBangla-${w}.ttf`, w);
  for (const w of ["500", "700", "800"]) load("QMan", `Manrope-${w}.ttf`, w);
}

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
export const sp = (f: number, fps: number, d = 0, damping = 14) => spring({ frame: f - d, fps, config: { damping, mass: 0.8 } });
export const bn = (n: number | string) => String(n).replace(/\d/g, (x) => "০১২৩৪৫৬৭৮৯"[+x]);
export const money = (n: number) => bn(Math.round(n).toLocaleString("en-IN"));
export type Ic = React.FC<{ size?: number; color?: string; strokeWidth?: number }>;

/* ---------- scenes ---------- */
export type Kind = "hook" | "pain" | "serial" | "ticket" | "live" | "next" | "income" | "site" | "multi" | "calm" | "brand" | "end" | "slots" | "pay" | "approve" | "calendar" | "types";
export type Vis = React.FC<{ dur: number; pre?: boolean }>;
export type Biz = { pill?: string; accent: string; hello: string; helloHi: string[]; hookIcon: Ic; pain: [Ic, string, string][]; good: [Ic, string, string][]; painHead?: string; goodHead?: string; goodHi?: string[];
  calmIcon: Ic; calmHead: string; calmHi: string[]; calmSub?: string; first?: string; tagline: string; endShot: string; vis: Partial<Record<Kind, Vis>> };
export type Sc = { kind: Kind; vo: string; cap: string; head?: string; hi?: string[]; chips?: [Ic, string][]; color?: string; pre?: boolean };

const S: Record<string, Sc> = {
  hook: { kind: "hook", vo: "vo/01", cap: "হ্যালো ডাক্তার সাহেব, | আপনাকেই বলছি!" },
  pain: { kind: "pain", vo: "vo/02", cap: "সারাদিন সিরিয়ালের ফোন, | চেম্বারে রোগীর ভিড়, খাতায় হিসাব — | কেমন হয় যদি আপনার পুরো চেম্বার | অটোমেশন হয়ে যায়?" },
  serial: { kind: "serial", vo: "vo/03", cap: "রোগীরা আর ফোন করবে না। | মোবাইল থেকেই অনলাইনে সিরিয়াল নেবে — | নতুন রোগী আর ফলো-আপের ফি আলাদা।",
    head: "ফোন ছাড়াই অনলাইন সিরিয়াল", hi: ["অনলাইন", "সিরিয়াল"], color: DOC, chips: [[PhoneCall, "কল ধরার ঝামেলা নেই"], [Clock, "২৪ ঘণ্টা বুকিং"], [Wallet, "নতুন / ফলো-আপ ফি"]] },
  ticket: { kind: "ticket", vo: "vo/04", cap: "সাথে সাথে আপনার চেম্বারের নামে | SMS আর ইমেইলে টিকেট পৌঁছে যাবে।",
    head: "চেম্বারের নামে টিকেট", hi: ["চেম্বারের", "নামে"], color: INDIGO, chips: [[MessageSquareText, "SMS"], [Mail, "ইমেইল"], [QrCode, "QR টিকেট"]] },
  live: { kind: "live", vo: "vo/05", cap: "এখন কত নম্বর চলছে, | রোগী বাসায় বসেই দেখবে। | সিরিয়াল কাছে এলে নোটিফিকেশন পাবে — | চেম্বারে আর ভিড় নেই।",
    head: "বাসায় বসেই লাইভ সিরিয়াল", hi: ["লাইভ", "সিরিয়াল"], color: GREEN, chips: [[Radio, "এখন চলছে #৭"], [BellRing, "পালা এলে নোটিফিকেশন"], [Users, "চেম্বারে ভিড় নেই"]] },
  next: { kind: "next", vo: "vo/06", cap: "আর আপনি? | শুধু একটা বাটন — পরের রোগী।",
    head: "এক ট্যাপে পরের রোগী", hi: ["এক", "ট্যাপে"], color: DOC, chips: [[Hand, "এক ট্যাপ"], [BellRing, "রোগী নিজেই জানে"]] },
  income: { kind: "income", vo: "vo/07", cap: "আজকে কয়জন রোগী আসলো, | মাসে কত টাকা আয় হলো, | কোথায় টাকা গেলো — সব এক নজরে।",
    head: "রোগী আর আয় — এক নজরে", hi: ["আয়"], color: INDIGO, chips: [[Users, "দৈনিক রোগী"], [BarChart3, "মাসিক আয়"], [Wallet, "ক্যাশ · বিকাশ · বাকি"]] },
  site: { kind: "site", vo: "vo/08", cap: "বিকাশে অগ্রিম ফি, রিমাইন্ডার, | আর আপনার নিজের নামে ওয়েবসাইট আর QR কোড — | রোগীরা গুগলেই আপনাকে খুঁজে পাবে।",
    head: "নিজের নামে ওয়েবসাইট", hi: ["ওয়েবসাইট"], color: DOC, chips: [[Wallet, "বিকাশে অগ্রিম ফি"], [BellRing, "রিমাইন্ডার"], [Globe, "SEO ওয়েবসাইট + QR"]] },
  multi: { kind: "multi", vo: "vo/09", cap: "অ্যাপ আর ওয়েবসাইট — দুটোতেই চলে। | এক অ্যাকাউন্টেই একাধিক চেম্বার।",
    head: "অ্যাপ + ওয়েব, একাধিক চেম্বার", hi: ["অ্যাপ", "ওয়েব,"], color: INDIGO, chips: [[MonitorSmartphone, "মোবাইল · কম্পিউটার"], [Building2, "সব চেম্বার এক অ্যাকাউন্টে"]] },
  calm: { kind: "calm", vo: "vo/10", cap: "আপনাকে শুধু রোগী দেখতে হবে, | বাকি সব সামলাবে Qount।" },
  brand: { kind: "brand", vo: "vo/11", cap: "Qount — বাংলাদেশের সুপার বুকিং অ্যাপ। | একবার ট্রাই করে দেখুন — ৩ দিন সম্পূর্ণ ফ্রি।" },
  end: { kind: "end", vo: "vo/12", cap: "ডাউনলোড করুন Qount অ্যাপ, | অথবা ভিজিট করুন qount.dreamithq.com" },
};
const FULL: Sc[] = [S.hook, S.pain, S.serial, S.ticket, S.live, S.next, S.income, S.site, S.multi, S.calm, S.brand, S.end];
const FEED: Sc[] = [S.hook, S.pain, S.serial, S.ticket, S.live, S.income, S.site, S.calm, S.brand, S.end];
const REEL: Sc[] = [
  { ...S.hook, vo: "vor/01" },
  { ...S.ticket, vo: "vor/02", pre: true, head: "ফোন ছাড়াই সিরিয়াল, SMS-এ টিকেট", hi: ["সিরিয়াল,", "টিকেট"], chips: [[Smartphone, "অনলাইন সিরিয়াল"], [MessageSquareText, "SMS টিকেট"]], cap: "রোগীরা ফোন ছাড়াই অনলাইনে সিরিয়াল নেবে, | SMS-এ টিকেট পাবে।" },
  { ...S.live, vo: "vor/03", chips: [[Radio, "লাইভ সিরিয়াল"], [Users, "ভিড় নেই"]], cap: "এখন কত নম্বর চলছে — | রোগী বাসায় বসেই দেখবে। | চেম্বারে আর ভিড় নেই।" },
  { ...S.income, vo: "vor/04", chips: [[Users, "দৈনিক রোগী"], [BarChart3, "মাসিক আয়"]], cap: "দিনে কয়জন রোগী, | মাসে কত আয় — সব এক নজরে।" },
  { ...S.calm, vo: "vor/05", cap: "আপনি শুধু রোগী দেখুন, | বাকি সব সামলাবে Qount।" },
  { ...S.end, vo: "vor/06", cap: "৩ দিন সম্পূর্ণ ফ্রি — | আজই Qount অ্যাপ ডাউনলোড করুন।" },
];

export const LEAD = 8, TAIL = 10;
export type T = { i: number; from: number; len: number; dur: number };
export const timeline = (sc: Sc[], durOf: (s: Sc) => number, endHold: number): T[] => {
  let at = 0;
  return sc.map((s, i) => {
    const dur = Math.round(durOf(s) * 30);
    const len = dur + (i === 0 ? 12 : LEAD) + TAIL + (i === sc.length - 1 ? endHold : 0);
    const it = { i, from: at, len, dur }; at += len; return it;
  });
};
export const dOf = (s: Sc) => (DUR as Record<string, number>)[s.vo];
const TLH = timeline(FULL, dOf, 100), TLF = timeline(FEED, dOf, 90), TLR = timeline(REEL, dOf, 75);
export const total = (tl: T[]) => tl[tl.length - 1].from + tl[tl.length - 1].len;
export const QD_TOTAL = { H: total(TLH), F: total(TLF), R: total(TLR) };

export type Ctx = { SC: Sc[]; TL: T[]; B: Biz };
const C = React.createContext<Ctx>({ SC: [], TL: [], B: null as unknown as Biz });
export const useB = () => React.useContext(C).B;
type Mode = "h" | "f" | "v";
const useMode = (): Mode => { const { width: W, height: H } = useVideoConfig(); return W > H ? "h" : H / W > 1.5 ? "v" : "f"; };
const voStart = (t: T) => t.from + (t.i === 0 ? 12 : LEAD);

/* layout per mode */
const L = {
  h: { text: { left: 120, top: 190, width: 800 }, stage: { cx: 1390, cy: 488, u: 1.05 }, head: 92, chip: 34, cap: { bottom: 44, size: 42 } },
  f: { text: { left: 60, top: 92, width: 960 }, stage: { cx: 540, cy: 772, u: 0.95 }, head: 66, chip: 28, cap: { bottom: 42, size: 38 } },
  v: { text: { left: 60, top: 170, width: 960 }, stage: { cx: 540, cy: 1010, u: 1.17 }, head: 84, chip: 34, cap: { bottom: 250, size: 44 } },
};

/* ---------- backdrop ---------- */
const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const drift = Math.sin(f / 90) * 50;
  const grid = 56;
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", left: W * 0.72 - 650 + drift, top: H * 0.35 - 650, background: "radial-gradient(circle, #A5A1FF55 0%, #A5A1FF00 62%)" }} />
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", left: -380 - drift, top: H - 640, background: "radial-gradient(circle, #67E8F944 0%, #67E8F900 62%)" }} />
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", left: W * 0.25 - 450, top: -520 + drift, background: "radial-gradient(circle, #86EFAC40 0%, #86EFAC00 62%)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
        {Array.from({ length: Math.ceil(W / grid) + 1 }, (_, i) => Array.from({ length: Math.ceil(H / grid) + 1 }, (_, j) => (
          <circle key={i + "-" + j} cx={i * grid + ((f * 0.25) % grid)} cy={j * grid} r={1.5} fill="#CBD2EA" />
        )))}
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- small pieces ---------- */
export const Logo: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.27, background: "#0B0B12", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 ${size * 0.12}px ${size * 0.3}px rgba(15,23,42,.28)`, ...style }}>
    <span style={{ fontFamily: LAT, fontWeight: 800, fontSize: size * 0.66, color: WHITE, lineHeight: 1, marginTop: -size * 0.04 }}>Q</span>
  </div>
);

export const Words: React.FC<{ text: string; size: number; d: number; color?: string; hi?: string[]; hiColor?: string; align?: "left" | "center"; weight?: number }> = ({ text, size, d, color = INK, hi = [], hiColor = INDIGO, align = "left", weight = 800 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: F, fontWeight: weight, fontSize: size, lineHeight: 1.22, color, textAlign: align, letterSpacing: -0.5 }}>
      {text.split(" ").map((w, i) => {
        const s = sp(f, fps, d + i * 3, 13);
        return <span key={i} style={{ display: "inline-block", marginRight: size * 0.22, transform: `translateY(${(1 - s) * size * 0.55}px)`, opacity: s, color: hi.includes(w) ? hiColor : undefined }}>{w}</span>;
      })}
    </div>
  );
};

export const Chip: React.FC<{ icon: Ic; label: string; color: string; d: number; size: number }> = ({ icon: I, label, color, d, size }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(f, fps, d, 12);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.24}px ${size * 0.7}px ${size * 0.24}px ${size * 0.24}px`, background: WHITE,
      boxShadow: "0 10px 28px rgba(15,23,42,.08)", border: "1.5px solid #E5E8F2", borderRadius: 999, transform: `translateY(${(1 - s) * 30}px) scale(${0.85 + 0.15 * s})`, opacity: s }}>
      <div style={{ width: size * 1.55, height: size * 1.55, borderRadius: 999, background: color + "1F", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <I size={size * 0.85} color={color} strokeWidth={2.4} />
      </div>
      <span style={{ fontFamily: F, fontWeight: 700, fontSize: size, color: INK, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
};

/* stage: every visual is drawn in a 900x800 box, scaled and centred per mode */
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const m = useMode();
  const { cx, cy, u } = L[m].stage;
  return <div style={{ position: "absolute", left: cx - 450, top: cy - 400, width: 900, height: 800, transform: `scale(${u})` }}>{children}</div>;
};

/* phone: screenshot(s) in 1080x2400 space, with overlays in the same space */
const PH = 740;
export const Phone: React.FC<{ x: number; y: number; h?: number; screens: { src: string; at: number }[]; children?: React.ReactNode; d?: number; tilt?: number }> = ({ x, y, h = PH, screens, children, d = 0, tilt = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bez = Math.round(h * 0.016);
  const sh = h - 2 * bez, sw = Math.round(sh * 1080 / 2400), w = sw + 2 * bez;
  const k = sw / 1080;
  const e = sp(f, fps, d, 15);
  const float = Math.sin((f + d * 3) / 40) * 6;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `translateY(${(1 - e) * 260 + float}px) rotate(${tilt + (1 - e) * 6}deg)`, opacity: e }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: h * 0.075, background: "linear-gradient(145deg,#2b3040,#0c0e15)", boxShadow: "0 40px 90px rgba(15,23,42,.28), 0 0 0 2px #4a5068 inset" }} />
      <div style={{ position: "absolute", left: bez, top: bez, width: sw, height: sh, borderRadius: h * 0.062, overflow: "hidden", background: WHITE }}>
        {screens.map((s, i) => {
          const o = i === 0 ? 1 : interpolate(f, [s.at, s.at + 8], [0, 1], clamp);
          return <Img key={i} src={staticFile(s.src)} style={{ position: "absolute", inset: 0, width: sw, height: sh, opacity: o }} />;
        })}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 2400, transform: `scale(${k})`, transformOrigin: "0 0" }}>{children}</div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: bez + h * 0.012, width: h * 0.02, height: h * 0.02, marginLeft: -h * 0.01, borderRadius: 99, background: "#08080c" }} />
    </div>
  );
};

/* tap ripple, in phone (1080x2400) coordinates */
export const Tap: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < -10 || t > 26) return null;
  const app = interpolate(t, [-10, 0], [0, 1], clamp);
  const r = interpolate(t, [0, 18], [30, 150], clamp);
  const o = interpolate(t, [0, 22], [0.55, 0], clamp);
  const press = t >= 0 && t < 6 ? 0.85 : 1;
  return (
    <>
      <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: 999, background: INDIGO, opacity: t >= 0 ? o : 0 }} />
      <div style={{ position: "absolute", left: x - 42, top: y - 42, width: 84, height: 84, borderRadius: 999, background: "rgba(15,23,42,.35)", border: "5px solid rgba(255,255,255,.9)", opacity: app * interpolate(t, [14, 26], [1, 0], clamp), transform: `scale(${press})` }} />
    </>
  );
};

/* rebuilt Android push banner over the phone's own banner area */
export const Push: React.FC<{ title: string; body: string; at: number; cover?: boolean }> = ({ title, body, at, cover = true }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(f, fps, at, 15);
  return (
    <>
      {cover && <div style={{ position: "absolute", left: 0, top: 110, width: 1080, height: 250, background: "#ECECEE" }} />}
      <div style={{ position: "absolute", left: 42, top: 150, width: 996, height: 220, borderRadius: 64, background: "#E9E8F2", boxShadow: "0 20px 50px rgba(0,0,0,.18)", transform: `translateY(${(1 - s) * -330}px)`, display: "flex", alignItems: "center", gap: 30, padding: "0 44px" }}>
        <div style={{ width: 76, height: 76, borderRadius: 99, background: INDIGO, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LAT, fontWeight: 800, fontSize: 40, color: WHITE }}>Q</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 40, color: INK }}>{title} <span style={{ fontFamily: LAT, fontWeight: 500, fontSize: 32, color: MUTED }}>· now</span></div>
          <div style={{ fontFamily: F, fontWeight: 500, fontSize: 36, color: "#334155" }}>{body}</div>
        </div>
      </div>
    </>
  );
};

export const Card: React.FC<{ x: number; y: number; w: number; d: number; children: React.ReactNode; from?: "l" | "r" | "b"; style?: React.CSSProperties }> = ({ x, y, w, d, children, from = "r", style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(f, fps, d, 14);
  const dx = from === "r" ? 80 : from === "l" ? -80 : 0, dy = from === "b" ? 80 : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, background: WHITE, borderRadius: 26, border: "1.5px solid #E5E8F2", boxShadow: "0 24px 60px rgba(15,23,42,.12)",
      transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy}px) scale(${0.9 + 0.1 * s})`, opacity: s, ...style }}>{children}</div>
  );
};

export const Browser: React.FC<{ x: number; y: number; w: number; src: string; ratio: number; url: string; d: number; scroll?: number }> = ({ x, y, w, src, ratio, url, d, scroll = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(f, fps, d, 15);
  const bar = 44, ih = w / ratio;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, borderRadius: 18, overflow: "hidden", background: WHITE, boxShadow: "0 34px 80px rgba(15,23,42,.2)", border: "1.5px solid #DDE2EE",
      transform: `translateY(${(1 - s) * 120}px) scale(${0.92 + 0.08 * s})`, opacity: s }}>
      <div style={{ height: bar, background: "#EEF1F7", display: "flex", alignItems: "center", gap: 9, padding: "0 16px" }}>
        {["#F87171", "#FBBF24", "#34D399"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />)}
        <div style={{ marginLeft: 14, flex: 1, height: 28, borderRadius: 99, background: WHITE, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontFamily: LAT, fontWeight: 600, fontSize: 16, color: "#475569" }}>
          <ShieldCheck size={15} color={GREEN} />{url}
        </div>
      </div>
      <div style={{ height: ih, overflow: "hidden", position: "relative" }}>
        <Img src={staticFile(src)} style={{ width: w, position: "absolute", top: -scroll }} />
      </div>
    </div>
  );
};

/* ---------- text block (headline + chips) for feature scenes ---------- */
const TextBlock: React.FC<{ s: Sc; len: number }> = ({ s, len }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = useMode();
  const lay = L[m];
  const out = interpolate(f, [len - 8, len], [1, 0], clamp);
  const bar = sp(f, fps, 2, 14);
  const center = m !== "h";
  return (
    <div style={{ position: "absolute", ...lay.text, display: "flex", flexDirection: "column", gap: m === "h" ? 26 : 18, alignItems: center ? "center" : "flex-start", opacity: out }}>
      <div style={{ height: 8, width: interpolate(bar, [0, 1], [0, 120]), borderRadius: 8, background: GRAD }} />
      <Words text={s.head!} size={lay.head} d={4} hi={s.hi} hiColor={s.color} align={center ? "center" : "left"} />
      <div style={{ display: "flex", flexDirection: m === "h" ? "column" : "row", flexWrap: "wrap", justifyContent: "center", alignItems: center ? "center" : "flex-start", gap: m === "h" ? 18 : 12, marginTop: m === "h" ? 10 : 2 }}>
        {s.chips!.map(([I, l], i) => <Chip key={i} icon={I} label={l} color={s.color!} d={16 + i * 9} size={lay.chip} />)}
      </div>
    </div>
  );
};

/* ---------- visuals ---------- */
const HookScene: React.FC<{ len: number }> = ({ len }) => {
  const B = useB();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = useMode();
  const out = interpolate(f, [len - 8, len], [1, 0], clamp);
  const a = sp(f, fps, 0, 10);
  const wave = Math.sin(f / 3.2) * 14 * (1 - lerp(f, 30, 60));
  const big = m === "h" ? 128 : m === "f" ? 104 : 116;
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: m === "h" ? 26 : 30 }}>
      <div style={{ position: "relative", transform: `scale(${a})` }}>
        <div style={{ width: 230, height: 230, borderRadius: 999, background: WHITE, boxShadow: "0 30px 80px rgba(79,70,229,.25)", display: "flex", alignItems: "center", justifyContent: "center", border: "6px solid #E0E7FF" }}>
          <B.hookIcon size={130} color={B.accent} strokeWidth={1.9} />
        </div>
        <div style={{ position: "absolute", right: -40, top: -20, width: 110, height: 110, borderRadius: 999, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${wave}deg)`, boxShadow: "0 12px 30px rgba(0,0,0,.12)" }}>
          <Hand size={62} color={AMBER} strokeWidth={2.2} />
        </div>
      </div>
      <Words text={B.hello} size={big} d={6} align="center" hi={B.helloHi} hiColor={B.accent} />
      <div style={{ opacity: lerp(f, 26, 40), transform: `scale(${0.8 + 0.2 * sp(f, fps, 26, 10)})`, padding: "8px 44px 14px", borderRadius: 999, background: GRAD }}>
        <span style={{ fontFamily: F, fontWeight: 800, fontSize: big * 0.72, color: INK }}>{B.pill || "আপনাকেই বলছি!"}</span>
      </div>
    </AbsoluteFill>
  );
};

const PainScene: React.FC<{ len: number; dur: number }> = ({ len, dur }) => {
  const B = useB();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = useMode();
  const out = interpolate(f, [len - 8, len], [1, 0], clamp);
  const flipAt = LEAD + Math.round(dur * 0.5);
  const { pain, good } = B;
  const row = m === "h";
  const cw = row ? 470 : m === "f" ? 820 : 880, ch = row ? 330 : m === "f" ? 210 : 250;
  const flipped = f >= flipAt;
  const head = flipped ? (B.goodHead || "পুরো চেম্বার অটোমেশন!") : (B.painHead || "রোজকার ঝামেলা?");
  const hs = m === "h" ? 96 : m === "f" ? 70 : 84;
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: m === "h" ? 60 : m === "f" ? 34 : 50, paddingBottom: m === "v" ? 140 : m === "f" ? 70 : 60 }}>
      <div key={head} style={{ height: hs * 1.3 }}>
        <Words text={head} size={hs} d={flipped ? flipAt : 4} align="center" hi={B.goodHi || ["অটোমেশন!"]} hiColor={INDIGO} color={flipped ? INK : RED} />
      </div>
      <div style={{ display: "flex", flexDirection: row ? "row" : "column", gap: row ? 36 : m === "f" ? 22 : 30 }}>
        {pain.map((p, i) => {
          const e = sp(f, fps, 8 + i * 10, 13);
          const fl = interpolate(f, [flipAt + i * 6, flipAt + i * 6 + 14], [0, 180], { ...clamp, easing: Easing.inOut(Easing.cubic) });
          const showGood = fl > 90;
          const [I, t1, t2] = showGood ? good[i] : p;
          const col = showGood ? GREEN : RED;
          const shake = !showGood && i === 0 ? Math.sin(f * 1.9) * 4 * (f % 30 < 18 ? 1 : 0) : 0;
          return (
            <div key={i} style={{ width: cw, height: ch, borderRadius: 30, background: WHITE, border: `2px solid ${col}33`, boxShadow: "0 24px 60px rgba(15,23,42,.10)",
              display: "flex", flexDirection: row ? "column" : "row", alignItems: "center", justifyContent: row ? "center" : "flex-start", gap: row ? 18 : 34, padding: row ? 0 : "0 44px",
              transform: `perspective(1200px) rotateY(${showGood ? fl - 180 : fl}deg) translateY(${(1 - e) * 70}px)`, opacity: e }}>
              <div style={{ width: row ? 120 : ch * 0.55, height: row ? 120 : ch * 0.55, borderRadius: 999, background: col + "18", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${shake}deg)`, position: "relative" }}>
                <I size={row ? 62 : ch * 0.28} color={col} strokeWidth={2.2} />
                {showGood && <div style={{ position: "absolute", right: -6, bottom: -6, width: 44, height: 44, borderRadius: 99, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #fff" }}><Check size={24} color="#fff" strokeWidth={3.5} /></div>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: row ? "center" : "flex-start", gap: 4 }}>
                <span style={{ fontFamily: F, fontWeight: 800, fontSize: row ? 46 : m === "f" ? 46 : 54, color: INK }}>{t1}</span>
                <span style={{ fontFamily: F, fontWeight: 600, fontSize: row ? 32 : m === "f" ? 32 : 36, color: col, textDecoration: showGood ? "none" : "none" }}>{t2}</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const SerialVis: React.FC<{ dur: number }> = ({ dur }) => {
  const sw = LEAD + Math.round(dur * 0.42);
  return (
    <Stage>
      <Phone x={300} y={400} screens={[{ src: "shots/pick.png", at: 0 }, { src: "shots/day.png", at: sw }]} d={2}>
        <Tap x={540} y={528} at={sw - 16} />
        <Tap x={290} y={582} at={sw + 22} />
        <Tap x={540} y={805} at={sw + 52} />
      </Phone>
      <Card x={560} y={150} w={330} d={sw + 14}>
        <div style={{ padding: "22px 26px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 26, color: MUTED }}>নতুন রোগী</span>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 48, color: DOC }}>৳৮০০</span>
          </div>
          <CheckCircle2 size={46} color={DOC} />
        </div>
      </Card>
      <Card x={600} y={300} w={300} d={sw + 26}>
        <div style={{ padding: "20px 26px", display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: F, fontWeight: 600, fontSize: 26, color: MUTED }}>ফলো-আপ</span>
          <span style={{ fontFamily: F, fontWeight: 800, fontSize: 44, color: INK }}>৳৫০০</span>
        </div>
      </Card>
      <Card x={540} y={470} w={350} d={sw + 56} from="b">
        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: GREEN + "1C", display: "flex", alignItems: "center", justifyContent: "center" }}><CalendarCheck size={36} color={GREEN} /></div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 34, color: INK }}>সিরিয়াল #৭</span>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 24, color: MUTED }}>আজ · আনুমানিক ৫:০০ PM</span>
          </div>
        </div>
      </Card>
    </Stage>
  );
};

export const TicketVis: React.FC<{ dur: number; pre?: boolean }> = ({ dur, pre }) => {
  const f = useCurrentFrame();
  const sw = pre ? LEAD + Math.round(dur * 0.38) : 0;
  const pushAt = sw + 10;
  return (
    <Stage>
      <Phone x={270} y={400} screens={pre ? [{ src: "shots/day.png", at: 0 }, { src: "shots/ticket.png", at: sw }] : [{ src: "shots/ticket.png", at: 0 }]} d={2}>
        {pre && <Tap x={540} y={805} at={sw - 30} />}
        {pre && <Tap x={770} y={2236} at={sw - 8} />}
        <div style={{ opacity: pre ? interpolate(f, [sw, sw + 8], [0, 1], clamp) : 1 }}>
          <Push title="আপনার বুকিং কনফার্ম ✓" body="শেফা মেডিকেল চেম্বার · #৭ · আজ ৫:০০ PM" at={pushAt} />
        </div>
      </Phone>
      <Card x={500} y={120} w={400} d={pushAt + 12}>
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 99, background: DOC, display: "flex", alignItems: "center", justifyContent: "center" }}><MessageSquareText size={28} color="#fff" /></div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: LAT, fontWeight: 800, fontSize: 24, color: INK, letterSpacing: 0.5 }}>SHEFA-CHMBR</span>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: 20, color: GREEN }}>চেম্বারের নিজের নামে SMS</span>
            </div>
          </div>
          <div style={{ background: "#EEF2FF", borderRadius: "6px 22px 22px 22px", padding: "14px 18px", fontFamily: F, fontWeight: 600, fontSize: 25, color: INK, lineHeight: 1.4 }}>
            আপনার সিরিয়াল <b style={{ color: DOC }}>#৭</b> কনফার্ম। ডা. করিম আহমেদ, আজ আনুমানিক ৫:০০ PM। টিকেট: <span style={{ fontFamily: LAT, fontWeight: 700 }}>QT-9V7XR</span>
          </div>
        </div>
      </Card>
      <Card x={540} y={430} w={360} d={pushAt + 30}>
        <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: AMBER + "1E", display: "flex", alignItems: "center", justifyContent: "center" }}><Mail size={30} color={AMBER} /></div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 26, color: INK }}>ইমেইলে টিকেট</span>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 21, color: MUTED }}>QR কোডসহ টিকেট</span>
          </div>
        </div>
      </Card>
      <Card x={560} y={590} w={320} d={pushAt + 44} from="b">
        <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <QrCode size={54} color={INK} />
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 24, color: INK }}>কাউন্টারে QR দেখান</span>
        </div>
      </Card>
    </Stage>
  );
};

export const LiveVis: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pushAt = LEAD + Math.round(dur * 0.48);
  const step = LEAD + Math.round(dur * 0.2);
  const now = f < step ? 5 : f < step + 30 ? 6 : 7;
  const bump = sp(f, fps, f < step ? 0 : f < step + 30 ? step : step + 30, 9);
  return (
    <Stage>
      <Phone x={630} y={400} screens={[{ src: "shots/push.png", at: 0 }]} d={2} tilt={2}>
        <Push title="আপনার আগে ১ জন" body="সিরিয়াল #৭ · এখনই রওনা দিন" at={pushAt} />
      </Phone>
      <Card x={0} y={150} w={400} d={10} from="l">
        <div style={{ padding: "26px 30px", background: "linear-gradient(150deg,#0369A1,#0B3B66)", borderRadius: 26, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 14, height: 14, borderRadius: 99, background: "#4ADE80", opacity: 0.5 + 0.5 * Math.sin(f / 4) }} />
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 28, color: "#CFE8FF" }}>লাইভ · এখন চলছে</span>
          </div>
          <span style={{ fontFamily: F, fontWeight: 800, fontSize: 150, color: WHITE, lineHeight: 1.05, transform: `scale(${0.8 + 0.2 * bump})`, transformOrigin: "left center", display: "inline-block" }}>#{bn(now)}</span>
          <span style={{ fontFamily: F, fontWeight: 600, fontSize: 26, color: "#CFE8FF" }}>ডা. করিম আহমেদ · মেডিসিন</span>
        </div>
      </Card>
      <Card x={30} y={480} w={360} d={26} from="l">
        <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: GREEN + "1C", display: "flex", alignItems: "center", justifyContent: "center" }}><Home size={34} color={GREEN} /></div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 28, color: INK }}>বাসায় বসেই দেখুন</span>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 22, color: MUTED }}>আপনার সিরিয়াল #৭</span>
          </div>
        </div>
      </Card>
    </Stage>
  );
};

export const NextVis: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tap = LEAD + Math.round(dur * 0.45);
  const adv = sp(f, fps, tap + 4, 14);
  const rows: [string, string, string][] = [["#৫", "সম্পন্ন", GREEN], ["#৬", "এখন চলছে", DOC], ["#৭", "নোটিফিকেশন গেছে", INDIGO], ["#৮", "অপেক্ষায়", MUTED]];
  return (
    <Stage>
      <Phone x={280} y={400} screens={[{ src: "shots/queue.png", at: 0 }]} d={2}>
        <Tap x={540} y={1404} at={tap} />
      </Phone>
      <div style={{ position: "absolute", left: 520, top: 170, width: 370, height: 460, overflow: "hidden" }}>
        {rows.map(([n, t, c], i) => {
          const y = i * 115 - adv * 115 + 115;
          const e = sp(f, fps, 8 + i * 6, 14);
          const active = (adv > 0.5 ? i === 1 : i === 0);
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: y, width: 360, height: 96, borderRadius: 22, background: active ? DOC : WHITE, border: "1.5px solid #E5E8F2", boxShadow: "0 14px 34px rgba(15,23,42,.08)",
              display: "flex", alignItems: "center", gap: 18, padding: "0 22px", opacity: e * interpolate(y, [-60, 0], [0, 1], clamp), transform: `translateX(${(1 - e) * 60}px)` }}>
              <span style={{ fontFamily: F, fontWeight: 800, fontSize: 40, color: active ? WHITE : INK }}>{n}</span>
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 26, color: active ? "#DBEAFE" : c }}>{active ? "এখন চলছে" : i === 0 || (adv > 0.5 && i === 0) ? "সম্পন্ন" : t}</span>
              {i === 0 && adv > 0.5 && <CheckCircle2 size={30} color={GREEN} style={{ marginLeft: "auto" }} />}
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

export type Stat = [string, number, string, string, Ic];
export const IncomeVis: React.FC<{ dur: number; name?: string; stats?: Stat[] }> = ({ dur, name = "শেফা মেডিকেল চেম্বার", stats = [["আজকের রোগী", 24, "", DOC, Users], ["এই মাসের আয়", 186400, "৳", INDIGO, Wallet], ["বাকি আদায়", 3200, "৳", AMBER, Clock]] }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c1 = lerp(f, 12, 50), c2 = lerp(f, 22, 70);
  const bars = [52, 64, 48, 80, 71, 90, 100];
  const days = ["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "আজ"];
  const pie: [string, number, string][] = [["ক্যাশ", 58, DOC], ["বিকাশ", 34, BKASH], ["বাকি", 8, AMBER]];
  const pr = lerp(f, 34, 80);
  let acc = 0;
  const R = 70, CIR = 2 * Math.PI * R;
  return (
    <Stage>
      <Card x={0} y={40} w={900} d={2} from="b" style={{ borderRadius: 34 }}>
        <div style={{ padding: 34, display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Logo size={46} />
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 32, color: INK }}>{name}</span>
            <span style={{ marginLeft: "auto", fontFamily: F, fontWeight: 700, fontSize: 22, color: GREEN, background: GREEN + "18", padding: "4px 14px", borderRadius: 99 }}>● লাইভ</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {stats.map(([l, n, pre, c, I], i) => [l, pre + money(n * (i === 0 ? c1 : c2)), c, I] as [string, string, string, Ic]).map(([l, v, c, I], i) => (
              <div key={i} style={{ flex: i === 1 ? 1.5 : 1, background: (c as string) + "10", borderRadius: 22, padding: "18px 22px", display: "flex", flexDirection: "column", gap: 6, opacity: sp(f, fps, 6 + i * 6) }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><I size={26} color={c} /><span style={{ fontFamily: F, fontWeight: 700, fontSize: 24, color: MUTED }}>{l}</span></div>
                <span style={{ fontFamily: F, fontWeight: 800, fontSize: 54, color: INK }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 28, alignItems: "flex-end" }}>
            <div style={{ flex: 1.6, display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 24, color: MUTED }}>গত ৭ দিনের আয়</span>
              <div style={{ height: 210, display: "flex", alignItems: "flex-end", gap: 16 }}>
                {bars.map((b, i) => {
                  const g = sp(f, fps, 24 + i * 4, 15);
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{ width: "100%", height: 170 * b / 100 * g, borderRadius: 10, background: i === 6 ? INDIGO : "#C7D2FE" }} />
                      <span style={{ fontFamily: F, fontWeight: 600, fontSize: 19, color: MUTED }}>{days[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 18 }}>
              <svg width={170} height={170} viewBox="0 0 170 170" style={{ transform: "rotate(-90deg)" }}>
                <circle cx={85} cy={85} r={R} fill="none" stroke="#EEF1F7" strokeWidth={26} />
                {pie.map(([, p, c], i) => {
                  const len = CIR * p / 100 * pr; const off = -CIR * acc / 100 * pr; acc += p;
                  return <circle key={i} cx={85} cy={85} r={R} fill="none" stroke={c} strokeWidth={26} strokeDasharray={`${len} ${CIR}`} strokeDashoffset={off} />;
                })}
              </svg>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {pie.map(([l, p, c], i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, opacity: lerp(f, 40 + i * 6, 52 + i * 6) }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: c }} />
                    <span style={{ fontFamily: F, fontWeight: 700, fontSize: 23, color: INK }}>{l} {bn(p)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Stage>
  );
};

export const SiteVis: React.FC<{ dur: number; q?: string; src?: string; url?: string; qr?: string; c1?: [Ic | null, string, string, string] }> = ({ dur, q = "মিরপুরে মেডিসিন ডাক্তার সিরিয়াল", src = "shots/site.jpg", url = "qount.dreamithq.com/seba-medical", qr = "চেম্বারের QR", c1 = [null, "বিকাশে অগ্রিম ফি", "✓ পেমেন্ট পাওয়া গেছে", BKASH] }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C1 = c1[0];
  const typed = Math.floor(interpolate(f, [10, 40], [0, q.length], clamp));
  const sb = sp(f, fps, 2, 14);
  const late = LEAD + Math.round(dur * 0.12);
  return (
    <Stage>
      <div style={{ position: "absolute", left: 120, top: 0, width: 660, height: 76, borderRadius: 99, background: WHITE, border: "1.5px solid #DDE2EE", boxShadow: "0 18px 40px rgba(15,23,42,.10)", display: "flex", alignItems: "center", gap: 16, padding: "0 28px", opacity: sb, transform: `translateY(${(1 - sb) * -40}px)` }}>
        <Search size={32} color={INDIGO} />
        <span style={{ fontFamily: F, fontWeight: 600, fontSize: 30, color: INK }}>{q.slice(0, typed)}<span style={{ opacity: f % 16 < 8 ? 1 : 0, color: INDIGO }}>|</span></span>
      </div>
      <Browser x={40} y={110} w={820} src={src} ratio={2160 / 1282} url={url} d={late} scroll={interpolate(f, [late + 30, late + 140], [0, 40], clamp)} />
      <Card x={-30} y={560} w={330} d={late + 34} from="l">
        <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 58, height: 58, borderRadius: 16, background: c1[3], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 800, fontSize: 30, color: "#fff" }}>{C1 ? <C1 size={32} color="#fff" /> : "৳"}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 27, color: INK }}>{c1[1]}</span>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 21, color: GREEN }}>{c1[2]}</span>
          </div>
        </div>
      </Card>
      <Card x={330} y={610} w={270} d={late + 48} from="b">
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <BellRing size={40} color={AMBER} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 25, color: INK }}>রিমাইন্ডার</span>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 20, color: MUTED }}>আগের দিন অটো SMS</span>
          </div>
        </div>
      </Card>
      <Card x={650} y={500} w={230} d={late + 62} from="r">
        <div style={{ padding: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <QrCode size={150} color={INK} strokeWidth={1.6} />
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 22, color: INK }}>{qr}</span>
        </div>
      </Card>
    </Stage>
  );
};

export const MultiVis: React.FC<{ dur: number; src?: string; ratio?: number; phone?: string; pills?: string[] }> = ({ dur, src = "shots/dashq.jpg", ratio = 800 / 537, phone = "shots/queue.png", pills = ["ধানমন্ডি চেম্বার", "মিরপুর চেম্বার"] }) => {
  const f = useCurrentFrame();
  const sel = f < LEAD + dur * 0.55 ? 0 : 1;
  return (
    <Stage>
      <Browser x={0} y={140} w={700} src={src} ratio={ratio} url="qount.dreamithq.com/dashboard" d={2} />
      <Phone x={760} y={440} h={620} screens={[{ src: phone, at: 0 }]} d={10} tilt={3} />
      <div style={{ position: "absolute", left: 60, top: 30, display: "flex", gap: 14 }}>
        {pills.map((l, i) => {
          const s = spring({ frame: f - 14 - i * 6, fps: 30, config: { damping: 13 } });
          const on = sel === i;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 24px", borderRadius: 99, background: on ? INDIGO : WHITE, border: "1.5px solid #DDE2EE", boxShadow: "0 12px 30px rgba(15,23,42,.10)", opacity: s, transform: `scale(${0.8 + 0.2 * s})` }}>
              <Building2 size={28} color={on ? WHITE : INDIGO} />
              <span style={{ fontFamily: F, fontWeight: 800, fontSize: 28, color: on ? WHITE : INK }}>{l}</span>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

const CalmScene: React.FC<{ len: number }> = ({ len }) => {
  const B = useB();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = useMode();
  const out = interpolate(f, [len - 8, len], [1, 0], clamp);
  const icons: [Ic, string][] = [[CalendarCheck, DOC], [MessageSquareText, INDIGO], [BellRing, AMBER], [Wallet, BKASH], [Globe, GREEN], [QrCode, INK]];
  const R = m === "h" ? 250 : 270;
  const cy = m === "h" ? 360 : m === "f" ? 470 : 640;
  const lg = sp(f, fps, 2, 11);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", left: "50%", top: cy, width: 0, height: 0 }}>
        <div style={{ position: "absolute", left: -R, top: -R, width: 2 * R, height: 2 * R, borderRadius: 999, border: "2px dashed #C7D2FE", opacity: lg }} />
        {icons.map(([I, c], i) => {
          const a = (i / icons.length) * Math.PI * 2 + f / 70;
          const s = sp(f, fps, 8 + i * 4, 12);
          return (
            <div key={i} style={{ position: "absolute", left: Math.cos(a) * R * s - 48, top: Math.sin(a) * R * s - 48, width: 96, height: 96, borderRadius: 28, background: WHITE, boxShadow: "0 14px 34px rgba(15,23,42,.12)", display: "flex", alignItems: "center", justifyContent: "center", opacity: s }}>
              <I size={50} color={c} strokeWidth={2.1} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: -95, top: -95, transform: `scale(${lg})` }}>
          <div style={{ width: 190, height: 190, borderRadius: 999, background: WHITE, boxShadow: "0 30px 80px rgba(3,105,161,.25)", display: "flex", alignItems: "center", justifyContent: "center", border: "6px solid #E0F2FE" }}>
            <B.calmIcon size={104} color={B.accent} strokeWidth={1.9} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: (m === "h" ? 690 : m === "f" ? 820 : 1010) - (B.first ? (m === "h" ? 80 : 40) : 0), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        {B.first && <div style={{ marginBottom: 8, padding: "8px 30px 12px", borderRadius: 99, background: B.accent, color: WHITE, fontFamily: F, fontWeight: 800, fontSize: m === "h" ? 46 : 42, opacity: sp(f, fps, 4, 12), transform: `scale(${0.8 + 0.2 * sp(f, fps, 4, 12)})` }}>{B.first}</div>}
        <Words text={B.calmHead} size={m === "h" ? 92 : m === "f" ? 76 : 86} d={10} align="center" hi={B.calmHi} hiColor={B.accent} />
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: m === "h" ? 50 : 46, color: MUTED, opacity: lerp(f, 30, 44) }}>বাকি সব সামলাবে <span style={{ fontFamily: LAT, fontWeight: 800, color: INK }}>Qount</span></div>
      </div>
    </AbsoluteFill>
  );
};

const FreeBadge: React.FC<{ size: number; d: number }> = ({ size, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(f, fps, d, 10);
  const pulse = 1 + 0.03 * Math.sin(Math.max(0, f - d - 20) / 6);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3, padding: `${size * 0.18}px ${size * 0.6}px ${size * 0.24}px`, borderRadius: 999, background: GRAD, boxShadow: "0 20px 50px rgba(79,70,229,.25)", transform: `scale(${s * pulse}) rotate(${(1 - s) * -8}deg)`, opacity: s }}>
      <Sparkles size={size * 0.9} color={INK} />
      <span style={{ fontFamily: F, fontWeight: 800, fontSize: size, color: INK }}>৩ দিন সম্পূর্ণ ফ্রি</span>
    </div>
  );
};

const BrandScene: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = useMode();
  const out = interpolate(f, [len - 8, len], [1, 0], clamp);
  const lg = sp(f, fps, 4, 10);
  const k = m === "h" ? 1 : m === "f" ? 0.9 : 1;
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 * k, paddingBottom: m === "v" ? 160 : 70 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 30, transform: `scale(${lg})` }}>
        <Logo size={170 * k} />
        <span style={{ fontFamily: LAT, fontWeight: 800, fontSize: 170 * k, color: INK, letterSpacing: -6 }}>Qount</span>
      </div>
      <div style={{ opacity: lerp(f, 18, 32), transform: `translateY(${(1 - lerp(f, 18, 32)) * 20}px)`, fontFamily: F, fontWeight: 700, fontSize: (m === "h" ? 64 : 54) * k, color: INK, textAlign: "center" }}>
        বাংলাদেশের <span style={{ color: INDIGO }}>সুপার বুকিং</span> অ্যাপ
      </div>
      <div style={{ marginTop: 20 }}><FreeBadge size={(m === "h" ? 72 : 64) * k} d={LEAD + 70} /></div>
    </AbsoluteFill>
  );
};

const PlayBadge: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 * s, background: "#000", border: "2px solid #9aa0a6", borderRadius: 16 * s, padding: `${11 * s}px ${28 * s}px ${11 * s}px ${20 * s}px` }}>
    <svg width={46 * s} height={52 * s} viewBox="0 0 26 29">
      <path d="M1 1.5 L15 14.5 L1 27.5 Z" fill="#00D7FE" /><path d="M1 1.5 L19.5 10.5 L15 14.5 Z" fill="#00F076" />
      <path d="M1 27.5 L15 14.5 L19.5 18.5 Z" fill="#FF3A44" /><path d="M19.5 10.5 L25 14.5 L19.5 18.5 L15 14.5 Z" fill="#FFD500" />
    </svg>
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
      <span style={{ fontFamily: LAT, fontWeight: 700, fontSize: 16 * s, color: "#fff", letterSpacing: 1 }}>GET IT ON</span>
      <span style={{ fontFamily: LAT, fontWeight: 700, fontSize: 34 * s, color: "#fff" }}>Google Play</span>
    </div>
  </div>
);

const EndScene: React.FC = () => {
  const B = useB();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = useMode();
  const a = sp(f, fps, 4, 12), b = sp(f, fps, 24, 11), c = sp(f, fps, 40, 12);
  const h = m === "h";
  const k = m === "f" ? 0.86 : 1;
  const col = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 * k }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, transform: `scale(${a})` }}>
        <Logo size={120 * k} />
        <span style={{ fontFamily: LAT, fontWeight: 800, fontSize: 120 * k, color: INK, letterSpacing: -4 }}>Qount</span>
      </div>
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 46 * k, color: MUTED, opacity: lerp(f, 10, 24), textAlign: "center" }}>{B.tagline}</div>
      <FreeBadge size={62 * k} d={16} />
      <div style={{ transform: `scale(${b})`, opacity: b, marginTop: 8 }}><PlayBadge s={1.25 * k} /></div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 30px", borderRadius: 99, background: WHITE, border: "2px solid #C7D2FE", boxShadow: "0 14px 34px rgba(79,70,229,.15)", opacity: c, transform: `scale(${0.85 + 0.15 * c})` }}>
        <Globe size={40 * k} color={INDIGO} />
        <span style={{ fontFamily: LAT, fontWeight: 800, fontSize: 44 * k, color: INK }}>qount.dreamithq.com</span>
      </div>
    </div>
  );
  if (h) return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 0, bottom: 120, width: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>{col}</div>
      <div style={{ position: "absolute", left: 1150, top: 0, width: 700, height: 1080 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 700, height: 960 }}>
          <Phone x={350} y={480} h={820} screens={[{ src: B.endShot, at: 0 }]} d={8} tilt={-3} />
        </div>
      </div>
    </AbsoluteFill>
  );
  return <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: m === "v" ? 220 : 110 }}>{col}</AbsoluteFill>;
};

/* ---------- captions ---------- */
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const { SC, TL } = React.useContext(C);
  const m = useMode();
  const { bottom, size } = L[m].cap;
  let cur: { text: string; s: number; e: number } | null = null;
  for (const t of TL) {
    const parts = SC[t.i].cap.split("|").map((x) => x.trim());
    const tot = parts.reduce((a, p) => a + p.length, 0);
    let at = voStart(t);
    for (const p of parts) {
      const d = (t.dur * p.length) / tot;
      if (f >= at && f < at + d + (p === parts[parts.length - 1] ? 6 : 0)) cur = { text: p, s: at, e: at + d };
      at += d;
    }
  }
  if (!cur) return null;
  const o = interpolate(f, [cur.s, cur.s + 4], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: m === "h" ? 1500 : 980, padding: `${size * 0.22}px ${size * 0.7}px ${size * 0.32}px`, borderRadius: 22, background: "rgba(15,23,42,.88)", opacity: o, transform: `translateY(${(1 - o) * 10}px)`,
        fontFamily: F, fontWeight: 600, fontSize: size, color: WHITE, textAlign: "center", lineHeight: 1.35 }}>
        {cur.text}
      </div>
    </div>
  );
};

const Bug: React.FC = () => {
  const f = useCurrentFrame();
  const { SC, TL } = React.useContext(C);
  const m = useMode();
  const t = TL.find((x) => f >= x.from && f < x.from + x.len);
  if (!t || ["hook", "brand", "end", "calm"].includes(SC[t.i].kind)) return null;
  const s = m === "h" ? 1 : 0.85;
  return (
    <div style={{ position: "absolute", left: m === "h" ? 60 : 40, top: m === "h" ? 44 : m === "f" ? 26 : 70, display: "flex", alignItems: "center", gap: 12 * s, opacity: 0.95 }}>
      <Logo size={48 * s} />
      <span style={{ fontFamily: LAT, fontWeight: 800, fontSize: 34 * s, color: INK }}>Qount</span>
    </div>
  );
};

/* ---------- audio ---------- */
const SFX: React.FC = () => {
  const { SC, TL } = React.useContext(C);
  const out: React.ReactNode[] = [];
  const at = (k: string, from: number, src: string, v: number, dur = 45) => out.push(<Sequence key={k} from={Math.max(0, from)} durationInFrames={dur}><Audio src={staticFile("sfx/" + src)} volume={v} /></Sequence>);
  TL.forEach((t) => {
    const s = SC[t.i];
    if (t.i > 0) at("w" + t.i, t.from - 4, "whoosh.mp3", 0.16);
    (s.chips || []).forEach((_, j) => at(`p${t.i}-${j}`, t.from + 16 + j * 9, "pop.mp3", 0.12, 20));
    if (s.kind === "hook") at("ring", 10, "ring.mp3", 0.18, 50);
    if (s.kind === "pain") at("flip", t.from + LEAD + Math.round(t.dur * 0.5), "shimmer.mp3", 0.25, 50);
    if (s.kind === "ticket") at("push" + t.i, t.from + (s.pre ? LEAD + Math.round(t.dur * 0.38) : 0) + 10, "tick.mp3", 0.3, 20);
    if (s.kind === "live") at("push" + t.i, t.from + LEAD + Math.round(t.dur * 0.48), "tick.mp3", 0.3, 20);
    if (s.kind === "next") at("click" + t.i, t.from + LEAD + Math.round(t.dur * 0.45), "click.mp3", 0.35, 20);
    if (s.kind === "brand") at("sh" + t.i, t.from, "shimmer.mp3", 0.3, 60);
    if (s.kind === "end") at("hit" + t.i, t.from + 24, "hit.mp3", 0.28, 60);
  });
  return <>{out}</>;
};

export const Film: React.FC<Ctx> = (ctx) => {
  const { durationInFrames: N } = useVideoConfig();
  const { SC, TL } = ctx;
  return (
    <C.Provider value={ctx}>
      <AbsoluteFill style={{ background: BG }}>
        <Backdrop />
        {TL.map((t) => {
          const s = SC[t.i];
          return (
            <Sequence key={t.i} from={t.from} durationInFrames={t.len}>
              {s.kind === "hook" && <HookScene len={t.len} />}
              {s.kind === "pain" && <PainScene len={t.len} dur={t.dur} />}
              {s.kind === "calm" && <CalmScene len={t.len} />}
              {s.kind === "brand" && <BrandScene len={t.len} />}
              {s.kind === "end" && <EndScene />}
              {s.head && ctx.B.vis[s.kind] && <Fade len={t.len}>{React.createElement(ctx.B.vis[s.kind]!, { dur: t.dur, pre: s.pre })}</Fade>}
              {s.head && <TextBlock s={s} len={t.len} />}
            </Sequence>
          );
        })}
        <Bug />
        <Captions />
        {TL.map((t) => (
          <Sequence key={"vo" + t.i} from={voStart(t)}><Audio src={staticFile(SC[t.i].vo + ".mp3")} /></Sequence>
        ))}
        <Audio src={staticFile("music.mp3")} volume={(f) => interpolate(f, [0, 12, N - 80, N], [0, 0.13, 0.13, 0], clamp) * (f > TL[TL.length - 1].from + TL[TL.length - 1].dur + 20 ? 1.9 : 1)} />
        <SFX />
      </AbsoluteFill>
    </C.Provider>
  );
};

export const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [len - 8, len], [1, 0], clamp) }}>{children}</AbsoluteFill>;
};


const DOCB: Biz = {
  accent: DOC, hello: "হ্যালো ডাক্তার সাহেব,", helloHi: ["ডাক্তার"], hookIcon: Stethoscope,
  pain: [[PhoneCall, "সারাদিন ফোন", "১২ মিসড কল"], [Users, "চেম্বারে ভিড়", "৩০+ রোগী অপেক্ষায়"], [NotebookPen, "খাতায় হিসাব", "ভুল আর হারানো"]],
  good: [[Smartphone, "অনলাইন সিরিয়াল", "ফোন লাগে না"], [Radio, "লাইভ সিরিয়াল", "ভিড় নেই"], [BarChart3, "অটো হিসাব", "এক নজরে আয়"]],
  calmIcon: Stethoscope, calmHead: "আপনি শুধু রোগী দেখুন", calmHi: ["রোগী"], tagline: "ডাক্তারের চেম্বার এখন অটোমেটিক", endShot: "shots/ticket.png",
  vis: { serial: SerialVis, ticket: TicketVis, live: LiveVis, next: NextVis, income: IncomeVis, site: SiteVis, multi: MultiVis },
};
export const QdH: React.FC = () => <Film SC={FULL} TL={TLH} B={DOCB} />;
export const QdF: React.FC = () => <Film SC={FEED} TL={TLF} B={DOCB} />;
export const QdR: React.FC = () => <Film SC={REEL} TL={TLR} B={DOCB} />;
