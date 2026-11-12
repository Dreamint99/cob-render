import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import vo from "../../public/nm/vo.json";

/* NinetyMins app promo (16:9, ~40 s). Real app screens (public/nm/*.png from the Flutter web build),
   British VO "George" (work/nmpromo/vo.py), music public/sportmusic.mp3. One scene per VO line. */

const { fontFamily: OUTFIT } = loadOutfit("normal", { weights: ["700", "800", "900"] });
const { fontFamily: INTER } = loadInter("normal", { weights: ["500", "600", "700"] });

const FPS = 30;
const LIME = "#c6ff3d", EMBER = "#ffb13b", LIVE = "#ff5a5f", SKY = "#47c6ff", TEXT = "#f2f7f3", MUTED = "#9fb8aa";
const PAD = 0.45; // seconds of air after each line
const LEAD = 0.5; // VO starts this far into each scene
export const NM_SCENES = vo.durs.map((d) => Math.round((d + PAD + LEAD) * FPS));
NM_SCENES[NM_SCENES.length - 1] += 45; // hold the end card
export const NM_TOTAL = NM_SCENES.reduce((a, b) => a + b, 0);

const ease = (f: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(f, [from, to], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });

const Bg: React.FC<{ hue?: string }> = ({ hue = LIME }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(60% 70% at ${20 + Math.sin(f / 60) * 6}% 10%, ${hue}33, transparent 60%),
                     radial-gradient(55% 70% at 95% 100%, ${EMBER}22, transparent 60%),
                     linear-gradient(135deg, #0d3524 0%, #06120d 62%)`,
      }}
    >
      <AbsoluteFill style={{ opacity: 0.06, background: "repeating-linear-gradient(90deg,#fff 0 2px,transparent 2px 160px)", transform: `translateX(${(-f * 0.6) % 160}px)` }} />
    </AbsoluteFill>
  );
};

const Phone: React.FC<{ src: string; x: number; y: number; w?: number; rot?: number; delay?: number; from?: number }> = ({ src, x, y, w = 440, rot = 0, delay = 0, from = 120 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 16, mass: 0.9 } });
  const float = Math.sin((f + delay * 3) / 28) * 6;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y + (1 - s) * from + float, width: w, opacity: s,
        transform: `rotate(${rot * s}deg)`, padding: 12, borderRadius: 54,
        background: "linear-gradient(160deg,#2a3a32,#0d1813 40%,#1b2a22)",
        boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 0 0 2px rgba(255,255,255,.08)",
      }}
    >
      <Img src={staticFile(`nm/${src}.png`)} style={{ width: "100%", display: "block", borderRadius: 44 }} />
    </div>
  );
};

const Head: React.FC<{ kick: string; title: React.ReactNode; sub?: string; color: string; x?: number; y?: number; w?: number }> = ({ kick, title, sub, color, x = 120, y = 300, w = 820 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w }}>
      <div style={{ opacity: ease(f, 2, 14), transform: `translateY(${ease(f, 2, 14, 20, 0)}px)`, display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 99, background: `${color}26`, color, fontFamily: OUTFIT, fontWeight: 800, fontSize: 30, letterSpacing: 1, textTransform: "uppercase" }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: color, boxShadow: `0 0 16px ${color}` }} />
        {kick}
      </div>
      <div style={{ marginTop: 26, fontFamily: OUTFIT, fontWeight: 900, fontSize: 104, lineHeight: 1.02, color: TEXT, letterSpacing: -2, opacity: ease(f, 6, 20), transform: `translateY(${ease(f, 6, 20, 40, 0)}px)` }}>{title}</div>
      {sub && <div style={{ marginTop: 26, fontFamily: INTER, fontWeight: 500, fontSize: 38, lineHeight: 1.35, color: MUTED, opacity: ease(f, 14, 28) }}>{sub}</div>}
    </div>
  );
};

