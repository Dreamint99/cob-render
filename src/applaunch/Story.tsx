// AIU app launch — STORY cut (owner 2026-11-12 v2: "story, build-up, cartoon characters, infographics, why our course is best (GDS lab),
// real reviews, a bit longer"). Story: a customer calls a travel agent → "could you cut this ticket?" → what GDS is → who it is for →
// the problem → the app → the 10-step curriculum → GDS lab → AI customer call → extras → real reviews → one subscription → offer →
// "the next call is yours". Cartoon art: work/applaunch/art.py (Gemini, one reference character) → public/applaunch/art/*.jpg.
// VO: src/applaunch/story.json → work/applaunch/make_story_vo.py (N Tanvir, C Shahriar as the customer) → story_durs.json.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import DURS from "./story_durs.json";
import LINES from "./story.json";
import {
  BG, BLUE, BLUE2, SKY, GOLD, ORANGE, MINT, RED, TXT, MUTE, HEAD, BODY, LAT, MONO, GOLDG, S, clamp, lerp, useMode, pick, useIn,
  Backdrop, Chip, Phone, PlayBadge, PlayLogo, Mode, Offer, Cta,
} from "./Launch";

const FPS = 30;
const D = DURS as Record<string, number>;
const L = LINES as unknown as Record<string, [string, string]>;
const ORDER = ["s01", "s02", "s03", "s04", "s05", "s06", "s07", "s08", "s09", "s10", "s11", "s12", "s13", "s14"] as const;
type Id = (typeof ORDER)[number];
const LEAD: Partial<Record<Id, number>> = { s01: 26 };       // s01: the phone rings before the customer speaks
const EXTRA: Partial<Record<Id, number>> = { s11: 170, s13: 24, s14: 80, s07: 12 };
const TAIL = 8;
const timeline = () => {
  let at = 0;
  return ORDER.map((id) => {
    const lead = LEAD[id] ?? 6;
    const len = Math.round(D[id] * FPS) + lead + TAIL + (EXTRA[id] ?? 0);
    const it = { id, from: at, len, lead }; at += len; return it;
  });
};
export const storyTotal = () => { const t = timeline(); const l = t[t.length - 1]; return l.from + l.len; };

/* ───────── layout ───────── */
// V 1080×1920: title 230–460, stage 960² at y 480, captions ~1490 (above the Reels UI). F 1080×1350: stage 700². H 1920×1080: text left, stage right.
const useLay = () => {
  const m = useMode();
  return {
    m,
    title: pick(m, { left: 60, right: 60, top: 220 }, { left: 50, right: 50, top: 36 }, { left: 100, top: 150, width: 760 }),
    stage: pick(m, { x: 60, y: 470, w: 960, h: 960 }, { x: 190, y: 190, w: 700, h: 700 }, { x: 900, y: 70, w: 940, h: 940 }),
    cap: pick(m, { left: 50, right: 50, top: 1475 }, { left: 40, right: 40, top: 925 }, { left: 100, top: 820, width: 760 }),
    ts: pick(m, 76, 60, 72),
  };
};

const Head: React.FC<{ text: string; hot?: string[]; delay?: number; sub?: string }> = ({ text, hot = [], delay = 2, sub }) => {
  const f = useCurrentFrame();
  const { m, title, ts } = useLay();
  return (
    <div style={{ position: "absolute", ...title, textAlign: m === "h" ? "left" : "center" }}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: ts, lineHeight: 1.2, color: TXT }}>
        {text.split(" ").map((w, i) => {
          const k = lerp(f, delay + i * 3, delay + i * 3 + 12);
          const isHot = hot.includes(w);
          return <span key={i} style={{ display: "inline-block", marginRight: "0.24em", opacity: k, transform: `translateY(${(1 - k) * 36}px)`, filter: `blur(${(1 - k) * 6}px)`,
            ...(isHot ? { background: GOLDG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", paddingBottom: "0.08em" } : {}) }}>{w}</span>;
        })}
      </div>
      {sub ? <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: ts * 0.5, color: "#CBD5E1", marginTop: 10, opacity: lerp(f, delay + 14, delay + 26) }}>{sub}</div> : null}
    </div>
  );
};

// illustrated card with a slow camera move (Ken Burns), circle reveal, a light 3D sway
const Art: React.FC<{ src: string; x: number; y: number; w: number; h: number; delay?: number; z0?: number; z1?: number; ox?: number; oy?: number; dx?: number; dy?: number; len?: number; radius?: number; dim?: number }> =
  ({ src, x, y, w, h, delay = 0, z0 = 1.04, z1 = 1.16, ox = 50, oy = 50, dx = 0, dy = 0, len = 240, radius = 36, dim = 0 }) => {
  const f = useCurrentFrame();
  const r = lerp(f, delay, delay + 18);
  const t = interpolate(f, [0, len], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const z = z0 + (z1 - z0) * t;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: radius, overflow: "hidden", clipPath: `circle(${r * 75}% at 50% 50%)`,
      boxShadow: `0 40px 100px rgba(0,0,0,0.55), 0 0 0 3px ${BLUE2}55`, transform: `perspective(2000px) rotateY(${Math.sin(f / 50) * 2}deg) rotateX(${Math.cos(f / 60) * 1.5}deg)` }}>
      <Img src={S(`art/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${ox}% ${oy}%`, transform: `scale(${z}) translate(${dx * t}%, ${dy * t}%)`, transformOrigin: `${ox}% ${oy}%` }} />
      {dim ? <AbsoluteFill style={{ background: `rgba(4,11,31,${dim})` }} /> : null}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 60%, rgba(4,11,31,0.35))" }} />
    </div>
  );
};

