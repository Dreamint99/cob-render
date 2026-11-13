// Qount — "আপনি বাসায়, বিজনেস সামলাচ্ছে Qount" (owner's script, 2026-11-13). Comps QV2-H (16:9) + QV2-V (9:16).
// Only 2 AI clips (home, outside — Veo Lite); everything else is real new-UI screens + graphics. Assets: <public>/v2 (local work/qroot/v2).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { F, sp, Logo, Wordmark } from "../Qd";

const S = (p: string) => staticFile("v2/" + p);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const INK = "#1F1A12", TUR = "#F2B300", PAPER = "#F8F5EE", GREY = "#665C4C", LINE = "#ECE6D8", GREEN = "#2C7A3F";
const useV = () => { const { width, height } = useVideoConfig(); return height > width; };

/* ---------- VO timeline ---------- */
const DUR = [8.04, 0.45, 11.39, 0.99, 4.40, 5.54, 6.46, 5.44, 7.61, 4.21];
const VO = [
  "এমন অবস্থা একবার ভাবুন তো — | আপনি বসে আছেন বাসায়, | অথবা আছেন বাইরে। | কিন্তু আপনার বিজনেস সামলাচ্ছে Qount। | কীভাবে?",
  "ওয়েট!",
  "Qount — বাংলাদেশের সুপার বুকিং অ্যাপ। | বর্তমানে রয়েছে ৮টি সার্ভিসের অটোমেশন — | টার্ফ, ডাক্তার, জিম, রিসোর্ট, | সেলুন, গেমিং জোন, ডায়াগনস্টিক আর কমিউনিটি হল।",
  "কীভাবে কাজ করে?",
  "আপনি অ্যাকাউন্ট খুলুন, বিজনেস সেটিংস করুন — | ফ্রিতে ওয়েবসাইট পেয়ে যাবেন।",
  "ব্যস! QR কোড আপনার প্রতিষ্ঠানে লাগিয়ে ফেলুন, | অথবা লিংকটা কাস্টমারকে পাঠিয়ে দিন।",
  "এখন থেকে কাস্টমার বুক করলেই আপনার কাছে চলে আসবে। | অ্যাপ বা ওয়েব — যেখান থেকে খুশি কন্ট্রোল করুন।",
  "কাস্টমার মেসেজ, মেইলসহ সব নোটিফিকেশন পেয়ে যাবে। | আর মাস শেষে — পুরো হিসাব রেডি।",
  "এছাড়া আমাদের রয়েছে Android অ্যাপ — | কাস্টমারও সেখান থেকে আপনার বিজনেস খুঁজে পাবে, | আপনিও অ্যাপ থেকেই বিজনেস ম্যানেজ করবেন।",
  "তাহলে দেরি কেন? এখনই ট্রাই করুন Qount — | ৩ দিন সম্পূর্ণ ফ্রি।",
];
const GAP = 10, HOLD = [0, 24, 0, 14, 0, 0, 0, 0, 0, 100];
const TL = (() => { let at = 6; return DUR.map((d, i) => { const len = Math.round(d * 30) + GAP + HOLD[i]; const t = { from: at, len, vo: at + 4, dur: Math.round(d * 30) }; at += len; return t; }); })();
export const V2_LEN = TL[TL.length - 1].from + TL[TL.length - 1].len;

