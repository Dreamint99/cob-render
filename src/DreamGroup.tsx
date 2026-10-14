// Dream Group / DreamIT — English presentation film (dreamithq.com). Facts from dreamit-site + dreamit-home.
// VO: Brian (ElevenLabs v4, en) public/dgvo; music public/dgmusic.mp3; SFX public/dgsfx.
// NOTE: never call hooks inside conditional JSX.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import { evolvePath } from "@remotion/paths";
import { LAND } from "./dots";

const C = { bg: "#050505", red: "#e3262f", red2: "#ff3b3b", text: "#f5f5f5", mute: "#8c8c8c", line: "rgba(255,255,255,.12)" };
const M = "Montserrat", SERIF = "Georgia, 'Times New Roman', serif";
if (typeof document !== "undefined") {
  const ff = new FontFace("Montserrat", `url(${staticFile("fonts/Montserrat.ttf")})`, { weight: "100 900" });
  ff.load().then(() => document.fonts.add(ff)).catch(() => {});
}
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const SCENES = [0, 180, 500, 700, 950, 1300, 1670, 1900, 2140, 2580];
const VO = [30, 195, 515, 715, 965, 1315, 1685, 1915, 2160];
const VO_LEN = [115, 281, 118, 197, 307, 326, 190, 194, 137];
export const DG_TOTAL = SCENES[SCENES.length - 1];
const X = 10;

const useSp = (delay = 0, damping = 18, mass = 1) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, mass } });
};
const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 0.5 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={150}><Audio src={staticFile(`dgsfx/${src}.mp3`)} volume={vol} /></Sequence>
);

// ---------- look ----------
const Stage: React.FC<{ glow?: [number, number]; children?: React.ReactNode }> = ({ glow = [50, 50], children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(1100px 700px at ${glow[0] + Math.sin(f / 70) * 4}% ${glow[1] + Math.cos(f / 80) * 4}%, rgba(227,38,47,.22), transparent 70%)` }} />
      <AbsoluteFill style={{ opacity: 0.07, backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)", backgroundSize: "80px 80px", maskImage: "radial-gradient(ellipse at center, black 10%, transparent 70%)" }} />
      {children}
    </AbsoluteFill>
  );
};
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.06, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%"><filter id={`n${f % 12}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 12} /></filter><rect width="100%" height="100%" filter={`url(#n${f % 12})`} /></svg>
    </AbsoluteFill>
  );
};
const Scene: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: ease });
  const out = interpolate(f, [len - X, len + X], [1, 0], clamp);
  const o = Math.min(inn, out);
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${interpolate(inn, [0, 1], [1.06, 1]) * interpolate(out, [0, 1], [1.04, 1])})`, filter: `blur(${(1 - o) * 10}px)` }}>{children}</AbsoluteFill>;
};

// Line reveal: text slides up from a mask
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; style?: React.CSSProperties }> = ({ children, delay = 0, style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + 22], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.08em", ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)`, opacity: p }}>{children}</div>
    </div>
  );
};
const Kicker: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [delay, delay + 20], [0, 60], { ...clamp, easing: ease });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: M, fontWeight: 600, fontSize: 24, letterSpacing: "0.32em", color: C.red2, opacity: interpolate(f, [delay, delay + 12], [0, 1], clamp) }}>
      <span style={{ width: w, height: 2, background: C.red }} />{children}
    </div>
  );
};
const Streak: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [at, at + 26], [-30, 130], clamp);
  const o = interpolate(f, [at, at + 6, at + 20, at + 26], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ mixBlendMode: "screen", opacity: o, background: `linear-gradient(100deg, transparent ${x - 12}%, rgba(255,80,80,.35) ${x - 3}%, rgba(255,255,255,.9) ${x}%, rgba(255,80,80,.35) ${x + 3}%, transparent ${x + 12}%)` }} />;
};

