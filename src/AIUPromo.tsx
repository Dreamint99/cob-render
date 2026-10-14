// AI University of Bangladesh — launch promo. Site concept: M:\Code\ai-university. VO public/aiuvo (OpenRouter → ElevenLabs), music/SFX public/aiu.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";

const C = { bg: "#04050d", cyan: "#22d3ee", violet: "#8b5cf6", pink: "#f472b6", gold: "#fbbf24", green: "#34d399", orange: "#fb923c", red: "#f87171", text: "#eef1ff", mute: "#9aa3c7" };
const BN = "Anek", EN = "Montserrat";
if (typeof document !== "undefined") {
  for (const [n, u] of [["Anek", "fonts/AnekBangla.ttf"], ["Montserrat", "fonts/Montserrat.ttf"]]) {
    const f = new FontFace(n, `url(${staticFile(u)})`, { weight: "100 900" });
    f.load().then(() => document.fonts.add(f)).catch(() => {});
  }
}
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const GRAD = `linear-gradient(92deg, ${C.cyan}, ${C.violet})`;
const GRAD2 = `linear-gradient(92deg, ${C.pink}, ${C.gold})`;
const gtext = (g: string): React.CSSProperties => ({ background: g, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" });

// ---------- timeline (30 fps): each scene = lead + VO + tail ----------
const VO_LEN = [168, 228, 247, 307, 262, 180, 187, 221];
const LEAD = [40, 12, 10, 10, 10, 10, 10, 12];
const TAIL = [22, 20, 20, 20, 20, 20, 20, 120];
const LENS = VO_LEN.map((v, i) => LEAD[i] + v + TAIL[i]);
const STARTS = LENS.reduce<number[]>((a, l, i) => [...a, i ? a[i - 1] + LENS[i - 1] : 0], []);
export const AIU_TOTAL = STARTS[7] + LENS[7];

const sp = (f: number, fps: number, d = 0, damping = 15, mass = 0.8) => spring({ frame: f - d, fps, config: { damping, mass } });

// ---------- background: drifting aurora + particle network ----------
const PTS = Array.from({ length: 70 }, (_, i) => ({ x: random("x" + i) * 1920, y: random("y" + i) * 1080, vx: (random("vx" + i) - 0.5) * 1.1, vy: (random("vy" + i) - 0.5) * 1.1, r: random("r" + i) * 2 + 0.8 }));
const Cosmos: React.FC<{ hue?: string; hue2?: string }> = ({ hue = C.violet, hue2 = C.cyan }) => {
  const f = useCurrentFrame();
  const a = f / 80;
  const wrap = (v: number, m: number) => ((v % m) + m) % m;
  const p = PTS.map((q) => ({ x: wrap(q.x + q.vx * f, 1920), y: wrap(q.y + q.vy * f, 1080), r: q.r }));
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < p.length; i++)
    for (let j = i + 1; j < p.length; j++) {
      const d = Math.hypot(p[i].x - p[j].x, p[i].y - p[j].y);
      if (d < 170) lines.push(<line key={i + "-" + j} x1={p[i].x} y1={p[i].y} x2={p[j].x} y2={p[j].y} stroke={`rgba(150,130,255,${0.22 * (1 - d / 170)})`} strokeWidth={1} />);
    }
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 700px at ${25 + Math.sin(a) * 10}% ${30 + Math.cos(a) * 10}%, ${hue}55, transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(800px 650px at ${80 + Math.cos(a * 0.7) * 8}% ${75 + Math.sin(a * 0.8) * 8}%, ${hue2}44, transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(600px 500px at ${55 + Math.sin(a * 1.3) * 12}% 105%, ${C.pink}33, transparent 70%)` }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {lines}
        {p.map((q, i) => <circle key={i} cx={q.x} cy={q.y} r={q.r} fill="rgba(190,200,255,.7)" />)}
      </svg>
      <AbsoluteFill style={{ opacity: 0.07, backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)", backgroundSize: "80px 80px", transform: `perspective(900px) rotateX(62deg) translateY(${380 + (f * 2) % 80}px) scale(2.2)`, transformOrigin: "50% 100%" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.75) 100%)" }} />
    </AbsoluteFill>
  );
};

// Scene wrapper: zoom-blur in, push out
const Scene: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 14], [0, 1], { ...clamp, easing: ease });
  const out = interpolate(f, [len - 10, len], [1, 0], clamp);
  const o = Math.min(inn, out);
  const s = interpolate(inn, [0, 1], [1.12, 1]) * interpolate(out, [0, 1], [1.15, 1]) * interpolate(f, [0, len], [1, 1.04]);
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${s})`, filter: `blur(${(1 - o) * 18}px)` }}>{children}</AbsoluteFill>;
};