const Bubble: React.FC<{ text: string; x: number; y: number; w: number; fs: number; delay: number; tail?: "left" | "right" | "down"; color?: string; ink?: string }> =
  ({ text, x, y, w, fs, delay, tail = "down", color = "#FFFFFF", ink = "#0F172A" }) => {
  const k = useIn(delay, 11, 0.6);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${k})`, transformOrigin: tail === "left" ? "0% 100%" : tail === "right" ? "100% 100%" : "50% 100%", opacity: Math.min(1, k * 2) }}>
      <div style={{ background: color, color: ink, borderRadius: fs * 0.9, padding: `${fs * 0.55}px ${fs * 0.8}px`, fontFamily: BODY, fontWeight: 700, fontSize: fs, lineHeight: 1.35, boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>{text}</div>
      <div style={{ position: "absolute", bottom: -fs * 0.5, left: tail === "left" ? fs : tail === "right" ? undefined : "46%", right: tail === "right" ? fs : undefined, width: 0, height: 0,
        borderLeft: `${fs * 0.5}px solid transparent`, borderRight: `${fs * 0.5}px solid transparent`, borderTop: `${fs * 0.6}px solid ${color}` }} />
    </div>
  );
};

// karaoke captions for sound-off viewers
const Caption: React.FC<{ id: Id; lead: number }> = ({ id, lead }) => {
  const f = useCurrentFrame() - lead;
  const { cap, m } = useLay();
  if (f < 0) return null;
  const [who, text] = L[id];
  const words = text.split(" ");
  const n = Math.ceil(interpolate(f, [0, D[id] * FPS * 0.95], [0, words.length], clamp));
  const fs = pick(m, 44, 36, 36);
  // show a window of ~12 words around the current one so long lines stay 2–3 rows
  const start = Math.max(0, Math.min(words.length - 12, n - 8));
  const shown = words.slice(start, start + 12);
  return (
    <div style={{ position: "absolute", ...cap, textAlign: m === "h" ? "left" : "center", fontFamily: BODY, fontWeight: 700, fontSize: fs, lineHeight: 1.4, color: "#fff" }}>
      {who === "C" ? <div style={{ fontSize: fs * 0.62, color: MINT, marginBottom: 4 }}>📞 গ্রাহক</div> : null}
      <span style={{ background: "rgba(2,6,23,0.72)", padding: "8px 16px", borderRadius: 16, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
        {shown.map((w, i) => { const j = start + i; return <span key={j} style={{ opacity: j < n ? 1 : 0.35, color: j === n - 1 ? GOLD : "#fff" }}>{w} </span>; })}
      </span>
    </div>
  );
};

/* ───────── scenes ───────── */
const Ring: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const { m, stage } = useLay();
  const shake = f < 30 || (f > 60 && f < 75) ? Math.sin(f * 2.2) * 6 : 0;
  const call = useIn(8, 12);
  const fs = pick(m, 40, 32, 36);
  return (
    <AbsoluteFill>
      <Backdrop hue={BLUE} />
      <Head text="একজন গ্রাহক কল করেছেন…" hot={["গ্রাহক"]} />
      <Art src="agent-desk" {...stage} z0={1.0} z1={1.25} ox={28} oy={72} len={len} />
      {/* ringing pulse over the desk phone */}
      <div style={{ position: "absolute", left: stage.x + stage.w * 0.2 - 60, top: stage.y + stage.h * 0.72 - 60, width: 120, height: 120, transform: `translate(${shake}px,0)` }}>
        {[0, 1, 2].map((i) => { const p = ((f + i * 10) % 30) / 30; return <div key={i} style={{ position: "absolute", inset: 0, borderRadius: 100, border: `5px solid ${GOLD}`, opacity: f < 90 ? 1 - p : 0, transform: `scale(${0.5 + p * 1.4})` }} />; })}
      </div>
      {/* incoming call card */}
      <div style={{ position: "absolute", left: stage.x + 40, right: m === "h" ? undefined : stage.x + 40, width: m === "h" ? stage.w - 80 : undefined, top: stage.y + 30, padding: fs * 0.6, borderRadius: fs, background: "rgba(15,23,42,0.92)", border: `2px solid ${MINT}88`,
        display: "flex", alignItems: "center", gap: fs * 0.6, transform: `translateY(${(1 - call) * -140}px)`, opacity: call }}>
        <Img src={S("art/a03-customer.jpg")} style={{ width: fs * 2.2, height: fs * 2.2, borderRadius: 100, objectFit: "cover", objectPosition: "50% 20%", border: `3px solid ${MINT}` }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs * 0.62, color: MINT }}>কল আসছে…</div>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: fs, color: TXT }}>আব্দুল করিম · গ্রাহক</div>
        </div>
        <div style={{ width: fs * 1.6, height: fs * 1.6, borderRadius: 100, background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: fs * 0.8, transform: `rotate(${Math.sin(f / 2) * 12}deg)` }}>📞</div>
      </div>
      <Bubble text="রিয়াদ যাব, ১৫ ডিসেম্বর, ওয়ান ওয়ে। টিকেটটা হবে?" x={stage.x + stage.w * 0.08} y={stage.y + stage.h * 0.36} w={stage.w * 0.62} fs={fs} delay={30} tail="left" />
    </AbsoluteFill>
  );
};

const Worried: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const { stage, m } = useLay();
  return (
    <AbsoluteFill>
      <Backdrop hue="#7C3AED" />
      <Head text="আপনি হলে কী করতেন?" hot={["আপনি"]} sub="টিকেটটা কি কেটে দিতে পারতেন?" />
      <Art src="a02-worried" {...stage} z0={1.12} z1={1.0} oy={30} len={len} />
      {[0, 1, 2, 3].map((i) => {
        const k = useIn(6 + i * 5, 8);
        return <div key={i} style={{ position: "absolute", left: stage.x + stage.w * [0.1, 0.78, 0.86, 0.04][i], top: stage.y + stage.h * [0.12, 0.08, 0.38, 0.45][i] + Math.sin((f + i * 20) / 8) * 12,
          fontFamily: LAT, fontWeight: 900, fontSize: pick(m, 120, 90, 110), color: i % 2 ? GOLD : "#fff", transform: `scale(${k}) rotate(${(i % 2 ? 1 : -1) * 14}deg)`, textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>?</div>;
      })}
    </AbsoluteFill>
  );
};

const Icon: React.FC<{ k: "agency" | "airline" | "ota"; s: number }> = ({ k, s }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    {k === "agency" ? <><path d="M6 20h36v20H6z" /><path d="M4 20l20-12 20 12" /><path d="M20 40V30h8v10" /></> : null}
    {k === "airline" ? <path d="M6 28l14-4 8-16 4 2-4 13 12 1 4-4 3 1-3 8 3 8-3 1-4-4-12 1 4 13-4 2-8-16-14-4z" /> : null}
    {k === "ota" ? <><rect x="6" y="8" width="36" height="26" rx="3" /><path d="M16 42h16M24 34v8" /><path d="M14 22l6-6 6 4 8-8" /></> : null}
  </svg>
);

const Gds: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const { stage, m } = useLay();
  const g = useIn(4, 10);
  const arc = lerp(f, 10, 60);
  const fs = pick(m, 40, 32, 36);
  return (
    <AbsoluteFill>
      <Backdrop hue="#0E7490" />
      <Head text="প্রতিটা টিকেটের পেছনে GDS" hot={["GDS"]} />
      <Art src="a13-plane" {...stage} z0={1.0} z1={1.12} ox={60} len={len} dim={0.35} />
      <svg style={{ position: "absolute", left: stage.x, top: stage.y, width: stage.w, height: stage.h }} viewBox="0 0 100 100">
        <path d="M18 70 Q 45 20 82 42" fill="none" stroke={GOLD} strokeWidth="0.9" strokeDasharray="3 2" pathLength={100} strokeDashoffset={100 - arc * 100} />
        <circle cx="18" cy="70" r="1.8" fill={MINT} /><circle cx="82" cy="42" r="1.8" fill={GOLD} opacity={arc} />
      </svg>
      <div style={{ position: "absolute", left: stage.x + stage.w * 0.08, top: stage.y + stage.h * 0.72, fontFamily: LAT, fontWeight: 800, fontSize: fs * 0.8, color: MINT }}>DAC</div>
      <div style={{ position: "absolute", left: stage.x + stage.w * 0.76, top: stage.y + stage.h * 0.3, fontFamily: LAT, fontWeight: 800, fontSize: fs * 0.8, color: GOLD, opacity: arc }}>RUH</div>
      <div style={{ position: "absolute", left: stage.x, width: stage.w, top: stage.y + stage.h * 0.06, textAlign: "center", fontFamily: LAT, fontWeight: 900, fontSize: pick(m, 200, 150, 190), lineHeight: 1,
        background: `linear-gradient(180deg, #fff, ${SKY})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", transform: `scale(${0.6 + 0.4 * g})`, opacity: g, filter: `drop-shadow(0 0 40px ${BLUE}AA)` }}>GDS</div>
      <div style={{ position: "absolute", left: stage.x, width: stage.w, top: stage.y + stage.h * 0.3, display: "flex", justifyContent: "center", gap: 14 }}>
        {["Amadeus", "Sabre", "Galileo"].map((t, i) => <Chip key={t} t={t} i={i} fs={fs * 0.85} delay={30} />)}
      </div>
      <div style={{ position: "absolute", left: stage.x + 30, right: m === "h" ? undefined : stage.x + 30, width: m === "h" ? stage.w - 60 : undefined, top: stage.y + stage.h * 0.58, display: "flex", gap: 16 }}>
        {([["agency", "ট্রাভেল এজেন্সি"], ["airline", "এয়ারলাইন অফিস"], ["ota", "অনলাইন ট্রাভেল কোম্পানি"]] as const).map(([k, t], i) => {
          const c = useIn(Math.round(len * 0.45) + i * 14, 12);
          return <div key={k} style={{ flex: 1, padding: fs * 0.5, borderRadius: 26, background: "rgba(15,23,42,0.88)", border: `2px solid ${BLUE2}66`, textAlign: "center", transform: `translateY(${(1 - c) * 60}px)`, opacity: c }}>
            <div style={{ width: fs * 1.8, height: fs * 1.8, margin: "0 auto", borderRadius: 20, background: `linear-gradient(135deg, ${BLUE}, #1E40AF)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon k={k} s={fs * 1.1} /></div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs * 0.72, color: TXT, marginTop: 10, lineHeight: 1.25 }}>{t}</div>
          </div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const PERSONAS: [string, string][] = [["a04-jobseeker", "চাকরি খুঁজছেন"], ["a05-staff", "এজেন্সিতে কাজ করছেন"], ["a06-owner", "নিজের এজেন্সি খুলবেন"], ["a07-returnee", "প্রবাস থেকে ফিরে নতুন শুরু"]];
const Personas: React.FC<{ len: number }> = ({ len }) => {
  const { stage, m } = useLay();
  const gap = 18, w = (stage.w - gap) / 2;
  const fs = pick(m, 36, 28, 32);
  const per = (len - 40) / 4;
  return (
    <AbsoluteFill>
      <Backdrop hue="#1D4ED8" />
      <Head text="এই কোর্স কার জন্য?" hot={["কার"]} />
      {PERSONAS.map(([src, t], i) => {
        const x = stage.x + (i % 2) * (w + gap), y = stage.y + Math.floor(i / 2) * (w + gap);
        const d = Math.round(6 + i * per);
        return (
          <React.Fragment key={src}>
            <Art src={src} x={x} y={y} w={w} h={w} delay={d} z0={1.0} z1={1.1} oy={30} len={len} radius={30} />
            <Tick x={x} y={y + w - fs * 2.2} w={w} fs={fs} text={t} delay={d + 8} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
const Tick: React.FC<{ x: number; y: number; w: number; fs: number; text: string; delay: number }> = ({ x, y, w, fs, text, delay }) => {
  const k = useIn(delay, 12);
  return <div style={{ position: "absolute", left: x + 14, width: w - 28, top: y, padding: `${fs * 0.35}px ${fs * 0.5}px`, borderRadius: 18, background: "rgba(4,11,31,0.85)", border: `2px solid ${MINT}88`,
    fontFamily: BODY, fontWeight: 700, fontSize: fs, color: TXT, display: "flex", alignItems: "center", gap: 10, transform: `translateY(${(1 - k) * 30}px)`, opacity: k }}>
    <span style={{ color: MINT }}>✓</span>{text}</div>;
};

const Problem: React.FC<{ len: number }> = ({ len }) => {
  const { stage, m } = useLay();
  const fs = pick(m, 40, 32, 36);
  const items = ["ক্লাসে যাওয়ার সময় নেই", "বই পড়ে কমান্ড হাতে আসে না"];
  return (
    <AbsoluteFill>
      <Backdrop hue="#7F1D1D" />
      <Head text="কিন্তু শিখবেন কোথায়?" hot={["কোথায়?"]} />
      <Art src="a08-problem" {...stage} z0={1.15} z1={1.02} len={len} />
      {items.map((t, i) => {
        const k = useIn(Math.round(len * (0.25 + i * 0.3)), 9, 0.6);
        return <div key={t} style={{ position: "absolute", left: stage.x + (i ? stage.w * 0.3 : 30), top: stage.y + stage.h * (0.62 + i * 0.16), padding: `${fs * 0.4}px ${fs * 0.7}px`, borderRadius: 18,
          background: "#B91C1C", fontFamily: HEAD, fontWeight: 800, fontSize: fs, color: "#fff", transform: `scale(${2 - k}) rotate(${i ? 3 : -3}deg)`, opacity: k, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>✕ {t}</div>;
      })}
    </AbsoluteFill>
  );
};

const Reveal: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const { stage, m } = useLay();
  const b = useIn(Math.round(len * 0.45), 10);
  return (
    <AbsoluteFill>
      <Backdrop hue={BLUE} />
      <Head text="এখন পুরো কোর্স আপনার ফোনে" hot={["আপনার", "ফোনে"]} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${GOLD}${Math.round(30 + 20 * Math.sin(f / 6)).toString(16)} , transparent 45%)` }} />
      <Art src="a09-reveal" {...stage} z0={1.2} z1={1.0} oy={55} len={len} />
      <div style={{ position: "absolute", left: stage.x, width: stage.w, top: stage.y + stage.h * 0.78, display: "flex", justifyContent: "center", alignItems: "center", gap: 20, transform: `scale(${b})`, opacity: b }}>
        <Img src={S("icon.png")} style={{ width: pick(m, 120, 96, 110), height: pick(m, 120, 96, 110), borderRadius: 28, boxShadow: `0 0 40px ${BLUE}` }} />
        <PlayBadge h={pick(m, 110, 90, 100)} />
      </div>
    </AbsoluteFill>
  );
};

const STEPS = ["কোড ও GDS-এর ভিত", "অ্যাভেইলেবিলিটি ও সিট", "PNR তৈরি", "ভাড়া ও ফেয়ার রুল", "টিকেটিং ও রিফান্ড", "ভিসা ও ডকুমেন্ট", "অনলাইন ট্রাভেল এজেন্সি", "এজেন্সি পরিচালনা ও আইন", "মক টেস্ট ও ক্যারিয়ার", "চূড়ান্ত পরীক্ষা"];
const Roadmap: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const { stage, m } = useLay();
  const fs = pick(m, 34, 26, 30);
  const start = 70, per = (len - start - 30) / STEPS.length;
  const cur = Math.floor((f - start) / per);
  const stat = useIn(4, 12);
  const cols = 2, rows = 5, cw = stage.w / cols, rh = (stage.h - 150) / rows;
  return (
    <AbsoluteFill>
      <Backdrop hue="#0EA5E9" />
      <Head text="১০টি ধাপে পুরো কোর্স" hot={["১০টি", "ধাপে"]} />
      <div style={{ position: "absolute", left: stage.x, width: stage.w, top: stage.y, display: "flex", justifyContent: "center", gap: 14, transform: `scale(${stat})` }}>
        {[["৬১", "বাংলা পাঠ"], ["১০", "ধাপ"], ["১০", "ঘণ্টা"]].map(([n, t]) => (
          <div key={t} style={{ padding: "12px 26px", borderRadius: 22, background: "rgba(15,23,42,0.85)", border: `2px solid ${GOLD}77`, textAlign: "center" }}>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: fs * 1.5, color: GOLD, lineHeight: 1 }}>{n}</div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs * 0.7, color: "#CBD5E1" }}>{t}</div>
          </div>
        ))}
      </div>
      {STEPS.map((t, i) => {
        const col = Math.floor(i / rows), row = i % rows;
        const x = stage.x + col * cw, y = stage.y + 150 + row * rh;
        const on = f >= start + i * per;
        const k = spring({ frame: f - (start + i * per), fps: FPS, config: { damping: 12, mass: 0.6 } });
        return (
          <div key={t} style={{ position: "absolute", left: x + 8, width: cw - 16, top: y + 6, height: rh - 12, display: "flex", alignItems: "center", gap: 14, padding: "0 16px", borderRadius: 22, boxSizing: "border-box",
            background: i === cur ? `linear-gradient(90deg, ${BLUE}, #1E40AF)` : on ? "rgba(30,64,175,0.35)" : "rgba(15,23,42,0.6)", border: `2px solid ${on ? BLUE2 : "#1E293B"}`, transform: `scale(${on ? 0.92 + 0.08 * Math.min(1, k) : 0.92})`, opacity: on ? 1 : 0.45 }}>
            <div style={{ width: fs * 1.6, height: fs * 1.6, flexShrink: 0, borderRadius: 100, background: on ? GOLD : "#334155", color: "#1E1B4B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 800, fontSize: fs * 0.8 }}>
              {"১২৩৪৫৬৭৮৯"[i] ?? "১০"}{i === 9 ? "" : ""}</div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs, color: TXT, lineHeight: 1.2 }}>{t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const LAB_CMDS = [
  ["AN15DECDACRUH", "ফ্লাইট খোঁজা"],
  ["SS1Y1", "সিট বুক"],
  ["NM1KARIM/ABDUL MR", "যাত্রীর নাম"],
  ["ER", "PNR তৈরি ✓"],
];
const Lab: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const { stage, m } = useLay();
  const fs = pick(m, 30, 22, 26);
  const badge = useIn(4, 9, 0.6);
  const per = (len - 30) / LAB_CMDS.length;
  const pw = pick(m, 380, 290, 360);
  return (
    <AbsoluteFill>
      <Backdrop hue="#047857" />
      <Head text="আমাদের সবচেয়ে বড় শক্তি: GDS ল্যাব" hot={["GDS", "ল্যাব"]} />
      <div style={{ position: "absolute", left: stage.x + (m === "h" ? 0 : stage.w * 0.02), top: stage.y + 10 }}>
        <Phone w={pw} screens={[{ vid: "gds-pnr.mp4", from: 8, rate: 1.4, zoom: 1.9 }]} len={len} delay={4} />
      </div>
      <div style={{ position: "absolute", left: stage.x + pw + 40, right: m === "h" ? 1920 - stage.x - stage.w : stage.x, top: stage.y + 40, display: "flex", flexDirection: "column", gap: 16 }}>
        {LAB_CMDS.map(([cmd, t], i) => {
          const a = 20 + i * per;
          const k = useIn(a, 12);
          const n = Math.max(0, Math.min(cmd.length, Math.floor((f - a) / 1.6)));
          return <div key={cmd} style={{ padding: fs * 0.6, borderRadius: 20, background: "#020617", border: `2px solid ${i === LAB_CMDS.length - 1 && n === cmd.length ? MINT : "#22C55E55"}`, opacity: k, transform: `translateX(${(1 - k) * 60}px)` }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: fs, color: "#7CFFB2" }}>&gt; {cmd.slice(0, n)}{n < cmd.length && f % 14 < 7 ? "▌" : ""}</div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs * 0.95, color: n === cmd.length ? GOLD : MUTE, marginTop: 4 }}>{t}</div>
          </div>;
        })}
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs * 0.95, color: "#CBD5E1", opacity: lerp(f, len * 0.7, len * 0.8), lineHeight: 1.35 }}>ভুল হলে ল্যাবই দেখিয়ে দেয় কোথায় ভুল</div>
      </div>
      <div style={{ position: "absolute", left: stage.x + 10, top: stage.y - 34, padding: "10px 22px", zIndex: 5, borderRadius: 40, background: `linear-gradient(90deg, ${RED}, ${ORANGE})`, fontFamily: HEAD, fontWeight: 800, fontSize: fs, color: "#fff",
        transform: `scale(${badge}) rotate(-4deg)`, boxShadow: `0 0 30px ${RED}88` }}>হাতে-কলমে প্র্যাকটিস</div>
      <div style={{ position: "absolute", left: stage.x, width: stage.w, top: stage.y + stage.h - 40, textAlign: "center", fontFamily: BODY, fontSize: fs * 0.8, color: MUTE }}>শিক্ষামূলক GDS সিমুলেটর · অ্যাপের আসল রেকর্ডিং</div>
    </AbsoluteFill>
  );
};

