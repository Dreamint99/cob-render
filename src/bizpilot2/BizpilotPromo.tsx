// Bizpilot promo v2 (16:9): real screenshots of the live app (dark UI), kinetic Bangla text, device frames.
// VO Tanvir via OpenRouter (work/bizpilot2/). Screens captured from the public demo (work/pbcap/bp2cap.mjs).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import DURS from "./durs.json";

const FPS = 30, PAD = 0.45, LEAD = 8;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
const S = (p: string) => staticFile("bizpilot2/" + p);

const BG = "#07070D", CARD = "#12121C", LINE = "rgba(255,255,255,0.08)", VIO = "#8B5CF6", VIO2 = "#A78BFA", CYAN = "#22D3EE",
  MINT = "#22C55E", AMBER = "#F59E0B", TXT = "#F4F4FA", MUTE = "#9A9AB2";
const GRAD = `linear-gradient(90deg, ${VIO2}, ${CYAN})`;
const BN = "AnekB, 'Hind Siliguri', sans-serif", BODY = "Hind, 'Hind Siliguri', sans-serif", LAT = "Montserrat, sans-serif";

if (typeof document !== "undefined") {
  for (const [name, file] of [["AnekB", "AnekBangla.ttf"], ["Hind", "HindSiliguri-Bold.ttf"], ["Montserrat", "Montserrat.ttf"]]) {
    const ff = new FontFace(name, `url(${staticFile("fonts/" + file)})`);
    ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  }
}

type Seg = { p: string; text: string; dur: number };
const SEGS = DURS as Seg[];
export const timelineBP2 = () => {
  let at = 0;
  return SEGS.map((s) => {
    const len = Math.round((s.dur + PAD) * FPS) + LEAD + (s.p === "cta" ? 75 : 0);
    const it = { s, from: at, len }; at += len; return it;
  });
};
export const BP2_TOTAL = (() => { const t = timelineBP2(); return t[t.length - 1].from + t[t.length - 1].len; })();

const useIn = (delay = 0, damping = 15) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass: 0.8 } }); };

/* ---------- shared ---------- */
const Backdrop: React.FC<{ hue?: string }> = ({ hue = VIO }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1400, height: 1400, left: -420 + 80 * Math.sin(f / 70), top: -700, borderRadius: "50%", background: `radial-gradient(circle, ${hue}38, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 1200, height: 1200, right: -420, bottom: -640 + 60 * Math.cos(f / 80), borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}22, transparent 62%)` }} />
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${LINE} 1.4px, transparent 1.4px)`, backgroundSize: "36px 36px", opacity: 0.55, maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)" }} />
    </AbsoluteFill>
  );
};

// Big kinetic headline: words rise in one by one.
const Kinetic: React.FC<{ text: string; top?: number; size?: number; accent?: string[]; delay?: number; align?: "center" | "left"; left?: number; width?: number }> =
  ({ text, top = 90, size = 76, accent = [], delay = 2, align = "center", left, width }) => {
    const f = useCurrentFrame();
    const words = text.split(" ");
    return (
      <div style={{ position: "absolute", top, left: left ?? 0, right: left === undefined ? 0 : undefined, width, textAlign: align, padding: "0 80px", fontFamily: BN, fontWeight: 700, fontSize: size, lineHeight: 1.18, color: TXT }}>
        {words.map((w, i) => {
          const k = lerp(f, delay + i * 3, delay + i * 3 + 14);
          const hot = accent.some((a) => w.includes(a));
          return (
            <span key={i} style={{ display: "inline-block", marginRight: "0.28em", opacity: k, transform: `translateY(${(1 - k) * 40}px)`, filter: `blur(${(1 - k) * 8}px)`,
              ...(hot ? { background: GRAD, WebkitBackgroundClip: "text", color: "transparent" } : {}) }}>{w}</span>
          );
        })}
      </div>
    );
  };

// Browser frame with a screenshot; zooms from 1 → zoom toward (fx, fy) in % of the image.
const Screen: React.FC<{ src: string; x: number; y: number; w: number; fx?: number; fy?: number; zoom?: number; zFrom?: number; zTo?: number; delay?: number; tilt?: number; url?: string }> =
  ({ src, x, y, w, fx = 50, fy = 30, zoom = 1.4, zFrom = 20, zTo = 70, delay = 0, tilt = 0, url = "bizpilot-app.dreamithq.com" }) => {
    const f = useCurrentFrame();
    const k = useIn(delay, 16);
    const z = lerp(f, delay + zFrom, delay + zTo, 1, zoom);
    const h = w * 0.625;
    return (
      <div style={{ position: "absolute", left: x, top: y, width: w, opacity: k, transform: `translateY(${(1 - k) * 70}px) perspective(1600px) rotateY(${tilt * (1 - 0.4 * k)}deg) scale(${0.94 + 0.06 * k})`, transformOrigin: "center" }}>
        <div style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${LINE}`, background: CARD, boxShadow: `0 50px 120px rgba(0,0,0,0.6), 0 0 80px ${VIO}22` }}>
          <div style={{ height: 38, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderBottom: `1px solid ${LINE}`, background: "#0E0E17" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: 11, background: c }} />)}
            <span style={{ marginLeft: 14, fontFamily: LAT, fontSize: 15, color: MUTE }}>{url}</span>
          </div>
          <div style={{ height: h, overflow: "hidden" }}>
            <Img src={S("shots/" + src)} style={{ width: "100%", transform: `scale(${z})`, transformOrigin: `${fx}% ${fy}%` }} />
          </div>
        </div>
      </div>
    );
  };

