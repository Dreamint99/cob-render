import React from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// FIFA-style highlight of a friendly match (D-Box Stadium). Segments are pre-cut + graded in public/fifa/seg.
const SEGS: { id: string; len: number; drone?: boolean }[] = [
  { id: "intro", len: 372 }, { id: "A", len: 93 }, { id: "B", len: 132, drone: true }, { id: "C", len: 72 },
  { id: "D", len: 60 }, { id: "E", len: 132, drone: true }, { id: "F", len: 108 }, { id: "G", len: 120, drone: true },
  { id: "H", len: 120 }, { id: "I", len: 75 }, { id: "J", len: 120 }, { id: "K", len: 74 }, { id: "L", len: 66 },
  { id: "M", len: 223 }, { id: "N", len: 90, drone: true }, { id: "O", len: 42 }, { id: "outro", len: 600 },
];
const START: Record<string, number> = {};
SEGS.reduce((t, s) => ((START[s.id] = t), t + s.len), 0);
export const FIFA_LEN = SEGS.reduce((t, s) => t + s.len, 0);

const VO: [number, number, number][] = [ // [file, startFrame, seconds]
  [1, 10, 12.16], [2, 377, 5.04], [3, 602, 4.8], [4, 757, 5.68], [5, 972, 3.52], [6, 1237, 4.8],
  [7, 1395, 3.44], [8, 1491, 4.16], [9, 1619, 7.44], [12, 1904, 19.36],
];
const SFX: [string, number, number][] = [ // [name, frame, volume]
  ["boom", 8, 0.9], ["boom2", 95, 0.8], ["boom2", 185, 0.8], ["boom", 300, 0.9], ["whistle", 375, 0.8],
  ["whoosh", 595, 0.5], ["whoosh", 859, 0.5], ["whoosh", 1207, 0.5], ["boom", 1402, 1], ["kick", 1427, 0.9],
  ["roar", 1407, 1], ["whoosh", 1541, 0.9], ["boom2", 1544, 0.8], ["boom", 1681, 0.7], ["final", 1899, 0.9], ["boom", 1903, 0.9], ["boom2", 2049, 0.8], ["roar", 2049, 0.6], ["boom", 2349, 0.9],
];

const GREEN = "#046a38", GOLD = "#f6b21a", DEEP = "#06281a", RED = "#e01b22";
const F = "'Bebas Neue', 'Anton', sans-serif", P = "'Montserrat', 'Poppins', sans-serif";

const voAt = (f: number) => VO.some(([, s, sec]) => f >= s - 6 && f < s + sec * 30 + 6);