const Call: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const { stage, m } = useLay();
  const fs = pick(m, 32, 26, 30);
  const pw = pick(m, 360, 270, 340);
  const steps = ["এআই গ্রাহক কল করে", "আপনি এজেন্টের মতো তথ্য নেন", "শেষে দেখুন কী বাদ পড়ল আর কোন কমান্ড লাগত"];
  return (
    <AbsoluteFill>
      <Backdrop hue="#0E7490" />
      <Head text="সেই গ্রাহকের ফোন, এবার আপনি ধরবেন" hot={["আপনি", "ধরবেন"]} />
      <Art src="a11-confident" x={stage.x} y={stage.y} w={stage.w} h={stage.h * 0.62} z0={1.0} z1={1.1} oy={35} len={len} />
      <div style={{ position: "absolute", left: stage.x + stage.w - pw - 10, top: stage.y + stage.h * 0.28 }}>
        <Phone w={pw} screens={[{ img: "61-gds-call" }, { img: "62-gds-call-live" }, { img: "63-gds-review" }]} len={len} delay={10} tilt={-8} />
      </div>
      <div style={{ position: "absolute", left: stage.x, width: stage.w - pw - 40, top: stage.y + stage.h * 0.66, display: "flex", flexDirection: "column", gap: 14 }}>
        {steps.map((t, i) => {
          const k = useIn(Math.round(len * (0.12 + i * 0.27)), 12);
          return <div key={t} style={{ display: "flex", gap: 14, alignItems: "center", padding: `${fs * 0.4}px ${fs * 0.6}px`, borderRadius: 20, background: "rgba(15,23,42,0.88)", border: `2px solid ${BLUE2}66`, opacity: k, transform: `translateX(${(1 - k) * -60}px)` }}>
            <span style={{ width: fs * 1.4, height: fs * 1.4, flexShrink: 0, borderRadius: 100, background: GOLD, color: "#1E1B4B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 800, fontSize: fs * 0.8 }}>{"১২৩"[i]}</span>
            <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs, color: TXT, lineHeight: 1.25 }}>{t}</span></div>;
        })}
      </div>
      <div style={{ position: "absolute", left: stage.x + 20, top: stage.y + 20, padding: "8px 18px", borderRadius: 30, background: `${RED}`, fontFamily: HEAD, fontWeight: 800, fontSize: fs * 0.9, color: "#fff", opacity: lerp(f, 6, 16) }}>নতুন</div>
    </AbsoluteFill>
  );
};

