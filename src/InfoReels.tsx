// 9:16 Reels cut from the প্রবাসী ইনফো promo (output/Probashi-Info-Promo.mp4 → public/reels/info-main.mp4).
// Each reel = hook headline on top, the 16:9 clip in the middle (blurred fill behind), Bangla captions below.
// Caption timing: each VO line is split into short chunks, timed in proportion to their length.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const C = { bg: "#061430", gold: "#ffc940", green: "#22c55e", text: "#ffffff", red: "#ef3b45" };
const H = "Hind";
if (typeof document !== "undefined") {
  for (const [f, w] of [["fonts/HindSiliguri-Bold.ttf", "700"], ["fonts/HindSiliguri-SemiBold.ttf", "600"]]) {
    const ff = new FontFace("Hind", `url(${staticFile(f)})`, { weight: w });
    ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  }
}
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SRC = staticFile("reels/info-main.mp4");

// main-video VO lines (must match work/pivo/script.json + InfoPromo VO/VO_LEN)
const VO = [15, 255, 525, 975, 1395, 1770];
const VO_LEN = [221, 240, 370, 353, 319, 350];
const LINES = [
  "আপনার ভাই, বাবা বা ছেলে আজ বিদেশে যাচ্ছেন? তাঁর বিমানটা এখন আকাশের ঠিক কোথায়... জানেন?",
  "বিএমইটির খবর, টাকার রেট, ফ্লাইটের খোঁজ... আর দশ জায়গায় খুঁজতে হবে না। সব এক জায়গায়, প্রবাসী ইনফো।",
  "বিএমইটি লাইভ রিপোর্টে দেখুন, আজ কতজন কর্মী বহির্গমন ছাড়পত্র পেলেন, কোন দেশে কতজন যাচ্ছেন। সরকারি ও ই পি থেকে প্রতি পাঁচ মিনিটে আপডেট হয়। আর এক ক্লিকে রিপোর্ট কার্ড বানিয়ে শেয়ার করুন।",
  "ফ্লাইট ট্র্যাকারে শুধু ফ্লাইট নম্বর লিখুন। বিমান এখন কোথায়, কত উঁচুতে, কখন নামবে, সব লাইভ ম্যাপে, বাংলায়। প্রিয়জনকে আনতে এয়ারপোর্টে যাওয়ার আগে একবার দেখে নিন।",
  "আর টাকার রেট? সৌদি রিয়াল, দিরহাম, রিংগিত, ইউরোসহ ছাব্বিশটা মুদ্রার লাইভ রেট। কত পাঠালে কত টাকা পাবেন, সাথে আড়াই শতাংশ সরকারি প্রণোদনার হিসাবও।",
  "সঠিক তথ্য জানুন, বৈধ পথে টাকা পাঠান। আজই ভিজিট করুন, প্রবাসী ইনফো ডট কম। প্রবাসী ইনফো, ড্রিম গ্রুপের একটি সহযোগী প্রতিষ্ঠান। প্রবাসের পথে... পাশে আছি।",
];
type Cue = { from: number; to: number; text: string };
const CUES: Cue[] = (() => {
  const out: Cue[] = [];
  LINES.forEach((line, li) => {
    const chunks: string[] = [];
    for (const part of line.replace(/ও ই পি/g, "OEP").replace(/প্রবাসী ইনফো ডট কম/g, "probashiinfo.com").split(/(?<=[।?!,]|\.\.\.)\s+/)) {
      const w = part.trim().split(/\s+/);
      for (let i = 0; i < w.length; i += 4) chunks.push(w.slice(i, i + 4).join(" "));
    }
    const total = chunks.reduce((a, c) => a + c.length + 6, 0);
    let t = VO[li];
    const span = VO_LEN[li] * 0.97;
    for (const c of chunks) {
      const d = ((c.length + 6) / total) * span;
      out.push({ from: t, to: t + d, text: c.replace(/[,।]$/, "") });
      t += d;
    }
  });
  return out;
})();

type Seg = [number, number];
export type ReelProps = { segs: Seg[]; hook: string; hookAccent: string; tag: string };
export const reelLen = (segs: Seg[]) => segs.reduce((a, [s, e]) => a + e - s, 0);

// reel frame → main-video frame
const toMain = (segs: Seg[], f: number) => {
  let acc = 0;
  for (const [s, e] of segs) { if (f < acc + e - s) return s + f - acc; acc += e - s; }
  return segs[segs.length - 1][1];
};

