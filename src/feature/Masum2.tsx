// "উদ্যোগের রঙ" ep.2 v2 — কাশিম উদ্দিন মাসুম. Adds the owner's Gemini clips (village, Masum Telecom, rooftop —
// labelled "পুনর্নির্মিত দৃশ্য · এআই"), his own photos (Downloads/mausm pic → public/masum/mp*.jpg; mp12 skipped:
// other people), and more facts from his site (laptop & belief, 7 industries, four principles).
// No years anywhere (sources give none / conflict). Disclosure: COB is a Dream Group company.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BN, bn, clamp, Sfx } from "../news/NewsKit";
import { T, KB, Frame, Chip, Count, Src, HEAD } from "./Tinker";

const GOLD = "#e3b55a", GOLD2 = "#ffd98a", RED = "#e0142b", INK = "#0b0a08", SOFT = "#e9dcc3";
const Bg: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1000px 700px at ${70 + Math.sin(f / 90) * 6}% 30%, rgba(227,181,90,.28), transparent 60%), radial-gradient(800px 500px at 10% 100%, rgba(224,20,43,.18), transparent 60%), linear-gradient(160deg,#1a1610,${INK})` }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(227,181,90,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(227,181,90,.05) 1px, transparent 1px)", backgroundSize: "72px 72px", transform: `translateY(${(f * 0.3) % 72}px)` }} />
    </AbsoluteFill>
  );
};
// light leak that sweeps across at a scene start
const Leak: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 22], [-40, 140], clamp), o = interpolate(f, [0, 6, 22], [0, 0.55, 0], clamp);
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: o, background: `radial-gradient(700px 900px at ${x}% 40%, rgba(255,200,120,.9), rgba(255,120,60,.3) 40%, transparent 70%)` }} />;
};
const AiTag: React.FC = () => <div style={{ position: "absolute", right: 40, top: 44, fontFamily: BN, fontWeight: 600, fontSize: 22, color: "white", background: "rgba(0,0,0,.55)", border: "1px solid rgba(255,255,255,.25)", padding: "4px 14px", borderRadius: 6 }}>পুনর্নির্মিত দৃশ্য · এআই</div>;
const Clip: React.FC<{ src: string; from?: number; to?: number }> = ({ src, from = 1.0, to = 1.08 }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [0, durationInFrames], [from, to])})` }} />;
};
const Bug: React.FC = () => (
  <div style={{ position: "absolute", left: 48, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
    <Img src={staticFile("cob/logo-round.png")} style={{ height: 70 }} />
    <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 30, color: INK, background: GOLD, padding: "4px 18px", borderRadius: 999 }}>উদ্যোগের রঙ</span>
  </div>
);
const Big: React.FC<{ children: React.ReactNode; at?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, at = 0, size = 120, color = "white", style }) => {
  const f = useCurrentFrame();
  const p = spring({ frame: f - at, fps: 30, config: { damping: 15 } });
  return <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: size, color, lineHeight: 1.1, opacity: p, transform: `translateY(${(1 - p) * 40}px)`, textShadow: "0 8px 30px rgba(0,0,0,.6)", ...style }}>{children}</div>;
};

const A1: React.FC = () => (
  <AbsoluteFill>
    <Clip src="masum/ai/a1.mp4" from={1.08} to={1.0} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,10,8,.85) 0%, rgba(11,10,8,.35) 55%, transparent)" }} />
    <div style={{ position: "absolute", left: 140, top: 330 }}>
      <Big at={0} size={130}>সিলেটের এক গ্রাম</Big>
      <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 44, color: SOFT, marginTop: 14, opacity: T(useCurrentFrame(), 70, 95) }}>প্রযুক্তি বা ব্যবসার কোনো পারিবারিক পরিচয় নেই</div>
      <Big at={170} size={66} color={GOLD2} style={{ marginTop: 24 }}>একটি ল্যাপটপ, আর অদম্য বিশ্বাস</Big>
    </div>
    <AiTag />
  </AbsoluteFill>
);
const FLASH = ["masum/mp4.jpg", "masum/mp1.jpg", "masum/mp3.jpg", "masum/mp5.jpg", "masum/mp9.jpg"];
const A2: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.floor(f / 9);
  if (idx < FLASH.length) return <AbsoluteFill style={{ background: INK }}><Img src={staticFile(FLASH[idx])} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.12 - (f % 9) * 0.01})` }} /><AbsoluteFill style={{ background: "rgba(0,0,0,.25)" }} /></AbsoluteFill>;
  const g = f - FLASH.length * 9;
  return (
    <AbsoluteFill>
      <Bg />
      <Frame src="masum/mp6.jpg" x={1160} y={110} w={600} h={860} rot={2} origin="50% 25%" />
      <div style={{ position: "absolute", left: 150, top: 300 }}>
        <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 26, letterSpacing: 10, color: GOLD, opacity: T(g, 0, 15) }}>COLOURS OF BANGLADESH · FEATURE</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 150, color: "white", lineHeight: 1.05, opacity: T(g, 0, 20), transform: `scale(${1.15 - T(g, 0, 20) * 0.15})`, transformOrigin: "left center" }}>উদ্যোগের রঙ</div>
        <div style={{ width: T(g, 15, 50) * 640, height: 8, background: `linear-gradient(90deg, ${GOLD}, ${RED})`, margin: "20px 0 28px" }} />
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 70, color: GOLD2, opacity: T(g, 35, 60) }}>কাশিম উদ্দিন মাসুম</div>
        <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 38, color: SOFT, opacity: T(g, 55, 80) }}>প্রতিষ্ঠাতা ও চেয়ারম্যান, ড্রিম গ্রুপ</div>
      </div>
    </AbsoluteFill>
  );
};
const LowerThird: React.FC<{ k: string; t: string; at?: number }> = ({ k, t, at = 20 }) => {
  const f = useCurrentFrame();
  const p = spring({ frame: f - at, fps: 30, config: { damping: 16 } });
  return (
    <div style={{ position: "absolute", left: 120, bottom: 140, display: "flex", alignItems: "stretch", transform: `translateX(${(1 - p) * -700}px)` }}>
      <div style={{ background: GOLD, color: INK, fontFamily: HEAD, fontWeight: 800, fontSize: 36, padding: "14px 26px", display: "flex", alignItems: "center" }}>{k}</div>
      <div style={{ background: "rgba(11,10,8,.88)", color: "white", fontFamily: HEAD, fontWeight: 800, fontSize: 60, padding: "8px 34px" }}>{t}</div>
    </div>
  );
};
const A3: React.FC = () => (
  <AbsoluteFill>
    <Clip src="masum/ai/a2.mp4" />
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(11,10,8,.75), transparent 45%)" }} />
    <LowerThird k="ধাপ ১" t="মাসুম টেলিকম" />
    <div style={{ position: "absolute", left: 120, bottom: 90, fontFamily: BN, fontWeight: 600, fontSize: 34, color: SOFT, opacity: T(useCurrentFrame(), 90, 110) }}>মোবাইলের ছোট্ট দোকান, ব্যবসার প্রথম পাঠ</div>
    <AiTag />
  </AbsoluteFill>
);
const A4: React.FC = () => {
  const f = useCurrentFrame();
  const steps: [number, string, string, string][] = [[0, "ধাপ ২", "গ্রিন আইটি", "masum/mp3.jpg"], [80, "সাথে", "ক্রিয়েটিভ ফটোগ্রাফি", "masum/mp5.jpg"], [150, "ধাপ ৩", "ফ্রিল্যান্সিং", "masum/mp14.jpg"]];
  const cur = [...steps].reverse().find(([d]) => f >= d)!;
  return (
    <AbsoluteFill>
      <Bg />
      {steps.map(([d, , , src]) => <div key={src} style={{ opacity: cur[3] === src ? 1 : 0 }}><Frame src={src} x={1150} y={170} w={620} h={740} rot={2} delay={d} origin="50% 35%" /></div>)}
      <div style={{ position: "absolute", left: 140, top: 260, display: "flex", flexDirection: "column", gap: 34 }}>
        {steps.map(([d, k, t]) => {
          const p = spring({ frame: f - d, fps: 30, config: { damping: 15 } });
          const on = cur[0] === d;
          return <div key={t} style={{ opacity: p * (on ? 1 : 0.45), transform: `translateX(${(1 - p) * -80}px)` }}><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 30, color: GOLD }}>{k}</div><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: on ? 92 : 70, color: "white", lineHeight: 1.05 }}>{t}</div></div>;
        })}
        <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 34, color: SOFT, opacity: T(f, 190, 210) }}>দেশের বাইরের ক্লায়েন্টদের সঙ্গে কাজ</div>
      </div>
    </AbsoluteFill>
  );
};
const A5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill><KB src="masum/mp10.jpg" origin="30% 40%" /></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 30%, rgba(11,10,8,.9) 62%)" }} />
      <div style={{ position: "absolute", right: 120, top: 220, width: 760 }}>
        <Big at={0} size={70}>নিজে শিখেছেন,<br />শিখিয়েছেনও</Big>
        <div style={{ marginTop: 30, opacity: T(f, 190, 205) }}><Count to={500} at={192} size={200} color={GOLD2} suffix="+" /><div style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: SOFT }}>শিক্ষার্থী, অফলাইন ও অনলাইনে</div></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 26 }}>{["প্রোগ্রামিং", "ওয়েব", "অ্যাপ", "ডিজিটাল মার্কেটিং"].map((t, i) => <Chip key={t} delay={90 + i * 22} style={{ fontSize: 32, padding: "12px 22px" }}>{t}</Chip>)}</div>
      </div>
    </AbsoluteFill>
  );
};
const LOGOS = ["dreamit", "probashiinfo", "probashi", "visapoint", "gccguide", "dreaminternational", "countly", "safar", "ninetymins", "moneybag", "playr", "qount", "workforce", "soulmate", "infkey", "bondon"];
const A6: React.FC = () => {
  const f = useCurrentFrame();
  const inds = ["ফিনটেক", "ভ্রমণ", "এআই", "সামাজিক মাধ্যম", "খেলাধুলা"];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.25 }}><KB src="masum/mp13.jpg" /></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(11,10,8,.96), rgba(11,10,8,.75))" }} />
      <div style={{ position: "absolute", left: 140, top: 150 }}><Big size={96}>ড্রিম গ্রুপ</Big></div>
      <div style={{ position: "absolute", right: 140, top: 150, textAlign: "right" }}><Count to={20} at={150} size={130} color={GOLD2} suffix="+" /><div style={{ fontFamily: BN, fontWeight: 700, fontSize: 34, color: SOFT }}>ব্র্যান্ড · ৭টি খাত</div></div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 360, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 16 }}>
        {LOGOS.map((l, i) => {
          const p = spring({ frame: f - 10 - i * 8, fps: 30, config: { damping: 13 } });
          return <div key={l} style={{ height: 140, borderRadius: 18, background: "rgba(255,255,255,.96)", display: "flex", alignItems: "center", justifyContent: "center", padding: 14, opacity: p, transform: `scale(${0.6 + p * 0.4}) rotate(${(1 - p) * (i % 2 ? 8 : -8)}deg)` }}><Img src={staticFile(`masum/logo-${l}.png`)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /></div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 140, top: 720, display: "flex", gap: 16, flexWrap: "wrap" }}>{inds.map((t, i) => <Chip key={t} delay={110 + i * 22} style={{ fontSize: 38, background: i === 0 ? RED : "rgba(255,255,255,.1)" }}>{t}</Chip>)}<Chip delay={220} style={{ fontSize: 38 }}>আরও…</Chip></div>
      <Src t="dreamithq.com, kumasum" />
    </AbsoluteFill>
  );
};
const A7: React.FC = () => {
  const f = useCurrentFrame();
  const C: [string, number, number][] = [["দোহা", 1080, 470], ["ঢাকা", 1560, 560], ["মাদ্রিদ", 260, 330]];
  const brands: [number, string, string][] = [[10, "প্রবাসী ইনফো", "probashiinfo"], [55, "প্রবাসী বন্ধু", "probashi"], [110, "ভিসাপয়েন্ট", "visapoint"], [170, "জিসিসি গাইড", "gccguide"]];
  return (
    <AbsoluteFill>
      <Bg />
      <svg width={1920} height={1080} style={{ position: "absolute", top: 120 }}>
        {[[1, 0], [1, 2]].map(([a, b], i) => { const [, x1, y1] = C[a], [, x2, y2] = C[b]; const d = `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 220} ${x2} ${y2}`; return <path key={i} d={d} stroke={GOLD} strokeWidth={4} fill="none" pathLength={1} strokeDasharray={`${T(f, 250 + i * 25, 300 + i * 25)} 1`} />; })}
        {C.map(([n, x, y], i) => <g key={n} opacity={T(f, 240 + i * 15, 255 + i * 15)}><circle cx={x} cy={y} r={14} fill={n === "ঢাকা" ? RED : GOLD} stroke="white" strokeWidth={4} /><circle cx={x} cy={y} r={14 + ((f + i * 13) % 40) * 0.8} fill="none" stroke={GOLD2} strokeWidth={2} opacity={1 - ((f + i * 13) % 40) / 40} /><text x={x} y={y + 64} textAnchor="middle" fill="white" fontFamily={HEAD} fontWeight={800} fontSize={48}>{n}</text></g>)}
      </svg>
      <div style={{ position: "absolute", left: 140, top: 160, display: "flex", gap: 18 }}>
        {brands.map(([d, n, l]) => {
          const p = spring({ frame: f - d, fps: 30, config: { damping: 15 } });
          return <div key={n} style={{ width: 290, borderRadius: 18, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)", padding: 16, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}><div style={{ height: 90, background: "white", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}><Img src={staticFile(`masum/logo-${l}.png`)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /></div><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 36, color: "white", marginTop: 10, textAlign: "center" }}>{n}</div></div>;
        })}
      </div>
      <Src t="dreamithq.com" />
    </AbsoluteFill>
  );
};
const PRIN: [number, string, string, string][] = [[0, "০১", "মানুষ আগে", "masum/mp4.jpg"], [62, "০২", "সৌন্দর্য জরুরি", "masum/mp5.jpg"], [124, "০৩", "দ্রুত এগোও", "masum/mp1.jpg"], [180, "০৪", "ভাবো পুরো সিস্টেম নিয়ে", "masum/mp7.jpg"]];
const A8: React.FC = () => {
  const f = useCurrentFrame();
  const cur = [...PRIN].reverse().find(([d]) => f >= d)!;
  const local = f - cur[0];
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Img src={staticFile(cur[3])} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.15 - local * 0.002})`, filter: "brightness(.55)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 40, color: GOLD, letterSpacing: 8, opacity: T(local, 0, 8) }}>নীতি {cur[1]}</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 150, color: "white", transform: `scale(${1.25 - T(local, 0, 10) * 0.25})`, opacity: T(local, 0, 8), textShadow: "0 10px 40px rgba(0,0,0,.7)" }}>{cur[2]}</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "white", opacity: interpolate(local, [0, 3], [0.6, 0], clamp) }} />
      <Src t="kumasum (নিজস্ব সাইট)" />
    </AbsoluteFill>
  );
};
const A9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg />
      <Frame src="masum/mp2.jpg" x={1180} y={130} w={540} h={820} rot={2} origin="50% 35%" />
      <div style={{ position: "absolute", left: 140, top: 210, width: 950 }}>
        <div style={{ width: 300, height: 400, borderRadius: 10, background: `linear-gradient(150deg, ${GOLD}, #7a5a1c)`, boxShadow: "0 30px 60px rgba(0,0,0,.5)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 28, transform: `perspective(900px) rotateY(${(1 - T(f, 0, 30)) * -70}deg) rotate(-5deg)`, opacity: T(f, 0, 20) }}>
          <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 52, color: INK, lineHeight: 1 }}>AI<br />Mastery</div>
          <div style={{ fontFamily: BN, fontSize: 22, color: INK, marginTop: 10 }}>বিনামূল্যে · বাংলা ও ইংরেজি</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 50 }}>{["সফটওয়্যার প্রকৌশলী", "ডিজিটাল মার্কেটার", "মোটিভেশনাল স্পিকার"].map((t, i) => <Chip key={t} delay={190 + i * 28} style={{ fontSize: 36 }}>{t}</Chip>)}</div>
      </div>
      <Src t="dreamithq.com" />
    </AbsoluteFill>
  );
};
const A10: React.FC = () => {
  const f = useCurrentFrame();
  const words = ["শুধু", "সেই", "কাজই", "দেব,", "যেখানে", "নিজের", "নাম", "বসাতে", "পারি"];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.35 }}><KB src="masum/mp11.jpg" /></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(11,10,8,.95), rgba(11,10,8,.7))" }} />
      <div style={{ position: "absolute", left: 200, right: 200, top: 300, textAlign: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 84, lineHeight: 1.35, color: "white" }}>
        {words.map((w, i) => <span key={i} style={{ opacity: T(f, 50 + i * 9, 60 + i * 9), color: w === "নিজের" || w === "নাম" ? GOLD2 : "white" }}>{w} </span>)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: BN, fontSize: 34, color: SOFT, opacity: T(f, 170, 190) }}>— কাশিম উদ্দিন মাসুম · সেই নিয়ম আজও বদলায়নি</div>
      <Src t="dreamithq.com (ইংরেজি উক্তির বাংলা)" />
    </AbsoluteFill>
  );
};
const A11: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Clip src="masum/ai/a3.mp4" from={1.0} to={1.1} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,10,8,.85) 0%, rgba(11,10,8,.3) 55%, transparent)" }} />
      <div style={{ position: "absolute", left: 140, top: 230 }}>
        <Big at={0} size={72}>সিলেটের গ্রাম থেকে</Big>
        <Big at={20} size={88} color={GOLD2}>তিন দেশে ছড়ানো উদ্যোগ</Big>
        <Big at={80} size={54} color={SOFT} style={{ marginTop: 16 }}>বয়স মাত্র ২৮</Big>
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 50, opacity: T(f, 260, 290) }}>
          <Img src={staticFile("cob/logo-round.png")} style={{ height: 130 }} />
          <div><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52, color: "white" }}>উদ্যোগের রঙ</div><div style={{ fontFamily: BN, fontSize: 28, color: SOFT }}>প্রতি সপ্তাহে নতুন উদ্যোক্তার গল্প</div></div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", fontFamily: BN, fontWeight: 600, fontSize: 24, color: GOLD2, opacity: T(f, 130, 150) }}>প্রকাশ: কালারস অব বাংলাদেশ ড্রিম গ্রুপের একটি প্রতিষ্ঠান · তথ্যসূত্র: dreamithq.com, kumasum</div>
      <AiTag />
    </AbsoluteFill>
  );
};

