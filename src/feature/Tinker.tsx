// Colours of Bangladesh — feature series "উদ্যোগের রঙ" ep.1: টিংকার জান্নাত মিম (Pop of Color, Tinker's Tea).
// Facts: Dhaka Tribune 2016 (13,912 members), Pop of Color Ltd site (Ltd 2018, MD), The Prestige 2021 (~27k members,
// invite-only since 2019, 850+ partners, cyber-crime work, quote), Jago News headline (15,000 women), tinkerstea.com "Our Story".
// Photos of Tinker: supplied by the owner from her public pages. Tea gardens: Wikimedia Commons (credited on screen).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BN, bn, clamp, ease, useSp } from "../news/NewsKit";

const MAG = "#e0287d", MAG2 = "#ff6fb0", RED = "#e0142b", INK = "#140b12", CREAM = "#fff5f9", GOLD = "#ffcf5a";
export const HEAD = "Anek";
if (typeof document !== "undefined") {
  const ff = new FontFace("Anek", `url(${staticFile("fonts/AnekBangla.ttf")})`, { weight: "100 900" });
  ff.load().then(() => document.fonts.add(ff)).catch(() => {});
}
export const T = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });
const TEA = ["SP Suhag Debbarma / CC BY-SA 4.0", "Radman Siddiki / CC BY 4.0", "Radman Siddiki / CC BY 4.0", "Kritzolina / CC BY-SA 4.0"];

const Bg: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1000px 700px at ${30 + Math.sin(f / 80) * 8}% 30%, rgba(224,40,125,.45), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(255,207,90,.18), transparent 60%), linear-gradient(160deg,#2a0f22,${INK})` }}>
      {Array.from({ length: 18 }, (_, i) => {
        const x = (i * 137) % 1920, y = ((i * 251 + f * (0.4 + (i % 5) * 0.15)) % 1200) - 60;
        return <div key={i} style={{ position: "absolute", left: x, top: 1080 - y, width: 8 + (i % 4) * 6, height: 8 + (i % 4) * 6, borderRadius: 99, background: i % 3 ? "rgba(255,111,176,.35)" : "rgba(255,207,90,.4)", filter: "blur(1px)" }} />;
      })}
    </AbsoluteFill>
  );
};
export const KB: React.FC<{ src: string; from?: number; to?: number; origin?: string; style?: React.CSSProperties; fit?: "cover" | "contain" }> = ({ src, from = 1.04, to = 1.16, origin = "50% 40%", style, fit = "cover" }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: fit, transform: `scale(${interpolate(f, [0, durationInFrames], [from, to])})`, transformOrigin: origin, ...style }} />;
};
export const Frame: React.FC<{ src: string; x: number; y: number; w: number; h: number; delay?: number; rot?: number; origin?: string; credit?: string }> = ({ src, x, y, w, h, delay = 0, rot = 0, origin, credit }) => {
  const s = useSp(delay, 15);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 26, overflow: "hidden", border: "8px solid rgba(255,255,255,.95)", boxShadow: "0 40px 90px rgba(0,0,0,.55)", transform: `rotate(${rot}deg) scale(${0.85 + s * 0.15})`, opacity: s }}>
      <KB src={src} origin={origin} />
      {credit && <div style={{ position: "absolute", right: 10, bottom: 8, fontFamily: BN, fontSize: 16, color: "rgba(255,255,255,.85)", background: "rgba(0,0,0,.45)", padding: "1px 8px", borderRadius: 4 }}>{credit}</div>}
    </div>
  );
};
export const Chip: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const s = useSp(delay, 14);
  return <div style={{ display: "inline-block", padding: "16px 28px", borderRadius: 18, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.22)", backdropFilter: "blur(8px)", fontFamily: BN, fontWeight: 700, color: "white", fontSize: 36, opacity: s, transform: `translateY(${(1 - s) * 40}px)`, ...style }}>{children}</div>;
};
export const Count: React.FC<{ to: number; at: number; dur?: number; suffix?: string; size?: number; color?: string }> = ({ to, at, dur = 50, suffix = "", size = 120, color = "white" }) => {
  const f = useCurrentFrame();
  return <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: size, color, fontVariantNumeric: "tabular-nums" }}>{bn(Math.round(T(f, at, at + dur, 0, to)).toLocaleString("en-IN"))}{suffix}</span>;
};
export const Src: React.FC<{ t: string }> = ({ t }) => <div style={{ position: "absolute", right: 48, bottom: 40, fontFamily: BN, fontSize: 22, color: "rgba(255,255,255,.7)", background: "rgba(0,0,0,.35)", padding: "4px 14px", borderRadius: 6 }}>সূত্র: {t}</div>;
const Bug: React.FC = () => (
  <div style={{ position: "absolute", left: 48, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
    <Img src={staticFile("cob/logo-round.png")} style={{ height: 70 }} />
    <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 30, color: "white", background: MAG, padding: "4px 18px", borderRadius: 999 }}>উদ্যোগের রঙ</span>
  </div>
);