// Word-by-word kinetic text (word-spacing only; letter-spacing breaks Bangla conjuncts)
const Words: React.FC<{ text: string; d?: number; size?: number; color?: string; weight?: number; stagger?: number; font?: string; style?: React.CSSProperties; grad?: string }> = ({ text, d = 0, size = 80, color = C.text, weight = 700, stagger = 4, font = BN, style, grad }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: font, fontSize: size, fontWeight: weight, color, lineHeight: 1.25, display: "flex", flexWrap: "wrap", justifyContent: "center", ...style }}>
      {text.split(" ").map((w, i) => {
        const s = sp(f, fps, d + i * stagger, 14, 0.7);
        return <span key={i} style={{ display: "inline-block", marginRight: size * 0.25, opacity: s, transform: `translateY(${(1 - s) * size * 0.8}px) scale(${0.85 + s * 0.15})`, filter: `blur(${(1 - s) * 10}px)`, paddingBottom: size * 0.08, ...(grad ? gtext(grad) : {}) }}>{w}</span>;
      })}
    </div>
  );
};

const Cap: React.FC<{ size: number; glow?: number }> = ({ size, glow = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 ${24 * glow}px ${C.cyan}aa)` }}>
    <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.violet} /></linearGradient></defs>
    <polygon points="50,18 96,38 50,58 4,38" fill="url(#cg)" />
    <path d="M24 47 v18 c0 8 52 8 52 0 v-18 l-26 11z" fill="url(#cg)" opacity={0.85} />
    <line x1="88" y1="41" x2="88" y2="66" stroke={C.gold} strokeWidth="3" /><circle cx="88" cy="69" r="4" fill={C.gold} />
  </svg>
);

const Glass: React.FC<{ style?: React.CSSProperties; children: React.ReactNode; accent?: string }> = ({ style, children, accent = C.violet }) => (
  <div style={{ background: "rgba(255,255,255,.06)", border: `1.5px solid ${accent}55`, borderRadius: 28, boxShadow: `0 30px 80px rgba(0,0,0,.45), 0 0 50px ${accent}22`, backdropFilter: "blur(14px)", ...style }}>{children}</div>
);

// ---------- 0. hook ----------
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ring = interpolate(f, [0, 60], [0, 1], { ...clamp, easing: ease });
  const big = sp(f, fps, 120, 12, 1);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", border: `2px solid ${C.cyan}44`, transform: `scale(${ring}) rotate(${f}deg)`, boxShadow: `0 0 120px ${C.violet}33 inset` }} />
      <div style={{ position: "absolute", width: 640, height: 640, borderRadius: "50%", border: `2px dashed ${C.violet}66`, transform: `scale(${ring}) rotate(${-f * 1.4}deg)` }} />
      <Words text="কল্পনা করুন…" d={30} size={70} color={C.mute} weight={500} style={{ position: "absolute", top: 300 }} />
      <Words text="এমন একটি বিশ্ববিদ্যালয়" d={60} size={96} weight={700} style={{ position: "absolute", top: 400 }} />
      <div style={{ position: "absolute", top: 560, fontFamily: BN, fontSize: 150, fontWeight: 800, opacity: big, transform: `scale(${0.6 + big * 0.4})`, filter: `blur(${(1 - big) * 16}px)`, ...gtext(GRAD2), paddingBottom: 20 }}>যেখানে শিখবেন — সবকিছু</div>
    </AbsoluteFill>
  );
};

// ---------- 1. brand reveal ----------
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flash = interpolate(f, [0, 3, 18], [0, 1, 0], clamp);
  const logo = sp(f, fps, 4, 10, 1.1);
  const t1 = sp(f, fps, 30, 14);
  const badge = sp(f, fps, 14, 12);
  const sweep = interpolate(f, [40, 90], [-30, 130], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {Array.from({ length: 18 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 960, top: 520, width: 1400, height: 4, transformOrigin: "0 50%", transform: `rotate(${i * 20 + f * 0.4}deg) scaleX(${logo})`, background: `linear-gradient(90deg, ${i % 2 ? C.cyan : C.violet}55, transparent 70%)` }} />
      ))}
      <div style={{ position: "absolute", top: 120, opacity: badge, transform: `translateY(${(1 - badge) * -40}px)`, padding: "14px 34px", borderRadius: 999, background: "rgba(251,191,36,.12)", border: `2px solid ${C.gold}88`, fontFamily: BN, fontSize: 42, fontWeight: 700, color: C.gold }}>★ বাংলাদেশে প্রথমবার</div>
      <div style={{ transform: `scale(${logo}) rotate(${(1 - logo) * -25}deg)`, marginTop: -150 }}><Cap size={260} glow={1.4} /></div>
      <div style={{ position: "absolute", top: 560, textAlign: "center", opacity: t1, transform: `translateY(${(1 - t1) * 60}px)` }}>
        <div style={{ fontFamily: EN, fontSize: 150, fontWeight: 900, lineHeight: 1, letterSpacing: "0.04em", position: "relative", ...gtext(`linear-gradient(100deg, ${C.cyan} ${sweep - 30}%, #fff ${sweep}%, ${C.violet} ${sweep + 30}%)`) }}>AI UNIVERSITY</div>
        <div style={{ fontFamily: EN, fontSize: 44, fontWeight: 600, letterSpacing: "0.5em", color: C.mute, marginTop: 14 }}>OF BANGLADESH</div>
      </div>
      <div style={{ position: "absolute", top: 860, display: "flex", gap: 28, fontFamily: EN, fontSize: 58, fontWeight: 800 }}>
        <span style={{ opacity: sp(f, fps, 120), ...gtext(GRAD) }}>Learn Anything.</span>
        <span style={{ opacity: sp(f, fps, 160), ...gtext(GRAD2) }}>Build Every Skill.</span>
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

// ---------- 2. twelve faculties ----------
const FAC = [["🤖", "এআই ও প্রযুক্তি", C.cyan], ["🍳", "রন্ধনশিল্প", C.violet], ["🐍", "বন্যপ্রাণী ও পরিবেশ", C.green], ["💼", "ব্যবসা ও উদ্যোক্তা", C.orange], ["⚡", "কারিগরি দক্ষতা", C.cyan], ["🌾", "কৃষি ও পশুপালন", C.green], ["🩺", "স্বাস্থ্য ও ফার্স্ট এইড", C.red], ["🎬", "সৃজনশীল মিডিয়া", C.pink], ["🗣️", "ভাষা ও ক্যারিয়ার", C.violet], ["🏠", "গৃহ ও দৈনন্দিন জীবন", C.gold], ["✈️", "পর্যটন ও আতিথেয়তা", C.orange], ["🔭", "বিজ্ঞান ও অদ্ভুত দক্ষতা", C.cyan]] as const;
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n12 = Math.round(interpolate(f, [8, 50], [0, 12], { ...clamp, easing: ease }));
  const n100 = Math.round(interpolate(f, [150, 200], [0, 100], { ...clamp, easing: ease }));
  const bn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
  const tilt = interpolate(f, [0, 270], [10, -6]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 90, fontFamily: BN, fontWeight: 800, fontSize: 120, lineHeight: 1, ...gtext(GRAD) }}>{bn(n12)}<span style={{ fontSize: 64, marginLeft: 22 }}>টি ফ্যাকাল্টি</span></div>
      <div style={{ position: "absolute", right: 110, top: 100, fontFamily: BN, fontWeight: 800, fontSize: 100, lineHeight: 1, opacity: sp(f, fps, 145), ...gtext(GRAD2) }}>{bn(n100)}+<span style={{ fontSize: 56, marginLeft: 18 }}>কোর্স</span></div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 290, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 34, perspective: 1400 }}>
        {FAC.map(([ic, t, a], i) => {
          const s = sp(f, fps, 14 + i * 9, 13, 0.8);
          const lit = interpolate(f, [60 + i * 12, 70 + i * 12, 100 + i * 12], [0, 1, 0.25], clamp);
          return (
            <div key={i} style={{ opacity: s, transform: `rotateX(${tilt}deg) translateY(${(1 - s) * 120}px) rotateY(${(1 - s) * 50}deg) scale(${0.7 + s * 0.3})`, display: "flex", alignItems: "center", gap: 20, padding: "44px 30px", borderRadius: 26, background: `linear-gradient(140deg, ${a}${lit > 0.5 ? "33" : "18"}, rgba(255,255,255,.04))`, border: `2px solid ${a}${Math.round(60 + lit * 150).toString(16).padStart(2, "0")}`, boxShadow: `0 0 ${20 + lit * 50}px ${a}${Math.round(lit * 90).toString(16).padStart(2, "0")}` }}>
              <span style={{ fontSize: 64, width: 96, height: 96, display: "grid", placeItems: "center", borderRadius: 20, background: `${a}22` }}>{ic}</span>
              <span style={{ fontFamily: BN, fontSize: 38, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{t}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3. curiosity courses ----------
const CUR = [["🐍", "সাপ চেনা ও উদ্ধার", "Snake Rescue: Zero to Awareness", C.green], ["🎬", "শুধু এআই দিয়ে সিনেমা", "Make a Movie Using Only AI", C.pink], ["🌪️", "প্রথম ৭২ ঘণ্টায় বেঁচে থাকা", "Disaster Survival", C.orange]] as const;
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = [10, 70, 135];
  const stamp = sp(f, fps, 225, 9, 1);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 70, fontFamily: EN, fontSize: 40, fontWeight: 800, letterSpacing: "0.3em", color: C.pink }}>CURIOSITY COURSES</div>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 46, perspective: 1600 }}>
        {CUR.map(([ic, t, e, a], i) => {
          const s = sp(f, fps, at[i], 12, 0.9);
          const float = Math.sin((f + i * 30) / 18) * 10;
          return (
            <Glass key={i} accent={a} style={{ width: 520, height: 600, padding: 44, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: s, transform: `translateX(${(1 - s) * 900}px) rotateY(${(1 - s) * -70}deg) translateY(${float}px)` }}>
              <div style={{ fontSize: 170, filter: `drop-shadow(0 0 40px ${a})`, transform: `scale(${0.6 + s * 0.4})` }}>{ic}</div>
              <div style={{ fontFamily: BN, fontSize: 54, fontWeight: 800, color: C.text, marginTop: 30, lineHeight: 1.2 }}>{t}</div>
              <div style={{ fontFamily: EN, fontSize: 24, fontWeight: 600, color: a, marginTop: 18 }}>{e}</div>
            </Glass>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 90, opacity: stamp, transform: `scale(${2.2 - stamp * 1.2}) rotate(-3deg)`, padding: "16px 50px", borderRadius: 20, border: `4px solid ${C.gold}`, background: "rgba(4,5,13,.85)", fontFamily: BN, fontSize: 64, fontWeight: 800, color: C.gold, boxShadow: `0 0 60px ${C.gold}55` }}>অদ্ভুত… কিন্তু দারুণ কাজের!</div>
    </AbsoluteFill>
  );
};

// ---------- 4. AI course engine ----------
const STEPS = [["💡", "Course Idea"], ["🧩", "Curriculum"], ["🎙️", "Video + Voice"], ["✅", "Expert Review"], ["🎓", "Publish"]] as const;
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = "AI Video Production";
  const typed = q.slice(0, Math.floor(interpolate(f, [12, 60], [0, q.length], clamp)));
  const press = interpolate(f, [66, 70, 76], [1, 0.92, 1], clamp);
  const prog = interpolate(f, [80, 240], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const box = sp(f, fps, 0, 14);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Words text="একটি নাম লিখুন — বাকিটা এআই বানাবে" d={4} size={66} weight={800} style={{ position: "absolute", top: 90 }} />
      <Glass style={{ position: "absolute", top: 250, width: 1200, height: 130, display: "flex", alignItems: "center", padding: "0 18px 0 44px", opacity: box, transform: `translateY(${(1 - box) * 60}px)` }} accent={C.cyan}>
        <span style={{ fontSize: 48, marginRight: 22 }}>🔍</span>
        <span style={{ fontFamily: EN, fontSize: 52, fontWeight: 600, color: C.text, flex: 1 }}>{typed}<span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: C.cyan }}>|</span></span>
        <span style={{ transform: `scale(${press})`, padding: "24px 40px", borderRadius: 18, background: GRAD, fontFamily: BN, fontSize: 40, fontWeight: 800, color: "#fff", boxShadow: `0 10px 40px ${C.violet}88` }}>তৈরি করো ✨</span>
      </Glass>
      <div style={{ position: "absolute", top: 560, left: 200, right: 200, height: 8, borderRadius: 9, background: "rgba(255,255,255,.1)" }}>
        <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 9, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.pink})`, boxShadow: `0 0 30px ${C.violet}` }} />
      </div>
      <div style={{ position: "absolute", top: 470, left: 140, right: 140, display: "flex", justifyContent: "space-between" }}>
        {STEPS.map(([ic, t], i) => {
          const on = prog >= i / 4 - 0.001;
          const pop = sp(f, fps, 80 + i * 40, 10, 0.8);
          return (
            <div key={i} style={{ width: 280, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 180, height: 180, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 84, background: on ? GRAD : "rgba(255,255,255,.07)", border: `3px solid ${on ? "transparent" : "rgba(255,255,255,.15)"}`, transform: `scale(${on ? 0.9 + pop * 0.15 : 0.9})`, boxShadow: on ? `0 0 70px ${C.violet}aa` : "none" }}>{ic}</div>
              <div style={{ fontFamily: EN, fontSize: 34, fontWeight: 700, color: on ? C.text : C.mute, marginTop: 24 }}>{t}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 120, opacity: sp(f, fps, 200), fontFamily: BN, fontSize: 50, fontWeight: 700, color: C.green }}>✔ প্রতিটি লেসন বিশেষজ্ঞ দিয়ে যাচাইকৃত</div>
    </AbsoluteFill>
  );
};

// ---------- 5. bilingual + text mode ----------
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flip = interpolate(f, [30, 40, 70, 80, 110, 120], [0, 1, 1, 0, 0, 1], clamp);
  const l = sp(f, fps, 0, 14), r = sp(f, fps, 10, 14);
  const tm = sp(f, fps, 105, 12);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 140, display: "flex", gap: 60, alignItems: "center" }}>
        <div style={{ fontFamily: BN, fontSize: 140, fontWeight: 800, opacity: l, transform: `translateX(${(1 - l) * -300}px)`, ...gtext(GRAD), paddingBottom: 16, filter: `brightness(${1.3 - flip * 0.5})` }}>বাংলা</div>
        <div style={{ width: 200, height: 100, borderRadius: 60, background: "rgba(255,255,255,.1)", border: "3px solid rgba(255,255,255,.2)", position: "relative" }}>
          <div style={{ position: "absolute", top: 8, left: 8 + flip * 100, width: 80, height: 80, borderRadius: "50%", background: flip > 0.5 ? GRAD2 : GRAD, boxShadow: `0 0 30px ${C.violet}` }} />
        </div>
        <div style={{ fontFamily: EN, fontSize: 130, fontWeight: 900, opacity: r, transform: `translateX(${(1 - r) * 300}px)`, ...gtext(GRAD2), filter: `brightness(${0.8 + flip * 0.5})` }}>English</div>
      </div>
      <Glass accent={C.gold} style={{ position: "absolute", top: 480, width: 1100, padding: "44px 56px", display: "flex", gap: 44, alignItems: "center", opacity: tm, transform: `translateY(${(1 - tm) * 120}px)` }}>
        <svg width={170} height={140} viewBox="0 0 100 80">
          {[0, 1, 2].map((k) => <path key={k} d={`M${50 - 14 - k * 14} ${62 - 10 - k * 12} Q50 ${30 - k * 14} ${50 + 14 + k * 14} ${62 - 10 - k * 12}`} fill="none" strokeWidth="7" strokeLinecap="round" stroke={k === 0 || Math.floor(f / 10) % 3 >= k ? C.gold : "rgba(255,255,255,.18)"} />)}
          <circle cx="50" cy="66" r="6" fill={C.gold} />
        </svg>
        <div>
          <div style={{ fontFamily: BN, fontSize: 64, fontWeight: 800, color: C.text }}>ইন্টারনেট ধীর?</div>
          <div style={{ fontFamily: BN, fontSize: 46, fontWeight: 600, color: C.gold, marginTop: 6 }}>📄 Text Mode-এ পড়ুন পুরো লেসন</div>
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

// ---------- 6. certificate ----------
const QR = Array.from({ length: 121 }, (_, i) => random("qr" + i) > 0.5);
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = sp(f, fps, 6, 13, 1.1);
  const shine = interpolate(f % 90, [0, 50], [-40, 140], clamp);
  const rot = interpolate(c, [0, 1], [70, 0]) + Math.sin(f / 30) * 4;
  const lv = ["📜 Course Completion", "🥈 Professional Skills", "🥇 Advanced Professional"];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 200, width: 640 }}>
        <Words text="৩ স্তরের সার্টিফিকেট" d={10} size={74} weight={800} grad={GRAD2} style={{ justifyContent: "flex-start" }} />
        {lv.map((t, i) => {
          const s = sp(f, fps, 40 + i * 22, 13);
          return <div key={i} style={{ marginTop: 30, padding: "24px 32px", borderRadius: 22, background: "rgba(251,191,36,.08)", border: `2px solid ${C.gold}66`, fontFamily: EN, fontSize: 38, fontWeight: 700, color: C.text, opacity: s, transform: `translateX(${(1 - s) * -200}px)` }}>{t}</div>;
        })}
      </div>
      <div style={{ position: "absolute", right: 110, top: 150, width: 960, perspective: 1800 }}>
        <div style={{ transform: `rotateY(${rot}deg) rotateX(${Math.cos(f / 40) * 3}deg) scale(${0.8 + c * 0.2})`, opacity: c, borderRadius: 30, padding: 4, background: "linear-gradient(135deg,#fde68a,#fbbf24,#b45309)", boxShadow: `0 40px 120px ${C.gold}44`, position: "relative", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(160deg,#0d1126,#0a0d1e)", borderRadius: 27, padding: "44px 54px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, paddingBottom: 26, borderBottom: "1px solid rgba(255,255,255,.12)" }}>
              <Cap size={80} glow={0.4} />
              <div><div style={{ fontFamily: EN, fontSize: 26, fontWeight: 800, letterSpacing: "0.15em", color: C.text }}>AI UNIVERSITY OF BANGLADESH</div><div style={{ fontFamily: EN, fontSize: 18, letterSpacing: "0.3em", color: C.mute }}>PROFESSIONAL SKILLS CERTIFICATE</div></div>
              <div style={{ marginLeft: "auto", padding: "8px 20px", borderRadius: 99, background: C.gold, fontFamily: EN, fontWeight: 800, fontSize: 20, color: "#0d1126" }}>LEVEL 2</div>
            </div>
            <div style={{ textAlign: "center", padding: "40px 0 16px" }}>
              <div style={{ fontFamily: EN, fontSize: 20, letterSpacing: "0.3em", color: C.mute }}>THIS IS TO CERTIFY THAT</div>
              <div style={{ fontFamily: BN, fontSize: 74, fontWeight: 800, margin: "12px 0", ...gtext("linear-gradient(92deg,#fde68a,#fbbf24)") }}>আপনার নাম</div>
              <div style={{ fontFamily: EN, fontSize: 28, color: "#c6cbe8" }}>AI Video Production — Beginner to Professional</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 24, borderTop: "1px dashed rgba(255,255,255,.18)", fontFamily: EN, fontSize: 22, color: C.mute }}>
              <span>ID: AUB-AIV-2026-0847</span>
              <div style={{ background: "#fff", padding: 8, borderRadius: 10, display: "grid", gridTemplateColumns: "repeat(11, 9px)", gap: 0 }}>
                {QR.map((b, i) => { const x = i % 11, y = Math.floor(i / 11); const fin = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7); return <div key={i} style={{ width: 9, height: 9, background: fin || b ? "#0d1126" : "#fff" }} />; })}
              </div>
              <span style={{ color: C.gold, fontWeight: 700 }}>✔ Scan to verify</span>
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${shine - 10}%, rgba(255,255,255,.22) ${shine}%, transparent ${shine + 10}%)` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7. CTA / end card ----------
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = sp(f, fps, 4, 11, 1);
  const btn = sp(f, fps, 150, 10);
  const pulse = 1 + Math.sin(f / 7) * 0.03 * btn;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Words text="আপনার শেখা শুরু হোক আজই" d={6} size={84} weight={800} style={{ position: "absolute", top: 110 }} />
      <div style={{ position: "absolute", top: 270, display: "flex", alignItems: "center", gap: 40, opacity: logo, transform: `scale(${0.7 + logo * 0.3})` }}>
        <Cap size={200} glow={1.3} />
        <div>
          <div style={{ fontFamily: EN, fontSize: 120, fontWeight: 900, lineHeight: 1, ...gtext(GRAD) }}>AI UNIVERSITY</div>
          <div style={{ fontFamily: EN, fontSize: 40, fontWeight: 600, letterSpacing: "0.5em", color: C.mute, marginTop: 10 }}>OF BANGLADESH</div>
        </div>
      </div>
      <Words text="শিখুন যা খুশি, গড়ুন প্রতিটি দক্ষতা" d={95} size={70} weight={700} grad={GRAD2} style={{ position: "absolute", top: 560 }} />
      <div style={{ position: "absolute", top: 720, opacity: btn, transform: `scale(${(0.6 + btn * 0.4) * pulse})`, padding: "30px 70px", borderRadius: 26, background: GRAD, fontFamily: BN, fontSize: 56, fontWeight: 800, color: "#fff", boxShadow: `0 20px 80px ${C.violet}aa` }}>🎓 ফ্রি এনরোল শুরু করুন</div>
      <div style={{ position: "absolute", bottom: 60, opacity: sp(f, fps, 190), fontFamily: BN, fontSize: 34, color: C.mute }}>১২ ফ্যাকাল্টি · ১০০+ কোর্স · বাংলা ও English · যাচাইযোগ্য সার্টিফিকেট</div>
    </AbsoluteFill>
  );
};

