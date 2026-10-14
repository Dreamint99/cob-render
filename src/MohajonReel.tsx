// 9:16 Reel — fal (Flux + Kling) AI character clips + real dashboard captures + Bangla VO.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import { C, FONT, Words, Pill, Phone, Particles, Backdrop, SwipeFlash } from "./Mohajon";

const s = (sec: number) => Math.round(sec * 30);
const R = (p: string) => staticFile("reel/" + p);
const MJ = (p: string) => staticFile("mohajon/" + p);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// scene lengths (sec) + VO index
const SC = [
  { id: "a", len: 4.6, vo: 1 },
  { id: "slam", len: 1.6, vo: 0 },
  { id: "b", len: 5.4, vo: 2 },
  { id: "c", len: 5.0, vo: 3 },
  { id: "cta", len: 5.2, vo: 4 },
];
let acc = 0;
const L: Record<string, { from: number; len: number }> = {};
for (const x of SC) { L[x.id] = { from: acc, len: s(x.len) }; acc += s(x.len); }
export const REEL_TOTAL = acc;

const Clip: React.FC<{ src: string; len: number; zoom?: [number, number] }> = ({ src, len, zoom = [1.04, 1.14] }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, len], zoom, clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo src={R(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, filter: "saturate(1.08) contrast(1.05)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,7,24,0.55) 0%, transparent 25%, transparent 55%, rgba(10,7,24,0.85) 100%)" }} />
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ text: string; hl?: string[]; y?: number; at?: number; size?: number }> = ({ text, hl, y = 1420, at = 4, size = 84 }) => (
  <div style={{ position: "absolute", top: y, left: 60, right: 60, textShadow: "0 6px 30px rgba(0,0,0,0.8)" }}>
    <Words text={text} at={at} size={size} hl={hl} stagger={3} />
  </div>
);

const Card: React.FC<{ src: string; at: number; x: number; y: number; w: number; rot?: number; focus?: [number, number, number] }> = ({ src, at, x, y, w, rot = 0, focus }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 13, stiffness: 140 } });
  const h = w * 0.75;
  const [z, fx, fy] = focus ?? [1, 960, 540];
  const k = (w / 1920) * z;
  return (
    <div style={{ position: "absolute", left: x, top: y + Math.sin((f - at) / 20) * 8, width: w, height: h, borderRadius: 30, overflow: "hidden", background: "white",
      transform: `translate(-50%,-50%) scale(${p}) rotate(${rot * p}deg)`, boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 0 0 4px rgba(139,108,255,0.6)" }}>
      <Img src={MJ(`cap/${src}.png`)} style={{ position: "absolute", width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${w / 2 - fx * k}px, ${h / 2 - fy * k}px) scale(${k})` }} />
    </div>
  );
};

const SceneA: React.FC = () => (
  <AbsoluteFill>
    <Clip src="a.mp4" len={L.a.len} />
    <Caption text="খাতার হিসাব মেলাতে মেলাতেই দিন শেষ?" hl={["দিন", "শেষ?"]} />
  </AbsoluteFill>
);

const Slam: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 9, stiffness: 220 } });
  const lp = spring({ frame: f - 18, fps, config: { damping: 12 } });
  const sh = f < 10 ? (random(`s${f}`) - 0.5) * 30 : 0;
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `translate(${sh}px,0)` }}>
        <div style={{ fontFamily: FONT, fontSize: 220, color: "white", transform: `scale(${3 - 2 * p})`, opacity: interpolate(f, [16, 22], [1, 0], clamp), textShadow: `0 0 60px ${C.violet}` }}>আর না!</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Img src={MJ("brand/wordmark-white.png")} style={{ width: 820, opacity: lp, transform: `scale(${0.6 + 0.4 * lp})`, filter: `drop-shadow(0 0 50px ${C.violet})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "white", opacity: interpolate(f, [16, 19, 30], [0, 0.9, 0], clamp) }} />
    </AbsoluteFill>
  );
};

const SceneB: React.FC = () => (
  <AbsoluteFill>
    <Clip src="b.mp4" len={L.b.len} />
    <Card src="pos3" at={14} x={540} y={520} w={900} rot={-3} focus={[1.5, 1150, 450]} />
    <Card src="home" at={62} x={560} y={1010} w={860} rot={2} focus={[1.7, 900, 240]} />
    <Pill at={30} x={250} y={260} icon="pos" color={C.green}>দুই ট্যাপে বিক্রি</Pill>
    <Pill at={80} x={820} y={1290} icon="khata" color={C.amber}>বাকি · স্টক</Pill>
    <Caption text="সব এক জায়গায়" hl={["এক", "জায়গায়"]} y={1480} at={40} size={96} />
  </AbsoluteFill>
);