// ---------- S1 cold open ----------
const S1Open: React.FC = () => {
  const f = useCurrentFrame();
  const dot = useSp(8, 12);
  const words = ["Every", "great", "company", "begins…"];
  return (
    <Stage glow={[50, 55]}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "absolute", width: 14, height: 14, borderRadius: 99, background: C.red, transform: `scale(${dot * (1 + Math.sin(f / 8) * 0.15)})`, boxShadow: `0 0 ${60 + Math.sin(f / 8) * 20}px 20px rgba(227,38,47,.6)`, top: 300 }} />
        <div style={{ display: "flex", gap: 26, fontFamily: M, fontWeight: 300, fontSize: 76, color: C.text, marginTop: 40 }}>
          {words.map((w, i) => <Reveal key={w} delay={28 + i * 7}>{w}</Reveal>)}
        </div>
        <Reveal delay={80} style={{ marginTop: 10 }}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 120, color: C.text }}>with a single <span style={{ color: C.red2 }}>dream.</span></div>
        </Reveal>
      </AbsoluteFill>
      <Sfx at={6} src="shimmer" vol={0.4} />
      <Sfx at={140} src="riser" vol={0.35} />
    </Stage>
  );
};

// ---------- S2 origin: 2011, Sylhet → Dhaka, one rule ----------
const S2Origin: React.FC = () => {
  const f = useCurrentFrame();
  const year = Math.round(interpolate(f, [8, 40], [1990, 2011], { ...clamp, easing: ease }));
  const partB = interpolate(f, [150, 170], [0, 1], clamp);
  const desk = useSp(70, 16);
  return (
    <Stage glow={[30, 40]}>
      <AbsoluteFill style={{ opacity: 1 - partB, padding: "0 140px", justifyContent: "center" }}>
        <Kicker delay={4}>CHAPTER ONE · THE BEGINNING</Kicker>
        <div style={{ fontFamily: M, fontWeight: 900, fontSize: 330, color: C.text, lineHeight: 1, marginTop: 20, fontVariantNumeric: "tabular-nums", WebkitTextStroke: f < 40 ? "2px #fff" : "0", WebkitTextFillColor: f < 40 ? "transparent" : C.text }}>{year}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 10 }}>
          <Reveal delay={40}><span style={{ fontFamily: M, fontWeight: 600, fontSize: 52, color: C.text }}>Sylhet</span></Reveal>
          <div style={{ width: interpolate(f, [55, 85], [0, 200], { ...clamp, easing: ease }), height: 2, background: C.red, position: "relative" }}>
            <span style={{ position: "absolute", right: -14, top: -16, fontSize: 28, color: C.red2 }}>✈</span>
          </div>
          <Reveal delay={80}><span style={{ fontFamily: M, fontWeight: 600, fontSize: 52, color: C.text }}>Dhaka</span></Reveal>
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 22, opacity: desk, transform: `translateY(${(1 - desk) * 40}px)` }}>
          {["A young engineer", "A two-desk studio", "Green IT"].map((t, i) => (
            <div key={t} style={{ padding: "14px 26px", border: `1.5px solid ${i === 2 ? C.red : C.line}`, borderRadius: 999, fontFamily: M, fontWeight: 500, fontSize: 28, color: i === 2 ? C.red2 : C.text }}>{t}</div>
          ))}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: partB, justifyContent: "center", alignItems: "center", padding: "0 160px" }}>
        <Kicker delay={165}>ONE RULE</Kicker>
        <div style={{ marginTop: 30, textAlign: "center", fontFamily: SERIF, fontSize: 104, lineHeight: 1.12, color: C.text }}>
          <Reveal delay={172}>“Only ship work you’d put</Reveal>
          <Reveal delay={184}><span>your own <span style={{ color: C.red2, fontStyle: "italic" }}>name</span> on.”</span></Reveal>
        </div>
        <div style={{ marginTop: 40, width: interpolate(f, [200, 240], [0, 520], { ...clamp, easing: ease }), height: 2, background: `linear-gradient(90deg, transparent, ${C.red}, transparent)` }} />
      </AbsoluteFill>
      <Sfx at={8} src="tick" vol={0.4} />
      <Sfx at={40} src="boom" vol={0.35} />
      <Sfx at={55} src="whoosh" vol={0.3} />
      <Sfx at={150} src="whoosh" vol={0.4} />
    </Stage>
  );
};

