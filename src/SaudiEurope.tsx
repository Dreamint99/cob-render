// "সৌদি আরব থেকে ইউরোপ ২০২৬" — persistent 3D neon dot-map with a flying camera, glowing routes and comet planes.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import DATA from "./se-data.json";
import LANDPTS from "./land.json";
import { Flag } from "./QatarEurope";

const FPS = 30, PAD = 0.6, LEAD = 10;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const FONT = "Hind, 'Hind Siliguri', sans-serif";
const SEMI = "HindSemi, Hind, sans-serif";
const INK = "#05080A", NEON = "#2EE6A6", GOLD = "#FFC94A", RED = "#FF4D5E", CYAN = "#3CC8FF";
type Seg = { p: string; t: string; dur: number };
const SEGS = DATA as Seg[];

if (typeof document !== "undefined") {
  for (const [name, file] of [["Hind", "HindSiliguri-Bold.ttf"], ["HindSemi", "HindSiliguri-SemiBold.ttf"], ["Montserrat", "Montserrat.ttf"]]) {
    const f = new FontFace(name, `url(${staticFile("fonts/" + file)})`);
    f.load().then(() => document.fonts.add(f)).catch(() => {});
  }
}

export const timelineSE = () => { let at = 0; return SEGS.map((s) => { const len = Math.round((s.dur + PAD) * FPS) + LEAD + (s.p === "outro" ? 70 : 0); const r = { ...s, from: at, len }; at += len; return r; }); };
const T = timelineSE();
export const SE_TOTAL = T[T.length - 1].from + T[T.length - 1].len;
const seg = (p: string) => T.find((s) => s.p === p)!;
const cue = (p: string, kw: string, fb = 0) => { const s = seg(p); const i = s.t.indexOf(kw); return s.from + LEAD + Math.round(((i < 0 ? fb : i / s.t.length) * s.dur) * FPS); };

// ---------- geography ----------
const L0 = -14, L1 = 62, B0 = 12, B1 = 66, MW = 3000;
const KX = Math.cos((40 * Math.PI) / 180);
const MH = Math.round((MW * (B1 - B0)) / ((L1 - L0) * KX));
const X = (lng: number) => ((lng - L0) / (L1 - L0)) * MW;
const Y = (lat: number) => ((B1 - lat) / (B1 - B0)) * MH;
const C = {
  riyadh: { lat: 24.71, lng: 46.68, bn: "রিয়াদ", cc: "sa" },
  berlin: { lat: 52.52, lng: 13.4, bn: "বার্লিন", cc: "de" },
  warsaw: { lat: 52.23, lng: 21.01, bn: "ওয়ারশ", cc: "pl" },
  bucharest: { lat: 44.43, lng: 26.1, bn: "বুখারেস্ট", cc: "ro" },
  budapest: { lat: 47.5, lng: 19.04, bn: "বুদাপেস্ট", cc: "hu" },
  vilnius: { lat: 54.69, lng: 25.28, bn: "ভিলনিয়াস", cc: "lt" },
};
type CityK = keyof typeof C;
const COUNTRY_GLOW: Record<string, { lat: number; lng: number; rx: number; ry: number; color: string }> = {
  de: { lat: 51.0, lng: 10.4, rx: 4.2, ry: 3.6, color: GOLD }, pl: { lat: 52.0, lng: 19.3, rx: 4.6, ry: 2.8, color: RED },
  ro: { lat: 45.9, lng: 24.9, rx: 4.6, ry: 2.4, color: CYAN }, hu: { lat: 47.1, lng: 19.4, rx: 2.8, ry: 1.4, color: NEON },
  lt: { lat: 55.3, lng: 23.9, rx: 2.4, ry: 1.3, color: GOLD }, sa: { lat: 24.0, lng: 45.0, rx: 10, ry: 7, color: NEON },
};
const DOTS = (LANDPTS as [number, number][]).filter(([la, lo]) => lo >= L0 && lo <= L1 && la >= B0 && la <= B1);
const glowOf = (la: number, lo: number, active: string[]) => {
  for (const cc of active) { const g = COUNTRY_GLOW[cc]; if (((lo - g.lng) / g.rx) ** 2 + ((la - g.lat) / g.ry) ** 2 <= 1) return g.color; }
  return null;
};