const SceneC: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ph = spring({ frame: f - 8, fps, config: { damping: 15 } });
  const toast = spring({ frame: f - 60, fps, config: { damping: 12, stiffness: 160 } });
  return (
    <AbsoluteFill>
      <Clip src="c.mp4" len={L.c.len} />
      <div style={{ position: "absolute", right: 70, top: 300, transform: `translateX(${(1 - ph) * 600}px) rotate(${4 * ph}deg)` }}>
        <Phone src="m_shop_full" width={380} scroll={interpolate(f, [20, 140], [0, 240], { ...clamp, easing: Easing.inOut(Easing.quad) })} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 160, transform: `translateY(${(1 - toast) * -200}px)`, opacity: toast, display: "flex", gap: 18, alignItems: "center",
        background: "white", borderRadius: 26, padding: "22px 28px", boxShadow: "0 30px 70px rgba(0,0,0,0.5)", fontFamily: FONT, borderLeft: `10px solid ${C.green}` }}>
        <Img src={MJ("marks/online-order.png")} style={{ width: 80, height: 80, borderRadius: 14 }} />
        <div><div style={{ fontSize: 40, color: C.ink }}>🔔 নতুন Order এসেছে!</div><div style={{ fontSize: 28, color: "#6B6496" }}>রহিম ফার্মেসি · ঘরে বসেই অর্ডার</div></div>
      </div>
      <Caption text="নিজের Website, ঘরে বসেই Order" hl={["Website,", "Order"]} y={1450} at={20} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lp = spring({ frame: f - 4, fps, config: { damping: 12 } });
  const btn = spring({ frame: f - 28, fps, config: { damping: 10 } });
  const hit = spring({ frame: f - s(3.6), fps, config: { damping: 8, stiffness: 200 } });
  return (
    <AbsoluteFill>
      <Backdrop />
      <Particles n={40} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 50, padding: 60 }}>
        <Img src={MJ("brand/wordmark-white.png")} style={{ width: 760 + hit * 60, opacity: lp, transform: `scale(${0.7 + 0.3 * lp})`, filter: `drop-shadow(0 0 ${40 + hit * 40}px ${C.violet})` }} />
        <Words text="প্রতিটি দোকান, হোক ডিজিটাল।" at={10} size={78} hl={["ডিজিটাল।"]} />
        <div style={{ transform: `scale(${btn * (1 + 0.04 * Math.sin(f / 6))})`, opacity: btn, padding: "30px 64px", borderRadius: 999, fontFamily: FONT, fontSize: 60, color: "white",
          background: `linear-gradient(135deg, ${C.violet}, ${C.violet2})`, boxShadow: "0 20px 60px rgba(109,74,255,0.7)" }}>বিনামূল্যে শুরু করুন →</div>
        <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 54, color: "white", opacity: interpolate(f, [50, 65], [0, 1], clamp) }}>mohajon.pages.dev</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const VIEW: Record<string, React.FC> = { a: SceneA, slam: Slam, b: SceneB, c: SceneC, cta: Cta };
const FX: [number, string, number][] = [
  [L.slam.from - 40, "riser", 0.4], [L.slam.from, "impact", 0.8], [L.slam.from + 18, "shimmer", 0.5],
  [L.b.from + 14, "pop", 0.6], [L.b.from + 62, "pop", 0.6], [L.c.from + 60, "notify", 0.7], [L.cta.from + s(3.6), "impact", 0.6],
  [L.b.from - 5, "whoosh", 0.4], [L.c.from - 5, "whoosh", 0.4], [L.cta.from - 5, "whoosh", 0.4],
];

export const MohajonReel: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    {SC.map((x) => { const V = VIEW[x.id]; return <Sequence key={x.id} from={L[x.id].from} durationInFrames={L[x.id].len}><V /></Sequence>; })}
    {["b", "c", "cta"].map((id) => <Sequence key={"sw" + id} from={L[id].from - 4} durationInFrames={14}><SwipeFlash /></Sequence>)}
    <Audio src={MJ("music.mp3")} startFrom={s(20)} volume={(fr) => interpolate(fr, [0, 10, REEL_TOTAL - 30, REEL_TOTAL], [0, 0.32, 0.32, 0], clamp)} />
    {SC.filter((x) => x.vo).map((x) => <Sequence key={"vo" + x.id} from={L[x.id].from + 6}><Audio src={R(`vo/0${x.vo}.mp3`)} /></Sequence>)}
    {FX.map(([at, sfx, v], i) => <Sequence key={i} from={Math.max(0, at)} durationInFrames={s(3)}><Audio src={MJ(`sfx/${sfx}.mp3`)} volume={v} /></Sequence>)}
  </AbsoluteFill>
);
