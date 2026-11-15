// Qount — turf SALES film v2 (2026-11-15): TurfSales + automatic online payment. Comps QTS2-H (19 lines) and QTS2-V (reel).
// Built from TurfSales.tsx + work/qount/ts2/scenes.tsx (new scenes 8-10); public dir work/qroot/ts2 (= ts + new VO + eps.webp).
// VO: Tanvir eleven_v4 via OpenRouter, work/qount/turfsales/script.json → <public>/vo/NN.mp3 (public dir work/qroot/ts).
// Screens: real local build (:8790 demo-owner, Greenfield Turf) — mobile 1080x2337 (+ tall full-page), desktop 1920x1200.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { F, sp, Logo, Wordmark } from "../Qd";
import DURS from "./ts2-durs.json";
import SCRIPT from "./ts2-script.json";

const S = (p: string) => staticFile(p);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const INK = "#1F1A12", TUR = "#F2B300", PAPER = "#F8F5EE", GREY = "#665C4C", GREEN = "#15803D";
const useV = () => { const { width, height } = useVideoConfig(); return height > width; };
const LINES: string[] = (SCRIPT as { paras: string[] }).paras;

/* ---------- footage ---------- */
const Clip: React.FC<{ src: string; start?: number; len: number; z0?: number; z1?: number; dim?: number }> = ({ src, start = 0, len, z0 = 1.03, z1 = 1.1, dim = 0.1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={S("clips/" + src)} startFrom={start} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [0, len], [z0, z1], clamp)})` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(0,0,0,${dim}) 40%, rgba(0,0,0,${0.55 + dim}) 100%)` }} />
    </AbsoluteFill>
  );
};

/* big hook words over footage */
const Hook: React.FC<{ text: string; at?: number; hi?: string; y?: number }> = ({ text, at = 4, hi, y }) => {
  const f = useCurrentFrame(); const V = useV(); const s = sp(f, 30, at, 15);
  const parts = hi ? text.split(hi) : [text];
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: y ?? (V ? 420 : 120) }}>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: V ? 84 : 92, lineHeight: 1.25, color: "#fff", textAlign: "center", maxWidth: V ? 940 : 1500, opacity: s, transform: `translateY(${(1 - s) * 40}px)`, textShadow: "0 6px 30px rgba(0,0,0,.6)", wordSpacing: 4 }}>
        {parts.map((p, i) => <React.Fragment key={i}>{p}{i < parts.length - 1 && <span style={{ color: TUR }}>{hi}</span>}</React.Fragment>)}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- light stage ---------- */
const Paper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
    <div style={{ position: "absolute", width: 1400, height: 1400, borderRadius: "50%", right: -460, top: -520, background: "radial-gradient(circle, #F2B30038 0%, #F2B30000 62%)" }} />
    <div style={{ position: "absolute", width: 1000, height: 1000, borderRadius: "50%", left: -420, bottom: -560, background: "radial-gradient(circle, #15803D14 0%, #15803D00 62%)" }} />
    {children}
  </AbsoluteFill>
);

/* ---------- phone (screens 1080 wide; tall shots scroll) ---------- */
type Scr = { src: string; at: number; h?: number; nav?: string; scroll?: [number, number, number, number] }; // scroll = [frameA, frameB, yA, yB] in 1080-space px
type TapT = { x: number; y: number; at: number };
const SH = 2337;
const Phone: React.FC<{ cx: number; cy: number; h: number; screens: Scr[]; taps?: TapT[]; enter?: number; tilt?: number; children?: React.ReactNode }> = ({ cx, cy, h, screens, taps = [], enter = 0, tilt = 0, children }) => {
  const f = useCurrentFrame();
  const bez = Math.round(h * 0.016), sh = h - 2 * bez, sw = Math.round(sh * 1080 / SH), w = sw + 2 * bez, k = sw / 1080;
  const e = sp(f, 30, enter, 16);
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, transform: `translateY(${(1 - e) * 140}px) rotate(${tilt}deg)`, opacity: e }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: h * 0.07, background: INK, boxShadow: "0 50px 100px rgba(31,26,18,.30)" }} />
      <div style={{ position: "absolute", left: bez, top: bez, width: sw, height: sh, borderRadius: h * 0.058, overflow: "hidden", background: "#fff" }}>
        {screens.map((s, i) => {
          const y = s.scroll ? interpolate(f, [s.scroll[0], s.scroll[1]], [s.scroll[2], s.scroll[3]], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 0;
          const op = i === 0 ? 1 : interpolate(f, [s.at, s.at + 7], [0, 1], clamp);
          if (op <= 0) return null;
          return (
            <React.Fragment key={i}>
              <Img src={S("ui/" + s.src)} style={{ position: "absolute", left: 0, top: -y * k, width: sw, height: (s.h ?? SH) * k, opacity: op }} />
              {s.nav && <Img src={S("ui/" + s.nav)} style={{ position: "absolute", left: 0, top: 2140 * k, width: sw, height: 197 * k, opacity: op }} />}
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: SH, transform: `scale(${k})`, transformOrigin: "0 0" }}>
          {taps.map((t, i) => {
            const a = f - t.at; if (a < -12 || a > 30) return null;
            const r = interpolate(a, [0, 18], [40, 170], clamp);
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: t.x - r, top: t.y - r, width: 2 * r, height: 2 * r, borderRadius: 999, background: TUR, opacity: a >= 0 ? interpolate(a, [0, 22], [0.55, 0], clamp) : 0 }} />
                <div style={{ position: "absolute", left: t.x - 48, top: t.y - 48, width: 96, height: 96, borderRadius: 99, border: `8px solid ${TUR}`, background: "rgba(242,179,0,.25)", opacity: interpolate(a, [-12, 0, 20, 30], [0, 1, 1, 0], clamp) }} />
              </React.Fragment>
            );
          })}
          {children}
        </div>
      </div>
    </div>
  );
};