// 1 — 2014, a small Facebook group
const F1: React.FC = () => {
  const f = useCurrentFrame();
  const members = Math.round(T(f, 120, 300, 1, 14000));
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", left: 140, top: 250, fontFamily: HEAD, fontWeight: 800, fontSize: 260, color: "white", opacity: T(f, 0, 25), letterSpacing: 0 }}>{bn(2014)}</div>
      <div style={{ position: "absolute", left: 150, top: 640, fontFamily: BN, fontWeight: 700, fontSize: 52, color: MAG2, opacity: T(f, 30, 55) }}>একটি ছোট্ট ফেসবুক গ্রুপ</div>
      <div style={{ position: "absolute", right: 160, top: 220, width: 620, borderRadius: 28, background: "#fff", overflow: "hidden", boxShadow: "0 50px 100px rgba(0,0,0,.5)", transform: `translateY(${(1 - useSp(60)) * 120}px)`, opacity: useSp(60) }}>
        <div style={{ height: 200, background: `linear-gradient(120deg, ${MAG}, #ff9a5a)` }} />
        <div style={{ padding: "26px 32px", fontFamily: BN }}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52, color: INK }}>Pop of Color</div>
          <div style={{ fontSize: 28, color: "#7a6672" }}>নারীদের গ্রুপ · মেকআপ ও সৌন্দর্য</div>
          <div style={{ marginTop: 22, fontSize: 30, color: INK }}><b style={{ fontFamily: HEAD, fontSize: 46, color: MAG }}>{bn(members.toLocaleString("en-IN"))}</b> সদস্য</div>
          <div style={{ marginTop: 18, fontSize: 30, color: INK, background: "#fff0f6", borderRadius: 14, padding: "14px 18px", opacity: T(f, 220, 250) }}>“গুজব নয়, একে অপরের পাশে” 💗</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
