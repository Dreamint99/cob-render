// প্রবাসী বন্ধু 3.0 app promo (2026-10-30). One engine, 16:9 (PB3-H) and 9:16 (PB3-V).
// Real screen recordings of the 3.0 app on the pb_test emulator (work/pb3/record.py → work/pb3pub/clips/NN.mp4),
// VO Tanvir eleven_v4 with context (scripts/vo_batch.py work/pb3/script.json work/pb3pub/vo), music ElevenLabs (work/pb3/music.py).
// Render with the slim public dir: node render.mjs PB3-H output/PB3-H.mp4 --public=work/pb3pub
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, continueRender, delayRender } from "remotion";
import { Moon, Compass, Clock3, Coins, TrendingUp, Scale, Wallet, Send, PiggyBank, FileText, CalendarClock, ShieldCheck, Landmark, PhoneCall, Siren, BarChart3, Briefcase, Plane, FileUser, Languages, Bot, IdCard, QrCode, Share2, LayoutGrid, Type, Globe } from "lucide-react";
import DURS from "./durs.json";

const PLUM = "#3A2150", PLUM2 = "#24132F", CORAL = "#F25F4C", SUN = "#FFB547", MINT = "#2FBF8F", SAND = "#FFF4E6", SKY = "#7B8CFF";
const F = "PBNoto, 'Noto Sans Bengali', sans-serif", LAT = "PBMont, Montserrat, sans-serif";

if (typeof document !== "undefined") {
  for (const [file, weight] of [["Medium", "500"], ["SemiBold", "600"], ["Bold", "700"], ["ExtraBold", "800"], ["Black", "900"]]) {
    const h = delayRender("font " + file);
    const ff = new FontFace("PBNoto", `url(${staticFile("fonts/NotoSansBengali-" + file + ".ttf")})`, { weight });
    ff.load().then(() => { document.fonts.add(ff); continueRender(h); }).catch(() => continueRender(h));
  }
  const h = delayRender("font mont");
  const m = new FontFace("PBMont", `url(${staticFile("fonts/Montserrat.ttf")})`, { weight: "100 900" });
  m.load().then(() => { document.fonts.add(m); continueRender(h); }).catch(() => continueRender(h));
}

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
const useV = () => { const { width, height } = useVideoConfig(); return height > width; };
const sp = (f: number, fps: number, d = 0, damping = 14) => spring({ frame: f - d, fps, config: { damping, mass: 0.8 } });

/* ---------- scenes ---------- */
type Ic = React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
type Feat = { kind: "hook" | "brand" | "home2" | "feat" | "end"; title?: string; chips?: [Ic, string][]; color?: string; clip?: string };
const SC: Feat[] = [
  { kind: "hook" },
  { kind: "brand", clip: "02" },
  { kind: "home2", clip: "03" },
  { kind: "feat", title: "এক স্ক্রিনে সব সেবা", color: SUN, clip: "04", chips: [[LayoutGrid, "বড় আইকন"], [Type, "সহজ বাংলা"], [Globe, "বাংলা · English"]] },
  { kind: "feat", title: "নামাজ ও রমজান", color: MINT, clip: "05", chips: [[Clock3, "নামাজের সময়"], [Compass, "কিবলা"], [Moon, "সেহরি-ইফতার"]] },
  { kind: "feat", title: "আজকের রেট", color: SUN, clip: "06", chips: [[TrendingUp, "টাকার রেট"], [Coins, "সোনার দাম"], [Scale, "কোথায় বেশি"]] },
  { kind: "feat", title: "আয়-খরচের হিসাব", color: CORAL, clip: "07", chips: [[Wallet, "খরচের খাতা"], [Send, "দেশে পাঠানো"], [PiggyBank, "সঞ্চয়"]] },
  { kind: "feat", title: "কাগজ ও মেয়াদ", color: SKY, clip: "08", chips: [[FileText, "পাসপোর্ট · ভিসা"], [ShieldCheck, "নিরাপদ ভল্ট"], [CalendarClock, "মেয়াদ রিমাইন্ডার"]] },
  { kind: "feat", title: "দূতাবাস ও জরুরি", color: CORAL, clip: "09", chips: [[Landmark, "দূতাবাস"], [Siren, "জরুরি নম্বর"], [PhoneCall, "এক চাপে কল"]] },
  { kind: "feat", title: "বিএমইটি · চাকরি · ফ্লাইট", color: MINT, clip: "10", chips: [[BarChart3, "বিএমইটি লাইভ"], [Briefcase, "নতুন চাকরি"], [Plane, "ফ্লাইট"]] },
  { kind: "feat", title: "সিভি ও এআই সহকারী", color: SKY, clip: "11", chips: [[FileUser, "সিভি মেকার"], [Languages, "অনুবাদ"], [Bot, "এআই চ্যাট"]] },
  { kind: "feat", title: "প্রবাস কার্ড", color: SUN, clip: "12", chips: [[IdCard, "কত দিন প্রবাসে"], [QrCode, "QR কার্ড"], [Share2, "শেয়ার করুন"]] },
  { kind: "end", clip: "04" },
];
const LEAD = 8, TAIL = 12;
const TL = (() => {
  let at = 0;
  return (DURS as number[]).map((d, i) => {
    const len = Math.round(d * 30) + (i === 0 ? 14 : LEAD) + TAIL + (i === SC.length - 1 ? 105 : 0);
    const it = { i, from: at, len }; at += len; return it;
  });
})();
export const PB3_TOTAL = TL[TL.length - 1].from + TL[TL.length - 1].len;
const sceneAt = (f: number) => { let k = 0; for (const t of TL) if (f >= t.from) k = t.i; return k; };

