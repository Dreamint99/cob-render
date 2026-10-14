// প্রবাসী বন্ধু (probashibondu.online) — promo video. Screens captured from the live site (public/pb, work/pbcap/cap.mjs).
import React from "react";
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random,
} from "remotion";
import { evolvePath, getPointAtLength, getLength, getTangentAtLength } from "@remotion/paths";

// ---------- brand ----------
const C = { bg: "#0a0f0d", panel: "#121a16", green: "#0b5d45", mint: "#3fb68b", gold: "#f2c14e", red: "#e03a3e", text: "#f3f5f2", mute: "#9aa8a0" };
const F = "Anek";
if (typeof document !== "undefined") {
  const f = new FontFace("Anek", `url(${staticFile("fonts/AnekBangla.ttf")})`, { weight: "100 800" });
  f.load().then(() => document.fonts.add(f)).catch(() => {});
}
const bn = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
const fmt = (n: number) => bn(Math.round(n).toLocaleString("en-US"));
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ---------- timeline (30 fps) ----------
export const PB_FPS = 30;
const SCENES = [0, 225, 390, 675, 945, 1200, 1470, 1785, 2025, 2295, 2760];
const VO = [18, 240, 402, 690, 960, 1212, 1485, 1800, 2040, 2310];
const VO_LEN = [178, 139, 245, 242, 230, 242, 281, 221, 252, 218];
export const PB_TOTAL = SCENES[SCENES.length - 1];
const X = 8; // crossfade overlap

// ---------- building blocks ----------
const useSpring = (delay = 0, damping = 16, mass = 0.8) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, mass } });
};

const Backdrop: React.FC<{ hue?: string; dots?: boolean }> = ({ hue = C.green, dots = true }) => {
  const f = useCurrentFrame();
  const a = f / 90;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 700px at ${30 + Math.sin(a) * 8}% ${35 + Math.cos(a) * 8}%, ${hue}cc, transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(600px 500px at ${85 + Math.cos(a * 0.7) * 6}% ${80 + Math.sin(a * 0.8) * 6}%, ${C.red}33, transparent 70%)` }} />
      {dots && <AbsoluteFill style={{ opacity: 0.18, backgroundImage: "radial-gradient(rgba(255,255,255,.55) 1.4px, transparent 1.6px)", backgroundSize: "30px 30px", backgroundPosition: `${-f * 0.3}px 0px`, maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)" }} />}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};

// Scene wrapper: zoom-blur in and out across the cut
const Scene: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, X * 1.5], [0, 1], { ...clamp, easing: ease });
  const out = interpolate(f, [len - X, len + X], [1, 0], clamp);
  const o = Math.min(inn, out);
  const s = interpolate(inn, [0, 1], [1.08, 1]) * interpolate(out, [0, 1], [0.94, 1]);
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${s})`, filter: `blur(${(1 - o) * 14}px)` }}>{children}</AbsoluteFill>;
};

// Word-by-word kinetic text (no letter-spacing: keeps Bangla conjuncts intact)
const Words: React.FC<{ text: string; delay?: number; size?: number; color?: string; weight?: number; stagger?: number; style?: React.CSSProperties; align?: "left" | "center" }> = ({
  text, delay = 0, size = 80, color = C.text, weight = 700, stagger = 4, style, align = "left",
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: F, fontSize: size, fontWeight: weight, color, lineHeight: 1.25, display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", wordSpacing: "0.05em", ...style }}>
      {text.split(" ").map((w, i) => {
        const s = spring({ frame: f - delay - i * stagger, fps, config: { damping: 14, mass: 0.7 } });
        return (
          <span key={i} style={{ display: "inline-block", marginRight: size * 0.26, opacity: s, transform: `translateY(${(1 - s) * size * 0.7}px)`, filter: `blur(${(1 - s) * 8}px)` }}>{w}</span>
        );
      })}
    </div>
  );
};

const Pill: React.FC<{ children: React.ReactNode; delay?: number; color?: string; bg?: string; size?: number; dot?: string }> = ({ children, delay = 0, color = C.text, bg = "rgba(255,255,255,.08)", size = 30, dot }) => {
  const s = useSpring(delay, 13, 0.6);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: `${size * 0.35}px ${size * 0.8}px`, borderRadius: 999, background: bg, border: "1.5px solid rgba(255,255,255,.14)", backdropFilter: "blur(8px)", fontFamily: F, fontWeight: 600, fontSize: size, color, transform: `scale(${s})`, opacity: Math.min(1, s * 1.5), whiteSpace: "nowrap" }}>
      {dot && <span style={{ width: size * 0.38, height: size * 0.38, borderRadius: 99, background: dot, boxShadow: `0 0 12px ${dot}` }} />}
      {children}
    </div>
  );
};