const SCENES = [S0, S1, S2, S3, S4, S5, S6, S7];
const HUES: [string, string][] = [[C.violet, C.cyan], [C.cyan, C.violet], [C.violet, C.pink], [C.green, C.pink], [C.cyan, C.violet], [C.violet, C.gold], [C.gold, C.violet], [C.violet, C.cyan]];
// SFX per scene: [file, offset-in-scene, volume]
const SFX: [string, number, number][][] = [
  [["riser", 0, 0.5], ["impact", 120, 0.7]],
  [["impact", 0, 0.9], ["shimmer", 30, 0.5]],
  [["swoosh", 0, 0.6], ["shimmer", 150, 0.4]],
  [["swoosh", 10, 0.6], ["swoosh", 70, 0.6], ["swoosh", 135, 0.6], ["impact", 225, 0.7]],
  [["swoosh", 0, 0.5], ["type", 12, 0.5], ["shimmer", 240, 0.4]],
  [["swoosh", 0, 0.5]],
  [["shimmer", 6, 0.6]],
  [["impact", 0, 0.8], ["shimmer", 150, 0.5]],
];

const BgSwitch: React.FC = () => {
  const f = useCurrentFrame();
  let k = 0;
  for (let i = 0; i < STARTS.length; i++) if (f >= STARTS[i]) k = i;
  return <Cosmos hue={HUES[k][0]} hue2={HUES[k][1]} />;
};

