// AI University brand film (owner's own story script, polished; 2026-11-13). Slow, calm pacing.
// Brand C "Caret": ink #14151B, white, one signal orange (#FF5A1F) only for the caret; Anek Bangla; no gradients in UI.
// Lines + captions: src/aiufilm/script.json (VO Tanvir via OpenRouter → public/aiufilm/vo/NN.mp3, lengths durs.json).
// Visuals: 2 Veo Lite clips (campus, village), fresh live-site screenshots (work/aiufilm/shots.py), real app screens, motion type.
// Comps: AIUF-H 1920x1080 (all lines), AIUF-V 1080x1920 reel (lines with reel=1, minus s18).
import React from "react";
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing,
  delayRender, continueRender,
} from "remotion";
import DURS from "./durs.json";
import LINES from "./script.json";

const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
const S = (p: string) => staticFile("aiufilm/" + p);

const INK = "#101116", INK2 = "#1A1B22", LINE = "#2A2C35", PAPER = "#F4F4F1", WHITE = "#FFFFFF", GREY = "#A3A6B2", ORANGE = "#FF5A1F";
const FONT = "AnekF, 'Anek Bangla', 'Hind Siliguri', sans-serif";
const LAT = "Montserrat, Poppins, sans-serif";

if (typeof document !== "undefined") {
  const h = delayRender("fonts");
  const ff = new FontFace("AnekF", `url(${staticFile("fonts/AnekBangla.ttf")})`, { weight: "100 800", stretch: "75% 125%" });
  ff.load().then((x) => { document.fonts.add(x); continueRender(h); }).catch(() => continueRender(h));
}

type Line = { id: string; text: string; cap: string; sub?: string; vis: string; reel: number };
const L = LINES as Line[];
const D = DURS as Record<string, number>;
type Mode = "h" | "v";
const useMode = (): Mode => { const { width, height } = useVideoConfig(); return height > width ? "v" : "h"; };
const pick = <T,>(m: Mode, h: T, v: T) => (m === "v" ? v : h);
const useIn = (d = 0, damping = 18, mass = 1) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - d, fps, config: { damping, mass } }); };

/* ───────── timeline ───────── */
const LEAD = 10, FADE = 14;
const TAIL: Record<Mode, number> = { h: 26, v: 18 };
const EXTRA: Record<string, number> = { s01: 20, s03: 14, s04: 30, s19: 110 };
export const items = (m: Mode) => {
  const list = m === "h" ? L : L.filter((l) => l.reel && l.id !== "s18");
  let at = 0;
  return list.map((l) => {
    const len = LEAD + Math.round(D[l.id] * FPS) + TAIL[m] + (EXTRA[l.id] ?? 0);
    const it = { ...l, from: at, len, vo: `vo/${String(L.indexOf(l) + 1).padStart(2, "0")}.mp3` };
    at += len; return it;
  });
};
export const total = (m: Mode) => { const t = items(m); const x = t[t.length - 1]; return x.from + x.len; };

/* ───────── type ───────── */
const Caret: React.FC<{ h: number; on?: boolean }> = ({ h, on = true }) => {
  const f = useCurrentFrame();
  const vis = on && Math.floor(f / 17) % 2 === 0;
  return <span style={{ display: "inline-block", width: h * 0.09, height: h * 0.92, background: ORANGE, marginLeft: h * 0.12, verticalAlign: "-0.12em", opacity: vis ? 1 : 0 }} />;
};

// big caption: words rise one by one, caret sits after the last word
const BigCap: React.FC<{ text: string; size: number; delay?: number; align?: "left" | "center"; color?: string; caret?: boolean; stretch?: number }> =
  ({ text, size, delay = LEAD, align = "left", color = WHITE, caret = true, stretch = 112 }) => {
  const f = useCurrentFrame();
  const words = text.replace(/ · /g, " · ").split(" ");
  return (
    <div style={{ fontFamily: FONT, fontWeight: 700, fontStretch: `${stretch}%`, fontSize: size, lineHeight: 1.18, color, textAlign: align, textWrap: "balance" as never }}>
      {words.map((w, i) => {
        const k = lerp(f, delay + i * 5, delay + i * 5 + 22);
        return <span key={i} style={{ display: "inline-block", marginRight: "0.22em", opacity: k, transform: `translateY(${(1 - k) * 0.35 * size}px)`, filter: `blur(${(1 - k) * 6}px)` }}>{w}</span>;
      })}
      {caret ? <Caret h={size} on={f > delay + words.length * 5} /> : null}
    </div>
  );
};

