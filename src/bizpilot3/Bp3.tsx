// Bizpilot promo v3: one engine, Bangla + English, 16:9 films and 9:16 reels.
// Real app screenshots (work/pbcap/bp3cap.mjs) + rebuilt, animated UI (chat, invoice, courier, payment check, learning).
// VO: work/bizpilot3/make_vo.py (bn Tanvir, en Brian via OpenRouter) → public/bizpilot3/vo/<lang>/<p>.mp3 + durs.json.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import DURS from "./durs.json";

type Lang = "bn" | "en";
export type Bp3Props = { lang: Lang; scenes: string[] };

const FPS = 30, LEAD = 10, BEAT = 15;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
const S = (p: string) => staticFile("bizpilot3/" + p);

const BG = "#06060C", CARD = "#11111B", CARD2 = "#181826", LINE = "rgba(255,255,255,0.09)", VIO = "#8B5CF6", VIO2 = "#A78BFA", CYAN = "#22D3EE",
  MINT = "#22C55E", AMBER = "#F59E0B", PINK = "#E2136E", TXT = "#F5F5FB", MUTE = "#9C9CB5", AIBUB = "#123D27";
const GRAD = `linear-gradient(90deg, ${VIO2}, ${CYAN})`;
const BN = "AnekB, 'Hind Siliguri', sans-serif", BODY = "Hind, 'Hind Siliguri', sans-serif", LAT = "Montserrat, sans-serif";

if (typeof document !== "undefined") {
  for (const [name, file] of [["AnekB", "AnekBangla.ttf"], ["Hind", "HindSiliguri-SemiBold.ttf"], ["Montserrat", "Montserrat.ttf"]]) {
    const ff = new FontFace(name, `url(${staticFile("fonts/" + file)})`);
    ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  }
}

const Ctx = createContext<{ L: Lang; V: boolean }>({ L: "bn", V: false });
const useC = () => useContext(Ctx);
const useT = () => { const { L } = useC(); return (bn: string, en: string) => (L === "bn" ? bn : en); };
const bnNum = (s: string) => s.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
const useNum = () => { const { L } = useC(); return (s: string | number) => (L === "bn" ? bnNum(String(s)) : String(s)); };
const head = (L: Lang) => (L === "bn" ? BN : LAT);

const useIn = (delay = 0, damping = 14) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass: 0.8 } }); };

/* ---------- timeline ---------- */
const durOf = (lang: Lang, p: string) => (DURS as Record<string, Record<string, number>>)[lang][p];
export const bp3Timeline = (lang: Lang, scenes: string[]) => {
  let at = 0;
  return scenes.map((p) => {
    const raw = durOf(lang, p) * FPS + LEAD + 16 + (p === "cta" || p === "adcta" ? 60 : 0) + (p === "logo" ? 6 : 0);
    const len = Math.ceil(raw / BEAT) * BEAT;
    const it = { p, from: at, len }; at += len; return it;
  });
};
export const bp3Total = (lang: Lang, scenes: string[]) => { const t = bp3Timeline(lang, scenes); return t[t.length - 1].from + t[t.length - 1].len; };