// ---------- camera: per scene target, eased hand-over ----------
type Cam = { lng: number; lat: number; z: number; tilt: number; rot: number };
const CAMS: Record<string, Cam> = {
  hook: { lng: 30, lat: 40, z: 0.95, tilt: 34, rot: -5 }, overview: { lng: 26, lat: 45, z: 1.3, tilt: 30, rot: 0 },
  de: { lng: 14, lat: 50.5, z: 2.4, tilt: 28, rot: -3 }, pl: { lng: 21, lat: 51, z: 2.4, tilt: 28, rot: 3 },
  ro: { lng: 25.5, lat: 44.5, z: 2.4, tilt: 30, rot: -3 }, hulit: { lng: 22, lat: 50, z: 1.9, tilt: 30, rot: 2 },
  docs: { lng: 50, lat: 25, z: 2.0, tilt: 36, rot: 0 }, process: { lng: 30, lat: 42, z: 1.15, tilt: 32, rot: 0 },
  tips: { lng: 30, lat: 42, z: 1.2, tilt: 38, rot: 0 }, dream: { lng: 13, lat: 43, z: 1.55, tilt: 30, rot: -2 },
  outro: { lng: 30, lat: 40, z: 0.9, tilt: 40, rot: 0 },
};
const camAt = (f: number): Cam => {
  let prev = CAMS.hook, cur = CAMS.hook, from = 0;
  for (const s of T) { if (f >= s.from) { prev = cur; cur = CAMS[s.p]; from = s.from; } }
  const k = interpolate(f, [from, from + 50], [0, 1], { ...clamp, easing: ease });
  const m = (a: number, b: number) => a + (b - a) * k;
  const drift = Math.sin(f / 90) * 0.4;
  return { lng: m(prev.lng, cur.lng) + drift, lat: m(prev.lat, cur.lat), z: m(prev.z, cur.z) * (1 + 0.02 * Math.sin(f / 60)), tilt: m(prev.tilt, cur.tilt), rot: m(prev.rot, cur.rot) };
};

// route arc between two cities in map space
const arc = (a: CityK, b: CityK) => {
  const ax = X(C[a].lng), ay = Y(C[a].lat), bx = X(C[b].lng), by = Y(C[b].lat);
  const mx = (ax + bx) / 2, my = (ay + by) / 2 - Math.hypot(bx - ax, by - ay) * 0.32;
  return { d: `M${ax},${ay} Q${mx},${my} ${bx},${by}`, at: (u: number) => ({ x: (1 - u) ** 2 * ax + 2 * (1 - u) * u * mx + u * u * bx, y: (1 - u) ** 2 * ay + 2 * (1 - u) * u * my + u * u * by }) };
};
type Route = { to: CityK; start: number; color: string };

