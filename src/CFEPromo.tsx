// "কম্পিউটার শিক্ষা — সবার জন্য" course promo (AI University of Bangladesh). Same clean brand system as AIUPromo2.
// VO public/cfevo (OpenRouter → ElevenLabs Tanvir v4) · music/SFX public/aiu2 · course art public/cfe (EDUCATOR figures + cover).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import {
  GraduationCap, Cpu, Keyboard, MonitorCog, FolderOpen, Cable, Globe, ShieldCheck, Hourglass, Check, Award, CircleQuestionMark, Sparkles, Smartphone, Languages, BookOpen, Presentation, MousePointer2,
} from "lucide-react";

const C = { ink: "#060913", ink2: "#0C1222", line: "rgba(255,255,255,.09)", card: "rgba(255,255,255,.04)", text: "#F2F4FA", mute: "#8D95B5", dim: "#5A6285", a1: "#7C83FF", a2: "#38D3F5", gold: "#E7B95A", green: "#3DDC97", amber: "#F59E0B" };
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
const ent = (f: number, fps: number, d: number, dur = 26) => spring({ frame: f - d, fps, config: { damping: 200 }, durationInFrames: dur });
const pop = (f: number, fps: number, d: number) => spring({ frame: f - d, fps, config: { damping: 13, mass: 0.6 } });
const gtext = (g = GRAD): React.CSSProperties => ({ background: g, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" });

const PARAS = [
  "কম্পিউটার দেখলে ভয় লাগে? কোন বাটনে চাপ দিলে কী হবে — বুঝতে পারেন না?",
  "ভয় নেই। এআই ইউনিভার্সিটি অব বাংলাদেশ নিয়ে এসেছে — কম্পিউটার শিক্ষা, সবার জন্য উন্মুক্ত। সম্পূর্ণ ফ্রি।",
  "কম্পিউটার কী, কীভাবে এলো, ভেতরে কী কী অংশ আছে — কিবোর্ড, মাউস, উইন্ডোজ, ফাইল গোছানো, সফটওয়্যার ইনস্টল, কেবল সংযোগ, ইন্টারনেট, ইমেইল আর অনলাইনে নিরাপদ থাকা — একদম শুরু থেকে।",
  "ক্লাসরুমের মতো ধাপে ধাপে শিখুন। প্রতিটি ছবিতে নম্বর দিয়ে চিনিয়ে দেওয়া হয় — কোনটা কী, কী কাজ করে।",
  "প্রতিটি মডিউলের শেষে কুইজ, হাতে-কলমে অনুশীলন — আর নিজের অগ্রগতি দেখুন প্রতিদিন।",
  "চূড়ান্ত পরীক্ষায় পাস করলেই পাবেন যাচাইযোগ্য সার্টিফিকেট।",
  "বাংলায়, মোবাইলেও, নিজের গতিতে। আজই ফ্রি অ্যাকাউন্ট খুলে শুরু করুন — কম্পিউটার শিক্ষা, সবার জন্য।",
];
const VO = [149, 233, 432, 214, 182, 113, 211];
const LEAD = VO.map((_, i) => (i === 0 ? 30 : 14));
const TAIL = VO.map((_, i) => (i === VO.length - 1 ? 120 : 16));
const LENS = VO.map((v, i) => LEAD[i] + v + TAIL[i]);
const STARTS = LENS.reduce<number[]>((a, _, i) => [...a, i ? a[i - 1] + LENS[i - 1] : 0], []);
export const CFE_TOTAL = STARTS[STARTS.length - 1] + LENS[LENS.length - 1];
type SP = { lead: number; vo: number; len: number };
const at = (p: SP, x: number) => p.lead + p.vo * x;

/* ---------- primitives ---------- */
const Line: React.FC<{ d: number; size: number; children: React.ReactNode; color?: string; weight?: number; g?: string; style?: React.CSSProperties }> = ({ d, size, children, color = C.text, weight = 700, g, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = ent(f, fps, d, 30);
  return (
    <div style={{ overflow: "hidden", paddingTop: size * 0.18, paddingBottom: size * 0.22, marginTop: -size * 0.18, marginBottom: -size * 0.22, ...style }}>
      <div style={{ fontFamily: BN, fontSize: size, fontWeight: weight, color, lineHeight: 1.25, transform: `translateY(${(1 - s) * 115}%)`, opacity: interpolate(s, [0, 0.3], [0, 1], clamp), ...(g ? gtext(g) : {}) }}>{children}</div>
    </div>
  );
};
const Label: React.FC<{ d: number; text: string }> = ({ d, text }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = ent(f, fps, d);
  return <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: s }}><div style={{ width: 56 * s, height: 2, background: C.a2 }} /><span style={{ fontFamily: EN, fontSize: 22, fontWeight: 700, letterSpacing: "0.32em", color: C.a2 }}>{text}</span></div>;
};
const Mark: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.26, background: `linear-gradient(140deg, ${C.a1}, ${C.a2})`, display: "grid", placeItems: "center", boxShadow: `0 ${size * 0.12}px ${size * 0.4}px ${C.a1}55` }}><GraduationCap size={size * 0.56} color="#fff" strokeWidth={1.7} /></div>
);
const Brand: React.FC<{ size?: number }> = ({ size = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 * size }}><Mark size={46 * size} /><div style={{ fontFamily: EN, color: C.text, lineHeight: 1.1 }}><div style={{ fontSize: 20 * size, fontWeight: 800, letterSpacing: "0.12em" }}>AI UNIVERSITY</div><div style={{ fontSize: 11 * size, fontWeight: 600, letterSpacing: "0.42em", color: C.mute }}>OF BANGLADESH</div></div></div>
);