/* push banner inside a phone (1080 space) */
const Push: React.FC<{ at: number; title: string; body: string }> = ({ at, title, body }) => {
  const f = useCurrentFrame(); const s = sp(f, 30, at, 15);
  return (
    <div style={{ position: "absolute", left: 36, top: 40, width: 1008, borderRadius: 56, background: "#fff", border: "3px solid #ECE6D8", boxShadow: "0 24px 60px rgba(0,0,0,.18)", transform: `translateY(${(1 - s) * -360}px)`, display: "flex", alignItems: "center", gap: 30, padding: "34px 40px" }}>
      <Logo size={96} style={{ borderRadius: 26 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 44, color: INK }}>{title}</span>
        <span style={{ fontFamily: F, fontWeight: 500, fontSize: 38, color: GREY }}>{body}</span>
      </div>
    </div>
  );
};

/* ---------- laptop with desktop screenshot (1920x1200) ---------- */
const Laptop: React.FC<{ cx: number; cy: number; w: number; src: string; enter?: number; scroll?: [number, number, number, number] }> = ({ cx, cy, w, src, enter = 0, scroll }) => {
  const f = useCurrentFrame(); const e = sp(f, 30, enter, 16);
  const sw = w * 0.86, sh = sw * 1200 / 1920, bz = w * 0.018;
  const y = scroll ? interpolate(f, [scroll[0], scroll[1]], [scroll[2], scroll[3]], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 0;
  const top = cy - (sh + 2 * bz) / 2;
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top, width: w, opacity: e, transform: `translateY(${(1 - e) * 100}px)` }}>
      <div style={{ margin: "0 auto", width: sw + 2 * bz, height: sh + 2 * bz, background: INK, borderRadius: 26, padding: bz, boxShadow: "0 50px 100px rgba(31,26,18,.28)" }}>
        <div style={{ width: sw, height: sh, borderRadius: 10, overflow: "hidden", position: "relative", background: "#fff" }}>
          <Img src={S("ui/" + src)} style={{ position: "absolute", left: 0, top: -y * sw / 1920, width: sw }} />
        </div>
      </div>
      <div style={{ width: w, height: w * 0.035, background: "linear-gradient(#D9D3C5,#B9B2A3)", borderRadius: "0 0 30px 30px", position: "relative" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, width: w * 0.14, height: w * 0.012, marginLeft: -w * 0.07, background: "#A39C8C", borderRadius: "0 0 12px 12px" }} />
      </div>
    </div>
  );
};