/* ---------- pieces ---------- */
const Paper: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <AbsoluteFill style={{ background: dark ? INK : PAPER, overflow: "hidden" }}>
    <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", right: -420, top: -480, background: `radial-gradient(circle, ${TUR}${dark ? "26" : "33"} 0%, ${TUR}00 62%)` }} />
    <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", left: -380, bottom: -420, background: `radial-gradient(circle, ${TUR}1c 0%, ${TUR}00 62%)` }} />
    {children}
  </AbsoluteFill>
);
const Clip: React.FC<{ src: string; len: number; start?: number }> = ({ src, len, start = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={S(src)} startFrom={start} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [0, len], [1.02, 1.1], clamp)})` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.45) 100%)" }} />
    </AbsoluteFill>
  );
};
type Scr = { src: string; at: number };
const Phone: React.FC<{ cx: number; cy: number; h: number; screens: Scr[]; enter?: number; tilt?: number; tap?: { x: number; y: number; at: number }; children?: React.ReactNode }> = ({ cx, cy, h, screens, enter = 0, tilt = 0, tap, children }) => {
  const f = useCurrentFrame();
  const bez = Math.round(h * 0.014), sh = h - 2 * bez, sw = Math.round(sh * 1080 / 2337), w = sw + 2 * bez, k = sw / 1080;
  const e = sp(f, 30, enter, 16);
  const a = tap ? f - tap.at : -99;
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, transform: `translateY(${(1 - e) * 140}px) rotate(${tilt}deg)`, opacity: e }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: h * 0.07, background: INK, boxShadow: "0 40px 90px rgba(31,26,18,.28)" }} />
      <div style={{ position: "absolute", left: bez, top: bez, width: sw, height: sh, borderRadius: h * 0.058, overflow: "hidden", background: "#fff" }}>
        {screens.map((s, i) => <Img key={i} src={S("ui/" + s.src)} style={{ position: "absolute", inset: 0, width: sw, height: sh, opacity: i === 0 ? 1 : interpolate(f, [s.at, s.at + 7], [0, 1], clamp) }} />)}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 2337, transform: `scale(${k})`, transformOrigin: "0 0" }}>
          {tap && a > -12 && a < 30 && <div style={{ position: "absolute", left: tap.x - 50, top: tap.y - 50, width: 100, height: 100, borderRadius: 99, border: `9px solid ${TUR}`, background: "rgba(242,179,0,.25)", opacity: interpolate(a, [-12, 0, 20, 30], [0, 1, 1, 0], clamp), transform: `scale(${1 + Math.max(0, a) * 0.03})` }} />}
          {children}
        </div>
      </div>
    </div>
  );
};
const Push: React.FC<{ at: number; title: string; body: string; y?: number }> = ({ at, title, body, y = 40 }) => {
  const f = useCurrentFrame(); const s = sp(f, 30, at, 15);
  return (
    <div style={{ position: "absolute", left: 36, top: y, width: 1008, borderRadius: 56, background: "#fff", border: `3px solid ${LINE}`, boxShadow: "0 24px 60px rgba(0,0,0,.18)", transform: `translateY(${(1 - s) * -360}px)`, opacity: s, display: "flex", alignItems: "center", gap: 30, padding: "34px 40px" }}>
      <Logo size={96} style={{ borderRadius: 26 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 44, color: INK }}>{title}</span>
        <span style={{ fontFamily: F, fontWeight: 500, fontSize: 38, color: GREY }}>{body}</span>
      </div>
    </div>
  );
};
const Note: React.FC<{ at: number; icon: string; title: string; body: string; x: number; y: number; w: number; out?: number }> = ({ at, icon, title, body, x, y, w, out = 9999 }) => {
  const f = useCurrentFrame(); const s = sp(f, 30, at, 14) * interpolate(f, [out, out + 8], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: s, transform: `translateX(${(1 - s) * 60}px)`, display: "flex", alignItems: "center", gap: 20, padding: "20px 26px", borderRadius: 28, background: "rgba(255,255,255,.96)", border: `1.5px solid ${LINE}`, boxShadow: "0 20px 50px rgba(0,0,0,.18)" }}>
      <div style={{ width: 68, height: 68, borderRadius: 20, background: icon === "q" ? "transparent" : PAPER, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{icon === "q" ? <Logo size={68} style={{ borderRadius: 18 }} /> : icon}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 32, color: INK }}>{title}</span>
        <span style={{ fontFamily: F, fontWeight: 500, fontSize: 26, color: GREY }}>{body}</span>
      </div>
    </div>
  );
};
const Head: React.FC<{ text: string; at?: number; x?: number; y?: number; size?: number; color?: string; center?: boolean; tag?: string }> = ({ text, at = 0, x, y, size = 76, color = INK, center, tag }) => {
  const f = useCurrentFrame(); const s = sp(f, 30, at, 13);
  return (
    <div style={{ position: "absolute", left: x, top: y, right: center ? 0 : undefined, width: center ? "100%" : undefined, textAlign: center ? "center" : "left", opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
      {tag && <div style={{ display: "inline-block", fontFamily: F, fontWeight: 700, fontSize: size * 0.42, color: INK, background: TUR, borderRadius: 999, padding: "4px 22px 8px", marginBottom: 14 }}>{tag}</div>}
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: size, lineHeight: 1.18, color }}>{text}</div>
    </div>
  );
};

/* ---------- scenes ---------- */
const S1: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame(); const V = useV();
  const cut = 126;
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={cut}><Clip src="home.mp4" len={cut} start={10} /></Sequence>
      <Sequence from={cut}><Clip src="outside.mp4" len={len - cut} start={0} /></Sequence>
      <AbsoluteFill style={{ opacity: interpolate(f, [cut + 40, cut + 50], [0, 1], clamp) }}>
        <AbsoluteFill style={{ background: V ? "linear-gradient(180deg, rgba(0,0,0,.0) 30%, rgba(0,0,0,.35) 100%)" : "linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.45) 100%)" }} />
      </AbsoluteFill>
      {[["q", "নতুন বুকিং এসেছে", "টার্ফ · শুক্র রাত ৮:০০"], ["৳", "বিকাশ পেমেন্ট এসেছে", "৳৮০০ · TrxID যাচাই হয়েছে"], ["✓", "সিরিয়াল #১২ কনফার্ম", "রোগী SMS পেয়ে গেছেন"]].map(([i, t, b], k) => (
        <Note key={k} at={cut + 48 + k * 16} icon={i} title={t} body={b} x={V ? 90 : 1180} y={V ? 260 + k * 150 : 300 + k * 150} w={V ? 900 : 650} />
      ))}
    </AbsoluteFill>
  );
};
const S2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo src={S("outside.mp4")} startFrom={170} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) brightness(.45) blur(3px)", transform: "scale(1.12)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 210, color: INK, background: TUR, borderRadius: 40, padding: "0 70px 24px", transform: `scale(${0.6 + 0.4 * sp(f, 30, 0, 9)}) rotate(-3deg)` }}>ওয়েট…</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const SERV: [string, string][] = [["turf", "টার্ফ"], ["doctor", "ডাক্তার"], ["gym", "জিম"], ["resort", "রিসোর্ট"], ["salon", "সেলুন"], ["gaming", "গেমিং জোন"], ["lab", "ডায়াগনস্টিক"], ["hall", "কমিউনিটি হল"]];
const S3: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame(); const V = useV();
  const a = sp(f, 30, 2, 11);
  const up = interpolate(f, [100, 120], [0, 1], { ...clamp, easing: ease });
  const step = 17;
  return (
    <Paper>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateY(${-up * (V ? 560 : 330)}px) scale(${1 - up * 0.35})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, transform: `scale(${a})` }}><Logo size={170} /><Wordmark h={160} /></div>
        <div style={{ marginTop: 26, fontFamily: F, fontWeight: 700, fontSize: 60, color: INK, opacity: sp(f, 30, 18, 13) }}>বাংলাদেশের সুপার বুকিং অ্যাপ</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: V ? 560 : 330, textAlign: "center", fontFamily: F, fontWeight: 700, fontSize: V ? 54 : 50, color: INK, opacity: up }}>
        <span style={{ background: TUR, borderRadius: 999, padding: "2px 24px 8px" }}>৮টি সার্ভিসের অটোমেশন</span>
      </div>
      <div style={{ position: "absolute", left: V ? 60 : 220, right: V ? 60 : 220, top: V ? 680 : 450, display: "grid", gridTemplateColumns: V ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: V ? 28 : 26 }}>
        {SERV.map(([ic, l], i) => {
          const s = sp(f, 30, 150 + i * step, 12);
          return (
            <div key={ic} style={{ height: V ? 188 : 230, borderRadius: 30, background: "#fff", border: `1.5px solid ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, opacity: s, transform: `translateY(${(1 - s) * 50}px) scale(${0.85 + 0.15 * s})` }}>
              <div style={{ width: 104, height: 104, borderRadius: 28, background: PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}><Img src={S("icons/" + ic + ".svg")} style={{ width: 60, height: 60 }} /></div>
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 38, color: INK }}>{l}</span>
            </div>
          );
        })}
      </div>
    </Paper>
  );
};
const S4: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Paper dark>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 130, color: "#fff", transform: `scale(${0.7 + 0.3 * sp(f, 30, 0, 10)})` }}>কীভাবে কাজ করে<span style={{ color: TUR }}>?</span></div>
      </AbsoluteFill>
    </Paper>
  );
};
const Steps: React.FC<{ items: [string, string, number][]; x: number; y: number; size?: number }> = ({ items, x, y, size = 44 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", flexDirection: "column", gap: 22 }}>
      {items.map(([n, t, at], i) => {
        const s = sp(f, 30, at, 13); const on = f >= at;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, opacity: 0.25 + 0.75 * s, transform: `translateX(${(1 - s) * -30}px)` }}>
            <div style={{ width: size * 1.6, height: size * 1.6, borderRadius: 99, background: on ? TUR : LINE, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 800, fontSize: size * 0.8, color: INK }}>{n}</div>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: size, color: INK }}>{t}</span>
          </div>
        );
      })}
    </div>
  );
};
const S5: React.FC = () => {
  const V = useV();
  return (
    <Paper>
      <Phone cx={V ? 540 : 1300} cy={V ? 760 : 540} h={V ? 1250 : 980} screens={[{ src: "signup.png", at: 0 }, { src: "onboarding.png", at: 40 }, { src: "site.png", at: 92 }]} tilt={V ? 0 : 2} />
      <Steps x={V ? 120 : 170} y={V ? 1430 : 330} size={V ? 46 : 50} items={[["১", "অ্যাকাউন্ট খুলুন", 4], ["২", "বিজনেস সেটিংস করুন", 40], ["৩", "ফ্রি ওয়েবসাইট পেয়ে যান", 92]]} />
    </Paper>
  );
};
const S6: React.FC = () => {
  const V = useV(); const f = useCurrentFrame();
  const link = sp(f, 30, 86, 14);
  return (
    <Paper>
      <Phone cx={V ? 540 : 640} cy={V ? 830 : 540} h={V ? 1120 : 980} screens={[{ src: "qr.png", at: 0 }, { src: "website.png", at: 84 }]} tilt={-2} />
      <Head text="QR লাগান প্রতিষ্ঠানে" tag="ব্যস!" x={V ? 0 : 1080} y={V ? 70 : 260} size={V ? 66 : 66} center={V} />
      <div style={{ position: "absolute", left: V ? 120 : 1080, top: V ? 1460 : 560, width: V ? 840 : 680, opacity: link, transform: `translateY(${(1 - link) * 30}px)`, background: "#fff", border: `1.5px solid ${LINE}`, borderRadius: 28, padding: "24px 30px", fontFamily: F }}>
        <div style={{ fontWeight: 600, fontSize: 28, color: GREY }}>অথবা লিংক পাঠিয়ে দিন</div>
        <div style={{ fontWeight: 700, fontSize: 40, color: INK }}>qount.dreamithq.com/demo-turf</div>
        <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
          {[["WhatsApp", "#25D366"], ["Messenger", "#0084FF"], ["SMS", INK]].map(([t, c]) => <span key={t} style={{ fontWeight: 700, fontSize: 26, color: "#fff", background: c, borderRadius: 999, padding: "6px 20px 10px" }}>{t}</span>)}
        </div>
      </div>
    </Paper>
  );
};
const S7: React.FC = () => {
  const V = useV(); const f = useCurrentFrame();
  const web = sp(f, 30, 120, 15);
  return (
    <Paper>
      <Phone cx={V ? 330 : 420} cy={V ? 700 : 540} h={V ? 980 : 900} screens={[{ src: "c2-slot-picked.png", at: 0 }, { src: "c6-sent.png", at: 34 }]} tilt={-3} />
      <Phone cx={V ? 760 : 980} cy={V ? 760 : 540} h={V ? 1040 : 940} enter={36} screens={[{ src: "app-owner.png", at: 0 }]} tilt={2}>
        <Push at={44} title="নতুন বুকিং এসেছে" body="তানভীর আহমেদ · শুক্র রাত ৮:০০" />
      </Phone>
      <div style={{ position: "absolute", left: V ? 160 : 1260, top: V ? 1260 : 250, width: V ? 760 : 600, opacity: web, transform: `translateY(${(1 - web) * 50}px)` }}>
        <div style={{ borderRadius: 18, overflow: "hidden", border: `2px solid ${LINE}`, boxShadow: "0 30px 70px rgba(31,26,18,.22)", background: "#fff" }}>
          <div style={{ height: 34, background: "#F3EEE3", display: "flex", alignItems: "center", gap: 8, padding: "0 14px" }}>{["#F87171", "#FBBF24", "#34D399"].map((c) => <div key={c} style={{ width: 11, height: 11, borderRadius: 99, background: c }} />)}<span style={{ marginLeft: 10, fontFamily: F, fontSize: 18, color: GREY }}>qount.dreamithq.com/dashboard</span></div>
          <div style={{ height: (V ? 840 : 600) * 0.62, overflow: "hidden" }}><Img src={S("ui/web-dash.png")} style={{ width: "100%" }} /></div>
        </div>
        {!V && <div style={{ marginTop: 14, textAlign: "center", fontFamily: F, fontWeight: 700, fontSize: 34, color: INK }}>অ্যাপ বা ওয়েব — যেখান থেকে খুশি</div>}
      </div>
    </Paper>
  );
};
const S8: React.FC = () => {
  const V = useV(); const f = useCurrentFrame();
  const sw = 84;
  const n = interpolate(f, [sw + 10, sw + 60], [0, 65400], { ...clamp, easing: ease });
  return (
    <Paper>
      <Phone cx={V ? 540 : 620} cy={V ? 760 : 540} h={V ? 1250 : 980} screens={[{ src: "c7-ticket.png", at: 0 }, { src: "reports.png", at: sw }]} tilt={V ? 0 : -2} />
      <Note at={8} icon="✉" title="SMS · Qount" body="বুকিং কনফার্ম! শুক্র রাত ৮:০০ · QT-34VMP" x={V ? 90 : 1060} y={V ? 1430 : 300} w={V ? 900 : 720} out={sw - 6} />
      <Note at={22} icon="@" title="ইমেইল · টিকেট" body="গ্রিনফিল্ড টার্ফ — আপনার টিকেট ও QR" x={V ? 90 : 1060} y={V ? 1590 : 460} w={V ? 900 : 720} out={sw - 6} />
      <div style={{ position: "absolute", left: V ? 90 : 1060, top: V ? 1430 : 330, opacity: sp(f, 30, sw + 6, 14), fontFamily: F }}>
        <div style={{ fontWeight: 600, fontSize: 34, color: GREY }}>মাস শেষে পুরো হিসাব</div>
        <div style={{ fontWeight: 800, fontSize: V ? 110 : 120, color: INK, lineHeight: 1.1 }}>৳{Math.round(n).toLocaleString("en-IN").replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d])}</div>
        <div style={{ fontWeight: 600, fontSize: 30, color: GREEN }}>✓ আয় · বুকিং · বাকি — সব রিপোর্টে</div>
      </div>
    </Paper>
  );
};
const PlayBadge: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 * s, background: "#000", borderRadius: 16 * s, padding: `${10 * s}px ${26 * s}px ${10 * s}px ${18 * s}px` }}>
    <svg width={42 * s} height={46 * s} viewBox="0 0 26 29"><path d="M1 1.5 L15 14.5 L1 27.5 Z" fill="#00D7FE" /><path d="M1 1.5 L19.5 10.5 L15 14.5 Z" fill="#00F076" /><path d="M1 27.5 L15 14.5 L19.5 18.5 Z" fill="#FF3A44" /><path d="M19.5 10.5 L25 14.5 L19.5 18.5 L15 14.5 Z" fill="#FFD500" /></svg>
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05, fontFamily: "Arial, sans-serif", color: "#fff" }}><span style={{ fontSize: 14 * s, letterSpacing: 1 }}>GET IT ON</span><span style={{ fontSize: 30 * s, fontWeight: 700 }}>Google Play</span></div>
  </div>
);
const S9: React.FC = () => {
  const V = useV(); const f = useCurrentFrame();
  return (
    <Paper>
      <Phone cx={V ? 330 : 700} cy={V ? 860 : 560} h={V ? 1060 : 900} screens={[{ src: "app-home.png", at: 0 }]} tilt={-3} />
      <Phone cx={V ? 760 : 1180} cy={V ? 920 : 560} h={V ? 1060 : 900} enter={70} screens={[{ src: "app-owner.png", at: 0 }]} tilt={3} />
      <div style={{ position: "absolute", left: V ? 330 - 140 : 700 - 140, top: V ? 290 : 50, width: 280, textAlign: "center", fontFamily: F, fontWeight: 700, fontSize: 30, color: GREY, opacity: sp(f, 30, 6) }}>কাস্টমার খুঁজে পাবে</div>
      <div style={{ position: "absolute", left: V ? 760 - 140 : 1180 - 140, top: V ? 350 : 50, width: 280, textAlign: "center", fontFamily: F, fontWeight: 700, fontSize: 30, color: GREY, opacity: sp(f, 30, 76) }}>আপনি ম্যানেজ করবেন</div>
      <div style={{ position: "absolute", left: V ? 0 : 1430, right: V ? 0 : 60, top: V ? 140 : 460, display: "flex", justifyContent: "center", transform: `scale(${sp(f, 30, 20, 12)})` }}><PlayBadge s={V ? 1.3 : 1.15} /></div>
    </Paper>
  );
};
const S10: React.FC = () => {
  const f = useCurrentFrame(); const V = useV();
  const a = sp(f, 30, 2, 12), b = sp(f, 30, 10, 13), c = sp(f, 30, 30, 12);
  return (
    <Paper>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: V ? 40 : 30, paddingBottom: V ? 200 : 60 }}>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: V ? 64 : 58, color: GREY, opacity: b }}>তাহলে দেরি কেন?</div>
        <div style={{ display: "flex", alignItems: "center", gap: 26, transform: `scale(${a})` }}>
          <svg width={V ? 170 : 150} height={V ? 170 : 150} viewBox="0 0 512 512"><rect width="512" height="512" rx="116" fill={TUR} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((r, i) => <ellipse key={r} cx="256" cy="148" rx="46" ry="86" transform={`rotate(${r} 256 256)`} fill={INK} opacity={interpolate(f, [2 + i * 2.2, 6 + i * 2.2], [0, 1], clamp)} />)}
            <circle cx="256" cy="256" r="40" fill={TUR} /><circle cx="256" cy="256" r="18" fill={INK} /></svg>
          <Wordmark h={V ? 160 : 140} />
        </div>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: V ? 66 : 60, color: INK, opacity: b, textAlign: "center" }}>আপনার বিজনেস, এখন অটোপাইলটে।</div>
        <div style={{ display: "flex", flexDirection: V ? "column" : "row", alignItems: "center", gap: 22, opacity: c, transform: `scale(${0.9 + 0.1 * c})` }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: V ? 58 : 50, color: INK, background: TUR, borderRadius: 999, padding: "10px 46px 18px" }}>৩ দিন ফ্রি শুরু করুন</div>
          <div style={{ fontFamily: F, fontWeight: 600, fontSize: V ? 50 : 44, color: INK, background: "#fff", border: `2px solid ${LINE}`, borderRadius: 999, padding: "12px 40px 16px" }}>qount.dreamithq.com</div>
          <PlayBadge s={V ? 1.2 : 1} />
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

