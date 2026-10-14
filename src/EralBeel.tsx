// "এড়াল বিল" — cinematic nature documentary. Footage pre-graded into public/beel/g/ (green cinematic grade).
import React from "react";
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing,
} from "remotion";
import { Grain } from "./style";

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

if (typeof document !== "undefined") {
  for (const [name, file] of [["Galada", "Galada-Regular.ttf"], ["Anek", "AnekBangla.ttf"], ["NotoSerifBn", "NotoSerifBengali.ttf"], ["HindSemi", "HindSiliguri-SemiBold.ttf"], ["Montserrat", "Montserrat.ttf"]]) {
    const f = new FontFace(name, `url(${staticFile("fonts/" + file)})`);
    f.load().then(() => document.fonts.add(f)).catch(() => {});
  }
}

// ---------- edit decision list ----------
type ShotT = { clip: string; at: number; dur: number; oy?: number; rate?: number; zoom?: [number, number]; pan?: [number, number]; rot?: number; sfx?: string };
type Section = { id: string; chapter?: string; vo?: number; voDelay?: number; shots: ShotT[]; fade?: number };

// "drone" = slow push-in with drift + slight rotation on wide shots
const DRONE = { zoom: [1.0, 1.28] as [number, number], pan: [-3, -2] as [number, number], rot: 1.2 };

const SECTIONS: Section[] = [
  { id: "hook", fade: 0, shots: [
    { clip: "150715", at: 1.8, dur: 1.5, zoom: [1.15, 1.3] },
    { clip: "150513", at: 0.5, dur: 1.5, rate: 0.5, zoom: [1.1, 1.2] },
    { clip: "150456", at: 7, dur: 1.5, ...DRONE },
    { clip: "gem1", at: 6, dur: 1.5, zoom: [1.05, 1.2] },
  ] },
  { id: "logo", shots: [] },
  { id: "night", vo: 1, voDelay: 1, shots: [{ clip: "gem2", at: 0, dur: 8, zoom: [1.0, 1.15], pan: [0, 1] }] },
  { id: "title", vo: 2, voDelay: 0.8, shots: [
    { clip: "150357", at: 0.1, dur: 5, rate: 0.5, zoom: [1.05, 1.18], sfx: "morning" },
    { clip: "150446", at: 0, dur: 5, ...DRONE },
  ] },
  { id: "c1", chapter: "শান্ত জল", vo: 3, voDelay: 0.6, shots: [
    { clip: "150456", at: 1, dur: 4, ...DRONE, zoom: [1.2, 1.4], oy: -9 },
    { clip: "150559", at: 0.2, dur: 4, zoom: [1.45, 1.5], pan: [-4, 0], oy: -14 },
    { clip: "150608", at: 0.5, dur: 3.5, zoom: [1.0, 1.15] },
  ] },
  { id: "c2", chapter: "প্রজন্মের গল্প", vo: 4, voDelay: 0.6, shots: [
    { clip: "gem1", at: 0, dur: 3.5, zoom: [1.0, 1.12] },
    { clip: "150524", at: 0.5, dur: 4, ...DRONE },
    { clip: "150446", at: 4.5, dur: 3, zoom: [1.05, 1.15] },
    { clip: "150418", at: 0, dur: 2.3, rate: 0.75, zoom: [1.05, 1.12] },
  ] },
  { id: "c3", chapter: "জীবনের ছন্দ", vo: 5, voDelay: 0.6, shots: [
    { clip: "150513", at: 1, dur: 4, rate: 0.5, zoom: [1.05, 1.15], sfx: "ducks" },
    { clip: "150817", at: 1, dur: 3, zoom: [1.05, 1.12] },
    { clip: "150423", at: 1, dur: 3, zoom: [1.05, 1.15] },
    { clip: "150538", at: 2, dur: 3, zoom: [1.05, 1.12] },
  ] },
  { id: "c4", chapter: "সবুজের ছায়া", vo: 6, voDelay: 0.6, shots: [
    { clip: "150723", at: 1, dur: 3.5, zoom: [1.05, 1.18], sfx: "bamboo" },
    { clip: "150948", at: 0.5, dur: 3, zoom: [1.05, 1.15], rot: -2 },
    { clip: "150752", at: 0.5, dur: 2.5, zoom: [1.05, 1.12] },
    { clip: "150715", at: 0.8, dur: 3, zoom: [1.0, 1.12] },
  ] },
  { id: "c5", chapter: "দিনশেষে", vo: 7, voDelay: 0.6, shots: [
    { clip: "gem1", at: 5.5, dur: 4, zoom: [1.0, 1.15], sfx: "egrets" },
    { clip: "150608", at: 2.5, dur: 3.5, ...DRONE },
    { clip: "gem2", at: 5.5, dur: 4, zoom: [1.05, 1.2] },
  ] },
  { id: "message", vo: 8, voDelay: 0.6, shots: [{ clip: "150524", at: 4, dur: 6, zoom: [1.05, 1.2] }] },
  { id: "credits", shots: [] },
];
const FIXED: Record<string, number> = { logo: 5, credits: 10 };

