// মানিব্যাগ 2.1 feature video (2026-10-30). Full 16:9 (MB3-H, also MB3-HV in 9:16) and a short 9:16 reel (MB3-R).
// Real screen recordings of the demo build on mb_test (work/mb3/record.py → work/mb3pub/clips/NN.mp4),
// VO Tanvir eleven_v4 with context (scripts/vo_batch.py work/mb3/script.json work/mb3pub/vo; reel.json → vor), music work/mb3/music.py.
// Render with the slim public dir: node render.mjs MB3-H output/Moneybag/MB3-H.mp4 --public=work/mb3pub
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, continueRender, delayRender } from "remotion";
import { Wallet, Zap, Sparkles, Tag, ArrowUpCircle, ArrowDownCircle, ArrowLeftRight, CalendarDays, Banknote, Smartphone, Landmark, ListOrdered, BookUser, MessageCircle, MessageSquareText, PieChart, BarChart3, CalendarRange, Target, PiggyBank, Gauge, BellRing, Home, Receipt, StickyNote, ListTodo, Lock, Calculator, Bot, Languages, Coins, MoonStar, Cloud, ShieldCheck, RefreshCw, LayoutGrid, Type, HelpCircle } from "lucide-react";
import DURS from "./durs.json";
import RDURS from "./rdurs.json";

const BLUE = "#1F4FD8", DEEP = "#0B2C8C", INK = "#0F1B3D", BG = "#F3F6FD", WHITE = "#FFFFFF";
const GREEN = "#16A34A", ORANGE = "#EA580C", PURPLE = "#7C3AED", PINK = "#DB2777", TEAL = "#0D9488", AMBER = "#D97706";
const F = "MBAnek, 'Noto Sans Bengali', sans-serif", LAT = "MBMont, Montserrat, sans-serif";

if (typeof document !== "undefined") {
  for (const w of ["500", "600", "700", "800"]) {
    const h = delayRender("font anek " + w);
    const ff = new FontFace("MBAnek", `url(${staticFile("fonts/AnekBangla-" + w + ".ttf")})`, { weight: w });
    ff.load().then(() => { document.fonts.add(ff); continueRender(h); }).catch(() => continueRender(h));
  }
  const h = delayRender("font mont");
  const m = new FontFace("MBMont", `url(${staticFile("fonts/Montserrat.ttf")})`, { weight: "100 900" });
  m.load().then(() => { document.fonts.add(m); continueRender(h); }).catch(() => continueRender(h));
}

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
const sp = (f: number, fps: number, d = 0, damping = 14) => spring({ frame: f - d, fps, config: { damping, mass: 0.8 } });
const bn = (n: number | string) => String(n).replace(/\d/g, (x) => "০১২৩৪৫৬৭৮৯"[+x]);

type Ic = React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
type Sc = { kind: "hook" | "brand" | "feat" | "end"; title?: string; sub?: string; chips?: [Ic, string][]; color?: string; clip?: string; start?: number };

