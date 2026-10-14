// Story: কুমিল্লায় স্কুলছাত্রী হত্যা — কক্সবাজার থেকে কথিত প্রেমিক আটক (12 Oct 2026).
// Facts: bdnews24, samakal, ittefaq, risingbd (cross-checked). Footage: Channel One News (credited at the end, per the owner's decision).
// Child victim: never show her name or photo. Raju is a suspect only — police: involvement to be determined after questioning.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { LAND } from "../../dots";
import { N, BN, clamp, ease, useSp, NewsStory, Segment, storyLen, COB_THEME } from "../NewsKit";

export const FOOTAGE = "btl2/footage.mp4";
// start times (seconds) into the footage for each clip — set after watching it
export const CLIP: Record<string, number> = { a: 150, b: 23, c: 159, d: 104 };

const Footage: React.FC<{ at: number; blurTop?: boolean }> = ({ at }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <OffthreadVideo src={staticFile(FOOTAGE)} startFrom={Math.round(at * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <div style={{ position: "absolute", right: 24, top: 20, padding: "4px 12px", borderRadius: 6, background: "rgba(0,0,0,.55)", fontFamily: BN, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,.85)" }}>ভিডিও: চ্যানেল ওয়ান</div>
  </AbsoluteFill>
);

const Card: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const s = useSp(delay, 14);
  return <div style={{ padding: "22px 34px", borderRadius: 20, background: "rgba(14,23,28,.9)", border: "2px solid rgba(255,255,255,.15)", boxShadow: "0 30px 70px rgba(0,0,0,.5)", fontFamily: BN, color: "white", transform: `translateY(${(1 - s) * 80}px)`, opacity: s, ...style }}>{children}</div>;
};

const V1: React.FC = () => <Footage at={CLIP.a} />;

const V2: React.FC = () => (
  <AbsoluteFill>
    <Footage at={CLIP.b} />
    <div style={{ position: "absolute", left: 70, top: 140 }}>
      <Card delay={10}><div style={{ fontSize: 26, color: "#ff5a68", fontWeight: 700 }}>আটক</div><div style={{ fontSize: 48, fontWeight: 700 }}>রিয়াজ উদ্দিন ওরফে রাজু</div><div style={{ fontSize: 30, opacity: 0.85 }}>হোটেল কর্মচারী · কলাতলী, কক্সবাজার</div></Card>
    </div>
  </AbsoluteFill>
);

const proj = (lat: number, lng: number): [number, number] => [((lng - 80) / 20) * 1920, ((28.4 - lat) / 11.25) * 1080];
const V3: React.FC = () => {
  const f = useCurrentFrame();
  const A = proj(23.46, 91.18), B = proj(21.43, 92.0);
  const d = `M ${A[0]} ${A[1]} Q ${A[0] + 320} ${(A[1] + B[1]) / 2} ${B[0]} ${B[1]}`;
  const p = interpolate(f, [20, 100], [0, 1], { ...clamp, easing: ease });
  const ev = evolvePath(p, d);
  const pt = getPointAtLength(d, Math.max(0.1, p * getLength(d)));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 60% 50%, #10306e, #04102a 75%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {LAND.map(([la, lo], i) => { const [x, y] = proj(la, lo); return x > -40 && x < 1960 && y > -40 && y < 1120 ? <circle key={i} cx={x} cy={y} r={20} fill="rgba(140,180,255,.18)" /> : null; })}
        <path d={d} stroke={N.red2} strokeWidth={7} fill="none" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
        {[A, B].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={18} fill={N.red2} stroke="white" strokeWidth={4} /><circle cx={x} cy={y} r={18 + ((f + i * 20) % 40)} fill="none" stroke="white" strokeWidth={2} opacity={1 - ((f + i * 20) % 40) / 40} /></g>)}
        {f > 20 && p < 1 && <text x={pt.x} y={pt.y} fontSize={60} textAnchor="middle" dominantBaseline="central">🚌</text>}
      </svg>
      <div style={{ position: "absolute", left: A[0] - 380, top: A[1] - 60 }}><Card delay={6}><div style={{ fontSize: 46, fontWeight: 700 }}>কুমিল্লা</div><div style={{ fontSize: 26, opacity: 0.75 }}>লালমাই</div></Card></div>
      <div style={{ position: "absolute", left: B[0] + 40, top: B[1] - 60 }}><Card delay={30}><div style={{ fontSize: 46, fontWeight: 700 }}>কক্সবাজার</div><div style={{ fontSize: 26, opacity: 0.75 }}>কলাতলী</div></Card></div>
      <div style={{ position: "absolute", left: 80, top: 520, display: "flex", flexDirection: "column", gap: 16 }}>
        <Card delay={60} style={{ fontSize: 38, fontWeight: 700 }}>ফেসবুকে পরিচয়</Card>
        <Card delay={90} style={{ fontSize: 38, fontWeight: 700 }}>প্রায় ৩ মাসের যোগাযোগ</Card>
        <Card delay={150} style={{ fontSize: 38, fontWeight: 700 }}>পরে বাসে তুলে দেন রাজু</Card>
      </div>
      <div style={{ position: "absolute", right: 40, bottom: 210, fontFamily: BN, fontSize: 24, color: "rgba(255,255,255,.6)" }}>পুলিশের ভাষ্য অনুযায়ী</div>
    </AbsoluteFill>
  );
};