export const AIUPromo: React.FC = () => {
  const f = useCurrentFrame();
  const musicVol = (fr: number) => {
    const fadeIn = interpolate(fr, [0, 30], [0, 1], clamp);
    const fadeOut = interpolate(fr, [AIU_TOTAL - 60, AIU_TOTAL], [1, 0], clamp);
    let duck = 0.55;
    for (let i = 0; i < 8; i++) { const s = STARTS[i] + LEAD[i]; if (fr >= s - 6 && fr <= s + VO_LEN[i] + 6) duck = 0.2; }
    return 0.55 * fadeIn * fadeOut * (duck / 0.55);
  };
  void f;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <BgSwitch />
      {SCENES.map((S, i) => (
        <Sequence key={i} from={STARTS[i]} durationInFrames={LENS[i]}>
          <Scene len={LENS[i]}><S /></Scene>
          <Sequence from={LEAD[i]}><Audio src={staticFile(`aiuvo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
          {SFX[i].map(([n, o, v], k) => <Sequence key={k} from={o}><Audio src={staticFile(`aiu/${n}.mp3`)} volume={v} /></Sequence>)}
        </Sequence>
      ))}
      <Audio src={staticFile("aiu/music.mp3")} volume={musicVol} />
      <AbsoluteFill style={{ pointerEvents: "none", boxShadow: "inset 0 0 200px rgba(0,0,0,.6)" }} />
    </AbsoluteFill>
  );
};