/* ---------- scene lists ---------- */
const FULL: Sc[] = [
  { kind: "hook" },
  { kind: "brand", clip: "02" },
  { kind: "feat", title: "এক নজরে সব হিসাব", color: BLUE, clip: "03", chips: [[Wallet, "মোট ব্যালেন্স"], [LayoutGrid, "বড় বোতাম"], [Type, "সহজ বাংলা"]] },
  { kind: "feat", title: "এক লাইনে হিসাব", sub: "“বাজার ৫৫০ বিকাশে”", color: AMBER, clip: "04", chips: [[Tag, "খাত"], [Banknote, "টাকা"], [Smartphone, "ওয়ালেট"]] },
  { kind: "feat", title: "আয় · ব্যয় · ট্রান্সফার", color: GREEN, clip: "05", chips: [[ArrowUpCircle, "আয়"], [ArrowDownCircle, "ব্যয়"], [ArrowLeftRight, "ট্রান্সফার"], [CalendarDays, "তারিখ ও নোট"]] },
  { kind: "feat", title: "ওয়ালেট ও লেনদেন", color: TEAL, clip: "06", chips: [[Banknote, "ক্যাশ"], [Smartphone, "বিকাশ · নগদ"], [Landmark, "ব্যাংক"], [ListOrdered, "সব লেনদেন"]] },
  { kind: "feat", title: "বাকি খাতা", color: ORANGE, clip: "07", chips: [[BookUser, "কে কত পাবে"], [MessageCircle, "WhatsApp তাগাদা"], [MessageSquareText, "SMS তাগাদা"]] },
  { kind: "feat", title: "রিপোর্ট", color: BLUE, clip: "08", chips: [[PieChart, "খাতভিত্তিক চার্ট"], [BarChart3, "দিনে দিনে খরচ"], [CalendarRange, "মাস বদলান"]] },
  { kind: "feat", title: "বাজেট ও সঞ্চয়", color: PINK, clip: "09", chips: [[Gauge, "খাতের বাজেট"], [Target, "সঞ্চয়ের লক্ষ্য"], [PiggyBank, "একটু একটু জমান"]] },
  { kind: "feat", title: "রিমাইন্ডার", color: INK, clip: "10", chips: [[Home, "বাসা ভাড়া"], [Receipt, "বিল"], [BellRing, "কিস্তি"]] },
  { kind: "feat", title: "নোট · টু-ডু · ডক ভল্ট", color: PURPLE, clip: "11", chips: [[StickyNote, "নোট"], [ListTodo, "টু-ডু"], [Lock, "ডক ভল্ট"], [Calculator, "ক্যালকুলেটর"]] },
  { kind: "feat", title: "এআই সহায়ক", sub: "বাংলায় প্রশ্ন করুন", color: BLUE, clip: "12", chips: [[Bot, "সাথে সাথে উত্তর"], [Sparkles, "হিসাব বুঝিয়ে দেয়"]] },
  { kind: "feat", title: "আপনার মতো সাজান", color: TEAL, clip: "13", chips: [[Languages, "বাংলা · English"], [Coins, "যেকোনো মুদ্রা"], [MoonStar, "লাইট · ডার্ক"]] },
  { kind: "feat", title: "ক্লাউড ব্যাকআপ", color: BLUE, clip: "14", chips: [[Cloud, "লগইন করলেই ব্যাকআপ"], [RefreshCw, "নতুন ফোনে ফেরত"], [ShieldCheck, "নিরাপদ"]] },
  { kind: "end", clip: "03" },
];
const REEL: Sc[] = [
  { kind: "hook" },
  { kind: "brand", clip: "02" },
  { kind: "feat", title: "এক লাইনে হিসাব", sub: "“বাজার ৫৫০ বিকাশে”", color: AMBER, clip: "04", start: 75, chips: [[Tag, "খাত"], [Banknote, "টাকা"], [Smartphone, "ওয়ালেট"]] },
  { kind: "feat", title: "বাকি খাতা", color: ORANGE, clip: "07", start: 75, chips: [[BookUser, "কে কত পাবে"], [MessageCircle, "WhatsApp তাগাদা"]] },
  { kind: "feat", title: "রিপোর্ট", color: BLUE, clip: "08", start: 15, chips: [[PieChart, "টাকা কোথায় গেল"]] },
  { kind: "feat", title: "আরও অনেক কিছু", color: PINK, clip: "09", chips: [[Gauge, "বাজেট"], [Target, "সঞ্চয়"], [BellRing, "রিমাইন্ডার"], [Bot, "এআই সহায়ক"]] },
  { kind: "end", clip: "03" },
];

const LEAD = 8, TAIL = 12;
type T = { i: number; from: number; len: number };
const timeline = (durs: number[], n: number, endHold: number): T[] => {
  let at = 0;
  return durs.map((d, i) => {
    const len = Math.round(d * 30) + (i === 0 ? 14 : LEAD) + TAIL + (i === n - 1 ? endHold : 0);
    const it = { i, from: at, len }; at += len; return it;
  });
};
const TLH = timeline(DURS as number[], FULL.length, 105);
const TLR = timeline(RDURS as number[], REEL.length, 75);
export const MB3_TOTAL = TLH[TLH.length - 1].from + TLH[TLH.length - 1].len;
export const MB3R_TOTAL = TLR[TLR.length - 1].from + TLR[TLR.length - 1].len;