/* ---------- backdrop ---------- */
const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const V = H > W;
  const k = sceneAt(f);
  const t = TL[k];
  const prev = SC[Math.max(0, k - 1)].color || CORAL, cur = SC[k].color || CORAL;
  const mix = lerp(f, t.from, t.from + 20);
  const glow = mix < 1 ? (mix < 0.5 ? prev : cur) : cur;
  const drift = Math.sin(f / 70) * 40;
  const dots = Array.from({ length: 40 }, (_, i) => i);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 30% 20%, ${PLUM} 0%, ${PLUM2} 70%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: V ? 1100 : 1200, height: V ? 1100 : 1200, borderRadius: "50%", left: (V ? 0.5 : 0.72) * W - 600 + drift, top: (V ? 0.48 : 0.5) * H - 600 - drift / 2,
        background: `radial-gradient(circle, ${glow}55 0%, ${glow}00 62%)`, transition: "none" }} />
      <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", right: V ? -80 : 120, top: V ? 120 : -90, background: `radial-gradient(circle at 40% 40%, #FFD27A, ${SUN} 60%, #F59E3B)`, opacity: 0.22, filter: "blur(2px)" }} />
      {dots.map((i) => {
        const x = ((i * 137.5) % 100) / 100 * W, y = ((i * 61.8 + f * (0.15 + (i % 5) * 0.05)) % 110) / 100 * H;
        return <div key={i} style={{ position: "absolute", left: x, top: H - y, width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2, borderRadius: 9, background: [CORAL, SUN, MINT][i % 3], opacity: 0.25 }} />;
      })}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d={V ? `M -40 ${H * 0.97} Q ${W * 0.5} ${H * 0.9} ${W + 40} ${H * 0.95} L ${W + 40} ${H + 10} L -40 ${H + 10} Z` : `M -40 ${H * 0.95} Q ${W * 0.3} ${H * 0.86} ${W * 0.62} ${H * 0.93} T ${W + 40} ${H * 0.9} L ${W + 40} ${H + 10} L -40 ${H + 10} Z`} fill={MINT} opacity={0.18} />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- phone with real recording ---------- */
const PhoneScreen: React.FC<{ clip: string; from: number; len: number }> = ({ clip, from, len }) => (
  <Sequence from={from} durationInFrames={len} layout="none">
    <OffthreadVideo src={staticFile(`clips/${clip}.mp4`)} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
  </Sequence>
);

