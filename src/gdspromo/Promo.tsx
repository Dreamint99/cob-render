// AIU — Travel agency air-ticketing (GDS) course promo, 2026-11-13. Owner's story script, polished: AI job-loss hook (WEF 2025) →
// air ticketing still needs people → GDS → expensive courses → our course → 7 super powers (real lab recordings + app screens) →
// reviews → payoff → regular ৳10,000 → 11.11: all courses 1 year ৳1,100 till 30 Nov → CTA.
// VO = ONE continuous take per cut (Tanvir eleven_v4 via OpenRouter, public/gdspromo/vo-h|v.mp3); scenes follow its line boundaries
// (src/gdspromo/bounds.json) so the voice never stops between scenes. Brand C: ink, white, orange caret; Anek Bangla.
import React from "react";
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing,
  delayRender, continueRender,
} from "remotion";
import BOUNDS from "./bounds.json";
import LINES from "./script.json";

const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
const S = (p: string) => staticFile("gdspromo/" + p);

const INK = "#101116", LINE = "#2A2C35", WHITE = "#FFFFFF", GREY = "#A3A6B2", ORANGE = "#FF5A1F", TERM = "#3BE37A";
const FONT = "AnekF, 'Anek Bangla', 'Hind Siliguri', sans-serif";
const LAT = "Montserrat, Poppins, sans-serif";
const MONO = "'Courier New', monospace";

if (typeof document !== "undefined") {
  const h = delayRender("fonts");
  const ff = new FontFace("AnekF", `url(${staticFile("fonts/AnekBangla.ttf")})`, { weight: "100 800", stretch: "75% 125%" });
  ff.load().then((x) => { document.fonts.add(x); continueRender(h); }).catch(() => continueRender(h));
}

type Line = { id: string; text: string; vtext?: string; cap: string; sub?: string; vis: string; reel: number };
type Mode = "h" | "v";
const L = LINES as Line[];
const B = BOUNDS as Record<Mode, { id: string; a: number; b: number }[]>;
const useMode = (): Mode => { const { width, height } = useVideoConfig(); return height > width ? "v" : "h"; };
const pick = <T,>(m: Mode, h: T, v: T) => (m === "v" ? v : h);
const useIn = (d = 0, damping = 16, mass = 0.9) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - d, fps, config: { damping, mass } }); };
const toBn = (s: string | number) => String(s).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

/* ───────── timeline: scenes follow the VO take ───────── */
const OFF = 12, HOLD = 150, FADE = 10;
export const items = (m: Mode) => {
  const bs = B[m];
  return bs.map((x, i) => {
    const l = L.find((y) => y.id === x.id)!;
    const from = i === 0 ? 0 : OFF + Math.round(x.a * FPS);
    const to = i === bs.length - 1 ? OFF + Math.round(x.b * FPS) + HOLD : OFF + Math.round(bs[i + 1].a * FPS);
    return { ...l, say: m === "v" ? l.vtext ?? l.text : l.text, from, len: to - from, lead: i === 0 ? OFF : 0, dur: x.b - x.a, n: i };
  });
};
export const total = (m: Mode) => { const t = items(m); const x = t[t.length - 1]; return x.from + x.len; };
type It = ReturnType<typeof items>[number];

/* ───────── type ───────── */
const Caret: React.FC<{ h: number; on?: boolean }> = ({ h, on = true }) => {
  const f = useCurrentFrame();
  return <span style={{ display: "inline-block", width: h * 0.09, height: h * 0.92, background: ORANGE, marginLeft: h * 0.12, verticalAlign: "-0.12em", opacity: on && Math.floor(f / 16) % 2 === 0 ? 1 : 0 }} />;
};
const BigCap: React.FC<{ text: string; size: number; delay?: number; align?: "left" | "center"; caret?: boolean; color?: string }> = ({ text, size, delay = 4, align = "left", caret = true, color = WHITE }) => {
  const f = useCurrentFrame();
  const words = text.replace(/ · /g, " · ").split(" ");
  return (
    <div style={{ fontFamily: FONT, fontWeight: 700, fontStretch: "112%", fontSize: size, lineHeight: 1.16, color, textAlign: align, textWrap: "balance" as never, textShadow: "0 6px 30px rgba(0,0,0,0.45)" }}>
      {words.map((w, i) => {
        const k = lerp(f, delay + i * 4, delay + i * 4 + 16);
        return <span key={i} style={{ display: "inline-block", marginRight: "0.22em", opacity: k, transform: `translateY(${(1 - k) * 0.4 * size}px) scale(${0.9 + 0.1 * k})`, filter: `blur(${(1 - k) * 6}px)` }}>{w}</span>;
      })}
      {caret ? <Caret h={size} on={f > delay + words.length * 4} /> : null}
    </div>
  );
};
const SubLine: React.FC<{ text: string; dur: number; size: number; align?: "left" | "center"; lead: number }> = ({ text, dur, size, align = "left", lead }) => {
  const f = useCurrentFrame() - lead;
  const words = text.replace(/\.\.\./g, "…").split(" ");
  const n = interpolate(f, [0, dur * FPS * 0.94], [0, words.length], clamp);
  return (
    <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: size, lineHeight: 1.45, textAlign: align, opacity: lerp(f, -6, 4) }}>
      <span style={{ background: "rgba(16,17,22,0.55)", padding: "4px 12px", borderRadius: 10, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
        {words.map((w, i) => <span key={i} style={{ color: i < n ? WHITE : "rgba(255,255,255,0.45)" }}>{w} </span>)}
      </span>
    </div>
  );
};
const Pill: React.FC<{ t: string; fs: number; delay: number; hot?: boolean }> = ({ t, fs, delay, hot }) => {
  const k = useIn(delay, 14);
  return <div style={{ display: "inline-block", padding: `${fs * 0.32}px ${fs * 0.8}px`, borderRadius: 99, fontFamily: FONT, fontWeight: 600, fontSize: fs, whiteSpace: "nowrap",
    background: hot ? ORANGE : "rgba(16,17,22,0.78)", color: hot ? "#14151B" : WHITE, border: `1.5px solid ${hot ? ORANGE : "rgba(255,255,255,0.25)"}`,
    opacity: Math.min(1, k * 1.4), transform: `translateY(${(1 - k) * 26}px) scale(${0.85 + 0.15 * Math.min(1, k)})` }}>{t}</div>;
};