type Ctx = { SC: Sc[]; TL: T[]; vo: string };
const C = React.createContext<Ctx>({ SC: FULL, TL: TLH, vo: "vo" });
const useV = () => { const { width, height } = useVideoConfig(); return height > width; };
const sceneAt = (TL: T[], f: number) => { let k = 0; for (const t of TL) if (f >= t.from) k = t.i; return k; };

/* ---------- backdrop: clean light page, soft blue blobs, blue panel for hook/end ---------- */
const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const { SC, TL } = React.useContext(C);
  const V = H > W;
  const k = sceneAt(TL, f);
  const col = SC[k].color || BLUE;
  const drift = Math.sin(f / 80) * 40;
  // blue panel: full during hook, circle-wipes away into brand, wipes back for the end
  const tB = TL[1].from, tE = TL[TL.length - 1].from;
  const R = Math.hypot(W, H);
  const r = f < tE ? interpolate(f, [tB - 4, tB + 18], [R, 0], { ...clamp, easing: Easing.in(Easing.cubic) }) : interpolate(f, [tE, tE + 22], [0, R], { ...clamp, easing: Easing.out(Easing.cubic) });
  const grid = 64;
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        {Array.from({ length: Math.ceil(W / grid) + 1 }, (_, i) => Array.from({ length: Math.ceil(H / grid) + 1 }, (_, j) => (
          <circle key={i + "-" + j} cx={i * grid + ((f * 0.3) % grid)} cy={j * grid} r={1.6} fill="#C9D4F2" />
        )))}
      </svg>
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", left: (V ? 0.5 : 0.7) * W - 550 + drift, top: (V ? 0.55 : 0.5) * H - 550 - drift / 2, background: `radial-gradient(circle, ${col}2E 0%, ${col}00 62%)` }} />
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", left: -250 - drift, top: -260, background: `radial-gradient(circle, ${BLUE}22 0%, ${BLUE}00 65%)` }} />
      <div style={{ position: "absolute", left: W / 2 - r, top: H / 2 - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: `radial-gradient(120% 100% at 30% 20%, ${BLUE} 0%, ${DEEP} 80%)` }} />
    </AbsoluteFill>
  );
};

/* ---------- phone with the real recording ---------- */
const Phone: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const { SC, TL } = React.useContext(C);
  const V = H > W;
  const k = sceneAt(TL, f);
  const ph = V ? 1180 : 900, pw = Math.round(ph * 1080 / 2400) + 24, bez = 12;
  const tBrand = TL[1].from, tEnd = TL[SC.length - 1].from;
  const enter = sp(f, fps, tBrand + 14, 16);
  const endK = sp(f, fps, tEnd, 18);
  let cx = V ? W / 2 : W * 0.7, cy = V ? H * 0.55 : H / 2;
  if (!V) cx = interpolate(endK, [0, 1], [W * 0.7, W * 0.27]);
  if (V) cy = interpolate(endK, [0, 1], [H * 0.55, H * 0.7]);
  const sc = V ? interpolate(endK, [0, 1], [1, 0.6]) : interpolate(endK, [0, 1], [1, 0.92]);
  const t = TL[k];
  const bump = k >= 2 ? 1 - 0.025 * Math.sin(Math.min(1, (f - t.from) / 12) * Math.PI) : 1;
  const tilt = Math.sin(f / 55) * 1.2;
  const y = interpolate(enter, [0, 1], [H * 0.9, 0]);
  if (k < 1) return null;
  return (
    <div style={{ position: "absolute", left: cx - pw / 2, top: cy - (ph + 2 * bez) / 2 + y, width: pw, height: ph + 2 * bez, transform: `scale(${sc * bump}) rotate(${tilt}deg)`, opacity: enter * (V ? 1 - endK : 1) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 64, background: "linear-gradient(145deg,#2c3140,#0d0f16)", boxShadow: `0 50px 110px rgba(15,27,61,.35), 0 0 0 3px #4a5068 inset` }} />
      <div style={{ position: "absolute", left: bez, top: bez, right: bez, bottom: bez, borderRadius: 52, overflow: "hidden", background: WHITE }}>
        {TL.map((s) => SC[s.i].clip && s.i >= 1 ? (
          <Sequence key={s.i} from={s.from} durationInFrames={s.len + 10} layout="none">
            <OffthreadVideo src={staticFile(`clips/${SC[s.i].clip}.mp4`)} startFrom={SC[s.i].start || 0} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </Sequence>
        ) : null)}
        <div style={{ position: "absolute", inset: 0, background: WHITE, opacity: k >= 2 ? interpolate(f - t.from, [0, 3, 9], [0, 0.6, 0], clamp) : 0 }} />
      </div>
      <div style={{ position: "absolute", left: "50%", top: bez + 14, width: 24, height: 24, marginLeft: -12, borderRadius: 12, background: "#0b0b0f" }} />
    </div>
  );
};