/* ---------- captions (big Bangla) ---------- */
const Captions: React.FC = () => {
  const f = useCurrentFrame(); const V = useV();
  let cur: { t: string; s: number; dark: boolean } | null = null;
  TL.forEach((t, i) => {
    if (i === 1 || i === 3 || i === 9) return; // the big type already says it
    const parts = VO[i].split("|").map((x) => x.trim()); const tot = parts.reduce((a, p) => a + p.length, 0); let at = t.vo;
    for (const p of parts) { const d = (t.dur * p.length) / tot; if (f >= at && f < at + d + 4) cur = { t: p, s: at, dark: i === 0 }; at += d; }
  });
  if (!cur) return null;
  const c = cur as { t: string; s: number; dark: boolean };
  const o = interpolate(f - c.s, [0, 5], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom: V ? 120 : 44, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ maxWidth: V ? 1000 : 1600, fontFamily: F, fontWeight: 700, fontSize: V ? 56 : 52, lineHeight: 1.3, textAlign: "center", color: c.dark ? "#fff" : INK, background: c.dark ? "rgba(20,15,8,.72)" : "rgba(255,255,255,.95)", border: c.dark ? "none" : `1.5px solid ${LINE}`, padding: "6px 32px 12px", borderRadius: 22 }}>{c.t}</div>
    </div>
  );
};