/* ---------- headline block ---------- */
const Head: React.FC<{ k?: string; t: string; sub?: string; chips?: string[]; at?: number; x?: number; y?: number; w?: number; center?: boolean; badge?: string }> = ({ k, t, sub, chips = [], at = 6, x, y, w, center, badge }) => {
  const f = useCurrentFrame(); const V = useV();
  const s = sp(f, 30, at, 15);
  const L = x ?? (V ? 70 : 140), T = y ?? (V ? 150 : 300), W = w ?? (V ? 940 : 760);
  return (
    <div style={{ position: "absolute", left: L, top: T, width: W, fontFamily: F, color: INK, textAlign: center ? "center" : "left", opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
      {badge && <div style={{ display: "inline-block", background: INK, color: TUR, fontWeight: 700, fontSize: V ? 34 : 30, padding: "8px 26px", borderRadius: 99, marginBottom: 18 }}>{badge}</div>}
      {k && <div style={{ fontSize: V ? 34 : 30, fontWeight: 600, color: GREEN, marginBottom: 8 }}>{k}</div>}
      <div style={{ fontSize: V ? 72 : 74, fontWeight: 800, lineHeight: 1.2, wordSpacing: 2 }}>{t}</div>
      {sub && <div style={{ fontSize: V ? 38 : 36, fontWeight: 500, color: GREY, marginTop: 14, lineHeight: 1.35 }}>{sub}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: chips.length ? 30 : 0, justifyContent: center ? "center" : "flex-start" }}>
        {chips.map((c, i) => {
          const cs = sp(f, 30, at + 10 + i * 7, 14);
          return <div key={i} style={{ opacity: cs, transform: `scale(${0.85 + 0.15 * cs})`, background: "#fff", border: "2px solid #ECE6D8", borderRadius: 99, padding: V ? "10px 26px" : "10px 24px", fontSize: V ? 34 : 30, fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 12, height: 12, borderRadius: 99, background: TUR }} />{c}</div>;
        })}
      </div>
    </div>
  );
};

/* subtitle (spoken line) */
const Sub: React.FC<{ text: string; dark?: boolean }> = ({ text, dark }) => {
  const f = useCurrentFrame(); const V = useV(); const o = interpolate(f, [2, 10], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: V ? 120 : 46, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ maxWidth: V ? 960 : 1500, fontFamily: F, fontWeight: 600, fontSize: V ? 38 : 34, lineHeight: 1.35, color: dark ? "#fff" : INK, background: dark ? "rgba(0,0,0,.45)" : "rgba(255,255,255,.85)", border: dark ? "none" : "1.5px solid #ECE6D8", padding: "10px 28px", borderRadius: 22, textAlign: "center" }}>{text}</div>
    </div>
  );
};

/* corner logo on footage */
const Bug: React.FC = () => {
  const V = useV();
  return <div style={{ position: "absolute", right: V ? 50 : 60, top: V ? 70 : 50, display: "flex", alignItems: "center", gap: 12, opacity: 0.95 }}><Logo size={V ? 64 : 56} style={{ borderRadius: 16 }} /><Wordmark h={V ? 46 : 40} color="#fff" /></div>;
};