const C: React.FC<{ c: string; children: React.ReactNode }> = ({ c, children }) => <span style={{ color: c }}>{children}</span>;

/* ── Scenes ── */

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f, fps, config: { damping: 11 } });
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", left: 120, top: 250, display: "flex", alignItems: "center", gap: 34 }}>
        <Img src={staticFile("nm/icon.png")} style={{ width: 190, height: 190, borderRadius: 44, transform: `scale(${pop}) rotate(${(1 - pop) * -30}deg)`, boxShadow: `0 0 80px ${LIME}44` }} />
        <div style={{ fontFamily: OUTFIT, fontWeight: 900, fontSize: 130, color: TEXT, letterSpacing: -3, opacity: ease(f, 8, 22), transform: `translateX(${ease(f, 8, 22, -40, 0)}px)` }}>NinetyMins</div>
      </div>
      <div style={{ position: "absolute", left: 124, top: 500, fontFamily: OUTFIT, fontWeight: 900, fontSize: 88, lineHeight: 1.05, color: TEXT, opacity: ease(f, 22, 38), transform: `translateY(${ease(f, 22, 38, 30, 0)}px)` }}>
        <C c={LIME}>Live</C> football &amp;<br /><C c={EMBER}>cricket</C>, in seconds.
      </div>
      <Phone src="06-cricket-live" x={1080} y={110} w={380} rot={-8} delay={10} />
      <Phone src="01-home-football" x={1420} y={60} w={400} rot={6} delay={4} />
    </AbsoluteFill>
  );
};

const Football: React.FC = () => {
  const f = useCurrentFrame();
  const leagues = ["Premier League", "Champions League", "LaLiga", "Serie A", "Bundesliga", "Saudi Pro League", "ISL", "World Cup"];
  return (
    <AbsoluteFill>
      <Bg hue={LIME} />
      <Head kick="Live now" color={LIME} title={<>Every <C c={LIME}>goal</C>,<br />as it happens</>} sub="Scores pushed to your phone in seconds." y={240} />
      <div style={{ position: "absolute", left: 120, top: 760, width: 860, display: "flex", flexWrap: "wrap", gap: 14 }}>
        {leagues.map((l, i) => (
          <div key={l} style={{ padding: "12px 24px", borderRadius: 99, background: "rgba(255,255,255,.08)", fontFamily: INTER, fontWeight: 700, fontSize: 28, color: TEXT, opacity: ease(f, 20 + i * 5, 32 + i * 5), transform: `translateY(${ease(f, 20 + i * 5, 32 + i * 5, 20, 0)}px)` }}>{l}</div>
        ))}
      </div>
      <Phone src="01-home-football" x={1240} y={50} w={440} rot={3} />
    </AbsoluteFill>
  );
};