const MapWorld: React.FC<{ glow: string[]; routes: Route[]; pins: CityK[]; tint?: string; extraPins?: { lat: number; lng: number; label: string; cc: string; at: number }[] }> = ({ glow, routes, pins, tint, extraPins = [] }) => {
  const f = useCurrentFrame();
  const cam = camAt(f);
  const k = cam.z * 0.62;
  const tx = 960 - X(cam.lng) * k, ty = 540 - Y(cam.lat) * k;
  return (
    <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 30%", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: MW, height: MH, transformOrigin: "0 0",
        transform: `translate(${tx}px, ${ty}px) scale(${k})`, }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${X(cam.lng)}px ${Y(cam.lat)}px`, transform: `perspective(${1500 / k}px) rotateX(${cam.tilt}deg) rotateZ(${cam.rot}deg)` }}>
          <svg width={MW} height={MH} style={{ position: "absolute", overflow: "visible" }}>
            <defs>
              <radialGradient id="dotglow"><stop offset="0%" stopColor="#fff" stopOpacity="0.9" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></radialGradient>
            </defs>
            {DOTS.map(([la, lo], i) => {
              const g = glowOf(la, lo, glow);
              const tw = 0.55 + 0.45 * Math.sin(f / 12 + i * 0.7);
              return <circle key={i} cx={X(lo)} cy={Y(la)} r={g ? 23 : 19} fill={g ?? (tint || "#2A6B5A")} opacity={g ? 0.8 + 0.2 * tw : 0.62 + 0.12 * tw} />;
            })}
            {routes.map((r, i) => {
              const a = arc("riyadh", r.to);
              const p = interpolate(f, [r.start, r.start + 55], [0, 1], { ...clamp, easing: ease });
              if (p <= 0) return null;
              const head = a.at(p);
              return (
                <g key={i}>
                  <path d={a.d} stroke={r.color} strokeWidth={10} fill="none" opacity={0.25} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
                  <path d={a.d} stroke={r.color} strokeWidth={4} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} style={{ filter: `drop-shadow(0 0 10px ${r.color})` }} />
                  {p < 1 && <circle cx={head.x} cy={head.y} r={16} fill={r.color} style={{ filter: `drop-shadow(0 0 24px ${r.color})` }} />}
                  {p < 1 && <circle cx={head.x} cy={head.y} r={7} fill="#fff" />}
                </g>
              );
            })}
          </svg>
          {pins.map((c) => {
            const pulse = 1 + 0.25 * Math.sin(f / 8);
            return (
              <div key={c} style={{ position: "absolute", left: X(C[c].lng), top: Y(C[c].lat), transform: `translate(-50%,-50%)` }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: c === "riyadh" ? NEON : GOLD, boxShadow: `0 0 0 ${14 * pulse}px ${(c === "riyadh" ? NEON : GOLD)}33, 0 0 40px ${c === "riyadh" ? NEON : GOLD}` }} />
                <div style={{ position: "absolute", left: 48, top: -30, whiteSpace: "nowrap", fontFamily: FONT, fontSize: 48 / Math.max(1, cam.z * 0.7), color: "#fff", textShadow: "0 4px 16px #000" }}>{C[c].bn}</div>
              </div>
            );
          })}
          {extraPins.map((pn) => {
            const s = spring({ frame: f - pn.at, fps: 30, config: { damping: 11 } });
            return (
              <div key={pn.cc} style={{ position: "absolute", left: X(pn.lng), top: Y(pn.lat), transform: `translate(-50%,-50%) scale(${s})` }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: GOLD, boxShadow: `0 0 30px ${GOLD}` }} />
                <div style={{ position: "absolute", left: 38, top: -26, display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", padding: "6px 14px", borderRadius: 12, background: "rgba(5,8,10,0.85)", border: `2px solid ${GOLD}` }}>
                  <Flag cc={pn.cc} w={44} /><span style={{ fontFamily: FONT, fontSize: 30, color: "#fff" }}>{pn.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- UI ----------
const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: "left" | "right" | "up" }> = ({ at, children, style, from = "up" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 14, stiffness: 150 } });
  const off = (1 - p) * 120;
  const tr = from === "left" ? `translateX(${-off}px)` : from === "right" ? `translateX(${off}px)` : `translateY(${off * 0.6}px)`;
  return <div style={{ opacity: Math.min(1, p * 1.5), transform: tr, ...style }}>{children}</div>;
};
const Glass: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; accent?: string }> = ({ children, style, accent = NEON }) => (
  <div style={{ background: "rgba(8,14,16,0.78)", border: `1px solid ${accent}55`, boxShadow: `0 30px 80px rgba(0,0,0,0.55), inset 0 0 40px ${accent}11`, borderRadius: 28, backdropFilter: "blur(10px)", ...style }}>{children}</div>
);
const Words: React.FC<{ text: string; at: number; size: number; hl?: string[]; color?: string }> = ({ text, at, size, hl = [], color = "#fff" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.26}px`, fontFamily: FONT, fontSize: size, lineHeight: 1.18, color, textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>
      {text.split(" ").map((w, i) => { const p = spring({ frame: f - at - i * 3, fps, config: { damping: 15 } });
        return <span key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)`, filter: `blur(${(1 - p) * 6}px)`, color: hl.some((h) => w.includes(h)) ? GOLD : undefined }}>{w}</span>; })}
    </div>
  );
};

const CountryCard: React.FC<{ s: ReturnType<typeof seg>; cc: string; name: string; clip: string; points: [string, string][]; accent: string; n: string }> = ({ s, cc, name, clip, points, accent, n }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", right: 60, top: 120, width: 640 }}>
      <Pop at={s.from + 18} from="right">
        <Glass accent={accent} style={{ overflow: "hidden" }}>
          <div style={{ position: "relative", height: 330, overflow: "hidden" }}>
            <OffthreadVideo src={staticFile(`se/stock/${clip}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + (f - s.from) * 0.0006})` }} />
            <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 40%, rgba(8,14,16,0.95) 100%)" }} />
            <div style={{ position: "absolute", left: 26, bottom: 18, display: "flex", alignItems: "center", gap: 16 }}>
              <Flag cc={cc} w={84} /><span style={{ fontFamily: FONT, fontSize: 60, color: "#fff" }}>{name}</span>
            </div>
            <div style={{ position: "absolute", right: 22, top: 18, fontFamily: "Montserrat", fontWeight: 800, fontSize: 26, color: accent, background: "rgba(0,0,0,0.6)", padding: "4px 14px", borderRadius: 999 }}>{n}</div>
          </div>
          <div style={{ padding: "22px 28px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
            {points.map(([e, t], i) => (
              <Pop key={i} at={s.from + 40 + i * Math.round((s.len - 70) / points.length)}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 34 }}>{e}</span><span style={{ fontFamily: SEMI, fontSize: 32, color: "#E8F2EE", lineHeight: 1.35 }}>{t}</span>
                </div>
              </Pop>
            ))}
          </div>
        </Glass>
      </Pop>
    </div>
  );
};

const Caption: React.FC = () => {
  const f = useCurrentFrame();
  const s = [...T].reverse().find((x) => f >= x.from);
  if (!s) return null;
  const parts = s.t.split(/(?<=[।?!])\s+|\s+—\s+/).filter(Boolean);
  const total = parts.reduce((a, p) => a + p.length, 0), speak = s.dur * FPS;
  let acc = 0;
  const cur = parts.map((p) => { const a = s.from + LEAD + (acc / total) * speak; acc += p.length; return { p, a, b: s.from + LEAD + (acc / total) * speak }; }).find((x) => f >= x.a && f < x.b + 6);
  if (!cur) return null;
  return (
    <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: interpolate(f, [cur.a, cur.a + 5], [0, 1], clamp) }}>
      <div style={{ maxWidth: 1450, padding: "10px 26px", borderRadius: 14, background: "rgba(0,0,0,0.65)", fontFamily: SEMI, fontSize: 36, color: "#fff", textAlign: "center", lineHeight: 1.35 }}>{cur.p}</div>
    </div>
  );
};

const HUD: React.FC = () => {
  const f = useCurrentFrame();
  const s = [...T].reverse().find((x) => f >= x.from)!;
  const chap: Record<string, string> = { hook: "", overview: "রুট ম্যাপ", de: "দেশ ০১/০৫", pl: "দেশ ০২/০৫", ro: "দেশ ০৩/০৫", hulit: "দেশ ০৪–০৫/০৫", docs: "কাগজপত্র", process: "প্রক্রিয়া", tips: "সতর্কতা", dream: "ড্রিম ইন্টারন্যাশনাল", outro: "" };
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 40, display: "flex", alignItems: "center", gap: 14, opacity: f > 30 ? 1 : 0 }}>
        <div style={{ padding: "8px 18px", borderRadius: 999, background: "rgba(8,14,16,0.8)", border: `1px solid ${NEON}66`, fontFamily: "Montserrat", fontWeight: 800, fontSize: 22, letterSpacing: 2, color: NEON }}>RIYADH ✈ EUROPE · 2026</div>
        {chap[s.p] && <div style={{ fontFamily: SEMI, fontSize: 26, color: "#ffffffaa" }}>{chap[s.p]}</div>}
      </div>
      {f > 60 && <div style={{ position: "absolute", right: 50, top: 36, background: "#fff", borderRadius: 12, padding: "6px 12px" }}><Img src={staticFile("serbia/dream-logo.png")} style={{ height: 40, display: "block" }} /></div>}
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 5, width: `${(f / SE_TOTAL) * 100}%`, background: `linear-gradient(90deg, ${NEON}, ${GOLD})` }} />
    </>
  );
};

// ---------- scene overlays (rendered in absolute time) ----------
const Overlays: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = seg("hook"), ov = seg("overview"), de = seg("de"), pl = seg("pl"), ro = seg("ro"), hl = seg("hulit"), dc = seg("docs"), pr = seg("process"), tp = seg("tips"), dr = seg("dream"), ou = seg("outro");
  const inS = (s: { from: number; len: number }) => f >= s.from && f < s.from + s.len;
  return (
    <>
      {inS(h) && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 26, background: "radial-gradient(ellipse at center, rgba(5,8,10,0.2) 0%, rgba(5,8,10,0.75) 75%)" }}>
          <Pop at={h.from + 6}><div style={{ display: "flex", alignItems: "center", gap: 30 }}><Flag cc="sa" w={170} /><div style={{ fontSize: 70 }}>✈️</div><Flag cc="eu" w={170} /></div></Pop>
          <div style={{ textAlign: "center" }}><Words text="সৌদি আরব থেকে ইউরোপ" at={h.from + 14} size={124} hl={["ইউরোপ"]} /></div>
          <Pop at={h.from + 40}><div style={{ padding: "12px 34px", borderRadius: 999, background: NEON, color: INK, fontFamily: FONT, fontSize: 44 }}>২০২৬ · ওয়ার্ক ভিসার ৫ দেশ — ম্যাপে</div></Pop>
        </AbsoluteFill>
      )}
      {inS(ov) && (
        <div style={{ position: "absolute", left: 60, top: 120, width: 600 }}>
          <Pop at={ov.from + 10} from="left">
            <Glass style={{ padding: 32 }}>
              <div style={{ fontFamily: SEMI, fontSize: 30, color: NEON }}>রিয়াদ → ইউরোপ</div>
              <div style={{ fontFamily: FONT, fontSize: 64, color: "#fff", lineHeight: 1.1 }}>✈️ ~৬–৭ ঘণ্টা</div>
              <div style={{ height: 1, background: "#ffffff22", margin: "20px 0" }} />
              {[["de", "জার্মানি", "জার্মানি"], ["pl", "পোল্যান্ড", "পোল্যান্ড"], ["ro", "রোমানিয়া", "রোমানিয়া"], ["hu", "হাঙ্গেরি", "হাঙ্গেরি"], ["lt", "লিথুয়ানিয়া", "লিথুয়ানিয়া"]].map(([cc, n, kw], i) => (
                <Pop key={cc} at={cue("overview", kw) - 4}><div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}><Flag cc={cc} w={56} /><span style={{ fontFamily: FONT, fontSize: 38, color: "#fff" }}>{n}</span><span style={{ marginLeft: "auto", fontFamily: "Montserrat", fontWeight: 800, color: GOLD, fontSize: 24 }}>0{i + 1}</span></div></Pop>
              ))}
            </Glass>
          </Pop>
        </div>
      )}
      {inS(de) && <CountryCard s={de} cc="de" name="জার্মানি" clip="berlin" n="01 / 05" accent={GOLD} points={[["🎓", "ব্লু কার্ড / স্কিলড ওয়ার্কার ভিসা"], ["📜", "স্বীকৃত ডিগ্রি বা পেশাগত যোগ্যতা"], ["🗣️", "জার্মান ভাষা জানলে সুযোগ বেশি"], ["💶", "বেতন ভালো, শর্ত কঠিন"]]} />}
      {inS(pl) && <CountryCard s={pl} cc="pl" name="পোল্যান্ড" clip="warsaw" n="02 / 05" accent={RED} points={[["🏗️", "নির্মাণ · কৃষি · আইটিতে চাহিদা"], ["🏢", "আগে নিয়োগকর্তা ওয়ার্ক পারমিট নেন"], ["🛂", "তারপর ন্যাশনাল ডি ভিসা আবেদন"]]} />}
      {inS(ro) && <CountryCard s={ro} cc="ro" name="রোমানিয়া" clip="bucharest" n="03 / 05" accent={CYAN} points={[["🏢", "নিয়োগকর্তা ইমিগ্রেশন অফিস থেকে পারমিট নেন"], ["🛂", "তারপর ভিসার আবেদন"], ["👮", "সৌদি পুলিশ ক্লিয়ারেন্স সাধারণত লাগে"]]} />}
      {inS(hl) && (
        <div style={{ position: "absolute", right: 60, top: 120, width: 640, display: "flex", flexDirection: "column", gap: 20 }}>
          {[["hu", "হাঙ্গেরি", "budapest", "04", NEON, hl.from + 14], ["lt", "লিথুয়ানিয়া", "vilnius", "05", GOLD, cue("hulit", "লিথুয়ানিয়া")]].map(([cc, n, clip, k, ac, at]) => (
            <Pop key={cc as string} at={at as number} from="right">
              <Glass accent={ac as string} style={{ display: "flex", overflow: "hidden", height: 230 }}>
                <OffthreadVideo src={staticFile(`se/stock/${clip}.mp4`)} muted style={{ width: 290, height: "100%", objectFit: "cover" }} />
                <div style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Flag cc={cc as string} w={60} /><span style={{ fontFamily: FONT, fontSize: 46, color: "#fff" }}>{n}</span></div>
                  <span style={{ fontFamily: SEMI, fontSize: 28, color: "#cfe" }}>নিয়োগকর্তার পারমিট → দূতাবাসে ভিসা</span>
                  <span style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 22, color: ac as string }}>{k} / 05</span>
                </div>
              </Glass>
            </Pop>
          ))}
        </div>
      )}
      {inS(dc) && (
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,8,10,0.92) 0%, rgba(5,8,10,0.55) 55%, transparent 80%)" }}>
          <div style={{ position: "absolute", left: 90, top: 110, width: 960 }}>
            <Words text="সৌদি থেকে আবেদনে যা লাগে" at={dc.from + 6} size={64} hl={["যা"]} />
            <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 14 }}>
              {[["🛂", "পাসপোর্ট (৬ মাসের বেশি মেয়াদ)", "পাসপোর্ট"], ["🪪", "বৈধ ইকামা", "ইকামা"], ["💼", "চাকরির অফার + ওয়ার্ক পারমিট", "চাকরির অফার"], ["🏥", "স্বাস্থ্য বীমা", "স্বাস্থ্য"], ["🏦", "ব্যাংক স্টেটমেন্ট", "ব্যাংক"], ["👮", "সৌদি পুলিশ ক্লিয়ারেন্স (প্রয়োজনে)", "পুলিশ"], ["🚪", "এক্সিট / রি-এন্ট্রি ভিসা আগেই ঠিক করুন", "এক্সিট"]].map(([e, t, kw], i) => {
                const at = cue("docs", kw) - 6;
                return (
                  <Pop key={i} at={at} from="left">
                    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 22px", borderRadius: 16, background: f >= at ? "rgba(46,230,166,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${f >= at ? NEON + "88" : "#ffffff1a"}` }}>
                      <span style={{ fontSize: 36 }}>{e}</span><span style={{ fontFamily: SEMI, fontSize: 32, color: "#fff", flex: 1 }}>{t}</span><span style={{ color: NEON, fontSize: 32 }}>✓</span>
                    </div>
                  </Pop>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}
      {inS(pr) && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, display: "flex", justifyContent: "center", gap: 22 }}>
          {[["💼", "চাকরির অফার", "চাকরির অফার"], ["🏢", "নিয়োগকর্তার ওয়ার্ক পারমিট", "নিয়োগকর্তার ওয়ার্ক"], ["🏛️", "দূতাবাসে কাগজ ও সাক্ষাৎকার", "দূতাবাসে"], ["✈️", "ভিসা হাতে — ইউরোপ!", "ভিসা হাতে"]].map(([e, t, kw], i) => {
            const at = cue("process", kw) - 6;
            const on = f >= at;
            return (
              <Pop key={i} at={at}>
                <Glass accent={on ? GOLD : NEON} style={{ width: 380, padding: "22px 24px", display: "flex", alignItems: "center", gap: 16, transform: `scale(${on && f < at + 60 ? 1.05 : 1})` }}>
                  <div style={{ width: 70, height: 70, borderRadius: "50%", background: on ? GOLD : "#1C3A33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0 }}>{e}</div>
                  <div><div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 20, color: GOLD }}>STEP {i + 1}</div><div style={{ fontFamily: FONT, fontSize: 32, color: "#fff", lineHeight: 1.2 }}>{t}</div></div>
                </Glass>
              </Pop>
            );
          })}
        </div>
      )}
      {inS(tp) && (
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, transparent 30%, rgba(255,77,94,${0.25 + 0.1 * Math.sin(f / 6)}) 100%)`, alignItems: "center", justifyContent: "center" }}>
          <Glass accent={RED} style={{ width: 1300, padding: "40px 54px" }}>
            <Pop at={tp.from + 6}><div style={{ fontFamily: FONT, fontSize: 70, color: RED }}>⚠️ সাবধান!</div></Pop>
            {[["⚡", "\"খুব দ্রুত ভিসা করিয়ে দেব\" — সতর্ক হোন", "কেউ খুব"], ["🏛️", "শুধু দূতাবাসের অফিসিয়াল চ্যানেল", "অফিসিয়াল"], ["🏢", "সত্যিকারের অফিস আছে এমন এজেন্সি", "এজেন্সির"], ["🌐", "সর্বশেষ নিয়ম দূতাবাসের ওয়েবসাইটে যাচাই", "যাচাই"]].map(([e, t, kw], i) => (
              <Pop key={i} at={cue("tips", kw) - 6}><div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 18 }}><span style={{ fontSize: 44 }}>{e}</span><span style={{ fontFamily: FONT, fontSize: 42, color: "#fff" }}>{t}</span></div></Pop>
            ))}
          </Glass>
        </AbsoluteFill>
      )}
      {inS(dr) && (() => {
        const stamp = spring({ frame: f - cue("dream", "নো ভিসা"), fps, config: { damping: 9, stiffness: 220 } });
        return (
          <div style={{ position: "absolute", left: 60, top: 110, width: 760 }}>
            <Pop at={dr.from + 6} from="left">
              <Glass accent={GOLD} style={{ padding: 34 }}>
                <div style={{ background: "#fff", borderRadius: 18, padding: "12px 20px", display: "inline-block" }}><Img src={staticFile("serbia/dream-logo.png")} style={{ height: 80, display: "block" }} /></div>
                <div style={{ marginTop: 26, display: "inline-block", transform: `scale(${2.2 - 1.2 * stamp}) rotate(${-6 * stamp}deg)`, opacity: Math.min(1, stamp * 2), padding: "10px 24px", border: `6px solid ${RED}`, borderRadius: 14, color: RED, background: "#fff", fontFamily: "Montserrat", fontWeight: 900, fontSize: 44, letterSpacing: 2 }}>NO VISA, NO PAYMENT</div>
                <div style={{ fontFamily: FONT, fontSize: 40, color: GOLD, marginTop: 20 }}>ভিসা হাতে পেলে তবেই টাকা ✅</div>
                <div style={{ fontFamily: SEMI, fontSize: 30, color: "#cfe", marginTop: 12 }}>সার্বিয়া · বসনিয়া · গ্রিস · পর্তুগাল · মলদোভা · বুলগেরিয়া</div>
                <div style={{ marginTop: 24, display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 30px", borderRadius: 999, background: "#25D366" }}>
                  <span style={{ fontSize: 40 }}>💬</span><span style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 44, color: "#fff" }}>+974 7138 2220</span>
                </div>
              </Glass>
            </Pop>
          </div>
        );
      })()}
      {inS(ou) && (() => {
        const sub = cue("outro", "সাবস্ক্রাইব"), clicked = f > sub + 10;
        return (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30, background: "radial-gradient(ellipse at center, rgba(5,8,10,0.4) 0%, rgba(5,8,10,0.85) 75%)" }}>
            <Pop at={ou.from + 4}><div style={{ background: "#fff", borderRadius: 22, padding: "14px 24px" }}><Img src={staticFile("serbia/dream-logo.png")} style={{ height: 96, display: "block" }} /></div></Pop>
            <Pop at={ou.from + 14}><div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 46px", borderRadius: 999, background: "#25D366", boxShadow: "0 20px 60px rgba(37,211,102,0.5)" }}><span style={{ fontSize: 56 }}>💬</span><span style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 60, color: "#fff" }}>+974 7138 2220</span></div></Pop>
            <Pop at={ou.from + 22}><div style={{ fontFamily: SEMI, fontSize: 36, color: "#fff" }}>WhatsApp · dreamintcs.com · সিলেট ও দোহা অফিস</div></Pop>
            <Pop at={sub - 20}><div style={{ display: "flex", gap: 22 }}>
              <div style={{ padding: "18px 46px", borderRadius: 14, background: clicked ? "#3F3F46" : "#FF0000", color: "#fff", fontFamily: FONT, fontSize: 42 }}>{clicked ? "✓ সাবস্ক্রাইবড" : "▶ সাবস্ক্রাইব"}</div>
              <div style={{ padding: "18px 30px", borderRadius: 14, background: "#27272A", fontSize: 42, transform: `rotate(${clicked ? Math.sin(f / 2) * 12 * Math.max(0, 1 - (f - sub - 10) / 30) : 0}deg)` }}>🔔</div>
            </div></Pop>
          </AbsoluteFill>
        );
      })()}
    </>
  );
};

export const SaudiEurope: React.FC = () => {
  const f = useCurrentFrame();
  const all: CityK[] = ["berlin", "warsaw", "bucharest", "budapest", "vilnius"];
  const s = [...T].reverse().find((x) => f >= x.from)!.p;
  // which routes/glows are live
  const ovCue = (kw: string) => cue("overview", kw);
  const routes: Route[] = [
    { to: "berlin", start: ovCue("জার্মানি") - 10, color: GOLD }, { to: "warsaw", start: ovCue("পোল্যান্ড") - 10, color: RED },
    { to: "bucharest", start: ovCue("রোমানিয়া") - 10, color: CYAN }, { to: "budapest", start: ovCue("হাঙ্গেরি") - 10, color: NEON },
    { to: "vilnius", start: ovCue("লিথুয়ানিয়া") - 10, color: GOLD },
  ];
  const glow = { hook: ["sa"], overview: ["sa", "de", "pl", "ro", "hu", "lt"], de: ["de"], pl: ["pl"], ro: ["ro"], hulit: ["hu", "lt"], docs: ["sa"], process: ["sa", "de", "pl", "ro", "hu", "lt"], tips: [], dream: [], outro: ["sa"] }[s] ?? [];
  const pinsBy: Record<string, CityK[]> = { hook: ["riyadh"], overview: ["riyadh", ...all], de: ["riyadh", "berlin"], pl: ["riyadh", "warsaw"], ro: ["riyadh", "bucharest"], hulit: ["riyadh", "budapest", "vilnius"], docs: ["riyadh"], process: ["riyadh", ...all], tips: ["riyadh"], dream: [], outro: ["riyadh"] };
  const dreamPins = s === "dream" ? [
    { cc: "rs", lat: 44.8, lng: 20.46, label: "সার্বিয়া", at: cue("dream", "সার্বিয়া") }, { cc: "ba", lat: 43.86, lng: 18.41, label: "বসনিয়া", at: cue("dream", "বসনিয়া") },
    { cc: "gr", lat: 37.98, lng: 23.73, label: "গ্রিস", at: cue("dream", "গ্রিস") }, { cc: "pt", lat: 38.72, lng: -9.14, label: "পর্তুগাল", at: cue("dream", "পর্তুগাল") },
    { cc: "md", lat: 47.01, lng: 28.86, label: "মলদোভা", at: cue("dream", "মলদোভা") }, { cc: "bg", lat: 42.7, lng: 23.32, label: "বুলগেরিয়া", at: cue("dream", "বুলগেরিয়া") },
  ] : [];
  // process: replay routes one by one with the plane
  const live = s === "process" ? routes.map((r, i) => ({ ...r, start: seg("process").from + 20 + i * 18 })) : ["hook", "docs", "tips", "dream", "outro"].includes(s) ? [] :
    s === "overview" ? routes : routes.filter((r) => pinsBy[s].includes(r.to)).map((r) => ({ ...r, start: Math.max(r.start, seg(s).from + 10) }));
  const voOn = (fr: number) => T.reduce((m, x) => Math.max(m, interpolate(fr, [x.from + LEAD - 6, x.from + LEAD, x.from + x.len - 22, x.from + x.len - 6], [0, 1, 1, 0], clamp)), 0);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 20%, #0C1F1C 0%, ${INK} 65%)` }}>
      <MapWorld glow={glow} routes={live} pins={pinsBy[s] ?? []} tint={s === "tips" ? "#3A1C22" : undefined} extraPins={dreamPins} />
      {/* vignette + scanlines for the "new style" */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 4px)", pointerEvents: "none" }} />
      <Overlays />
      <Caption />
      <HUD />
      {T.map((x, i) => (
        <Sequence key={x.p} from={x.from} durationInFrames={x.len}>
          <Sequence from={LEAD}><Audio src={staticFile(`se/vo/${x.p}.mp3`)} /></Sequence>
          {i > 0 && <Audio src={staticFile("mohajon/sfx/whoosh.mp3")} volume={0.35} />}
          {i === 0 && <Audio src={staticFile("mohajon/sfx/impact.mp3")} volume={0.5} />}
        </Sequence>
      ))}
      <Audio src={staticFile("guide/bed.mp3")} startFrom={600} volume={(fr) => interpolate(fr, [0, 20, SE_TOTAL - 60, SE_TOTAL], [0, 1, 1, 0], clamp) * (0.3 - 0.19 * voOn(fr))} />
    </AbsoluteFill>
  );
};