// ---------- S3 fifteen years → DREAM. GROUP ----------
const MILES: [number, string][] = [[2011, "Green IT founded"], [2014, "First SaaS product"], [2017, "International expansion"], [2019, "Mobile-first era"], [2021, "Dream Group born"], [2023, "DreamIT Labs · AI"], [2026, "20+ brands"]];
const S3Group: React.FC = () => {
  const f = useCurrentFrame();
  const track = interpolate(f, [0, 90], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const logo = interpolate(f, [92, 104], [0, 1], clamp);
  const ls = useSp(92, 12, 0.8);
  return (
    <Stage glow={[50, 50]}>
      <AbsoluteFill style={{ opacity: 1 - logo }}>
        <div style={{ position: "absolute", left: 0, top: 520, width: 1920, height: 2, background: C.line }} />
        <div style={{ position: "absolute", left: 0, top: 520, width: 1920 * track, height: 2, background: C.red, boxShadow: `0 0 20px ${C.red}` }} />
        {MILES.map(([y, t], i) => {
          const x = 140 + i * 273;
          const on = track * 1920 > x;
          return (
            <div key={y} style={{ position: "absolute", left: x - 60, top: 450, width: 240, opacity: on ? 1 : 0.15, transform: `translateY(${on ? 0 : 20}px)` }}>
              <div style={{ fontFamily: M, fontWeight: 800, fontSize: 46, color: on ? C.text : C.mute }}>{y}</div>
              <div style={{ width: 16, height: 16, borderRadius: 99, background: on ? C.red : "#333", margin: "6px 0 0 4px", boxShadow: on ? `0 0 16px ${C.red}` : "none" }} />
              <div style={{ marginTop: 18, fontFamily: M, fontWeight: 500, fontSize: 22, color: C.mute, width: 220 }}>{t}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 140, top: 250 }}><Kicker delay={2}>FIFTEEN YEARS LATER</Kicker></div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: logo, justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `scale(${interpolate(ls, [0, 1], [1.6, 1])})`, textAlign: "center" }}>
          <div style={{ fontFamily: M, fontWeight: 900, fontSize: 250, color: C.text, lineHeight: 0.9, letterSpacing: "-0.02em" }}>DREAM<span style={{ color: C.red }}>.</span></div>
          <div style={{ fontFamily: M, fontWeight: 900, fontSize: 250, lineHeight: 0.9, letterSpacing: "-0.02em", WebkitTextStroke: "3px rgba(255,255,255,.55)", WebkitTextFillColor: "transparent" }}>GROUP</div>
          <div style={{ marginTop: 34, fontFamily: M, fontWeight: 500, fontSize: 26, letterSpacing: "0.4em", color: C.mute, opacity: interpolate(f, [120, 140], [0, 1], clamp) }}>QATAR · BANGLADESH · SPAIN</div>
        </div>
      </AbsoluteFill>
      <Streak at={94} />
      <Sfx at={0} src="riser" vol={0.3} />
      <Sfx at={92} src="boom" vol={0.6} />
    </Stage>
  );
};

// ---------- S4 numbers ----------
const STATS: [number, string, string, number][] = [[20, "+", "Brands & products", 8], [240, "+", "Projects shipped", 58], [3, "", "Cities", 118], [1, "", "Team", 150]];
const S4Numbers: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage glow={[50, 60]}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 0 }}>
          {STATS.map(([n, s, l, d], i) => {
            const p = interpolate(f, [d, d + 30], [0, 1], { ...clamp, easing: ease });
            const sp = spring({ frame: f - d, fps: 30, config: { damping: 14 } });
            return (
              <div key={l} style={{ padding: "0 64px", borderLeft: i ? `1.5px solid ${C.line}` : "none", opacity: sp, transform: `translateY(${(1 - sp) * 60}px)` }}>
                <div style={{ fontFamily: M, fontWeight: 900, fontSize: 170, color: i === 3 ? C.red2 : C.text, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.round(n * p)}<span style={{ color: C.red }}>{s}</span></div>
                <div style={{ marginTop: 16, fontFamily: M, fontWeight: 500, fontSize: 30, color: C.mute, letterSpacing: "0.06em" }}>{l}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {STATS.map(([, , , d]) => <Sfx key={d} at={d} src="tick" vol={0.45} />)}
      <Sfx at={150} src="boom" vol={0.35} />
    </Stage>
  );
};

// ---------- S5 DreamIT engine ----------
const DISC: [string, string, number][] = [["01", "AI & Agents", 90], ["02", "Mobile Apps", 128], ["03", "Web & SaaS", 160], ["04", "Brand & Design", 196], ["05", "SEO & Growth", 222], ["06", "Video & Film", 250]];
const S5Engine: React.FC = () => {
  const f = useCurrentFrame();
  const lg = useSp(4, 16);
  const scr = useSp(20, 20);
  const scroll = interpolate(f, [60, 340], [0, 900], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <Stage glow={[70, 40]}>
      <div style={{ position: "absolute", left: 120, top: 120, opacity: lg, transform: `translateY(${(1 - lg) * 40}px)` }}>
        <Kicker delay={2}>THE TECHNOLOGY ENGINE</Kicker>
        <Img src={staticFile("dg/dreamit-dark.png")} style={{ width: 640, marginTop: 30 }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 420, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, width: 760 }}>
        {DISC.map(([n, t, d]) => {
          const s = spring({ frame: f - d, fps: 30, config: { damping: 15 } });
          const hot = interpolate(f, [d, d + 6, d + 40], [0, 1, 0.25], clamp);
          return (
            <div key={n} style={{ padding: "24px 28px", borderRadius: 18, border: `1.5px solid rgba(227,38,47,${0.15 + hot * 0.85})`, background: `rgba(227,38,47,${0.04 + hot * 0.16})`, opacity: s, transform: `translateY(${(1 - s) * 40}px)`, boxShadow: `0 0 ${hot * 40}px rgba(227,38,47,${hot * 0.4})` }}>
              <div style={{ fontFamily: M, fontWeight: 600, fontSize: 20, color: C.red2, letterSpacing: "0.2em" }}>{n}</div>
              <div style={{ fontFamily: M, fontWeight: 700, fontSize: 38, color: C.text, marginTop: 4 }}>{t}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: -80, top: 110, transform: `perspective(2400px) rotateY(${interpolate(scr, [0, 1], [-40, -18])}deg) translateX(${(1 - scr) * 400}px)`, transformOrigin: "right center", opacity: scr }}>
        <div style={{ width: 1100, height: 860, borderRadius: 20, overflow: "hidden", boxShadow: "0 60px 140px rgba(0,0,0,.8), 0 0 0 1.5px rgba(255,255,255,.12)", background: "#000" }}>
          <div style={{ height: 44, background: "#141414", display: "flex", alignItems: "center", gap: 9, padding: "0 18px" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: 99, background: c }} />)}
            <span style={{ marginLeft: 20, fontFamily: M, fontSize: 16, color: "#aaa" }}>dreamithq.com</span>
          </div>
          <Img src={staticFile("dg/shots/home.jpg")} style={{ width: 1100, transform: `translateY(${-scroll}px)` }} />
        </div>
      </div>
      {DISC.map(([, , d]) => <Sfx key={d} at={d} src="tick" vol={0.35} />)}
      <Sfx at={18} src="whoosh" vol={0.4} />
    </Stage>
  );
};

// ---------- S6 brand universe ----------
const LOGOS = ["safar.mydreamit.dev.png", "probashi-bondhu.webp", "probashiinfo.webp", "ninetymins.webp", "countly.webp", "visapoint.webp", "gccguide.webp", "infkey.webp", "dream-international-logo.png", "dream-workforce-logo.png", "soulmatego.app.png", "bondon.app.png", "moneybag-logo.png", "playr-logo.png", "4uai-logo.png", "bangla-timeline-logo.png"];
const SHOTS = ["probashibondu-top.jpg", "probashiinfo-top.jpg", "ninetymins-top.jpg", "countly-top.jpg"];
const S6Universe: React.FC = () => {
  const f = useCurrentFrame();
  const rot = f * 0.45;
  const core = useSp(6, 12);
  const partB = interpolate(f, [190, 210], [0, 1], clamp);
  return (
    <Stage glow={[50, 50]}>
      <AbsoluteFill style={{ opacity: 1 - partB, perspective: 3400, justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "absolute", top: 70 }}><Kicker delay={2}>THE DREAM GROUP UNIVERSE</Kicker></div>
        <div style={{ position: "relative", width: 0, height: 0, transformStyle: "preserve-3d", transform: `translateY(-10px) scale(0.86) rotateX(-10deg) rotateY(${rot}deg)` }}>
          <div style={{ position: "absolute", left: -150, top: -150, width: 300, height: 300, borderRadius: 999, background: `radial-gradient(circle, ${C.red}, #7a0b10 70%)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotateY(${-rot}deg) rotateX(14deg) scale(${core})`, boxShadow: `0 0 120px 30px rgba(227,38,47,.45)` }}>
            <div style={{ fontFamily: M, fontWeight: 900, fontSize: 92, color: "white" }}>DIT</div>
          </div>
          {LOGOS.map((l, i) => {
            const a = (i * 360) / LOGOS.length;
            const ring = i % 2 ? 600 : 720;
            const yy = (i % 2 ? -1 : 1) * 170;
            const s = spring({ frame: f - 10 - i * 3, fps: 30, config: { damping: 14 } });
            return (
              <div key={l} style={{ position: "absolute", left: -120, top: -70 + yy, width: 240, height: 140, borderRadius: 22, background: "white", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, transform: `rotateY(${a}deg) translateZ(${ring * s}px) rotateY(${-a - rot}deg) rotateX(14deg)`, opacity: s, boxShadow: "0 20px 50px rgba(0,0,0,.6)" }}>
                <Img src={staticFile(`dg/logos/${l}`)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", bottom: 56, zIndex: 5, padding: "8px 22px", borderRadius: 99, background: "rgba(5,5,5,.75)", fontFamily: M, fontWeight: 500, fontSize: 30, color: C.mute, letterSpacing: "0.12em", opacity: interpolate(f, [40, 60], [0, 1], clamp) }}>ONE ENGINE · <span style={{ color: C.text }}>20+ BRANDS</span></div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: partB }}>
        <div style={{ position: "absolute", left: 120, top: 90 }}>
          <Kicker delay={195}>DREAMED · BUILT · RUN IN-HOUSE</Kicker>
        </div>
        {SHOTS.map((s, i) => {
          const sp = spring({ frame: f - 200 - i * 12, fps: 30, config: { damping: 16 } });
          const x = [120, 990, 120, 990][i], y = [180, 180, 620, 620][i];
          return (
            <div key={s} style={{ position: "absolute", left: x, top: y, width: 810, height: 400, borderRadius: 16, overflow: "hidden", transform: `translateY(${(1 - sp) * 200}px) scale(${0.9 + 0.1 * sp}) translateX(${interpolate(f, [200, 370], [0, (i % 2 ? -1 : 1) * 20])}px)`, opacity: sp, boxShadow: "0 40px 90px rgba(0,0,0,.7), 0 0 0 1.5px rgba(255,255,255,.1)" }}>
              <Img src={staticFile(`dg/shots/${s}`)} style={{ width: 810, transform: `scale(${interpolate(f, [200, 370], [1, 1.08])})`, transformOrigin: "top center" }} />
            </div>
          );
        })}
      </AbsoluteFill>
      <Sfx at={6} src="shimmer" vol={0.45} />
      <Sfx at={190} src="whoosh" vol={0.4} />
      {SHOTS.map((_, i) => <Sfx key={i} at={200 + i * 12} src="tick" vol={0.3} />)}
    </Stage>
  );
};

// ---------- S7 global: Doha · Dhaka · Madrid ----------
const proj = (lat: number, lng: number): [number, number] => [((lng + 20) / 120) * 1920, ((70 - lat) / 67.5) * 1080];
const CITIES: [string, string, string, number, number, number][] = [["Doha", "HQ · Strategy & Delivery", "QA", 25.29, 51.53, 3], ["Dhaka", "Engineering & Design", "BD", 23.81, 90.41, 6], ["Madrid", "Partnerships · Europe", "ES", 40.42, -3.7, 2]];
const S7Global: React.FC = () => {
  const f = useCurrentFrame();
  const [doha, dhaka, madrid] = CITIES.map((c) => proj(c[3], c[4]));
  const arc = (a: [number, number], b: [number, number]) => `M ${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2} ${Math.min(a[1], b[1]) - 180} ${b[0]} ${b[1]}`;
  const p1 = interpolate(f, [20, 70], [0, 1], { ...clamp, easing: ease });
  const p2 = interpolate(f, [60, 110], [0, 1], { ...clamp, easing: ease });
  const e1 = evolvePath(p1, arc(doha, dhaka)), e2 = evolvePath(p2, arc(madrid, doha));
  const z = interpolate(f, [0, 230], [1.05, 1.15]);
  return (
    <Stage glow={[55, 50]}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {LAND.map(([la, lo], i) => { const [x, y] = proj(la, lo); return x > -10 && x < 1930 && y > -10 && y < 1090 ? <circle key={i} cx={x} cy={y} r={5} fill={`rgba(255,255,255,${0.1 + random(`d${i}`) * 0.08})`} /> : null; })}
          <defs><filter id="g7"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
          <path d={arc(doha, dhaka)} stroke={C.red} strokeWidth={3} fill="none" strokeDasharray={e1.strokeDasharray} strokeDashoffset={e1.strokeDashoffset} filter="url(#g7)" />
          <path d={arc(madrid, doha)} stroke={C.red} strokeWidth={3} fill="none" strokeDasharray={e2.strokeDasharray} strokeDashoffset={e2.strokeDashoffset} filter="url(#g7)" />
          {[doha, dhaka, madrid].map(([x, y], i) => (
            <g key={i}><text x={x} y={y - 26} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill="white">{CITIES[i === 0 ? 0 : i === 1 ? 1 : 2][0]}</text><circle cx={x} cy={y} r={10} fill={C.red} filter="url(#g7)" /><circle cx={x} cy={y} r={10 + ((f + i * 15) % 45)} fill="none" stroke={C.red} strokeWidth={2} opacity={1 - ((f + i * 15) % 45) / 45} /></g>
          ))}
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 90 }}>
        <Kicker delay={2}>GLOBAL PRESENCE</Kicker>
        <div style={{ fontFamily: M, fontWeight: 800, fontSize: 84, color: C.text, marginTop: 14 }}><Reveal delay={6}>Three cities.</Reveal><Reveal delay={14}><span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: C.red2 }}>Always on.</span></Reveal></div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 70, display: "flex", gap: 22 }}>
        {CITIES.map(([n, role, cc, , , tz], i) => {
          const s = spring({ frame: f - 30 - i * 26, fps: 30, config: { damping: 15 } });
          const mins = 15 * 60 + 43 + Math.floor(f / 30) + (tz - 3) * 60;
          const hh = String(Math.floor(mins / 60) % 24).padStart(2, "0"), mm = String(mins % 60).padStart(2, "0");
          return (
            <div key={n} style={{ flex: 1, padding: "26px 30px", borderRadius: 20, background: "rgba(20,20,20,.85)", border: `1.5px solid ${C.line}`, opacity: s, transform: `translateY(${(1 - s) * 60}px)`, fontFamily: M }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: C.mute, fontSize: 20, letterSpacing: "0.2em" }}><span>{cc}</span><span>{role.toUpperCase()}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 8 }}>
                <span style={{ fontSize: 56, fontWeight: 800, color: C.text }}>{n}</span>
                <span style={{ fontSize: 40, fontWeight: 300, color: C.red2, fontVariantNumeric: "tabular-nums" }}>{hh}<span style={{ opacity: f % 30 < 15 ? 1 : 0.2 }}>:</span>{mm}</span>
              </div>
            </div>
          );
        })}
      </div>
      <Sfx at={20} src="whoosh" vol={0.35} />
      <Sfx at={60} src="whoosh" vol={0.3} />
    </Stage>
  );
};