/* ---------- shared pieces ---------- */
const Backdrop: React.FC<{ hue?: string; night?: boolean }> = ({ hue = VIO, night }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: night ? "#020207" : BG, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: W * 0.9, height: W * 0.9, left: -W * 0.25 + 70 * Math.sin(f / 60), top: -W * 0.45, borderRadius: "50%", background: `radial-gradient(circle, ${hue}${night ? "22" : "40"}, transparent 62%)` }} />
      <div style={{ position: "absolute", width: W * 0.8, height: W * 0.8, right: -W * 0.3, bottom: -W * 0.4 + 50 * Math.cos(f / 70), borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}${night ? "12" : "22"}, transparent 62%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${LINE} 1px, transparent 1px), linear-gradient(90deg, ${LINE} 1px, transparent 1px)`, backgroundSize: "80px 80px",
        backgroundPosition: `0 ${(f * 0.6) % 80}px`, opacity: 0.35, maskImage: "radial-gradient(ellipse at 50% 60%, black 20%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 60%, black 20%, transparent 75%)" }} />
      {night ? Array.from({ length: 40 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: (i * 397) % W, top: (i * 211) % (H * 0.6), width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: 4, background: "#fff", opacity: 0.2 + 0.5 * Math.abs(Math.sin(f / 20 + i)) }} />
      )) : null}
    </AbsoluteFill>
  );
};

// Headline: words rise in with blur; accent words get the gradient.
const Headline: React.FC<{ text: string; accent?: string[]; top?: number; size?: number; delay?: number }> = ({ text, accent = [], top, size, delay = 3 }) => {
  const f = useCurrentFrame();
  const { L, V } = useC();
  const words = text.split(" ");
  const sz = size ?? (V ? 92 : 84);
  return (
    <div style={{ position: "absolute", top: top ?? (V ? 250 : 70), left: 0, right: 0, textAlign: "center", padding: V ? "0 70px" : "0 120px", fontFamily: head(L), fontWeight: 800,
      fontSize: sz, lineHeight: 1.12, letterSpacing: L === "en" ? -2 : 0, color: TXT }}>
      {words.map((w, i) => {
        const k = lerp(f, delay + i * 3, delay + i * 3 + 16);
        const hot = accent.some((a) => w.includes(a));
        return (
          <span key={i} style={{ display: "inline-block", marginRight: "0.26em", opacity: k, transform: `translateY(${(1 - k) * 46}px) scale(${0.92 + 0.08 * k})`, filter: `blur(${(1 - k) * 10}px)`,
            ...(hot ? { background: GRAD, WebkitBackgroundClip: "text", color: "transparent" } : {}) }}>{w}</span>
        );
      })}
    </div>
  );
};

const Logo: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <defs><linearGradient id="bp3l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={VIO} /><stop offset="1" stopColor="#6D28D9" /></linearGradient></defs>
    <rect width="32" height="32" rx="9" fill="url(#bp3l)" />
    <rect x="9" y="8" width="14" height="12" rx="3.5" fill="#fff" />
    <path d="M11 18.5v4.6c0 .6.7.9 1.1.5l4.4-4.1z" fill="#fff" />
    <circle cx="23.5" cy="8.5" r="3" fill={MINT} stroke="#4C1D95" strokeWidth="1.6" />
  </svg>
);

const Wordmark: React.FC<{ size: number }> = ({ size }) => (
  <span style={{ fontFamily: LAT, fontWeight: 800, fontSize: size, color: TXT, letterSpacing: -size / 32 }}>Biz<span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>pilot</span></span>
);

// Browser frame with a real screenshot; slow camera push toward (fx, fy).
const Screen: React.FC<{ src: string; x: number; y: number; w: number; fx?: number; fy?: number; zoom?: number; delay?: number; tilt?: number; dim?: number }> =
  ({ src, x, y, w, fx = 50, fy = 30, zoom = 1.35, delay = 0, tilt = 0, dim = 0 }) => {
    const f = useCurrentFrame();
    const k = useIn(delay, 16);
    const z = interpolate(f, [delay + 10, delay + 150], [1, zoom], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    return (
      <div style={{ position: "absolute", left: x, top: y, width: w, opacity: k, transform: `translateY(${(1 - k) * 80}px) perspective(1800px) rotateY(${tilt * (1 - 0.5 * k)}deg) rotateX(${(1 - k) * 12}deg) scale(${0.92 + 0.08 * k})`, transformOrigin: "center" }}>
        <div style={{ borderRadius: 18, overflow: "hidden", border: `1px solid ${LINE}`, background: CARD, boxShadow: `0 60px 140px rgba(0,0,0,0.65), 0 0 90px ${VIO}26` }}>
          <div style={{ height: 36, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderBottom: `1px solid ${LINE}`, background: "#0D0D16" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: 11, background: c }} />)}
            <span style={{ marginLeft: 14, fontFamily: LAT, fontSize: 14, color: MUTE }}>bizpilot-app.dreamithq.com</span>
          </div>
          <div style={{ height: w * 0.625, overflow: "hidden", position: "relative" }}>
            <Img src={S("shots/" + src)} style={{ width: "100%", transform: `scale(${z})`, transformOrigin: `${fx}% ${fy}%` }} />
            {dim ? <AbsoluteFill style={{ background: `rgba(6,6,12,${dim})` }} /> : null}
          </div>
        </div>
      </div>
    );
  };

// Phone with a real mobile screenshot.
const PhoneShot: React.FC<{ src: string; x: number; y: number; w: number; delay?: number; rot?: number; scrollTo?: number }> = ({ src, x, y, w, delay = 0, rot = 0, scrollTo = 0 }) => {
  const f = useCurrentFrame();
  const k = useIn(delay, 14);
  const sc = interpolate(f, [delay + 30, delay + 130], [0, scrollTo], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: w * 0.028, borderRadius: w * 0.14, background: "#000", border: "2px solid #2A2A40",
      boxShadow: `0 50px 120px rgba(0,0,0,0.7), 0 0 70px ${VIO}33`, opacity: k, transform: `translateY(${(1 - k) * 140 + Math.sin(f / 24) * 6}px) rotate(${rot}deg)` }}>
      <div style={{ borderRadius: w * 0.11, overflow: "hidden", height: w * 2.06 }}>
        <Img src={S("shots/" + src)} style={{ width: "100%", transform: `translateY(${-sc}px)` }} />
      </div>
    </div>
  );
};

/* ---------- rebuilt chat UI ---------- */
type Msg = { who: "c" | "ai" | "sys"; text: string; at: number; tag?: string };
const Dots: React.FC = () => {
  const f = useCurrentFrame();
  return <span style={{ display: "inline-flex", gap: 7 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 11, height: 11, borderRadius: 11, background: "#86EFAC", opacity: 0.35 + 0.65 * Math.abs(Math.sin(f / 5 + i)) }} />)}</span>;
};
const Bubble: React.FC<{ m: Msg; fs: number }> = ({ m, fs }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typing = m.who === "ai" && f >= m.at - 26 && f < m.at;
  const k = spring({ frame: f - m.at, fps, config: { damping: 13, mass: 0.7 } });
  if (f < (m.who === "ai" ? m.at - 26 : m.at)) return null;
  const ai = m.who === "ai";
  const base: React.CSSProperties = { maxWidth: "84%", padding: `${fs * 0.55}px ${fs * 0.8}px`, borderRadius: fs * 0.9, fontFamily: BODY, fontSize: fs, lineHeight: 1.38, color: TXT };
  if (typing) return <div style={{ alignSelf: "flex-end", ...base, background: AIBUB, border: `1px solid ${MINT}55` }}><Dots /></div>;
  return (
    <div style={{ alignSelf: ai ? "flex-end" : "flex-start", ...base, background: ai ? AIBUB : CARD2, border: ai ? `1px solid ${MINT}55` : `1px solid ${LINE}`,
      borderBottomRightRadius: ai ? 6 : fs * 0.9, borderBottomLeftRadius: ai ? fs * 0.9 : 6, opacity: k, transform: `translateY(${(1 - k) * 24}px) scale(${0.9 + 0.1 * k})`, transformOrigin: ai ? "right bottom" : "left bottom" }}>
      {ai ? <span style={{ display: "block", fontFamily: LAT, fontSize: fs * 0.48, color: "#86EFAC", letterSpacing: 2, marginBottom: 2 }}>✦ AI{m.tag ? " · " + m.tag : ""}</span> : null}
      {m.text}
    </div>
  );
};
const ChatPhone: React.FC<{ x: number; y: number; w: number; msgs: Msg[]; delay?: number; rot?: number; page?: string }> = ({ x, y, w, msgs, delay = 0, rot = 0, page = "Rong Fashion" }) => {
  const f = useCurrentFrame();
  const k = useIn(delay, 14);
  const fs = w * 0.064;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: w * 0.03, borderRadius: w * 0.15, background: "#000", border: "2px solid #2A2A40",
      boxShadow: `0 50px 120px rgba(0,0,0,0.7), 0 0 80px ${VIO}38`, opacity: k, transform: `translateY(${(1 - k) * 150 + Math.sin(f / 26) * 5}px) rotate(${rot}deg)` }}>
      <div style={{ borderRadius: w * 0.12, overflow: "hidden", height: w * 1.95, background: "#0B0B13", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: w * 0.03, padding: `${w * 0.07}px ${w * 0.05}px ${w * 0.035}px`, borderBottom: `1px solid ${LINE}`, background: "#101019" }}>
          <div style={{ width: w * 0.11, height: w * 0.11, borderRadius: w, background: "linear-gradient(135deg,#B91C1C,#F59E0B)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LAT, fontWeight: 800, fontSize: w * 0.05 }}>RF</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: LAT, fontWeight: 700, fontSize: w * 0.048, color: TXT }}>{page}</div>
            <div style={{ fontFamily: LAT, fontSize: w * 0.034, color: MINT }}>● AI Auto</div>
          </div>
          <div style={{ width: w * 0.13, height: w * 0.072, borderRadius: w, background: MINT, position: "relative" }}><div style={{ position: "absolute", right: 3, top: 3, width: w * 0.06, height: w * 0.06, borderRadius: w, background: "#fff" }} /></div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: w * 0.03, padding: w * 0.045 }}>
          {msgs.map((m, i) => <Bubble key={i} m={m} fs={fs} />)}
        </div>
        <div style={{ margin: w * 0.04, padding: `${w * 0.03}px ${w * 0.045}px`, borderRadius: w, background: CARD2, fontFamily: LAT, fontSize: w * 0.04, color: MUTE }}>Aa</div>
      </div>
    </div>
  );
};

const Toast: React.FC<{ x: number; y: number; title: string; sub: string; delay: number; color?: string; scale?: number }> = ({ x, y, title, sub, delay, color = MINT, scale = 1 }) => {
  const k = useIn(delay, 12);
  const f = useCurrentFrame();
  const { L } = useC();
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 18, padding: "20px 28px", borderRadius: 22, background: "rgba(18,18,30,0.94)", border: `1px solid ${color}55`,
      boxShadow: `0 30px 70px rgba(0,0,0,0.55), 0 0 40px ${color}22`, opacity: k, transform: `translateY(${(1 - k) * 34 + Math.sin(f / 18) * 4}px) scale(${(0.88 + 0.12 * k) * scale})`, transformOrigin: "left center" }}>
      <span style={{ width: 16, height: 16, borderRadius: 16, background: color, boxShadow: `0 0 0 7px ${color}33` }} />
      <div><div style={{ fontFamily: head(L), fontSize: 30, color: TXT, fontWeight: 700 }}>{title}</div><div style={{ fontFamily: L === "bn" ? BODY : LAT, fontSize: 22, color: MUTE }}>{sub}</div></div>
    </div>
  );
};

const Pill: React.FC<{ children: React.ReactNode; color?: string; k?: number; fs?: number }> = ({ children, color = VIO, k = 1, fs = 30 }) => {
  const { L } = useC();
  return <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: `${fs * 0.42}px ${fs * 0.8}px`, borderRadius: 60, background: `${color}22`, border: `1px solid ${color}77`, color: TXT, fontFamily: L === "bn" ? BN : LAT, fontWeight: 600, fontSize: fs, opacity: k, transform: `translateY(${(1 - k) * 24}px) scale(${0.85 + 0.15 * k})` }}>{children}</div>;
};

const Cursor: React.FC<{ path: [number, number, number][] }> = ({ path }) => {
  // path: [frame, x, y]; click ripple on each point after the first
  const f = useCurrentFrame();
  const xs = interpolate(f, path.map((p) => p[0]), path.map((p) => p[1]), { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const ys = interpolate(f, path.map((p) => p[0]), path.map((p) => p[2]), { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <>
      {path.slice(1).map(([t, x, y], i) => {
        const r = lerp(f, t, t + 18);
        return f >= t ? <div key={i} style={{ position: "absolute", left: x - 40 * r, top: y - 40 * r, width: 80 * r, height: 80 * r, borderRadius: 80, border: `3px solid ${VIO2}`, opacity: 1 - r }} /> : null;
      })}
      <svg style={{ position: "absolute", left: xs, top: ys, filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.6))" }} width="44" height="44" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" strokeWidth="1.2" /></svg>
    </>
  );
};

/* ---------- scenes ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { V, L } = useC();
  const t = useT();
  const msgs: Msg[] = [
    { who: "c", text: "apu, ei three piece er dam koto? 🙂", at: 34 },
    { who: "ai", text: t("জি আপু, দাম ৳১,২৫০। M, L, XL স্টকে আছে 😊 অর্ডার করবেন?", "It's ৳1,250 — M, L and XL are in stock 😊 Shall I place the order?"), at: 118 },
  ];
  const clockX = V ? 0 : 150, clockY = V ? 230 : 300;
  return (
    <AbsoluteFill>
      <Backdrop night hue="#3B1D8F" />
      <div style={{ position: "absolute", left: clockX, right: V ? 0 : undefined, top: clockY, textAlign: V ? "center" : "left", opacity: lerp(f, 0, 16) }}>
        <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: V ? 170 : 200, color: TXT, letterSpacing: -6, lineHeight: 1 }}>2:00<span style={{ fontSize: V ? 60 : 72, color: MUTE, letterSpacing: 0 }}> AM</span></div>
        <div style={{ fontFamily: head(L), fontSize: V ? 52 : 54, color: MUTE, marginTop: 18, opacity: lerp(f, 12, 30) }}>{t("আপনি ঘুমে… 😴", "You're asleep… 😴")}</div>
        <div style={{ fontFamily: head(L), fontWeight: 800, fontSize: V ? 64 : 66, marginTop: 20, opacity: lerp(f, 150, 168), transform: `translateY(${(1 - lerp(f, 150, 168)) * 20}px)` }}>
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>{t("তবু বিক্রি চলছে", "Sales keep coming")}</span>
        </div>
      </div>
      <ChatPhone x={V ? 280 : 1130} y={V ? 720 : 60} w={V ? 520 : 480} msgs={msgs} delay={6} rot={V ? 0 : -3} />
      <Toast x={V ? 70 : 800} y={V ? 1330 : 820} title={t("AI উত্তর দিয়েছে", "AI replied")} sub={t("৩ সেকেন্ডে · আপনি ঘুমিয়ে", "in 3 seconds · while you slept")} delay={128} />
    </AbsoluteFill>
  );
};

const LogoScene: React.FC = () => {
  const f = useCurrentFrame();
  const { V, L } = useC();
  const t = useT();
  const k = useIn(2, 10), w = useIn(12), tg = useIn(30);
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {[0, 8, 16].map((d) => (
          <div key={d} style={{ position: "absolute", width: 1000, height: 1000, borderRadius: "50%", border: `2px solid ${VIO}66`, transform: `scale(${0.2 + 1.4 * lerp(f, d, d + 45)})`, opacity: 1 - lerp(f, d + 15, d + 50) }} />
        ))}
        <div style={{ display: "flex", flexDirection: V ? "column" : "row", alignItems: "center", gap: V ? 30 : 44 }}>
          <div style={{ transform: `scale(${k}) rotate(${(1 - k) * -40}deg)`, filter: `drop-shadow(0 0 70px ${VIO}99)` }}><Logo size={V ? 240 : 210} /></div>
          <div style={{ opacity: w, transform: `translateY(${(1 - w) * 30}px)`, filter: `blur(${(1 - w) * 10}px)` }}><Wordmark size={V ? 170 : 190} /></div>
        </div>
        <div style={{ position: "absolute", top: V ? 1260 : 760, fontFamily: head(L), fontSize: V ? 58 : 56, color: TXT, opacity: tg, transform: `translateY(${(1 - tg) * 20}px)` }}>
          {t("আপনার ব্যবসার ", "Your business's ")}<b style={{ color: VIO2 }}>{t("AI সেলস টিম", "AI sales team")}</b>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const LangScene: React.FC = () => {
  const { V, L } = useC();
  const t = useT();
  const rows: [string, string, string][] = [
    ["বাংলা", "জামদানি শাড়ির দাম কত?", "৳২,৪৫০ আপু, স্টকে আছে 😊"],
    ["Banglish", "dam koto vai? delivery koto din?", "৳1,250 vai, Dhaka te 2 din 👍"],
    ["English", "Is it available in XL?", "Yes! XL is in stock. Want to order?"],
  ];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Headline text={t("যেভাবে প্রশ্ন, সেভাবেই উত্তর", "Replies the way they write")} accent={t("সেভাবেই", "way").split(" ")} />
      {rows.map(([lang, q, a], i) => {
        const k = useIn(14 + i * 24), r = useIn(34 + i * 24);
        const top = V ? 560 + i * 380 : 290 + i * 240;
        return (
          <div key={lang} style={{ position: "absolute", left: V ? 70 : 220, right: V ? 70 : 220, top }}>
            <div style={{ fontFamily: LAT, fontWeight: 700, fontSize: V ? 26 : 22, color: VIO2, letterSpacing: 4, opacity: k, marginBottom: 12 }}>{lang.toUpperCase()}</div>
            <div style={{ display: "flex", flexDirection: V ? "column" : "row", justifyContent: "space-between", alignItems: V ? "stretch" : "center", gap: V ? 16 : 30 }}>
              <div style={{ alignSelf: "flex-start", padding: "20px 30px", borderRadius: 28, borderBottomLeftRadius: 6, background: CARD2, border: `1px solid ${LINE}`, color: TXT, fontFamily: BODY, fontSize: V ? 42 : 38, opacity: k, transform: `translateX(${(1 - k) * -70}px)` }}>{q}</div>
              <div style={{ alignSelf: "flex-end", padding: "20px 30px", borderRadius: 28, borderBottomRightRadius: 6, background: AIBUB, border: `1px solid ${MINT}66`, color: TXT, fontFamily: BODY, fontSize: V ? 42 : 38, opacity: r, transform: `translateX(${(1 - r) * 70}px)`, boxShadow: `0 0 40px ${MINT}22` }}>
                <span style={{ fontFamily: LAT, fontSize: V ? 18 : 16, color: "#86EFAC", letterSpacing: 2, display: "block", marginBottom: 4 }}>✦ AI</span>{a}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const InboxScene: React.FC = () => {
  const f = useCurrentFrame();
  const { V, L } = useC();
  const t = useT();
  const chips: [string, string][] = [["Messenger", "#0A84FF"], [t("কমেন্ট", "Comments"), AMBER], [t("ওয়েবসাইট চ্যাট", "Website chat"), CYAN]];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Headline text={t("সব চ্যাট, এক ইনবক্সে", "Every chat. One inbox.")} accent={t("এক", "One").split(" ")} />
      {V ? <PhoneShot src={`${L}-m-inbox.jpg`} x={260} y={520} w={560} delay={4} scrollTo={160} />
        : <Screen src={`${L}-inbox-ban.jpg`} x={230} y={230} w={1460} fx={22} fy={30} zoom={1.3} delay={4} tilt={-7} />}
      <div style={{ position: "absolute", bottom: V ? 230 : 46, left: 0, right: 0, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 18, padding: "0 40px" }}>
        {chips.map(([c, col], i) => <Pill key={c} color={col} fs={V ? 38 : 32} k={lerp(f, 34 + i * 9, 50 + i * 9)}>● {c}</Pill>)}
      </div>
    </AbsoluteFill>
  );
};

const Invoice: React.FC<{ x: number; y: number; w: number; delay: number }> = ({ x, y, w, delay }) => {
  const k = useIn(delay, 13);
  const f = useCurrentFrame();
  const { L } = useC();
  const t = useT(), n = useNum();
  const s = w / 540;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: k, transform: `translateY(${(1 - k) * 90}px) rotate(${(1 - k) * 8 + 2 * Math.sin(f / 40)}deg)` }}>
      <div style={{ background: "#fff", borderRadius: 24 * s, padding: 36 * s, color: "#111827", boxShadow: "0 50px 110px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 * s }}><div style={{ width: 56 * s, height: 56 * s, borderRadius: 14 * s, background: "linear-gradient(135deg,#B91C1C,#F59E0B)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LAT, fontWeight: 800, fontSize: 24 * s }}>RF</div><div style={{ fontFamily: LAT, fontSize: 28 * s, fontWeight: 800 }}>Rong Fashion</div></div>
          <div style={{ fontFamily: LAT, fontWeight: 800, color: "#B91C1C", fontSize: 22 * s, textAlign: "right" }}>INVOICE<br /><span style={{ fontSize: 16 * s, color: "#6B7280" }}>INV-1001</span></div>
        </div>
        {[[t("থ্রি-পিস × ২", "Three-piece × 2"), "৳" + n("2,500")], [t("ডেলিভারি (ঢাকা)", "Delivery (Dhaka)"), "৳" + n("60")]].map(([a, b]) => (
          <div key={a} style={{ display: "flex", justifyContent: "space-between", padding: `${14 * s}px 0`, borderBottom: "1px solid #F3F4F6", fontFamily: L === "bn" ? BODY : LAT, fontSize: 24 * s, marginTop: 6 * s }}><span>{a}</span><span>{b}</span></div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16 * s, fontFamily: head(L), fontSize: 32 * s, fontWeight: 800 }}><span>{t("মোট", "Total")}</span><span style={{ color: "#B91C1C" }}>৳{n("2,560")}</span></div>
      </div>
    </div>
  );
};

const OrderScene: React.FC = () => {
  const { V } = useC();
  const t = useT();
  const msgs: Msg[] = [
    { who: "c", text: t("নাম রাহিমা, মিরপুর ১০। ক্যাশ অন ডেলিভারি।", "Rahima, Mirpur 10. Cash on delivery please."), at: 14 },
    { who: "ai", text: t("✅ অর্ডার #1001 কনফার্ম! মোট ৳২,৫৬০", "✅ Order #1001 confirmed! Total ৳2,560"), at: 66, tag: "order" },
    { who: "ai", text: "📎 INV-1001.pdf", at: 118, tag: "invoice" },
  ];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Headline text={t("চ্যাটেই অর্ডার, সাথে ইনভয়েস", "Orders & invoices, in chat")} accent={t("অর্ডার, ইনভয়েস", "invoices,").split(" ")} />
      <ChatPhone x={V ? 110 : 280} y={V ? 500 : 200} w={V ? 560 : 470} msgs={msgs} delay={2} rot={-2} />
      <Invoice x={V ? 470 : 960} y={V ? 1150 : 330} w={V ? 520 : 660} delay={84} />
    </AbsoluteFill>
  );
};

const CourierScene: React.FC = () => {
  const f = useCurrentFrame();
  const { V, L } = useC();
  const t = useT(), n = useNum();
  const k = useIn(4);
  const pick = f >= 44, booking = f >= 78 && f < 104, booked = f >= 104;
  const W0 = V ? 900 : 860, X0 = V ? 90 : 140, Y0 = V ? 540 : 270;
  const couriers = ["Steadfast", "Pathao", "RedX"];
  const msgs: Msg[] = [{ who: "ai", text: t("📦 আপনার পার্সেল রওনা দিয়েছে! ট্র্যাক করুন: 🔗", "📦 Your parcel is on its way! Track it here: 🔗"), at: 128, tag: t("ট্র্যাকিং", "tracking") }];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Headline text={t("এক ক্লিকে কুরিয়ার", "Courier in one click")} accent={t("এক ক্লিকে", "one click").split(" ")} />
      <div style={{ position: "absolute", left: X0, top: Y0, width: W0, padding: 40, borderRadius: 30, background: CARD, border: `1px solid ${LINE}`, boxShadow: `0 50px 120px rgba(0,0,0,0.6)`, opacity: k, transform: `translateY(${(1 - k) * 70}px)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: 46, color: TXT }}>#1002</div>
            <div style={{ fontFamily: L === "bn" ? BODY : LAT, fontSize: 28, color: MUTE }}>Nusrat Jahan · Dhanmondi</div>
          </div>
          <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: 44, color: TXT }}>৳{n("2,580")}</div>
        </div>
        <div style={{ fontFamily: head(L), fontSize: 28, color: MUTE, margin: "34px 0 16px" }}>{t("কুরিয়ার বেছে নিন", "Choose courier")}</div>
        <div style={{ display: "flex", gap: 16 }}>
          {couriers.map((c, i) => {
            const on = pick && i === 0;
            return <div key={c} style={{ flex: 1, textAlign: "center", padding: "22px 0", borderRadius: 18, fontFamily: LAT, fontWeight: 700, fontSize: 30, color: on ? "#fff" : TXT, background: on ? VIO : CARD2, border: `1px solid ${on ? VIO2 : LINE}`, boxShadow: on ? `0 0 40px ${VIO}66` : "none" }}>{c}</div>;
          })}
        </div>
        <div style={{ marginTop: 28, padding: "24px 0", textAlign: "center", borderRadius: 20, fontFamily: head(L), fontWeight: 700, fontSize: 34, color: "#fff",
          background: booked ? MINT : `linear-gradient(90deg, ${VIO}, #6D28D9)`, transform: `scale(${f >= 78 && f < 86 ? 0.96 : 1})` }}>
          {booked ? t("✓ বুকড · SF-48213", "✓ Booked · SF-48213") : booking ? t("বুকিং হচ্ছে…", "Booking…") : t("কুরিয়ার বুক করুন", "Book courier")}
        </div>
        {booking ? <div style={{ height: 6, marginTop: 14, borderRadius: 6, background: CARD2, overflow: "hidden" }}><div style={{ width: `${lerp(f, 78, 104) * 100}%`, height: "100%", background: GRAD }} /></div> : null}
      </div>
      <Cursor path={V ? [[10, 900, 1500], [40, 260, 990], [74, 540, 1120]] : [[10, 1000, 900], [40, 320, 700], [74, 540, 830]]} />
      {V ? <Toast x={140} y={1150} title={t("ট্র্যাকিং লিংক গেছে 📦", "Tracking link sent 📦")} sub={t("কাস্টমারের Messenger-এ", "to the customer on Messenger")} delay={110} />
        : <ChatPhone x={1180} y={180} w={470} msgs={msgs} delay={108} rot={3} />}
    </AbsoluteFill>
  );
};