const Phone: React.FC<{ src: string; x: number; y: number; w?: number; delay?: number; rot?: number; scrollTo?: number }> = ({ src, x, y, w = 330, delay = 0, rot = 0, scrollTo = 0 }) => {
  const f = useCurrentFrame();
  const k = useIn(delay, 14);
  const sc = lerp(f, delay + 30, delay + 110, 0, scrollTo);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: 10, borderRadius: 48, background: "#000", border: "2px solid #26263A", boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 60px ${VIO}33`,
      opacity: k, transform: `translateY(${(1 - k) * 120 + Math.sin(f / 22) * 6}px) rotate(${rot}deg)` }}>
      <div style={{ borderRadius: 38, overflow: "hidden", height: w * 2.05 }}>
        <Img src={S("shots/" + src)} style={{ width: "100%", transform: `translateY(${-sc}px)` }} />
      </div>
    </div>
  );
};

const Pill: React.FC<{ children: React.ReactNode; color?: string; k?: number; style?: React.CSSProperties }> = ({ children, color = VIO, k = 1, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 40, background: `${color}22`, border: `1px solid ${color}66`, color: TXT, fontFamily: BN, fontSize: 30, opacity: k, transform: `scale(${0.85 + 0.15 * k})`, ...style }}>{children}</div>
);

const Logo: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <defs><linearGradient id="bpl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={VIO} /><stop offset="1" stopColor="#6D28D9" /></linearGradient></defs>
    <rect width="32" height="32" rx="9" fill="url(#bpl)" />
    <rect x="9" y="8" width="14" height="12" rx="3.5" fill="#fff" />
    <path d="M11 18.5v4.6c0 .6.7.9 1.1.5l4.4-4.1z" fill="#fff" />
    <circle cx="23.5" cy="8.5" r="3" fill={MINT} stroke="#4C1D95" strokeWidth="1.6" />
  </svg>
);

const Toast: React.FC<{ x: number; y: number; title: string; sub: string; delay: number; color?: string }> = ({ x, y, title, sub, delay, color = MINT }) => {
  const k = useIn(delay, 13);
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", borderRadius: 20, background: "rgba(20,20,32,0.92)", border: `1px solid ${LINE}`, boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
      opacity: k, transform: `translateY(${(1 - k) * 30 + Math.sin(f / 18) * 4}px) scale(${0.9 + 0.1 * k})` }}>
      <span style={{ width: 14, height: 14, borderRadius: 14, background: color, boxShadow: `0 0 0 6px ${color}33` }} />
      <div><div style={{ fontFamily: BN, fontSize: 28, color: TXT, fontWeight: 700 }}>{title}</div><div style={{ fontFamily: BODY, fontSize: 21, color: MUTE }}>{sub}</div></div>
    </div>
  );
};

/* ---------- scenes ---------- */
const Hook: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const bub = useIn(28), ai = useIn(100);
  return (
    <AbsoluteFill style={{ background: "#030308" }}>
      <div style={{ position: "absolute", left: 170, top: 300, fontFamily: LAT, fontWeight: 800, fontSize: 190, color: TXT, opacity: lerp(f, 0, 18), letterSpacing: -6 }}>2:00<span style={{ fontSize: 70, color: MUTE, letterSpacing: 0 }}> AM</span></div>
      <div style={{ position: "absolute", left: 180, top: 530, fontFamily: BN, fontSize: 50, color: MUTE, opacity: lerp(f, 10, 28) }}>আপনি ঘুমে… 😴</div>
      <div style={{ position: "absolute", left: 180, top: 640, fontFamily: BN, fontSize: 56, fontWeight: 700, opacity: lerp(f, 120, 140) }}><span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>তবু উত্তর চলে গেল</span></div>
      <div style={{ position: "absolute", left: 1180, top: 70, width: 430, height: 900 }}>
        <Phone src="m-thread.jpg" x={0} y={0} w={400} delay={4} rot={-3} />
      </div>
      <div style={{ position: "absolute", left: 900, top: 330, padding: "18px 26px", borderRadius: 26, background: "#1C1C2A", color: TXT, fontFamily: BODY, fontSize: 34, opacity: bub, transform: `scale(${0.8 + 0.2 * bub})` }}>দাম কত? 🙂</div>
      <Toast x={880} y={790} title="AI উত্তর দিয়েছে" sub="৩ সেকেন্ডে · নিশ্চয়তা ৯২%" delay={100} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 50%, ${VIO}${Math.round(ai * 30).toString(16).padStart(2, "0")}, transparent 60%)`, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const k = useIn(2, 11), w = useIn(14), t = useIn(34);
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", border: `2px solid ${VIO}55`, transform: `scale(${0.3 + 1.2 * lerp(f, 0, 40)})`, opacity: 1 - lerp(f, 20, 60) }} />
        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <div style={{ transform: `scale(${k}) rotate(${(1 - k) * -30}deg)`, filter: `drop-shadow(0 0 60px ${VIO}88)` }}><Logo size={210} /></div>
          <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: 190, color: TXT, letterSpacing: -6, opacity: w, transform: `translateX(${(1 - w) * -50}px)` }}>Biz<span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>pilot</span></div>
        </div>
        <div style={{ position: "absolute", top: 720, fontFamily: BN, fontSize: 54, color: TXT, opacity: t, transform: `translateY(${(1 - t) * 20}px)` }}>আপনার ব্যবসার <b style={{ color: VIO2 }}>AI কর্মী</b> · ২৪ ঘণ্টা</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Connect: React.FC = () => {
  const f = useCurrentFrame();
  const pages = ["রঙ ফ্যাশন", "সেবা ডেন্টাল", "AI University", "Dream Travels"];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Kinetic text="Facebook দিয়ে লগইন, এক মিনিটে কানেক্ট" accent={["Facebook", "এক", "মিনিটে"]} top={70} size={66} />
      <Screen src="channels.jpg" x={160} y={250} w={1080} fx={50} fy={20} zoom={1.25} delay={6} />
      <div style={{ position: "absolute", left: 1300, top: 280, width: 470 }}>
        <div style={{ fontFamily: BN, fontSize: 28, color: MUTE, marginBottom: 16, opacity: lerp(f, 20, 34) }}>কোন পেজ কানেক্ট করবেন?</div>
        {pages.map((p, i) => {
          const k = lerp(f, 26 + i * 8, 40 + i * 8), on = lerp(f, 60 + i * 9, 68 + i * 9);
          return (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", marginBottom: 12, borderRadius: 18, background: CARD, border: `1px solid ${on > 0.5 ? VIO + "88" : LINE}`, opacity: k, transform: `translateX(${(1 - k) * 60}px)` }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, border: `2px solid ${on > 0.5 ? VIO : "#3A3A55"}`, background: on > 0.5 ? VIO : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22 }}>{on > 0.5 ? "✓" : ""}</div>
              <div style={{ fontFamily: BODY, fontSize: 28, color: TXT }}>{p}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Learn: React.FC = () => {
  const f = useCurrentFrame();
  const src = [["📄", "পেজের তথ্য"], ["📝", "পোস্ট ও অফার"], ["🌐", "ওয়েবসাইট"], ["💬", "আগের চ্যাট"], ["❓", "FAQ"]];
  const n = Math.round(lerp(f, 40, 120, 0, 128));
  return (
    <AbsoluteFill>
      <Backdrop hue="#6D28D9" />
      <Kinetic text="AI নিজেই পড়ে, নিজেই শেখে" accent={["পড়ে,", "শেখে"]} top={70} size={70} />
      <Screen src="training.jpg" x={640} y={250} w={1140} fx={45} fy={8} zoom={1.5} delay={4} />
      {src.map(([e, t], i) => {
        const k = lerp(f, 14 + i * 9, 30 + i * 9);
        const fly = lerp(f, 70 + i * 6, 100 + i * 6);
        return (
          <div key={t} style={{ position: "absolute", left: 140 + fly * 380, top: 300 + i * 112 - fly * (i * 112 - 200), opacity: k * (1 - fly * 0.9), transform: `scale(${1 - fly * 0.5})` }}>
            <Pill>{e} {t}</Pill>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 150, top: 840, fontFamily: BN, fontSize: 44, color: TXT, opacity: lerp(f, 40, 55) }}>AI জানে <b style={{ color: MINT }}>{String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d])}</b> অংশ</div>
    </AbsoluteFill>
  );
};

const Reply: React.FC = () => {
  const f = useCurrentFrame();
  const rows: [string, string, string][] = [
    ["বাংলা", "জামদানি শাড়ির দাম কত?", "৳২,৪৫০ আপু, স্টকে আছে 😊"],
    ["Banglish", "dam koto vai? delivery?", "৳1250, Dhaka delivery 60 taka 👍"],
    ["English", "Is it available in XL?", "Yes! XL is in stock. Want to order?"],
  ];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Kinetic text="গ্রাহক যেভাবে লেখেন, সেভাবেই উত্তর" accent={["সেভাবেই"]} top={70} size={66} />
      {rows.map(([lang, q, a], i) => {
        const k = useIn(10 + i * 26), r = useIn(26 + i * 26);
        return (
          <div key={lang} style={{ position: "absolute", left: 220, right: 220, top: 270 + i * 230 }}>
            <div style={{ fontFamily: LAT, fontSize: 20, color: VIO2, letterSpacing: 3, opacity: k, marginBottom: 10 }}>{lang.toUpperCase()}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 30 }}>
              <div style={{ padding: "20px 28px", borderRadius: 26, borderBottomLeftRadius: 6, background: "#1C1C2A", color: TXT, fontFamily: BODY, fontSize: 36, opacity: k, transform: `translateX(${(1 - k) * -60}px)` }}>{q}</div>
              <div style={{ padding: "20px 28px", borderRadius: 26, borderBottomRightRadius: 6, background: `linear-gradient(135deg, #14532D, #166534)`, color: TXT, fontFamily: BODY, fontSize: 36, opacity: r, transform: `translateX(${(1 - r) * 60}px)`, border: `1px solid ${MINT}55` }}>
                <span style={{ fontFamily: LAT, fontSize: 16, color: "#86EFAC", letterSpacing: 2, display: "block", marginBottom: 4 }}>✦ AI</span>{a}
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", fontFamily: BN, fontSize: 26, color: MUTE, opacity: lerp(f, 90, 110) }}>নিশ্চিত না হলে বানিয়ে বলে না · আপনার হাতে দেয়</div>
    </AbsoluteFill>
  );
};

const Auto: React.FC = () => {
  const f = useCurrentFrame();
  const on = lerp(f, 30, 44);
  const pulse = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <AbsoluteFill>
      <Backdrop hue={on > 0.5 ? "#15803D" : VIO} />
      <Kinetic text="এক সুইচে অটো রিপ্লাই" accent={["অটো"]} top={90} size={80} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", top: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40, padding: "40px 56px", borderRadius: 36, background: CARD, border: `1px solid ${on > 0.5 ? MINT + "88" : LINE}`, boxShadow: on > 0.5 ? `0 0 ${60 + 30 * pulse}px ${MINT}44` : "none", transform: `scale(${useIn(4)})` }}>
          <div>
            <div style={{ fontFamily: BN, fontSize: 52, color: TXT, fontWeight: 700 }}>AI অটো রিপ্লাই</div>
            <div style={{ fontFamily: BN, fontSize: 28, color: on > 0.5 ? MINT : MUTE, marginTop: 6 }}>{on > 0.5 ? "● লাইভ — AI নিজেই উত্তর দিচ্ছে" : "শুধু খসড়া"}</div>
          </div>
          <div style={{ width: 180, height: 96, borderRadius: 96, background: on > 0.5 ? MINT : "#2A2A40", position: "relative", transition: "none" }}>
            <div style={{ position: "absolute", top: 8, left: 8 + 84 * on, width: 80, height: 80, borderRadius: 80, background: "#fff", boxShadow: "0 6px 20px rgba(0,0,0,0.4)" }} />
          </div>
        </div>
        <div style={{ marginTop: 50, fontFamily: BN, fontSize: 34, color: MUTE, opacity: lerp(f, 60, 80) }}>নিশ্চিত না হলে? <span style={{ color: AMBER }}>আপনাকে জানায়</span> — কখনো ভুল বলে না</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Inbox: React.FC = () => {
  const f = useCurrentFrame();
  const chips: [string, string][] = [["Messenger", "#0A84FF"], ["কমেন্ট", AMBER], ["ওয়েবসাইট চ্যাট", CYAN]];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Kinetic text="সব কথা, এক ইনবক্সে" accent={["এক"]} top={60} size={72} />
      <Screen src="inbox2.jpg" x={240} y={220} w={1440} fx={30} fy={30} zoom={1.15} delay={4} tilt={-6} />
      <div style={{ position: "absolute", bottom: 50, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
        {chips.map(([t, c], i) => <Pill key={t} color={c} k={lerp(f, 30 + i * 8, 44 + i * 8)}>● {t}</Pill>)}
      </div>
    </AbsoluteFill>
  );
};

const Orders: React.FC = () => {
  const f = useCurrentFrame();
  const inv = useIn(40, 14), fly = lerp(f, 95, 125);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Kinetic text="চ্যাটেই অর্ডার, লোগোসহ ইনভয়েস" accent={["অর্ডার,", "ইনভয়েস"]} top={70} size={66} />
      <Screen src="orders.jpg" x={120} y={260} w={1000} fx={40} fy={20} zoom={1.3} delay={4} />
      <div style={{ position: "absolute", left: 1200, top: 250, width: 540, transform: `translateY(${(1 - inv) * 80}px) rotate(${2 - fly * 6}deg) scale(${1 - fly * 0.15})`, opacity: inv }}>
        <div style={{ background: "#fff", borderRadius: 22, padding: 36, color: "#111827", boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 54, height: 54, borderRadius: 14, background: "linear-gradient(135deg,#B91C1C,#F59E0B)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BN, fontSize: 30 }}>র</div><div style={{ fontFamily: BN, fontSize: 28, fontWeight: 700 }}>রঙ ফ্যাশন</div></div>
            <div style={{ fontFamily: LAT, fontWeight: 800, color: "#B91C1C", fontSize: 22 }}>INVOICE<br /><span style={{ fontSize: 16, color: "#6B7280" }}>INV-1001</span></div>
          </div>
          {[["থ্রি-পিস × ১", "৳১,২৫০"], ["ডেলিভারি (ঢাকা)", "৳৬০"]].map(([a, b]) => <div key={a} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #F3F4F6", fontFamily: BODY, fontSize: 24, marginTop: 6 }}><span>{a}</span><span>{b}</span></div>)}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, fontFamily: BN, fontSize: 30, fontWeight: 700 }}><span>মোট</span><span style={{ color: "#B91C1C" }}>৳১,৩১০</span></div>
        </div>
      </div>
      <Toast x={1260} y={780} title="ইনভয়েস পাঠানো হয়েছে" sub="Messenger · INV-1001.pdf" delay={120} />
    </AbsoluteFill>
  );
};

const Reports: React.FC = () => {
  const f = useCurrentFrame();
  const kpi: [string, number, string][] = [["অর্ডার", 128, ""], ["AI সামলেছে", 72, "%"], ["কনভার্শন", 34, "%"]];
  const bn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Kinetic text="এক নজরে পুরো ব্যবসা" accent={["পুরো"]} top={60} size={72} />
      <Screen src="reports.jpg" x={100} y={230} w={1180} fx={50} fy={10} zoom={1.35} delay={4} />
      <div style={{ position: "absolute", left: 1340, top: 260, width: 440, display: "flex", flexDirection: "column", gap: 18 }}>
        {kpi.map(([l, v, s], i) => {
          const k = useIn(20 + i * 10);
          return (
            <div key={l} style={{ padding: "24px 28px", borderRadius: 22, background: CARD, border: `1px solid ${LINE}`, opacity: k, transform: `translateX(${(1 - k) * 60}px)` }}>
              <div style={{ fontFamily: BN, fontSize: 26, color: MUTE }}>{l}</div>
              <div style={{ fontFamily: BN, fontSize: 64, fontWeight: 700, color: [VIO2, MINT, CYAN][i] }}>{bn(Math.round(lerp(f, 24 + i * 10, 80 + i * 10, 0, v)))}{s}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Grow: React.FC = () => (
  <AbsoluteFill>
    <Backdrop hue="#7C3AED" />
    <Kinetic text="AI বিজ্ঞাপন · ওয়েবসাইট · WooCommerce" accent={["AI", "WooCommerce"]} top={70} size={62} />
    <Screen src="ads.jpg" x={110} y={270} w={860} fx={40} fy={18} zoom={1.4} delay={4} tilt={8} />
    <Screen src="integrations.jpg" x={960} y={330} w={860} fx={50} fy={20} zoom={1.3} delay={16} tilt={-8} />
  </AbsoluteFill>
);

const BIZ = ["🛍️ দোকান", "🩺 ক্লিনিক", "🎓 কোচিং", "🍽️ রেস্টুরেন্ট", "💇 সেলুন", "✈️ ট্রাভেল", "💍 জুয়েলারি", "🏠 রিয়েল এস্টেট", "💻 IT এজেন্সি", "🎂 বেকারি", "💊 ফার্মেসি", "🚗 রেন্ট-এ-কার"];
const Business: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop />
      <Kinetic text="যেকোনো ব্যবসা, যেকোনো পেজ" accent={["যেকোনো"]} top={90} size={80} />
      <div style={{ position: "absolute", left: 180, right: 180, top: 330, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
        {BIZ.map((b, i) => {
          const k = lerp(f, 14 + i * 4, 30 + i * 4);
          return <div key={b} style={{ padding: "30px 0", textAlign: "center", borderRadius: 24, background: CARD, border: `1px solid ${LINE}`, fontFamily: BN, fontSize: 36, color: TXT, opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${0.9 + 0.1 * k})` }}>{b}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Mobile: React.FC = () => {
  const f = useCurrentFrame();
  const a = useIn(60, 12);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Kinetic text="মোবাইল থেকেই সব" accent={["মোবাইল"]} top={110} size={84} align="left" left={60} width={900} />
      <div style={{ position: "absolute", left: 140, top: 330, fontFamily: BN, fontSize: 36, color: MUTE, lineHeight: 1.6, opacity: lerp(f, 20, 40) }}>ইনবক্স · অটো সুইচ · অর্ডার<br />যেখানেই থাকুন</div>
      <div style={{ position: "absolute", left: 140, top: 540, display: "flex", alignItems: "center", gap: 18, padding: "20px 30px", borderRadius: 22, background: "#0E1A12", border: `1px solid ${MINT}66`, opacity: a, transform: `scale(${0.85 + 0.15 * a})` }}>
        <svg width="54" height="54" viewBox="0 0 24 24"><path fill={MINT} d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.86 3.22A11.4 11.4 0 0 0 12 8.12c-1.75 0-3.4.39-4.92 1.02L5.22 5.92a.38.38 0 1 0-.66.38L6.4 9.48A10.7 10.7 0 0 0 1 18h22a10.7 10.7 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" /></svg>
        <div><div style={{ fontFamily: BN, fontSize: 36, color: TXT, fontWeight: 700 }}>Android অ্যাপ</div><div style={{ fontFamily: BN, fontSize: 24, color: MINT }}>আসছে শিগগিরই</div></div>
      </div>
      <Phone src="m-inbox.jpg" x={1000} y={130} w={360} delay={4} rot={-4} scrollTo={120} />
      <Phone src="m-channels.jpg" x={1400} y={190} w={340} delay={14} rot={4} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const k = useIn(2, 12), b = useIn(26, 12);
  const glow = 0.5 + 0.5 * Math.sin(f / 7);
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 34, transform: `scale(${0.9 + 0.1 * k})`, opacity: k }}>
          <Logo size={170} />
          <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: 150, color: TXT, letterSpacing: -5 }}>Biz<span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>pilot</span></div>
        </div>
        <div style={{ fontFamily: BN, fontSize: 54, color: TXT, opacity: lerp(f, 14, 30) }}>আজই ফ্রি শুরু করুন</div>
        <div style={{ padding: "22px 50px", borderRadius: 60, background: `linear-gradient(90deg, ${VIO}, #6D28D9)`, fontFamily: LAT, fontWeight: 700, fontSize: 40, color: "#fff", opacity: b, transform: `scale(${0.85 + 0.15 * b})`, boxShadow: `0 0 ${40 + 30 * glow}px ${VIO}88` }}>bizpilot.dreamithq.com</div>
        <div style={{ fontFamily: BN, fontSize: 34, color: AMBER, opacity: lerp(f, 50, 70) }}>⚡ প্রথম ১০০ ব্যবসা · ৩ মাস একদম ফ্রি</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SCENES: Record<string, React.FC<{ len: number }>> = {
  hook: Hook, intro: Intro, connect: Connect, learn: Learn, reply: Reply, auto: Auto, inbox: Inbox,
  orders: Orders, reports: Reports, grow: Grow, business: Business, mobile: Mobile, cta: Cta,
};
const SFX: Record<string, string> = { intro: "boom", connect: "whoosh", learn: "shimmer", reply: "whoosh", auto: "tick", inbox: "whoosh", orders: "shimmer", reports: "riser", grow: "whoosh", business: "whoosh", mobile: "whoosh", cta: "boom" };

const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const o = Math.min(lerp(f, 0, 8), 1 - lerp(f, len - 7, len));
  const s = 1.02 - 0.02 * lerp(f, 0, 12);
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

export const BizpilotPromo: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const f = useCurrentFrame();
  const music = Math.min(lerp(f, 0, 30, 0, 0.18), lerp(f, durationInFrames - 60, durationInFrames, 0.18, 0));
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("pbmusic.mp3")} volume={() => music} loop />
      {timelineBP2().map(({ s, from, len }) => {
        const Sc = SCENES[s.p];
        return (
          <Sequence key={s.p} from={from} durationInFrames={len}>
            <Fade len={len}><Sc len={len} /></Fade>
            <Sequence from={LEAD}><Audio src={staticFile(`bizpilot2/vo/${s.p}.mp3`)} /></Sequence>
            {SFX[s.p] ? <Audio src={staticFile(`dgsfx/${SFX[s.p]}.mp3`)} volume={0.3} /> : null}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
