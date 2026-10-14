import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
const font = new FontFace("Hind", `url(${staticFile("HindSiliguri-Bold.ttf")})`);
font.load().then(() => document.fonts.add(font));
export const TestCard = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1e3a8a, #020617)", justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: "Hind", fontSize: 140, color: "white", transform: `scale(${s})`, opacity: interpolate(f, [0, 10], [0, 1]) }}>
        ভিডিও স্টুডিও প্রস্তুত
      </div>
    </AbsoluteFill>
  );
};