const PayScene: React.FC = () => {
  const f = useCurrentFrame();
  const { V, L } = useC();
  const t = useT(), n = useNum();
  const k = useIn(4);
  const scan = lerp(f, 24, 70);
  const checks = [t("টাকার অঙ্ক = অর্ডার #1002", "Amount matches order #1002"), t("TrxID নতুন, আগে ব্যবহার হয়নি", "TrxID is new — never used"), t("সঠিক নম্বরে পাঠানো", "Sent to the right number")];
  const rw = V ? 620 : 600, rx = V ? 230 : 170, ry = V ? 500 : 250;
  return (
    <AbsoluteFill>
      <Backdrop hue="#9D174D" />
      <Headline text={t("পেমেন্ট মিলিয়ে দেখে AI", "AI checks the payment")} accent={["AI"]} />
      <div style={{ position: "absolute", left: rx, top: ry, width: rw, borderRadius: 30, overflow: "hidden", background: "#fff", boxShadow: "0 50px 120px rgba(0,0,0,0.6)", opacity: k, transform: `translateY(${(1 - k) * 80}px) rotate(-2deg)` }}>
        <div style={{ background: PINK, padding: "26px 34px", fontFamily: LAT, fontWeight: 800, fontSize: 36, color: "#fff" }}>bKash · Send Money</div>
        <div style={{ padding: 34, color: "#111" }}>
          {[["Amount", "৳2,580"], ["TrxID", "BK7Q2M9XLP"], ["To", "017XX-XXX420"], ["Time", "10:42 PM"]].map(([a, b]) => (
            <div key={a} style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #eee", fontFamily: LAT, fontSize: 30 }}><span style={{ color: "#6B7280" }}>{a}</span><b>{b}</b></div>
          ))}
          <div style={{ marginTop: 18, fontFamily: LAT, fontWeight: 700, fontSize: 28, color: "#16A34A" }}>✓ Successful</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: `${scan * 100}%`, height: 6, background: CYAN, boxShadow: `0 0 40px 12px ${CYAN}AA`, opacity: f > 22 && f < 74 ? 1 : 0 }} />
      </div>
      <div style={{ position: "absolute", left: V ? 90 : 880, right: V ? 90 : 120, top: V ? 1190 : 290, display: "flex", flexDirection: "column", gap: V ? 22 : 26 }}>
        {checks.map((c, i) => {
          const ck = useIn(76 + i * 14, 12);
          return (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 22, padding: "24px 30px", borderRadius: 22, background: CARD, border: `1px solid ${MINT}55`, opacity: ck, transform: `translateX(${(1 - ck) * 60}px)` }}>
              <span style={{ width: 52, height: 52, borderRadius: 52, background: MINT, color: "#04120A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, transform: `scale(${ck})` }}>✓</span>
              <span style={{ fontFamily: L === "bn" ? BN : LAT, fontWeight: 600, fontSize: V ? 38 : 40, color: TXT }}>{c}</span>
            </div>
          );
        })}
        <div style={{ fontFamily: head(L), fontSize: V ? 36 : 32, color: AMBER, marginTop: 10, opacity: lerp(f, 126, 140) }}>{t("✋ শেষে কনফার্ম করবেন আপনি", "✋ You give the final OK")}</div>
      </div>
    </AbsoluteFill>
  );
};

