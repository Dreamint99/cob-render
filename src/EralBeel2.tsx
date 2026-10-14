// "এড়াল বিল" v2 — stabilized, motion-interpolated slow-mo shots (public/beel/s, vivid LUT baked in), 24fps,
// narration from the first second, straight cuts, no cards.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { Grain } from "./style";

export const FPS2 = 24;
const f = (sec: number) => Math.round(sec * FPS2);

if (typeof document !== "undefined") {
  for (const [name, file] of [["Galada", "Galada-Regular.ttf"], ["Anek", "AnekBangla.ttf"], ["NotoSerifBn", "NotoSerifBengali.ttf"], ["HindSemi", "HindSiliguri-SemiBold.ttf"]]) {
    const ff = new FontFace(name, `url(${staticFile("fonts/" + file)})`);
    ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  }
}

// shot id, timeline start/end (s), offset into processed shot (s)
const CUTS: { id: string; a: number; b: number; off?: number; xf?: boolean }[] = [
  { id: "01", a: 0, b: 5 },
  { id: "02", a: 5, b: 9.5, xf: true },
  { id: "03", a: 9.5, b: 15 },
  { id: "04", a: 15, b: 20 },
  { id: "05", a: 20, b: 24.5 },
  { id: "07", a: 24.5, b: 28.5, xf: true },
  { id: "08", a: 28.5, b: 32 },
  { id: "09", a: 32, b: 35 },
  { id: "10", a: 35, b: 38 },
  { id: "11", a: 38, b: 41 },
  { id: "12", a: 41, b: 45.5, xf: true },
  { id: "13", a: 45.5, b: 49.5 },
  { id: "14", a: 49.5, b: 53.5 },
  { id: "06", a: 53.5, b: 57.5 },
  { id: "15", a: 57.5, b: 63, xf: true },
  { id: "16", a: 63, b: 70.5 },
];
const VO: { n: number; at: number; dur: number; text: string; sub?: boolean }[] = [
  { n: 1, at: 0.6, dur: 3.28, text: "বড়লেখার বুকে লুকিয়ে আছে এক টুকরো স্বর্গ।", sub: false },
  { n: 2, at: 5.5, dur: 4.48, text: "চান্দগ্রামের কোল ঘেঁষে শুয়ে থাকা এই জলরাশির নাম... এড়াল বিল।" },
  { n: 3, at: 15.5, dur: 7.68, text: "ভোরের আলোয় জলের বুকে ভেসে ওঠে আকাশ। কচুরিপানার সবুজ চাদর, যেন প্রকৃতির নিজের হাতে আঁকা ছবি।" },
  { n: 4, at: 25, dur: 8.08, text: "এই বিলকে ঘিরেই চলে এখানকার মানুষের জীবন। জেলের নৌকা, হাঁসের দল, আর শিশুদের হাসি।" },
  { n: 5, at: 41.5, dur: 8.48, text: "গাছের পাতার ফাঁক দিয়ে নেমে আসে সোনালি রোদ। শহরের কোলাহল থেকে অনেক দূরে... এখানে শুধুই শান্তি।" },
  { n: 6, at: 58, dur: 6.56, text: "সাদা বকের ডানায় ভর করে দিন গড়ায় সন্ধ্যায়। এড়াল বিল... চান্দগ্রামের হৃদয়।" },
];
const AMB: { sfx: string; a: number; b: number; vol: number }[] = [
  { sfx: "night", a: 0, b: 6, vol: 0.45 },
  { sfx: "morning", a: 5, b: 25, vol: 0.25 },
  { sfx: "ducks", a: 28.5, b: 32.5, vol: 0.35 },
  { sfx: "bamboo", a: 41, b: 53, vol: 0.25 },
  { sfx: "egrets", a: 57.5, b: 63.5, vol: 0.35 },
];
const CREDITS_AT = 70.5;
export const BEEL2_TOTAL = f(CREDITS_AT + 8);
const XF = 10;
const BAR = 138;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fio = (t: number, len: number, a: number) => interpolate(t, [0, a, len - a, len], [0, 1, 1, 0], clamp);

