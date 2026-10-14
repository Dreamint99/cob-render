// Colours of Bangladesh (COB) অনুসন্ধান — "অনলাইন জুয়া: ৪ বছরে ৬,১৪৪ কোটি টাকার লেনদেন" (12 Oct 2026).
// Facts (all credited on screen): BFIU annual report via The Business Standard 4 Oct 2026 (6,222 accounts, Tk6,144cr in / Tk4,349cr out,
// STR 50 (2020) → 1,046 (2024)); CID SS Md Sufi Ullah via TBS (4-stage flow, 0.4–2% commission, 115 arrests Jan–15 Sep, 763 sites/apps,
// masterminds in China/Russia/Malaysia/UAE); GED/Planning Commission survey via TBS (50 lakh+ addicted, 38% young); finance minister via TBS
// (~55,000 MFS accounts frozen); Gambling Prevention Act 2026 passed 30 Jun (Daily Star 24 Jun, Dhaka Times 30 Jun); Bangladesh Pratidin 25 Jun
// (Cumilla expatriate case, unnamed). Only endpoints of the STR series are published, so no intermediate years are drawn.
// Phone/app/domain visuals are generic and labelled "প্রতীকী". Suicide is mentioned without method + 999 help line (reporting guidelines).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { LAND } from "../dots";
import { BN, bn, useSp } from "../news/NewsKit";
import { RED, RED2, INK, MUTE, AMBER, HEAD, T, Grain, Bg, Bug, Source, Card } from "./HoneyTrap";

const GVO = [355, 228, 641, 360, 614, 386, 518, 605, 446, 384, 291];
const GAP = 20;
const STARTS = GVO.reduce<number[]>((a, d, i) => (a.push(i ? a[i - 1] + GVO[i - 1] + GAP : 0), a), []);
export const GAMBLING_LEN = STARTS[STARTS.length - 1] + GVO[GVO.length - 1] + GAP + 30;
const n = (v: number) => bn(Math.round(v).toLocaleString("en-IN"));
const S = (src: string, at: number, vol = 0.5) => <Sequence from={Math.max(0, at)} durationInFrames={150}><Audio src={staticFile(`gambsfx/${src}.mp3`)} volume={vol} /></Sequence>;
const SRC_BFIU = "বিএফআইইউ বার্ষিক প্রতিবেদন · দ্য বিজনেস স্ট্যান্ডার্ড, ৪ অক্টোবর ২০২৬";
const SRC_CID = "সিআইডি (বিশেষ পুলিশ সুপার মো. সুফি উল্লাহ) · দ্য বিজনেস স্ট্যান্ডার্ড, ৪ অক্টোবর ২০২৬";

const Symbolic: React.FC = () => (
  <div style={{ position: "absolute", right: 48, top: 44, fontFamily: BN, fontWeight: 700, fontSize: 24, color: AMBER, border: `2px solid ${AMBER}`, padding: "4px 14px", borderRadius: 6, background: "rgba(0,0,0,.4)" }}>প্রতীকী চিত্র</div>
);
const Head: React.FC<{ text: string; delay?: number; size?: number; color?: string }> = ({ text, delay = 0, size = 64, color = "white" }) => {
  const s = useSp(delay, 15);
  return <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: size, color, lineHeight: 1.15, opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>{text}</div>;
};

// 1 — hook: the number
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const v = T(f, 10, 90, 0, 6144);
  const acc = T(f, 170, 250, 0, 6222);
  const fill = T(f, 170, 280);
  const s2 = useSp(160, 15);
  return (
    <AbsoluteFill>
      <Bg />
      <AbsoluteFill style={{ opacity: 0.22, backgroundImage: `radial-gradient(${RED2} 2px, transparent 2.5px)`, backgroundSize: "18px 18px", clipPath: `inset(${(1 - fill) * 100}% 0 0 0)` }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 40, color: MUTE, opacity: T(f, 0, 12) }}>৪ বছরে জমা</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 230, color: AMBER, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>৳{n(v)}<span style={{ fontSize: 110 }}> কোটি</span></div>
        <div style={{ marginTop: 40, fontFamily: HEAD, fontWeight: 800, fontSize: 72, color: "white", opacity: s2, transform: `translateY(${(1 - s2) * 30}px)` }}>মাত্র <span style={{ color: RED2 }}>{n(acc)}</span>টি অ্যাকাউন্টে</div>
        <div style={{ marginTop: 10, fontFamily: BN, fontSize: 36, color: MUTE, opacity: T(f, 250, 270) }}>ব্যাংক ও মোবাইল ব্যাংকিং · অনলাইন জুয়ার সঙ্গে যুক্ত</div>
      </AbsoluteFill>
      <Source text={SRC_BFIU} />
      {S("coins", 10, 0.45)}{S("hit", 160, 0.5)}
    </AbsoluteFill>
  );
};