// every special feature of the GDS course (all real: GDS dashboard, lab e-ticket PNG/PDF, book "GDS কমান্ড হ্যান্ডবুক", mock tests, QR certificate)
const FEATS: [string, string | null][] = [
  ["এআই শিক্ষক ২৪/৭", "52-teacher"], ["রুট ম্যাপ", "64-route-map"], ["কোড মাস্টার", "66-code-master"], ["প্রতিদিনের চ্যালেঞ্জ + লিডারবোর্ড", "51-gds-dash-data"],
  ["ভুল থেকে শেখা", "50-gds-dash"], ["ই-টিকেট PDF", null], ["GDS কমান্ড হ্যান্ডবুক", "70-books-library"], ["মক টেস্ট", null], ["QR-যাচাইযোগ্য সার্টিফিকেট", "art:a12-cert"],
];
const Extras: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const { stage, m } = useLay();
  const fs = pick(m, 30, 23, 28);
  const start = 14, per = (len - start - 20) / FEATS.length;
  const cur = Math.max(0, Math.min(FEATS.length - 1, Math.floor((f - start) / per)));
  // the phone shows the screen of the current feature (or the last one that has a screen)
  let shot: string | null = null;
  for (let i = cur; i >= 0 && !shot; i--) shot = FEATS[i][1];
  const pw = pick(m, 330, 250, 330);
  const rowH = (stage.h - 20) / FEATS.length;
  return (
    <AbsoluteFill>
      <Backdrop hue="#6D28D9" />
      <Head text="কোর্সের সাথে স্পেশাল ফিচার" hot={["স্পেশাল", "ফিচার"]} />
      <div style={{ position: "absolute", left: stage.x, top: stage.y + 30, width: pw, height: pw * 2.17, borderRadius: pw * 0.12, overflow: "hidden", border: "8px solid #0F172A", boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${BLUE}55`, background: "#fff" }}>
        {shot ? <Img key={shot} src={S(shot.startsWith("art:") ? `art/${shot.slice(4)}.jpg` : `shots/${shot}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: shot.startsWith("art:") ? "50% 40%" : "50% 0%" }} /> : null}
      </div>
      {FEATS.map(([t], i) => {
        const a = start + i * per;
        const k = spring({ frame: f - a, fps: FPS, config: { damping: 13, mass: 0.6 } });
        const on = f >= a;
        return <div key={t} style={{ position: "absolute", left: stage.x + pw + 30, width: stage.w - pw - 30, top: stage.y + i * rowH, height: rowH - 10, display: "flex", alignItems: "center", gap: 14, padding: "0 18px", boxSizing: "border-box", borderRadius: 20,
          background: i === cur ? `linear-gradient(90deg, ${BLUE}, #1E40AF)` : "rgba(15,23,42,0.75)", border: `2px solid ${on ? BLUE2 : "#1E293B"}`, opacity: on ? 1 : 0.3, transform: `translateX(${on ? (1 - Math.min(1, k)) * 80 : 0}px)` }}>
          <span style={{ width: fs * 1.3, height: fs * 1.3, flexShrink: 0, borderRadius: 100, background: on ? MINT : "#334155", color: "#04281C", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: fs * 0.8 }}>✓</span>
          <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs, color: TXT, lineHeight: 1.2 }}>{t}</span></div>;
      })}
    </AbsoluteFill>
  );
};