const Browser: React.FC<{ src: string; w: number; h: number; imgW: number; scroll?: number; url?: string }> = ({ src, w, h, imgW, scroll = 0, url = "probashibondu.online" }) => (
  <div style={{ width: w, height: h, borderRadius: 22, overflow: "hidden", background: "#0e1411", boxShadow: "0 60px 120px rgba(0,0,0,.65), 0 0 0 1.5px rgba(255,255,255,.12)" }}>
    <div style={{ height: 52, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: "#1a221e", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: 99, background: c }} />)}
      <div style={{ marginLeft: 24, flex: 1, maxWidth: 560, height: 32, borderRadius: 10, background: "#0e1411", display: "flex", alignItems: "center", gap: 10, padding: "0 16px", fontFamily: "Montserrat", fontSize: 17, color: "#cfd8d2" }}>
        <svg width="14" height="14" viewBox="0 0 24 24"><path fill={C.mint} d="M12 1a5 5 0 0 0-5 5v4H5v13h14V10h-2V6a5 5 0 0 0-5-5zm-3 9V6a3 3 0 1 1 6 0v4z" /></svg>
        {url}
      </div>
    </div>
    <div style={{ height: h - 52, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: imgW, transform: `translateY(${-scroll}px)` }} />
    </div>
  </div>
);

const Phone: React.FC<{ src: string; w?: number; scroll?: number }> = ({ src, w = 400, scroll = 0 }) => {
  const h = w * 2.08;
  return (
    <div style={{ width: w, height: h, borderRadius: w * 0.14, padding: w * 0.032, background: "linear-gradient(145deg,#2c3631,#0b0f0d)", boxShadow: "0 60px 120px rgba(0,0,0,.7), 0 0 0 2px rgba(255,255,255,.15)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: w * 0.115, overflow: "hidden", background: "#000" }}>
        <Img src={staticFile(src)} style={{ width: "100%", transform: `translateY(${-scroll}px)` }} />
        <div style={{ position: "absolute", top: w * 0.03, left: "50%", width: w * 0.3, height: w * 0.075, marginLeft: -w * 0.15, borderRadius: 99, background: "#000" }} />
      </div>
    </div>
  );
};

const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 0.5 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={150}><Audio src={staticFile(`pbsfx/${src}.mp3`)} volume={vol} /></Sequence>
);

const Icon: React.FC<{ d: string; size?: number; color?: string }> = ({ d, size = 40, color = C.text }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const IC = {
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  palette: "M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A5.6 5.6 0 0 0 23 9.8C23 5.5 18 2 12 2zM6.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z",
  share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  gift: "M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
  pen: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
};

// ---------- S1: hook — flights leaving Dhaka ----------
const DHAKA: [number, number] = [1374, 585];
const DESTS: [number, number][] = [[965, 577], [443, 444], [679, 381], [750, 451], [1480, 778], [1105, 600]];
const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 225], [1.15, 1.32]);
  const daysVal = interpolate(f, [120, 190], [0, 3530], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${DHAKA[0]}px ${DHAKA[1]}px` }}>
        <Img src={staticFile("pb/map.jpg")} style={{ position: "absolute", top: 140, left: 0, width: 1920, filter: "brightness(.55) saturate(.8)" }} />
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <defs><filter id="glow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
          {DESTS.map(([x, y], i) => {
            const mx = (DHAKA[0] + x) / 2, my = (DHAKA[1] + y) / 2 - Math.hypot(DHAKA[0] - x, DHAKA[1] - y) * 0.35;
            const d = `M ${DHAKA[0]} ${DHAKA[1]} Q ${mx} ${my} ${x} ${y}`;
            const p = interpolate(f, [10 + i * 14, 70 + i * 14], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
            const ev = evolvePath(p, d);
            const L = getLength(d);
            const pt = getPointAtLength(d, Math.max(0.1, p * L));
            const tg = getTangentAtLength(d, Math.max(0.1, p * L));
            const ang = (Math.atan2(tg.y, tg.x) * 180) / Math.PI;
            return (
              <g key={i}>
                <path d={d} stroke={i === 0 ? C.gold : "#ffffffaa"} strokeWidth={i === 0 ? 4 : 2.5} fill="none" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} filter="url(#glow)" />
                {p > 0 && p < 1 && <text x={pt.x} y={pt.y} fontSize={30} fill="white" textAnchor="middle" dominantBaseline="central" transform={`rotate(${ang + 45} ${pt.x} ${pt.y})`}>✈</text>}
                {p >= 1 && <circle cx={x} cy={y} r={7 + Math.sin(f / 6 + i) * 2} fill={i === 0 ? C.gold : C.mint} filter="url(#glow)" />}
              </g>
            );
          })}
          <circle cx={DHAKA[0]} cy={DHAKA[1]} r={10} fill={C.red} filter="url(#glow)" />
          <circle cx={DHAKA[0]} cy={DHAKA[1]} r={10 + ((f * 0.8) % 40)} fill="none" stroke={C.red} strokeWidth={2} opacity={1 - ((f * 0.8) % 40) / 40} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,15,13,.92) 0%, rgba(10,15,13,.55) 45%, transparent 70%)" }} />
      <AbsoluteFill style={{ padding: "0 140px", justifyContent: "center" }}>
        <Words text="দেশ ছেড়েছেন" delay={14} size={130} weight={800} />
        <Words text="কতদিন?" delay={40} size={190} weight={800} color={C.gold} style={{ marginTop: -20 }} />
        <div style={{ display: "flex", gap: 18, marginTop: 40 }}>
          {["দিন", "মাস", "বছর"].map((t, i) => <Pill key={t} delay={78 + i * 9} size={34} dot={[C.red, C.gold, C.mint][i]}>{t}</Pill>)}
        </div>
        <div style={{ marginTop: 40, fontFamily: F, fontWeight: 800, fontSize: 120, color: C.text, opacity: interpolate(f, [118, 130], [0, 1], clamp), fontVariantNumeric: "tabular-nums" }}>
          {fmt(daysVal)} <span style={{ fontSize: 54, color: C.mute }}>দিন?</span>
        </div>
      </AbsoluteFill>
      <Sfx at={8} src="plane" vol={0.35} />
      <Sfx at={40} src="hit" vol={0.45} />
      <Sfx at={118} src="tick" vol={0.3} />
      <Sfx at={195} src="riser" vol={0.4} />
    </AbsoluteFill>
  );
};

// ---------- S2: brand reveal ----------
const S2Brand: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(6, 11, 0.9);
  const sweep = interpolate(f, [24, 60], [-40, 140], clamp);
  return (
    <AbsoluteFill>
      <Backdrop />
      {[0, 1, 2].map((i) => {
        const r = interpolate((f + i * 25) % 75, [0, 75], [180, 900]);
        return <AbsoluteFill key={i} style={{ justifyContent: "center", alignItems: "center" }}><div style={{ width: r, height: r, borderRadius: 9999, border: `2px solid ${C.mint}`, opacity: interpolate(r, [180, 900], [0.5, 0]), transform: "translateY(-90px)" }} /></AbsoluteFill>;
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ position: "relative", width: 260, height: 260, borderRadius: 62, overflow: "hidden", transform: `scale(${s}) rotate(${(1 - s) * -25}deg)`, boxShadow: `0 30px 90px ${C.green}, 0 0 0 2px rgba(255,255,255,.15)` }}>
          <Img src={staticFile("pb/icon-512.png")} style={{ width: "100%" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, transparent ${sweep - 20}%, rgba(255,255,255,.55) ${sweep}%, transparent ${sweep + 20}%)` }} />
        </div>
        <Words text="প্রবাসী বন্ধু" delay={22} size={150} weight={800} align="center" style={{ marginTop: 34 }} />
        <div style={{ marginTop: 14 }}><Pill delay={44} size={36} dot={C.red}>সকল রেমিট্যান্স যোদ্ধাদের জন্য</Pill></div>
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 14, opacity: interpolate(f, [70, 85], [0, 1], clamp), fontFamily: "Montserrat", fontSize: 22, color: C.mute }}>
          A concern by <Img src={staticFile("pb/dream-logo.png")} style={{ height: 40 }} />
        </div>
      </AbsoluteFill>
      <Sfx at={4} src="shimmer" vol={0.5} />
      <Sfx at={22} src="hit" vol={0.35} />
    </AbsoluteFill>
  );
};