const DUST = Array.from({ length: 34 }, (_, i) => ({ x: random("x" + i) * 1920, y: random("y" + i) * 1080, s: random("s" + i) * 2 + 0.8, v: random("v" + i) * 0.35 + 0.1, o: random("o" + i) * 0.3 + 0.1 }));
const Stage: React.FC = () => {
  const f = useCurrentFrame(); const a = f / 140;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill style={{ background: `radial-gradient(1100px 760px at ${30 + Math.sin(a) * 12}% ${28 + Math.cos(a) * 10}%, ${C.a1}26, transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(900px 700px at ${78 + Math.cos(a * 0.8) * 10}% ${80 + Math.sin(a * 0.7) * 8}%, ${C.a2}1c, transparent 70%)` }} />
      <AbsoluteFill style={{ opacity: 0.5, backgroundImage: "radial-gradient(rgba(255,255,255,.16) 1px, transparent 1.2px)", backgroundSize: "36px 36px", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 85%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>{DUST.map((d, i) => <circle key={i} cx={d.x + Math.sin((f + i * 40) / 90) * 20} cy={((d.y - f * d.v) % 1080 + 1080) % 1080} r={d.s} fill="#C9D2FF" opacity={d.o} />)}</svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
const Wrap: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const i = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: ease });
  const o = interpolate(f, [len - 12, len], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  return <AbsoluteFill style={{ opacity: Math.min(i, o), transform: `scale(${interpolate(f, [0, len], [1, 1.035]) * (1.04 - 0.04 * i)})`, filter: `blur(${(1 - Math.min(i, o)) * 8}px)` }}>{children}</AbsoluteFill>;
};

/* ---------- scenes ---------- */
const S1: React.FC<SP> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const qs = [[300, 260, 0], [1560, 220, 12], [420, 760, 24], [1480, 720, 36], [960, 180, 48]];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {qs.map(([x, y, d], k) => { const s = pop(f, fps, d); return <div key={k} style={{ position: "absolute", left: x, top: y + Math.sin((f + k * 20) / 20) * 14, opacity: s * 0.6, transform: `scale(${s}) rotate(${(k % 2 ? 1 : -1) * 12}deg)` }}><CircleQuestionMark size={90} color={k % 2 ? C.a2 : C.a1} strokeWidth={1.4} /></div>; })}
      <div style={{ textAlign: "center" }}>
        <Line d={at(p, 0)} size={120} weight={800}>কম্পিউটার দেখলে <span style={{ color: C.gold }}>ভয়</span> লাগে?</Line>
        <div style={{ marginTop: 36 }}><Line d={at(p, 0.45)} size={58} weight={500} color={C.mute}>কোন বাটনে চাপ দিলে কী হবে — বুঝতে পারেন না?</Line></div>
      </div>
      <div style={{ position: "absolute", left: 960 + Math.sin(f / 9) * 180, top: 820 + Math.cos(f / 13) * 40, opacity: ent(f, fps, 20) }}><MousePointer2 size={56} color="#fff" fill="#fff" /></div>
    </AbsoluteFill>
  );
};