const VO_TEXT = [
  "রাত নামে... আর নিস্তব্ধ জলের বুকে জেগে থাকে আকাশের তারা।",
  "মৌলভীবাজারের বড়লেখা উপজেলা। চান্দগ্রামের কোল ঘেঁষে শুয়ে আছে এক বিশাল জলরাশি... এড়াল বিল।",
  "ভোরের আলো ফুটতেই বিলের জলে ভেসে ওঠে আকাশের প্রতিচ্ছবি। কচুরিপানার সবুজ চাদরে ঢাকা এই জল, যেন প্রকৃতির নিজের হাতে আঁকা এক ছবি।",
  "এই বিলের বুকে লুকিয়ে আছে বহু প্রজন্মের গল্প। জেলের জাল, নৌকার বৈঠা আর বর্ষার ঢল... সব মিলিয়ে এড়াল বিল এখানকার মানুষের জীবনের অংশ।",
  "বিলের পাড়ে হাঁসের দল, গাছের ছায়ায় বিশ্রাম নেয় গরু, আর শিশুদের হাসিতে মুখর হয়ে ওঠে চারপাশ। এখানে জীবন চলে প্রকৃতির নিজস্ব ছন্দে।",
  "বাঁশঝাড়ের ফাঁক দিয়ে নেমে আসে সোনালি রোদ। বাতাসে দোলে সবুজ পাতা। শহরের কোলাহল থেকে অনেক দূরে... এখানে শুধুই শান্তি।",
  "সাদা বকের ডানায় ভর করে দিন গড়িয়ে যায় সন্ধ্যায়। এড়াল বিল... শুধু একটি জলাশয় নয়, এটি চান্দগ্রামের হৃদয়।",
  "প্রকৃতিকে ভালোবাসুন। এই সৌন্দর্যকে বাঁচিয়ে রাখুন।",
];
const VO_DUR = [5.52, 8.4, 10.24, 11.92, 11.44, 10.16, 10.24, 3.92];

// lay out the timeline
const XF = 12; // cross-dissolve frames between calm shots
let cursor = 0;
const LAYOUT = SECTIONS.map((sec) => {
  const len = FIXED[sec.id] ? s(FIXED[sec.id]) : sec.shots.reduce((a, sh) => a + s(sh.dur), 0);
  const out = { ...sec, from: cursor, len };
  cursor += len;
  return out;
});
export const BEEL_TOTAL = cursor;
const VO_RANGES = LAYOUT.filter((l) => l.vo).map((l) => [l.from + s(l.voDelay!), l.from + s(l.voDelay!) + s(VO_DUR[l.vo! - 1])]);