const LearnScene: React.FC = () => {
  const f = useCurrentFrame();
  const { V, L } = useC();
  const t = useT(), n = useNum();
  const k = useIn(4);
  const strike = lerp(f, 30, 44), fix = useIn(54, 13), saved = useIn(86, 12);
  const items = [t("ঢাকায় ডেলিভারি ৳৬০, বাইরে ৳১২০", "Delivery ৳60 in Dhaka, ৳120 outside"), t("শুক্রবার দোকান বন্ধ", "Closed on Fridays"), t("XL সাইজে ৳১০০ বেশি", "XL costs ৳100 extra")];
  const count = Math.round(lerp(f, 90, 150, 127, 128));
  const cw = V ? 900 : 820;
  return (
    <AbsoluteFill>
      <Backdrop hue="#4C1D95" />
      <Headline text={t("একবার শেখালেই, মনে রাখে", "Correct it once. It remembers.")} accent={t("মনে রাখে", "remembers.").split(" ")} />
      <div style={{ position: "absolute", left: V ? 90 : 170, top: V ? 520 : 280, width: cw, opacity: k, transform: `translateY(${(1 - k) * 60}px)` }}>
        <div style={{ fontFamily: LAT, fontSize: 22, color: "#86EFAC", letterSpacing: 3, marginBottom: 12 }}>✦ AI DRAFT</div>
        <div style={{ padding: "26px 32px", borderRadius: 26, background: AIBUB, border: `1px solid ${MINT}55`, fontFamily: BODY, fontSize: V ? 42 : 40, color: TXT, position: "relative" }}>
          <span style={{ opacity: 1 - 0.55 * strike }}>{t("ডেলিভারি চার্জ ৳৮০", "Delivery charge is ৳80")}</span>
          <div style={{ position: "absolute", left: 32, top: "52%", height: 4, width: `${strike * 60}%`, background: "#F87171" }} />
        </div>
        <div style={{ marginTop: 20, padding: "26px 32px", borderRadius: 26, background: CARD2, border: `2px solid ${VIO2}`, fontFamily: BODY, fontSize: V ? 42 : 40, color: TXT, opacity: fix, transform: `translateY(${(1 - fix) * 30}px)` }}>
          <span style={{ fontFamily: LAT, fontSize: 18, color: VIO2, letterSpacing: 2, display: "block", marginBottom: 6 }}>✎ {t("আপনি ঠিক করলেন", "YOU EDITED")}</span>
          {items[0]}
        </div>
        <div style={{ marginTop: 22, opacity: saved, transform: `scale(${0.8 + 0.2 * saved})`, transformOrigin: "left" }}><Pill color={MINT} fs={V ? 34 : 30}>✦ {t("AI শিখে নিয়েছে", "AI learned this")}</Pill></div>
      </div>
      <div style={{ position: "absolute", left: V ? 90 : 1100, right: V ? 90 : 140, top: V ? 1240 : 290, padding: 34, borderRadius: 28, background: CARD, border: `1px solid ${LINE}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: head(L), fontWeight: 700, fontSize: 34, color: TXT }}>{t("AI যা শিখেছে", "What the AI learned")}</div>
          <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: 40, color: MINT }}>{n(count)}</div>
        </div>
        {items.map((it, i) => {
          const ik = i === 0 ? saved : useIn(14 + i * 8);
          return <div key={it} style={{ marginTop: 18, padding: "18px 22px", borderRadius: 16, background: i === 0 ? `${MINT}18` : CARD2, border: `1px solid ${i === 0 ? MINT + "66" : LINE}`, fontFamily: L === "bn" ? BODY : LAT, fontSize: V ? 32 : 28, color: TXT, opacity: ik, transform: `translateY(${(1 - ik) * 20}px)` }}>{it}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const ReportsScene: React.FC = () => {
  const f = useCurrentFrame();
  const { V, L } = useC();
  const t = useT(), n = useNum();
  const kpi: [string, number, string, string, string][] = [[t("AI উত্তর দিয়েছে", "AI replied"), 85, "", "%", VIO2], [t("গড় উত্তর", "Avg. reply"), 33, "", t(" সে", "s"), CYAN], [t("বিক্রি", "Sales"), 5140, "৳", "", MINT]];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Headline text={t("পুরো ব্যবসা, এক নজরে", "Your business at a glance")} accent={t("এক নজরে", "glance").split(" ")} />
      {V ? <PhoneShot src={`${L}-m-reports.jpg`} x={270} y={500} w={540} delay={4} scrollTo={120} />
        : <Screen src={`${L}-reports.jpg`} x={100} y={240} w={1180} fx={40} fy={40} zoom={1.3} delay={4} tilt={6} />}
      <div style={{ position: "absolute", left: V ? 60 : 1340, right: V ? 60 : 110, top: V ? 1480 : 270, display: "flex", flexDirection: V ? "row" : "column", gap: 18 }}>
        {kpi.map(([l, v, pre, suf, col], i) => {
          const k = useIn(24 + i * 10);
          const val = Math.round(lerp(f, 28 + i * 10, 90 + i * 10, 0, v));
          return (
            <div key={l} style={{ flex: 1, padding: V ? "22px 20px" : "26px 30px", borderRadius: 22, background: CARD, border: `1px solid ${LINE}`, opacity: k, transform: `translateY(${(1 - k) * 40}px)` }}>
              <div style={{ fontFamily: L === "bn" ? BN : LAT, fontSize: V ? 24 : 26, color: MUTE }}>{l}</div>
              <div style={{ fontFamily: LAT, fontSize: V ? 52 : 64, fontWeight: 800, color: col }}>{pre}{n(val.toLocaleString("en-US"))}{suf}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const BizScene: React.FC = () => {
  const f = useCurrentFrame();
  const { V, L } = useC();
  const t = useT();
  const biz = [["🛍️", "অনলাইন শপ", "Online shop"], ["🩺", "ক্লিনিক", "Clinic"], ["🎓", "কোচিং", "Coaching"], ["🍽️", "রেস্টুরেন্ট", "Restaurant"], ["💇", "সেলুন", "Salon"], ["✈️", "ট্রাভেল", "Travel"],
    ["💍", "জুয়েলারি", "Jewellery"], ["🏠", "রিয়েল এস্টেট", "Real estate"], ["💻", "IT এজেন্সি", "IT agency"], ["🎂", "বেকারি", "Bakery"], ["💊", "ফার্মেসি", "Pharmacy"], ["🚗", "রেন্ট-এ-কার", "Car rental"]];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Headline text={t("যেকোনো ব্যবসা, যেকোনো পেজ", "Any business. Any page.")} accent={t("যেকোনো", "Any").split(" ")} />
      <div style={{ position: "absolute", left: V ? 70 : 170, right: V ? 70 : 170, top: V ? 560 : 310, display: "grid", gridTemplateColumns: `repeat(${V ? 3 : 4}, 1fr)`, gap: V ? 22 : 24 }}>
        {biz.map(([e, b, en], i) => {
          const k = lerp(f, 12 + i * 4, 30 + i * 4);
          return (
            <div key={b} style={{ padding: V ? "36px 0" : "30px 0", textAlign: "center", borderRadius: 26, background: CARD, border: `1px solid ${LINE}`, opacity: k, transform: `translateY(${(1 - k) * 50}px) scale(${0.88 + 0.12 * k})` }}>
              <div style={{ fontSize: V ? 64 : 56 }}>{e}</div>
              <div style={{ fontFamily: L === "bn" ? BN : LAT, fontWeight: 600, fontSize: V ? 34 : 32, color: TXT, marginTop: 6 }}>{L === "bn" ? b : en}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { V, L } = useC();
  const t = useT();
  const k = useIn(2, 11), b = useIn(24, 12);
  const glow = 0.5 + 0.5 * Math.sin(f / 7);
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: V ? 46 : 34 }}>
        <div style={{ display: "flex", flexDirection: V ? "column" : "row", alignItems: "center", gap: V ? 26 : 34, transform: `scale(${0.88 + 0.12 * k})`, opacity: k }}>
          <Logo size={V ? 200 : 170} />
          <Wordmark size={V ? 150 : 150} />
        </div>
        <div style={{ fontFamily: head(L), fontWeight: 700, fontSize: V ? 64 : 58, color: TXT, opacity: lerp(f, 14, 30) }}>{t("আজই ফ্রি শুরু করুন", "Start free today")}</div>
        <div style={{ padding: V ? "26px 46px" : "22px 52px", borderRadius: 70, background: `linear-gradient(90deg, ${VIO}, #6D28D9)`, fontFamily: LAT, fontWeight: 700, fontSize: V ? 46 : 42, color: "#fff", opacity: b, transform: `scale(${0.85 + 0.15 * b})`, boxShadow: `0 0 ${40 + 34 * glow}px ${VIO}99` }}>bizpilot.dreamithq.com</div>
        <div style={{ fontFamily: head(L), fontSize: V ? 40 : 36, color: AMBER, textAlign: "center", padding: "0 60px", opacity: lerp(f, 46, 64) }}>⚡ {t("প্রথম ১০০ ব্যবসা · ৩ মাস একদম ফ্রি", "First 100 businesses · 3 months free")}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- AI ads ---------- */
const AdHook: React.FC = () => {
  const f = useCurrentFrame();
  const { V, L } = useC();
  const t = useT();
  const { width: W, height: H } = useVideoConfig();
  const opts = ["Campaign objective", "Ad set", "Audience", "Detailed targeting", "Placements", "Pixel", "Bid strategy", "Budget", "Schedule", "Lookalike", "A/B test", "Advantage+", "Conversion API", "Frequency cap"];
  const snap = lerp(f, 118, 132);
  const shake = f < 118 ? Math.sin(f * 1.7) * 6 * lerp(f, 30, 100) : 0;
  const pop = useIn(120, 9);
  return (
    <AbsoluteFill>
      <Backdrop hue={snap > 0.5 ? VIO : "#7F1D1D"} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${shake}px)`, opacity: 1 - snap }}>
        {opts.map((o, i) => {
          const k = lerp(f, 6 + i * 4, 20 + i * 4);
          const x = ((i * 0.37 + 0.06) % 0.8) * W, y = (V ? 0.3 : 0.26) * H + ((i * 0.53) % 0.62) * H * (V ? 0.75 : 0.68);
          return <div key={o} style={{ position: "absolute", left: x, top: y, padding: "14px 22px", borderRadius: 14, background: CARD2, border: `1px solid ${i % 4 === 0 ? "#F8717188" : LINE}`, fontFamily: LAT, fontWeight: 600, fontSize: V ? 30 : 28, color: MUTE,
            opacity: k, transform: `rotate(${((i * 37) % 21) - 10}deg) scale(${0.7 + 0.3 * k})` }}>⚙ {o}</div>;
        })}
        <div style={{ position: "absolute", left: V ? 120 : 640, top: V ? 1300 : 760, padding: "18px 28px", borderRadius: 18, background: "#3B0D0D", border: "1px solid #F87171", fontFamily: LAT, fontWeight: 700, fontSize: 30, color: "#FCA5A5", opacity: lerp(f, 70, 82) }}>⚠ Ad rejected · Learning limited</div>
      </div>
      <Headline text={t("ফেসবুকে বিজ্ঞাপন দেওয়া ঝামেলা?", "Facebook ads feel like a headache?")} accent={t("ঝামেলা?", "headache?").split(" ")} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: head(L), fontWeight: 800, fontSize: V ? 130 : 150, color: TXT, opacity: snap, transform: `scale(${0.6 + 0.4 * pop})`, textAlign: "center" }}>
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>{t("নো প্রবলেম!", "No problem!")}</span> 😎
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const AdPrompt: React.FC = () => {
  const f = useCurrentFrame();
  const { V, L } = useC();
  const t = useT(), n = useNum();
  const prompt = t("ঢাকার মেয়েদের জন্য কুর্তির বিজ্ঞাপন, ৭ দিনে ৩৫০০ টাকা, মেসেজ বেশি চাই", "Kurti ad for women in Dhaka, ৳3,500 for 7 days, I want more messages");
  const chars = Math.round(lerp(f, 8, 70, 0, prompt.length));
  const built = f >= 92;
  const rows: [string, string][] = [[t("লক্ষ্য", "Goal"), t("💬 Messenger মেসেজ", "💬 Messenger messages")], [t("অডিয়েন্স", "Audience"), t("👩 ঢাকা · নারী · ১৮–৩৫", "👩 Dhaka · Women · 18–35")], [t("বাজেট", "Budget"), "৳" + n(500) + t("/দিন × ৭ দিন", "/day × 7 days")], [t("বিজ্ঞাপনের লেখা", "Ad copy"), t("✍️ AI লিখে দিয়েছে", "✍️ Written by AI")]];
  const bx = V ? 70 : 150, bw = V ? 940 : 800;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Headline text={t("শুধু লিখুন কী চান", "Just type what you want")} accent={t("লিখুন", "type").split(" ")} />
      <div style={{ position: "absolute", left: bx, top: V ? 470 : 330, width: bw, padding: 30, borderRadius: 28, background: CARD, border: `2px solid ${VIO}88`, boxShadow: `0 0 60px ${VIO}33` }}>
        <div style={{ fontFamily: LAT, fontSize: 22, color: VIO2, letterSpacing: 3, marginBottom: 12 }}>✦ {t("নতুন ক্যাম্পেইন", "NEW CAMPAIGN")}</div>
        <div style={{ fontFamily: L === "bn" ? BODY : LAT, fontSize: V ? 42 : 38, color: TXT, minHeight: V ? 170 : 150, lineHeight: 1.4 }}>{prompt.slice(0, chars)}<span style={{ opacity: f % 16 < 8 ? 1 : 0, color: VIO2 }}>|</span></div>
        <div style={{ marginTop: 14, display: "inline-block", padding: "16px 30px", borderRadius: 16, background: `linear-gradient(90deg, ${VIO}, #6D28D9)`, fontFamily: head(L), fontWeight: 700, fontSize: 30, color: "#fff", transform: `scale(${f >= 76 && f < 84 ? 0.94 : 1})` }}>
          {f >= 78 && !built ? t("AI বানাচ্ছে…", "AI is building…") : t("✦ AI প্ল্যান বানাও", "✦ Create AI plan")}
        </div>
      </div>
      <Cursor path={V ? [[40, 900, 1700], [76, 240, 820]] : [[40, 900, 900], [76, 330, 560]]} />
      <div style={{ position: "absolute", left: V ? 70 : 1010, right: V ? 70 : 130, top: V ? 990 : 290, display: "flex", flexDirection: "column", gap: 20 }}>
        {rows.map(([a, b], i) => {
          const k = useIn(94 + i * 9, 12);
          return (
            <div key={a} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: V ? "22px 28px" : "30px 32px", borderRadius: 20, background: CARD, border: `1px solid ${LINE}`, opacity: k, transform: `translateX(${(1 - k) * 60}px)` }}>
              <span style={{ fontFamily: L === "bn" ? BN : LAT, fontSize: V ? 30 : 28, color: MUTE }}>{a}</span>
              <span style={{ fontFamily: L === "bn" ? BN : LAT, fontWeight: 700, fontSize: V ? 34 : 32, color: TXT }}>{b}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const AdLaunch: React.FC = () => {
  const f = useCurrentFrame();
  const { V, L } = useC();
  const t = useT();
  const k = useIn(2);
  const live = f >= 58;
  const pw = V ? 700 : 620, px = V ? 190 : 170, py = V ? 470 : 200;
  const inbox = [["Sadia", t("আপু কুর্তিটা কত?", "How much is the kurti?")], ["Nusrat", t("লাল রংটা আছে?", "Is the red one available?")], ["Mim", t("Mirpur e delivery hobe?", "Delivery to Mirpur?")]];
  const iks = inbox.map((_, i) => useIn(80 + i * 16, 12));
  return (
    <AbsoluteFill>
      <Backdrop hue={live ? "#15803D" : VIO} />
      <Headline text={t("অ্যাপ্রুভ করুন, ব্যাস!", "Approve. Done.")} accent={t("ব্যাস!", "Done.").split(" ")} />
      <div style={{ position: "absolute", left: px, top: py, width: pw, borderRadius: 26, overflow: "hidden", background: "#fff", boxShadow: "0 50px 120px rgba(0,0,0,0.6)", opacity: k, transform: `translateY(${(1 - k) * 70}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 22 }}>
          <div style={{ width: 58, height: 58, borderRadius: 58, background: "linear-gradient(135deg,#B91C1C,#F59E0B)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LAT, fontWeight: 800, fontSize: 22 }}>RF</div>
          <div><div style={{ fontFamily: LAT, fontWeight: 700, fontSize: 26, color: "#111" }}>Rong Fashion</div><div style={{ fontFamily: LAT, fontSize: 18, color: "#6B7280" }}>Sponsored</div></div>
        </div>
        <div style={{ padding: "0 22px 16px", fontFamily: L === "bn" ? BODY : LAT, fontSize: 26, color: "#111" }}>{t("নতুন লিনেন কুর্তি এসেছে 🌸 ঢাকায় ২ দিনে ডেলিভারি!", "New linen kurtis are in 🌸 2-day delivery in Dhaka!")}</div>
        <div style={{ height: pw * 0.62, background: "linear-gradient(135deg,#FDE68A,#F472B6 55%,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: pw * 0.2 }}>👗</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 20, background: "#F3F4F6" }}>
          <span style={{ fontFamily: L === "bn" ? BN : LAT, fontWeight: 700, fontSize: 24, color: "#111" }}>{t("লিনেন কুর্তি · ৳১,২৯০", "Linen kurti · ৳1,290")}</span>
          <span style={{ padding: "12px 20px", borderRadius: 10, background: "#E5E7EB", fontFamily: LAT, fontWeight: 700, fontSize: 22, color: "#111" }}>💬 Send message</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: V ? 190 : 840, top: V ? 1330 : 420, width: V ? 700 : 300, padding: "24px 0", textAlign: "center", borderRadius: 22, fontFamily: head(L), fontWeight: 800, fontSize: 38, color: "#fff",
        background: live ? MINT : `linear-gradient(90deg, ${VIO}, #6D28D9)`, boxShadow: live ? `0 0 60px ${MINT}66` : `0 0 40px ${VIO}66`, transform: `scale(${f >= 46 && f < 54 ? 0.94 : 1})` }}>
        {live ? t("● লাইভ", "● Live") : t("✓ অ্যাপ্রুভ", "✓ Approve")}
      </div>
      <Cursor path={V ? [[8, 900, 1800], [44, 540, 1370]] : [[8, 1300, 950], [44, 980, 460]]} />
      {V ? <Toast x={150} y={1480} title={t("নতুন মেসেজ আসছে 💬", "New messages coming in 💬")} sub={t("সরাসরি Bizpilot ইনবক্সে", "straight into your Bizpilot inbox")} delay={80} /> : (
        <div style={{ position: "absolute", left: 1200, right: 100, top: 300, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontFamily: head(L), fontSize: 30, color: MUTE, opacity: lerp(f, 70, 84) }}>{t("ইনবক্সে মেসেজ আসছে…", "Messages arriving…")}</div>
          {inbox.map(([nm, m], i) => (
            <div key={nm} style={{ padding: "18px 22px", borderRadius: 20, background: CARD2, border: `1px solid ${LINE}`, opacity: iks[i], transform: `translateY(${(1 - iks[i]) * 30}px)` }}>
              <div style={{ fontFamily: LAT, fontWeight: 700, fontSize: 22, color: VIO2 }}>{nm}</div>
              <div style={{ fontFamily: L === "bn" ? BODY : LAT, fontSize: 28, color: TXT }}>{m}</div>
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

const SCENES: Record<string, React.FC> = { hook: Hook, logo: LogoScene, lang: LangScene, inbox: InboxScene, order: OrderScene, courier: CourierScene, pay: PayScene, learn: LearnScene, reports: ReportsScene, biz: BizScene, cta: Cta, adhook: AdHook, adprompt: AdPrompt, adlaunch: AdLaunch, adcta: Cta };
const SFX: Record<string, string> = { logo: "boom", lang: "whoosh", inbox: "whoosh", order: "shimmer", courier: "whoosh", pay: "riser", learn: "shimmer", reports: "whoosh", biz: "whoosh", cta: "boom", adhook: "riser", adprompt: "whoosh", adlaunch: "shimmer", adcta: "boom" };

// Scene wrapper: zoom-blur in/out + a light sweep on entry.
const Wrap: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const { width: W } = useVideoConfig();
  const i = lerp(f, 0, 10), o = lerp(f, len - 8, len);
  const sweep = lerp(f, 2, 22);
  return (
    <AbsoluteFill style={{ opacity: Math.min(i, 1 - o), transform: `scale(${1.06 - 0.06 * i + 0.05 * o})`, filter: `blur(${(1 - i) * 14 + o * 14}px)` }}>
      {children}
      <div style={{ position: "absolute", top: -200, bottom: -200, width: W * 0.25, left: -W * 0.3 + sweep * W * 1.6, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)", transform: "skewX(-18deg)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const Bp3: React.FC<Bp3Props> = ({ lang, scenes }) => {
  const { durationInFrames, width, height } = useVideoConfig();
  const f = useCurrentFrame();
  const V = height > width;
  const music = Math.min(lerp(f, 0, 20, 0, 0.2), lerp(f, durationInFrames - 50, durationInFrames, 0.2, 0));
  return (
    <Ctx.Provider value={{ L: lang, V }}>
      <AbsoluteFill style={{ background: BG }}>
        <Audio src={S("music.mp3")} volume={() => music} />
        {bp3Timeline(lang, scenes).map(({ p, from, len }) => {
          const Sc = SCENES[p];
          return (
            <Sequence key={p} from={from} durationInFrames={len}>
              <Wrap len={len}><Sc /></Wrap>
              <Sequence from={LEAD}><Audio src={S(`vo/${lang}/${p}.mp3`)} /></Sequence>
              {SFX[p] ? <Audio src={staticFile(`dgsfx/${SFX[p]}.mp3`)} volume={0.28} /> : null}
            </Sequence>
          );
        })}
        <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45))" }} />
      </AbsoluteFill>
    </Ctx.Provider>
  );
};

export const BP3_COMPS: { id: string; lang: Lang; scenes: string[]; v: boolean }[] = [
  { id: "BP3-bn", lang: "bn", v: false, scenes: ["hook", "logo", "lang", "inbox", "order", "courier", "pay", "learn", "reports", "biz", "cta"] },
  { id: "BP3-en", lang: "en", v: false, scenes: ["hook", "logo", "lang", "inbox", "order", "courier", "pay", "learn", "reports", "biz", "cta"] },
  { id: "BP3R-bn-sleep", lang: "bn", v: true, scenes: ["hook", "lang", "cta"] },
  { id: "BP3R-bn-courier", lang: "bn", v: true, scenes: ["courier", "pay", "cta"] },
  { id: "BP3R-en-sleep", lang: "en", v: true, scenes: ["hook", "lang", "cta"] },
  { id: "BP3R-bn-ads", lang: "bn", v: true, scenes: ["adhook", "adprompt", "adlaunch", "adcta"] },
  { id: "BP3-bn-ads", lang: "bn", v: false, scenes: ["adhook", "adprompt", "adlaunch", "adcta"] },
  { id: "BP3R-en-inbox", lang: "en", v: true, scenes: ["inbox", "order", "reports", "cta"] },
];