/* ---------- text pieces ---------- */
const Words: React.FC<{ text: string; size: number; d: number; color?: string; hi?: string[]; hiColor?: string; align?: "left" | "center"; weight?: number }> = ({ text, size, d, color = INK, hi = [], hiColor = BLUE, align = "left", weight = 800 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: F, fontWeight: weight, fontSize: size, lineHeight: 1.25, color, textAlign: align }}>
      {text.split(" ").map((w, i) => {
        const s = sp(f, fps, d + i * 4, 13);
        return <span key={i} style={{ display: "inline-block", marginRight: size * 0.24, transform: `translateY(${(1 - s) * size * 0.6}px)`, opacity: s, color: hi.includes(w) ? hiColor : undefined }}>{w}</span>;
      })}
    </div>
  );
};

const Chip: React.FC<{ icon: Ic; label: string; color: string; d: number; size: number }> = ({ icon: I, label, color, d, size }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(f, fps, d, 12);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.45, padding: `${size * 0.28}px ${size * 0.75}px ${size * 0.28}px ${size * 0.28}px`, background: WHITE,
      boxShadow: "0 10px 30px rgba(15,27,61,.08)", border: "1.5px solid #E3E9F7", borderRadius: 999, transform: `translateX(${(1 - s) * -50}px) scale(${0.85 + 0.15 * s})`, opacity: s }}>
      <div style={{ width: size * 1.7, height: size * 1.7, borderRadius: 999, background: color + "1F", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <I size={size * 0.95} color={color} strokeWidth={2.3} />
      </div>
      <span style={{ fontFamily: F, fontWeight: 700, fontSize: size, color: INK, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
};

const FeatText: React.FC<{ s: Sc; idx: number }> = ({ s, idx }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { TL } = React.useContext(C);
  const V = useV();
  const n = idx - 1;
  const badge = sp(f, fps, 2, 14);
  const out = interpolate(f, [TL[idx].len - 8, TL[idx].len], [1, 0], clamp);
  const head = (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: badge, transform: `translateY(${(1 - badge) * 20}px)`, justifyContent: V ? "center" : "flex-start" }}>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: V ? 40 : 36, color: WHITE, background: s.color, borderRadius: 16, padding: "2px 18px" }}>{bn(String(n).padStart(2, "0"))}</div>
      <div style={{ height: 4, width: interpolate(badge, [0, 1], [0, 110]), background: s.color, borderRadius: 4 }} />
    </div>
  );
  const sub = s.sub ? (
    <div style={{ fontFamily: F, fontWeight: 700, fontSize: V ? 54 : 60, color: s.color, opacity: lerp(f, 14, 26), transform: `scale(${0.9 + 0.1 * lerp(f, 14, 26)})`, transformOrigin: V ? "center" : "left center", textAlign: V ? "center" : "left" }}>{s.sub}</div>
  ) : null;
  const long = s.title!.length > 14;
  if (V) return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", top: 110, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        {head}
        <Words text={s.title!} size={long ? 76 : 92} d={5} align="center" />
        {sub}
      </div>
      <div style={{ position: "absolute", bottom: 80, left: 30, right: 30, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {s.chips!.map(([I, l], i) => <Chip key={i} icon={I} label={l} color={s.color!} d={14 + i * 7} size={34} />)}
      </div>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", left: 130, top: s.sub ? 200 : 240, width: 860, display: "flex", flexDirection: "column", gap: 24 }}>
        {head}
        <Words text={s.title!} size={long ? 84 : 104} d={5} />
        {sub}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 20, marginTop: 14 }}>
          {s.chips!.map(([I, l], i) => <Chip key={i} icon={I} label={l} color={s.color!} d={16 + i * 8} size={38} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- hook: money flies out of an open wallet ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const { TL } = React.useContext(C);
  const V = H > W;
  const len = TL[0].len;
  const out = interpolate(f, [len - 8, len], [1, 0], clamp);
  const w = sp(f, fps, 0, 12);
  const notes = Array.from({ length: 9 }, (_, i) => i);
  const wx = W / 2, wy = H * (V ? 0.36 : 0.3);
  const q = sp(f, fps, 22, 13);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {notes.map((i) => {
        const t = Math.max(0, f - 6 - i * 5) / 40;
        const ang = -Math.PI / 2 + (i - 4) * 0.32;
        const dist = t * (V ? 520 : 600);
        const x = wx + Math.cos(ang) * dist, y = wy + Math.sin(ang) * dist * 0.75 + t * t * 120;
        const o = t <= 0 ? 0 : interpolate(t, [0, 0.15, 0.8, 1.1], [0, 1, 1, 0], clamp);
        return (
          <div key={i} style={{ position: "absolute", left: x - 46, top: y - 26, width: 92, height: 52, borderRadius: 8, background: i % 2 ? "#4ADE80" : "#86EFAC", border: "3px solid #fff",
            transform: `rotate(${(i - 4) * 18 + t * 200 * (i % 2 ? 1 : -1)}deg)`, opacity: o, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 800, fontSize: 30, color: "#14532D" }}>৳</div>
        );
      })}
      <div style={{ position: "absolute", left: wx - 90, top: wy - 80, transform: `scale(${w}) rotate(${Math.sin(f / 4) * 4 * (1 - lerp(f, 20, 50))}deg)` }}>
        <Wallet size={180} color={WHITE} strokeWidth={1.6} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: V ? H * 0.5 : H * 0.55, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Words text="মাস শেষে টাকা কোথায় যায়?" size={V ? 92 : 112} d={14} color={WHITE} hi={["কোথায়"]} hiColor="#FDE047" align="center" />
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: q, transform: `scale(${0.85 + 0.15 * q})` }}>
          <HelpCircle size={V ? 60 : 64} color="#FDE047" strokeWidth={2.4} />
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: V ? 62 : 68, color: WHITE, opacity: 0.92 }}>বুঝতে পারেন না?</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Brand: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { TL } = React.useContext(C);
  const V = useV();
  const ic = sp(f, fps, 6, 11);
  const out = interpolate(f, [TL[1].len - 8, TL[1].len], [1, 0], clamp);
  const line = lerp(f, 30, 46);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", ...(V ? { left: 0, right: 0, top: 70, alignItems: "center" } : { left: 130, top: 280 }), display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: V ? 46 : 52, color: INK, opacity: lerp(f, 0, 14) * 0.75 }}>তাহলে এই অ্যাপটি আপনার জন্য</div>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Img src={staticFile("icon.png")} style={{ width: V ? 130 : 170, height: V ? 130 : 170, borderRadius: V ? 32 : 40, transform: `scale(${ic}) rotate(${(1 - ic) * -25}deg)`, boxShadow: "0 24px 60px rgba(31,79,216,.35)" }} />
          <Words text="মানিব্যাগ" size={V ? 120 : 150} d={12} color={BLUE} />
        </div>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: V ? 48 : 56, color: INK, opacity: line, transform: `translateY(${(1 - line) * 20}px)` }}>
          আপনার <span style={{ color: GREEN }}>আয়</span> <span style={{ color: ORANGE }}>ব্যয়ের</span> হিসাব
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PlayBadge: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 * s, background: "#000", border: "3px solid #9aa0a6", borderRadius: 18 * s, padding: `${12 * s}px ${30 * s}px ${12 * s}px ${22 * s}px` }}>
    <svg width={52 * s} height={58 * s} viewBox="0 0 26 29">
      <path d="M1 1.5 L15 14.5 L1 27.5 Z" fill="#00D7FE" /><path d="M1 1.5 L19.5 10.5 L15 14.5 Z" fill="#00F076" />
      <path d="M1 27.5 L15 14.5 L19.5 18.5 Z" fill="#FF3A44" /><path d="M19.5 10.5 L25 14.5 L19.5 18.5 L15 14.5 Z" fill="#FFD500" />
    </svg>
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
      <span style={{ fontFamily: LAT, fontWeight: 600, fontSize: 18 * s, color: "#fff", letterSpacing: 1 }}>GET IT ON</span>
      <span style={{ fontFamily: LAT, fontWeight: 600, fontSize: 38 * s, color: "#fff" }}>Google Play</span>
    </div>
  </div>
);