const V4: React.FC = () => {
  const s = useSp(15, 13);
  return (
    <AbsoluteFill>
      <Footage at={CLIP.c} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,19,23,.92) 0%, rgba(11,19,23,.6) 55%, transparent 80%)" }} />
      <div style={{ position: "absolute", left: 90, top: 230, width: 980, fontFamily: BN, color: "white", opacity: s, transform: `translateX(${(1 - s) * -120}px)` }}>
        <div style={{ fontSize: 140, lineHeight: 0.6, color: N.red2, fontFamily: "Georgia, serif" }}>“</div>
        <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.3 }}>হত্যাকাণ্ডে সম্পৃক্ততা আছে কি না, জিজ্ঞাসাবাদ ও যাচাইয়ের পর নিশ্চিত হওয়া যাবে</div>
        <div style={{ marginTop: 20, fontSize: 32, color: "#ff5a68" }}>— পুলিশ</div>
      </div>
    </AbsoluteFill>
  );
};

const STEPS: [string, string][] = [["বৃহস্পতিবার, ৮ অক্টোবর", "লালমাইয়ে ধানখেত থেকে মরদেহ উদ্ধার"], ["শুক্রবার, ৯ অক্টোবর", "অটোরিকশাচালক সুমন চট্টগ্রামে গ্রেপ্তার"], ["আদালতে", "দায় স্বীকার করে জবানবন্দি সুমনের"], ["রোববার, ১১ অক্টোবর", "কক্সবাজারে কথিত প্রেমিক রাজু আটক"]];
const V5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #0a2356, #050c1f)", fontFamily: BN }}>
      <div style={{ position: "absolute", left: 120, top: 130, color: "white", fontSize: 70, fontWeight: 700 }}>ঘটনাক্রম</div>
      <div style={{ position: "absolute", left: 150, top: 270, bottom: 230, width: 6, background: "rgba(255,255,255,.15)" }}>
        <div style={{ width: "100%", height: `${interpolate(f, [10, 420], [0, 100], clamp)}%`, background: `linear-gradient(180deg, ${N.red2}, ${"#ff5a68"})` }} />
      </div>
      {STEPS.map(([a, b], i) => {
        const s = spring({ frame: f - 15 - i * 95, fps: 30, config: { damping: 14 } });
        return (
          <div key={a} style={{ position: "absolute", left: 130, top: 270 + i * 150, display: "flex", gap: 40, alignItems: "flex-start", opacity: s, transform: `translateX(${(1 - s) * 80}px)` }}>
            <div style={{ width: 46, height: 46, borderRadius: 99, background: N.red2, border: "6px solid white", marginTop: 4 }} />
            <div><div style={{ color: "#ff5a68", fontSize: 36, fontWeight: 700 }}>{a}</div><div style={{ color: "white", fontSize: 46, fontWeight: 700 }}>{b}</div></div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const V6: React.FC = () => (
  <AbsoluteFill>
    <Footage at={CLIP.d} />
    <div style={{ position: "absolute", left: 70, bottom: 220 }}><Card delay={8} style={{ fontSize: 50, fontWeight: 700 }}>মামলার তদন্ত চলছে</Card></div>
  </AbsoluteFill>
);

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(4, 12);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #24343c, #0b1317 65%)`, justifyContent: "center", alignItems: "center", fontFamily: BN, color: "white" }}>
      <img src={staticFile("cob/logo-light.png")} style={{ width: 760, transform: `scale(${s})` }} />
      <div style={{ marginTop: 18, fontSize: 54, fontWeight: 700, opacity: interpolate(f, [20, 35], [0, 1], clamp) }}>বাংলাদেশের রঙে সংবাদ, গল্প ও জীবন</div>
      <div style={{ marginTop: 30, fontSize: 40, fontWeight: 700, color: "#ff5a68", opacity: interpolate(f, [30, 45], [0, 1], clamp) }}>ভিডিও ক্রেডিট: চ্যানেল ওয়ান</div>
      <div style={{ position: "absolute", bottom: 50, fontSize: 26, opacity: 0.7 }}>তথ্যসূত্র: বিডিনিউজ২৪, সমকাল, ইত্তেফাক, রাইজিংবিডি</div>
    </AbsoluteFill>
  );
};

const VO_LEN = [269, 262, 262, 230, 470, 215];
const SEGMENTS: Segment[] = [
  { vo: "btl2vo/01.mp3", voLen: VO_LEN[0], label: "ব্রেকিং", headline: "স্কুলছাত্রী হত্যা: কক্সবাজার থেকে কথিত প্রেমিক আটক", zoom: 0, visual: V1, breaking: true },
  { vo: "btl2vo/02.mp3", voLen: VO_LEN[1], label: "কক্সবাজার", headline: "কলাতলীর হোটেল থেকে আটক রিয়াজ উদ্দিন ওরফে রাজু", zoom: 1, visual: V2 },
  { vo: "btl2vo/03.mp3", voLen: VO_LEN[2], label: "পুলিশ", headline: "ফেসবুকে পরিচয়, তিন মাসের যোগাযোগ", zoom: 1, visual: V3 },
  { vo: "btl2vo/04.mp3", voLen: VO_LEN[3], label: "পুলিশ", headline: "সম্পৃক্ততা নিশ্চিত হবে জিজ্ঞাসাবাদের পর", zoom: 1, visual: V4 },
  { vo: "btl2vo/05.mp3", voLen: VO_LEN[4], label: "কুমিল্লা", headline: "আদালতে দায় স্বীকার অটোরিকশাচালক সুমনের", zoom: 1, visual: V5 },
  { vo: "btl2vo/06.mp3", voLen: VO_LEN[5], label: "সংবাদ", headline: "স্কুলছাত্রী হত্যা মামলার তদন্ত চলছে", zoom: 0.4, visual: V6 },
];
const TICKER = [
  "কুমিল্লায় স্কুলছাত্রী হত্যা: কক্সবাজার থেকে কথিত প্রেমিক আটক",
  "আদালতে দায় স্বীকার অটোরিকশাচালক সুমনের",
  "রাজুর সম্পৃক্ততা জিজ্ঞাসাবাদের পর নিশ্চিত হবে: পুলিশ",
  "কালারস অব বাংলাদেশ — বাংলাদেশের রঙে সংবাদ, গল্প ও জীবন",
];
export const COMILLA_LEN = storyLen(SEGMENTS);
export const ComillaArrest: React.FC = () => (
  <NewsStory segments={SEGMENTS} ticker={TICKER} date="১২ অক্টোবর ২০২৬" music="btlmusic.mp3" tagline="বাংলাদেশের রঙে সংবাদ, গল্প ও জীবন" outro={Outro} theme={COB_THEME} />
);