// 2 — title
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(4, 13);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.35)" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ transform: `scale(${s})`, opacity: s }}><Img src={staticFile("cob/logo-round.png")} style={{ height: 220 }} /></div>
        <div style={{ marginTop: 26, fontFamily: BN, fontWeight: 700, fontSize: 34, color: "white", background: RED, padding: "6px 26px", borderRadius: 6, opacity: T(f, 14, 26) }}>অনুসন্ধান</div>
        <div style={{ marginTop: 24 }}><Head text="অনলাইন জুয়া" delay={24} size={160} /></div>
        <div style={{ marginTop: 10 }}><Head text="মোবাইলের পর্দায় নিঃশব্দে পাচার হচ্ছে হাজার কোটি টাকা" delay={60} size={50} color={MUTE} /></div>
      </AbsoluteFill>
      {S("hit", 2, 0.6)}
    </AbsoluteFill>
  );
};

// 3 — the BFIU numbers: in vs out, suspicious reports 2020 vs 2024
const Bar: React.FC<{ label: string; v: number; max: number; at: number; color: string; unit: string }> = ({ label, v, max, at, color, unit }) => {
  const f = useCurrentFrame();
  const p = T(f, at, at + 50);
  return (
    <div style={{ marginBottom: 36, opacity: T(f, at - 6, at + 6) }}>
      <div style={{ fontFamily: BN, fontSize: 32, color: MUTE }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ height: 70, width: (760 * v * p) / max, background: color, borderRadius: 6 }} />
        <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: "white", fontVariantNumeric: "tabular-nums" }}>৳{n(v * p)}<span style={{ fontSize: 34, color: MUTE }}> {unit}</span></span>
      </div>
    </div>
  );
};
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const a = T(f, 390, 440, 0, 50), b = T(f, 520, 590, 0, 1046);
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", left: 100, top: 170 }}><Head text="বিএফআইইউ-র হিসাব · ২০২০–২০২৪" size={58} /></div>
      <div style={{ position: "absolute", left: 100, top: 320 }}>
        <Bar label="জমা হয়েছে" v={6144} max={6144} at={150} color={AMBER} unit="কোটি" />
        <Bar label="তোলা হয়েছে" v={4349} max={6144} at={290} color={RED} unit="কোটি" />
      </div>
      <div style={{ position: "absolute", right: 110, top: 300, width: 600, height: 520, borderLeft: "2px solid rgba(255,255,255,.15)", paddingLeft: 50, opacity: T(f, 370, 385) }}>
        <div style={{ fontFamily: BN, fontSize: 32, color: MUTE }}>সন্দেহজনক লেনদেনের রিপোর্ট</div>
        <div style={{ position: "absolute", left: 50, right: 0, bottom: 0, top: 70, display: "flex", alignItems: "flex-end", gap: 90 }}>
          {[["২০২০", a, 50], ["২০২৪", b, 1046]].map(([y, v]) => (
            <div key={y as string} style={{ textAlign: "center", width: 170 }}>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: "white" }}>{n(v as number)}</div>
              <div style={{ height: Math.max(6, ((v as number) / 1046) * 330), background: y === "২০২৪" ? RED2 : MUTE, borderRadius: 6 }} />
              <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 34, color: MUTE, marginTop: 10 }}>{y}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", right: 120, top: 210, fontFamily: HEAD, fontWeight: 800, fontSize: 54, color: RED2, opacity: T(f, 590, 605) }}>২১ গুণ ↑</div>
      <Source text={SRC_BFIU} />
      {S("tick", 150, 0.4)}{S("tick", 290, 0.4)}{S("tick", 390, 0.4)}{S("hit", 590, 0.45)}
    </AbsoluteFill>
  );
};

