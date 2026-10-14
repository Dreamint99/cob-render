// Story: রিয়াদ বিমানবন্দর বন্ধ — আরও ১৮ ফ্লাইট বাতিল, শাহজালালে আটকা ৪৮৫১ যাত্রী (12 Oct 2026).
// Facts: Bangla Tribune 12 Oct 2026 (CAAB press info). Footage: AI-generated illustrative clip supplied by the owner,
// slowed 0.5x with motion interpolation — always labelled on screen as AI-made, never presented as real footage.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BN, bn, clamp, ease, useSp, NewsStory, Segment, storyLen, COB_THEME } from "../NewsKit";

const RED = "#c7081e", PINK = "#ff5a68";
const Footage: React.FC<{ at: number }> = ({ at }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <OffthreadVideo src={staticFile("flight/slow.mp4")} startFrom={Math.round(at * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <div style={{ position: "absolute", right: 24, top: 96, padding: "6px 14px", borderRadius: 6, background: "rgba(0,0,0,.6)", border: "1px solid rgba(255,255,255,.25)", fontFamily: BN, fontWeight: 600, fontSize: 24, color: "white" }}>প্রতীকী ভিডিও · এআই দিয়ে তৈরি</div>
  </AbsoluteFill>
);
const Card: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const s = useSp(delay, 14);
  return <div style={{ padding: "22px 34px", borderRadius: 20, background: "rgba(14,23,28,.92)", border: "2px solid rgba(255,255,255,.15)", boxShadow: "0 30px 70px rgba(0,0,0,.5)", fontFamily: BN, color: "white", transform: `translateY(${(1 - s) * 80}px)`, opacity: s, ...style }}>{children}</div>;
};
const bg = "radial-gradient(1200px 700px at 70% 30%, rgba(199,8,30,.35), transparent 60%), linear-gradient(160deg,#1d2f38,#0b1317)";

const V1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Footage at={0} />
      <div style={{ position: "absolute", left: 70, top: 160 }}>
        <Card delay={40}><div style={{ fontSize: 28, color: PINK, fontWeight: 700 }}>শাহজালালে আটকা</div><div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.1 }}>{bn(Math.round(interpolate(f, [45, 110], [0, 4851], { ...clamp, easing: ease })).toLocaleString("en-IN"))}</div><div style={{ fontSize: 34, opacity: 0.85 }}>যাত্রী</div></Card>
      </div>
    </AbsoluteFill>
  );
};
const V2: React.FC = () => {
  const f = useCurrentFrame();
  const A = [1380, 560], B = [470, 470];
  const d = `M ${A[0]} ${A[1]} Q ${(A[0] + B[0]) / 2} 160 ${B[0]} ${B[1]}`;
  const p = interpolate(f, [10, 90], [0, 1], { ...clamp, easing: ease });
  const x = interpolate(f, [100, 120], [0, 1], clamp);
  const n = Math.round(interpolate(f, [150, 220], [10, 28], clamp));
  return (
    <AbsoluteFill style={{ background: bg }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <path d={d} stroke="rgba(255,255,255,.85)" strokeWidth={6} fill="none" pathLength={1} strokeDasharray={`${p} 1`} />
        {[A, B].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={18} fill={i ? RED : "white"} stroke="white" strokeWidth={4} />)}
        <g transform={`translate(${B[0]} ${B[1]}) scale(${x})`} opacity={x}><circle r={70} fill="rgba(199,8,30,.25)" stroke={PINK} strokeWidth={5} /><path d="M-34 -34 L34 34 M34 -34 L-34 34" stroke={PINK} strokeWidth={12} strokeLinecap="round" /></g>
      </svg>
      <div style={{ position: "absolute", left: A[0] - 120, top: A[1] + 40 }}><Card delay={6} style={{ padding: "14px 26px" }}><div style={{ fontSize: 44, fontWeight: 700 }}>ঢাকা</div><div style={{ fontSize: 24, opacity: 0.7 }}>শাহজালাল বিমানবন্দর</div></Card></div>
      <div style={{ position: "absolute", left: B[0] - 160, top: B[1] + 90 }}><Card delay={100} style={{ padding: "14px 26px", border: `2px solid ${PINK}` }}><div style={{ fontSize: 44, fontWeight: 700 }}>রিয়াদ · বন্ধ</div><div style={{ fontSize: 24, opacity: 0.75 }}>কিং খালেদ বিমানবন্দর</div></Card></div>
      <div style={{ position: "absolute", right: 120, top: 150, textAlign: "right", fontFamily: BN, color: "white", opacity: interpolate(f, [140, 160], [0, 1], clamp) }}>
        <div style={{ fontSize: 34, opacity: 0.8 }}>মোট বাতিল ফ্লাইট</div>
        <div style={{ fontSize: 170, fontWeight: 700, lineHeight: 1, color: PINK }}>{bn(n)}</div>
        <div style={{ fontSize: 30, opacity: 0.8 }}>আগে ১০ + আজ আরও ১৮</div>
      </div>
    </AbsoluteFill>
  );
};
const AIR: [string, number][] = [["ইন্ডিগো", 16], ["বাংলাদেশ বিমান", 4], ["সৌদি এয়ারলাইনস", 3], ["রিয়াদ এয়ার", 3], ["ইউএস-বাংলা", 2]];
const V3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bg }}>
      <div style={{ position: "absolute", left: 140, top: 150, fontFamily: BN, fontWeight: 700, fontSize: 60, color: "white" }}>কোন এয়ারলাইনের কতটি ফ্লাইট বাতিল</div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 290 }}>
        {AIR.map(([k, v], i) => {
          const at = [20, 95, 140, 165, 220][i], p = interpolate(f, [at, at + 30], [0, 1], { ...clamp, easing: ease });
          return (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "360px 1fr 90px", alignItems: "center", gap: 24, marginBottom: 30, fontFamily: BN, color: "white" }}>
              <span style={{ fontSize: 42, fontWeight: 700 }}>{k}</span>
              <div style={{ height: 46, borderRadius: 10, background: "rgba(255,255,255,.08)" }}><div style={{ width: `${(v / 16) * 100 * p}%`, height: "100%", borderRadius: 10, background: i === 0 ? `linear-gradient(90deg, ${RED}, ${PINK})` : "linear-gradient(90deg,#5f7682,#cfd8dd)" }} /></div>
              <span style={{ fontSize: 52, fontWeight: 700, textAlign: "right", opacity: p }}>{bn(v)}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
const V4: React.FC = () => (
  <AbsoluteFill>
    <Footage at={9.4} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,19,23,.9) 0%, rgba(11,19,23,.55) 55%, transparent 85%)" }} />
    <div style={{ position: "absolute", left: 90, top: 260, width: 1000, fontFamily: BN, color: "white", opacity: useSp(10, 14) }}>
      <div style={{ fontSize: 140, lineHeight: 0.6, color: PINK, fontFamily: "Georgia, serif" }}>“</div>
      <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.3 }}>রিয়াদ বিমানবন্দর চালু হলে পরবর্তী পদক্ষেপ নেওয়া হবে</div>
      <div style={{ marginTop: 20, fontSize: 32, color: PINK }}>— বেবিচক</div>
    </div>
  </AbsoluteFill>
);
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(4, 12);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #24343c, #0b1317 65%)", justifyContent: "center", alignItems: "center", fontFamily: BN, color: "white" }}>
      <Img src={staticFile("cob/logo-round.png")} style={{ width: 420, transform: `scale(${s})`, filter: "drop-shadow(0 20px 60px rgba(199,8,30,.5))" }} />
      <div style={{ marginTop: 26, fontSize: 50, fontWeight: 700, opacity: interpolate(f, [20, 35], [0, 1], clamp) }}>বাংলাদেশের রঙে সংবাদ, গল্প ও জীবন</div>
      <div style={{ position: "absolute", bottom: 50, fontSize: 26, opacity: 0.7 }}>তথ্যসূত্র: বাংলা ট্রিবিউন, বেবিচক · ভিডিও: প্রতীকী, এআই দিয়ে তৈরি</div>
    </AbsoluteFill>
  );
};
const VO_LEN = [363, 337, 289, 306];
const SEGMENTS: Segment[] = [
  { vo: "flightvo/01.mp3", voLen: VO_LEN[0], label: "ব্রেকিং", headline: "রিয়াদ বিমানবন্দর বন্ধ: আরও ১৮ ফ্লাইট বাতিল, শাহজালালে আটকা ৪৮৫১ যাত্রী", zoom: 1, visual: V1, breaking: true },
  { vo: "flightvo/02.mp3", voLen: VO_LEN[1], label: "বিমানবন্দর", headline: "হুথিদের হামলায় বন্ধ রিয়াদের কিং খালেদ বিমানবন্দর", zoom: 1, visual: V2 },
  { vo: "flightvo/03.mp3", voLen: VO_LEN[2], label: "ফ্লাইট", headline: "সবচেয়ে বেশি বাতিল ইন্ডিগোর ১৬টি ফ্লাইট", zoom: 1, visual: V3 },
  { vo: "flightvo/04.mp3", voLen: VO_LEN[3], label: "বেবিচক", headline: "রিয়াদ চালু হলে পরবর্তী পদক্ষেপ: বেবিচক", zoom: 1, visual: V4 },
];
const TICKER = [
  "রিয়াদ বিমানবন্দর বন্ধ: ঢাকা থেকে মোট ২৮ ফ্লাইট বাতিল",
  "শাহজালাল বিমানবন্দরে আটকা ৪,৮৫১ যাত্রী",
  "ইন্ডিগো ১৬, বিমান ৪, সৌদিয়া ৩, রিয়াদ এয়ার ৩, ইউএস-বাংলা ২",
  "কালারস অব বাংলাদেশ — বাংলাদেশের রঙে সংবাদ, গল্প ও জীবন",
];
export const FLIGHT_LEN = storyLen(SEGMENTS);
export const FlightCancel: React.FC = () => (
  <NewsStory segments={SEGMENTS} ticker={TICKER} date="১২ অক্টোবর ২০২৬" music="btlmusic.mp3" tagline="বাংলাদেশের রঙে সংবাদ, গল্প ও জীবন" outro={Outro} theme={COB_THEME} />
);