// ---------- S8 chairman ----------
const S8Chair: React.FC = () => {
  const f = useCurrentFrame();
  const kb = interpolate(f, [0, 250], [1.04, 1.16]);
  const name = useSp(30, 18);
  return (
    <Stage glow={[30, 50]}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1080, overflow: "hidden" }}>
        <Img src={staticFile("dg/chairman.webp")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})`, transformOrigin: "55% 40%", filter: "contrast(1.05) saturate(.9)" }} />
        <AbsoluteFill style={{ background: `linear-gradient(90deg, transparent 55%, ${C.bg} 100%), linear-gradient(0deg, rgba(5,5,5,.8), transparent 40%)` }} />
        <div style={{ position: "absolute", left: 70, bottom: 70, transform: `translateX(${(1 - name) * -200}px)`, opacity: name }}>
          <div style={{ width: 60, height: 3, background: C.red }} />
          <div style={{ fontFamily: M, fontWeight: 800, fontSize: 52, color: C.text, marginTop: 14 }}>Kashim Uddin Masum</div>
          <div style={{ fontFamily: M, fontWeight: 500, fontSize: 24, color: C.mute, letterSpacing: "0.14em", marginTop: 4 }}>FOUNDER & CHAIRMAN · DREAM GROUP</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1120, right: 110, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Kicker delay={10}>A MESSAGE FROM OUR CHAIRMAN</Kicker>
        <div style={{ fontFamily: SERIF, fontSize: 150, color: C.red, lineHeight: 0.6, marginTop: 40, opacity: interpolate(f, [60, 70], [0, 1], clamp) }}>“</div>
        <div style={{ fontFamily: SERIF, fontSize: 66, lineHeight: 1.18, color: C.text }}>
          <Reveal delay={95}>We build your product</Reveal>
          <Reveal delay={110}>the way we build</Reveal>
          <Reveal delay={125}><span style={{ fontStyle: "italic", color: C.red2 }}>our own.</span></Reveal>
        </div>
        <div style={{ marginTop: 40, fontFamily: M, fontSize: 24, color: C.mute, opacity: interpolate(f, [150, 170], [0, 1], clamp) }}>From Sylhet to the world.</div>
      </div>
      <Sfx at={2} src="whoosh" vol={0.35} />
      <Sfx at={95} src="shimmer" vol={0.3} />
    </Stage>
  );
};

// ---------- S9 CTA ----------
const S9End: React.FC = () => {
  const f = useCurrentFrame();
  const lg = useSp(70, 14);
  const fadeOut = interpolate(f, [400, 440], [1, 0], clamp);
  return (
    <Stage glow={[50, 50]}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
        <div style={{ textAlign: "center", fontFamily: M }}>
          <Reveal delay={18}><span style={{ fontWeight: 300, fontSize: 96, color: C.text }}>Have a dream?</span></Reveal>
          <Reveal delay={42}><span style={{ fontWeight: 900, fontSize: 132, color: C.text }}>We’ll build it<span style={{ color: C.red }}>.</span></span></Reveal>
        </div>
        <div style={{ marginTop: 60, display: "flex", alignItems: "center", gap: 60, transform: `scale(${lg})`, opacity: lg }}>
          <Img src={staticFile("dg/dreamit-dark.png")} style={{ height: 120 }} />
          <div style={{ width: 2, height: 110, background: C.line }} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: M, fontWeight: 900, fontSize: 58, color: C.text, lineHeight: 0.95 }}>DREAM<span style={{ color: C.red }}>.</span></div>
            <div style={{ fontFamily: M, fontWeight: 900, fontSize: 58, lineHeight: 0.95, WebkitTextStroke: "1.5px rgba(255,255,255,.6)", WebkitTextFillColor: "transparent" }}>GROUP</div>
          </div>
        </div>
        <div style={{ marginTop: 60, display: "flex", gap: 40, fontFamily: M, fontSize: 30, color: C.mute, opacity: interpolate(f, [130, 150], [0, 1], clamp), letterSpacing: "0.08em" }}>
          <span style={{ color: C.text, fontWeight: 700 }}>dreamithq.com</span><span>·</span><span>Doha · Dhaka · Madrid</span>
        </div>
      </AbsoluteFill>
      <Streak at={72} />
      <Sfx at={60} src="riser" vol={0.3} />
      <Sfx at={72} src="boom" vol={0.6} />
    </Stage>
  );
};

const Letterbox: React.FC = () => <><div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 40, background: "#000" }} /><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 40, background: "#000" }} /></>;

const PARTS = [S1Open, S2Origin, S3Group, S4Numbers, S5Engine, S6Universe, S7Global, S8Chair, S9End];
export const DreamGroup: React.FC = () => {
  const musicVol = (f: number) => {
    let near = 99;
    VO.forEach((s, i) => { const e = s + VO_LEN[i]; near = Math.min(near, f < s ? s - f : f > e ? f - e : 0); });
    return interpolate(near, [0, 14], [0.22, 0.5], clamp) * interpolate(f, [0, 20, DG_TOTAL - 90, DG_TOTAL], [0, 1, 1, 0], clamp);
  };
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {PARTS.map((P, i) => (
        <Sequence key={i} from={SCENES[i]} durationInFrames={SCENES[i + 1] - SCENES[i] + X}><Scene len={SCENES[i + 1] - SCENES[i]}><P /></Scene></Sequence>
      ))}
      {SCENES.slice(2, -1).map((s) => <Sfx key={s} at={s - 8} src="whoosh" vol={0.3} />)}
      <Grain />
      <Letterbox />
      <Audio src={staticFile("dgmusic.mp3")} volume={musicVol} />
      {VO.map((s, i) => <Sequence key={"vo" + i} from={s} durationInFrames={VO_LEN[i] + 10}><Audio src={staticFile(`dgvo/0${i + 1}.mp3`)} /></Sequence>)}
    </AbsoluteFill>
  );
};