export const Film2: React.FC = () => {
  const f = useCurrentFrame();
  const SC = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {TL.map((t, i) => { const C = SC[i] as React.FC<{ len: number }>; return <Sequence key={i} from={t.from} durationInFrames={i === 9 ? undefined : t.len}><C len={t.len} /></Sequence>; })}
      {TL.slice(1).map((t, i) => <AbsoluteFill key={i} style={{ background: "#fff", opacity: interpolate(f, [t.from - 1, t.from, t.from + 5], [0, 0.22, 0], clamp) }} />)}
      <Captions />
      {TL.map((t, i) => <Sequence key={"v" + i} from={t.vo}><Audio src={S(`v${i + 1}.mp3`)} /></Sequence>)}
      <Audio src={S("music.mp3")} loop volume={(x) => interpolate(x, [0, 15, TL[1].from - 2, TL[1].from, TL[2].from, TL[2].from + 8, TL[9].from, TL[9].from + 30, V2_LEN - 20, V2_LEN], [0, 0.14, 0.14, 0, 0, 0.18, 0.12, 0.2, 0.2, 0], clamp)} />
      <Sequence from={TL[1].from}><Audio src={S("hit.mp3")} volume={0.55} /></Sequence>
      {[0, 1, 2].map((k) => <Sequence key={k} from={TL[0].from + 174 + k * 16}><Audio src={S("sms.mp3")} volume={0.35} /></Sequence>)}
      <Sequence from={TL[6].from + 44}><Audio src={S("sms.mp3")} volume={0.4} /></Sequence>
      <Sequence from={TL[7].from + 8}><Audio src={S("sms.mp3")} volume={0.4} /></Sequence>
      <Sequence from={TL[9].from}><Audio src={S("hit.mp3")} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};