const End: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const V = useV();
  const a = sp(f, fps, 10, 12), b = sp(f, fps, 60, 11), c = sp(f, fps, 85, 12);
  const pulse = 1 + 0.035 * Math.sin(Math.max(0, f - 100) / 7);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", ...(V ? { left: 0, right: 0, top: 110, alignItems: "center" } : { left: 820, right: 60, top: 180, alignItems: "center" }), display: "flex", flexDirection: "column", gap: V ? 22 : 24 }}>
        <Img src={staticFile("icon.png")} style={{ width: V ? 150 : 170, height: V ? 150 : 170, borderRadius: 40, transform: `scale(${a})`, boxShadow: "0 24px 60px rgba(0,0,0,.35)" }} />
        <Words text="মানিব্যাগ" size={V ? 120 : 136} d={14} color={WHITE} align="center" />
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: V ? 46 : 50, color: WHITE, opacity: lerp(f, 28, 44) * 0.9, textAlign: "center" }}>আপনার আয় ব্যয়ের হিসাব</div>
        <div style={{ marginTop: V ? 14 : 22, transform: `scale(${b * pulse})`, opacity: b }}><PlayBadge s={V ? 1.25 : 1.35} /></div>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: V ? 40 : 42, color: "#FDE047", opacity: c, textAlign: "center" }}>প্লে স্টোরে খুঁজুন: “মানিব্যাগ” · একদম ফ্রি</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- audio ---------- */