const Phone: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const V = H > W;
  const k = sceneAt(f);
  const ph = V ? 1180 : 900, pw = Math.round(ph * 1080 / 2400) + 24, bez = 12;
  const tBrand = TL[1].from, tEnd = TL[SC.length - 1].from;
  const enter = sp(f, fps, tBrand + 18, 16);
  // position: 16:9 phone right, end scene left; 9:16 center
  const endK = sp(f, fps, tEnd, 18);
  let cx = V ? W / 2 : W * 0.7, cy = V ? H * 0.53 : H / 2;
  if (!V) cx = interpolate(endK, [0, 1], [W * 0.7, W * 0.27]);
  if (V) cy = interpolate(endK, [0, 1], [H * 0.53, H * 0.66]);
  const sc = V ? interpolate(endK, [0, 1], [1, 0.62]) : interpolate(endK, [0, 1], [1, 0.92]);
  // little per-scene "settle" bounce on every screen change
  const t = TL[k];
  const bump = k >= 3 ? 1 - 0.03 * Math.sin(Math.min(1, (f - t.from) / 12) * Math.PI) : 1;
  const tilt = Math.sin(f / 50) * 1.4;
  const y = interpolate(enter, [0, 1], [H * 0.9, 0]);
  if (k < 1) return null;
  return (
    <div style={{ position: "absolute", left: cx - pw / 2, top: cy - (ph + 2 * bez) / 2 + y, width: pw, height: ph + 2 * bez, transform: `scale(${sc * bump}) rotate(${tilt}deg)`, opacity: enter * (V ? 1 - endK : 1) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 64, background: "linear-gradient(145deg,#2b2b33,#0d0d12)", boxShadow: `0 60px 120px rgba(0,0,0,.55), 0 0 0 3px #48485a inset` }} />
      <div style={{ position: "absolute", left: bez, top: bez, right: bez, bottom: bez, borderRadius: 52, overflow: "hidden", background: SAND }}>
        {TL.map((s) => SC[s.i].clip && s.i >= 1 ? <PhoneScreen key={s.i} clip={SC[s.i].clip!} from={s.from} len={s.len + 10} /> : null)}
        {/* crossfade flash to soften cuts */}
        <div style={{ position: "absolute", inset: 0, background: SAND, opacity: k >= 2 ? interpolate(f - t.from, [0, 3, 9], [0.0, 0.55, 0], clamp) : 0 }} />
      </div>
      <div style={{ position: "absolute", left: "50%", top: bez + 14, width: 26, height: 26, marginLeft: -13, borderRadius: 13, background: "#0b0b0f" }} />
    </div>
  );
};

/* ---------- text pieces ---------- */
const Words: React.FC<{ text: string; size: number; d: number; color?: string; hi?: string[]; align?: "left" | "center" }> = ({ text, size, d, color = SAND, hi = [], align = "left" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: F, fontWeight: 800, fontSize: size, lineHeight: 1.3, color, textAlign: align, wordSpacing: "0.06em" }}>
      {text.split(" ").map((w, i) => {
        const s = sp(f, fps, d + i * 4, 13);
        return <span key={i} style={{ display: "inline-block", marginRight: size * 0.26, transform: `translateY(${(1 - s) * size * 0.7}px)`, opacity: s, color: hi.includes(w) ? SUN : undefined }}>{w}</span>;
      })}
    </div>
  );
};

