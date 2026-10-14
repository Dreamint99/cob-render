// Colours of Bangladesh — "উদ্যোগের রঙ" ep.2: কাশিম উদ্দিন মাসুম (Dream Group).
// Facts: dreamithq.com/blog/kashim-uddin-masum + owner's own bio (no years — sources give none / conflicting).
// Disclosure on screen and in VO: Colours of Bangladesh is a Dream Group company.
// Photos: owner's own (dreamit-video/public/doc, kumasum assets); students' photos deliberately not used.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BN, bn, clamp } from "../news/NewsKit";
import { T, KB, Frame, Chip, Count, Src, HEAD, Fade } from "./Tinker";

const GOLD = "#e3b55a", GOLD2 = "#ffd98a", RED = "#e0142b", INK = "#0b0a08", SOFT = "#e9dcc3";
const Bg: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1000px 700px at ${70 + Math.sin(f / 90) * 6}% 30%, rgba(227,181,90,.28), transparent 60%), radial-gradient(800px 500px at 10% 100%, rgba(224,20,43,.18), transparent 60%), linear-gradient(160deg,#1a1610,${INK})` }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(227,181,90,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(227,181,90,.05) 1px, transparent 1px)", backgroundSize: "72px 72px", transform: `translateY(${(f * 0.3) % 72}px)` }} />
    </AbsoluteFill>
  );
};
const Bug: React.FC = () => (
  <div style={{ position: "absolute", left: 48, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
    <Img src={staticFile("cob/logo-round.png")} style={{ height: 70 }} />
    <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 30, color: INK, background: GOLD, padding: "4px 18px", borderRadius: 999 }}>উদ্যোগের রঙ</span>
  </div>
);

const M1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill><KB src="masum/m-bike.jpg" from={1.15} to={1.02} origin="50% 60%" /></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,10,8,.92) 0%, rgba(11,10,8,.6) 50%, rgba(11,10,8,.2))" }} />
      <div style={{ position: "absolute", left: 140, top: 330, fontFamily: HEAD, color: "white" }}>
        <div style={{ fontWeight: 800, fontSize: 130, opacity: T(f, 0, 25) }}>সিলেটের এক গ্রাম</div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 46, color: SOFT, opacity: T(f, 60, 85), marginTop: 10 }}>প্রযুক্তি বা ব্যবসার কোনো পারিবারিক পরিচয় নেই</div>
        <div style={{ fontWeight: 800, fontSize: 70, color: GOLD2, opacity: T(f, 150, 175), marginTop: 20 }}>তবু স্বপ্নটা ছিল বড়</div>
      </div>
    </AbsoluteFill>
  );
};
const M2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg />
      <Frame src="masum/m-white.jpg" x={1160} y={110} w={600} h={860} rot={2} origin="50% 25%" />
      <div style={{ position: "absolute", left: 150, top: 300 }}>
        <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 26, letterSpacing: 10, color: GOLD, opacity: T(f, 0, 20) }}>COLOURS OF BANGLADESH · FEATURE</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 150, color: "white", lineHeight: 1.05, opacity: T(f, 5, 30) }}>উদ্যোগের রঙ</div>
        <div style={{ width: T(f, 30, 70) * 640, height: 8, background: `linear-gradient(90deg, ${GOLD}, ${RED})`, margin: "20px 0 28px" }} />
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 70, color: GOLD2, opacity: T(f, 50, 80) }}>কাশিম উদ্দিন মাসুম</div>
        <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 38, color: SOFT, opacity: T(f, 70, 100) }}>প্রতিষ্ঠাতা ও চেয়ারম্যান, ড্রিম গ্রুপ</div>
      </div>
    </AbsoluteFill>
  );
};
const PATH: [number, string, string][] = [[10, "মাসুম টেলিকম", "ছোট্ট একটি দোকান"], [95, "গ্রিন আইটি", "সাথে ক্রিয়েটিভ ফটোগ্রাফি"], [230, "ফ্রিল্যান্সিং", "আন্তর্জাতিক ক্লায়েন্ট"]];
const M3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg />
      <Frame src="masum/m-laptop.jpg" x={1220} y={200} w={560} h={640} rot={-2} delay={200} origin="40% 40%" />
      <div style={{ position: "absolute", left: 140, width: 1040, height: 6, top: 497, background: "rgba(255,255,255,.12)" }}><div style={{ width: `${T(f, 10, 300) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${GOLD}, ${RED})` }} /></div>
      {PATH.map(([d, t, s], i) => {
        const p = spring({ frame: f - d, fps: 30, config: { damping: 14 } });
        return (
          <div key={t} style={{ position: "absolute", left: 140 + i * 360, top: 330, width: 350, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 30, color: GOLD }}>ধাপ {bn(i + 1)}</div>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 50, color: "white", lineHeight: 1.1, whiteSpace: "nowrap", height: 70 }}>{t}</div>
            <div style={{ position: "absolute", top: 152, width: 34, height: 34, borderRadius: 99, background: GOLD, border: "6px solid white" }} />
            <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 32, color: SOFT, marginTop: 110 }}>{s}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