// ---------- S3: website hero ----------
const S3Hero: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0, 18, 1);
  const zoom = interpolate(f, [0, 285], [1, 1.12]);
  const secs = 17 * 3600 + 7 * 60 + 5 + Math.floor(f / 30);
  const clock = [Math.floor(secs / 3600), Math.floor(secs / 60) % 60, secs % 60].map((n) => bn(String(n).padStart(2, "0"))).join(":");
  const tags: [string, number, string][] = [["প্রতিটা দিন", 72, C.gold], ["প্রতিটা ঈদ", 112, C.mint], ["প্রতিটা কিলোমিটার", 140, C.red]];
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", perspective: 2200 }}>
        <div style={{ transform: `translateX(300px) translateY(${(1 - s) * 500}px) rotateX(${(1 - s) * 30}deg) scale(${zoom})` }}>
          <Browser src="pb/d-hero.jpg" w={1500} h={990} imgW={1500} />
        </div>
      </AbsoluteFill>
      {tags.map(([t, d, c], i) => (
        <div key={t} style={{ position: "absolute", left: 70, top: 330 + i * 130 }}>
          <Pill delay={d} size={44} bg="rgba(10,15,13,.82)" dot={c}>{t}</Pill>
        </div>
      ))}
      <div style={{ position: "absolute", right: 120, bottom: 110, transform: `scale(${useSpring(40, 12)})` }}>
        <div style={{ padding: "22px 34px", borderRadius: 26, background: "rgba(10,15,13,.9)", border: `2px solid ${C.mint}66`, boxShadow: "0 30px 60px rgba(0,0,0,.6)", fontFamily: F }}>
          <div style={{ fontSize: 26, color: C.mute, display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 12, height: 12, borderRadius: 9, background: C.red, opacity: f % 30 < 15 ? 1 : 0.3 }} />প্রবাস ঘড়ি চলছে</div>
          <div style={{ fontSize: 64, fontWeight: 800, color: C.gold }}>৩,৫৩০ <span style={{ fontSize: 34, color: C.text }}>দিন</span> <span style={{ fontSize: 44, color: C.text, fontVariantNumeric: "tabular-nums" }}>{clock}</span></div>
        </div>
      </div>
      {tags.map(([, d]) => <Sfx key={d} at={d} src="pop" vol={0.4} />)}
    </AbsoluteFill>
  );
};