// 4 — the trap on the phone (generic, labelled)
const Reel: React.FC<{ at: number; i: number }> = ({ at, i }) => {
  const f = useCurrentFrame();
  const sym = ["৭", "★", "৳", "♦"];
  const spin = f >= at && f < at + 40 + i * 10;
  return <div style={{ width: 110, height: 130, borderRadius: 14, background: "#0e171c", border: "2px solid rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 80, color: AMBER, filter: spin ? "blur(3px)" : "none" }}>{spin ? sym[(f + i) % 4] : "৭"}</div>;
};
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const enter = useSp(0, 16);
  const pills: [string, number][] = [["সামাজিক মাধ্যমের বিজ্ঞাপন", 60], ["বোনাসের লোভ", 120], ["বন্ধুর রেফার", 165], ["স্লট", 215], ["ফিশিং গেম", 240], ["লাইভ ক্যাসিনো", 265]];
  return (
    <AbsoluteFill>
      <Bg tint="rgba(255,176,32,.18)" />
      <div style={{ position: "absolute", left: 1150, top: 110, width: 460, height: 880, borderRadius: 54, background: "#05080a", border: "10px solid #1e2a30", overflow: "hidden", transform: `translateY(${(1 - enter) * 200}px)`, opacity: enter, boxShadow: "0 50px 120px rgba(0,0,0,.6)" }}>
        <div style={{ padding: "60px 26px 0", fontFamily: BN, color: "white" }}>
          <div style={{ padding: "18px 20px", borderRadius: 18, background: `linear-gradient(135deg, ${RED}, #7a0f1d)`, fontFamily: HEAD, fontWeight: 800, fontSize: 40, textAlign: "center", transform: `scale(${1 + Math.sin(f / 6) * 0.03})` }}>১০০% বোনাস!</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 40 }}>{[0, 1, 2].map((i) => <Reel key={i} at={215} i={i} />)}</div>
          <div style={{ marginTop: 40, padding: "16px 20px", borderRadius: 16, background: "#1f6f4a", fontSize: 28, fontWeight: 700, textAlign: "center" }}>মাত্র ১০০ টাকায় শুরু করুন</div>
          <div style={{ marginTop: 20, fontSize: 24, color: MUTE, textAlign: "center" }}>বিকাশ / নগদে ডিপোজিট</div>
        </div>
        <div style={{ position: "absolute", left: 20, right: 20, top: 20, padding: "14px 18px", borderRadius: 16, background: "rgba(255,255,255,.95)", color: INK, fontFamily: BN, fontWeight: 600, fontSize: 22, transform: `translateY(${T(f, 165, 180, -140, 0)}px)` }}>🔔 বন্ধু রেফার করেছে: ৫০০ টাকা বোনাস</div>
      </div>
      <div style={{ position: "absolute", left: 100, top: 200, width: 900 }}>
        <Head text="ফাঁদ শুরু হয় মোবাইল থেকে" size={70} />
        <div style={{ marginTop: 40, display: "flex", flexWrap: "wrap", gap: 18 }}>
          {pills.map(([t, d], i) => {
            const s = spring({ frame: f - d, fps: 30, config: { damping: 13 } });
            return <div key={t} style={{ fontFamily: BN, fontWeight: 700, fontSize: 36, color: i < 3 ? "white" : INK, background: i < 3 ? "rgba(255,255,255,.08)" : AMBER, border: "1px solid rgba(255,255,255,.18)", padding: "10px 24px", borderRadius: 999, transform: `scale(${s})`, opacity: s }}>{t}</div>;
          })}
        </div>
        <div style={{ marginTop: 50, fontFamily: HEAD, fontWeight: 800, fontSize: 56, color: AMBER, opacity: T(f, 300, 315) }}>কয়েকশ টাকা দিয়েই শুরু</div>
      </div>
      <Symbolic />
      {S("slot", 215, 0.5)}{S("tick", 60, 0.3)}{S("tick", 120, 0.3)}{S("tick", 165, 0.3)}
    </AbsoluteFill>
  );
};