const M4: React.FC = () => {
  const f = useCurrentFrame();
  const topics = ["প্রোগ্রামিং", "ওয়েব", "অ্যাপ", "ডিজিটাল মার্কেটিং"];
  return (
    <AbsoluteFill>
      <Bg />
      <Frame src="masum/m-classroom.jpg" x={140} y={180} w={760} h={720} rot={-1.5} origin="30% 40%" />
      <div style={{ position: "absolute", left: 1000, top: 230, right: 120 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: "white", opacity: T(f, 0, 25) }}>নিজে শিখেছেন, শিখিয়েছেন</div>
        <div style={{ marginTop: 30, opacity: T(f, 180, 200) }}><Count to={500} at={185} size={170} color={GOLD2} suffix="+" /><div style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: SOFT }}>শিক্ষার্থী, অফলাইন ও অনলাইনে</div></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 30 }}>{topics.map((t, i) => <Chip key={t} delay={60 + i * 25} style={{ fontSize: 32, padding: "12px 22px" }}>{t}</Chip>)}</div>
      </div>
    </AbsoluteFill>
  );
};
const LOGOS = ["dreamit", "probashiinfo", "probashi", "visapoint", "gccguide", "dreaminternational", "countly", "safar", "ninetymins", "moneybag", "playr", "qount", "workforce", "soulmate", "infkey", "bondon"];
const M5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", left: 140, top: 160, fontFamily: HEAD, fontWeight: 800, fontSize: 84, color: "white", opacity: T(f, 0, 25) }}>ড্রিম গ্রুপ <span style={{ color: GOLD2 }}>· <Count to={20} at={290} size={84} color={GOLD2} suffix="+" /> ব্র্যান্ড</span></div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 320, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 18 }}>
        {LOGOS.map((l, i) => {
          const p = spring({ frame: f - 30 - i * 12, fps: 30, config: { damping: 14 } });
          return <div key={l} style={{ height: 150, borderRadius: 18, background: "rgba(255,255,255,.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: 14, opacity: p, transform: `scale(${0.7 + p * 0.3})` }}><Img src={staticFile(`masum/logo-${l}.png`)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /></div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 140, top: 720, display: "flex", gap: 22, alignItems: "center" }}>
        <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 36, color: SOFT, opacity: T(f, 360, 380) }}>কাজ চলছে</span>
        {["দোহা", "ঢাকা", "মাদ্রিদ"].map((c, i) => <Chip key={c} delay={370 + i * 20} style={{ fontSize: 44, background: i === 1 ? RED : "rgba(255,255,255,.1)" }}>📍 {c}</Chip>)}
      </div>
      <Src t="dreamithq.com" />
    </AbsoluteFill>
  );
};
const M6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg />
      <Frame src="masum/m-desk.jpg" x={1150} y={180} w={620} h={700} rot={2} origin="50% 40%" />
      <div style={{ position: "absolute", left: 140, top: 230, width: 900 }}>
        <div style={{ width: 300, height: 400, borderRadius: 10, background: `linear-gradient(150deg, ${GOLD}, #7a5a1c)`, boxShadow: "0 30px 60px rgba(0,0,0,.5)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 28, transform: `rotate(-6deg) translateY(${(1 - T(f, 0, 30)) * 80}px)`, opacity: T(f, 0, 30) }}>
          <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 52, color: INK, lineHeight: 1 }}>AI<br />Mastery</div>
          <div style={{ fontFamily: BN, fontSize: 22, color: INK, marginTop: 10 }}>বিনামূল্যে · বাংলা ও ইংরেজি</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 50 }}>{["সফটওয়্যার প্রকৌশলী", "ডিজিটাল মার্কেটার", "মোটিভেশনাল স্পিকার"].map((t, i) => <Chip key={t} delay={180 + i * 30} style={{ fontSize: 36 }}>{t}</Chip>)}</div>
      </div>
      <Src t="dreamithq.com" />
    </AbsoluteFill>
  );
};
const M7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.4 }}><KB src="masum/m-team.jpg" /></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(11,10,8,.95), rgba(11,10,8,.7))" }} />
      <div style={{ position: "absolute", left: 180, right: 180, top: 260, textAlign: "center" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 200, lineHeight: 0.5, color: GOLD, opacity: T(f, 0, 20) }}>“</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 72, color: "white", lineHeight: 1.3, opacity: T(f, 10, 40) }}>শুধু সেই কাজই দেব,<br />যেখানে <span style={{ color: GOLD2 }}>নিজের নাম</span> বসাতে পারি</div>
        <div style={{ fontFamily: BN, fontSize: 32, color: SOFT, marginTop: 24, opacity: T(f, 150, 175) }}>— কাশিম উদ্দিন মাসুম</div>
      </div>
      <Src t="dreamithq.com (ইংরেজি উক্তির বাংলা)" />
    </AbsoluteFill>
  );
};
const M8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg />
      <Frame src="masum/m-redshirt.jpg" x={140} y={150} w={540} h={760} rot={-2} origin="50% 35%" />
      <div style={{ position: "absolute", left: 780, top: 230, right: 120, fontFamily: HEAD, color: "white" }}>
        <div style={{ fontWeight: 800, fontSize: 64, lineHeight: 1.25, opacity: T(f, 0, 25) }}>সিলেটের গ্রাম থেকে<br /><span style={{ color: GOLD2 }}>তিন দেশে ছড়ানো উদ্যোগ</span></div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: SOFT, marginTop: 14, opacity: T(f, 70, 95) }}>বয়স মাত্র ২৮</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 50, opacity: T(f, 230, 260) }}>
          <Img src={staticFile("cob/logo-round.png")} style={{ height: 140 }} />
          <div><div style={{ fontWeight: 800, fontSize: 54 }}>উদ্যোগের রঙ</div><div style={{ fontFamily: BN, fontSize: 30, color: SOFT }}>প্রতি সপ্তাহে নতুন উদ্যোক্তার গল্প</div></div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", fontFamily: BN, fontWeight: 600, fontSize: 24, color: GOLD2, opacity: T(f, 110, 130) }}>প্রকাশ: কালারস অব বাংলাদেশ ড্রিম গ্রুপের একটি প্রতিষ্ঠান · তথ্যসূত্র: dreamithq.com</div>
    </AbsoluteFill>
  );
};

const VO = [229, 219, 359, 337, 488, 354, 270, 395];
const SCENES = [M1, M2, M3, M4, M5, M6, M7, M8];
const PAD = 16, LEAD = 8;
const starts: number[] = []; let acc = 0;
for (const v of VO) { starts.push(acc); acc += v + PAD + LEAD; }
export const MASUM_LEN = acc + 40;
export const MasumFeature: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: INK }}>
      {SCENES.map((S, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={VO[i] + PAD + LEAD + (i === SCENES.length - 1 ? 40 : 0)}>
          <Fade len={VO[i] + PAD + LEAD + (i === SCENES.length - 1 ? 40 : 0)}><S /></Fade>
          <Sequence from={LEAD}><Audio src={staticFile(`msvo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
        </Sequence>
      ))}
      <Bug />
      <Audio src={staticFile("tkmusic.mp3")} volume={(f) => interpolate(f, [0, 20, durationInFrames - 60, durationInFrames], [0, 0.22, 0.22, 0], clamp)} loop />
    </AbsoluteFill>
  );
};
