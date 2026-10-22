// Soulmate 2.0 — 9:16 promo reel (~29 s). Screens recreated from the "Concept 2" design canvas.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadAnek } from "@remotion/google-fonts/AnekBangla";

const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
loadSerif("italic", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: SANS } = loadJakarta("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });
const { fontFamily: BN } = loadAnek("normal", { weights: ["500", "700", "800"], subsets: ["bengali", "latin"] });

const Y = "#FFC629";
const INK = "#111111";
const img = (n: string) => staticFile(`soulmate/img/${n}.jpg`);
const vo = (i: number) => staticFile(`soulmate/vo/0${i}.mp3`);

// scene starts (frames @30fps) and VO offsets
const S = [0, 108, 309, 402, 600, 738];
export const SM_TOTAL = 882;
const VO_AT = [9, 114, 312, 405, 603, 744];
const VO_LEN = [89, 190, 82, 190, 130, 108];

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const fade = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

/* ---------- small icons (from the design) ---------- */
const Spark = ({ s = 16, fill = Y, stroke = "#fff" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" fill={fill} stroke={stroke} strokeWidth={1.8} strokeLinejoin="round" /><path d="m19 15 .8 2.2 2.2.8-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" fill="none" stroke={stroke} strokeWidth={1.8} strokeLinejoin="round" /></svg>
);
const Check = ({ s = 18, c = INK }) => (<svg width={s} height={s} viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /></svg>);
const Shield = ({ s = 20 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 21s7.5-3.6 7.5-9.5V5.5L12 3 4.5 5.5v6C4.5 17.4 12 21 12 21z" fill={Y} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" /><path d="m9 12 2 2 4-4" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Heart = ({ s = 32 }) => (<svg width={s} height={s} viewBox="0 0 24 24" fill={INK}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z" /></svg>);

/* ---------- phone screens, native 390x844 ---------- */
const screenBase: React.CSSProperties = { width: 390, height: 844, position: "absolute", inset: 0, background: "#fff", color: INK, fontFamily: SANS, overflow: "hidden" };

const IntentScreen: React.FC<{ f: number }> = ({ f }) => {
  const opts = [
    ["i", "Friendship", "New people to talk and hang out with"],
    ["ii", "Something serious", "A real relationship, taking it slow"],
    ["iii", "Marriage", "Ready to find a life partner"],
  ];
  // highlight follows the VO words বন্ধু / সম্পর্ক / জীবনসঙ্গী
  const sel = f < 96 ? -1 : f < 128 ? 0 : f < 158 ? 1 : 2;
  return (
    <div style={screenBase}>
      <div style={{ position: "absolute", top: 50, left: 16, right: 20, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, border: "1px solid #ECECEC" }} />
        <div style={{ flex: 1, display: "flex", gap: 6 }}>{[1, 1, 0, 0].map((d, i) => <span key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: d ? INK : "#ECECEC" }} />)}</div>
        <span style={{ fontSize: 13, fontWeight: 800 }}>2/4</span>
      </div>
      <div style={{ position: "absolute", top: 130, left: 24, right: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        <h1 style={{ margin: "0 0 14px", fontFamily: SERIF, fontWeight: 400, fontSize: 48, lineHeight: 1, letterSpacing: -1 }}>What brings you <i>here?</i></h1>
        {opts.map(([n, t, d], i) => {
          const on = i === sel;
          const p = on ? spring({ frame: f - [96, 128, 158][i], fps: 30, config: { damping: 14 } }) : 0;
          return (
            <div key={i} style={{ borderRadius: 28, border: on ? "1.5px solid #111" : "1.5px solid #ECECEC", background: on ? INK : "#fff", color: on ? "#fff" : INK, padding: "20px 20px 20px 22px", display: "flex", alignItems: "center", gap: 16, transform: `scale(${1 + 0.04 * Math.sin(Math.min(p, 1) * Math.PI)})` }}>
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: on ? Y : "#C9C9C9", width: 34 }}>{n}</span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: SERIF, fontSize: 28, lineHeight: 1 }}>{t}</span>
                <span style={{ fontSize: 13, color: on ? "#BDBDBD" : "#8A8A8A" }}>{d}</span>
              </span>
              <span style={{ width: 32, height: 32, borderRadius: 16, border: on ? "none" : "1.5px solid #DADADA", background: on ? Y : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{on && <Check />}</span>
            </div>
          );
        })}
        <span style={{ fontSize: 13, color: "#8A8A8A", paddingTop: 4 }}>Shown on your profile. You can change it any time.</span>
      </div>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 40, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: "#8A8A8A", maxWidth: 220, lineHeight: 1.4 }}>We match you with people who want the same.</span>
        <span style={{ width: 68, height: 68, borderRadius: 34, background: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={26} height={26} viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke={Y} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </div>
    </div>
  );
};

const SelfieScreen: React.FC<{ f: number }> = ({ f }) => {
  const prog = interpolate(f, [6, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const done = spring({ frame: f - 58, fps: 30, config: { damping: 12 } });
  const scanY = interpolate(f % 40, [0, 40], [20, 230]);
  const checks = ["Face found", "Good light", "Angles 3/3"];
  return (
    <div style={screenBase}>
      <div style={{ position: "absolute", top: 50, left: 16, right: 20, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, border: "1px solid #ECECEC" }} />
        <div style={{ flex: 1, display: "flex", gap: 6 }}>{[1, 1, 1, 1].map((_, i) => <span key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: INK }} />)}</div>
        <span style={{ fontSize: 13, fontWeight: 800 }}>4/4</span>
      </div>
      <div style={{ position: "absolute", top: 130, left: 24, right: 24, display: "flex", flexDirection: "column", gap: 8 }}>
        <h1 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 48, lineHeight: 1, letterSpacing: -1 }}>Quick selfie, <i>real you.</i></h1>
        <span style={{ fontSize: 14, lineHeight: 1.5, color: "#666" }}>Our AI checks that your selfie matches your photos. The selfie is never shown on your profile.</span>
      </div>
      <div style={{ position: "absolute", top: 300, left: 65, width: 260, height: 260 }}>
        <svg width={260} height={260} viewBox="0 0 260 260" style={{ position: "absolute", inset: 0 }}>
          <circle cx={130} cy={130} r={124} fill="none" stroke="#ECECEC" strokeWidth={6} />
          <circle cx={130} cy={130} r={124} fill="none" stroke={Y} strokeWidth={6} strokeLinecap="round" strokeDasharray={779} strokeDashoffset={779 * (1 - prog)} transform="rotate(-90 130 130)" />
        </svg>
        <div style={{ position: "absolute", left: 16, top: 16, width: 228, height: 228, borderRadius: 114, overflow: "hidden" }}>
          <Img src={img("tanvir")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%" }} />
          {prog < 1 && <div style={{ position: "absolute", left: 0, right: 0, top: scanY, height: 3, background: Y, boxShadow: `0 0 18px 6px ${Y}88` }} />}
        </div>
        <span style={{ position: "absolute", left: "50%", bottom: -14, transform: `translateX(-50%) scale(${0.6 + 0.4 * done})`, opacity: done, height: 36, padding: "0 16px", borderRadius: 99, background: INK, color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}>
          <span style={{ width: 20, height: 20, borderRadius: 10, background: Y, display: "flex", alignItems: "center", justifyContent: "center" }}><Check s={14} /></span>Verified
        </span>
      </div>
      <div style={{ position: "absolute", top: 610, left: 24, right: 24, display: "flex", gap: 10 }}>
        {checks.map((c, i) => {
          const on = prog > (i + 1) / 3.2;
          return (
            <span key={c} style={{ flex: 1, height: 44, borderRadius: 14, background: "#F6F6F6", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: on ? INK : "#8A8A8A" }}>
              {on && <Check s={16} c="#1F9D55" />}{c}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 40, height: 62, borderRadius: 31, background: INK, color: "#fff", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {done > 0.5 ? "Continue" : "Take selfie"}
      </div>
    </div>
  );
};

const NavBar = () => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 78, borderTop: "1px solid #F1F1F1", background: "#fff", display: "flex", justifyContent: "space-around", alignItems: "center", paddingBottom: 14, boxSizing: "border-box", fontSize: 11, fontWeight: 600, color: "#A3A3A3" }}>
    {["Discover", "Explore", "Matches", "Chats", "Me"].map((t, i) => (
      <span key={t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: i === 0 ? INK : "#A3A3A3", fontWeight: i === 0 ? 800 : 600 }}>
        <span style={{ width: 22, height: 22, borderRadius: i === 0 ? 11 : 6, border: `1.8px solid ${i === 0 ? INK : "#A3A3A3"}`, background: i === 0 ? Y : "transparent" }} />{t}
      </span>
    ))}
  </div>
);

const DiscoverScreen: React.FC<{ f: number }> = ({ f }) => {
  const why = spring({ frame: f - 18, fps: 30, config: { damping: 16 } });
  const ice = spring({ frame: f - 70, fps: 30, config: { damping: 15 } });
  const safe = spring({ frame: f - 128, fps: 30, config: { damping: 15 } });
  const zoom = interpolate(f, [0, 198], [1.0, 1.06]);
  return (
    <div style={screenBase}>
      <div style={{ position: "absolute", top: 50, left: 20, right: 20, height: 48, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: SERIF, fontSize: 32, letterSpacing: -0.5 }}>soulmate<span style={{ color: Y }}>.</span></span>
        <span style={{ width: 44, height: 44, borderRadius: 22, border: "1px solid #ECECEC" }} />
      </div>
      <div style={{ position: "absolute", top: 108, left: 12, right: 12, height: 566, borderRadius: 36, overflow: "hidden", color: "#fff" }}>
        <Img src={img("anika")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 22%", transform: `scale(${zoom})` }} />
        <div style={{ position: "absolute", top: 16, left: 16, right: 16, display: "flex", gap: 4 }}>{[1, 0, 0].map((a, i) => <span key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: a ? "#fff" : "rgba(255,255,255,.45)" }} />)}</div>
        <span style={{ position: "absolute", top: 32, left: 16, height: 30, padding: "0 12px", borderRadius: 99, background: Y, color: INK, fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}><Check s={14} />Selfie-verified</span>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 300, background: "linear-gradient(to top, rgba(0,0,0,.82), rgba(0,0,0,0))" }} />
        <div style={{ position: "absolute", left: 22, right: 22, bottom: 58, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: SERIF, fontSize: 64, lineHeight: 0.9, letterSpacing: -1 }}>Anika</span>
            <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: Y }}>24</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.85)" }}>Designer · Dhanmondi · 3 km away</span>
          <div style={{ display: "flex", gap: 6 }}>
            {["Marriage-minded", "Street food", "Travel"].map((t) => <span key={t} style={{ height: 28, padding: "0 12px", borderRadius: 99, border: "1px solid rgba(255,255,255,.4)", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center" }}>{t}</span>)}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 636, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
        <span style={{ width: 62, height: 62, borderRadius: 31, background: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={24} height={24} viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" /></svg>
        </span>
        <span style={{ width: 78, height: 78, borderRadius: 39, background: Y, boxShadow: "0 10px 28px rgba(255,198,41,.55)", display: "flex", alignItems: "center", justifyContent: "center" }}><Heart /></span>
        <span style={{ width: 62, height: 62, borderRadius: 31, background: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={22} height={22} viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" fill="none" stroke={Y} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </div>
      <NavBar />
      {/* AI overlays */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)", opacity: ice }} />
      <div style={{ position: "absolute", left: 18, right: 18, top: 372, opacity: why, transform: `translateY(${(1 - why) * 40}px)` }}>
        <div style={{ borderRadius: 24, background: "#fff", padding: "16px 18px", boxShadow: "0 18px 50px rgba(0,0,0,.28)", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ width: 34, height: 34, borderRadius: 17, background: INK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Spark /></span>
          <span style={{ fontSize: 14, lineHeight: 1.45, color: "#444" }}><b style={{ color: INK, display: "block", fontSize: 15, marginBottom: 2 }}>Why you might click</b>Both love street food, both plan to settle in Dhaka.</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, top: 480, opacity: ice, transform: `translateY(${(1 - ice) * 40}px)`, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", background: INK, borderRadius: 99, padding: "6px 12px", display: "flex", gap: 6, alignItems: "center" }}><Spark s={13} />Icebreakers</span>
        {["Best cha spot in Dhaka?", "Which trip is next on your list?"].map((t, i) => {
          const p = spring({ frame: f - 78 - i * 8, fps: 30, config: { damping: 15 } });
          return <span key={t} style={{ height: 40, padding: "0 16px", borderRadius: 20, background: "#fff", border: i === 0 ? `2px solid ${INK}` : "1.5px solid #ECECEC", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,.2)", opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}>{t}</span>;
        })}
      </div>
      <div style={{ position: "absolute", left: 14, right: 14, top: 640, opacity: safe, transform: `translateY(${(1 - safe) * 60}px)` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", borderRadius: 22, background: INK, color: "#fff", padding: "16px 18px", boxShadow: "0 20px 50px rgba(0,0,0,.35)" }}>
          <span style={{ flexShrink: 0 }}><Shield s={26} /></span>
          <span style={{ fontSize: 13.5, lineHeight: 1.45, color: "#D6D6D6" }}><b style={{ color: Y }}>Stay safe.</b> This chat asked for money. Soulmate never asks for bKash, gifts or codes.</span>
        </div>
      </div>
    </div>
  );
};

const ChatScreen: React.FC<{ f: number }> = ({ f }) => {
  const msgs: [boolean, string][] = [
    [true, "Hi Anika! Is that cafe in Dhanmondi 27?"],
    [false, "Good eye! My weekend spot. Cha or coffee?"],
    [true, "Cha, always."],
  ];
  return (
    <div style={screenBase}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "50px 14px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #F1F1F1" }}>
        <span style={{ width: 30 }} />
        <Img src={img("anika")} style={{ width: 46, height: 46, borderRadius: 23, objectFit: "cover", objectPosition: "center 20%", border: `2px solid ${Y}` }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: SERIF, fontSize: 24, lineHeight: 1 }}>Anika</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1F9D55" }}>Active now</span>
        </div>
        <span style={{ width: 44, height: 44, borderRadius: 22, background: "#F4F4F4", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: f > 40 && f < 70 ? `0 0 0 ${interpolate(f, [40, 70], [0, 14])}px ${Y}55` : "none" }}>
          <svg width={20} height={20} viewBox="0 0 24 24"><path d="M20.5 16.6v2.6a1.8 1.8 0 0 1-2 1.8A17.6 17.6 0 0 1 3 5.5a1.8 1.8 0 0 1 1.8-2h2.6a1.8 1.8 0 0 1 1.8 1.5l.4 2.4a1.8 1.8 0 0 1-.5 1.6l-1.2 1.2a14 14 0 0 0 5.9 5.9l1.2-1.2a1.8 1.8 0 0 1 1.6-.5l2.4.4a1.8 1.8 0 0 1 1.5 1.8z" fill={Y} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" /></svg>
        </span>
        <span style={{ width: 44, height: 44, borderRadius: 22, background: INK, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${f > 56 ? 1 + 0.15 * Math.sin(interpolate(f, [56, 70], [0, Math.PI], { extrapolateRight: "clamp" })) : 1})` }}>
          <svg width={20} height={20} viewBox="0 0 24 24"><rect x={2.5} y={6} width={13} height={12} rx={3} fill={Y} stroke="#fff" strokeWidth={1.8} /><path d="m15.5 10.5 6-3.5v10l-6-3.5" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinejoin="round" /></svg>
        </span>
      </div>
      <div style={{ position: "absolute", top: 122, left: 16, right: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ alignSelf: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "6px 0 4px" }}>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 20 }}>You matched today</span>
          <span style={{ fontSize: 12, color: "#8A8A8A" }}>Street food · Travel · Photography</span>
        </div>
        {msgs.map(([me, t], i) => {
          const p = spring({ frame: f - 4 - i * 11, fps: 30, config: { damping: 14 } });
          return <span key={i} style={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: "78%", padding: "12px 16px", borderRadius: me ? "24px 24px 6px 24px" : "24px 24px 24px 6px", background: me ? INK : "#F4F4F4", color: me ? "#fff" : INK, fontSize: 14, lineHeight: 1.45, opacity: p, transform: `translateY(${(1 - p) * 20}px) scale(${0.9 + 0.1 * p})` }}>{t}</span>;
        })}
        {(() => {
          const p = spring({ frame: f - 38, fps: 30, config: { damping: 14 } });
          return (
            <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: "24px 24px 24px 6px", background: "#F4F4F4", opacity: p }}>
              <span style={{ width: 34, height: 34, borderRadius: 17, background: Y, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width={14} height={14} viewBox="0 0 24 24" fill={INK}><path d="M8 5v14l11-7z" /></svg></span>
              <span style={{ display: "flex", gap: 3, alignItems: "center" }}>{[10, 18, 12, 20, 8, 14, 10, 16].map((h, k) => <i key={k} style={{ width: 3, height: h, background: k < 4 ? INK : "#C9C9C9", borderRadius: 2 }} />)}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#666" }}>0:14</span>
            </div>
          );
        })()}
      </div>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 30, display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ flex: 1, height: 50, borderRadius: 25, background: "#F4F4F4", padding: "0 18px", display: "flex", alignItems: "center", fontSize: 14, color: "#A3A3A3", fontWeight: 500 }}>Message Anika</span>
        <span style={{ width: 50, height: 50, borderRadius: 25, background: Y }} />
      </div>
    </div>
  );
};

const CallScreen: React.FC<{ f: number }> = ({ f }) => {
  const sec = 4 * 60 + 12 + Math.floor(f / 30);
  const t = `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  return (
    <div style={{ ...screenBase, background: "#000", color: "#fff" }}>
      <Img src={img("anika")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", transform: `scale(${interpolate(f, [0, 80], [1.08, 1.0], { extrapolateRight: "clamp" })})` }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,.7) 100%)" }} />
      <div style={{ position: "absolute", top: 56, left: 22, display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: SERIF, fontSize: 44, lineHeight: 1 }}>Anika</span>
        <span style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: Y }} />{t} · matches only</span>
      </div>
      <Img src={img("tanvir")} style={{ position: "absolute", top: 56, right: 18, width: 104, height: 148, borderRadius: 22, objectFit: "cover", border: `3px solid ${Y}` }} />
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 34, height: 84, borderRadius: 42, background: "rgba(17,17,17,.72)", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 10px" }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 56, height: 56, borderRadius: 28, background: "rgba(255,255,255,.12)" }} />)}
        <span style={{ width: 56, height: 56, borderRadius: 28, background: Y, display: "flex", alignItems: "center", justifyContent: "center" }}><Shield s={24} /></span>
        <span style={{ width: 64, height: 64, borderRadius: 32, background: "#E5484D", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={28} height={28} viewBox="0 0 24 24"><path d="M3 14.5c5-4.7 13-4.7 18 0l-2.2 2.6-3.6-1.4v-2.3a10 10 0 0 0-6.4 0v2.3l-3.6 1.4z" fill="#fff" /></svg>
        </span>
      </div>
    </div>
  );
};

/* ---------- phone frame + captions ---------- */
const PH_SCALE = 1.66;
const Phone: React.FC<{ children: React.ReactNode; enter: number; tilt?: number }> = ({ children, enter, tilt = 0 }) => (
  <div style={{ position: "absolute", left: 540 - (390 * PH_SCALE) / 2 - 14, top: 440, width: 390 * PH_SCALE + 28, height: 844 * PH_SCALE + 28, borderRadius: 44 * PH_SCALE + 14, background: INK, padding: 14, boxSizing: "border-box", boxShadow: "0 60px 120px rgba(0,0,0,.25), 0 0 0 2px #2a2a2a inset", transform: `translateY(${(1 - enter) * 900}px) rotate(${tilt}deg)` }}>
    <div style={{ width: 390 * PH_SCALE, height: 844 * PH_SCALE, borderRadius: 44 * PH_SCALE, overflow: "hidden", position: "relative", background: "#fff" }}>
      <div style={{ width: 390, height: 844, transform: `scale(${PH_SCALE})`, transformOrigin: "0 0", position: "absolute" }}>{children}</div>
    </div>
  </div>
);

const Caption: React.FC<{ f: number; at?: number; top?: number; small?: string; big: string; dark?: boolean }> = ({ f, at = 0, top = 150, small, big, dark }) => {
  const p = spring({ frame: f - at, fps: 30, config: { damping: 18 } });
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px)`, color: dark ? "#fff" : INK }}>
      {small && <div style={{ fontFamily: BN, fontWeight: 500, fontSize: 46, color: dark ? "#CFCFCF" : "#555", marginBottom: 8 }}>{small}</div>}
      <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 84, lineHeight: 1.15 }}>{big}</div>
    </div>
  );
};

// a caption block that swaps text at given local frames
const SwapCaption: React.FC<{ f: number; items: [number, string, string?][] }> = ({ f, items }) => {
  let idx = 0;
  items.forEach(([a], i) => { if (f >= a) idx = i; });
  const [a, big, small] = items[idx];
  return <Caption key={idx} f={f} at={a} big={big} small={small} />;
};

const Bg: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: "#FAFAF7" }}>
    <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: 650, left: -600 + Math.sin(f / 90) * 40, top: 1150, background: "radial-gradient(circle, rgba(255,198,41,.30), rgba(255,198,41,0) 65%)" }} />
    <div style={{ position: "absolute", width: 900, height: 900, borderRadius: 450, right: -420, top: -300 + Math.cos(f / 80) * 30, background: "radial-gradient(circle, rgba(255,198,41,.22), rgba(255,198,41,0) 65%)" }} />
  </AbsoluteFill>
);

/* ---------- scenes ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const cards: [string, number, number, number, number][] = [
    ["nabila", 90, 880, -8, 4], ["sami", 640, 760, 7, 0], ["anika", 330, 1180, -2, 10], ["beach", 700, 1330, 6, 16],
  ];
  const line = fade(f, 34, 60);
  const out = 1 - fade(f, 96, 108);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {cards.map(([n, x, y, r, d]) => {
        const p = spring({ frame: f - d, fps: 30, config: { damping: 16 } });
        return (
          <div key={n} style={{ position: "absolute", left: x, top: y + (1 - p) * 300 - f * 1.2, width: 340, height: 440, borderRadius: 40, overflow: "hidden", transform: `rotate(${r}deg) scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 30px 70px rgba(0,0,0,.22)", border: "8px solid #fff" }}>
            <Img src={img(n)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%" }} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center" }}>
        <div style={{ fontFamily: BN, fontWeight: 500, fontSize: 56, color: "#555", opacity: fade(f, 4, 22) }}>দেশে কিংবা প্রবাসে</div>
        <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 150, lineHeight: 1.2, color: INK, opacity: fade(f, 18, 36), transform: `scale(${0.9 + 0.1 * fade(f, 18, 40)})` }}>আর নয় একা</div>
        <div style={{ margin: "6px auto 0", height: 14, borderRadius: 7, background: Y, width: 520 * line }} />
      </div>
    </AbsoluteFill>
  );
};

const ScreensBlock: React.FC = () => {
  // covers scenes 2–5 (local frame 0 = S[1])
  const f = useCurrentFrame();
  const enter = spring({ frame: f - 34, fps: 30, config: { damping: 18, mass: 0.9 } });
  const exit = fade(f, S[5] - S[1] - 12, S[5] - S[1]);
  const local = (i: number) => f - (S[i] - S[1]);
  const slide = (i: number) => (i === 1 ? 0 : interpolate(local(i), [0, 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }));
  const scr = f < S[2] - S[1] ? 1 : f < S[3] - S[1] ? 2 : f < S[4] - S[1] ? 3 : 4;
  const prev = scr - 1;
  const render = (i: number) => {
    const lf = local(i);
    if (i === 1) return <IntentScreen f={lf} />;
    if (i === 2) return <SelfieScreen f={lf} />;
    if (i === 3) return <DiscoverScreen f={lf} />;
    return lf < 66 ? <ChatScreen f={lf} /> : <CallScreen f={lf - 66} />;
  };
  const s = slide(scr);
  const callFade = scr === 4 ? fade(local(4), 66, 76) : 0;
  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 - exit * 0.06})` }}>
      {/* captions */}
      {scr === 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center" }}>
          <div style={{ fontFamily: BN, fontWeight: 500, fontSize: 50, color: "#555", opacity: fade(f, 0, 14) }}>বাংলাদেশীদের অ্যাপ</div>
          <div style={{ fontFamily: SERIF, fontSize: 170, lineHeight: 1, letterSpacing: -3, color: INK, opacity: fade(f, 6, 22), transform: `translateY(${(1 - fade(f, 6, 26)) * 30}px)` }}>
            soulmate<span style={{ color: Y }}>.</span> <i style={{ color: INK, background: Y, borderRadius: 28, padding: "0 22px", fontSize: 120 }}>2.0</i>
          </div>
        </div>
      )}
      {scr === 2 && <Caption f={local(2)} at={2} small="প্রতিটি প্রোফাইল" big="সেলফি-ভেরিফায়েড" top={130} />}
      {scr === 3 && (
        <SwapCaption f={local(3)} items={[[2, "কেন মিলতে পারে", "AI দেখায়"], [66, "কথা শুরুর আইডিয়া", "AI দেয়"], [124, "প্রতারণা থেকে সাবধান", "AI রাখে"]]} />
      )}
      {scr === 4 && <SwapCaption f={local(4)} items={[[2, "চ্যাট · অডিও · ভিডিও", "ম্যাচ হলেই"], [66, "শুধু ম্যাচের সাথে", "ভিডিও কল"]]} />}
      <Phone enter={enter} tilt={(1 - enter) * 6}>
        {prev >= 1 && s > 0 && <div style={{ position: "absolute", inset: 0, transform: `translateX(${-(1 - s) * 390 * 0.3}px)` }}>{render(prev)}</div>}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${s * 390}px)`, boxShadow: s > 0 ? "-20px 0 40px rgba(0,0,0,.15)" : "none" }}>
          {render(scr)}
          {scr === 4 && callFade > 0 && callFade < 1 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 1 - Math.abs(callFade * 2 - 1) }} />}
        </div>
      </Phone>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const p = spring({ frame: f - 2, fps: 30, config: { damping: 16 } });
  const faces = ["anika", "sami", "nabila", "rahim"];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ display: "flex", marginBottom: 70 }}>
        {faces.map((n, i) => {
          const q = spring({ frame: f - 4 - i * 4, fps: 30, config: { damping: 14 } });
          return <Img key={n} src={img(n)} style={{ width: 150, height: 150, borderRadius: 75, objectFit: "cover", objectPosition: "center 25%", border: "7px solid #fff", marginLeft: i ? -36 : 0, boxShadow: "0 16px 40px rgba(0,0,0,.18)", transform: `scale(${q})` }} />;
        })}
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 230, lineHeight: 0.9, letterSpacing: -5, color: INK, opacity: p, transform: `scale(${0.92 + 0.08 * p})` }}>
        soulmate<span style={{ color: Y }}>.</span>
      </div>
      <div style={{ marginTop: 26, fontFamily: SERIF, fontStyle: "italic", fontSize: 110, color: INK, background: Y, borderRadius: 30, padding: "0 34px", opacity: fade(f, 10, 24) }}>2.0</div>
      <div style={{ marginTop: 80, fontFamily: BN, fontWeight: 700, fontSize: 60, color: INK, textAlign: "center", lineHeight: 1.35, opacity: fade(f, 22, 38) }}>
        আর নয় একা —<br />খুঁজে নিন বন্ধু কিংবা পার্টনার
      </div>
      <div style={{ marginTop: 70, height: 100, padding: "0 46px", borderRadius: 50, background: INK, color: "#fff", display: "flex", alignItems: "center", gap: 20, fontFamily: BN, fontWeight: 700, fontSize: 46, opacity: fade(f, 36, 52), transform: `translateY(${(1 - fade(f, 36, 56)) * 30}px)` }}>
        <span style={{ width: 18, height: 18, borderRadius: 9, background: Y }} />
        শীঘ্রই আসছে · <span style={{ fontFamily: SANS, fontWeight: 700 }}>Google Play</span>
      </div>
    </AbsoluteFill>
  );
};

export const SoulmateReel: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const speaking = (fr: number) => VO_AT.some((a, i) => fr >= a - 4 && fr <= a + VO_LEN[i] + 4);
  return (
    <AbsoluteFill style={{ fontFamily: SANS }}>
      <Bg f={f} />
      <Sequence durationInFrames={S[1]}><Hook /></Sequence>
      <Sequence from={S[1]} durationInFrames={S[5] - S[1]}><ScreensBlock /></Sequence>
      <Sequence from={S[5]}><EndCard /></Sequence>
      {VO_AT.map((a, i) => <Sequence key={i} from={a}><Audio src={vo(i + 1)} /></Sequence>)}
      <Audio src={staticFile("soulmate/music.mp3")} volume={(fr) => {
        const edge = interpolate(fr, [0, 12, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return edge * (speaking(fr) ? 0.16 : 0.42);
      }} />
    </AbsoluteFill>
  );
};