// 5 — four-stage money flow
const NODES: [string, string, number, string][] = [
  ["জুয়াড়ি", "মোবাইল ব্যাংকিংয়ে টাকা পাঠান", 90, "👥"],
  ["স্থানীয় এজেন্ট", "কমিশন ০.৪–২%", 200, "📱"],
  ["সুপার এজেন্ট", "ডিজিটাল হুন্ডি · ক্রিপ্টো", 380, "💻"],
  ["মূল হোতা", "দেশের বাইরে", 500, "❓"],
];
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const X = [230, 720, 1210, 1700], Y = 560;
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", left: 100, top: 170 }}><Head text="টাকা যায় চার ধাপে" size={70} /></div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {[0, 1, 2].map((i) => {
          const p = T(f, NODES[i + 1][2] - 20, NODES[i + 1][2] + 10);
          return <line key={i} x1={X[i] + 110} y1={Y} x2={X[i] + 110 + (X[i + 1] - X[i] - 220) * p} y2={Y} stroke={i === 2 ? RED2 : AMBER} strokeWidth={6} strokeDasharray="14 10" strokeDashoffset={-f * 2} />;
        })}
        {[0, 1, 2].flatMap((i) => [0, 1, 2].map((k) => {
          const on = f > NODES[i + 1][2] + 10;
          const t = ((f * 0.02 + k / 3) % 1);
          return on ? <circle key={`${i}${k}`} cx={X[i] + 110 + (X[i + 1] - X[i] - 220) * t} cy={Y} r={11} fill={i === 2 ? RED2 : AMBER} /> : null;
        }))}
      </svg>
      {NODES.map(([t, sub, d, ic], i) => {
        const s = spring({ frame: f - d, fps: 30, config: { damping: 13 } });
        return (
          <div key={t} style={{ position: "absolute", left: X[i] - 160, top: Y - 110, width: 320, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", opacity: s, transform: `scale(${0.7 + 0.3 * s})` }}>
            <div style={{ width: 220, height: 220, borderRadius: 999, background: i === 3 ? "rgba(224,20,43,.25)" : "rgba(14,23,28,.95)", border: `4px solid ${i === 3 ? RED2 : i === 0 ? MUTE : AMBER}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90 }}>{ic}</div>
            <div style={{ marginTop: 18, fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: "white", whiteSpace: "nowrap" }}>{bn(i + 1)}. {t}</div>
            <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 28, color: i === 3 ? RED2 : MUTE }}>{sub}</div>
          </div>
        );
      })}
      <Source text={SRC_CID} />
      {NODES.map(([, , d]) => <React.Fragment key={d}>{S("glitch", d, 0.4)}</React.Fragment>)}
    </AbsoluteFill>
  );
};

// 6 — where the masterminds are (per investigators)
const proj = (lat: number, lng: number): [number, number] => [((lng - 30) / 100) * 1920, ((66 - lat) / 72) * 1080];
const PLACES: [string, number, number, number][] = [["চীন", 35.8, 104.2, 40], ["রাশিয়া", 58, 82, 75], ["মালয়েশিয়া", 3.1, 101.7, 110], ["আমিরাত", 24.4, 54.4, 140]];
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const BD = proj(23.7, 90.4);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.15)" />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {LAND.map(([la, lo], i) => { const [x, y] = proj(la, lo); return x > -10 && x < 1930 && y > -10 && y < 1090 ? <circle key={i} cx={x} cy={y} r={6} fill="rgba(255,255,255,.1)" /> : null; })}
        {PLACES.map(([name, la, lo, d]) => {
          const P = proj(la, lo);
          const path = `M ${BD[0]} ${BD[1]} Q ${(BD[0] + P[0]) / 2} ${Math.min(BD[1], P[1]) - 140} ${P[0]} ${P[1]}`;
          const p = T(f, d, d + 40);
          const ev = evolvePath(p, path);
          const pt = getPointAtLength(path, Math.max(0.1, p * getLength(path)));
          return (
            <g key={name}>
              <path d={path} stroke={RED2} strokeWidth={4} fill="none" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
              {p > 0 && <circle cx={pt.x} cy={pt.y} r={8} fill={AMBER} />}
              {p >= 1 && <><circle cx={P[0]} cy={P[1]} r={12} fill={RED} stroke="white" strokeWidth={3} /><text x={P[0] + 18} y={P[1] - 14} fontFamily={HEAD} fontWeight={800} fontSize={40} fill="white">{name}</text></>}
            </g>
          );
        })}
        <circle cx={BD[0]} cy={BD[1]} r={14} fill="#006a4e" stroke="white" strokeWidth={4} />
        <text x={BD[0] - 70} y={BD[1] + 52} fontFamily={HEAD} fontWeight={800} fontSize={34} fill="white">বাংলাদেশ</text>
      </svg>
      <div style={{ position: "absolute", left: 100, top: 170 }}><Head text="চক্র চলে বিদেশ থেকে" size={66} /></div>
      <div style={{ position: "absolute", left: 100, bottom: 130, display: "flex", flexDirection: "column", gap: 16 }}>
        <Card delay={200} style={{ fontSize: 36, fontWeight: 700 }}>স্থানীয় এজেন্টরাও জানেন না মূল হোতা কে</Card>
        <Card delay={290} style={{ fontSize: 32, fontWeight: 600 }}>যোগাযোগ: টেলিগ্রাম · হোয়াটসঅ্যাপ</Card>
      </div>
      <Source text="তদন্তকারীদের ভাষ্য (সিআইডি) · দ্য বিজনেস স্ট্যান্ডার্ড, ৪ অক্টোবর ২০২৬" />
      {PLACES.map(([, , , d]) => <React.Fragment key={d}>{S("tick", d, 0.35)}</React.Fragment>)}
    </AbsoluteFill>
  );
};

// 7 — human cost
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const v = T(f, 100, 170, 0, 50);
  const lit = Math.round(T(f, 220, 290, 0, 38));
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", left: 100, top: 170 }}><Head text="এর মূল্য দিচ্ছে মানুষ" size={66} /></div>
      <div style={{ position: "absolute", left: 100, top: 300 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 170, color: AMBER, lineHeight: 1 }}>{n(v)} লাখ+</div>
        <div style={{ fontFamily: BN, fontSize: 38, color: "white", opacity: T(f, 120, 140) }}>মানুষ জুয়ায় আসক্ত</div>
        <div style={{ marginTop: 30, display: "grid", gridTemplateColumns: "repeat(20, 34px)", gap: 8, opacity: T(f, 200, 215) }}>
          {Array.from({ length: 100 }).map((_, i) => <div key={i} style={{ width: 34, height: 34, borderRadius: 99, background: i < lit ? RED2 : "rgba(255,255,255,.12)" }} />)}
        </div>
        <div style={{ marginTop: 16, fontFamily: HEAD, fontWeight: 800, fontSize: 52, color: RED2, opacity: T(f, 260, 280) }}>{bn(lit)}% তরুণ</div>
      </div>
      <div style={{ position: "absolute", right: 110, top: 330, width: 640 }}>
        <Card delay={330} style={{ borderLeft: `6px solid ${RED}` }}>
          <div style={{ fontFamily: BN, fontSize: 28, color: MUTE }}>কুমিল্লা · জুন ২০২৬</div>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 48, lineHeight: 1.2, marginTop: 8 }}>এক প্রবাসী ১৫ দিনে হারান ২২ লাখ টাকা</div>
          <div style={{ fontFamily: BN, fontSize: 28, color: MUTE, marginTop: 10 }}>পরে তাঁর আত্মহত্যার খবর প্রকাশিত হয়</div>
        </Card>
        <div style={{ marginTop: 24, fontFamily: BN, fontWeight: 700, fontSize: 30, color: "white", opacity: T(f, 400, 420) }}>বিপদে থাকলে কথা বলুন · জরুরি সহায়তা: ৯৯৯</div>
      </div>
      <Source text="পরিকল্পনা কমিশনের জিইডি জরিপ (টিবিএস) · বাংলাদেশ প্রতিদিন, ২৫ জুন ২০২৬" />
      {S("tick", 100, 0.3)}{S("hit", 330, 0.4)}
    </AbsoluteFill>
  );
};

// 8 — enforcement in numbers
const Tile: React.FC<{ at: number; v: number; label: string; sub: string }> = ({ at, v, label, sub }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at, fps: 30, config: { damping: 14 } });
  return (
    <div style={{ flex: 1, padding: "34px 36px", borderRadius: 18, background: "rgba(14,23,28,.92)", border: "1px solid rgba(255,255,255,.12)", opacity: s, transform: `translateY(${(1 - s) * 60}px)` }}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 110, color: AMBER, lineHeight: 1 }}>{n(T(f, at, at + 50, 0, v))}</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 42, color: "white", marginTop: 10 }}>{label}</div>
      <div style={{ fontFamily: BN, fontSize: 26, color: MUTE, marginTop: 6 }}>{sub}</div>
    </div>
  );
};
const S8: React.FC = () => (
  <AbsoluteFill>
    <Bg tint="rgba(23,120,90,.18)" />
    <div style={{ position: "absolute", left: 100, top: 170 }}><Head text="অভিযানও চলছে" size={66} /></div>
    <div style={{ position: "absolute", left: 100, right: 100, top: 330, display: "flex", gap: 30 }}>
      <Tile at={60} v={115} label="গ্রেপ্তার" sub="জানুয়ারি–১৫ সেপ্টেম্বর · চীনা নাগরিকসহ (সিআইডি)" />
      <Tile at={250} v={763} label="সাইট ও অ্যাপ" sub="বন্ধের অনুরোধ বিটিআরসিতে (সিআইডি)" />
      <Tile at={420} v={55000} label="এমএফএস অ্যাকাউন্ট" sub="জব্দ বা স্থগিত · সংসদে অর্থমন্ত্রী" />
    </div>
    <Source text="সিআইডি ও অর্থমন্ত্রীর বক্তব্য · দ্য বিজনেস স্ট্যান্ডার্ড" />
    {S("tick", 60, 0.4)}{S("tick", 250, 0.4)}{S("tick", 420, 0.4)}
  </AbsoluteFill>
);

// 9 — the new law
const LAW: [string, string, number][] = [["অনলাইন বেটিং", "৭ বছর · ৫ কোটি টাকা", 120], ["অনলাইন জুয়া", "৫ বছর · ১ কোটি টাকা", 200], ["বিজ্ঞাপন ও প্রচার (ইনফ্লুয়েন্সারসহ)", "৩ বছর · ৫০ লাখ টাকা", 300]];
const S9: React.FC = () => {
  const f = useCurrentFrame();
  const stamp = spring({ frame: f - 40, fps: 30, config: { damping: 10 } });
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", left: 100, top: 170, width: 1720, padding: "40px 56px", borderRadius: 14, background: "#f4efe4", color: INK, boxShadow: "0 40px 100px rgba(0,0,0,.5)", transform: `translateY(${T(f, 0, 20, 80, 0)}px)`, opacity: T(f, 0, 12) }}>
        <div style={{ fontFamily: BN, fontSize: 30, color: "#666" }}>গণপ্রজাতন্ত্রী বাংলাদেশ · জাতীয় সংসদ</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 76 }}>জুয়া প্রতিরোধ আইন, ২০২৬</div>
        <div style={{ position: "absolute", right: 60, top: 40, transform: `rotate(-10deg) scale(${interpolate(stamp, [0, 1], [2.2, 1])})`, opacity: stamp, border: `6px solid ${RED}`, color: RED, fontFamily: BN, fontWeight: 700, fontSize: 40, padding: "6px 20px", borderRadius: 10 }}>পাস · ৩০ জুন ২০২৬</div>
        <div style={{ marginTop: 26 }}>
          {LAW.map(([k, v, d]) => {
            const s = spring({ frame: f - d, fps: 30, config: { damping: 15 } });
            return (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", borderTop: "2px solid rgba(0,0,0,.1)", opacity: s, transform: `translateX(${(1 - s) * 40}px)` }}>
                <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 40 }}>{k}</span>
                <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 44, color: RED }}>সর্বোচ্চ {v}</span>
              </div>
            );
          })}
        </div>
      </div>
      <Source text="দ্য ডেইলি স্টার, ২৪ জুন ২০২৬ · ঢাকা টাইমস, ৩০ জুন ২০২৬" />
      {S("hit", 40, 0.45)}
    </AbsoluteFill>
  );
};

// 10 — the open questions
const S10: React.FC = () => {
  const f = useCurrentFrame();
  const doms = ["jua-site.com", "jua-site2.net", "jua-site-new.xyz"];
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.3)" />
      <div style={{ position: "absolute", left: 100, top: 170 }}><Head text="প্রশ্ন থেকেই যায়" size={70} /></div>
      <div style={{ position: "absolute", left: 100, top: 330, display: "flex", flexDirection: "column", gap: 20 }}>
        {doms.map((d, i) => {
          const at = 40 + i * 45;
          const s = spring({ frame: f - at, fps: 30, config: { damping: 14 } });
          const x = f > at + 35 && i < 2;
          return (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 20, opacity: s, transform: `translateX(${(1 - s) * -60}px)` }}>
              <span style={{ fontFamily: "Montserrat", fontWeight: 700, fontSize: 40, color: x ? MUTE : "white", textDecoration: x ? `line-through ${RED2} 5px` : "none" }}>{d}</span>
              <span style={{ fontFamily: BN, fontWeight: 700, fontSize: 30, color: x ? RED2 : AMBER }}>{x ? "বন্ধ" : i === 2 ? "আবার চালু" : ""}</span>
            </div>
          );
        })}
        <div style={{ fontFamily: BN, fontSize: 26, color: AMBER, opacity: T(f, 40, 52) }}>ডোমেইনগুলো প্রতীকী</div>
      </div>
      <div style={{ position: "absolute", right: 110, top: 330, width: 700, display: "flex", flexDirection: "column", gap: 20 }}>
        <Card delay={150} style={{ fontSize: 38, fontWeight: 700 }}>এজেন্টরা বদলায় নম্বর</Card>
        <Card delay={200} style={{ fontSize: 38, fontWeight: 700, borderLeft: `6px solid ${RED}` }}>মূল হোতারা দেশের বাইরে</Card>
        <Card delay={260} style={{ fontSize: 32, fontWeight: 600 }}>নতুন আইনে ব্যাপক নজরদারি ক্ষমতা, স্বাধীন তদারকির ব্যবস্থা নেই — বিশ্লেষকদের প্রশ্ন</Card>
      </div>
      <Source text="দ্য বিজনেস স্ট্যান্ডার্ড, ৪ অক্টোবর · দ্য ডেইলি স্টার, ২৪ জুন ২০২৬" />
      {S("glitch", 40, 0.4)}{S("glitch", 85, 0.4)}{S("glitch", 130, 0.4)}
    </AbsoluteFill>
  );
};

// 11 — close
const S11: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(4, 13);
  return (
    <AbsoluteFill>
      <Bg tint="rgba(224,20,43,.25)" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ transform: `scale(${s})` }}><Img src={staticFile("cob/logo-round.png")} style={{ height: 200 }} /></div>
        <div style={{ marginTop: 20, fontFamily: BN, fontWeight: 700, fontSize: 34, color: "white", background: RED, padding: "6px 26px", borderRadius: 6 }}>অনুসন্ধান</div>
        <div style={{ marginTop: 40 }}><Head text="জুয়ার ফাঁদে পড়লে লুকাবেন না, পরিবারের সঙ্গে কথা বলুন" delay={60} size={54} /></div>
        <div style={{ marginTop: 20, fontFamily: HEAD, fontWeight: 800, fontSize: 96, color: AMBER, opacity: T(f, 150, 165) }}>জরুরি সহায়তা: ৯৯৯</div>
        <div style={{ marginTop: 40, fontFamily: BN, fontSize: 24, color: MUTE, maxWidth: 1500, opacity: T(f, 170, 190) }}>সূত্র: বিএফআইইউ বার্ষিক প্রতিবেদন, সিআইডি, পরিকল্পনা কমিশন (জিইডি), দ্য বিজনেস স্ট্যান্ডার্ড, দ্য ডেইলি স্টার, ঢাকা টাইমস, বাংলাদেশ প্রতিদিন</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11];
const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, 10, len - 10, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
};
export const Gambling: React.FC = () => {
  const f = useCurrentFrame();
  const end = STARTS[STARTS.length - 1] + GVO[GVO.length - 1] + GAP;
  return (
    <AbsoluteFill style={{ background: INK }}>
      {SCENES.map((Sc, i) => (
        <Sequence key={i} from={STARTS[i]} durationInFrames={GVO[i] + GAP + 10}>
          <Fade len={GVO[i] + GAP + 10}><Sc /></Fade>
          <Sequence from={6}><Audio src={staticFile(`gambvo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
        </Sequence>
      ))}
      {f > STARTS[2] && f < STARTS[10] && <Bug />}
      <Grain />
      <Audio src={staticFile("gambmusic.mp3")} volume={(fr) => (STARTS.some((s0, i) => fr >= s0 + 6 && fr < s0 + 6 + GVO[i]) ? 0.17 : 0.3) * interpolate(fr, [0, 15, end - 30, end + 30], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};