const S2: React.FC<SP> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const img = ent(f, fps, 0, 50);
  const badge = pop(f, fps, at(p, 0.78));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: img }}>
        <Img src={staticFile("cfe/cover.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [0, p.len], [1.12, 1.02])})` }} />
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(6,9,19,.96) 0%, rgba(6,9,19,.82) 42%, rgba(6,9,19,.2) 75%, rgba(6,9,19,.1))" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 140, top: 150, width: 900 }}>
        <div style={{ opacity: ent(f, fps, at(p, 0.05)) }}><Brand size={1.2} /></div>
        <div style={{ marginTop: 70 }}><Label d={at(p, 0.3)} text="FREE COURSE" /></div>
        <div style={{ marginTop: 26 }}>
          <Line d={at(p, 0.35)} size={104} weight={800}>কম্পিউটার শিক্ষা</Line>
          <Line d={at(p, 0.45)} size={78} weight={700} g={GRAD}>সবার জন্য উন্মুক্ত</Line>
        </div>
        <div style={{ marginTop: 50, display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 34px", borderRadius: 60, background: C.green, color: "#05261A", fontFamily: BN, fontSize: 44, fontWeight: 800, transform: `scale(${badge})`, opacity: badge, boxShadow: `0 20px 60px ${C.green}55` }}><Sparkles size={40} /> সম্পূর্ণ ফ্রি</div>
      </div>
    </AbsoluteFill>
  );
};

const MODS = [[Hourglass, "কম্পিউটারের পরিচয় ও ইতিহাস"], [Cpu, "হার্ডওয়্যার: ভেতরের অংশ"], [Keyboard, "কিবোর্ড ও মাউস"], [MonitorCog, "সফটওয়্যার ও উইন্ডোজ"], [Cable, "কেবল ও সংযোগ"], [Globe, "ইন্টারনেট, ব্রাউজার ও ইমেইল"], [ShieldCheck, "নিরাপদ কম্পিউটিং"]] as const;
const ACC = ["#7C83FF", "#38D3F5", "#3DDC97", "#E7B95A", "#F178B6", "#FF9F5A", "#7C83FF"];
const S3: React.FC<SP> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const marks = [0.02, 0.1, 0.22, 0.38, 0.6, 0.72, 0.86];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 110 }}>
        <Label d={4} text="WHAT YOU WILL LEARN" />
        <div style={{ marginTop: 24 }}><Line d={8} size={78} weight={800}>৭টি মডিউল — <span style={{ color: C.a2 }}>একদম শুরু থেকে</span></Line></div>
      </div>
      <div style={{ position: "absolute", left: 150, right: 150, top: 330, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 26 }}>
        {MODS.map(([I, t], i) => {
          const d = at(p, marks[i]); const s = ent(f, fps, d, 30);
          const lit = interpolate(f, [d, d + 8, d + 70, d + 100], [0, 1, 1, 0.3], clamp);
          return (
            <div key={i} style={{ height: 230, borderRadius: 26, padding: "30px 28px", background: `linear-gradient(160deg, ${ACC[i]}${Math.round((0.08 + lit * 0.14) * 255).toString(16).padStart(2, "0")}, ${C.card})`, border: `1px solid ${ACC[i]}${Math.round((0.2 + lit * 0.5) * 255).toString(16).padStart(2, "0")}`, opacity: s, transform: `translateY(${(1 - s) * 70}px)`, display: "flex", flexDirection: "column", justifyContent: "space-between", gridColumn: i === 4 ? "1 / span 1" : undefined }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: 76, height: 76, borderRadius: 22, display: "grid", placeItems: "center", background: `${ACC[i]}22` }}><I size={40} color={ACC[i]} strokeWidth={1.7} /></div>
                <span style={{ fontFamily: EN, fontSize: 22, fontWeight: 800, color: C.dim }}>0{i + 1}</span>
              </div>
              <div style={{ fontFamily: BN, fontSize: 36, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{t}</div>
            </div>
          );
        })}
        <div style={{ height: 230, borderRadius: 26, display: "grid", placeItems: "center", textAlign: "center", border: `1px dashed ${C.line}`, opacity: ent(f, fps, at(p, 0.94)) }}>
          <div><div style={{ fontFamily: BN, fontSize: 64, fontWeight: 800, ...gtext() }}>{bn(37)}</div><div style={{ fontFamily: BN, fontSize: 30, color: C.mute }}>পাঠ, কুইজ ও অনুশীলন</div></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

type Fig = { src: string; caption: string; points: { n: number; label: string; desc: string; x: number; y: number }[] };
const S4: React.FC<SP & { fig: Fig | null }> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const fig = p.fig; if (!fig) return null;
  const N = fig.points.length;
  const W = 1060, H = Math.round((W * 768) / 1344);
  const t0 = at(p, 0.25), per = (p.vo * 0.72) / N;
  const curN = Math.min(N, Math.floor((f - t0) / per) + 1);
  const box = ent(f, fps, 6, 36);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 110 }}>
        <Label d={4} text="CLASSROOM STYLE" />
        <div style={{ marginTop: 22 }}><Line d={8} size={66} weight={800}>ধাপে ধাপে — <span style={{ color: C.amber }}>নম্বর দিয়ে চিনিয়ে</span></Line></div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 290, width: W, height: H, borderRadius: 24, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)", border: `1px solid ${C.line}`, opacity: box, transform: `translateY(${(1 - box) * 60}px)` }}>
        <Img src={staticFile(fig.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {fig.points.map((pt) => {
          const s = pop(f, fps, t0 + (pt.n - 1) * per);
          const on = pt.n === curN && f >= t0;
          return (
            <div key={pt.n} style={{ position: "absolute", left: pt.x * W, top: pt.y * H, transform: `translate(-50%,-50%) scale(${s * (on ? 1.25 : 1)})`, width: 54, height: 54, borderRadius: 27, background: on ? C.amber : "#5B63F5", border: "4px solid #fff", display: "grid", placeItems: "center", fontFamily: BN, fontSize: 26, fontWeight: 800, color: "#fff", boxShadow: on ? `0 0 0 ${8 + Math.sin(f / 4) * 6}px ${C.amber}55` : "0 6px 18px rgba(0,0,0,.4)", opacity: f >= t0 && pt.n > curN ? 0 : 1 }}>{bn(pt.n)}</div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 1220, right: 100, top: 290, display: "flex", flexDirection: "column", gap: 14 }}>
        {fig.points.map((pt) => {
          const s = ent(f, fps, t0 + (pt.n - 1) * per, 20); const on = pt.n === curN && f >= t0;
          return (
            <div key={pt.n} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "14px 18px", borderRadius: 18, background: on ? `${C.amber}1f` : C.card, border: `1px solid ${on ? C.amber + "88" : C.line}`, opacity: s * (on ? 1 : 0.6), transform: `translateX(${(1 - s) * 40}px)` }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, flex: "none", display: "grid", placeItems: "center", background: on ? C.amber : "#5B63F5", fontFamily: BN, fontSize: 22, fontWeight: 800, color: "#fff" }}>{bn(pt.n)}</div>
              <div><div style={{ fontFamily: BN, fontSize: 30, fontWeight: 700, color: C.text, lineHeight: 1.25 }}>{pt.label}</div>{on && <div style={{ fontFamily: BN, fontSize: 21, color: C.mute, marginTop: 4, lineHeight: 1.4 }}>{pt.desc}</div>}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const S5: React.FC<SP> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pick = f >= at(p, 0.3); const reveal = f >= at(p, 0.42);
  const prog = interpolate(f, [at(p, 0.6), at(p, 0.95)], [0.22, 0.74], { ...clamp, easing: ease });
  const opts = ["ইনপুট → প্রসেসিং → আউটপুট", "আউটপুট → ইনপুট → প্রসেসিং", "শুধু স্টোরেজ", "প্রসেসিং → আউটপুট"];
  const card = ent(f, fps, 4, 30);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 110 }}>
        <Label d={4} text="QUIZ · PRACTICE · PROGRESS" />
        <div style={{ marginTop: 22 }}><Line d={8} size={70} weight={800}>শিখুন, যাচাই করুন, <span style={{ color: C.green }}>এগিয়ে যান</span></Line></div>
      </div>
      <div style={{ position: "absolute", left: 150, top: 300, width: 900, padding: 36, borderRadius: 28, background: "#0E1428", border: `1px solid ${C.line}`, opacity: card, transform: `translateY(${(1 - card) * 60}px)` }}>
        <div style={{ fontFamily: EN, fontSize: 18, fontWeight: 700, letterSpacing: "0.2em", color: C.a2 }}>MODULE 1 QUIZ · ১/৫</div>
        <div style={{ fontFamily: BN, fontSize: 38, fontWeight: 700, color: C.text, margin: "14px 0 22px" }}>কম্পিউটারের কাজের সঠিক ধারা কোনটি?</div>
        {opts.map((o, k) => {
          const right = k === 0; const sel = pick && right;
          return <div key={k} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 16, marginTop: 12, border: `2px solid ${reveal && right ? C.green : sel ? C.a1 : C.line}`, background: reveal && right ? `${C.green}1c` : "transparent", fontFamily: BN, fontSize: 30, color: C.text }}>
            <div style={{ width: 30, height: 30, borderRadius: 15, border: `3px solid ${reveal && right ? C.green : C.dim}`, display: "grid", placeItems: "center", background: sel ? (reveal ? C.green : C.a1) : "transparent" }}>{reveal && right && <Check size={18} color={C.ink} strokeWidth={4} />}</div>{o}</div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 1110, right: 150, top: 300, display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ padding: 30, borderRadius: 26, background: C.card, border: `1px solid ${C.line}`, opacity: ent(f, fps, at(p, 0.55)) }}>
          <div style={{ fontFamily: BN, fontSize: 28, color: C.mute }}>কোর্সের অগ্রগতি</div>
          <div style={{ fontFamily: BN, fontSize: 72, fontWeight: 800, color: C.text }}>{bn(Math.round(prog * 100))}%</div>
          <div style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,.08)", marginTop: 8 }}><div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 7, background: GRAD }} /></div>
        </div>
        <div style={{ padding: 30, borderRadius: 26, background: `${C.gold}14`, border: `1px solid ${C.gold}55`, opacity: ent(f, fps, at(p, 0.4)), display: "flex", alignItems: "center", gap: 20 }}>
          <Keyboard size={56} color={C.gold} strokeWidth={1.6} />
          <div><div style={{ fontFamily: BN, fontSize: 32, fontWeight: 700, color: C.text }}>টাইপিং অনুশীলন</div><div style={{ fontFamily: BN, fontSize: 24, color: C.mute }}>গতি ২৮ WPM · নির্ভুলতা ৯৬%</div></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const QR = Array.from({ length: 17 * 17 }, (_, i) => random("q" + i) > 0.5);
const S6: React.FC<SP> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const c = ent(f, fps, 4, 40); const ok = pop(f, fps, at(p, 0.6));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1100, transform: `perspective(2200px) rotateX(${(1 - c) * 25 + 4}deg) translateY(${(1 - c) * 80}px)`, opacity: c, background: "#FBF8F1", borderRadius: 14, padding: 20, boxShadow: "0 60px 140px rgba(0,0,0,.6)" }}>
        <div style={{ border: "2px solid #C9A24F", outline: "1px solid #C9A24F88", outlineOffset: -10, borderRadius: 6, padding: "44px 56px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}><Mark size={66} /><div><div style={{ fontFamily: EN, fontSize: 24, fontWeight: 800, letterSpacing: "0.14em", color: "#0B1020" }}>AI UNIVERSITY OF BANGLADESH</div><div style={{ fontFamily: EN, fontSize: 15, fontWeight: 600, letterSpacing: "0.32em", color: "#8A7440" }}>CERTIFICATE OF COMPLETION</div></div></div>
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <div style={{ fontFamily: EN, fontSize: 16, letterSpacing: "0.34em", color: "#6B7090" }}>THIS IS TO CERTIFY THAT</div>
            <div style={{ fontFamily: BN, fontSize: 70, fontWeight: 700, color: "#0B1020" }}>আপনার নাম</div>
            <div style={{ width: 460, height: 1.5, background: "#C9A24F", margin: "2px auto 14px" }} />
            <div style={{ fontFamily: BN, fontSize: 40, fontWeight: 700, color: "#0B1020" }}>কম্পিউটার শিক্ষা — সবার জন্য উন্মুক্ত</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 30, fontFamily: EN, fontSize: 18, color: "#6B7090" }}>
            <span>Certificate ID<br /><b style={{ color: "#0B1020", fontSize: 22 }}>AUB-CFE-2026-0001</b></span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(17, 6px)", padding: 6, background: "#fff", border: "1px solid #e5e0d0" }}>{QR.map((b, i) => <div key={i} style={{ width: 6, height: 6, background: b ? "#0B1020" : "#fff" }} />)}</div>
            <span style={{ textAlign: "right" }}>Level<br /><b style={{ color: "#0B1020", fontSize: 22 }}>Course Completion</b></span>
          </div>
          <div style={{ position: "absolute", right: -34, top: -34, transform: `scale(${ok}) rotate(-8deg)`, opacity: ok, display: "flex", alignItems: "center", gap: 10, padding: "16px 28px", borderRadius: 40, background: C.green, color: "#05261A", fontFamily: EN, fontSize: 26, fontWeight: 800, boxShadow: `0 16px 40px ${C.green}66` }}><ShieldCheck size={30} strokeWidth={2.4} /> VERIFIED</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const S7: React.FC<SP> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const chips = [[Languages, "বাংলায়"], [Smartphone, "মোবাইলেও"], [Presentation, "নিজের গতিতে"], [Award, "সার্টিফিকেট"]] as const;
  const btn = pop(f, fps, at(p, 0.5));
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 120, opacity: ent(f, fps, 4), transform: `scale(${0.9 + ent(f, fps, 4) * 0.1})` }}><Brand size={1.5} /></div>
      <div style={{ position: "absolute", top: 290, display: "flex", gap: 22 }}>
        {chips.map(([I, t], k) => { const s = ent(f, fps, at(p, k * 0.08)); return <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 26px", borderRadius: 40, background: C.card, border: `1px solid ${C.line}`, opacity: s, transform: `translateY(${(1 - s) * 30}px)`, fontFamily: BN, fontSize: 34, color: C.text }}><I size={32} color={C.a2} />{t}</div>; })}
      </div>
      <div style={{ position: "absolute", top: 450, textAlign: "center" }}>
        <Line d={at(p, 0.3)} size={92} weight={800}>কম্পিউটার শিক্ষা</Line>
        <Line d={at(p, 0.38)} size={70} weight={700} g={GRAD}>সবার জন্য — সম্পূর্ণ ফ্রি</Line>
      </div>
      <div style={{ position: "absolute", top: 735, transform: `scale(${btn * (1 + Math.sin(f / 7) * 0.025)})`, opacity: btn, display: "flex", alignItems: "center", gap: 16, padding: "28px 60px", borderRadius: 26, background: GRAD, fontFamily: BN, fontSize: 52, fontWeight: 800, color: "#fff", boxShadow: `0 20px 80px ${C.a1}aa` }}><BookOpen size={48} /> আজই ফ্রি শুরু করুন</div>
    </AbsoluteFill>
  );
};

/* ---------- subtitles + audio ---------- */
const CHUNKS = PARAS.flatMap((t, i) => {
  const parts = t.split(/(?<=[।?,—])\s+/).reduce<string[]>((a, s) => { if (a.length && (a[a.length - 1].length < 22 || s.length < 10)) a[a.length - 1] += " " + s; else a.push(s); return a; }, []);
  const total = parts.reduce((n, s) => n + s.length, 0); let acc = 0;
  return parts.map((s) => { const from = STARTS[i] + LEAD[i] + (VO[i] * acc) / total; acc += s.length; return { s, from, to: STARTS[i] + LEAD[i] + (VO[i] * acc) / total }; });
});
const Subs: React.FC = () => {
  const f = useCurrentFrame(); const c = CHUNKS.find((x) => f >= x.from && f < x.to + 4);
  if (!c) return null;
  const o = interpolate(f, [c.from, c.from + 5, c.to, c.to + 4], [0, 1, 1, 0], clamp);
  return <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, display: "flex", justifyContent: "center", opacity: o }}><div style={{ maxWidth: 1500, padding: "10px 28px 14px", borderRadius: 14, background: "rgba(6,9,19,.66)", fontFamily: BN, fontSize: 38, fontWeight: 500, color: "#fff", textAlign: "center", lineHeight: 1.35 }}>{c.s.replace(/[।,]$/, "")}</div></div>;
};
const Bug: React.FC = () => { const f = useCurrentFrame(); const o = interpolate(f, [STARTS[2], STARTS[2] + 20, STARTS[6] - 10, STARTS[6]], [0, 1, 1, 0], clamp); return <div style={{ position: "absolute", right: 70, top: 50, opacity: o * 0.85 }}><Brand size={0.8} /></div>; };