// subtitle: the spoken line, word-highlighted along the VO (sound-off viewers)
const SubLine: React.FC<{ text: string; dur: number; size: number; align?: "left" | "center"; dark?: boolean }> = ({ text, dur, size, align = "left", dark }) => {
  const f = useCurrentFrame() - LEAD;
  if (f < -4) return null;
  const clean = text.replace(/\.\.\./g, "…");
  const words = clean.split(" ");
  const n = interpolate(f, [0, dur * FPS * 0.92], [0, words.length], clamp);
  return (
    <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: size, lineHeight: 1.45, textAlign: align, opacity: lerp(f, -4, 6) }}>
      {words.map((w, i) => <span key={i} style={{ color: i < n ? (dark ? "#14151B" : WHITE) : (dark ? "#9A9CA6" : "rgba(255,255,255,0.42)") }}>{w} </span>)}
    </div>
  );
};

/* ───────── visuals ───────── */
const Clip: React.FC<{ src: string; from?: number; len: number; z0?: number; z1?: number; dim?: number; ox?: number }> = ({ src, from = 0, len, z0 = 1.02, z1 = 1.12, dim = 0.25, ox = 50 }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, len], [z0, z1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: INK }}>
      <OffthreadVideo src={S(`clips/${src}.mp4`)} startFrom={Math.round(from * FPS)} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${ox}% 50%`, transform: `scale(${z})` }} />
      <AbsoluteFill style={{ background: `rgba(16,17,22,${dim})` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(16,17,22,0) 45%, rgba(16,17,22,0.88) 100%)" }} />
    </AbsoluteFill>
  );
};

const Ink: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${LINE} 1.4px, transparent 1.4px)`, backgroundSize: "44px 44px", backgroundPosition: `0 ${-f * 0.25}px`, opacity: 0.55,
        maskImage: "radial-gradient(ellipse at 50% 45%, black 10%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, black 10%, transparent 75%)" }} />
    </AbsoluteFill>
  );
};

// desktop browser with a live-site page; full-page shots scroll slowly
const Browser: React.FC<{ img?: string; vid?: string; w: number; len: number; url: string; scroll?: number; delay?: number; crop?: number }> =
  ({ img, vid, w, len, url, scroll = 0, delay = 0, crop = 58 }) => {
  const f = useCurrentFrame();
  const k = useIn(delay, 20, 1.1);
  const h = w * 0.5625;
  const bar = w * 0.034;
  const sc = interpolate(f, [delay + 20, len], [0, scroll], { ...clamp, easing: Easing.inOut(Easing.sin) });
  return (
    <div style={{ width: w, borderRadius: w * 0.012, overflow: "hidden", background: WHITE, boxShadow: `0 ${w * 0.04}px ${w * 0.09}px rgba(0,0,0,0.55), 0 0 0 1px ${LINE}`,
      opacity: k, transform: `translateY(${(1 - k) * 80}px) scale(${0.96 + 0.04 * k})` }}>
      <div style={{ height: bar, background: "#ECECE8", display: "flex", alignItems: "center", gap: bar * 0.25, padding: `0 ${bar * 0.5}px` }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: bar * 0.3, height: bar * 0.3, borderRadius: 99, background: c }} />)}
        <div style={{ flex: 1, marginLeft: bar * 0.4, height: bar * 0.62, borderRadius: 99, background: WHITE, display: "flex", alignItems: "center", paddingLeft: bar * 0.5,
          fontFamily: LAT, fontWeight: 500, fontSize: bar * 0.36, color: "#5D606C" }}>🔒 {url}</div>
      </div>
      <div style={{ position: "relative", height: h, overflow: "hidden" }}>
        {vid ? <OffthreadVideo src={S(vid)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          : <Img src={S(`web/${img}.jpg`)} style={{ width: "100%", position: "absolute", top: -(crop / 1920) * w - sc * w }} />}
      </div>
    </div>
  );
};