const Cricket: React.FC = () => {
  const f = useCurrentFrame();
  const balls = [["1", "#2a3d33"], ["4", SKY], ["•", "#2a3d33"], ["6", "#9b7bff"], ["2", "#2a3d33"], ["W", LIVE]];
  return (
    <AbsoluteFill>
      <Bg hue={EMBER} />
      <Phone src="06-cricket-live" x={150} y={50} w={440} rot={-3} />
      <Head kick="Ball by ball" color={EMBER} title={<>Cricket, <C c={EMBER}>every ball</C></>} sub="Run rate, the batters at the crease and every delivery." x={760} y={260} w={1040} />
      <div style={{ position: "absolute", left: 760, top: 690, display: "flex", gap: 22 }}>
        {balls.map(([b, c], i) => {
          const s = ease(f, 40 + i * 9, 52 + i * 9);
          return (
            <div key={i} style={{ width: 110, height: 110, borderRadius: 55, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: OUTFIT, fontWeight: 900, fontSize: 52, color: c === SKY ? "#06120d" : "#fff", transform: `scale(${s})`, boxShadow: c !== "#2a3d33" ? `0 0 40px ${c}88` : undefined }}>{b}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Centre: React.FC = () => (
  <AbsoluteFill>
    <Bg hue={SKY} />
    <Head kick="Match centre" color={SKY} title={<>The whole <C c={SKY}>story</C></>} sub="Timeline · Stats · Line-ups" x={120} y={90} w={1700} />
    <Phone src="03-match-timeline" x={250} y={410} w={420} rot={-6} delay={10} from={300} />
    <Phone src="04-match-stats" x={750} y={360} w={420} delay={22} from={300} />
    <Phone src="05-match-lineups" x={1250} y={410} w={420} rot={6} delay={34} from={300} />
  </AbsoluteFill>
);

const Alerts: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame: f - 70, fps, config: { damping: 13 } });
  return (
    <AbsoluteFill>
      <Bg hue={LIVE} />
      <Phone src="07-tables" x={130} y={90} w={400} rot={-4} />
      <Phone src="08-alerts" x={600} y={60} w={420} rot={3} delay={14} />
      <Head kick="Alerts" color={LIVE} title={<>Never miss a <C c={LIVE}>goal</C></>} sub="Follow your team. Get the alert in seconds." x={1100} y={250} w={760} />
      <div style={{ position: "absolute", left: 1100, top: 780 + (1 - drop) * -120, opacity: drop, width: 680, padding: "22px 26px", borderRadius: 28, background: "rgba(20,32,26,.95)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", display: "flex", gap: 20, alignItems: "center", border: "1px solid rgba(255,255,255,.1)" }}>
        <Img src={staticFile("nm/icon.png")} style={{ width: 70, height: 70, borderRadius: 18 }} />
        <div>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 30, color: TEXT }}>⚽ GOAL! Arsenal</div>
          <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 26, color: MUTED }}>Bayern 2-2 Arsenal (82')</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Bg />
      <Img src={staticFile("nm/icon.png")} style={{ position: "absolute", top: 170, width: 230, height: 230, borderRadius: 54, transform: `scale(${pop})`, boxShadow: `0 0 120px ${LIME}55` }} />
      <div style={{ position: "absolute", top: 440, fontFamily: OUTFIT, fontWeight: 900, fontSize: 140, color: TEXT, letterSpacing: -3, opacity: ease(f, 6, 20) }}>NinetyMins</div>
      <div style={{ position: "absolute", top: 610, fontFamily: OUTFIT, fontWeight: 800, fontSize: 64, color: LIME, opacity: ease(f, 16, 30) }}>Never miss a minute.</div>
      <div style={{ position: "absolute", top: 760, display: "flex", gap: 20, alignItems: "center", opacity: ease(f, 40, 55), padding: "20px 40px", borderRadius: 99, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)" }}>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 36, color: TEXT }}>Coming soon on Google Play</span>
      </div>
      <div style={{ position: "absolute", top: 900, fontFamily: INTER, fontWeight: 600, fontSize: 30, color: MUTED, opacity: ease(f, 50, 65) }}>ninetymins.dreamithq.com · A DreamIT app</div>
    </AbsoluteFill>
  );
};

const SCENES = [Intro, Football, Cricket, Centre, Alerts, Outro];

export const NmPromo: React.FC = () => {
  const f = useCurrentFrame();
  let at = 0;
  const vol = interpolate(f, [0, 15, NM_TOTAL - 45, NM_TOTAL], [0, 0.16, 0.16, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#06120d" }}>
      <Audio src={staticFile("sportmusic.mp3")} volume={vol} />
      {SCENES.map((S, i) => {
        const from = at;
        at += NM_SCENES[i];
        return (
          <Sequence key={i} from={from} durationInFrames={NM_SCENES[i]}>
            <Fade len={NM_SCENES[i]}><S /></Fade>
            <Sequence from={Math.round(LEAD * FPS)}>
              <Audio src={staticFile(`nm/vo${i}.mp3`)} />
            </Sequence>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, len - 8, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