/* ---------- v2 (2026-11-15): automatic online payment (Qount Pay) ---------- */
const LINE = "#ECE6D8";
const BN = (n: number) => Math.round(n).toLocaleString("en-IN").replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
const Chip: React.FC<{ t: string; c: string; on: boolean; w: number }> = ({ t, c, on, w }) => (
  <div style={{ width: w, height: 150, borderRadius: 36, background: on ? c : "#fff", border: `5px solid ${on ? c : LINE}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: F, fontWeight: 700, fontSize: 56, color: on ? "#fff" : INK }}>
    <span style={{ width: 30, height: 30, borderRadius: 99, background: on ? "#fff" : c }} />{t}
  </div>
);
const Btn: React.FC<{ t: string; y: number; press?: number }> = ({ t, y, press = -99 }) => {
  const f = useCurrentFrame(); const p = interpolate(f - press, [0, 4, 10], [1, 0.94, 1], clamp);
  return <div style={{ position: "absolute", left: 70, right: 70, top: y, height: 170, borderRadius: 999, background: TUR, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 800, fontSize: 64, color: INK, transform: `scale(${p})` }}>{t}</div>;
};
const Check: React.FC<{ s: number; size: number }> = ({ s, size }) => (
  <div style={{ width: size, height: size, borderRadius: 999, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})` }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24"><path d="M4 12.5 L9.5 18 L20 6.5" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" strokeDashoffset={30 * (1 - s)} /></svg>
  </div>
);
const METHODS: [string, string][] = [["বিকাশ", "#E2136E"], ["নগদ", "#EC1C24"], ["রকেট", "#8C3494"], ["কার্ড", INK]];
/* customer's online-payment screen (1080 space), fades in at `at`, success at `done` */
const PayScreen: React.FC<{ at: number; pick: number; press: number; done: number }> = ({ at, pick, press, done }) => {
  const f = useCurrentFrame(); const ok = sp(f, 30, done, 12);
  return (
    <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [at, at + 7], [0, 1], clamp) }}>
      <div style={{ position: "absolute", left: 70, top: 170, fontFamily: F, fontWeight: 600, fontSize: 48, color: GREY }}>অগ্রিম পেমেন্ট</div>
      <div style={{ position: "absolute", left: 70, top: 240, fontFamily: F, fontWeight: 800, fontSize: 190, color: INK }}>৳৪০০</div>
      <div style={{ position: "absolute", left: 70, top: 500, fontFamily: F, fontWeight: 600, fontSize: 44, color: GREY }}>গ্রিনফিল্ড টার্ফ · কোর্ট A · শুক্র রাত ৮:০০</div>
      <div style={{ position: "absolute", left: 70, top: 650, fontFamily: F, fontWeight: 700, fontSize: 50, color: INK }}>কীভাবে পেমেন্ট করবেন?</div>
      <div style={{ position: "absolute", left: 70, top: 760, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        {METHODS.map(([t, c], i) => <Chip key={t} t={t} c={c} on={i === 0 && f >= pick} w={450} />)}
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1200, padding: "40px 46px", borderRadius: 40, background: PAPER, fontFamily: F, fontWeight: 600, fontSize: 42, color: GREY, lineHeight: 1.45 }}>পেমেন্ট হলেই বুকিং কনফার্ম, টিকেট SMS-এ চলে যাবে।</div>
      <Btn t="৳৪০০ পেমেন্ট করুন" y={1900} press={press} />
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [done, done + 6], [0, 1], clamp), alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <Check s={ok} size={300} />
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 92, color: INK }}>পেমেন্ট সফল</div>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 60, color: GREEN, background: "#E7F3EA", borderRadius: 999, padding: "10px 50px 20px" }}>✓ বুকিং কনফার্মড</div>
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: 44, color: GREY }}>টিকেট SMS-এ পাঠানো হয়েছে</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
/* owner's balance screen (1080 space) */
const LEDGER: [string, string, number][] = [["কোর্ট A · তানভীর", "+৳৪০০", 20], ["কোর্ট B · রাকিব", "+৳৬০০", 30], ["কোর্ট A · সাকিব", "+৳৪০০", 40]];
const WalletScreen: React.FC<{ press: number; pick: number }> = ({ press, pick }) => {
  const f = useCurrentFrame();
  const n = interpolate(f, [6, 56], [0, 18600], { ...clamp, easing: ease });
  const sheet = sp(f, 30, press + 8, 15);
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <div style={{ position: "absolute", left: 70, top: 160, fontFamily: F, fontWeight: 700, fontSize: 54, color: INK }}>অনলাইন পেমেন্ট ও ব্যালেন্স</div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 280, height: 400, borderRadius: 50, background: INK, padding: "50px 60px" }}>
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: 46, color: "rgba(255,255,255,.7)" }}>আপনার ব্যালেন্স</div>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 170, color: "#fff", lineHeight: 1.2 }}>৳{BN(n)}</div>
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: 40, color: TUR }}>খেলোয়াড়দের অনলাইন অগ্রিম</div>
      </div>
      {LEDGER.map(([t, a, at], i) => {
        const s = sp(f, 30, at, 14);
        return (
          <div key={t} style={{ position: "absolute", left: 60, right: 60, top: 740 + i * 175, height: 150, borderRadius: 34, border: `3px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px", opacity: s, transform: `translateX(${(1 - s) * 80}px)`, fontFamily: F }}>
            <span style={{ fontWeight: 600, fontSize: 44, color: INK }}>{t}</span><span style={{ fontWeight: 800, fontSize: 50, color: GREEN }}>{a}</span>
          </div>
        );
      })}
      <Btn t="উইথড্র করুন" y={1345} press={press} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 900, borderRadius: "70px 70px 0 0", background: "#fff", boxShadow: "0 -30px 80px rgba(0,0,0,.18)", transform: `translateY(${(1 - sheet) * 950}px)`, padding: "70px 70px" }}>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 58, color: INK, marginBottom: 40 }}>কোথায় নেবেন?</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          {[["বিকাশ", "#E2136E"], ["নগদ", "#EC1C24"], ["ব্যাংক অ্যাকাউন্ট", INK]].map(([t, c], i) => <Chip key={t} t={t} c={c} on={i === 0 && f >= pick} w={940} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
const Toggle: React.FC<{ on: number }> = ({ on }) => (
  <div style={{ width: 132, height: 74, borderRadius: 99, background: on > 0.5 ? GREEN : "#D6CFC0", position: "relative", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 7, left: 7 + on * 58, width: 60, height: 60, borderRadius: 99, background: "#fff", boxShadow: "0 3px 8px rgba(0,0,0,.2)" }} />
  </div>
);
const OptCard: React.FC<{ title: string; body: string; icon: string; on: number; enter: number; w: number }> = ({ title, body, icon, on, enter, w }) => {
  const f = useCurrentFrame(); const s = sp(f, 30, enter, 14);
  return (
    <div style={{ width: w, borderRadius: 40, background: "#fff", border: `4px solid ${on > 0.5 ? TUR : LINE}`, boxShadow: on > 0.5 ? "0 30px 70px rgba(242,179,0,.28)" : "0 16px 40px rgba(31,26,18,.08)", padding: "40px 44px", opacity: s * (0.55 + 0.45 * on), transform: `translateY(${(1 - s) * 60}px) scale(${0.96 + 0.04 * on})`, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <div style={{ width: 96, height: 96, borderRadius: 28, background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>{icon}</div>
        <Toggle on={on} />
      </div>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 52, color: INK }}>{title}</div>
      <div style={{ fontFamily: F, fontWeight: 600, fontSize: 34, color: GREY, lineHeight: 1.4 }}>{body}</div>
    </div>
  );
};
const Choice: React.FC<{ flip: number; end: number; V: boolean }> = ({ flip, end, V }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [flip, flip + 8], [1, 0], clamp);
  const e = sp(f, 30, end, 13); const w = V ? 900 : 640;
  return (
    <Paper>
      <Head k="আপনার পছন্দ" t="অগ্রিম নেবেন কীভাবে?" x={0} y={V ? 150 : 80} w={V ? 1080 : 1920} center at={2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: V ? 520 : 340, display: "flex", flexDirection: V ? "column" : "row", alignItems: "center", justifyContent: "center", gap: V ? 40 : 60 }}>
        <OptCard title="অটো পেমেন্ট" body="বিকাশ · নগদ · কার্ড — পেমেন্ট হলেই বুকিং অটো কনফার্ম" icon="⚡" on={a} enter={6} w={w} />
        <OptCard title="নিজের বিকাশ নাম্বারে" body="আগের মতো নিজের নাম্বারে অগ্রিম নিন, নিজে কনফার্ম করুন" icon="📱" on={1 - a} enter={16} w={w} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: V ? 1330 : 780, display: "flex", justifyContent: "center", opacity: e, transform: `scale(${0.85 + 0.15 * e})` }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: V ? 62 : 56, color: INK, background: TUR, borderRadius: 999, padding: "8px 50px 18px" }}>যেমন আপনি চান</div>
      </div>
    </Paper>
  );
};
const EpsStrip: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 140, top: 720, opacity: sp(f, 30, at, 14) }}>
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 26, color: GREY, marginBottom: 8 }}>🔒 নিরাপদ অনলাইন পেমেন্ট</div>
      <Img src={S("eps.webp")} style={{ width: 760, borderRadius: 12, background: "#fff" }} />
    </div>
  );
};
const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, 8], [0, 1], clamp) }}>{children}</AbsoluteFill>;
};
/* ---------- scenes (one per VO line) ---------- */
type SceneFn = (len: number, V: boolean) => React.ReactNode;
const ph = (V: boolean, side: "r" | "c" = "r") => (V ? { cx: 540, cy: 1150, h: 1240 } : side === "r" ? { cx: 1380, cy: 500, h: 880 } : { cx: 960, cy: 500, h: 880 });

const NEW_SCENES: Record<number, SceneFn> = {
  8: (len, V) => { const st = [0, 0.16, 0.34, 0.54, 0.8].map((x) => Math.round(len * x)); return <Paper>
    <Phone {...ph(V)} screens={[{ src: "c1-slots.png", at: 0 }, { src: "c2-slot-picked.png", at: st[1] }, { src: "c3-info.png", at: st[2] }]} taps={[{ x: 240, y: 1169, at: st[1] - 4 }]} enter={2}>
      <PayScreen at={st[3]} pick={st[3] + 18} press={st[4] - 12} done={st[4]} />
    </Phone>
    <Head k="খেলোয়াড় যেভাবে বুক করে" t="স্লট বাছে, অনলাইনে অগ্রিম দেয়" chips={["নাম ও মোবাইল", "বিকাশ · নগদ · কার্ড", "অনলাইনে অগ্রিম"]} />
  </Paper>; },
  9: (len, V) => { const c = Math.round(len * 0.55); return <Paper>
    <Phone {...ph(V)} screens={[{ src: "o3-confirmed.png", at: 0 }, { src: "c7-ticket.png", at: c }]} enter={2}>
      <Push at={6} title="অগ্রিম ৳৪০০ এসেছে · অনলাইনে" body="তানভীর আহমেদ · বুকিং অটো কনফার্ম" />
    </Phone>
    <Head k="পেমেন্ট হলেই" t="বুকিং অটো কনফার্ম" chips={["আপনার কিছু করতে হবে না", "SMS-এ টিকেট", "ফোনে নোটিফিকেশন"]} />
    {!V && <EpsStrip at={30} />}
  </Paper>; },
  10: (len, V) => { const cut = Math.round(len * 0.47); return <>
    <Paper>
      <Phone {...ph(V)} screens={[]} enter={2}><WalletScreen press={Math.round(len * 0.24)} pick={Math.round(len * 0.33)} /></Phone>
      <Head k="Qount ব্যালেন্স" t="অগ্রিম জমা আপনার ব্যালেন্সে" sub="যখন খুশি উইথড্র দিন" chips={["বিকাশ", "নগদ", "ব্যাংক"]} />
    </Paper>
    <Sequence from={cut}><FadeIn><Choice flip={Math.round(len * 0.2)} end={Math.round(len * 0.4)} V={V} /></FadeIn></Sequence>
  </>; },
};

const SCENES: Record<number, SceneFn> = {
  1: (len) => <><Clip src="turf.mp4" start={112} len={len} /><Hook text="আপনি কি টার্ফ ব্যবসা করেন?" hi="টার্ফ ব্যবসা" /><Bug /></>,
  2: (len) => <><Clip src="k3.mp4" len={len} /><Hook text="একটা মিনিট সময় দিন" hi="একটা মিনিট" /><Bug /></>,
  3: (len) => <>
    <Sequence durationInFrames={Math.round(len / 2)}><Clip src="k1.mp4" len={len} /></Sequence>
    <Sequence from={Math.round(len / 2)}><Clip src="ledger.mp4" start={30} len={len} z0={1.08} z1={1.2} /></Sequence>
    <Hook text="এখনো খাতা-কলমে হিসাব?" hi="খাতা-কলমে" /></>,
  4: (len) => <><Clip src="k2.mp4" len={len} /><Hook text="টেনশন নাই — ব্যবসা অটোমেশন করুন" hi="অটোমেশন" /><Bug /></>,
  5: (len, V) => <Paper>
    <Laptop cx={V ? 540 : 1180} cy={V ? 1040 : 600} w={V ? 1000 : 1040} src="d-home.png" enter={4} />
    <Phone cx={V ? 860 : 1640} cy={V ? 1300 : 660} h={V ? 640 : 660} screens={[{ src: "home.png", at: 0 }]} enter={14} />
    <Head k="কাউন্ট নিয়ে এসেছে" t="টার্ফ ম্যানেজমেন্ট সফটওয়্যার" chips={["ওয়েবসাইট", "অ্যান্ড্রয়েড অ্যাপ"]} x={V ? 70 : 110} y={V ? 150 : 90} w={V ? 940 : 1200} />
  </Paper>,
  6: (len, V) => { const a = Math.round(len * 0.3), b = Math.round(len * 0.58); return <Paper>
    <Phone {...ph(V)} screens={[{ src: "signup.png", at: 0 }, { src: "onboarding.png", at: a }, { src: "site.png", at: b, h: 2338 }]} enter={2} />
    <Head k="শুধু একটা অ্যাকাউন্ট" t="ফ্রি ওয়েবসাইট, আপনার টার্ফের নামে" chips={["অ্যাকাউন্ট খুলুন", "টার্ফের তথ্য দিন", "ওয়েবসাইট রেডি"]} />
  </Paper>; },
  7: (len, V) => { const n = Math.round(len * 0.45); return <Paper>
    <Phone cx={V ? 300 : 1150} cy={V ? 1180 : 540} h={V ? 980 : 900} screens={[{ src: "c1-slots.png", at: 0 }, { src: "c2-slot-picked.png", at: n - 18 }]} taps={[{ x: 240, y: 1169, at: n - 22 }]} enter={0} tilt={-3} />
    <Phone cx={V ? 790 : 1640} cy={V ? 1230 : 560} h={V ? 980 : 900} screens={[{ src: "o0-home.png", at: 0 }]} enter={8} tilt={3}><Push at={n} title="নতুন বুকিং · গ্রিনফিল্ড টার্ফ" body="শুক্র ২০ নভে · রাত ৮:০০ · কোর্ট A" /></Phone>
    <Head k="কাস্টমার আপনার" t="ওয়েবসাইটের বুকিং সরাসরি অ্যাপে" sub="প্রতিটা বুকিং আর স্লট — নিজে থেকেই সিঙ্ক" w={V ? 940 : 700} />
  </Paper>; },
  ...NEW_SCENES,
  11: (len, V) => <Paper>
    <Phone {...ph(V)} screens={[{ src: "newbooking.png", at: 0 }]} enter={2} />
    <Head k="ফোনে বা মাঠে এসে বুকিং" t="নতুন বুকিং — ব্যস" chips={["কোর্ট", "দিন", "সময়"]} />
  </Paper>,
  12: (len, V) => <Paper>
    <Phone {...ph(V)} screens={[{ src: "calendar20-strip.png", at: 0, h: 3924, nav: "nav-calendar.png", scroll: [Math.round(len * 0.2), Math.round(len * 0.75), 0, 1587] }]} enter={2} />
    <Head k="ক্যালেন্ডার" t="কোন সময় খালি, কোন সময় বুকড" sub="একই স্লট দুবার বুক হবেই না" chips={["কোর্ট A", "কোর্ট B"]} />
  </Paper>,
  13: (len, V) => { const a = Math.round(len * 0.42); return <Paper>
    <Phone {...ph(V)} screens={[{ src: "o3-confirmed.png", at: 0 }, { src: "customers-full-strip.png", at: a, h: 7180, nav: "nav-customers.png", scroll: [a + 20, len - 10, 0, 1400] }]} enter={2} />
    <Head k="বাকি আদায় · কাস্টমার" t="সব হিসাব এক জায়গায়" chips={["এক চাপে আদায়", "কে কতবার খেলেছে", "মোবাইল নম্বর"]} />
  </Paper>; },
  14: (len, V) => <Paper>
    <Laptop cx={V ? 540 : 1180} cy={V ? 1000 : 610} w={V ? 1000 : 1040} src="d-reports.png" enter={2} />
    <Phone cx={V ? 860 : 1700} cy={V ? 1330 : 650} h={V ? 660 : 700} screens={[{ src: "reports.png", at: 0 }, { src: "reports2.png", at: Math.round(len * 0.5) }]} enter={12} />
    <Head k="রিপোর্ট" t="দৈনিক আর মাসিক আয়" chips={["কোর্ট অনুযায়ী", "অনলাইন ও ক্যাশ", "PDF / Excel"]} x={V ? 70 : 110} y={V ? 150 : 70} w={V ? 940 : 1300} />
  </Paper>,
  15: (len, V) => <Paper>
    <Phone {...ph(V)} screens={[{ src: "messages-full-strip.png", at: 0, h: 9271, nav: "nav-messages.png", scroll: [Math.round(len * 0.3), len - 8, 0, 1700] }]} enter={2} />
    <Head k="মেসেজ ও SMS" t="সবাইকে একসাথে অফার" sub="যেমন: সকালের স্লটে ২০% ছাড়" />
  </Paper>,
  16: (len, V) => <Paper>
    <Phone {...ph(V)} screens={[{ src: "qr.png", at: 0 }]} enter={2} />
    <Head k="QR পোস্টার" t="মাঠে লাগান — স্ক্যান করলেই বুকিং" />
  </Paper>,
  17: (len, V) => <Paper>
    <Laptop cx={V ? 540 : 1180} cy={V ? 1040 : 610} w={V ? 1000 : 1040} src="d-calendar.png" enter={6} />
    <Phone cx={V ? 860 : 1700} cy={V ? 1320 : 660} h={V ? 640 : 700} screens={[{ src: "app-home.png", at: 0 }]} enter={14} />
    <Head badge="বাংলাদেশে প্রথম" t="অ্যাপ বা ওয়েবসাইট — যেটা সুবিধা" x={V ? 70 : 110} y={V ? 150 : 70} w={V ? 940 : 1400} />
  </Paper>,
  18: (len) => <><Clip src="outside.mp4" len={len} /><Hook text="কনসালটেন্সি সাপোর্টও পাবেন" hi="কনসালটেন্সি সাপোর্ট" /><Bug /></>,
  19: (len, V) => <End len={len} V={V} />,
};

const End: React.FC<{ len: number; V: boolean }> = ({ len, V }) => {
  const f = useCurrentFrame(); const cut = 75;
  const s = sp(f, 30, cut + 4, 14), s2 = sp(f, 30, cut + 16, 14), s3 = sp(f, 30, cut + 28, 14);
  return (
    <>
      <Sequence durationInFrames={cut + 8}><Clip src="k3.mp4" len={cut + 8} /><Hook text="আজই অ্যাকাউন্ট খুলুন" hi="আজই" /></Sequence>
      <Sequence from={cut}>
        <Paper>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", fontFamily: F, color: INK, opacity: interpolate(f, [cut, cut + 8], [0, 1], clamp) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 26, transform: `scale(${0.8 + 0.2 * s})`, opacity: s }}><Logo size={V ? 150 : 140} style={{ borderRadius: 36 }} /><Wordmark h={V ? 110 : 104} /></div>
            <div style={{ fontSize: V ? 64 : 62, fontWeight: 800, marginTop: 40, opacity: s2, textAlign: "center" }}>আপনার টার্ফ, এখন <span style={{ background: TUR, padding: "0 18px", borderRadius: 18 }}>অটোপাইলটে</span></div>
            <div style={{ display: "flex", flexDirection: V ? "column" : "row", gap: 22, marginTop: 50, alignItems: "center", opacity: s3 }}>
              <div style={{ background: INK, color: "#fff", fontSize: V ? 54 : 50, fontWeight: 800, padding: "16px 46px", borderRadius: 99 }}>qount.net</div>
              <div style={{ background: TUR, color: INK, fontSize: V ? 44 : 40, fontWeight: 700, padding: "18px 40px", borderRadius: 99 }}>৩ দিন ফ্রি — এখনই শুরু করুন</div>
            </div>
            <div style={{ fontSize: V ? 34 : 30, color: GREY, fontWeight: 600, marginTop: 36, opacity: s3 }}>ফেসবুক: facebook.com/qountbd · অ্যান্ড্রয়েড অ্যাপ + ওয়েবসাইট</div>
          </AbsoluteFill>
        </Paper>
      </Sequence>
    </>
  );
};

/* ---------- timeline ---------- */
const LEAD = 6, TAIL = 12;
const D = DURS as number[];
const lenOf = (i: number, last: boolean) => Math.ceil(D[i - 1] * 30) + LEAD + (last ? 45 : TAIL);
export const TS2_H = Array.from({ length: 19 }, (_, i) => i + 1);
export const TS2_V = [1, 3, 4, 6, 7, 9, 10, 12, 17, 19];
export const ts2Len = (ids: number[]) => ids.reduce((a, id, i) => a + lenOf(id, i === ids.length - 1), 0);
const HOOKS = new Set([1, 2, 3, 4, 18]);
const SFX: Record<number, [string, number, number][]> = { 1: [["whistle.mp3", 0, 0.35]], 7: [["sms.mp3", 0.45, 0.6]], 8: [["click.mp3", 0.18, 0.6], ["click.mp3", 0.76, 0.6], ["sms.mp3", 0.8, 0.5]], 9: [["sms.mp3", 0.03, 0.6]], 10: [["click.mp3", 0.24, 0.6], ["click.mp3", 0.67, 0.5]] };

export const TurfSales2: React.FC<{ ids: number[] }> = ({ ids }) => {
  const V = useV(); const total = ts2Len(ids);
  let t = 0;
  const seqs = ids.map((id, i) => {
    const len = lenOf(id, i === ids.length - 1); const from = t; t += len;
    const fadeIn = i === 0 ? null : 6;
    return (
      <Sequence key={id} from={from} durationInFrames={len + (i < ids.length - 1 ? 6 : 0)}>
        <FadeWrap fade={fadeIn}>{SCENES[id](len, V)}{!HOOKS.has(id) && id !== 19 && <Sub text={LINES[id - 1]} />}</FadeWrap>
        <Sequence from={LEAD}><Audio src={S(`vo/${String(id).padStart(2, "0")}.mp3`)} /></Sequence>
        {(SFX[id] || []).map(([s, at, v], k) => <Sequence key={k} from={Math.round(len * at)}><Audio src={S("sfx/" + s)} volume={v} /></Sequence>)}
      </Sequence>
    );
  });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {seqs}
      <Audio src={S("music.mp3")} volume={(f) => interpolate(f, [0, 20, total - 40, total], [0, 0.13, 0.13, 0], clamp)} />
    </AbsoluteFill>
  );
};
const FadeWrap: React.FC<{ fade: number | null; children: React.ReactNode }> = ({ fade, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: fade ? interpolate(f, [0, fade], [0, 1], clamp) : 1 }}>{children}</AbsoluteFill>;
};