const Chip: React.FC<{ icon: Ic; label: string; color: string; d: number; size: number }> = ({ icon: I, label, color, d, size }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(f, fps, d, 12);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.45, padding: `${size * 0.32}px ${size * 0.7}px ${size * 0.32}px ${size * 0.32}px`, background: "rgba(255,255,255,.09)", border: "2px solid rgba(255,255,255,.14)",
      borderRadius: 999, transform: `translateX(${(1 - s) * -60}px) scale(${0.85 + 0.15 * s})`, opacity: s, alignSelf: "flex-start" }}>
      <div style={{ width: size * 1.7, height: size * 1.7, borderRadius: 999, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <I size={size * 0.95} color={PLUM} strokeWidth={2.4} />
      </div>
      <span style={{ fontFamily: F, fontWeight: 700, fontSize: size, color: SAND, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
};

const FeatText: React.FC<{ s: Feat; idx: number }> = ({ s, idx }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const V = useV();
  const n = idx - 2; // feature number
  const badge = sp(f, fps, 2, 14);
  const out = interpolate(f, [TL[idx].len - 8, TL[idx].len], [1, 0], clamp);
  const num = String(n).padStart(2, "0").replace(/\d/g, (x) => "০১২৩৪৫৬৭৮৯"[+x]);
  const head = (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: badge, transform: `translateY(${(1 - badge) * 20}px)`, justifyContent: V ? "center" : "flex-start" }}>
      <div style={{ fontFamily: F, fontWeight: 900, fontSize: V ? 40 : 36, color: PLUM, background: s.color, borderRadius: 16, padding: "2px 18px" }}>{num}</div>
      <div style={{ height: 4, width: interpolate(badge, [0, 1], [0, 120]), background: s.color, borderRadius: 4 }} />
    </div>
  );
  if (V) return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", top: 120, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        {head}
        <Words text={s.title!} size={s.title!.length > 16 ? 70 : 84} d={5} align="center" />
      </div>
      <div style={{ position: "absolute", bottom: 90, left: 40, right: 40, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
        {s.chips!.map(([I, l], i) => <Chip key={i} icon={I} label={l} color={s.color!} d={14 + i * 7} size={36} />)}
      </div>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", left: 140, top: 220, width: 900, display: "flex", flexDirection: "column", gap: 34 }}>
        {head}
        <Words text={s.title!} size={s.title!.length > 16 ? 92 : 116} d={5} />
        <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 10 }}>
          {s.chips!.map(([I, l], i) => <Chip key={i} icon={I} label={l} color={s.color!} d={16 + i * 8} size={46} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- intro / outro ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const V = H > W;
  const len = TL[0].len;
  const q2 = sp(f, fps, 48, 13);
  const out = interpolate(f, [len - 8, len], [1, 0], clamp);
  // plane flying along an arc
  const p = lerp(f, 0, len, 0, 1);
  const px = interpolate(p, [0, 1], [-0.1, 1.1]) * W, py = H * (V ? 0.3 : 0.25) - Math.sin(p * Math.PI) * (V ? 120 : 160);
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
      <div style={{ position: "absolute", left: px - 40, top: py - 40, transform: `rotate(${-20 + p * 40}deg)` }}><Plane size={80} color={SAND} strokeWidth={1.6} /></div>
      <Words text="আপনি কি একজন প্রবাসী?" size={V ? 96 : 120} d={6} hi={["প্রবাসী?"]} align="center" />
      <div style={{ opacity: q2, transform: `scale(${0.8 + 0.2 * q2})` }}>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: V ? 66 : 76, color: SAND, opacity: 0.85, textAlign: "center" }}>কিংবা প্রবাসে যাবেন?</div>
      </div>
    </AbsoluteFill>
  );
};