type Scr = { img?: string; vid?: string; from?: number };
const Phone: React.FC<{ w: number; screens: Scr[]; len: number; delay?: number; tilt?: number }> = ({ w, screens, len, delay = 0, tilt = 0 }) => {
  const f = useCurrentFrame();
  const k = useIn(delay, 20, 1.1);
  const h = w * 2.1;
  const per = Math.max(1, Math.floor((len - delay - 10) / screens.length));
  return (
    <div style={{ width: w, padding: w * 0.028, borderRadius: w * 0.13, background: "#0B0C10", boxShadow: `0 ${w * 0.1}px ${w * 0.25}px rgba(0,0,0,0.6), 0 0 0 2px #3A3C46`,
      opacity: k, transform: `translateY(${(1 - k) * 140 + Math.sin(f / 40) * 6}px) rotate(${tilt}deg)` }}>
      <div style={{ position: "relative", height: h, borderRadius: w * 0.105, overflow: "hidden", background: "#fff" }}>
        {screens.map((s, i) => {
          const st = delay + i * per;
          const e = i === 0 ? 1 : lerp(f, st, st + 16);
          if (e <= 0) return null;
          return (
            <div key={i} style={{ position: "absolute", inset: 0, opacity: e }}>
              {s.vid ? <OffthreadVideo src={S(s.vid)} startFrom={Math.round((s.from ?? 0) * FPS)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                : <Img src={S(`${s.img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transform: `scale(${1 + 0.04 * lerp(f, st, st + per)})`, transformOrigin: "50% 0%" }} />}
            </div>
          );
        })}
        <div style={{ position: "absolute", top: w * 0.025, left: "50%", width: w * 0.2, height: w * 0.05, marginLeft: -w * 0.1, borderRadius: 40, background: "#0B0C10" }} />
      </div>
    </div>
  );
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

const Pill: React.FC<{ t: string; fs: number; delay: number; dark?: boolean }> = ({ t, fs, delay, dark }) => {
  const k = useIn(delay, 16);
  return <div style={{ display: "inline-block", padding: `${fs * 0.35}px ${fs * 0.85}px`, borderRadius: 99, fontFamily: FONT, fontWeight: 600, fontSize: fs,
    background: dark ? "rgba(255,255,255,0.08)" : WHITE, color: dark ? WHITE : "#14151B", border: `1.5px solid ${dark ? "rgba(255,255,255,0.22)" : "#E4E4DF"}`,
    opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 30}px)` }}>{t}</div>;
};

/* ───────── scenes ───────── */
const toBn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

type SP = { l: Line; len: number; m: Mode };

const Layout: React.FC<{ l: Line; m: Mode; children?: React.ReactNode; dark?: boolean; capTop?: boolean; noCap?: boolean }> = ({ l, m, children, noCap }) => {
  // H: stage above, caption block bottom-left. V: caption top, stage middle, subtitle under it.
  const cs = pick(m, 78, 84);
  return (
    <AbsoluteFill>
      {children}
      {noCap ? null : m === "h" ? (
        <div style={{ position: "absolute", left: 110, right: 110, bottom: 64 }}>
          <BigCap text={l.cap} size={cs} />
          <div style={{ marginTop: 14, maxWidth: 1500 }}><SubLine text={l.text} dur={D[l.id]} size={34} /></div>
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", left: 70, right: 70, top: 190 }}><BigCap text={l.cap} size={cs} align="center" /></div>
          <div style={{ position: "absolute", left: 80, right: 80, top: 1430 }}><SubLine text={l.text} dur={D[l.id]} size={40} align="center" /></div>
        </>
      )}
    </AbsoluteFill>
  );
};

// H: stage box above the caption; V: middle band
const Stage: React.FC<{ m: Mode; children: React.ReactNode }> = ({ m, children }) => (
  <div style={{ position: "absolute", ...(m === "h" ? { left: 0, right: 0, top: 36, height: 800 } : { left: 0, right: 0, top: 430, height: 960 }), display: "flex", alignItems: "center", justifyContent: "center", gap: 60 }}>{children}</div>
);

const Scene: React.FC<SP> = ({ l, len, m }) => {
  const f = useCurrentFrame();
  const v = l.vis;
  const H = m === "h";

  if (v === "veo:campus" || v === "count") {
    const from = v === "count" ? 4.6 : 0;
    const n = Math.round(interpolate(f, [LEAD, LEAD + 60], [0, 181], { ...clamp, easing: Easing.out(Easing.cubic) }));
    return (
      <AbsoluteFill>
        <Clip src="campus" from={from} len={len} dim={v === "count" ? 0.5 : 0.18} z0={v === "count" ? 1.08 : 1.0} z1={v === "count" ? 1.14 : 1.08} />
        {v === "veo:campus" ? (
          <div style={{ position: "absolute", ...(H ? { left: 110, top: 120 } : { left: 0, right: 0, top: 430, textAlign: "center" }) }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontStretch: "118%", fontSize: H ? 260 : 300, lineHeight: 1, color: WHITE, textShadow: "0 10px 50px rgba(0,0,0,0.5)" }}>{toBn(n)}</div>
            <div style={{ display: "inline-block", fontFamily: FONT, fontWeight: 500, fontSize: H ? 32 : 34, color: WHITE, marginTop: 14, padding: "8px 18px", borderRadius: 12, background: "rgba(16,17,22,0.7)", opacity: lerp(f, LEAD + 40, LEAD + 60), maxWidth: H ? undefined : 940 }}>{l.sub}</div>
          </div>
        ) : (
          <div style={{ position: "absolute", ...(H ? { left: 110, top: 150 } : { left: 0, right: 0, top: 520 }), display: "flex", flexDirection: H ? "row" : "column", alignItems: "center", gap: 26 }}>
            {[["৬১", "সরকারি"], ["১১৭", "বেসরকারি"], ["৩", "আন্তর্জাতিক"]].map(([a, b], i) => {
              const k = useIn(4 + i * 7, 16);
              return <div key={b} style={{ padding: "22px 34px", borderRadius: 18, background: "rgba(16,17,22,0.72)", border: "1.5px solid rgba(255,255,255,0.18)", opacity: k, transform: `translateY(${(1 - k) * 30}px)`, minWidth: 250, textAlign: "center" }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontStretch: "115%", fontSize: 92, color: WHITE, lineHeight: 1 }}>{a}</div>
                <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 32, color: GREY, marginTop: 6 }}>{b}</div>
              </div>;
            })}
          </div>
        )}
        <Layout l={l} m={m} />
      </AbsoluteFill>
    );
  }

  if (v === "spark") {
    // typed line with the caret: the AI writes, then it's your turn (brand idea)
    const t = l.cap;
    const n = Math.floor(interpolate(f, [LEAD + 8, LEAD + 8 + t.length * 1.6], [0, t.length], clamp));
    const fs = H ? 104 : 96;
    return (
      <AbsoluteFill>
        <Ink />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: H ? "0 160px" : "0 80px" }}>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontStretch: "115%", fontSize: fs, lineHeight: 1.2, color: WHITE, textAlign: "center", textWrap: "balance" as never }}>
            {t.slice(0, n)}<Caret h={fs} />
          </div>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: H ? 110 : 80, right: H ? 110 : 80, bottom: H ? 70 : 380 }}><SubLine text={l.text} dur={D[l.id]} size={H ? 34 : 40} align="center" /></div>
      </AbsoluteFill>
    );
  }

  if (v === "logo") {
    const k = useIn(LEAD, 22, 1.2);
    const glow = lerp(f, LEAD, LEAD + 40);
    return (
      <AbsoluteFill>
        <Ink />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
          <Img src={S("brand/logo-dark.svg")} style={{ width: H ? 560 : 640, opacity: k, transform: `scale(${0.9 + 0.1 * k})`, filter: `drop-shadow(0 0 ${40 * glow}px rgba(255,90,31,0.25))` }} />
          <div style={{ fontFamily: FONT, fontWeight: 600, fontStretch: "110%", fontSize: H ? 52 : 58, color: WHITE, opacity: lerp(f, LEAD + 18, LEAD + 36) }}>AI University of Bangladesh</div>
          <div style={{ fontFamily: LAT, fontWeight: 500, fontSize: H ? 32 : 38, color: GREY, letterSpacing: 1, opacity: lerp(f, LEAD + 28, LEAD + 46) }}>aiuniversitybd.com</div>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 80, right: 80, bottom: H ? 70 : 380 }}><SubLine text={l.text} dur={D[l.id]} size={H ? 34 : 40} align="center" /></div>
      </AbsoluteFill>
    );
  }

  if (v === "nocost") {
    const rows = ["লাখ লাখ টাকার ভর্তি", "শহরে এসে থাকা-খাওয়া"];
    const fs = H ? 92 : 78;
    return (
      <AbsoluteFill>
        <Ink />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34, paddingBottom: H ? 200 : 120 }}>
          {rows.map((r, i) => {
            const k = useIn(LEAD + i * 26, 18);
            const s = lerp(f, LEAD + 18 + i * 26, LEAD + 34 + i * 26);
            return <div key={r} style={{ position: "relative", fontFamily: FONT, fontWeight: 700, fontStretch: "112%", fontSize: fs, color: s > 0.5 ? "#6B6E7A" : WHITE, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
              {r}<div style={{ position: "absolute", left: -10, top: "52%", height: fs * 0.08, width: `calc(${s * 100}% + 20px)`, background: ORANGE, borderRadius: 4 }} />
            </div>;
          })}
        </AbsoluteFill>
        <Layout l={l} m={m} />
      </AbsoluteFill>
    );
  }

  if (v === "veo:village" || v === "veo:village2") {
    const second = v === "veo:village2";
    const words = ["গ্রাম", "শহর", "দেশ", "বিদেশ"];
    return (
      <AbsoluteFill>
        <Clip src="village" from={second ? 3.6 : 0} len={len} dim={0.12} z0={second ? 1.1 : 1.0} z1={second ? 1.2 : 1.08} ox={H ? 50 : 38} />
        {second ? <Layout l={l} m={m} /> : (
          <>
            <div style={{ position: "absolute", ...(H ? { right: 110, top: 120, textAlign: "right" } : { left: 0, right: 0, top: 200, textAlign: "center" }) }}>
              {words.map((w, i) => {
                const k = lerp(f, LEAD + 8 + i * 22, LEAD + 30 + i * 22);
                return <div key={w} style={{ fontFamily: FONT, fontWeight: 700, fontStretch: "115%", fontSize: H ? 96 : 110, lineHeight: 1.1, color: WHITE, opacity: k, transform: `translateX(${(1 - k) * (H ? 40 : 0)}px)`, textShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>{w}</div>;
              })}
            </div>
            {H ? (
              <div style={{ position: "absolute", left: 110, right: 110, bottom: 64 }}>
                <BigCap text="মোবাইল হাতে থাকলেই ক্লাস" size={78} delay={LEAD + 100} />
                <div style={{ marginTop: 14 }}><SubLine text={l.text} dur={D[l.id]} size={34} /></div>
              </div>
            ) : <div style={{ position: "absolute", left: 80, right: 80, top: 1430 }}>
                <BigCap text="মোবাইল হাতে থাকলেই ক্লাস" size={76} align="center" delay={LEAD + 100} />
                <div style={{ marginTop: 18 }}><SubLine text={l.text} dur={D[l.id]} size={38} align="center" /></div>
              </div>}
          </>
        )}
      </AbsoluteFill>
    );
  }

  if (v === "covers") {
    const ids = ["air-ticketing", "ielts-prep", "spoken-english", "computer-basics", "arabic-gulf", "korean-eps", "japanese-work", "driving", "family-health", "vibe-coding", "snake-rescue", "fish-feed", "biggan-velki"];
    const names = ["এয়ার টিকেটিং", "IELTS", "স্পোকেন ইংলিশ", "কম্পিউটার", "আরবি", "কোরিয়ান", "জাপানি", "ড্রাইভিং", "পরিবারের স্বাস্থ্য", "ভাইব কোডিং", "সাপ চেনা", "মাছের খাবার", "কচু বিজ্ঞানী"];
    const cols = H ? 5 : 3, cw = H ? 300 : 300, ch = cw * 0.62, gap = H ? 22 : 22;
    const drift = interpolate(f, [0, len], [0, H ? -40 : -60], clamp);
    return (
      <AbsoluteFill>
        <Ink />
        <Stage m={m}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${cw}px)`, gap, transform: `translateY(${drift}px)` }}>
            {ids.map((id, i) => {
              const k = useIn(LEAD + i * 4, 18);
              return <div key={id} style={{ opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${0.94 + 0.06 * k})` }}>
                <Img src={S(`covers/${id}.jpg`)} style={{ width: cw, height: ch, objectFit: "cover", borderRadius: 14, display: "block" }} />
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: H ? 26 : 30, color: WHITE, marginTop: 8 }}>{names[i]}</div>
              </div>;
            })}
          </div>
        </Stage>
        <Layout l={l} m={m} />
      </AbsoluteFill>
    );
  }

  if (v === "reviews") {
    const R = [
      ["অসাধারণ একটি কোর্স। এই কোর্স করার মাধ্যমে বাংলাদেশে গাড়ি চালানোর প্রায় সকল নিয়ম কানুন জানা যায়।", "NAHIDUL ISLAM NISAT", "ড্রাইভিং শিক্ষা", 5],
      ["খুব ভালো। শিখতে অনেক সহজ।", "MD AMINUL ISLAM", "এয়ার টিকেটিং", 4],
      ["খুবই ভালো লেগেছে। ইফেক্টিভ আলোচনা ছিল", "Mohammad Aminul Islam", "কম্পিউটার শিক্ষা", 5],
      ["অনেক কিছুই শিখতে পারছি", "AL-AQSA TRAVELS", "এয়ার টিকেটিং", 5],
    ] as const;
    const rk = useIn(LEAD, 18);
    const fs = H ? 30 : 32;
    return (
      <AbsoluteFill>
        <Ink />
        <div style={{ position: "absolute", ...(H ? { left: 110, top: 120, width: 520 } : { left: 0, right: 0, top: 430, textAlign: "center" }), opacity: rk }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontStretch: "118%", fontSize: H ? 220 : 200, color: WHITE, lineHeight: 1 }}>৪.৮</div>
          <div style={{ fontSize: H ? 54 : 56, color: ORANGE, letterSpacing: 6 }}>{"★★★★★".split("").map((s, i) => <span key={i} style={{ opacity: lerp(f, LEAD + 10 + i * 5, LEAD + 18 + i * 5) }}>{s}</span>)}</div>
          <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: H ? 30 : 32, color: GREY, marginTop: 10 }}>শিক্ষার্থীদের রিভিউ · aiuniversitybd.com/reviews</div>
        </div>
        <div style={{ position: "absolute", ...(H ? { left: 720, right: 110, top: 90 } : { left: 70, right: 70, top: 800 }), display: "flex", flexDirection: "column", gap: 18 }}>
          {R.slice(0, H ? 4 : 3).map(([t, n, c, st], i) => {
            const k = useIn(LEAD + 20 + i * 16, 18);
            return <div key={n} style={{ background: WHITE, borderRadius: 16, padding: `${fs * 0.7}px ${fs * 0.9}px`, opacity: k, transform: `translateX(${(1 - k) * 60}px)` }}>
              <div style={{ color: ORANGE, fontSize: fs * 0.8, letterSpacing: 3 }}>{"★".repeat(st)}<span style={{ color: "#D6D6D0" }}>{"★".repeat(5 - st)}</span></div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: fs, color: "#14151B", lineHeight: 1.4, marginTop: 4 }}>“{t}”</div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: fs * 0.72, color: "#5D606C", marginTop: 6 }}>{n} · {c}</div>
            </div>;
          })}
        </div>
        {H ? (
          <div style={{ position: "absolute", left: 110, width: 560, bottom: 64 }}>
            <BigCap text="যারা শিখছেন, তারাই বলছেন" size={58} />
            <div style={{ marginTop: 12 }}><SubLine text={l.text} dur={D[l.id]} size={30} /></div>
          </div>
        ) : <div style={{ position: "absolute", left: 80, right: 80, top: 1500 }}><SubLine text={l.text} dur={D[l.id]} size={40} align="center" /></div>}
        {H ? null : <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}><BigCap text="যারা শিখছেন, তারাই বলছেন" size={76} align="center" /></div>}
      </AbsoluteFill>
    );
  }

  if (v === "cta") {
    const k1 = useIn(LEAD, 20), k2 = useIn(LEAD + 40, 18), k3 = useIn(LEAD + 70, 18), k4 = useIn(LEAD + 100, 18);
    return (
      <AbsoluteFill>
        <Ink />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: H ? 34 : 48, paddingBottom: H ? 40 : 160 }}>
          <Img src={S("brand/logo-dark.svg")} style={{ width: H ? 300 : 380, opacity: k1 }} />
          <div style={{ padding: H ? "0 200px" : "0 70px" }}><BigCap text={l.cap} size={H ? 92 : 96} align="center" delay={LEAD + 12} caret={false} /></div>
          <div style={{ display: "flex", flexDirection: H ? "row" : "column", alignItems: "center", gap: 30, opacity: k2, transform: `translateY(${(1 - k2) * 30}px)` }}>
            <div style={{ height: H ? 92 : 110, padding: "0 40px", borderRadius: 99, background: WHITE, display: "flex", alignItems: "center", fontFamily: LAT, fontWeight: 700, fontSize: H ? 40 : 46, color: "#14151B" }}>
              aiuniversitybd.com<Caret h={H ? 40 : 46} />
            </div>
            <PlayBadge h={H ? 92 : 110} />
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", opacity: k3 }}>
            {["ওয়েব + অ্যাপ, একই অ্যাকাউন্ট", "বিকাশ ও নগদে পেমেন্ট", "প্রতিটি কোর্সের প্রথম ২০% ফ্রি"].map((t, i) => <Pill key={t} t={t} fs={H ? 30 : 34} delay={LEAD + 70 + i * 6} dark />)}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: H ? 36 : 40, color: WHITE, opacity: k4, textAlign: "center", padding: "0 60px" }}>
            একটি সাবস্ক্রিপশনেই সব কোর্স
          </div>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 80, right: 80, bottom: H ? 50 : 300 }}><SubLine text={l.text} dur={D[l.id]} size={H ? 32 : 38} align="center" /></div>
      </AbsoluteFill>
    );
  }

  // UI scenes: browser (H) / phone (V)
  const bw = H ? 1300 : 940;
  const pw = H ? 360 : 430;
  const P = (scr: Scr[], d = 14, tilt = 0) => <Phone w={pw} screens={scr} len={len} delay={d} tilt={tilt} />;
  const B = (o: { img?: string; vid?: string; url: string; scroll?: number }) => <Browser {...o} w={bw} len={len} />;
  const stamp = (t: string) => {
    const k = useIn(LEAD + 26, 10, 0.7);
    return <div style={{ position: "absolute", ...(H ? { right: 260, top: 110 } : { right: 90, top: 470 }), padding: "18px 44px", borderRadius: 99, background: ORANGE, color: "#14151B", fontFamily: FONT, fontWeight: 800, fontStretch: "115%", fontSize: H ? 76 : 84,
      transform: `scale(${k}) rotate(-6deg)`, boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>{t}</div>;
  };
  const map: Record<string, React.ReactNode> = {
    home: H ? <>{B({ vid: "rec/home-scroll.mp4", url: "aiuniversitybd.com" })}{P([{ img: "web/m-home" }], 24)}</> : <>{P([{ img: "web/m-home" }, { img: "app/10-home" }], 8)}</>,
    gdscourse: H ? <>{B({ img: "gds-course-full", url: "aiuniversitybd.com/course/air-ticketing", scroll: 0.22 })}</> : P([{ img: "web/m-gds-course" }, { img: "app/50-gds-dash" }], 8),
    gdslab: H ? <>{B({ img: "gds-lab", url: "aiuniversitybd.com/gds-lab" })}{P([{ vid: "rec/gds-pnr.mp4", from: 6 }], 24)}</> : P([{ vid: "rec/gds-pnr.mp4", from: 6 }], 8),
    gdscall: <>{P([{ img: "app/61-gds-call" }, { img: "app/62-gds-call-live" }, { img: "app/63-gds-review" }], 8, H ? -3 : 0)}{H ? P([{ img: "app/63-gds-review" }, { img: "app/50-gds-dash" }], 24, 3) : null}</>,
    guru: <>{P([{ img: "app/52-teacher" }], 8, H ? -3 : 0)}{H ? P([{ img: "app/18-guru" }], 22, 3) : null}</>,
    ielts: H ? <>{B({ img: "ielts-full", url: "aiuniversitybd.com/course/ielts-prep", scroll: 0.2 })}{P([{ img: "app/70-mock-report" }, { img: "app/72-mock-report-writing" }], 24)}</> : P([{ img: "app/70-mock-report" }, { img: "app/72-mock-report-writing" }], 8),
    cfe: <>{H ? B({ img: "cfe-full", url: "aiuniversitybd.com/course/computer-basics", scroll: 0.12 }) : P([{ img: "web/m-home" }], 8)}{stamp("ফ্রি")}</>,
    cert: <>{P([{ img: "app/14-quiz" }], 8, H ? -3 : 0)}{P([{ img: "app/66-cert-stamp-shine" }, { img: "app/12-certificates" }], 22, H ? 3 : 0)}</>,
    soon: H ? B({ img: "courses-full", url: "aiuniversitybd.com/courses", scroll: 0.3 }) : P([{ img: "web/m-home" }], 8),
  };
  // V: two phones side-by-side would be too small; cert shows quiz then cert in one phone
  if (!H && v === "cert") map.cert = P([{ img: "app/14-quiz" }, { img: "app/66-cert-stamp-shine" }, { img: "app/12-certificates" }], 8);
  if (!H && v === "cfe") map.cfe = <>{P([{ img: "app/10-home" }], 8)}{stamp("ফ্রি")}</>;
  return (
    <AbsoluteFill>
      <Ink />
      <Stage m={m}>{map[v] ?? null}</Stage>
      <Layout l={l} m={m} />
    </AbsoluteFill>
  );
};

/* ───────── film ───────── */
export const Film: React.FC = () => {
  const m = useMode();
  const its = items(m);
  const T = total(m);
  return (
    <AbsoluteFill style={{ background: INK }}>
      {its.map((it, i) => (
        <Sequence key={it.id} from={Math.max(0, it.from - (i ? FADE : 0))} durationInFrames={it.len + (i ? FADE : 0) + FADE}>
          <Fader first={i === 0} len={it.len + (i ? FADE : 0) + FADE}>
            <Sequence from={i ? FADE : 0} layout="none"><Scene l={it} len={it.len} m={m} /></Sequence>
          </Fader>
        </Sequence>
      ))}
      {its.map((it) => <Sequence key={"a" + it.id} from={it.from + LEAD} durationInFrames={Math.round(D[it.id] * FPS) + 10}><Audio src={S(it.vo)} /></Sequence>)}
      <Audio src={S("music.mp3")} volume={(f) => interpolate(f, [0, 20, T - 90, T], [0, 0.2, 0.2, 0], clamp)} />
      <Sequence from={its.find((x) => x.id === "s04")!.from + LEAD - 6}><Audio src={S("sfx/shimmer.mp3")} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};

const Fader: React.FC<{ first: boolean; len: number; children: React.ReactNode }> = ({ first, len, children }) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, FADE], [0, 1], clamp);
  void len;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
