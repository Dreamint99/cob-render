// প্রবাসী ইনফো (probashiinfo.com) tools promo: BMET live report, flight tracker, taka rate.
// Screens captured from the live site (public/pi, work/pbcap/cap2.mjs). VO = Masum clone (public/pivo).
// NOTE: never call hooks inside conditional JSX (crashes the render mid-way).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { LAND } from "./dots";
import { evolvePath, getPointAtLength, getLength, getTangentAtLength } from "@remotion/paths";

const C = { bg: "#061430", navy: "#0a2a6b", blue: "#1f6feb", sky: "#4da3ff", green: "#22c55e", gold: "#ffc940", red: "#ef3b45", text: "#f4f7fb", mute: "#a9b8d3", card: "#ffffff" };
const H = "Hind", M = "Montserrat";
if (typeof document !== "undefined") {
  for (const [n, f, w] of [["Hind", "fonts/HindSiliguri-Bold.ttf", "700"], ["Hind", "fonts/HindSiliguri-SemiBold.ttf", "600"], ["Montserrat", "fonts/Montserrat.ttf", "100 900"]]) {
    const ff = new FontFace(n, `url(${staticFile(f)})`, { weight: w });
    ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  }
}
const bn = (s: number | string) => String(s).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
const fmt = (n: number, dec = 0) => bn(n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }));
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const SCENES = [0, 240, 510, 960, 1380, 1755, 2250];
const VO = [15, 255, 525, 975, 1395, 1770];
const VO_LEN = [221, 240, 370, 353, 319, 350];
export const PI_TOTAL = SCENES[SCENES.length - 1];
const X = 8;

const useSp = (delay = 0, damping = 15, mass = 0.8) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, mass } });
};