const SFX: React.FC = () => {
  const { SC, TL } = React.useContext(C);
  return (
    <>
      {TL.map((t) => (
        <Sequence key={"w" + t.i} from={Math.max(0, t.from - 6)} durationInFrames={40}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.2} /></Sequence>
      ))}
      {TL.filter((t) => SC[t.i].kind === "feat").flatMap((t) => SC[t.i].chips!.map((_, j) => (
        <Sequence key={`p${t.i}-${j}`} from={t.from + 16 + j * 8} durationInFrames={20}><Audio src={staticFile("sfx/pop.mp3")} volume={0.14} /></Sequence>
      )))}
      <Sequence from={6} durationInFrames={60}><Audio src={staticFile("sfx/cards.mp3")} volume={0.25} /></Sequence>
      <Sequence from={TL[1].from} durationInFrames={60}><Audio src={staticFile("sfx/shimmer.mp3")} volume={0.3} /></Sequence>
      <Sequence from={TL[TL.length - 1].from + 60} durationInFrames={60}><Audio src={staticFile("sfx/hit.mp3")} volume={0.3} /></Sequence>
    </>
  );
};

const Film: React.FC<Ctx> = (ctx) => {
  const { durationInFrames: N } = useVideoConfig();
  const { SC, TL, vo } = ctx;
  return (
    <C.Provider value={ctx}>
      <AbsoluteFill style={{ background: BG }}>
        <Backdrop />
        <Phone />
        {TL.map((t) => (
          <Sequence key={t.i} from={t.from} durationInFrames={t.len}>
            {SC[t.i].kind === "hook" && <Hook />}
            {SC[t.i].kind === "brand" && <Brand />}
            {SC[t.i].kind === "feat" && <FeatText s={SC[t.i]} idx={t.i} />}
            {SC[t.i].kind === "end" && <End />}
          </Sequence>
        ))}
        {TL.map((t) => (
          <Sequence key={"vo" + t.i} from={t.from + (t.i === 0 ? 14 : LEAD)}><Audio src={staticFile(`${vo}/${String(t.i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
        ))}
        <Audio src={staticFile("music.mp3")} volume={(f) => interpolate(f, [0, 15, N - 90, N], [0, 0.15, 0.15, 0], clamp) * (f > TL[TL.length - 1].from + 170 ? 1.8 : 1)} />
        <SFX />
      </AbsoluteFill>
    </C.Provider>
  );
};

export const Mb3: React.FC = () => <Film SC={FULL} TL={TLH} vo="vo" />;
export const Mb3Reel: React.FC = () => <Film SC={REEL} TL={TLR} vo="vor" />;