const Shot: React.FC<{ id: string; len: number; off: number; xf: boolean }> = ({ id, len, off, xf }) => {
  const t = useCurrentFrame();
  // barely-there drift so frames breathe without a "slideshow" zoom
  const sc = 1.0 + 0.025 * Easing.inOut(Easing.sin)(Math.min(1, t / len));
  return (
    <AbsoluteFill style={{ opacity: xf ? interpolate(t, [0, XF], [0, 1], clamp) : 1 }}>
      <OffthreadVideo src={staticFile(`beel/s/${id}.mp4`)} startFrom={f(off)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sc})` }} />
    </AbsoluteFill>
  );
};

const HookLine = () => {
  const t = useCurrentFrame();
  const words = ["বড়লেখার", "বুকে", "লুকিয়ে", "আছে", "এক", "টুকরো", "স্বর্গ"];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: interpolate(t, [f(4), f(4.8)], [1, 0], clamp) }}>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", maxWidth: 1500 }}>
        {words.map((w, i) => {
          const st = f(0.6) + i * 4;
          const gold = w === "স্বর্গ";
          return (
            <span key={i} style={{
              fontFamily: "Anek", fontWeight: 800, fontSize: 92, color: gold ? "#ffd27a" : "white",
              opacity: interpolate(t, [st, st + 6], [0, 1], clamp),
              transform: `translateY(${interpolate(t, [st, st + 8], [24, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px)`,
              textShadow: "0 6px 40px rgba(0,0,0,.8)",
            }}>{w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Title: React.FC<{ len: number }> = ({ len }) => {
  const t = useCurrentFrame();
  const blur = interpolate(t, [0, f(1)], [16, 0], clamp);
  const line = interpolate(t, [f(0.6), f(1.6)], [0, 520], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fio(t, len, 14) }}>
      <div style={{ fontFamily: "Galada", fontSize: 220, color: "white", filter: `blur(${blur}px)`, transform: `scale(${1 + t / len * 0.04})`, textShadow: "0 10px 60px rgba(0,0,0,.6)", lineHeight: 1.1 }}>এড়াল বিল</div>
      <div style={{ height: 2, width: line, background: "linear-gradient(90deg, transparent, #ffd27a, transparent)", margin: "16px 0" }} />
      <div style={{ fontFamily: "HindSemi", fontSize: 38, color: "#fff", wordSpacing: "0.4em", textShadow: "0 3px 20px rgba(0,0,0,.8)" }}>চান্দগ্রাম • বড়লেখা • মৌলভীবাজার</div>
    </AbsoluteFill>
  );
};

const Subtitles: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const t = useCurrentFrame();
  const parts = text.split(/(?<=[।,])\s+|\.\.\.\s*/).map((p) => p.trim()).filter(Boolean);
  const total = parts.reduce((a, p) => a + p.length, 0);
  let acc = 0;
  return (
    <>
      {parts.map((p, i) => {
        const a = Math.round((acc / total) * f(dur));
        acc += p.length;
        const b = Math.round((acc / total) * f(dur));
        if (t < a || t >= b + 4) return null;
        return (
          <AbsoluteFill key={i} style={{ justifyContent: "flex-end", alignItems: "center" }}>
            <div style={{ height: BAR, display: "flex", alignItems: "center", fontFamily: "HindSemi", fontSize: 38, color: "#f4f4f4", opacity: fio(t - a, b + 4 - a, 4) }}>{p}</div>
          </AbsoluteFill>
        );
      })}
    </>
  );
};

const EndTitle = () => {
  const t = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: interpolate(t, [0, 18], [0, 1], clamp) }}>
      <div style={{ fontFamily: "Galada", fontSize: 150, color: "white", textShadow: "0 8px 50px rgba(0,0,0,.7)" }}>এড়াল বিল</div>
    </AbsoluteFill>
  );
};

const Credits: React.FC<{ len: number }> = ({ len }) => {
  const t = useCurrentFrame();
  const ln = (st: number) => ({ opacity: interpolate(t, [st, st + 14], [0, 1], clamp), transform: `translateY(${interpolate(t, [st, st + 14], [14, 0], clamp)}px)` });
  const glow = interpolate(t, [f(3), f(3.5), f(5)], [0, 1, 0.3], clamp);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #0b1a13 0%, #000 70%)", justifyContent: "center", alignItems: "center", opacity: interpolate(t, [0, 12, len - 24, len], [0, 1, 1, 0], clamp) }}>
      <div style={{ fontFamily: "HindSemi", fontSize: 30, color: "#ffd27a", ...ln(6) }}>তৈরি করেছেন</div>
      <div style={{ fontFamily: "NotoSerifBn", fontWeight: 700, fontSize: 78, color: "white", marginTop: 6, ...ln(14) }}>কাশিম উদ্দিন মাছুম</div>
      <div style={{ fontFamily: "HindSemi", fontSize: 30, color: "#ffd27a", marginTop: 70, ...ln(f(2.6)) }}>প্রোডাকশন</div>
      <div style={{ marginTop: 14, ...ln(f(3)) }}>
        <Img src={staticFile("beel/logo.png")} style={{ width: 520, filter: `drop-shadow(0 0 ${28 * glow}px rgba(140,255,190,.6))` }} />
      </div>
    </AbsoluteFill>
  );
};

export const EralBeel2 = () => {
  const vrs = VO.map((v) => [f(v.at), f(v.at + v.dur)]);
  const music = (t: number) => {
    const duck = vrs.some(([a, b]) => t > a - 8 && t < b + 8);
    return (duck ? 0.22 : 0.45) * interpolate(t, [0, 12, BEEL2_TOTAL - 48, BEEL2_TOTAL], [0, 1, 1, 0], clamp);
  };
  const cr = f(CREDITS_AT);
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <Audio src={staticFile("beel/sfx/score.mp3")} volume={music} />
      {AMB.map((m, i) => (
        <Sequence key={i} from={f(m.a)} durationInFrames={f(m.b - m.a)}>
          <Audio src={staticFile(`beel/sfx/${m.sfx}.mp3`)} volume={(t) => m.vol * fio(t, f(m.b - m.a), 18)} />
        </Sequence>
      ))}
      <Sequence from={cr + f(2.9)} durationInFrames={f(3)}><Audio src={staticFile("beel/sfx/logo_hit.mp3")} volume={0.6} /></Sequence>

      {CUTS.map((c, i) => {
        const pre = c.xf ? XF : 0;
        return (
          <Sequence key={i} from={f(c.a) - pre} durationInFrames={f(c.b - c.a) + pre + (i === CUTS.length - 1 ? 0 : 0)}>
            <Shot id={c.id} len={f(c.b - c.a) + pre} off={c.off ?? 0} xf={!!c.xf} />
          </Sequence>
        );
      })}
      {/* last shot fades to black before credits */}
      <Sequence from={cr - 30} durationInFrames={30}><FadeBlack /></Sequence>

      <Sequence durationInFrames={f(5)}><HookLine /></Sequence>
      <Sequence from={f(10)} durationInFrames={f(4.8)}><Title len={f(4.8)} /></Sequence>
      <Sequence from={f(65.2)} durationInFrames={cr - f(65.2) - 20}><EndTitle /></Sequence>

      <Grain opacity={0.05} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.4) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: BAR, background: "black" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: BAR, background: "black" }} />
      {VO.map((v) => (
        <Sequence key={v.n} from={f(v.at)} durationInFrames={f(v.dur) + 12}>
          <Audio src={staticFile(`beel/vo2/0${v.n}.mp3`)} />
          {v.sub !== false && <Subtitles text={v.text} dur={v.dur} />}
        </Sequence>
      ))}
      <Sequence durationInFrames={cr}>
        <div style={{ position: "absolute", top: BAR + 26, right: 54, opacity: 0.85 }}>
          <Img src={staticFile("beel/logo.png")} style={{ width: 160, filter: "drop-shadow(0 2px 8px rgba(0,0,0,.6))" }} />
        </div>
      </Sequence>
      <Sequence from={cr} durationInFrames={BEEL2_TOTAL - cr}><Credits len={BEEL2_TOTAL - cr} /></Sequence>
    </AbsoluteFill>
  );
};

const FadeBlack = () => {
  const t = useCurrentFrame();
  return <AbsoluteFill style={{ background: "black", opacity: interpolate(t, [0, 30], [0, 1], clamp) }} />;
};