const Backdrop: React.FC<{ tint?: string }> = ({ tint = C.blue }) => {
  const f = useCurrentFrame();
  const a = f / 80;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, #04102a, ${C.bg} 50%, #031026)`, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 700px at ${25 + Math.sin(a) * 8}% ${30 + Math.cos(a) * 8}%, ${tint}88, transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(700px 600px at ${85 + Math.cos(a) * 5}% ${85 + Math.sin(a) * 5}%, ${C.green}44, transparent 70%)` }} />
      <AbsoluteFill style={{ opacity: 0.12, backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "60px 60px", backgroundPosition: `0 ${f * 0.4}px`, maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: ease });
  const out = interpolate(f, [len - X, len + X], [1, 0], clamp);
  const o = Math.min(inn, out);
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${interpolate(inn, [0, 1], [1.08, 1]) * interpolate(out, [0, 1], [0.95, 1])})`, filter: `blur(${(1 - o) * 12}px)` }}>{children}</AbsoluteFill>;
};

const Words: React.FC<{ text: string; delay?: number; size?: number; color?: string; stagger?: number; style?: React.CSSProperties; center?: boolean }> = ({ text, delay = 0, size = 80, color = C.text, stagger = 4, style, center }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: H, fontWeight: 700, fontSize: size, color, lineHeight: 1.3, display: "flex", flexWrap: "wrap", justifyContent: center ? "center" : "flex-start", ...style }}>
      {text.split(" ").map((w, i) => {
        const s = spring({ frame: f - delay - i * stagger, fps, config: { damping: 14, mass: 0.7 } });
        return <span key={i} style={{ display: "inline-block", marginRight: size * 0.25, opacity: s, transform: `translateY(${(1 - s) * size * 0.7}px)`, filter: `blur(${(1 - s) * 8}px)` }}>{w}</span>;
      })}
    </div>
  );
};

const Pill: React.FC<{ children: React.ReactNode; delay?: number; size?: number; dot?: string; bg?: string; color?: string }> = ({ children, delay = 0, size = 30, dot, bg = "rgba(255,255,255,.1)", color = C.text }) => {
  const s = useSp(delay, 12, 0.6);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: `${size * 0.32}px ${size * 0.75}px`, borderRadius: 999, background: bg, border: "1.5px solid rgba(255,255,255,.18)", fontFamily: H, fontWeight: 600, fontSize: size, color, transform: `scale(${s})`, opacity: Math.min(1, s * 1.5), whiteSpace: "nowrap" }}>
      {dot && <span style={{ width: size * 0.36, height: size * 0.36, borderRadius: 99, background: dot, boxShadow: `0 0 12px ${dot}` }} />}{children}
    </div>
  );
};

const Live: React.FC<{ size?: number }> = ({ size = 26 }) => {
  const f = useCurrentFrame();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: `${size * 0.25}px ${size * 0.6}px`, borderRadius: 999, background: C.red, color: "white", fontFamily: H, fontWeight: 700, fontSize: size }}>
      <span style={{ width: size * 0.4, height: size * 0.4, borderRadius: 99, background: "white", opacity: f % 30 < 15 ? 1 : 0.3 }} />লাইভ
    </span>
  );
};

const Browser: React.FC<{ src: string; w: number; h: number; scroll?: number; url: string }> = ({ src, w, h, scroll = 0, url }) => (
  <div style={{ width: w, height: h, borderRadius: 20, overflow: "hidden", background: "#fff", boxShadow: "0 60px 120px rgba(0,0,0,.6), 0 0 0 1.5px rgba(255,255,255,.2)" }}>
    <div style={{ height: 50, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: "#e9eef6" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />)}
      <div style={{ marginLeft: 22, flex: 1, maxWidth: 600, height: 32, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontFamily: M, fontSize: 17, color: "#334" }}>🔒&nbsp; {url}</div>
    </div>
    <div style={{ height: h - 50, overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: w, transform: `translateY(${-scroll}px)` }} /></div>
  </div>
);

const Phone: React.FC<{ src: string; w?: number; scroll?: number }> = ({ src, w = 400, scroll = 0 }) => (
  <div style={{ width: w, height: w * 2.08, borderRadius: w * 0.14, padding: w * 0.032, background: "linear-gradient(145deg,#3a4458,#0d1220)", boxShadow: "0 60px 120px rgba(0,0,0,.7), 0 0 0 2px rgba(255,255,255,.18)" }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: w * 0.115, overflow: "hidden", background: "#fff" }}>
      <Img src={staticFile(src)} style={{ width: "100%", transform: `translateY(${-scroll}px)` }} />
      <div style={{ position: "absolute", top: w * 0.03, left: "50%", width: w * 0.3, height: w * 0.075, marginLeft: -w * 0.15, borderRadius: 99, background: "#000" }} />
    </div>
  </div>
);

const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 0.5 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={150}><Audio src={staticFile(src.includes("/") ? src : `pbsfx/${src}.mp3`)} volume={vol} /></Sequence>
);
const RADAR = "pisfx/radar.mp3", TYPE = "pisfx/typing.mp3", CASH = "pisfx/cash.mp3", GLITCH = "pisfx/glitch.mp3";

const Flag: React.FC<{ c: string; h?: number }> = ({ c, h = 40 }) => <Img src={staticFile(`pi/flags/${c}.png`)} style={{ height: h, width: h * 1.5, objectFit: "cover", borderRadius: 6, boxShadow: "0 2px 6px rgba(0,0,0,.4)" }} />;

const Wordmark: React.FC<{ h?: number }> = ({ h = 120 }) => (
  <div style={{ display: "inline-flex", padding: `${h * 0.12}px ${h * 0.25}px`, borderRadius: h * 0.22, background: "white", boxShadow: "0 30px 80px rgba(0,0,0,.45)" }}>
    <Img src={staticFile("pi/wordmark.png")} style={{ height: h }} />
  </div>
);

// ---------- S1 hook: where is the plane right now? ----------
const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const sweep = (f * 3) % 360;
  const px = interpolate(f, [0, 240], [-260, 300]);
  const py = interpolate(f, [0, 240], [180, -140]);
  const q = useSp(130, 9, 0.7);
  return (
    <AbsoluteFill>
      <Backdrop tint={C.navy} />
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: ((i * 137) % 1920), top: ((i * 89) % 1080), width: 3, height: 3, borderRadius: 9, background: "white", opacity: 0.2 + 0.5 * Math.abs(Math.sin(f / 20 + i)) }} />
      ))}
      <div style={{ position: "absolute", left: 1360, top: 540, width: 0, height: 0 }}>
        {[180, 320, 460].map((r) => <div key={r} style={{ position: "absolute", left: -r, top: -r, width: r * 2, height: r * 2, borderRadius: 999, border: `2px solid ${C.green}55` }} />)}
        <div style={{ position: "absolute", left: -460, top: -460, width: 920, height: 920, borderRadius: 999, background: `conic-gradient(from ${sweep}deg, ${C.green}66, transparent 40deg)` }} />
        <div style={{ position: "absolute", left: -460, top: 0, width: 920, height: 1.5, background: `${C.green}44` }} />
        <div style={{ position: "absolute", left: 0, top: -460, width: 1.5, height: 920, background: `${C.green}44` }} />
        <div style={{ position: "absolute", left: px - 40, top: py - 40, fontSize: 80, transform: "rotate(-30deg)", filter: `drop-shadow(0 0 20px ${C.gold})` }}>✈️</div>
        <div style={{ position: "absolute", left: px + 50, top: py - 70, padding: "6px 16px", borderRadius: 10, background: "rgba(0,0,0,.6)", border: `1.5px solid ${C.gold}`, fontFamily: M, fontWeight: 700, fontSize: 24, color: C.gold }}>BG147 · ???</div>
      </div>
      <AbsoluteFill style={{ padding: "0 120px", justifyContent: "center" }}>
        <div style={{ marginBottom: 20 }}><Live size={30} /></div>
        <Words text="আপনার প্রিয়জনের বিমান" delay={14} size={92} />
        <Words text="এখন আকাশের" delay={40} size={92} />
        <Words text="ঠিক কোথায়?" delay={58} size={140} color={C.gold} />
        <div style={{ marginTop: 20, fontFamily: H, fontWeight: 700, fontSize: 120, color: C.text, transform: `scale(${q}) rotate(${(1 - q) * -10}deg)`, opacity: q, transformOrigin: "left center" }}>জানেন? 🤔</div>
      </AbsoluteFill>
      {[10, 70, 130, 190].map((a) => <Sfx key={a} at={a} src={RADAR} vol={0.35} />)}
      <Sfx at={128} src="hit" vol={0.4} />
      <Sfx at={200} src="riser" vol={0.35} />
    </AbsoluteFill>
  );
};

// ---------- S2 problem → brand ----------
const S2Brand: React.FC = () => {
  const f = useCurrentFrame();
  const merge = interpolate(f, [150, 185], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const wm = useSp(180, 11, 0.9);
  const chips: [string, string, number, number][] = [["বিএমইটির খবর?", "📊", -520, -230], ["টাকার রেট?", "💱", 480, -160], ["ফ্লাইটের খোঁজ?", "✈️", -380, 230]];
  const crossed = interpolate(f, [100, 120], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {chips.map(([t, e, x, y], i) => {
          const s = spring({ frame: f - 10 - i * 18, fps: 30, config: { damping: 12 } });
          return (
            <div key={t} style={{ position: "absolute", transform: `translate(${x * (1 - merge)}px, ${y * (1 - merge)}px) scale(${s * (1 - merge * 0.8)}) rotate(${(i - 1) * 4 * (1 - merge)}deg)`, opacity: s * (1 - merge), padding: "26px 40px", borderRadius: 26, background: "rgba(255,255,255,.08)", border: "2px solid rgba(255,255,255,.2)", fontFamily: H, fontWeight: 700, fontSize: 64, color: C.text, display: "flex", gap: 20, alignItems: "center" }}>
              <span>{e}</span>{t}
            </div>
          );
        })}
        <div style={{ position: "absolute", bottom: 150, opacity: interpolate(f, [90, 100, 150, 160], [0, 1, 1, 0], clamp), fontFamily: H, fontWeight: 700, fontSize: 58, color: C.mute }}>
          <span style={{ position: "relative" }}>দশ জায়গায় খোঁজাখুঁজি<span style={{ position: "absolute", left: 0, top: "52%", height: 6, width: `${crossed * 100}%`, background: C.red, borderRadius: 4 }} /></span>
        </div>
        <div style={{ transform: `scale(${wm})`, opacity: wm, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <Wordmark h={170} />
          <div style={{ fontFamily: H, fontWeight: 600, fontSize: 44, color: C.text, opacity: interpolate(f, [200, 215], [0, 1], clamp) }}>সব এক জায়গায় · <span style={{ fontFamily: M, fontWeight: 700, color: C.gold }}>probashiinfo.com</span></div>
        </div>
      </AbsoluteFill>
      {[10, 28, 46].map((a) => <Sfx key={a} at={a} src="pop" vol={0.4} />)}
      <Sfx at={100} src={GLITCH} vol={0.4} />
      <Sfx at={178} src="shimmer" vol={0.5} />
      <Sfx at={182} src="hit" vol={0.35} />
    </AbsoluteFill>
  );
};

// ---------- S3 BMET live report ----------
const BMET: [string, string, number][] = [["sa", "সৌদি আরব", 248], ["sg", "সিঙ্গাপুর", 203], ["mv", "মালদ্বীপ", 195], ["qa", "কাতার", 107], ["kw", "কুয়েত", 96], ["it", "ইতালি", 33], ["vn", "ভিয়েতনাম", 30], ["pt", "পর্তুগাল", 29]];
const S3Bmet: React.FC = () => {
  const f = useCurrentFrame();
  const count = interpolate(f, [20, 90], [0, 1089], { ...clamp, easing: ease });
  const partB = interpolate(f, [205, 225], [0, 1], clamp);
  const dev = useSp(215, 17);
  const ph = useSp(232, 16);
  const scroll = interpolate(f, [240, 440], [0, 900], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const mscroll = interpolate(f, [250, 440], [0, 1500], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ opacity: 1 - partB, transform: `translateX(${-partB * 200}px)` }}>
        <div style={{ position: "absolute", left: 110, top: 110 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}><Live size={30} /><Pill size={28} delay={4}>বিএমইটি রিপোর্ট</Pill></div>
          <Words text="আজ বিদেশে কাজের ছাড়পত্র পেলেন" delay={6} size={54} style={{ marginTop: 26 }} />
          <div style={{ fontFamily: H, fontWeight: 700, fontSize: 230, color: C.text, lineHeight: 1.05, fontVariantNumeric: "tabular-nums", textShadow: `0 0 60px ${C.blue}` }}>{fmt(count)} <span style={{ fontSize: 90, color: C.green }}>জন</span></div>
          <div style={{ fontFamily: H, fontWeight: 600, fontSize: 32, color: C.mute }}>২৭টি দেশ · নারী ৭০ জন · প্রতি ৫ মিনিটে হালনাগাদ</div>
          <div style={{ display: "flex", gap: 18, marginTop: 40 }}>
            {[["গতকাল", 394], ["শেষ ৭ দিন", 7065], ["সেপ্টেম্বর", 70304]].map(([l, n], i) => {
              const s = spring({ frame: f - 70 - i * 12, fps: 30, config: { damping: 14 } });
              return (
                <div key={l as string} style={{ padding: "20px 28px", borderRadius: 22, background: "white", color: "#0b1f44", transform: `translateY(${(1 - s) * 60}px)`, opacity: s, fontFamily: H }}>
                  <div style={{ fontSize: 24, fontWeight: 600, color: "#5a6b8c" }}>{l}</div>
                  <div style={{ fontSize: 54, fontWeight: 700 }}>{fmt(interpolate(f, [70 + i * 12, 120 + i * 12], [0, n as number], clamp))}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ position: "absolute", right: 100, top: 100, width: 760, padding: "34px 38px", borderRadius: 30, background: "white", boxShadow: "0 40px 90px rgba(0,0,0,.5)", transform: `translateX(${(1 - useSp(30, 18)) * 900}px)` }}>
          <div style={{ fontFamily: H, fontWeight: 700, fontSize: 38, color: "#0b1f44", display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 14, height: 14, borderRadius: 9, background: C.red }} />আজ কোন দেশে কতজন</div>
          {BMET.map(([c, n, v], i) => {
            const p = interpolate(f, [50 + i * 7, 95 + i * 7], [0, 1], { ...clamp, easing: ease });
            return (
              <div key={c} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 20, fontFamily: H }}>
                <Flag c={c} h={34} />
                <div style={{ width: 190, fontSize: 32, fontWeight: 600, color: "#1a2b4c" }}>{n}</div>
                <div style={{ flex: 1, height: 16, borderRadius: 9, background: "#edf1f7" }}><div style={{ width: `${(v / 248) * 100 * p}%`, height: "100%", borderRadius: 9, background: `linear-gradient(90deg, ${C.green}, ${C.blue})` }} /></div>
                <div style={{ width: 80, textAlign: "right", fontSize: 34, fontWeight: 700, color: "#0b1f44" }}>{bn(Math.round(v * p))}</div>
              </div>
            );
          })}
          <div style={{ marginTop: 22, fontFamily: H, fontSize: 22, color: "#7a88a3" }}>১১ অক্টোবর ২০২৬ · তথ্যসূত্র: বিএমইটি / OEP</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: partB }}>
        <div style={{ position: "absolute", left: 80, top: 130, transform: `perspective(2000px) rotateY(${10 * dev}deg) translateX(${(1 - dev) * -300}px)`, transformOrigin: "left center", opacity: dev }}>
          <Browser src="pi/d-bmet.jpg" w={1220} h={800} scroll={scroll} url="probashiinfo.com/bmet-report" />
        </div>
        <div style={{ position: "absolute", right: 130, top: 80, transform: `translateY(${(1 - ph) * 900}px) rotate(4deg)` }}>
          <Phone src="pi/m-bmet.jpg" w={420} scroll={mscroll} />
        </div>
        <div style={{ position: "absolute", left: 80, bottom: 50, display: "flex", gap: 16 }}>
          <Pill delay={250} size={32} dot={C.green} bg="rgba(6,20,48,.85)">সরকারি OEP সার্ভার থেকে</Pill>
          <Pill delay={275} size={32} dot={C.red} bg="rgba(6,20,48,.85)">প্রতি ৫ মিনিটে আপডেট</Pill>
          <Pill delay={315} size={32} bg={C.green} color="#052e16">📷 এক ক্লিকে রিপোর্ট কার্ড</Pill>
        </div>
      </AbsoluteFill>
      <Sfx at={20} src="tick" vol={0.35} />
      <Sfx at={50} src="whoosh" vol={0.3} />
      <Sfx at={205} src={GLITCH} vol={0.4} />
      {[250, 275, 315].map((a) => <Sfx key={a} at={a} src="pop" vol={0.35} />)}
    </AbsoluteFill>
  );
};

// ---------- S4 flight tracker ----------
// equirectangular view lng 28..108, lat 0..45 → 1920x1080
const proj = (lat: number, lng: number): [number, number] => [((lng - 28) / 80) * 1920, ((45 - lat) / 45) * 1080];
const DHAKA = proj(23.81, 90.41);
const DUBAI = proj(25.25, 55.36);
const PORTS: [string, number, number][] = [["রিয়াদ", 24.71, 46.68], ["দোহা", 25.29, 51.53], ["কুয়েত", 29.38, 47.99], ["মাস্কাট", 23.59, 58.41], ["কুয়ালালামপুর", 3.14, 101.69], ["সিঙ্গাপুর", 1.35, 103.82]];
const DotMap: React.FC = () => (
  <svg width={1920} height={1080} style={{ position: "absolute" }}>
    {LAND.map(([lat, lng], i) => { const [x, y] = proj(lat, lng); return x > -20 && x < 1940 && y > -20 && y < 1100 ? <circle key={i} cx={x} cy={y} r={6} fill="rgba(140,180,255,.15)" /> : null; })}
  </svg>
);
const S4Flight: React.FC = () => {
  const f = useCurrentFrame();
  const typed = "BG147".slice(0, Math.floor(interpolate(f, [12, 40], [0, 5], clamp)));
  const mx = (DHAKA[0] + DUBAI[0]) / 2, my = DHAKA[1] - 260;
  const d = `M ${DHAKA[0]} ${DHAKA[1]} Q ${mx} ${my} ${DUBAI[0]} ${DUBAI[1]}`;
  const L = getLength(d);
  const draw = interpolate(f, [50, 90], [0, 1], { ...clamp, easing: ease });
  const prog = interpolate(f, [70, 210], [0, 0.62], clamp);
  const pt = getPointAtLength(d, Math.max(0.1, prog * L));
  const tg = getTangentAtLength(d, Math.max(0.1, prog * L));
  const ang = (Math.atan2(tg.y, tg.x) * 180) / Math.PI;
  const zoom = interpolate(f, [40, 200], [1, 1.2], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const partB = interpolate(f, [205, 225], [0, 1], clamp);
  const info = useSp(110, 15);
  const dev = useSp(215, 17);
  const ph = useSp(232, 16);
  const mscroll = interpolate(f, [260, 410], [0, 900], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const ev = evolvePath(draw, d);
  return (
    <AbsoluteFill>
      <Backdrop tint={C.navy} />
      <AbsoluteFill style={{ opacity: 1 - partB }}>
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "1077px 490px" }}>
          <DotMap />
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            <defs><filter id="gl"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
            {PORTS.map(([n, la, lo], i) => { const [x, y] = proj(la, lo); return <g key={n} opacity={interpolate(f, [20 + i * 5, 35 + i * 5], [0, 0.8], clamp)}><circle cx={x} cy={y} r={7} fill={C.sky} /><text x={x + 14} y={y + 8} fontFamily={H} fontWeight={600} fontSize={24} fill="#cfe0ff">{n}</text></g>; })}
            <path d={d} stroke={C.gold} strokeWidth={5} fill="none" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} filter="url(#gl)" />
            {[DHAKA, DUBAI].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={12} fill={i ? C.sky : C.red} filter="url(#gl)" /><circle cx={x} cy={y} r={12 + ((f * 0.8 + i * 20) % 40)} fill="none" stroke={i ? C.sky : C.red} strokeWidth={2} opacity={1 - ((f * 0.8 + i * 20) % 40) / 40} /></g>)}
            <text x={DHAKA[0] + 20} y={DHAKA[1] + 10} fontFamily={H} fontWeight={700} fontSize={36} fill="white">ঢাকা</text>
            <text x={DUBAI[0] - 20} y={DUBAI[1] + 50} fontFamily={H} fontWeight={700} fontSize={36} fill="white">দুবাই</text>
            {f > 70 && <text x={pt.x} y={pt.y} fontSize={54} textAnchor="middle" dominantBaseline="central" transform={`rotate(${ang + 45} ${pt.x} ${pt.y})`}>✈️</text>}
            {f > 70 && <circle cx={pt.x} cy={pt.y} r={24 + (f % 30)} fill="none" stroke={C.gold} strokeWidth={2.5} opacity={1 - (f % 30) / 30} />}
          </svg>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 110, top: 90, width: 760, padding: "26px 30px", borderRadius: 26, background: "white", boxShadow: "0 30px 70px rgba(0,0,0,.5)", transform: `translateY(${(1 - useSp(0, 16)) * -300}px)` }}>
          <div style={{ fontFamily: H, fontWeight: 700, fontSize: 30, color: "#0b1f44" }}>✈ ফ্লাইট নম্বর লিখুন</div>
          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            <div style={{ flex: 1, height: 74, borderRadius: 16, border: `2.5px solid ${C.blue}`, display: "flex", alignItems: "center", padding: "0 22px", fontFamily: M, fontWeight: 700, fontSize: 40, color: "#0b1f44" }}>{typed}<span style={{ color: C.blue, opacity: f % 20 < 10 ? 1 : 0 }}>|</span></div>
            <div style={{ height: 74, padding: "0 30px", borderRadius: 16, background: C.blue, color: "white", display: "flex", alignItems: "center", fontFamily: H, fontWeight: 700, fontSize: 34, transform: `scale(${f > 44 && f < 52 ? 0.92 : 1})` }}>খুঁজুন</div>
          </div>
        </div>
        <div style={{ position: "absolute", right: 90, bottom: 80, width: 720, padding: "28px 32px", borderRadius: 26, background: "rgba(6,20,48,.92)", border: `2px solid ${C.gold}88`, transform: `translateX(${(1 - info) * 800}px)`, fontFamily: H, boxShadow: "0 30px 70px rgba(0,0,0,.5)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: M, fontWeight: 800, fontSize: 40, color: C.gold }}>BG147</div><Live size={24} />
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: C.text }}>ঢাকা (DAC) → দুবাই (DXB)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 18 }}>
            {[["উচ্চতা", "৩৫,০০০ ফুট"], ["গতি", "৮৫০ কিমি/ঘ"], ["অবতরণ", "২ ঘ. ১০ মি."]].map(([a, b]) => (
              <div key={a} style={{ padding: "14px 16px", borderRadius: 16, background: "rgba(255,255,255,.08)" }}><div style={{ fontSize: 22, color: C.mute }}>{a}</div><div style={{ fontSize: 30, fontWeight: 700, color: C.text, whiteSpace: "nowrap" }}>{b}</div></div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 20, color: C.mute }}>উদাহরণ · সংখ্যাগুলো লাইভ ম্যাপে দেখাবে</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: partB }}>
        <div style={{ position: "absolute", left: 80, top: 130, transform: `perspective(2000px) rotateY(${10 * dev}deg) translateX(${(1 - dev) * -300}px)`, transformOrigin: "left center", opacity: dev }}>
          <Browser src="pi/d-flight-top.jpg" w={1220} h={800} url="probashiinfo.com/flight-tracker" />
        </div>
        <div style={{ position: "absolute", right: 130, top: 80, transform: `translateY(${(1 - ph) * 900}px) rotate(4deg)` }}>
          <Phone src="pi/m-flight.jpg" w={420} scroll={mscroll} />
        </div>
        <div style={{ position: "absolute", left: 80, bottom: 50, display: "flex", gap: 16 }}>
          <Pill delay={245} size={32} dot={C.gold} bg="rgba(6,20,48,.85)">ফ্লাইট নম্বর দিয়ে</Pill>
          <Pill delay={265} size={32} dot={C.sky} bg="rgba(6,20,48,.85)">এয়ারপোর্ট দিয়ে</Pill>
          <Pill delay={285} size={32} dot={C.green} bg="rgba(6,20,48,.85)">রুট দিয়ে · বাংলায়</Pill>
        </div>
      </AbsoluteFill>
      <Sfx at={12} src={TYPE} vol={0.5} />
      <Sfx at={46} src="click" vol={0.5} />
      <Sfx at={60} src="plane" vol={0.3} />
      <Sfx at={110} src={RADAR} vol={0.35} />
      <Sfx at={205} src={GLITCH} vol={0.4} />
      {[245, 265, 285].map((a) => <Sfx key={a} at={a} src="pop" vol={0.35} />)}
    </AbsoluteFill>
  );
};

// ---------- S5 taka rate ----------
const RATES: [string, string, string, number, number][] = [["sa", "সৌদি রিয়াল", "SAR", 32.88, 0.2], ["ae", "আমিরাত দিরহাম", "AED", 33.57, 0.2], ["qa", "কাতারি রিয়াল", "QAR", 33.87, 0.2], ["kw", "কুয়েতি দিনার", "KWD", 396.69, 0.21], ["my", "মালয়েশিয়ান রিংগিত", "MYR", 30.17, 0.23], ["eu", "ইউরো", "EUR", 138.12, -0.13]];
const Spark: React.FC<{ seed: number; up: boolean; p: number }> = ({ seed, up, p }) => {
  const pts = Array.from({ length: 14 }, (_, i) => `${i * 10},${20 - Math.sin(i * 0.9 + seed) * 8 - (up ? i * 0.6 : -i * 0.6) * 0.8}`).join(" ");
  return <svg width={130} height={40} viewBox="0 0 130 40"><polyline points={pts} fill="none" stroke={up ? C.green : C.red} strokeWidth={3} strokeDasharray={300} strokeDashoffset={300 * (1 - p)} /></svg>;
};
const S5Rate: React.FC = () => {
  const f = useCurrentFrame();
  const partB = interpolate(f, [185, 205], [0, 1], clamp);
  const calc = useSp(195, 16);
  const ph = useSp(200, 16);
  const amount = interpolate(f, [225, 265], [0, 32879], { ...clamp, easing: ease });
  const bonus = interpolate(f, [285, 315], [0, 33701], { ...clamp, easing: ease });
  const bonusIn = useSp(280, 12);
  const mscroll = interpolate(f, [220, 370], [0, 700], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <Backdrop tint="#0d5a3a" />
      <AbsoluteFill style={{ opacity: 1 - partB }}>
        <div style={{ position: "absolute", left: 110, top: 90 }}>
          <div style={{ display: "flex", gap: 16 }}><Live size={28} /><Pill size={28} delay={4}>২৬টি মুদ্রা</Pill></div>
          <Words text="আজকের টাকার রেট" delay={6} size={96} style={{ marginTop: 14 }} />
        </div>
        <div style={{ position: "absolute", left: 110, right: 110, top: 330, borderRadius: 30, background: "white", padding: "16px 36px", boxShadow: "0 40px 90px rgba(0,0,0,.5)" }}>
          {RATES.map(([c, n, code, v, ch], i) => {
            const s = spring({ frame: f - 24 - i * 9, fps: 30, config: { damping: 15 } });
            const p = interpolate(f, [40 + i * 9, 90 + i * 9], [0, 1], clamp);
            return (
              <div key={code} style={{ display: "flex", alignItems: "center", gap: 26, padding: "14px 0", borderTop: i ? "1.5px solid #eef2f7" : "none", transform: `rotateX(${(1 - s) * 90}deg)`, opacity: s, fontFamily: H }}>
                <Flag c={c} h={44} />
                <div style={{ width: 470, fontSize: 38, fontWeight: 700, color: "#0b1f44" }}>{n} <span style={{ fontFamily: M, fontSize: 24, color: "#7a88a3" }}>({code})</span></div>
                <div style={{ width: 300, fontSize: 52, fontWeight: 700, color: "#0b1f44", fontVariantNumeric: "tabular-nums" }}>{fmt(v * p, 2)} ৳</div>
                <div style={{ width: 170, fontSize: 30, fontWeight: 700, color: ch > 0 ? "#15803d" : C.red }}>{ch > 0 ? "▲" : "▼"} {bn(Math.abs(ch).toFixed(2))}%</div>
                <Spark seed={i * 2} up={ch > 0} p={p} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: partB }}>
        <div style={{ position: "absolute", left: 110, top: 120, width: 1000, transform: `translateX(${(1 - calc) * -500}px)`, opacity: calc }}>
          <Words text="কত পাঠালে কত টাকা পাবেন?" delay={200} size={72} />
          <div style={{ marginTop: 30, padding: "36px 40px", borderRadius: 30, background: "white", boxShadow: "0 40px 90px rgba(0,0,0,.5)", fontFamily: H }}>
            <div style={{ display: "flex", gap: 18 }}>
              <div style={{ flex: 1, height: 84, borderRadius: 18, border: "2px solid #d6deea", display: "flex", alignItems: "center", padding: "0 26px", fontSize: 46, fontWeight: 700, color: "#0b1f44" }}>১,০০০</div>
              <div style={{ flex: 1.3, height: 84, borderRadius: 18, border: "2px solid #d6deea", display: "flex", alignItems: "center", gap: 14, padding: "0 22px", fontSize: 38, fontWeight: 700, color: "#0b1f44" }}><Flag c="sa" h={34} />সৌদি রিয়াল (SAR)</div>
            </div>
            <div style={{ marginTop: 22, padding: "24px 30px", borderRadius: 20, background: "#effaf3", border: "2px solid #bfe8cf" }}>
              <div style={{ fontSize: 96, fontWeight: 700, color: "#0e6b38", fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>{fmt(amount)} টাকা</div>
              <div style={{ fontSize: 26, color: "#5a6b8c" }}>বাজার রেট: ১ সৌদি রিয়াল = ৩২.৮৮ টাকা</div>
            </div>
            <div style={{ marginTop: 18, padding: "20px 28px", borderRadius: 18, background: "#fff8e6", border: "2px solid #f5d98a", display: "flex", justifyContent: "space-between", alignItems: "center", transform: `scale(${bonusIn})`, opacity: bonusIn }}>
              <div style={{ fontSize: 34, fontWeight: 700, color: "#7a5400" }}>🎁 বৈধ পথে পাঠালে ২.৫% প্রণোদনাসহ</div>
              <div style={{ fontSize: 48, fontWeight: 700, color: "#b45309", fontVariantNumeric: "tabular-nums" }}>{fmt(bonus)} টাকা</div>
            </div>
          </div>
          <div style={{ marginTop: 16, fontFamily: H, fontSize: 22, color: C.mute }}>১০ অক্টোবর ২০২৬-এর বাজার রেট · ব্যাংক বা এক্সচেঞ্জ হাউসে সামান্য কম-বেশি হতে পারে</div>
        </div>
        <div style={{ position: "absolute", right: 130, top: 80, transform: `translateY(${(1 - ph) * 900}px) rotate(4deg)` }}>
          <Phone src="pi/m-rate.jpg" w={420} scroll={mscroll} />
        </div>
      </AbsoluteFill>
      <Sfx at={24} src="cards" vol={0.4} />
      <Sfx at={40} src="tick" vol={0.3} />
      <Sfx at={185} src={GLITCH} vol={0.4} />
      <Sfx at={225} src="tick" vol={0.3} />
      <Sfx at={282} src={CASH} vol={0.55} />
    </AbsoluteFill>
  );
};

// ---------- S6 CTA ----------
const URL = "probashiinfo.com";
const S6End: React.FC = () => {
  const f = useCurrentFrame();
  const typed = URL.slice(0, Math.floor(interpolate(f, [95, 135], [0, URL.length], clamp)));
  const wm = useSp(150, 11);
  const bg = interpolate(f, [0, 405], [1.05, 1.18]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={staticFile("pi/d-home-top.jpg")} style={{ width: 1920, height: 1080, objectFit: "cover", transform: `scale(${bg})`, filter: "blur(10px) brightness(.35)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, ${C.navy}55, ${C.bg}ee 75%)` }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 26 }}>
          <Pill delay={8} size={46} dot={C.green}>সঠিক তথ্য জানুন</Pill>
          <Pill delay={40} size={46} dot={C.gold}>বৈধ পথে টাকা পাঠান</Pill>
        </div>
        <div style={{ marginTop: 50, transform: `scale(${wm})`, opacity: wm }}><Wordmark h={150} /></div>
        <div style={{ marginTop: 40, padding: "18px 46px", borderRadius: 24, background: "rgba(6,20,48,.8)", border: `2.5px solid ${C.sky}`, boxShadow: `0 0 60px ${C.blue}66`, fontFamily: M, fontWeight: 800, fontSize: 84, color: C.text, minWidth: 300, textAlign: "center", opacity: interpolate(f, [88, 96], [0, 1], clamp) }}>
          {typed}<span style={{ color: C.gold, opacity: f % 20 < 10 ? 1 : 0 }}>|</span>
        </div>
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 16, opacity: interpolate(f, [195, 210], [0, 1], clamp), transform: `translateY(${interpolate(f, [195, 210], [20, 0], clamp)}px)` }}>
          <span style={{ fontFamily: H, fontWeight: 600, fontSize: 40, color: C.text }}>প্রবাসী ইনফো · <span style={{ color: C.gold }}>ড্রিম গ্রুপের একটি সহযোগী প্রতিষ্ঠান</span></span>
        </div>
        <Words text="প্রবাসের পথে, পাশে আছি।" delay={295} size={74} color={C.green} center style={{ marginTop: 24 }} />
        <div style={{ marginTop: 30, display: "flex", gap: 18, opacity: interpolate(f, [340, 360], [0, 1], clamp) }}>
          {["📊 বিএমইটি লাইভ", "✈️ ফ্লাইট ট্র্যাকার", "💱 টাকার রেট", "🛂 ভিসা তথ্য"].map((t) => <div key={t} style={{ padding: "12px 24px", borderRadius: 999, background: "rgba(255,255,255,.1)", fontFamily: H, fontWeight: 600, fontSize: 30, color: C.text }}>{t}</div>)}
        </div>
        <div style={{ position: "absolute", bottom: 40, fontFamily: H, fontSize: 24, color: C.mute, opacity: interpolate(f, [360, 380], [0, 1], clamp) }}>স্বাধীন তথ্যসেবা · এটি সরকারি ওয়েবসাইট নয়</div>
      </AbsoluteFill>
      <Sfx at={8} src="pop" vol={0.4} />
      <Sfx at={40} src="pop" vol={0.4} />
      <Sfx at={95} src={TYPE} vol={0.45} />
      <Sfx at={148} src="shimmer" vol={0.5} />
      <Sfx at={150} src="hit" vol={0.4} />
      <Sfx at={195} src="pop" vol={0.35} />
      <Sfx at={295} src="whoosh" vol={0.3} />
      <Sfx at={340} src="hit" vol={0.3} />
    </AbsoluteFill>
  );
};