// real ratings from the site/app (feedback table, air-ticketing, 2026-11-12): 13 ratings, average 4.69; quotes from paying learners, verbatim
const QUOTES = ["খুব ভালো। শিখতে অনেক সহজ।", "সবকিছু সহজ ভাবে বুঝা যাচ্ছে", "অনেক কিছুই শিখতে পারছি"];
const Reviews: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const { stage, m } = useLay();
  const fs = pick(m, 38, 30, 34);
  const fill = lerp(f, 10, 50);
  return (
    <AbsoluteFill>
      <Backdrop hue="#B45309" />
      <Head text="শিক্ষার্থীরা কী বলছেন" hot={["শিক্ষার্থীরা"]} />
      <div style={{ position: "absolute", left: stage.x, width: stage.w, top: stage.y, textAlign: "center" }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: fs * 3.2, color: GOLD, lineHeight: 1 }}>{(4.7 * fill).toFixed(1).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d])}<span style={{ fontSize: fs * 1.3, color: MUTE }}> / ৫</span></div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 6 }}>
          {[0, 1, 2, 3, 4].map((i) => { const p = Math.max(0, Math.min(1, fill * 5 - i)) * (i === 4 ? 0.7 : 1); return (
            <svg key={i} width={fs * 1.4} height={fs * 1.4} viewBox="0 0 24 24"><defs><linearGradient id={`st${i}`}><stop offset={p} stopColor={GOLD} /><stop offset={p} stopColor="#334155" /></linearGradient></defs>
              <path d="M12 2l3 6.5 7 .8-5.2 4.8 1.5 7L12 17.6 5.7 21.1l1.5-7L2 9.3l7-.8z" fill={`url(#st${i})`} /></svg>); })}
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs * 0.62, color: "#CBD5E1", marginTop: 8 }}>এয়ার টিকেটিং কোর্স · শিক্ষার্থীদের দেওয়া ১৩টি রেটিং</div>
      </div>
      {QUOTES.map((q, i) => {
        const k = useIn(40 + i * 40, 12);
        return <div key={q} style={{ position: "absolute", left: stage.x + (i % 2 ? 60 : 0), width: stage.w - 60, top: stage.y + stage.h * (0.36 + i * 0.2), padding: `${fs * 0.6}px ${fs * 0.8}px`, borderRadius: 26, background: "#fff", color: "#0F172A",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)", transform: `translateX(${(1 - k) * (i % 2 ? 300 : -300)}px) rotate(${(i % 2 ? 1 : -1) * 1.5}deg)`, opacity: k }}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: fs, lineHeight: 1.3 }}>“{q}”</div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: fs * 0.55, color: "#64748B", marginTop: 6 }}>★★★★★ · পেইড শিক্ষার্থী, এয়ার টিকেটিং</div>
        </div>;
      })}
    </AbsoluteFill>
  );
};