// ---------- S4: 3 steps, 30 seconds ----------
const S4Steps: React.FC = () => {
  const f = useCurrentFrame();
  const scroll = interpolate(f, [30, 230], [0, 770], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const ring = interpolate(f, [10, 120], [0, 1], { ...clamp, easing: ease });
  const steps: [string, string, string, string, number][] = [
    ["০১", "তথ্য দিন", "নাম, ছবি, জেলা, দেশ আর তারিখ", IC.user, 110],
    ["০২", "ডিজাইন বাছুন", "১৬টা কার্ড · পোস্ট বা স্টোরি", IC.palette, 150],
    ["০৩", "ডাউনলোড ও শেয়ার", "ছবি বা ভিডিও, এক ট্যাপে", IC.share, 185],
  ];
  const active = f < 150 ? 0 : f < 185 ? 1 : 2;
  return (
    <AbsoluteFill>
      <Backdrop hue="#0b4d3a" />
      <div style={{ position: "absolute", left: 110, top: 110 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <svg width={190} height={190} viewBox="0 0 200 200">
            <circle cx={100} cy={100} r={86} stroke="rgba(255,255,255,.1)" strokeWidth={14} fill="none" />
            <circle cx={100} cy={100} r={86} stroke={C.gold} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={540} strokeDashoffset={540 * (1 - ring)} transform="rotate(-90 100 100)" />
            <text x={100} y={112} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={78} fill={C.text}>{bn(Math.round(ring * 30))}</text>
          </svg>
          <div>
            <Words text="সেকেন্ডেই" delay={8} size={64} color={C.gold} weight={800} />
            <Words text="আপনার কার্ড" delay={16} size={84} weight={800} />
          </div>
        </div>
        <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 26 }}>
          {steps.map(([n, t, sub, ic, d], i) => {
            const s = spring({ frame: f - d + 40, fps: 30, config: { damping: 15 } });
            const on = i === active && f > 100;
            return (
              <div key={n} style={{ width: 620, display: "flex", alignItems: "center", gap: 26, padding: "26px 30px", borderRadius: 26, background: on ? "rgba(63,182,139,.18)" : "rgba(255,255,255,.05)", border: `2px solid ${on ? C.mint : "rgba(255,255,255,.1)"}`, transform: `translateX(${(1 - s) * -200}px) scale(${on ? 1.04 : 1})`, opacity: s, boxShadow: on ? `0 0 40px ${C.mint}44` : "none" }}>
                <div style={{ width: 82, height: 82, borderRadius: 22, background: on ? C.mint : "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={ic} size={42} color={on ? "#06231a" : C.text} /></div>
                <div style={{ fontFamily: F }}>
                  <div style={{ fontSize: 24, color: C.mint, fontWeight: 700 }}>ধাপ {n}</div>
                  <div style={{ fontSize: 46, color: C.text, fontWeight: 800, lineHeight: 1.15 }}>{t}</div>
                  <div style={{ fontSize: 26, color: C.mute }}>{sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", right: 90, top: 90, transform: `perspective(2000px) rotateY(${interpolate(useSpring(0, 20), [0, 1], [-35, -8])}deg)`, transformOrigin: "right center" }}>
        <Browser src="pb/d-make.jpg" w={1000} h={900} imgW={1000} scroll={scroll} url="probashibondu.online/#make" />
      </div>
      {steps.map(([, , , , d]) => <Sfx key={d} at={d} src="click" vol={0.5} />)}
      <Sfx at={10} src="tick" vol={0.25} />
    </AbsoluteFill>
  );
};

// ---------- S5: 16 card designs carousel ----------
const CARDS = ["night", "news", "rickshaw", "eid", "chat", "medal", "remit", "wrapped", "album", "call", "pass", "minimal", "passport", "letter", "calendar", "map"];
const S5Cards: React.FC = () => {
  const f = useCurrentFrame();
  const enter = useSpring(0, 20, 1.2);
  const rot = f * 0.55 + (1 - enter) * 120;
  const R = 1150;
  return (
    <AbsoluteFill>
      <Backdrop hue="#14543f" />
      <AbsoluteFill style={{ perspective: 2600, justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", width: 430, height: 538, transformStyle: "preserve-3d", transform: `translateZ(${-R}px) translateY(60px) rotateX(-6deg) rotateY(${-rot}deg)` }}>
          {CARDS.map((c, i) => {
            const a = (i * 360) / CARDS.length;
            const rel = (((a - rot) % 360) + 540) % 360 - 180; // 0 = facing camera
            const front = Math.cos((rel * Math.PI) / 180);
            return (
              <div key={c} style={{ position: "absolute", inset: 0, transform: `rotateY(${a}deg) translateZ(${R}px)`, backfaceVisibility: "hidden", borderRadius: 22, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.6)", filter: `brightness(${0.45 + 0.55 * Math.max(0, front)})`, opacity: enter }}>
                <Img src={staticFile(`pb/cards/${c}.jpg`)} style={{ width: "100%", height: "100%" }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 60 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <Words text="১৬টি" delay={6} size={150} weight={800} color={C.gold} />
          <Words text="কার্ড ডিজাইন" delay={12} size={96} weight={800} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 60 }}>
        <div style={{ display: "flex", gap: 20 }}>
          <Pill delay={60} size={34} dot={C.gold}>ছবি ও ভিডিও</Pill>
          <Pill delay={80} size={34} dot={C.mint}>পোস্ট ৪:৫</Pill>
          <Pill delay={100} size={34} dot={C.red}>স্টোরি ৯:১৬</Pill>
          <Pill delay={175} size={34} bg={C.mint} color="#06231a">মা-বাবাকে পাঠান ❤</Pill>
        </div>
      </AbsoluteFill>
      <Sfx at={0} src="cards" vol={0.5} />
      <Sfx at={6} src="hit" vol={0.35} />
      {[60, 80, 100, 175].map((d) => <Sfx key={d} at={d} src="pop" vol={0.35} />)}
    </AbsoluteFill>
  );
};

// ---------- S6: dashboard — your life abroad in numbers ----------
const STATS: [number, string, string][] = [
  [3530, "দিন", "প্রবাসে"], [84737, "ঘণ্টা", "দেশের বাইরে"], [20, "ঈদ", "পরিবার ছাড়া"],
  [10590, "বেলা", "মায়ের রান্না ছাড়া"], [4499, "কিমি", "দূরে বাড়ি"], [10, "বছর", "পূর্ণ হবে ২০২৭-এ"],
];
const S6Stats: React.FC = () => {
  const f = useCurrentFrame();
  const m = useSpring(10, 18);
  return (
    <AbsoluteFill>
      <Backdrop hue="#0d3d2f" />
      <div style={{ position: "absolute", left: 110, top: 80 }}>
        <Pill delay={0} size={28} dot={C.red}>আপনার যাত্রাপথ</Pill>
        <Words text="সংখ্যায় আপনার প্রবাস" delay={6} size={78} weight={800} style={{ marginTop: 16 }} />
        <Words text="কুমিল্লা ✈ সৌদি আরব" delay={22} size={38} weight={500} color={C.mute} />
      </div>
      <div style={{ position: "absolute", left: 110, top: 400, width: 820, borderRadius: 26, overflow: "hidden", border: "1.5px solid rgba(255,255,255,.12)", transform: `translateY(${(1 - m) * 80}px)`, opacity: m, boxShadow: "0 40px 80px rgba(0,0,0,.5)" }}>
        <Img src={staticFile("pb/route.jpg")} style={{ width: "100%", display: "block" }} />
        <div style={{ position: "absolute", left: "77%", top: "56%", width: 30, height: 30, marginLeft: -15, marginTop: -15, borderRadius: 99, border: `3px solid ${C.red}`, transform: `scale(${1 + ((f % 40) / 40) * 2.5})`, opacity: 1 - (f % 40) / 40 }} />
      </div>
      <div style={{ position: "absolute", left: 110, top: 790, width: 820, display: "flex", gap: 16 }}>
        {[["বাংলাদেশে এখন", "বিকাল ৫:০৬"], ["প্রবাসে এখন", "দুপুর ২:০৬"]].map(([a, b], i) => (
          <div key={a} style={{ flex: 1, padding: "20px 26px", borderRadius: 22, background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.1)", fontFamily: F, opacity: interpolate(f, [40 + i * 10, 55 + i * 10], [0, 1], clamp) }}>
            <div style={{ fontSize: 24, color: C.mute }}>{a}</div><div style={{ fontSize: 46, fontWeight: 800, color: C.text }}>{b}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 100, top: 160, width: 820, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {STATS.map(([n, unit, label], i) => {
          const d = 30 + i * 14;
          const s = spring({ frame: f - d, fps: 30, config: { damping: 14 } });
          const v = interpolate(f, [d, d + 50], [0, n], { ...clamp, easing: ease });
          const hi = i === 0;
          return (
            <div key={label} style={{ position: "relative", overflow: "hidden", padding: "30px 32px", borderRadius: 26, background: hi ? `linear-gradient(135deg, ${C.green}, #062a20)` : "rgba(255,255,255,.05)", border: `1.5px solid ${hi ? C.mint + "88" : "rgba(255,255,255,.1)"}`, transform: `scale(${0.8 + 0.2 * s}) translateY(${(1 - s) * 60}px)`, opacity: s, fontFamily: F }}>
              {hi && <div style={{ position: "absolute", right: -60, top: -60, width: 170, height: 170, borderRadius: 999, background: C.red, opacity: 0.85 }} />}
              <div style={{ position: "relative", fontSize: 78, fontWeight: 800, color: hi ? C.gold : C.text, lineHeight: 1.05, fontVariantNumeric: "tabular-nums" }}>{fmt(v)} <span style={{ fontSize: 34, color: hi ? C.text : C.mint }}>{unit}</span></div>
              <div style={{ position: "relative", fontSize: 28, color: C.mute, marginTop: 6 }}>{label}</div>
            </div>
          );
        })}
      </div>
      <Sfx at={30} src="tick" vol={0.3} />
      <Sfx at={90} src="tick" vol={0.25} />
    </AbsoluteFill>
  );
};

// ---------- S7: country guides — departures board + devices ----------
const DEPS: [string, string, string][] = [["RUH", "সৌদি আরব", "০৯:৪৫"], ["DOH", "কাতার", "১০:২০"], ["DXB", "সংযুক্ত আরব আমিরাত", "১১:০৫"], ["KUL", "মালয়েশিয়া", "১২:৪০"], ["FCO", "ইতালি", "১৪:১০"], ["LIS", "পর্তুগাল", "১৬:৩০"]];
const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const Flap: React.FC<{ ch: string; settle: number }> = ({ ch, settle }) => {
  const f = useCurrentFrame();
  const c = f < settle ? ABC[Math.floor(random(`${ch}${f}${settle}`) * 26)] : ch;
  return <span style={{ display: "inline-flex", width: 58, height: 76, margin: 3, borderRadius: 8, background: "#1c1f1d", color: C.gold, alignItems: "center", justifyContent: "center", fontFamily: "Montserrat", fontWeight: 800, fontSize: 48, boxShadow: "inset 0 -38px 0 rgba(0,0,0,.25)" }}>{c}</span>;
};
const S7Guide: React.FC = () => {
  const f = useCurrentFrame();
  const board = interpolate(f, [120, 140], [1, 0], clamp);
  const dev = useSpring(125, 18);
  const ph = useSpring(140, 16);
  const scroll = interpolate(f, [150, 320], [0, 2600], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <Backdrop hue="#123d33" />
      {board > 0 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: board, transform: `scale(${1 + (1 - board) * 0.2})` }}>
          <div style={{ padding: "40px 54px", borderRadius: 30, background: "#0d100e", border: "2px solid rgba(255,255,255,.1)", boxShadow: "0 40px 100px rgba(0,0,0,.7)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Montserrat", fontWeight: 800, fontSize: 30, color: C.mute, marginBottom: 20 }}>
              <span>✈ DEPARTURES · DAC</span><span style={{ fontFamily: F, color: C.text }}>প্রবাসে যাবেন?</span>
            </div>
            {DEPS.map(([code, name, t], i) => (
              <div key={code} style={{ display: "flex", alignItems: "center", gap: 30, padding: "6px 0", borderTop: "1px solid rgba(255,255,255,.06)" }}>
                <div>{[...code].map((ch, j) => <Flap key={j} ch={ch} settle={12 + i * 8 + j * 4} />)}</div>
                <div style={{ width: 520, fontFamily: F, fontSize: 44, fontWeight: 700, color: C.text, opacity: interpolate(f, [20 + i * 8, 30 + i * 8], [0, 1], clamp) }}>{name}</div>
                <div style={{ fontFamily: F, fontSize: 36, color: C.mute, width: 120 }}>{t}</div>
                <div style={{ padding: "8px 20px", borderRadius: 12, background: C.mint, color: "#06231a", fontFamily: F, fontWeight: 700, fontSize: 28, opacity: interpolate(f, [34 + i * 8, 40 + i * 8], [0, 1], clamp) }}>গাইড দেখুন</div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}
      {f > 115 && (
        <>
          <div style={{ position: "absolute", left: 90, top: 150, opacity: dev, transform: `perspective(2000px) rotateY(${12 * dev}deg) translateX(${(1 - dev) * -300}px)`, transformOrigin: "left center" }}>
            <Browser src="pb/d-guide-top.jpg" w={1250} h={830} imgW={1250} url="probashibondu.online/guide" />
          </div>
          <div style={{ position: "absolute", right: 130, top: 90, transform: `translateY(${(1 - ph) * 900}px) rotate(4deg)` }}>
            <Phone src="pb/m-guide.jpg" w={420} scroll={scroll} />
          </div>
          <div style={{ position: "absolute", left: 90, bottom: 50, display: "flex", gap: 18 }}>
            <Pill delay={160} size={32} dot={C.mint}>১৪টি দেশের গাইড</Pill>
            <Pill delay={190} size={32} dot={C.red}>লাইভ সময় ও আবহাওয়া</Pill>
            <Pill delay={230} size={32} dot={C.gold}>ফোনে রাখার PDF</Pill>
          </div>
        </>
      )}
      <Sfx at={10} src="tick" vol={0.35} />
      <Sfx at={118} src="whoosh" vol={0.5} />
      {[160, 190, 230].map((d) => <Sfx key={d} at={d} src="pop" vol={0.35} />)}
    </AbsoluteFill>
  );
};

// ---------- S8: probashi golpo ----------
const STORIES: [string, string, string][] = [["ঘামের টাকায় ভাইয়ের ডাক্তারি", "মুন্সীগঞ্জ → সিঙ্গাপুর", "স্বপ্ন"], ["মেয়ের প্রথম \"আব্বু\" ডাক", "ব্রাহ্মণবাড়িয়া → কাতার", "পরিবার"], ["আব্বার জানাজায় থাকতে পারিনি", "সিলেট → যুক্তরাজ্য", "পরিবার"]];
const S8Golpo: React.FC = () => {
  const f = useCurrentFrame();
  const scroll = interpolate(f, [20, 240], [0, 700], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const b = useSpring(0, 20);
  return (
    <AbsoluteFill>
      <Backdrop hue="#2a3d16" />
      <div style={{ position: "absolute", left: 80, top: 120, transform: `perspective(2000px) rotateY(${interpolate(b, [0, 1], [-30, -10])}deg) scale(${0.85 + 0.15 * b})`, transformOrigin: "left center", opacity: b }}>
        <Browser src="pb/d-golpo.jpg" w={1080} h={840} imgW={1080} scroll={scroll} url="probashibondu.online/probashi-golpo" />
      </div>
      <div style={{ position: "absolute", right: 100, top: 110, width: 720 }}>
        <Words text="প্রবাসী গল্প" delay={4} size={110} weight={800} />
        <Words text="প্রবাসীদের নিজের কলমে" delay={14} size={40} weight={500} color={C.mute} />
        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 20 }}>
          {STORIES.map(([t, r, tag], i) => {
            const s = spring({ frame: f - 40 - i * 22, fps: 30, config: { damping: 15 } });
            return (
              <div key={t} style={{ padding: "22px 28px", borderRadius: 22, background: "rgba(246,242,234,.97)", color: "#1b1b1b", fontFamily: F, transform: `translateX(${(1 - s) * 400}px) rotate(${(i - 1) * 1.2}deg)`, opacity: s, boxShadow: "0 24px 50px rgba(0,0,0,.45)" }}>
                <div style={{ display: "flex", gap: 10, fontSize: 22 }}><span style={{ padding: "2px 12px", borderRadius: 99, background: "#f3d9de", color: "#b0243c", fontWeight: 700 }}>{tag}</span><span style={{ color: "#6a6a6a" }}>{r}</span></div>
                <div style={{ fontSize: 40, fontWeight: 800, marginTop: 6 }}>{t}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 34, transform: `scale(${useSpring(150, 10) * (1 + Math.sin(f / 5) * 0.03)})` }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "20px 36px", borderRadius: 20, background: C.mint, color: "#06231a", fontFamily: F, fontWeight: 800, fontSize: 40 }}><Icon d={IC.pen} size={36} color="#06231a" />আপনার গল্প লিখুন</div>
        </div>
      </div>
      {[40, 62, 84].map((d) => <Sfx key={d} at={d} src="whoosh" vol={0.3} />)}
      <Sfx at={150} src="click" vol={0.5} />
    </AbsoluteFill>
  );
};

// ---------- S9: upcoming app ----------
const FEATS: [string, string][] = [["রেমিট্যান্স রেট", C.gold], ["ভিসা রিমাইন্ডার", C.mint], ["ডকুমেন্ট ভল্ট", "#7aa7ff"], ["দূতাবাস হেল্পলাইন", C.mint], ["নামাজের সময়", C.gold], ["জরুরি SOS", C.red]];
const S9App: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(10, 16);
  return (
    <AbsoluteFill>
      <Backdrop hue="#0b5d45" />
      <div style={{ position: "absolute", left: 110, top: 150 }}>
        <Pill delay={0} size={30} dot={C.red}>শীঘ্রই আসছে · Android ও iPhone</Pill>
        <Words text="এক অ্যাপে" delay={8} size={140} weight={800} style={{ marginTop: 20 }} />
        <Words text="প্রবাসীর সব" delay={18} size={140} weight={800} color={C.mint} style={{ marginTop: -20 }} />
        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, width: 820 }}>
          {FEATS.map(([t, c], i) => <div key={t}><Pill delay={70 + i * 16} size={34} dot={c}>{t}</Pill></div>)}
        </div>
      </div>
      <div style={{ position: "absolute", right: 70, top: 120, width: 900, height: 784, borderRadius: 40, overflow: "hidden", transform: `translateY(${(1 - p) * 600}px) translateY(${Math.sin(f / 25) * 10}px) scale(${0.9 + 0.1 * p})`, opacity: p, maskImage: "radial-gradient(ellipse 60% 62% at center, black 70%, transparent 100%)" }}>
        <Img src={staticFile("pb/phones.jpg")} style={{ width: "100%" }} />
      </div>
      {FEATS.map((_, i) => <Sfx key={i} at={70 + i * 16} src="pop" vol={0.3} />)}
      <Sfx at={8} src="hit" vol={0.3} />
    </AbsoluteFill>
  );
};

// ---------- S10: CTA + credits ----------
const URL = "probashibondu.online";
const S10End: React.FC = () => {
  const f = useCurrentFrame();
  const typed = URL.slice(0, Math.floor(interpolate(f, [110, 160], [0, URL.length], clamp)));
  const credits = interpolate(f, [235, 255], [0, 1], clamp);
  const cta = 1 - credits;
  const btn = useSpring(170, 10);
  return (
    <AbsoluteFill>
      <Backdrop />
      {cta > 0 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", opacity: cta, transform: `scale(${1 + credits * 0.1})` }}>
          <div style={{ display: "flex", gap: 30 }}>
            {[["ছবি কোথাও আপলোড হয় না", IC.shield, 8], ["সম্পূর্ণ ফ্রি", IC.gift, 60]].map(([t, ic, d]) => {
              const s = spring({ frame: f - (d as number), fps: 30, config: { damping: 12 } });
              return (
                <div key={t as string} style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 36px", borderRadius: 24, background: "rgba(255,255,255,.06)", border: "1.5px solid rgba(255,255,255,.14)", transform: `scale(${s})`, fontFamily: F, fontWeight: 700, fontSize: 44, color: C.text }}>
                  <Icon d={ic as string} size={48} color={C.mint} />{t as string}
                </div>
              );
            })}
          </div>
          <Words text="আজই ভিজিট করুন" delay={100} size={70} weight={700} color={C.mute} align="center" style={{ marginTop: 70 }} />
          <div style={{ marginTop: 10, padding: "22px 50px", borderRadius: 28, background: "rgba(10,15,13,.8)", border: `2.5px solid ${C.mint}`, boxShadow: `0 0 70px ${C.mint}55`, fontFamily: "Montserrat", fontWeight: 800, fontSize: 96, color: C.text, opacity: interpolate(f, [104, 112], [0, 1], clamp), minWidth: 400, textAlign: "center" }}>
            {typed}<span style={{ color: C.gold, opacity: f % 20 < 10 ? 1 : 0 }}>|</span>
          </div>
          <div style={{ marginTop: 40, transform: `scale(${btn})` }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "20px 44px", borderRadius: 999, background: C.text, color: "#0a0f0d", fontFamily: F, fontWeight: 800, fontSize: 44 }}>
              এখনই কার্ড বানান <span style={{ width: 60, height: 60, borderRadius: 99, background: C.green, color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>→</span>
            </div>
          </div>
        </AbsoluteFill>
      )}
      {credits > 0 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", opacity: credits }}>
          <Img src={staticFile("pb/icon-512.png")} style={{ width: 150, borderRadius: 36, boxShadow: `0 20px 60px ${C.green}` }} />
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 110, color: C.text, marginTop: 16 }}>প্রবাসী বন্ধু</div>
          <Words text="যাদের ঘামে চলে দেশ, তাদের প্রতি শ্রদ্ধা" delay={250} size={46} weight={500} color={C.gold} align="center" />
          <div style={{ marginTop: 50, display: "flex", gap: 90, fontFamily: F, textAlign: "center", opacity: interpolate(f, [275, 295], [0, 1], clamp) }}>
            <div><div style={{ fontSize: 28, color: C.mute }}>তৈরি করেছেন</div><div style={{ fontSize: 46, fontWeight: 700, color: C.text }}>কাশিম উদ্দিন মাছুম</div></div>
            <div style={{ width: 2, background: "rgba(255,255,255,.15)" }} />
            <div><div style={{ fontSize: 28, color: C.mute }}>সার্বিক সহযোগিতায়</div><div style={{ fontSize: 46, fontWeight: 700, color: C.text }}>ড্রিম ইন্টারন্যাশনাল</div></div>
          </div>
          <div style={{ marginTop: 50, display: "flex", alignItems: "center", gap: 40, opacity: interpolate(f, [300, 320], [0, 1], clamp) }}>
            <div style={{ fontFamily: "Montserrat", fontWeight: 700, fontSize: 40, color: C.mint }}>www.{URL}</div>
            <Img src={staticFile("pb/dream-logo.png")} style={{ height: 56 }} />
          </div>
        </AbsoluteFill>
      )}
      <Sfx at={8} src="pop" vol={0.4} />
      <Sfx at={60} src="pop" vol={0.4} />
      <Sfx at={170} src="click" vol={0.5} />
      <Sfx at={232} src="shimmer" vol={0.5} />
      <Sfx at={236} src="hit" vol={0.45} />
    </AbsoluteFill>
  );
};

// ---------- overlays ----------
const Bug: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [SCENES[2], SCENES[2] + 15, SCENES[9] - 10, SCENES[9]], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 12, opacity: o * 0.92 }}>
      <Img src={staticFile("pb/icon-512.png")} style={{ width: 48, borderRadius: 12 }} />
      <span style={{ fontFamily: F, fontWeight: 700, fontSize: 30, color: "white", textShadow: "0 2px 8px rgba(0,0,0,.6)" }}>প্রবাসী বন্ধু</span>
    </div>
  );
};
const CutFlash: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none", opacity: interpolate(f, [0, 5, 16], [0, 0.85, 0], clamp), background: `radial-gradient(ellipse 50% 80% at ${interpolate(f, [0, 16], [10, 90])}% 50%, ${C.mint}, ${C.gold}66 40%, transparent 70%)` }} />;
};

const PARTS = [S1Hook, S2Brand, S3Hero, S4Steps, S5Cards, S6Stats, S7Guide, S8Golpo, S9App, S10End];

export const ProbashiPromo: React.FC = () => {
  const musicVol = (f: number) => {
    let near = 99;
    VO.forEach((s, i) => { const e = s + VO_LEN[i]; near = Math.min(near, f < s ? s - f : f > e ? f - e : 0); });
    const duck = interpolate(near, [0, 12], [0.17, 0.42], clamp);
    return duck * interpolate(f, [0, 20, PB_TOTAL - 60, PB_TOTAL], [0, 1, 1, 0], clamp);
  };
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {PARTS.map((P, i) => {
        const from = SCENES[i], len = SCENES[i + 1] - SCENES[i];
        return (
          <Sequence key={i} from={from} durationInFrames={len + X}><Scene len={len}><P /></Scene></Sequence>
        );
      })}
      {SCENES.slice(1, -1).map((s) => (
        <Sequence key={s} from={s - 8} durationInFrames={20}><CutFlash /></Sequence>
      ))}
      {SCENES.slice(2, -1).map((s) => <Sfx key={"w" + s} at={s - 8} src="whoosh" vol={0.35} />)}
      <Bug />
      <Audio src={staticFile("pbmusic.mp3")} volume={musicVol} />
      {VO.map((s, i) => (
        <Sequence key={"vo" + i} from={s} durationInFrames={VO_LEN[i] + 10}><Audio src={staticFile(`pbvo/${String(i + 1).padStart(2, "0")}.mp3`)} volume={1} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