// ---------- pieces ----------
const Clip: React.FC<{ sh: ShotT; len: number; fadeIn: number }> = ({ sh, len, fadeIn }) => {
  const f = useCurrentFrame();
  const t = f / len;
  const ease = Easing.inOut(Easing.sin)(Math.min(1, t));
  const [z0, z1] = sh.zoom ?? [1.05, 1.12];
  const [px, py] = sh.pan ?? [0, 0];
  const op = fadeIn ? interpolate(f, [0, fadeIn], [0, 1], { extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ opacity: op, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(`beel/g/${sh.clip}.mp4`)}
        startFrom={s(sh.at)}
        playbackRate={sh.rate ?? 1}
        muted
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${z0 + (z1 - z0) * ease}) translate(${px * ease}%, ${py * ease + (sh.oy ?? 0)}%) rotate(${(sh.rot ?? 0) * ease}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Shots: React.FC<{ shots: ShotT[]; dissolve: boolean }> = ({ shots, dissolve }) => {
  let t = 0;
  return (
    <>
      {shots.map((sh, i) => {
        const from = t;
        t += s(sh.dur);
        const fadeIn = dissolve && i > 0 ? XF : 0;
        return (
          <Sequence key={i} from={from - (fadeIn ? XF : 0)} durationInFrames={s(sh.dur) + (fadeIn ? XF : 0)}>
            <Clip sh={sh} len={s(sh.dur) + fadeIn} fadeIn={fadeIn} />
            {sh.sfx && <Audio src={staticFile(`beel/sfx/${sh.sfx}.mp3`)} volume={0.35} />}
          </Sequence>
        );
      })}
    </>
  );
};

const BAR = 138; // 2.39:1 letterbox
const Letterbox = () => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: BAR, background: "black" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: BAR, background: "black" }} />
  </>
);

const Vignette = () => <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)" }} />;