const COURSES = ["IELTS প্রস্তুতি", "স্পোকেন ইংলিশ", "জাপানি", "কোরিয়ান (EPS)", "গালফের আরবি", "কম্পিউটার শিক্ষা", "ড্রাইভিং", "ভাইব কোডিং", "পারিবারিক স্বাস্থ্য", "মাছের খাদ্য", "সাপ উদ্ধার", "বিজ্ঞানের ভেলকি"];
// owner 2026-11-12: "অ্যাপ লঞ্চিং উপলক্ষে এই কোর্স কিনলে সাথে সব ফ্রি" — true for the Play 3-month membership (all courses), stated with its terms in the next scene
const Subs: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const { stage, m } = useLay();
  const fs = pick(m, 34, 26, 30);
  const main = useIn(4, 10, 0.7);
  const gift = useIn(30, 9, 0.6);
  return (
    <AbsoluteFill>
      <Backdrop hue="#B45309" />
      <Head text="অ্যাপ লঞ্চিং উপলক্ষে" hot={["লঞ্চিং"]} />
      <div style={{ position: "absolute", left: stage.x, width: stage.w, top: stage.y, textAlign: "center", transform: `scale(${main})` }}>
        <div style={{ display: "inline-block", padding: `${fs * 0.6}px ${fs * 1.1}px`, borderRadius: 30, background: `linear-gradient(135deg, ${BLUE}, #1E3A8A)`, border: `3px solid ${BLUE2}`, fontFamily: HEAD, fontWeight: 800, fontSize: fs * 1.25, color: TXT, boxShadow: `0 0 60px ${BLUE}88` }}>✈️ এয়ার টিকেটিং (GDS) কোর্স নিলে</div>
      </div>
      <div style={{ position: "absolute", left: stage.x, width: stage.w, top: stage.y + stage.h * 0.17, textAlign: "center", fontFamily: HEAD, fontWeight: 800, fontSize: pick(m, 96, 74, 86), lineHeight: 1.1,
        background: GOLDG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", transform: `scale(${0.4 + 0.6 * gift}) rotate(${(1 - gift) * -8}deg)`, opacity: gift, filter: `drop-shadow(0 0 30px ${GOLD}77)` }}>সাথে সব কোর্স ফ্রি!</div>
      <div style={{ position: "absolute", left: stage.x, width: stage.w, top: stage.y + stage.h * 0.4, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
        {COURSES.map((c, i) => {
          const k = spring({ frame: f - 50 - i * 4, fps: FPS, config: { damping: 13, mass: 0.6 } });
          return <div key={c} style={{ padding: `${fs * 0.36}px ${fs * 0.65}px`, borderRadius: 18, background: "rgba(30,41,59,0.92)", border: `2px solid ${MINT}77`, fontFamily: BODY, fontWeight: 700, fontSize: fs, color: TXT,
            transform: `translateY(${(1 - k) * -300}px) rotate(${(1 - k) * (i % 2 ? 20 : -20)}deg)`, opacity: Math.min(1, k * 1.5) }}><span style={{ color: MINT }}>+ </span>{c}</div>;
        })}
      </div>
      <div style={{ position: "absolute", left: stage.x, width: stage.w, top: stage.y + stage.h * 0.86, textAlign: "center", fontFamily: BODY, fontWeight: 700, fontSize: fs * 0.85, color: "#FDE68A", opacity: lerp(f, len * 0.6, len * 0.75) }}>৩ মাসের মেম্বারশিপে একসাথে ১৩টি কোর্স</div>
    </AbsoluteFill>
  );
};

const Payoff: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const { stage, m } = useLay();
  const sw = 110;
  const ctaIn = lerp(f, sw, sw + 16);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - ctaIn }}>
        <Backdrop hue={BLUE} />
        <Head text="পরের কলটা আপনি ধরবেন" hot={["আপনি", "ধরবেন"]} />
        <Art src="a14-payoff" {...stage} z0={1.0} z1={1.15} ox={45} len={sw + 20} />
      </AbsoluteFill>
      {f >= sw ? <AbsoluteFill style={{ opacity: ctaIn }}><Sequence from={sw} layout="none"><Cta /></Sequence></AbsoluteFill> : null}
      {m ? null : null}
    </AbsoluteFill>
  );
};