export const SEThumb: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 70% 40%, #0C2A24 0%, ${INK} 70%)`, overflow: "hidden" }}>
    <svg width={1280} height={720} style={{ position: "absolute" }}>
      {DOTS.filter((_, i) => i % 1 === 0).map(([la, lo], i) => { const x = 380 + ((lo - L0) / (L1 - L0)) * 900, y = ((B1 - la) / (B1 - B0)) * 760 - 20; const g = glowOf(la, lo, ["sa", "de", "pl", "ro", "hu", "lt"]);
        return <circle key={i} cx={x} cy={y} r={g ? 4.2 : 3.4} fill={g ?? "#1C3A33"} />; })}
      {(["berlin", "warsaw", "bucharest", "budapest", "vilnius"] as CityK[]).map((c) => { const ax = 380 + ((C.riyadh.lng - L0) / (L1 - L0)) * 900, ay = ((B1 - C.riyadh.lat) / (B1 - B0)) * 760 - 20;
        const bx = 380 + ((C[c].lng - L0) / (L1 - L0)) * 900, by = ((B1 - C[c].lat) / (B1 - B0)) * 760 - 20;
        return <path key={c} d={`M${ax},${ay} Q${(ax + bx) / 2},${(ay + by) / 2 - 120} ${bx},${by}`} stroke={GOLD} strokeWidth={4} fill="none" style={{ filter: `drop-shadow(0 0 8px ${GOLD})` }} />; })}
    </svg>
    <AbsoluteFill style={{ background: `linear-gradient(90deg, ${INK} 0%, ${INK}cc 35%, transparent 65%)` }} />
    <div style={{ position: "absolute", left: 50, top: 40, background: NEON, color: INK, fontFamily: FONT, fontSize: 40, padding: "4px 22px", borderRadius: 12 }}>২০২৬ আপডেট</div>
    <div style={{ position: "absolute", left: 50, top: 120, fontFamily: FONT, color: "#fff", lineHeight: 1.05, textShadow: "0 6px 20px rgba(0,0,0,0.7)" }}>
      <div style={{ fontSize: 96 }}>সৌদি আরব</div>
      <div style={{ fontSize: 70 }}>থেকে</div>
      <div style={{ fontSize: 130, color: GOLD }}>ইউরোপ</div>
      <div style={{ fontSize: 44, marginTop: 6 }}>ওয়ার্ক ভিসার ৫ দেশ 🗺️</div>
    </div>
    <div style={{ position: "absolute", left: 50, bottom: 40, display: "flex", gap: 10 }}>{["de", "pl", "ro", "hu", "lt"].map((cc) => <Flag key={cc} cc={cc} w={80} />)}</div>
    <div style={{ position: "absolute", right: 40, bottom: 40, background: "#fff", borderRadius: 16, padding: "10px 18px" }}><Img src={staticFile("serbia/dream-logo.png")} style={{ height: 60, display: "block" }} /></div>
  </AbsoluteFill>
);