const Clip: React.FC<{ segs: Seg[]; style: React.CSSProperties; muted?: boolean }> = ({ segs, style, muted }) => {
  let acc = 0;
  return (
    <>
      {segs.map(([s, e], i) => {
        const len = e - s;
        const from = acc;
        acc += len;
        return (
          <Sequence key={i} from={from} durationInFrames={len} layout="none">
            <OffthreadVideo src={SRC} startFrom={s} endAt={e} muted={muted} style={style}
              volume={(f) => interpolate(f, [0, 5, len - 5, len], [i === 0 ? 1 : 0, 1, 1, i === segs.length - 1 ? 1 : 0], clamp)} />
          </Sequence>
        );
      })}
    </>
  );
};

export const InfoReel: React.FC<ReelProps> = ({ segs, hook, hookAccent, tag }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const mf = toMain(segs, f);
  const cue = CUES.find((c) => mf >= c.from && mf < c.to);
  const cueStart = cue ? Math.round(f - (mf - cue.from)) : 0;
  const pop = cue ? spring({ frame: f - cueStart, fps, config: { damping: 12, mass: 0.5 } }) : 0;
  const hk = spring({ frame: f - 4, fps, config: { damping: 13 } });
  const hk2 = spring({ frame: f - 14, fps, config: { damping: 13 } });
  // flash on every cut between segments
  let acc = 0, sinceCut = 999;
  for (const [s, e] of segs.slice(0, -1)) { acc += e - s; if (f >= acc) sinceCut = f - acc; }
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* blurred fill */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Clip segs={segs} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.3)", filter: "blur(40px) brightness(.45) saturate(1.3)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(6,20,48,.85) 0%, rgba(6,20,48,.2) 30%, rgba(6,20,48,.2) 62%, rgba(6,20,48,.9) 100%)" }} />

      {/* progress */}
      <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${(f / durationInFrames) * 100}%`, background: `linear-gradient(90deg, ${C.green}, ${C.gold})` }} />

      {/* hook */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 170, textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 26px", borderRadius: 999, background: C.red, color: "white", fontFamily: H, fontWeight: 700, fontSize: 38, transform: `scale(${hk})` }}>
          <span style={{ width: 14, height: 14, borderRadius: 99, background: "white", opacity: f % 30 < 15 ? 1 : 0.3 }} />{tag}
        </div>
        <div style={{ marginTop: 26, fontFamily: H, fontWeight: 700, fontSize: 92, lineHeight: 1.2, color: C.text, transform: `translateY(${(1 - hk2) * 60}px)`, opacity: hk2, textShadow: "0 6px 30px rgba(0,0,0,.6)" }}>
          {hook}<span style={{ color: hookAccent }}>?</span>
        </div>
      </div>

      {/* main clip */}
      <div style={{ position: "absolute", left: 24, right: 24, top: 640, height: (1032 * 9) / 16, borderRadius: 28, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.6), 0 0 0 3px rgba(255,255,255,.15)" }}>
        <Clip segs={segs} style={{ width: "100%", height: "100%" }} />
        <AbsoluteFill style={{ background: "white", opacity: interpolate(sinceCut, [0, 2, 9], [0, 0.7, 0], clamp) }} />
      </div>

      {/* captions */}
      <div style={{ position: "absolute", left: 50, right: 50, top: 1290, height: 260, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        {cue && (
          <div style={{ fontFamily: H, fontWeight: 700, fontSize: 76, lineHeight: 1.25, color: C.text, transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop, textShadow: "0 4px 20px rgba(0,0,0,.8)", WebkitTextStroke: "2px rgba(0,0,0,.6)", paintOrder: "stroke fill" }}>
            {cue.text.split(" ").map((w, i, a) => <span key={i} style={{ color: i === a.length - 1 ? C.gold : C.text }}>{w}{i < a.length - 1 ? " " : ""}</span>)}
          </div>
        )}
      </div>

      {/* brand */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1580, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 28px 12px 14px", borderRadius: 999, background: "white", boxShadow: "0 20px 50px rgba(0,0,0,.4)" }}>
          <Img src={staticFile("pi/wordmark.png")} style={{ height: 64 }} />
          <span style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 38, color: "#0b1f44" }}>probashiinfo.com</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const REELS: { id: string; props: ReelProps }[] = [
  { id: "InfoReelFlight", props: { segs: [[0, 240], [960, 1380], [1755, 2250]], hook: "প্রিয়জনের বিমান এখন কোথায়", hookAccent: C.gold, tag: "ফ্লাইট ট্র্যাকার লাইভ ✈️" } },
  { id: "InfoReelBmet", props: { segs: [[240, 960], [1755, 2250]], hook: "আজ কতজন বিদেশে যাওয়ার ছাড়পত্র পেলেন", hookAccent: C.gold, tag: "বিএমইটি লাইভ রিপোর্ট" } },
  { id: "InfoReelRate", props: { segs: [[240, 510], [1380, 2250]], hook: "আজ ১ সৌদি রিয়াল = কত টাকা", hookAccent: C.gold, tag: "টাকার রেট লাইভ" } },
];