const SFX: [string, number, number][][] = [[["swell", 0, 0.5]], [["hit", 0, 0.7], ["chime", -0.78, 0.4]], [["whoosh", 0, 0.45]], [["whoosh", 0, 0.45]], [["whoosh", 0, 0.45], ["pop", -0.42, 0.5]], [["whoosh", 0, 0.45], ["chime", -0.6, 0.5]], [["hit", 0, 0.6], ["pop", -0.5, 0.5]]];

export const CFEPromo: React.FC = () => {
  const [fig, setFig] = useState<Fig | null>(null);
  const [h] = useState(() => delayRender("figure data"));
  useEffect(() => { fetch(staticFile("cfe/fig.json")).then((r) => r.json()).then((d) => { setFig(d); continueRender(h); }).catch(() => continueRender(h)); }, [h]);
  const SC = [S1, S2, S3, S4, S5, S6, S7] as React.FC<any>[];
  const musicVol = (fr: number) => {
    let speaking = false;
    for (let i = 0; i < VO.length; i++) { const s = STARTS[i] + LEAD[i]; if (fr >= s - 8 && fr <= s + VO[i] + 4) speaking = true; }
    return (speaking ? 0.16 : 0.42) * interpolate(fr, [0, 30], [0, 1], clamp) * interpolate(fr, [CFE_TOTAL - 80, CFE_TOTAL], [1, 0], clamp);
  };
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Stage />
      {SC.map((S, i) => {
        const p: SP = { lead: LEAD[i], vo: VO[i], len: LENS[i] };
        return (
          <Sequence key={i} from={STARTS[i]} durationInFrames={LENS[i]}>
            <Wrap len={LENS[i]}><S {...p} fig={fig} /></Wrap>
            <Sequence from={LEAD[i]}><Audio src={staticFile(`cfevo/0${i + 1}.mp3`)} /></Sequence>
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