const Brand: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const V = useV();
  const ic = sp(f, fps, 0, 11);
  const out = interpolate(f, [TL[1].len - 8, TL[1].len], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", ...(V ? { left: 0, right: 0, top: 70, alignItems: "center" } : { left: 140, top: 300 }), display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: V ? 46 : 52, color: SAND, opacity: lerp(f, 0, 14) }}>তাহলে এই অ্যাপটি আপনার জন্য</div>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Img src={staticFile("icon.png")} style={{ width: V ? 130 : 170, height: V ? 130 : 170, borderRadius: V ? 32 : 40, transform: `scale(${ic}) rotate(${(1 - ic) * -25}deg)`, boxShadow: "0 24px 60px rgba(0,0,0,.45)" }} />
          <Words text="প্রবাসী বন্ধু" size={V ? 110 : 140} d={10} hi={["বন্ধু"]} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Home2: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const V = useV();
  const out = interpolate(f, [TL[2].len - 8, TL[2].len], [1, 0], clamp);
  const s = sp(f, fps, 30, 10);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", ...(V ? { left: 40, right: 40, top: 80, alignItems: "center" } : { left: 140, top: 290, width: 840 }), display: "flex", flexDirection: "column", gap: 20 }}>
        <Words text="কেবল অ্যাপ নয়," size={V ? 70 : 84} d={2} align={V ? "center" : "left"} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, transform: `scale(${0.7 + 0.3 * s})`, opacity: s, transformOrigin: V ? "center" : "left center" }}>
          <div style={{ fontFamily: F, fontWeight: 900, fontSize: V ? 92 : 118, color: PLUM, background: `linear-gradient(90deg, ${SUN}, ${CORAL})`, padding: "0 30px", borderRadius: 28, lineHeight: 1.4 }}>সেকেন্ড হোম</div>
        </div>
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: V ? 44 : 50, color: SAND, opacity: lerp(f, 40, 56) * 0.9, textAlign: V ? "center" : "left" }}>প্রবাসীদের জন্য</div>
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
  const a = sp(f, fps, 6, 12), b = sp(f, fps, 70, 11), c = sp(f, fps, 95, 12);
  const pulse = 1 + 0.035 * Math.sin(Math.max(0, f - 110) / 7);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", ...(V ? { left: 0, right: 0, top: 520, alignItems: "center" } : { left: 820, right: 60, top: 190, alignItems: "center" }), display: "flex", flexDirection: "column", gap: V ? 22 : 26 }}>
        <Img src={staticFile("icon.png")} style={{ width: V ? 150 : 170, height: V ? 150 : 170, borderRadius: 40, transform: `scale(${a})`, boxShadow: "0 24px 60px rgba(0,0,0,.45)" }} />
        <Words text="প্রবাসী বন্ধু" size={V ? 116 : 132} d={10} hi={["বন্ধু"]} align="center" />
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: V ? 44 : 48, color: SAND, opacity: lerp(f, 28, 44) * 0.9, textAlign: "center" }}>প্রবাসে আপনার সবচেয়ে কাছের বন্ধু</div>
        <div style={{ marginTop: V ? 14 : 24, transform: `scale(${b * pulse})`, opacity: b }}><PlayBadge s={V ? 1.25 : 1.35} /></div>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: V ? 38 : 40, color: SUN, opacity: c, textAlign: "center" }}>প্লে স্টোরে খুঁজুন: “প্রবাসী বন্ধু”</div>
        <div style={{ fontFamily: LAT, fontWeight: 500, fontSize: V ? 24 : 24, color: SAND, opacity: c * 0.65 }}>play.google.com/store/apps/details?id=com.probashibondu.probashi_bondu</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- audio ---------- */
const SFX: React.FC = () => (
  <>
    {TL.map((t) => (
      <Sequence key={"w" + t.i} from={Math.max(0, t.from - 6)} durationInFrames={40}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.22} /></Sequence>
    ))}
    {TL.filter((t) => SC[t.i].kind === "feat").flatMap((t) => [16, 24, 32].map((d) => (
      <Sequence key={`p${t.i}-${d}`} from={t.from + d} durationInFrames={20}><Audio src={staticFile("sfx/pop.mp3")} volume={0.16} /></Sequence>
    )))}
    <Sequence from={TL[1].from} durationInFrames={60}><Audio src={staticFile("sfx/shimmer.mp3")} volume={0.3} /></Sequence>
    <Sequence from={TL[TL.length - 1].from + 70} durationInFrames={60}><Audio src={staticFile("sfx/hit.mp3")} volume={0.3} /></Sequence>
  </>
);

export const Pb3: React.FC = () => {
  const { durationInFrames: N } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: PLUM2 }}>
      <Backdrop />
      {TL.map((t) => (
        <Sequence key={t.i} from={t.from} durationInFrames={t.len}>
          {SC[t.i].kind === "hook" && <Hook />}
          {SC[t.i].kind === "brand" && <Brand />}
          {SC[t.i].kind === "home2" && <Home2 />}
          {SC[t.i].kind === "feat" && <FeatText s={SC[t.i]} idx={t.i} />}
          {SC[t.i].kind === "end" && <End />}
        </Sequence>
      ))}
      <Phone />
      {TL.map((t) => (
        <Sequence key={"vo" + t.i} from={t.from + (t.i === 0 ? 14 : LEAD)}><Audio src={staticFile(`vo/${String(t.i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
      ))}
      <Audio src={staticFile("music.mp3")} volume={(f) => interpolate(f, [0, 15, N - 90, N], [0, 0.16, 0.16, 0], clamp) * (f > TL[TL.length - 1].from + 200 ? 1.8 : 1)} />
      <SFX />
    </AbsoluteFill>
  );
};