const OfferScene: React.FC<{ len: number }> = ({ len }) => <Offer sc={{ k: "offer" }} len={len} />;

const MAP: Record<Id, React.FC<{ len: number }>> = {
  s01: Ring, s02: Worried, s03: Gds, s04: Personas, s05: Problem, s06: Reveal, s07: Roadmap, s08: Lab, s09: Call, s10: Extras, s11: Reviews, s12: Subs, s13: OfferScene, s14: Payoff,
};
const SFX: Partial<Record<Id, string>> = { s02: "boom", s03: "whoosh", s04: "whoosh", s05: "boom", s06: "shimmer", s07: "whoosh", s08: "whoosh", s09: "whoosh", s10: "whoosh", s11: "shimmer", s12: "whoosh", s13: "boom", s14: "riser" };

const Wrap: React.FC<{ len: number; first: boolean; children: React.ReactNode }> = ({ len, first, children }) => {
  const f = useCurrentFrame();
  const i = first ? 1 : lerp(f, 0, 9), o = lerp(f, len - 7, len);
  return <AbsoluteFill style={{ opacity: Math.min(i, 1 - o), transform: `scale(${1.05 - 0.05 * i + 0.03 * o})`, filter: `blur(${(1 - i) * 10 + o * 12}px)` }}>{children}</AbsoluteFill>;
};