// 2 — series title + portrait
const F2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg />
      <Frame src="tinker/p1.jpg" x={1150} y={110} w={600} h={860} rot={2} origin="50% 25%" />
      <div style={{ position: "absolute", left: 150, top: 300 }}>
        <div style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 26, letterSpacing: 10, color: MAG2, opacity: T(f, 0, 20) }}>COLOURS OF BANGLADESH · FEATURE</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 150, color: "white", lineHeight: 1.05, opacity: T(f, 5, 30), transform: `translateY(${(1 - T(f, 5, 30)) * 30}px)` }}>উদ্যোগের রঙ</div>
        <div style={{ width: T(f, 30, 70) * 640, height: 8, background: `linear-gradient(90deg, ${MAG}, ${GOLD})`, margin: "20px 0 28px" }} />
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 70, color: GOLD, opacity: T(f, 60, 90) }}>টিংকার জান্নাত মিম</div>
        <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 38, color: "#f3d6e4", opacity: T(f, 80, 110) }}>প্রতিষ্ঠাতা, পপ অব কালার</div>
      </div>
    </AbsoluteFill>
  );
};
// 3 — growth timeline
const STEPS: [number, string, React.ReactNode][] = [[10, "২০১৪", "ফেসবুক গ্রুপ হিসেবে শুরু"], [120, "২০১৬", <><b style={{ color: GOLD }}>১৩,৯১২</b> সদস্য</>], [260, "২০১৮", "পপ অব কালার লিমিটেড · ব্যবস্থাপনা পরিচালক টিংকার"]];
const F3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg />
      <Frame src="tinker/p4.jpg" x={1240} y={220} w={540} h={540} rot={-2} delay={20} />
      <div style={{ position: "absolute", left: 150, top: 220, bottom: 200, width: 6, background: "rgba(255,255,255,.15)" }}><div style={{ width: "100%", height: `${T(f, 10, 330) * 100}%`, background: `linear-gradient(180deg, ${MAG}, ${GOLD})` }} /></div>
      {STEPS.map(([d, y, t], i) => {
        const s = spring({ frame: f - d, fps: 30, config: { damping: 14 } });
        return (
          <div key={y} style={{ position: "absolute", left: 128, top: 200 + i * 220, display: "flex", gap: 40, opacity: s, transform: `translateX(${(1 - s) * 60}px)` }}>
            <div style={{ width: 50, height: 50, borderRadius: 99, background: MAG, border: "7px solid white", marginTop: 8 }} />
            <div style={{ maxWidth: 900 }}><div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 72, color: "white", lineHeight: 1 }}>{y}</div><div style={{ fontFamily: BN, fontWeight: 700, fontSize: 44, color: "#f3d6e4", marginTop: 8 }}>{t}</div></div>
          </div>
        );
      })}
      <Src t="ঢাকা ট্রিবিউন (২০১৬), পপ অব কালার লিমিটেড" />
    </AbsoluteFill>
  );
};
// 4 — quote + numbers
const F4: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg />
      <Frame src="tinker/p3.jpg" x={140} y={190} w={520} h={700} rot={-2} origin="50% 30%" />
      <div style={{ position: "absolute", left: 760, top: 200, right: 140 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 160, lineHeight: 0.5, color: MAG2, opacity: T(f, 0, 20) }}>“</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 62, color: "white", lineHeight: 1.25, opacity: T(f, 5, 30) }}>সদস্য বাড়ানো কখনো আমাদের লক্ষ্য ছিল না</div>
        <div style={{ fontFamily: BN, fontSize: 30, color: "#f3d6e4", marginTop: 12, opacity: T(f, 25, 45) }}>— টিংকার জান্নাত মিম, দ্য প্রেস্টিজ (২০২১)</div>
        <div style={{ display: "flex", gap: 26, marginTop: 50 }}>
          <Chip delay={130} style={{ flex: 1 }}><div style={{ fontSize: 26, color: "#f3d6e4" }}>২০১৯ থেকে</div>শুধু আমন্ত্রণে সদস্যপদ</Chip>
          <Chip delay={200} style={{ flex: 1 }}><div style={{ fontSize: 26, color: "#f3d6e4" }}>২০২১-এ সদস্য</div>প্রায় <Count to={27000} at={205} size={64} color={GOLD} /></Chip>
          <Chip delay={300} style={{ flex: 1 }}><div style={{ fontSize: 26, color: "#f3d6e4" }}>সহযোগী প্রতিষ্ঠান</div><Count to={850} at={305} size={64} color={GOLD} suffix="+" /></Chip>
        </div>
      </div>
      <Src t="দ্য প্রেস্টিজ, ২৭ জানুয়ারি ২০২১" />
    </AbsoluteFill>
  );
};
// 5 — impact
const F5: React.FC = () => {
  const f = useCurrentFrame();
  const items = ["নারী উদ্যোক্তাদের প্রচার ও বিক্রি", "মানসিক স্বাস্থ্য", "পারিবারিক নির্যাতনের বিরুদ্ধে", "সাইবার বুলিং প্রতিরোধ"];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.35 }}><KB src="tinker/banner.jpg" origin="80% 40%" /></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(20,11,18,.97) 0%, rgba(20,11,18,.88) 55%, rgba(20,11,18,.5))" }} />
      <div style={{ position: "absolute", left: 150, top: 200, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, width: 1000 }}>
        {items.map((t, i) => <Chip key={t} delay={10 + i * 45} style={{ fontSize: 38 }}>{t}</Chip>)}
      </div>
      <div style={{ position: "absolute", left: 150, top: 560, opacity: T(f, 300, 330) }}>
        <div style={{ fontFamily: BN, fontSize: 38, color: "#f3d6e4" }}>স্বাবলম্বী হতে সাহায্য পেয়েছেন</div>
        <div><Count to={15000} at={305} dur={60} size={190} color={GOLD} /><span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 90, color: "white" }}> নারী</span></div>
      </div>
      <Src t="দ্য প্রেস্টিজ (২০২১), জাগো নিউজ" />
    </AbsoluteFill>
  );
};
// 6 — Sreemangal tea
const F6: React.FC = () => {
  const f = useCurrentFrame();
  const swap = f > 210;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: swap ? 0 : 1 }}><KB src="tinker/tea1.jpg" from={1.02} to={1.12} /></AbsoluteFill>
      <AbsoluteFill style={{ opacity: T(f, 200, 225) }}><KB src="tinker/tea2.jpg" from={1.12} to={1.02} /></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(10,20,10,.85), transparent 55%)" }} />
      <div style={{ position: "absolute", left: 140, bottom: 170, fontFamily: HEAD, color: "white" }}>
        <div style={{ fontWeight: 800, fontSize: 110, opacity: T(f, 10, 35) }}>চায়ের দেশ শ্রীমঙ্গল</div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 44, color: GOLD, opacity: T(f, 120, 145) }}>পরিবারের প্রায় ২৭ বছরের চা-ব্যবসা · সেরা চা যেত বিদেশে</div>
      </div>
      <div style={{ position: "absolute", right: 30, bottom: 24, fontFamily: BN, fontSize: 18, color: "rgba(255,255,255,.8)" }}>ছবি: {swap ? TEA[1] : TEA[0]}, উইকিমিডিয়া কমন্স</div>
    </AbsoluteFill>
  );
};
// 7 — Tinker's Tea + family of brands
const F7: React.FC = () => {
  const f = useCurrentFrame();
  const teas: [string, string][] = [["প্রিমিয়াম ব্ল্যাক টি", "#5a2e14"], ["সিগনেচার গোল্ড টি", "#b9852a"], ["গ্রিন টি", "#2f7d3a"]];
  const brands = ["Pop of Color", "Pop of Hope", "Pop of Flavors", "TJM", "POC Creative Hive"];
  return (
    <AbsoluteFill>
      <AbsoluteFill><KB src="tinker/tea3.jpg" /></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(20,11,18,.95) 0%, rgba(20,11,18,.75) 60%, rgba(20,11,18,.35))" }} />
      <div style={{ position: "absolute", left: 140, top: 170 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 120, color: "white", opacity: T(f, 0, 25) }}>টিংকার্স টি</div>
        <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: GOLD, opacity: T(f, 20, 45) }}>শ্রীমঙ্গলের বাগান থেকে সরাসরি, দেশজুড়ে অনলাইনে</div>
        <div style={{ display: "flex", gap: 22, marginTop: 40 }}>
          {teas.map(([t, c], i) => <Chip key={t} delay={60 + i * 25} style={{ background: c, border: "none", fontSize: 34 }}>☕ {t}</Chip>)}
        </div>
        <div style={{ fontFamily: BN, fontSize: 32, color: "#f3d6e4", marginTop: 60, opacity: T(f, 200, 220) }}>একই পরিবারের উদ্যোগ</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 14, maxWidth: 1300 }}>
          {brands.map((b, i) => <Chip key={b} delay={215 + i * 18} style={{ fontFamily: "Montserrat", fontSize: 30, background: i ? "rgba(255,255,255,.12)" : MAG }}>{b}</Chip>)}
        </div>
      </div>
      <div style={{ position: "absolute", right: 30, bottom: 24, fontFamily: BN, fontSize: 18, color: "rgba(255,255,255,.8)" }}>ছবি: {TEA[2]}, উইকিমিডিয়া কমন্স · সূত্র: tinkerstea.com</div>
    </AbsoluteFill>
  );
};
// 8 — outro
const F8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg />
      <Frame src="tinker/p1.jpg" x={140} y={150} w={520} h={760} rot={-2} origin="50% 25%" />
      <div style={{ position: "absolute", left: 760, top: 260, right: 120, fontFamily: HEAD, color: "white" }}>
        <div style={{ fontWeight: 800, fontSize: 66, lineHeight: 1.25, opacity: T(f, 0, 25) }}>একটি ফেসবুক গ্রুপ থেকে<br /><span style={{ color: GOLD }}>একটি বিজনেস গ্রুপ</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 60, opacity: T(f, 90, 120) }}>
          <Img src={staticFile("cob/logo-round.png")} style={{ height: 150 }} />
          <div><div style={{ fontWeight: 800, fontSize: 56 }}>উদ্যোগের রঙ</div><div style={{ fontFamily: BN, fontSize: 30, color: "#f3d6e4" }}>প্রতি সপ্তাহে নতুন উদ্যোক্তার গল্প</div></div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", fontFamily: BN, fontSize: 20, color: "rgba(255,255,255,.6)" }}>তথ্যসূত্র: ঢাকা ট্রিবিউন, দ্য প্রেস্টিজ, জাগো নিউজ, পপ অব কালার লিমিটেড, tinkerstea.com · ছবি: টিংকার জান্নাত মিম / পপ অব কালার; উইকিমিডিয়া কমন্স</div>
    </AbsoluteFill>
  );
};

const VO = [359, 198, 443, 433, 488, 423, 409, 272];
const SCENES = [F1, F2, F3, F4, F5, F6, F7, F8];
const PAD = 16, LEAD = 8;
const starts: number[] = []; let acc = 0;
for (const v of VO) { starts.push(acc); acc += v + PAD + LEAD; }
export const TINKER_LEN = acc + 40;
export const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, 12, len - 8, len], [0, 1, 1, 0], clamp) }}>{children}</AbsoluteFill>;
};
export const TinkerFeature: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: INK }}>
      {SCENES.map((S, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={VO[i] + PAD + LEAD + (i === SCENES.length - 1 ? 40 : 0)}>
          <Fade len={VO[i] + PAD + LEAD + (i === SCENES.length - 1 ? 40 : 0)}><S /></Fade>
          <Sequence from={LEAD}><Audio src={staticFile(`tkvo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
        </Sequence>
      ))}
      <Bug />
      <Audio src={staticFile("tkmusic.mp3")} volume={(f) => interpolate(f, [0, 20, durationInFrames - 60, durationInFrames], [0, 0.22, 0.22, 0], clamp)} loop />
    </AbsoluteFill>
  );
};