/* ───────── visuals ───────── */
const Ink: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${LINE} 1.4px, transparent 1.4px)`, backgroundSize: "44px 44px", backgroundPosition: `0 ${-f * 0.3}px`, opacity: 0.6,
        maskImage: "radial-gradient(ellipse at 50% 45%, black 10%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, black 10%, transparent 75%)" }} />
    </AbsoluteFill>
  );
};
const Shade: React.FC<{ dim?: number }> = ({ dim = 0.2 }) => (
  <>
    <AbsoluteFill style={{ background: `rgba(16,17,22,${dim})` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(16,17,22,0.35) 0%, rgba(16,17,22,0) 30%, rgba(16,17,22,0) 45%, rgba(16,17,22,0.9) 100%)" }} />
  </>
);
const Photo: React.FC<{ src: string; len: number; z0?: number; z1?: number; ox?: number; oy?: number; dim?: number }> = ({ src, len, z0 = 1.04, z1 = 1.16, ox = 50, oy = 45, dim = 0.15 }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, len], [z0, z1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: INK }}>
      <Img src={S(`img/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${ox}% ${oy}%`, transform: `scale(${z})`, transformOrigin: `${ox}% ${oy}%` }} />
      <Shade dim={dim} />
    </AbsoluteFill>
  );
};
const Clip: React.FC<{ src: string; from?: number; len: number; z0?: number; z1?: number; dim?: number; ox?: number; rate?: number }> = ({ src, from = 0, len, z0 = 1.0, z1 = 1.08, dim = 0.15, ox = 50, rate = 1 }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, len], [z0, z1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: INK }}>
      <OffthreadVideo src={S(`clips/${src}.mp4`)} startFrom={Math.round(from * FPS)} playbackRate={rate} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${ox}% 50%`, transform: `scale(${z})` }} />
      <Shade dim={dim} />
    </AbsoluteFill>
  );
};
// frame showing a crop of a 1600x900 lab recording / screenshot (terminal area)
const Term: React.FC<{ vid?: string; img?: string; w: number; h: number; crop: [number, number, number, number]; from?: number; rate?: number; delay?: number; label?: string; tilt?: number }> =
  ({ vid, img, w, h, crop, from = 0, rate = 1, delay = 0, label, tilt = 0 }) => {
  const k = useIn(delay, 16, 1);
  const [cx, cy, cw, ch] = crop;
  const sc = Math.max(w / cw, h / ch);
  const inner: React.CSSProperties = { position: "absolute", left: -cx * sc, top: -cy * sc, width: 1600 * sc, height: 900 * sc };
  return (
    <div style={{ position: "relative", width: w, height: h + (label ? 54 : 0), opacity: Math.min(1, k * 1.3), transform: `translateY(${(1 - k) * 80}px) rotate(${tilt * (1 - k * 0.3)}deg) scale(${0.9 + 0.1 * k})` }}>
      <div style={{ position: "relative", width: w, height: h, overflow: "hidden", borderRadius: 14, boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1.5px ${LINE}, 0 0 60px ${TERM}22` }}>
        {vid ? <OffthreadVideo src={S(vid)} startFrom={Math.round(from * FPS)} playbackRate={rate} muted style={inner} /> : <Img src={S(img!)} style={inner} />}
      </div>
      {label ? <div style={{ marginTop: 14, textAlign: "center", fontFamily: LAT, fontWeight: 700, fontSize: 30, color: WHITE, letterSpacing: 1 }}>{label}</div> : null}
    </div>
  );
};
type Scr = { img?: string; vid?: string; from?: number };
const Phone: React.FC<{ w: number; screens: Scr[]; len: number; delay?: number; tilt?: number }> = ({ w, screens, len, delay = 0, tilt = 0 }) => {
  const f = useCurrentFrame();
  const k = useIn(delay, 16, 1);
  const h = w * 2.1;
  const per = Math.max(1, Math.floor((len - delay - 6) / screens.length));
  return (
    <div style={{ width: w, padding: w * 0.028, borderRadius: w * 0.13, background: "#0B0C10", boxShadow: `0 ${w * 0.1}px ${w * 0.25}px rgba(0,0,0,0.6), 0 0 0 2px #3A3C46`,
      opacity: Math.min(1, k * 1.3), transform: `translateY(${(1 - k) * 160 + Math.sin(f / 30) * 6}px) rotate(${tilt}deg) scale(${0.92 + 0.08 * k})` }}>
      <div style={{ position: "relative", height: h, borderRadius: w * 0.105, overflow: "hidden", background: "#fff" }}>
        {screens.map((s, i) => {
          const st = delay + i * per;
          const e = i === 0 ? 1 : lerp(f, st, st + 12);
          if (e <= 0) return null;
          return (
            <div key={i} style={{ position: "absolute", inset: 0, opacity: e, transform: `translateX(${(1 - e) * 30}%)` }}>
              {s.vid ? <OffthreadVideo src={S(s.vid)} startFrom={Math.round((s.from ?? 0) * FPS)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                : <Img src={S(`${s.img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transform: `scale(${1 + 0.05 * lerp(f, st, st + per)})`, transformOrigin: "50% 0%" }} />}
            </div>
          );
        })}
        <div style={{ position: "absolute", top: w * 0.025, left: "50%", width: w * 0.2, height: w * 0.05, marginLeft: -w * 0.1, borderRadius: 40, background: "#0B0C10" }} />
      </div>
    </div>
  );
};
const Browser: React.FC<{ img: string; w: number; len: number; url: string; scroll?: number; delay?: number }> = ({ img, w, len, url, scroll = 0, delay = 0 }) => {
  const f = useCurrentFrame();
  const k = useIn(delay, 18, 1);
  const h = w * 0.5625, bar = w * 0.034;
  const sc = interpolate(f, [delay + 15, len], [0, scroll], { ...clamp, easing: Easing.inOut(Easing.sin) });
  return (
    <div style={{ width: w, borderRadius: w * 0.012, overflow: "hidden", background: WHITE, boxShadow: `0 ${w * 0.04}px ${w * 0.09}px rgba(0,0,0,0.55), 0 0 0 1px ${LINE}`, opacity: k, transform: `translateY(${(1 - k) * 80}px) scale(${0.94 + 0.06 * k})` }}>
      <div style={{ height: bar, background: "#ECECE8", display: "flex", alignItems: "center", gap: bar * 0.25, padding: `0 ${bar * 0.5}px` }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: bar * 0.3, height: bar * 0.3, borderRadius: 99, background: c }} />)}
        <div style={{ flex: 1, marginLeft: bar * 0.4, height: bar * 0.62, borderRadius: 99, background: WHITE, display: "flex", alignItems: "center", paddingLeft: bar * 0.5, fontFamily: LAT, fontWeight: 500, fontSize: bar * 0.36, color: "#5D606C" }}>🔒 {url}</div>
      </div>
      <div style={{ position: "relative", height: h, overflow: "hidden" }}>
        <Img src={S(`web/${img}.jpg`)} style={{ width: "100%", position: "absolute", top: -(58 / 1920) * w - sc * w }} />
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
// radial burst used on the big reveals
const Burst: React.FC<{ delay?: number; color?: string }> = ({ delay = 0, color = ORANGE }) => {
  const f = useCurrentFrame() - delay;
  if (f < 0 || f > 40) return null;
  const p = f / 40;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", width: 6, height: 90, borderRadius: 6, background: color, opacity: (1 - p) * 0.9,
          transform: `rotate(${i * 20}deg) translateY(${-140 - p * 380}px) scaleY(${1 - p * 0.6})` }} />
      ))}
      <div style={{ position: "absolute", width: 300 + p * 900, height: 300 + p * 900, borderRadius: "50%", border: `4px solid ${color}`, opacity: (1 - p) * 0.7 }} />
    </AbsoluteFill>
  );
};
const Flash: React.FC = () => { const f = useCurrentFrame(); return f < 8 ? <AbsoluteFill style={{ background: WHITE, opacity: interpolate(f, [0, 8], [0.35, 0], clamp) }} /> : null; };

/* ───────── layout ───────── */
const Caps: React.FC<{ it: It; m: Mode; text?: string }> = ({ it, m, text }) => (
  m === "h" ? (
    <div style={{ position: "absolute", left: 100, right: 100, bottom: 56 }}>
      <BigCap text={text ?? it.cap} size={80} delay={it.lead + 3} />
      <div style={{ marginTop: 12, maxWidth: 1600 }}><SubLine text={it.say} dur={it.dur} size={32} lead={it.lead} /></div>
    </div>
  ) : (
    <>
      <div style={{ position: "absolute", left: 60, right: 60, top: 170 }}><BigCap text={text ?? it.cap} size={84} align="center" delay={it.lead + 3} /></div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1440 }}><SubLine text={it.say} dur={it.dur} size={38} align="center" lead={it.lead} /></div>
    </>
  )
);
const Stage: React.FC<{ m: Mode; children: React.ReactNode; gap?: number }> = ({ m, children, gap = 50 }) => (
  <div style={{ position: "absolute", ...(m === "h" ? { left: 0, right: 0, top: 40, height: 790 } : { left: 0, right: 0, top: 420, height: 980 }), display: "flex", alignItems: "center", justifyContent: "center", gap }}>{children}</div>
);
const SPN = ["", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত"];
const PowerTag: React.FC<{ n: number; m: Mode }> = ({ n, m }) => {
  const k = useIn(2, 12, 0.7);
  return (
    <div style={{ position: "absolute", ...(m === "h" ? { left: 100, top: 54 } : { left: 0, right: 0, top: 80, display: "flex", justifyContent: "center" }), zIndex: 5 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "10px 26px 10px 12px", borderRadius: 99, background: ORANGE, transform: `scale(${k}) rotate(${(1 - k) * -8}deg)`, boxShadow: "0 14px 40px rgba(255,90,31,0.4)" }}>
        {m === "h" ? <div style={{ width: 56, height: 56, borderRadius: 99, background: "#14151B", color: WHITE, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36 }}>{toBn(n)}</div> : null}
        <div style={{ fontFamily: FONT, fontWeight: 800, fontStretch: "112%", fontSize: 34, color: "#14151B" }}>সুপার পাওয়ার{m === "h" ? ` ${SPN[n]}` : ""}</div>
      </div>
    </div>
  );
};

/* ───────── scenes ───────── */
const Scene: React.FC<{ it: It; m: Mode }> = ({ it, m }) => {
  const f = useCurrentFrame();
  const H = m === "h";
  const v = it.vis, len = it.len, D0 = it.lead;
  const powers: Record<string, number> = { g10: 1, g11: 2, g12: 3, g13: 4, g14: 5, g15: 6, g16: 7 };
  const pw = powers[it.id];
  const P = (scr: Scr[], d = 6, tilt = 0, w = H ? 350 : 430) => <Phone w={w} screens={scr} len={len} delay={d} tilt={tilt} />;

  // big number over a photo (job-loss facts)
  const Stat = ({ big, unit }: { big: string; unit: string }) => {
    const k = useIn(D0 + 6, 11, 0.7);
    return (
      <div style={{ position: "absolute", ...(H ? { left: 100, top: 110 } : { left: 0, right: 0, top: 470, textAlign: "center" }) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontStretch: "118%", fontSize: H ? 250 : 260, lineHeight: 1, color: WHITE, transform: `scale(${0.6 + 0.4 * k})`, transformOrigin: H ? "0% 50%" : "50% 50%", textShadow: "0 12px 60px rgba(0,0,0,0.6)" }}>
          {big}<span style={{ color: ORANGE, fontSize: "0.42em", marginLeft: 12 }}>{unit}</span>
        </div>
        {it.sub ? <div style={{ display: "inline-block", marginTop: 10, padding: "8px 18px", borderRadius: 12, background: "rgba(16,17,22,0.72)", fontFamily: FONT, fontWeight: 500, fontSize: H ? 28 : 30, color: WHITE, opacity: lerp(f, D0 + 20, D0 + 34) }}>{it.sub}</div> : null}
      </div>
    );
  };

  if (v.startsWith("img:") || v.startsWith("veo:")) {
    const src = v.slice(4);
    if (it.id === "g18") {
      // agency clip, then the hero hands over the ticket
      const cut = Math.round(len * 0.5);
      return (
        <AbsoluteFill>
          <Clip src="agency" len={len} z0={1.0} z1={1.1} ox={H ? 50 : 35} />
          <Sequence from={cut} layout="none"><AbsoluteFill style={{ opacity: lerp(f - cut, 0, 10) }}><Photo src="hero-success" len={len - cut} z0={1.02} z1={1.1} ox={H ? 50 : 40} /></AbsoluteFill></Sequence>
          <Caps it={it} m={m} />
        </AbsoluteFill>
      );
    }
    return (
      <AbsoluteFill>
        {v.startsWith("veo:") ? <Clip src={src} len={len} z0={1.0} z1={1.1} ox={H ? 50 : 40} /> :
          src === "hero-worried2" ? <Photo src="hero-worried" len={len} z0={1.25} z1={1.45} ox={62} oy={35} dim={0.3} /> :
          <Photo src={src} len={len} ox={H ? 50 : src === "hero-learning" ? 62 : src === "counter" ? 30 : 55} dim={it.id === "g01" ? 0.4 : 0.15} />}
        {it.id === "g01" ? <Stat big="৪১" unit="%" /> : null}
        {it.id === "g02" ? <Stat big="৯.২" unit="কোটি" /> : null}
        {it.id === "g05" ? <div style={{ position: "absolute", ...(H ? { left: 100, top: 90 } : { left: 0, right: 0, top: 470, justifyContent: "center" }), display: "flex", gap: 16, flexWrap: "wrap" }}>
          {["Amadeus", "Galileo", "Sabre"].map((t, i) => <Pill key={t} t={t} fs={H ? 40 : 44} delay={D0 + 40 + i * 18} />)}
        </div> : null}
        {it.id === "g04" ? <div style={{ position: "absolute", ...(H ? { right: 100, top: 90, alignItems: "flex-end" } : { left: 0, right: 0, top: 480, alignItems: "center" }), display: "flex", flexDirection: "column", gap: 14 }}>
          {["গ্রাহকের কথা বোঝা", "ঠিক ফ্লাইট খোঁজা", "ভিসা ও ডকুমেন্ট"].map((t, i) => <Pill key={t} t={"✓ " + t} fs={H ? 34 : 38} delay={D0 + 40 + i * 22} />)}
        </div> : null}
        {pw ? <PowerTag n={pw} m={m} /> : null}
        <Caps it={it} m={m} />
      </AbsoluteFill>
    );
  }

  if (v === "fees") {
    const tags = ["১০,০০০", "১৫,০০০", "২০,০০০"];
    return (
      <AbsoluteFill>
        <Ink />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: H ? "row" : "column", gap: H ? 40 : 30, paddingBottom: H ? 180 : 60 }}>
          {tags.map((t, i) => {
            const k = useIn(D0 + 30 + i * 20, 10, 0.6);
            return <div key={t} style={{ padding: H ? "28px 44px" : "24px 50px", borderRadius: 22, background: "#1A1B22", border: `2px solid ${LINE}`, transform: `scale(${k}) rotate(${(i - 1) * 4}deg)`,
              fontFamily: FONT, fontWeight: 800, fontStretch: "115%", fontSize: H ? 104 : 110, color: WHITE }}>৳{t}</div>;
          })}
        </AbsoluteFill>
        {(() => {
          const at = Math.round(len * 0.62);
          const k = useIn(at, 12, 0.7);
          return <AbsoluteFill style={{ alignItems: "center", justifyContent: H ? "flex-end" : "flex-start", paddingBottom: H ? 250 : 0, paddingTop: H ? 0 : 1150, opacity: f > at ? 1 : 0 }}>
            <div style={{ padding: "16px 40px", borderRadius: 18, background: ORANGE, color: "#14151B", fontFamily: FONT, fontWeight: 800, fontStretch: "115%", fontSize: H ? 64 : 66, transform: `scale(${k}) rotate(-5deg)`, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>তবুও A to Z নয়!</div>
          </AbsoluteFill>;
        })()}
        <Caps it={it} m={m} text="শিখতে লাগে ১০–২০ হাজার টাকা" />
      </AbsoluteFill>
    );
  }

  if (v === "course") {
    return (
      <AbsoluteFill>
        <Ink />
        <Stage m={m}>
          {H ? <Browser img="gds-course-full" w={1250} len={len} url="aiuniversitybd.com/course/air-ticketing" scroll={0.12} delay={D0} /> : null}
          {P([{ img: H ? "app/48-course-detail-gds" : "web/m-gds-course" }, ...(H ? [] : [{ img: "app/48-course-detail-gds" }])], D0 + 10, 0, H ? 330 : 430)}
        </Stage>
        <div style={{ position: "absolute", ...(H ? { right: 110, top: 70 } : { right: 70, top: 440 }) }}><Pill t="পুরোটা বাংলায়" fs={H ? 34 : 38} delay={D0 + 50} hot /></div>
        <Caps it={it} m={m} />
      </AbsoluteFill>
    );
  }

  if (v === "modules") {
    const mods = ["এয়ার ট্রাভেল ও GDS-এর ভিত", "অ্যাভেইলেবিলিটি ও সিট বিক্রি", "PNR তৈরি ও ব্যবস্থাপনা", "ভাড়া ও ফেয়ার রুল", "টিকেটিং, রিইস্যু, রিফান্ড", "ট্রাভেল ডকুমেন্ট ও ভিসা", "OTA: অনলাইন ট্রাভেল এজেন্সি", "এজেন্সি পরিচালনা ও আইন", "মক টেস্ট ও ক্যারিয়ার", "চূড়ান্ত মূল্যায়ন ও সার্টিফিকেট"];
    const step = Math.max(6, Math.floor((len - 40) / mods.length));
    return (
      <AbsoluteFill>
        <Ink />
        <div style={{ position: "absolute", ...(H ? { left: 140, right: 140, top: 70 } : { left: 70, right: 70, top: 430 }), display: "grid", gridTemplateColumns: H ? "1fr 1fr" : "1fr", gap: H ? "16px 40px" : "12px" }}>
          {mods.map((t, i) => {
            const k = useIn(D0 + 6 + i * step, 15);
            return <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, padding: H ? "14px 22px" : "10px 18px", borderRadius: 16, background: "#1A1B22", border: `1.5px solid ${LINE}`, opacity: Math.min(1, k * 1.4), transform: `translateX(${(1 - k) * -60}px)` }}>
              <div style={{ width: H ? 56 : 50, height: H ? 56 : 50, borderRadius: 14, background: k > 0.8 ? ORANGE : "#2A2C35", color: "#14151B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: H ? 30 : 28 }}>{toBn(i + 1)}</div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: H ? 36 : 34, color: WHITE }}>{t}</div>
            </div>;
          })}
        </div>
        <Caps it={it} m={m} />
      </AbsoluteFill>
    );
  }

  if (v === "sp") {
    const k = useIn(D0 + 4, 9, 0.6);
    return (
      <AbsoluteFill>
        <Ink />
        <Burst delay={D0 + 4} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
          {H ? <div style={{ fontFamily: FONT, fontWeight: 800, fontStretch: "120%", fontSize: 360, lineHeight: 1, color: ORANGE, transform: `scale(${k})` }}>৭</div> : <div style={{ fontSize: 220, transform: `scale(${k})` }}>⚡</div>}
          <div style={{ fontFamily: FONT, fontWeight: 800, fontStretch: "118%", fontSize: H ? 120 : 112, color: WHITE, transform: `scale(${0.7 + 0.3 * k})`, opacity: Math.min(1, k * 1.5), textAlign: "center" }}>সুপার পাওয়ার</div>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 80, right: 80, bottom: H ? 60 : 380 }}><SubLine text={it.say} dur={it.dur} size={H ? 32 : 38} align="center" lead={D0} /></div>
      </AbsoluteFill>
    );
  }

  if (v === "lab3") {
    const crop: [number, number, number, number] = [0, 228, 1240, 560];
    const th = [["lab-amadeus.jpg", "Amadeus"], ["lab-galileo.jpg", "Galileo"], ["lab-sabre.jpg", "Sabre"]] as const;
    return (
      <AbsoluteFill>
        <Ink />
        {H ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", gap: 34 }}>
            {th.map(([img, l], i) => <Term key={l} img={`web/${img}`} w={560} h={360} crop={crop} delay={D0 + 6 + i * 14} label={l} tilt={(i - 1) * 3} />)}
          </div>
        ) : (
          <div style={{ position: "absolute", left: 0, right: 0, top: 410, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            {th.map(([img, l], i) => <Term key={l} img={`web/${img}`} w={860} h={250} crop={[0, 300, 1240, 360]} delay={D0 + 6 + i * 14} label={l} />)}
          </div>
        )}
        <PowerTag n={1} m={m} />
        <div style={{ position: "absolute", ...(H ? { right: 100, top: 62 } : { left: 0, right: 0, top: 1385, textAlign: "center" }), fontFamily: FONT, fontWeight: 500, fontSize: H ? 26 : 28, color: GREY }}>শিক্ষামূলক GDS সিমুলেটর</div>
        <Caps it={it} m={m} />
      </AbsoluteFill>
    );
  }

  if (v === "labrec") {
    const chips = (it.sub ?? "").split(" · ");
    return (
      <AbsoluteFill>
        <Ink />
        <div style={{ position: "absolute", ...(H ? { left: 100, top: 140 } : { left: 40, top: 420 }) }}>
          <Term vid="rec/lab-amadeus.mp4" w={H ? 1180 : 1000} h={H ? 600 : 620} crop={H ? [0, 228, 1240, 630] : [0, 228, 760, 470]} from={8} rate={2.2} delay={D0} />
        </div>
        <div style={{ position: "absolute", ...(H ? { left: 1320, right: 60, top: 150 } : { left: 40, right: 40, top: 1080 }), display: "flex", flexDirection: H ? "column" : "row", flexWrap: "wrap", gap: 12, justifyContent: H ? "flex-start" : "center" }}>
          {chips.map((t, i) => <Pill key={t} t={"✓ " + t} fs={H ? 32 : 34} delay={D0 + 14 + i * Math.floor((len - 30) / chips.length)} />)}
        </div>
        <PowerTag n={2} m={m} />
        <Caps it={it} m={m} />
      </AbsoluteFill>
    );
  }

  if (["call", "codes", "guru", "cert"].includes(v)) {
    const sets: Record<string, Scr[][]> = {
      call: [[{ img: "app/61-gds-call" }, { img: "app/62-gds-call-live" }], [{ img: "app/63-gds-review" }]],
      codes: [[{ img: "app/64-route-map" }, { img: "app/65-route-map-connect" }], [{ img: "app/66-code-master" }, { img: "app/67-code-master-round" }]],
      guru: [[{ img: "app/52-teacher" }], [{ img: "app/18-guru" }]],
      cert: [[{ img: "app/14-quiz" }], [{ img: "app/65-cert-stamp-air" }, { img: "app/12-certificates" }]],
    };
    const [a, b] = sets[v];
    return (
      <AbsoluteFill>
        <Ink />
        <Stage m={m} gap={70}>
          {H ? <>{P(a, D0 + 4, -4)}{P(b, D0 + 16, 4)}</> : P([...a, ...b], D0 + 4, 0, 440)}
        </Stage>
        {v === "call" ? <Ring m={m} d={D0 + 10} /> : null}
        {pw ? <PowerTag n={pw} m={m} /> : null}
        <Caps it={it} m={m} />
      </AbsoluteFill>
    );
  }

  if (v === "reviews") {
    const R = [["খুব ভালো বুঝিয়েছেন", "শিক্ষার্থী", 5], ["খুব ভালো। শিখতে অনেক সহজ।", "MD AMINUL ISLAM", 4], ["অনেক কিছুই শিখতে পারছি", "AL-AQSA TRAVELS", 5], ["সবকিছু সহজ ভাবে বুঝা যাচ্ছে", "Md Rofiqul Islam", 5]] as const;
    return (
      <AbsoluteFill>
        <Ink />
        <div style={{ position: "absolute", ...(H ? { left: 100, top: 110, width: 560 } : { left: 0, right: 0, top: 360, textAlign: "center" }) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontStretch: "118%", fontSize: H ? 210 : 190, color: WHITE, lineHeight: 1 }}>৪.৭</div>
          <div style={{ fontSize: 54, color: ORANGE, letterSpacing: 6 }}>{"★★★★★".split("").map((s, i) => <span key={i} style={{ opacity: lerp(f, D0 + 4 + i * 3, D0 + 10 + i * 3) }}>{s}</span>)}</div>
          <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 28, color: GREY, marginTop: 8 }}>এয়ার টিকেটিং কোর্সের ১২টি রিভিউ · aiuniversitybd.com/reviews</div>
        </div>
        <div style={{ position: "absolute", ...(H ? { left: 740, right: 100, top: 90 } : { left: 70, right: 70, top: 740 }), display: "flex", flexDirection: "column", gap: 16 }}>
          {R.map(([t, n, st], i) => {
            const k = useIn(D0 + 6 + i * 6, 15);
            return <div key={t} style={{ background: WHITE, borderRadius: 16, padding: "18px 26px", opacity: k, transform: `translateX(${(1 - k) * 80}px)` }}>
              <div style={{ color: ORANGE, fontSize: 26, letterSpacing: 3 }}>{"★".repeat(st)}<span style={{ color: "#D6D6D0" }}>{"★".repeat(5 - st)}</span></div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: H ? 34 : 34, color: "#14151B", marginTop: 4 }}>“{t}”</div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 24, color: "#5D606C", marginTop: 4 }}>{n} · এয়ার টিকেটিং কোর্স</div>
            </div>;
          })}
        </div>
        {H ? <div style={{ position: "absolute", left: 100, width: 600, bottom: 60 }}><BigCap text={it.cap} size={56} delay={D0 + 2} /></div>
          : <div style={{ position: "absolute", left: 60, right: 60, top: 170 }}><BigCap text={it.cap} size={78} align="center" delay={D0 + 2} /></div>}
      </AbsoluteFill>
    );
  }

  if (v === "price1") {
    const s = lerp(f, Math.round(len * 0.55), Math.round(len * 0.55) + 10);
    return (
      <AbsoluteFill>
        <Ink />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", paddingBottom: H ? 160 : 0 }}>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: H ? 50 : 54, color: GREY }}>নিয়মিত দাম</div>
          <div style={{ position: "relative", fontFamily: FONT, fontWeight: 800, fontStretch: "118%", fontSize: H ? 230 : 168, color: s > 0.5 ? "#6B6E7A" : WHITE }}>
            ৳১০,০০০
            <div style={{ position: "absolute", left: -20, top: "50%", height: 18, width: `calc(${s * 100}% + 40px)`, background: ORANGE, borderRadius: 9, transform: "rotate(-4deg)" }} />
          </div>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 80, right: 80, bottom: H ? 60 : 380 }}><SubLine text={it.say} dur={it.dur} size={H ? 32 : 38} align="center" lead={D0} /></div>
      </AbsoluteFill>
    );
  }

  if (v === "price2") {
    const at = Math.round(len * 0.42);
    const k = useIn(at, 9, 0.6);
    const k2 = useIn(D0 + 2, 12);
    return (
      <AbsoluteFill>
        <Ink />
        <Burst delay={at} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: H ? 10 : 18, paddingBottom: H ? 120 : 40 }}>
          <div style={{ padding: "10px 30px", borderRadius: 99, background: ORANGE, color: "#14151B", fontFamily: FONT, fontWeight: 800, fontSize: H ? 46 : 50, transform: `scale(${k2})` }}>১১.১১ অফার</div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: H ? 60 : 62, color: WHITE, opacity: k2, textAlign: "center" }}>এই কোর্স + সব কোর্স · ১ বছর</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontStretch: "120%", fontSize: H ? 280 : 220, lineHeight: 1.05, color: WHITE, transform: `scale(${0.4 + 0.6 * k})`, opacity: Math.min(1, k * 2) }}>৳১,১০০</div>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: H ? 44 : 46, color: ORANGE, opacity: lerp(f, at + 20, at + 32) }}>৩০ নভেম্বর পর্যন্ত</div>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 80, right: 80, bottom: H ? 50 : 360 }}><SubLine text={it.say} dur={it.dur} size={H ? 30 : 36} align="center" lead={D0} /></div>
      </AbsoluteFill>
    );
  }

  if (v === "cta") {
    const k1 = useIn(D0 + 2, 16), k2 = useIn(D0 + 30, 14), k3 = useIn(D0 + 60, 14);
    return (
      <AbsoluteFill>
        <Clip src="takeoff" len={len} z0={1.05} z1={1.15} dim={0.55} ox={H ? 50 : 60} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: H ? 30 : 44, paddingBottom: H ? 60 : 200 }}>
          <Img src={S("brand/logo-dark.svg")} style={{ width: H ? 280 : 340, opacity: k1 }} />
          <BigCap text={it.cap} size={H ? 120 : 120} align="center" delay={D0 + 8} caret={false} />
          <div style={{ display: "flex", flexDirection: H ? "row" : "column", alignItems: "center", gap: 26, opacity: k2, transform: `translateY(${(1 - k2) * 30}px)` }}>
            <div style={{ height: H ? 96 : 110, padding: "0 44px", borderRadius: 99, background: WHITE, display: "flex", alignItems: "center", fontFamily: LAT, fontWeight: 700, fontSize: H ? 44 : 48, color: "#14151B" }}>
              aiuniversitybd.com/offer<Caret h={H ? 44 : 48} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", opacity: k3, padding: "0 40px" }}>
            {["বিকাশ ও নগদে পেমেন্ট", "প্রথম ২০% পাঠ ফ্রি", "অ্যাপ: Google Play"].map((t, i) => <Pill key={t} t={t} fs={H ? 30 : 34} delay={D0 + 60 + i * 6} />)}
          </div>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 80, right: 80, bottom: H ? 46 : 330 }}><SubLine text={it.say} dur={it.dur} size={H ? 30 : 36} align="center" lead={D0} /></div>
      </AbsoluteFill>
    );
  }
  return <Ink />;
};

// phone ringing rings for the AI customer call
const Ring: React.FC<{ m: Mode; d: number }> = ({ m, d }) => {
  const f = useCurrentFrame() - d;
  if (f < 0 || f > 60) return null;
  return (
    <div style={{ position: "absolute", ...(m === "h" ? { left: 760, top: 300 } : { left: 440, top: 700 }), width: 200, height: 200 }}>
      {[0, 1, 2].map((i) => { const p = ((f + i * 10) % 30) / 30; return <div key={i} style={{ position: "absolute", inset: 0, borderRadius: 999, border: `5px solid ${ORANGE}`, opacity: 1 - p, transform: `scale(${0.4 + p * 1.4})` }} />; })}
    </div>
  );
};

/* ───────── film ───────── */
const SFX: Record<string, [string, number, number][]> = {
  // scene id → [file, frame offset (or -1 = at price reveal), volume]
  g01: [["boom", 6, 0.35]], g07: [["shimmer", 0, 0.3]], g09: [["riser", -40, 0.3], ["boom", 4, 0.45]],
  g10: [["whoosh", 0, 0.3]], g11: [["whoosh", 0, 0.3]], g12: [["ring", 8, 0.25]], g13: [["whoosh", 0, 0.3]], g14: [["whoosh", 0, 0.3]], g15: [["whoosh", 0, 0.3]], g16: [["whoosh", 0, 0.3]],
  g19: [["tick", 0, 0.3]], g20: [["boom", -1, 0.5]], g21: [["shimmer", 10, 0.35]],
};
export const Promo: React.FC = () => {
  const m = useMode();
  const its = items(m);
  const T = total(m);
  return (
    <AbsoluteFill style={{ background: INK }}>
      {its.map((it, i) => (
        <Sequence key={it.id} from={it.from} durationInFrames={it.len + (i < its.length - 1 ? FADE : 0)}>
          <Fade on={i > 0}>
            <Scene it={it} m={m} />
            {i > 0 && ["g09", "g10", "g20"].includes(it.id) ? <Flash /> : null}
          </Fade>
        </Sequence>
      ))}
      <Sequence from={OFF}><Audio src={S(`vo-${m}.mp3`)} /></Sequence>
      <Audio src={S("music.mp3")} volume={(f) => interpolate(f, [0, 15, T - 75, T], [0, 0.2, 0.2, 0], clamp)} />
      {its.flatMap((it) => (SFX[it.id] ?? []).map(([s, o, vol], j) => {
        const at = o === -1 ? it.from + Math.round(it.len * 0.42) : it.from + o;
        return at >= 0 ? <Sequence key={it.id + s + j} from={at} durationInFrames={90}><Audio src={S(`sfx/${s}.mp3`)} volume={vol} /></Sequence> : null;
      }))}
    </AbsoluteFill>
  );
};
const Fade: React.FC<{ on: boolean; children: React.ReactNode }> = ({ on, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: on ? interpolate(f, [0, FADE], [0, 1], clamp) : 1 }}>{children}</AbsoluteFill>;
};