const Clip: React.FC<{ id: string; len: number; drone?: boolean }> = ({ id, len, drone }) => {
  const f = useCurrentFrame();
  const p = f / len;
  // fake drone: slow push + rise + slight bank
  const s = drone ? 1.06 + 0.16 * p : id === "intro" || id === "outro" ? 1.04 + 0.22 * p : 1.03;
  const y = drone || id === "intro" ? interpolate(p, [0, 1], [30, -40]) : 0;
  const r = drone ? interpolate(p, [0, 1], [-1.2, 0.6]) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <OffthreadVideo src={staticFile(`fifa/seg/${id}.mp4`)} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateY(${y}px) scale(${s}) rotate(${r}deg)` }} />
    </AbsoluteFill>
  );
};

// white flash + light streak at every cut
const CutFlash: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 2, 9], [0, 0.55, 0], { extrapolateRight: "clamp" });
  const x = interpolate(f, [0, 12], [-60, 160], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "white", opacity: o, mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", top: -200, left: `${x}%`, width: 260, height: 1600, transform: "rotate(18deg)",
        background: "linear-gradient(90deg, transparent, rgba(255,240,190,0.55), transparent)", opacity: interpolate(f, [0, 12], [1, 0], { extrapolateRight: "clamp" }), filter: "blur(18px)" }} />
    </AbsoluteFill>
  );
};

const Logo: React.FC<{ h: number; style?: React.CSSProperties }> = ({ h, style }) => (
  <Img src={staticFile("cob/logo-light.png")} style={{ height: h, ...style }} />
);

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (at: number) => spring({ frame: f - at, fps, config: { damping: 14, stiffness: 140 } });
  const fade = (a: number, b: number) => interpolate(f, [a, a + 10, b - 10, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(f, [355, 375], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, rgba(4,106,56,0.25), rgba(2,20,10,0.85) 75%)` }} />
      <Logo h={70} style={{ position: "absolute", top: 60, left: "50%", transform: `translateX(-50%) scale(${pop(0)})` }} />
      {/* 1: presents */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fade(10, 100) }}>
        <div style={{ fontFamily: F, fontSize: 130, color: "white", transform: `scale(${0.8 + 0.2 * pop(10)})`, textShadow: "0 8px 40px #000" }}>DREAM INTERNATIONAL</div>
        <div style={{ fontFamily: P, fontWeight: 700, fontSize: 40, color: GOLD, letterSpacing: 18, marginTop: 6 }}>PRESENTS</div>
      </AbsoluteFill>
      {/* 2: friendly match */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fade(95, 190) }}>
        <div style={{ fontFamily: P, fontWeight: 800, fontSize: 38, color: GOLD, letterSpacing: 14 }}>FRIENDLY</div>
        <div style={{ fontFamily: F, fontSize: 200, color: "white", lineHeight: 0.95, transform: `scale(${0.7 + 0.3 * pop(95)})`, textShadow: "0 10px 50px #000" }}>FOOTBALL MATCH</div>
      </AbsoluteFill>
      {/* 3: teams */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 50, opacity: fade(185, 300) }}>
        <TeamCard name={["YOUNG", "TIGERS"]} color={GOLD} x={interpolate(pop(185), [0, 1], [-700, 0])} />
        <div style={{ fontFamily: F, fontSize: 150, color: "white", transform: `scale(${pop(200)})`, textShadow: `0 0 40px ${GOLD}` }}>VS</div>
        <TeamCard name={["DREAM INT'L", "LEGENDS"]} color={GREEN} x={interpolate(pop(190), [0, 1], [700, 0])} />
      </AbsoluteFill>
      {/* 4: stadium */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fade(298, 372) }}>
        <div style={{ fontFamily: P, fontWeight: 700, fontSize: 36, color: GOLD, letterSpacing: 12 }}>LIVE FROM</div>
        <div style={{ fontFamily: F, fontSize: 190, color: "white", transform: `scale(${0.8 + 0.2 * pop(298)})`, textShadow: "0 10px 50px #000" }}>D-BOX STADIUM</div>
        <div style={{ width: interpolate(pop(305), [0, 1], [0, 700]), height: 8, background: `linear-gradient(90deg, ${GREEN}, ${GOLD}, ${RED})`, borderRadius: 4 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TeamCard: React.FC<{ name: string[]; color: string; x: number }> = ({ name, color, x }) => (
  <div style={{ transform: `translateX(${x}px) skewX(-8deg)`, background: `linear-gradient(135deg, ${color}, ${DEEP})`, padding: "34px 60px", borderRadius: 14,
    boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 4px rgba(255,255,255,0.15) inset`, minWidth: 560, textAlign: "center" }}>
    <div style={{ fontFamily: F, fontSize: 70, color: "rgba(255,255,255,0.85)", lineHeight: 1 }}>{name[0]}</div>
    <div style={{ fontFamily: F, fontSize: 120, color: "white", lineHeight: 0.95 }}>{name[1]}</div>
  </div>
);

const ScoreBug: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 16 } });
    return (
    <div style={{ position: "absolute", top: 48, left: 56, display: "flex", alignItems: "stretch", height: 64, transform: `translateX(${interpolate(inn, [0, 1], [-600, 0])}px)`,
      fontFamily: F, fontSize: 44, color: "white", boxShadow: "0 8px 30px rgba(0,0,0,0.5)", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ background: "#fff", padding: "0 14px", display: "flex", alignItems: "center" }}><Img src={staticFile("cob/logo.png")} style={{ height: 32 }} /></div>
      <div style={{ background: GOLD, color: DEEP, padding: "0 20px", display: "flex", alignItems: "center" }}>YTG</div>
      <div style={{ background: DEEP, padding: "0 22px", display: "flex", alignItems: "center", gap: 14 }}>2<span style={{ opacity: 0.5 }}>-</span>2</div>
      <div style={{ background: GREEN, padding: "0 20px", display: "flex", alignItems: "center" }}>DIL</div>
      <div style={{ background: "rgba(0,0,0,0.75)", padding: "0 20px", display: "flex", alignItems: "center", color: GOLD }}>HIGHLIGHTS</div>
    </div>
  );
};

const LiveBug: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 52, right: 60, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: RED, padding: "8px 18px", borderRadius: 6, fontFamily: F, fontSize: 34, color: "white" }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: "white", opacity: 0.4 + 0.6 * Math.abs(Math.sin(f / 10)) }} />LIVE
      </div>
      <Logo h={52} />
    </div>
  );
};

const LowerThird: React.FC<{ top: string; main: string }> = ({ top, main }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = spring({ frame: f, fps, config: { damping: 15 } });
  const o = interpolate(f, [80, 100], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 80, bottom: 90, opacity: o, transform: `translateX(${interpolate(i, [0, 1], [-500, 0])}px)` }}>
      <div style={{ background: GOLD, color: DEEP, fontFamily: P, fontWeight: 800, fontSize: 26, padding: "6px 18px", display: "inline-block", letterSpacing: 4 }}>{top}</div>
      <div style={{ background: `linear-gradient(90deg, ${DEEP}, rgba(6,40,26,0.75))`, color: "white", fontFamily: F, fontSize: 64, padding: "6px 26px", borderLeft: `8px solid ${GREEN}` }}>{main}</div>
    </div>
  );
};

// ball light: glowing orb + flare that follows the ball during the slow-mo shot
const BALL: [number, number, number][] = [[0, 1181, 661], [12, 1256, 643], [24, 1339, 621], [36, 1434, 607], [48, 1547, 592], [60, 1057, 568], [73, 898, 561]];
const BALL_C: [number, number, number][] = [[0, 1292, 681], [14, 1084, 829], [28, 932, 933], [42, 861, 972], [56, 861, 968], [66, 898, 973]];
const BallLight: React.FC<{ path?: [number, number, number][]; len: number }> = ({ path = BALL, len }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, path.map((p) => p[0]), path.map((p) => p[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(f, path.map((p) => p[0]), path.map((p) => p[2]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(f, [0, 8, len - 12, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + 0.15 * Math.sin(f / 3);
  return (
    <AbsoluteFill style={{ opacity: o, mixBlendMode: "screen", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: x - 90, top: y - 90, width: 180, height: 180, borderRadius: 90, transform: `scale(${pulse})`,
        background: "radial-gradient(circle, rgba(255,255,230,0.95) 0%, rgba(255,210,90,0.6) 25%, rgba(246,178,26,0.25) 50%, transparent 70%)" }} />
      <div style={{ position: "absolute", left: x - 400, top: y - 3, width: 800, height: 6, background: "linear-gradient(90deg, transparent, rgba(255,240,200,0.9), transparent)", filter: "blur(2px)" }} />
      <div style={{ position: "absolute", left: x - 3, top: y - 160, width: 6, height: 320, background: "linear-gradient(180deg, transparent, rgba(255,240,200,0.7), transparent)", filter: "blur(2px)" }} />
    </AbsoluteFill>
  );
};

const BigText: React.FC<{ text: string; len: number }> = ({ text, len }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 9, stiffness: 160 } });
  const o = interpolate(f, [len - 12, len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o }}>
      <div style={{ fontFamily: F, fontSize: 210, color: "white", transform: `scale(${0.4 + 0.6 * s}) rotate(-4deg)`,
        textShadow: `0 0 30px ${GOLD}, 0 10px 40px #000`, WebkitTextStroke: `3px ${GOLD}` }}>{text}</div>
    </AbsoluteFill>
  );
};

const ReplayWipe: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 10, 18, 28], [-120, 0, 0, 120], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}%) skewX(-12deg)` }}>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${GREEN}, ${DEEP} 45%, ${DEEP} 55%, ${GREEN})`, justifyContent: "center", alignItems: "center" }}>
        <Logo h={90} />
        <div style={{ fontFamily: F, fontSize: 170, color: "white", marginTop: 10 }}>REPLAY</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ReplayBug: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 56, bottom: 60, display: "flex", alignItems: "center", gap: 12, background: "rgba(6,40,26,0.85)", padding: "8px 22px", borderRadius: 6, borderLeft: `6px solid ${GOLD}` }}>
      <div style={{ width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: `22px solid ${GOLD}`, opacity: f % 30 < 18 ? 1 : 0.3 }} />
      <div style={{ fontFamily: F, fontSize: 44, color: "white" }}>REPLAY · SLOW MOTION</div>
    </div>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = (at: number) => spring({ frame: f - at, fps, config: { damping: 14 } });
  const win = (a: number, b: number) => interpolate(f, [a, a + 12, b - 12, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bg = interpolate(f, [0, 20, 500, 530], [0.55, 0.8, 0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const end = interpolate(f, [575, 600], [1, 0], { extrapolateLeft: "clamp" });
  const Scorers: React.FC<{ team: string; color: string; fg: string; rows: [string, string][]; from: number; dir: number }> = ({ team, color, fg, rows, from, dir }) => (
    <div style={{ width: 640, transform: `translateX(${(1 - sp(from)) * 600 * dir}px)`, opacity: sp(from) }}>
      <div style={{ background: color, color: fg, fontFamily: F, fontSize: 64, padding: "10px 30px" }}>{team}</div>
      {rows.map(([n, c], i) => (
        <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(6,40,26,0.9)", borderBottom: "2px solid rgba(255,255,255,0.1)",
          padding: "16px 30px", transform: `translateY(${(1 - sp(from + 20 + i * 12)) * 40}px)`, opacity: sp(from + 20 + i * 12) }}>
          <div style={{ fontFamily: F, fontSize: 60, color: "white" }}>⚽ {n}</div>
          <div style={{ fontFamily: P, fontWeight: 700, fontSize: 26, color: GOLD, letterSpacing: 3 }}>{c}</div>
        </div>
      ))}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: end }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(4,106,56,0.6), rgba(2,20,10,1) 75%)", opacity: bg }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: win(0, 150) }}>
        <div style={{ fontFamily: P, fontWeight: 800, fontSize: 40, color: GOLD, letterSpacing: 16 }}>FULL TIME</div>
        <div style={{ display: "flex", alignItems: "stretch", fontFamily: F, color: "white", marginTop: 16, transform: `scale(${0.6 + 0.4 * sp(6)})`, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
          <div style={{ background: GOLD, color: DEEP, padding: "16px 40px", fontSize: 80, display: "flex", alignItems: "center" }}>YOUNG TIGERS</div>
          <div style={{ background: DEEP, padding: "0 46px", fontSize: 170, display: "flex", alignItems: "center", gap: 30 }}>2<span style={{ opacity: 0.5 }}>-</span>2</div>
          <div style={{ background: GREEN, padding: "16px 40px", fontSize: 80, display: "flex", alignItems: "center" }}>DREAM INT'L LEGENDS</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: win(140, 455) }}>
        <div style={{ fontFamily: F, fontSize: 110, color: "white", marginBottom: 30, textShadow: `0 0 30px ${GOLD}`, transform: `scale(${0.7 + 0.3 * sp(140)})` }}>GOAL SCORERS</div>
        <div style={{ display: "flex", gap: 60 }}>
          <Scorers team="YOUNG TIGERS" color={GOLD} fg={DEEP} rows={[["SADIK", "BANGLADESH"], ["EMRUL", "BANGLADESH"]]} from={150} dir={-1} />
          <Scorers team="DREAM INT'L LEGENDS" color={GREEN} fg="white" rows={[["EMRAN", "FROM FRANCE"], ["MASUM", "FROM SERBIA"]]} from={260} dir={1} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: win(445, 600) }}>
        <Logo h={150} style={{ transform: `scale(${0.7 + 0.3 * sp(445)})` }} />
        <div style={{ fontFamily: P, fontWeight: 700, fontSize: 34, color: GOLD, letterSpacing: 10, marginTop: 30 }}>DREAM INTERNATIONAL PRESENTS</div>
        <div style={{ fontFamily: P, fontWeight: 600, fontSize: 28, color: "white", letterSpacing: 6, marginTop: 10, opacity: 0.8 }}>FRIENDLY FOOTBALL MATCH · D-BOX STADIUM</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const musicVol = (f: number) => {
  const base = voAt(f) ? 0.16 : 0.34;
  const fadeOut = interpolate(f, [FIFA_LEN - 45, FIFA_LEN], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return base * fadeOut * interpolate(f, [0, 15], [0, 1], { extrapolateRight: "clamp" });
};

if (typeof document !== "undefined") {
  const h = delayRender("fifa fonts");
  Promise.all([["Bebas Neue", "fonts/BebasNeue-Regular.ttf"], ["Montserrat", "fonts/Montserrat.ttf"], ["Anton", "fonts/Anton-Regular.ttf"]].map(([n, u]) => {
    const f = new FontFace(n, `url(${staticFile(u)})`, { weight: "100 900" });
    return f.load().then(() => document.fonts.add(f));
  })).catch(() => {}).finally(() => continueRender(h));
}

export const FifaMatch: React.FC = () => {
  const K = START.K, M = START.M;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {SEGS.map((s) => (
        <Sequence key={s.id} from={START[s.id]} durationInFrames={s.len}>
          <Clip {...s} />
          {s.id !== "intro" && <Sequence durationInFrames={14}><CutFlash /></Sequence>}
        </Sequence>
      ))}
      <Sequence from={START.C} durationInFrames={66}><BallLight path={BALL_C} len={66} /></Sequence>
      <Sequence from={K} durationInFrames={74}><BallLight len={74} /></Sequence>
      <Sequence from={K + 30} durationInFrames={100}><BigText text="WHAT A STRIKE!" len={100} /></Sequence>
      <Sequence from={0} durationInFrames={372}><Intro /></Sequence>
      <Sequence from={372} durationInFrames={START.outro - 372}><ScoreBug /><LiveBug /></Sequence>
      <Sequence from={START.A + 20} durationInFrames={100}><LowerThird top="FRIENDLY MATCH" main="YOUNG TIGERS vs DREAM INT'L LEGENDS" /></Sequence>
      <Sequence from={START.F + 10} durationInFrames={100}><LowerThird top="VENUE" main="D-BOX STADIUM" /></Sequence>
      <Sequence from={M + 14} durationInFrames={209}><ReplayBug /></Sequence>
      <Sequence from={M - 14} durationInFrames={30}><ReplayWipe /></Sequence>
      <Sequence from={START.outro}><Outro /></Sequence>

      {/* audio */}
      <Audio src={staticFile("fifa/music.mp3")} volume={(f) => musicVol(f)} />
      {Array.from({ length: Math.ceil(FIFA_LEN / 600) }).map((_, i) => (
        <Sequence key={"c" + i} from={i * 600} durationInFrames={660}>
          <Audio src={staticFile("fifa/crowd.mp3")} volume={(f) => (voAt(i * 600 + f) ? 0.28 : 0.45) * interpolate(f, [0, 30, 630, 660], [0, 1, 1, 0], { extrapolateRight: "clamp" })} />
        </Sequence>
      ))}
      {VO.map(([n, at]) => (
        <Sequence key={"v" + n} from={at}><Audio src={staticFile(`fifa/vo${String(n).padStart(2, "0")}.mp3`)} volume={1} /></Sequence>
      ))}
      {SFX.map(([n, at, v], i) => (
        <Sequence key={"s" + i} from={at}><Audio src={staticFile(`fifa/${n}.mp3`)} volume={v} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
