// Avatar presenter video: HeyGen digital-twin clip (right card) + Claude graphics (left) + Bangla captions.
// Per video, only the JSON (data) changes. Drop the real HeyGen render at public/avatar/<id>.mp4.
import React from "react";
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import data from "./tech1.json";

export const AV_FPS = 30;
export const avTotal = Math.ceil(data.duration * AV_FPS) + 45;

const C = { bg: "#05070f", ink: "#eaf2ff", dim: "#8aa0c8", acc: "#2ee6a6", acc2: "#3b82ff" };
const BN = "'Hind Siliguri', 'Noto Sans Bengali', sans-serif";

type Seg = { from: number; to: number; kind: string; num?: string; title: string; sub?: string; icon?: string };
type Word = { start: number; end: number; word: string };

const Grid: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 40%, #0d1b3d 0%, ${C.bg} 65%)` }}>
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${C.acc2}22 1px, transparent 1px), linear-gradient(90deg, ${C.acc2}22 1px, transparent 1px)`,
        backgroundSize: "80px 80px", backgroundPosition: `0 ${(f * 0.6) % 80}px`,
        maskImage: "linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent)",
      }} />
    </AbsoluteFill>
  );
};

const AvatarCard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 18 } });
  const src = data.avatar;
  return (
    <div style={{
      position: "absolute", right: 110, top: 90, width: 660, height: 880, borderRadius: 32, overflow: "hidden",
      transform: `translateX(${(1 - s) * 400}px)`, opacity: s,
      boxShadow: `0 0 0 3px ${C.acc}aa, 0 0 80px ${C.acc}44, 0 40px 80px #000a`,
    }}>
      <OffthreadVideo src={staticFile(src)} muted={data.avatarMuted}
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "22px 28px",
        background: "linear-gradient(0deg, #000c, transparent)" }}>
        <div style={{ fontFamily: BN, fontSize: 34, fontWeight: 700, color: C.ink }}>{data.name}</div>
        <div style={{ fontFamily: BN, fontSize: 24, color: C.acc }}>{data.role}</div>
      </div>
      <div style={{ position: "absolute", top: 22, left: 22, display: "flex", alignItems: "center", gap: 10,
        background: "#000a", borderRadius: 30, padding: "8px 18px", fontFamily: "Poppins, sans-serif", fontWeight: 700,
        fontSize: 20, color: C.ink }}>
        <span style={{ width: 12, height: 12, borderRadius: 6, background: "#ff3b3b",
          opacity: Math.floor(f / 15) % 2 ? 1 : 0.3 }} /> TECH UPDATE
      </div>
    </div>
  );
};

const Panel: React.FC<{ seg: Seg }> = ({ seg }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = Math.round((seg.to - seg.from) * fps);
  const a = spring({ frame: f, fps, config: { damping: 16 } });
  const out = interpolate(f, [len - 8, len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const big = seg.kind === "intro" || seg.kind === "cta";
  return (
    <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 980, display: "flex",
      flexDirection: "column", justifyContent: "center", opacity: a * out, transform: `translateY(${(1 - a) * 40}px)` }}>
      {seg.num && (
        <div style={{ fontFamily: "Bebas Neue", fontSize: 200, lineHeight: 0.9, color: "transparent",
          WebkitTextStroke: `3px ${C.acc}` }}>{seg.num}</div>
      )}
      {seg.icon && <div style={{ fontSize: 110, marginBottom: 10 }}>{seg.icon}</div>}
      <div style={{ fontFamily: BN, fontWeight: 700, fontSize: big ? 92 : 78, lineHeight: 1.25, color: C.ink,
        wordSpacing: 4 }}>{seg.title}</div>
      <div style={{ height: 6, width: interpolate(a, [0, 1], [0, 220]), background: C.acc, borderRadius: 3,
        margin: "26px 0" }} />
      {seg.sub && <div style={{ fontFamily: BN, fontSize: 40, color: C.dim, lineHeight: 1.5 }}>{seg.sub}</div>}
      {seg.kind === "cta" && (
        <div style={{ marginTop: 20, alignSelf: "flex-start", background: "#ff0033", color: "#fff", fontFamily: BN,
          fontWeight: 700, fontSize: 44, padding: "16px 44px", borderRadius: 14,
          transform: `scale(${1 + 0.04 * Math.sin(f / 5)})` }}>সাবস্ক্রাইব করুন 🔔</div>
      )}
    </div>
  );
};

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / AV_FPS;
  const words = data.words as Word[];
  const i = words.findIndex((w) => t >= w.start - 0.05 && t < w.end + 0.25);
  if (i < 0) return null;
  const lo = Math.floor(i / 5) * 5;
  const line = words.slice(lo, lo + 5);
  return (
    <div style={{ position: "absolute", left: 120, right: 860, bottom: 70, fontFamily: BN, fontSize: 40,
      fontWeight: 600, color: C.ink, wordSpacing: 6 }}>
      {line.map((w, k) => (
        <span key={k} style={{ color: lo + k === i ? C.acc : C.ink, marginRight: 12 }}>{w.word}</span>
      ))}
    </div>
  );
};

export const AvatarTech: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Grid />
      <AvatarCard />
      {(data.segs as Seg[]).map((s, k) => (
        <Sequence key={k} from={Math.round(s.from * fps)} durationInFrames={Math.round((s.to - s.from) * fps)}>
          <Panel seg={s} />
        </Sequence>
      ))}
      <Captions />
      <Audio src={staticFile(data.vo)} />
    </AbsoluteFill>
  );
};