export const Story: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const f = useCurrentFrame();
  const tl = timeline();
  const music = Math.min(lerp(f, 0, 20, 0.0, 0.16), lerp(f, durationInFrames - 50, durationInFrames, 0.16, 0));
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Sequence from={tl[1].from - 10}><Audio src={S("music.mp3")} volume={() => music} /></Sequence>
      {tl.map(({ id, from, len, lead }, i) => {
        const Sc = MAP[id];
        return (
          <Sequence key={id} from={from} durationInFrames={len}>
            <Wrap len={len} first={i === 0}><Sc len={len} /></Wrap>
            {useMode() === "h" && (id === "s13" || id === "s14") ? null : <Caption id={id} lead={lead} />}
            <Sequence from={lead}><Audio src={S(`vo/story-${id}.mp3`)} volume={1} /></Sequence>
            {id === "s01" ? <Audio src={S("sfx/ring.mp3")} volume={0.35} endAt={40} /> : null}
            {id === "s14" ? <Sequence from={20} durationInFrames={50}><Audio src={S("sfx/ring.mp3")} volume={0.25} /></Sequence> : null}
            {SFX[id] ? <Audio src={S(`sfx/${SFX[id]}.mp3`)} volume={0.2} /> : null}
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4))" }} />
    </AbsoluteFill>
  );
};
export type { Mode };
