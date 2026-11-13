// Qount 10-second TVC test (2026-11-13), comp QTVC-H (1920x1080, 300 frames). One consistent character (the turf owner from the
// brand film): Gemini keyframes with owner.jpg as reference -> Veo 3.1 Lite image-to-video (work/qount/tvc10/make.py).
// Assets: <public>/tvc (local public dir work/qroot, cloud sub "tvc").
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { EndCard, Push, Captions, Cap } from "./Film45";

const S = (p: string) => staticFile("tvc/" + p);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const TVC10_LEN = 300;
const CUTS = { k2: 84, k3: 140, end: 186 };
const CAPS: Cap[] = [
  [4, 84, "ভাই, শুক্রবার রাত আটটা খালি আছে?", "ফোনে গ্রাহক"],
  [90, 178, "গ্রাহক নিজেই বুক করেন, অ্যাডভান্সও আসে আগেই।"],
];

const Shot: React.FC<{ src: string; len: number; start?: number; z0?: number; z1?: number }> = ({ src, len, start = 0, z0 = 1.03, z1 = 1.09 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={S(src)} startFrom={start} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [0, len], [z0, z1], clamp)})`, filter: "contrast(1.06) saturate(1.05)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 52%, rgba(0,0,0,.42) 100%)" }} />
    </AbsoluteFill>
  );
};

// cinema bars (2.35:1 inside 16:9) that open to full frame on the end card
const Bars: React.FC = () => {
  const f = useCurrentFrame();
  const h = interpolate(f, [CUTS.end - 6, CUTS.end + 4], [132, 0], clamp);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h, background: "#000" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, background: "#000" }} />
  </>;
};

const Sfx: React.FC<{ at: number; src: string; v: number; len?: number }> = ({ at, src, v, len }) => <Sequence from={at} durationInFrames={len}><Audio src={S(src)} volume={v} /></Sequence>;

export const Tvc10: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={CUTS.k2}><Shot src="k1.mp4" len={CUTS.k2} start={0} /></Sequence>
      <Sequence from={CUTS.k2} durationInFrames={CUTS.k3 - CUTS.k2}><Shot src="k2.mp4" len={CUTS.k3 - CUTS.k2} start={44} z0={1.05} z1={1.12} /></Sequence>
      <Sequence from={CUTS.k2} durationInFrames={CUTS.k3 - CUTS.k2}>
        <div style={{ position: "absolute", right: 70, top: 150, width: 1080, height: 300, transform: "scale(.85)", transformOrigin: "top right" }}>
          <Push at={8} title="নতুন বুকিং কনফার্মড" body="শুক্র রাত ৮:০০ · বিকাশে অ্যাডভান্স ৳৮০০" />
        </div>
      </Sequence>
      <Sequence from={CUTS.k3} durationInFrames={CUTS.end - CUTS.k3}><Shot src="k3.mp4" len={CUTS.end - CUTS.k3} start={30} /></Sequence>
      <Sequence from={CUTS.end}><EndCard /></Sequence>
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [CUTS.end - 1, CUTS.end, CUTS.end + 6], [0, 0.35, 0], clamp) }} />
      <Bars />
      <AbsoluteFill style={{ transform: "translateY(40px)" }}><Captions caps={CAPS} light={() => false} /></AbsoluteFill>
      <Sfx at={0} src="buzz.mp3" v={0.5} len={60} />
      <Sfx at={4} src="caller.mp3" v={1} />
      <Sfx at={CUTS.k2 + 8} src="sms.mp3" v={0.55} />
      <Sfx at={CUTS.k3} src="crowd.mp3" v={0.35} len={CUTS.end - CUTS.k3 + 10} />
      <Sfx at={CUTS.k3 + 4} src="whistle.mp3" v={0.3} len={36} />
      <Sfx at={88} src="narr.mp3" v={1} />
      <Sequence from={CUTS.k2 - 4}><Audio src={S("music.mp3")} volume={(x) => interpolate(x, [0, 8, 90, 100, 200, 216], [0, 0.13, 0.13, 0.22, 0.22, 0], clamp)} /></Sequence>
    </AbsoluteFill>
  );
};