const fadeInOut = (f: number, len: number, a = 12) =>
  interpolate(f, [0, a, len - a, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const HookText = () => {
  const f = useCurrentFrame();
  const words = ["বড়লেখার", "বুকে", "লুকিয়ে", "থাকা", "এক", "টুকরো", "স্বর্গ"];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 26, flexWrap: "wrap", justifyContent: "center", maxWidth: 1500 }}>
        {words.map((w, i) => {
          const st = 8 + i * 7;
          const o = interpolate(f, [st, st + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const y = interpolate(f, [st, st + 10], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          const gold = w === "স্বর্গ";
          return (
            <span key={i} style={{
              fontFamily: "Anek", fontWeight: 800, fontSize: 96, color: gold ? "#ffd27a" : "white", opacity: o, transform: `translateY(${y}px)`,
              textShadow: "0 6px 40px rgba(0,0,0,.85)", filter: gold ? "drop-shadow(0 0 18px rgba(255,190,90,.6))" : undefined,
            }}>{w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const LogoReveal: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = spring({ frame: f - 6, fps, config: { damping: 200 }, durationInFrames: 60 });
  const glow = interpolate(f, [6, 20, 60], [0, 1, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sweep = interpolate(f, [10, 55], [-40, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #0d1f17 0%, #000 70%)", justifyContent: "center", alignItems: "center", opacity: fadeInOut(f, len, 10) }}>
      <div style={{ position: "relative", transform: `scale(${0.85 + sc * 0.15})`, opacity: sc }}>
        <Img src={staticFile("beel/logo.png")} style={{ width: 820, filter: `drop-shadow(0 0 ${30 * glow}px rgba(140,255,190,.55))` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, transparent ${sweep - 15}%, rgba(255,255,255,.55) ${sweep}%, transparent ${sweep + 15}%)`, mixBlendMode: "overlay", WebkitMaskImage: `url(${staticFile("beel/logo.png")})`, WebkitMaskSize: "100% 100%" }} />
      </div>
      <div style={{ position: "absolute", bottom: 300, fontFamily: "HindSemi", fontSize: 36, color: "#cfe9da", wordSpacing: "0.3em", opacity: interpolate(f, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        নিবেদিত
      </div>
    </AbsoluteFill>
  );
};

const Title: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const o = fadeInOut(f - s(1.2), s(6.5), 18);
  const blur = interpolate(f, [s(1.2), s(2.4)], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const track = interpolate(f, [s(1.2), s(7.7)], [0.02, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(f, [s(2), s(3.2)], [0, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o }}>
      <div style={{ fontFamily: "Galada", fontSize: 230, color: "white", transform: `scale(${1 + track * 0.5})`, filter: `blur(${blur}px)`, textShadow: "0 10px 60px rgba(0,0,0,.7)", lineHeight: 1.1 }}>এড়াল বিল</div>
      <div style={{ height: 2, width: lineW, background: "linear-gradient(90deg, transparent, #ffd27a, transparent)", margin: "18px 0" }} />
      <div style={{ fontFamily: "HindSemi", fontSize: 38, color: "#e8f3ec", wordSpacing: "0.4em", textShadow: "0 3px 20px #000" }}>চান্দগ্রাম • বড়লেখা • মৌলভীবাজার</div>
    </AbsoluteFill>
  );
};

const ChapterCard: React.FC<{ n: number; name: string }> = ({ n, name }) => {
  const f = useCurrentFrame();
  const len = s(3.6);
  const o = fadeInOut(f, len, 14);
  const x = interpolate(f, [0, 20], [-30, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const bn = "০১২৩৪৫৬৭৮৯";
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-start", padding: `${BAR + 60}px 0 0 110px`, opacity: o }}>
      <div style={{ transform: `translateX(${x}px)`, borderLeft: "3px solid #ffd27a", paddingLeft: 22 }}>
        <div style={{ fontFamily: "HindSemi", fontSize: 26, color: "#ffd27a", wordSpacing: "0.3em" }}>অধ্যায় {bn[0]}{bn[n]}</div>
        <div style={{ fontFamily: "NotoSerifBn", fontWeight: 600, fontSize: 64, color: "white", textShadow: "0 4px 30px rgba(0,0,0,.8)" }}>{name}</div>
      </div>
    </AbsoluteFill>
  );
};

// narration subtitles sit in the bottom letterbox bar
const Subtitles: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const parts = text.split(/(?<=[।,])\s+|\.\.\.\s*/).map((p) => p.trim()).filter(Boolean);
  const total = parts.reduce((a, p) => a + p.length, 0);
  let acc = 0;
  const frames = s(dur);
  return (
    <>
      {parts.map((p, i) => {
        const a = Math.round((acc / total) * frames);
        acc += p.length;
        const b = Math.round((acc / total) * frames);
        if (f < a || f >= b) return null;
        return (
          <AbsoluteFill key={i} style={{ justifyContent: "flex-end", alignItems: "center" }}>
            <div style={{ height: BAR, display: "flex", alignItems: "center", fontFamily: "HindSemi", fontSize: 40, color: "#f2f2f2", opacity: fadeInOut(f - a, b - a, 5) }}>{p}</div>
          </AbsoluteFill>
        );
      })}
    </>
  );
};

const Message: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,.25)", opacity: fadeInOut(f - 15, len - 15, 18) }}>
      <div style={{ fontFamily: "NotoSerifBn", fontWeight: 700, fontSize: 92, color: "white", textShadow: "0 6px 40px #000" }}>প্রকৃতিকে ভালোবাসুন</div>
      <div style={{ fontFamily: "HindSemi", fontSize: 42, color: "#ffd27a", marginTop: 16, opacity: interpolate(f, [s(2), s(2.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>এই সৌন্দর্যকে বাঁচিয়ে রাখুন</div>
    </AbsoluteFill>
  );
};

const Credits: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const line = (st: number) => ({ opacity: interpolate(f, [st, st + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateY(${interpolate(f, [st, st + 18], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)` });
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [len - 30, len], [1, 0], { extrapolateLeft: "clamp" }) }}>
      <AbsoluteFill style={{ filter: "blur(14px) brightness(0.45)", transform: "scale(1.1)" }}>
        <OffthreadVideo src={staticFile("beel/g/gem2.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 10 }}>
        <div style={{ fontFamily: "HindSemi", fontSize: 30, color: "#ffd27a", ...line(10) }}>তৈরি করেছেন</div>
        <div style={{ fontFamily: "NotoSerifBn", fontWeight: 700, fontSize: 80, color: "white", ...line(22) }}>কাশিম উদ্দিন মাছুম</div>
        <div style={{ height: 60 }} />
        <div style={{ fontFamily: "HindSemi", fontSize: 30, color: "#ffd27a", ...line(55) }}>প্রোডাকশন</div>
        <div style={{ ...line(67) }}><Img src={staticFile("beel/logo.png")} style={{ width: 420 }} /></div>
        <div style={{ fontFamily: "HindSemi", fontSize: 26, color: "#cfd8d3", marginTop: 40, ...line(95) }}>এড়াল বিল • চান্দগ্রাম, বড়লেখা, মৌলভীবাজার</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const LogoBug = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: BAR + 28, right: 56, opacity: interpolate(f, [0, 20], [0, 0.85], { extrapolateRight: "clamp" }) }}>
      <Img src={staticFile("beel/logo.png")} style={{ width: 170, filter: "drop-shadow(0 2px 8px rgba(0,0,0,.6))" }} />
    </div>
  );
};

// ---------- main ----------
export const EralBeel = () => {
  const L = Object.fromEntries(LAYOUT.map((l) => [l.id, l]));
  const hookEnd = L.logo.from;
  const creditsFrom = L.credits.from;
  const scoreVol = (f: number) => {
    const ducked = VO_RANGES.some(([a, b]) => f > a - 10 && f < b + 10);
    const base = f < hookEnd ? 0.55 : ducked ? 0.2 : 0.42;
    return base * interpolate(f, [0, 10, BEEL_TOTAL - 60, BEEL_TOTAL], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };
  let ch = 0;
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {/* music & ambience */}
      <Audio src={staticFile("beel/sfx/score.mp3")} volume={scoreVol} />
      <Sequence from={s(1.5)} durationInFrames={hookEnd - s(1.5)}><Audio src={staticFile("beel/sfx/riser.mp3")} volume={0.5} /></Sequence>
      {[0, 1, 2, 3].map((i) => <Sequence key={i} from={s(1.5 * i)} durationInFrames={s(1.5)}><Audio src={staticFile("beel/sfx/whoosh.mp3")} volume={0.35} /></Sequence>)}
      <Sequence from={L.logo.from} durationInFrames={s(3)}><Audio src={staticFile("beel/sfx/logo_hit.mp3")} volume={0.8} /></Sequence>
      <Sequence from={L.night.from} durationInFrames={L.night.len + 20}><Audio src={staticFile("beel/sfx/night.mp3")} volume={(f) => 0.5 * fadeInOut(f, L.night.len + 20, 20)} /></Sequence>
      <Sequence from={L.c1.from} durationInFrames={L.c1.len}><Audio src={staticFile("beel/sfx/morning.mp3")} volume={(f) => 0.22 * fadeInOut(f, L.c1.len, 30)} /></Sequence>

      {LAYOUT.map((l) => (
        <Sequence key={l.id} from={l.from} durationInFrames={l.len}>
          {l.shots.length > 0 && <Shots shots={l.shots} dissolve={l.id !== "hook"} />}
          {l.id === "hook" && <HookText />}
          {l.id === "logo" && <LogoReveal len={l.len} />}
          {l.id === "title" && <Title len={l.len} />}
          {l.id === "message" && <Message len={l.len} />}
          {l.id === "credits" && <Credits len={l.len} />}
          {l.chapter && <Sequence from={10}><ChapterCard n={++ch} name={l.chapter} /></Sequence>}
          {l.chapter && <Audio src={staticFile("beel/sfx/whoosh.mp3")} volume={0.25} />}
          {l.vo && (
            <Sequence from={s(l.voDelay!)}>
              <Audio src={staticFile(`beel/vo/0${l.vo}.mp3`)} volume={1} />
              <Subtitles text={VO_TEXT[l.vo - 1]} dur={VO_DUR[l.vo - 1]} />
            </Sequence>
          )}
        </Sequence>
      ))}

      {/* section-level dissolve from black after the logo, and dip between chapters */}
      {LAYOUT.filter((l) => l.chapter || l.id === "night" || l.id === "message").map((l) => (
        <Sequence key={"dip" + l.id} from={l.from - 8} durationInFrames={24}>
          <DipToBlack />
        </Sequence>
      ))}

      <Grain opacity={0.07} />
      <Vignette />
      <Letterbox />
      <Sequence from={L.night.from} durationInFrames={creditsFrom - L.night.from}><LogoBug /></Sequence>
    </AbsoluteFill>
  );
};

const DipToBlack = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "black", opacity: interpolate(f, [0, 8, 24], [0, 0.85, 0], { extrapolateRight: "clamp" }) }} />;
};