const VO = [267, 215, 215, 267, 327, 303, 363, 253, 354, 270, 397];
const SCENES = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11];
const PAD = 14, LEAD = 6;
const starts: number[] = []; let acc = 0;
VO.forEach((v, i) => { starts.push(acc); acc += v + PAD + LEAD + (i === 1 ? 42 : 0); });
export const MASUM2_LEN = acc + 50;
export const Masum2: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: INK }}>
      {SCENES.map((S, i) => {
        const len = VO[i] + PAD + LEAD + (i === SCENES.length - 1 ? 50 : 0);
        // the title scene opens on a photo flash, so its VO waits for the montage
        const lead = i === 1 ? 48 : LEAD;
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={i === 1 ? len + 42 : len}>
            <S />
            {i > 0 && <Leak />}
            <Sequence from={lead}><Audio src={staticFile(`ms2vo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
          </Sequence>
        );
      })}
      <Bug />
      <Audio src={staticFile("ms2music.mp3")} volume={(f) => interpolate(f, [0, 15, durationInFrames - 70, durationInFrames], [0, 0.24, 0.24, 0], clamp)} />
      {starts.slice(1).map((s, i) => <Sfx key={i} at={s} src="sfx/whoosh.mp3" vol={0.28} />)}
      {[0, 9, 18, 27, 36].map((d) => <Sfx key={d} at={starts[1] + d} src="btlsfx/swoosh.mp3" vol={0.18} />)}
    </AbsoluteFill>
  );
};