const Bug: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [SCENES[2], SCENES[2] + 15, SCENES[5] - 10, SCENES[5]], [0, 1, 1, 0], clamp);
  return <div style={{ position: "absolute", right: 40, top: 30, opacity: o }}><Wordmark h={46} /></div>;
};
const CutFlash: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ mixBlendMode: "screen", opacity: interpolate(f, [0, 5, 16], [0, 0.8, 0], clamp), background: `radial-gradient(ellipse 50% 80% at ${interpolate(f, [0, 16], [10, 90])}% 50%, ${C.sky}, ${C.green}66 40%, transparent 70%)` }} />;
};

const PARTS = [S1Hook, S2Brand, S3Bmet, S4Flight, S5Rate, S6End];
export const InfoPromo: React.FC = () => {
  const musicVol = (f: number) => {
    let near = 99;
    VO.forEach((s, i) => { const e = s + VO_LEN[i]; near = Math.min(near, f < s ? s - f : f > e ? f - e : 0); });
    return interpolate(near, [0, 12], [0.16, 0.42], clamp) * interpolate(f, [0, 15, PI_TOTAL - 50, PI_TOTAL], [0, 1, 1, 0], clamp);
  };
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {PARTS.map((P, i) => (
        <Sequence key={i} from={SCENES[i]} durationInFrames={SCENES[i + 1] - SCENES[i] + X}><Scene len={SCENES[i + 1] - SCENES[i]}><P /></Scene></Sequence>
      ))}
      {SCENES.slice(1, -1).map((s) => <Sequence key={s} from={s - 8} durationInFrames={20}><CutFlash /></Sequence>)}
      {SCENES.slice(2, -1).map((s) => <Sfx key={"w" + s} at={s - 8} src="whoosh" vol={0.35} />)}
      <Bug />
      <Audio src={staticFile("pimusic.mp3")} volume={musicVol} />
      {VO.map((s, i) => <Sequence key={"vo" + i} from={s} durationInFrames={VO_LEN[i] + 10}><Audio src={staticFile(`pivo/0${i + 1}.mp3`)} /></Sequence>)}
    </AbsoluteFill>
  );
};
